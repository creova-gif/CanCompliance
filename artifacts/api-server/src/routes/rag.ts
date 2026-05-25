import { Router } from "express";
import { db } from "@workspace/db";
import {
  knowledgeChunks,
  userDocuments,
  documentChunks,
  auditEvents,
} from "@workspace/db";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { KNOWLEDGE_BASE } from "../data/knowledge-base";
import { z } from "zod";

const router = Router();

/* ── seed knowledge base on first request ─────────────────────────────── */
let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  const [existing] = await db.select({ id: knowledgeChunks.id }).from(knowledgeChunks).limit(1);
  if (existing) { seeded = true; return; }
  await db.insert(knowledgeChunks).values(KNOWLEDGE_BASE);
  seeded = true;
}

/* ── helpers ──────────────────────────────────────────────────────────── */
function chunkText(text: string, size = 600, overlap = 80): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size - overlap;
  }
  return chunks;
}

async function searchKnowledge(query: string, limit = 5): Promise<Array<{ source: string; title: string; content: string }>> {
  await ensureSeeded();
  // Full-text search with PostgreSQL plainto_tsquery (handles multi-word naturally)
  const rows = await db.execute(sql`
    SELECT source, title, content,
      ts_rank(to_tsvector('english', title || ' ' || content),
              plainto_tsquery('english', ${query})) AS rank
    FROM knowledge_chunks
    WHERE to_tsvector('english', title || ' ' || content) @@
          plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `);
  if (!rows.rows.length) {
    // Fallback: return top chunks by recency (query had no FTS match)
    const fallback = await db.select({ source: knowledgeChunks.source, title: knowledgeChunks.title, content: knowledgeChunks.content })
      .from(knowledgeChunks).limit(3);
    return fallback;
  }
  return rows.rows as Array<{ source: string; title: string; content: string }>;
}

async function searchDocumentChunks(userId: string, documentId: number, query: string, limit = 5): Promise<Array<{ content: string; chunkIndex: number }>> {
  const rows = await db.execute(sql`
    SELECT content, chunk_index,
      ts_rank(to_tsvector('english', content),
              plainto_tsquery('english', ${query})) AS rank
    FROM document_chunks
    WHERE user_id = ${userId} AND document_id = ${documentId}
      AND to_tsvector('english', content) @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `);
  if (!rows.rows.length) {
    // Fallback: return first N chunks in order
    const fallback = await db.select({ content: documentChunks.content, chunkIndex: documentChunks.chunkIndex })
      .from(documentChunks)
      .where(and(eq(documentChunks.userId, userId), eq(documentChunks.documentId, documentId)))
      .limit(3);
    return fallback;
  }
  return rows.rows as Array<{ content: string; chunkIndex: number }>;
}

export function buildRagContext(chunks: Array<{ source?: string; title?: string; content: string }>): string {
  if (!chunks.length) return "";
  const lines = chunks.map((c, i) => {
    const label = c.title ? `[${i + 1}] ${c.title} (${c.source ?? "document"})` : `[${i + 1}]`;
    return `${label}\n${c.content}`;
  });
  return `\n\n--- RETRIEVED KNOWLEDGE (use these to ground your answer) ---\n${lines.join("\n\n")}\n--- END KNOWLEDGE ---`;
}

/* ── GET /api/rag/status ──────────────────────────────────────────────── */
router.get("/rag/status", requireAuth, async (_req, res) => {
  await ensureSeeded();
  const [{ count }] = await db.execute(sql`SELECT COUNT(*) as count FROM knowledge_chunks`) as any;
  res.json({ seeded: true, chunkCount: Number(count?.count ?? 0) });
});

/* ── POST /api/rag/search ─────────────────────────────────────────────── */
router.post("/rag/search", requireAuth, async (req, res) => {
  const body = z.object({ query: z.string().min(1).max(500) }).safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid query" }); return; }
  const results = await searchKnowledge(body.data.query, 6);
  res.json({ results });
});

/* ── GET /api/rag/documents ───────────────────────────────────────────── */
router.get("/rag/documents", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const docs = await db.select().from(userDocuments).where(eq(userDocuments.userId, userId));
  res.json(docs);
});

/* ── POST /api/rag/documents ──────────────────────────────────────────── */
router.post("/rag/documents", requireAuth, async (req, res) => {
  const body = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(10).max(200000),
  }).safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid document data" }); return; }

  const userId = (req as any).userId;
  const chunks = chunkText(body.data.content);

  const [doc] = await db.insert(userDocuments).values({
    userId,
    title: body.data.title,
    content: body.data.content,
    chunkCount: String(chunks.length),
  }).returning();

  await db.insert(documentChunks).values(
    chunks.map((c, i) => ({ documentId: doc.id, userId, content: c, chunkIndex: i }))
  );

  await db.insert(auditEvents).values({
    userId,
    action: "document_uploaded",
    module: "document_library",
    details: { documentId: doc.id, title: doc.title, chunks: chunks.length },
  });

  res.status(201).json({ ...doc, chunkCount: chunks.length });
});

/* ── DELETE /api/rag/documents/:id ───────────────────────────────────── */
router.delete("/rag/documents/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const userId = (req as any).userId;
  const [doc] = await db.select().from(userDocuments).where(and(eq(userDocuments.id, id), eq(userDocuments.userId, userId)));
  if (!doc) { res.status(404).json({ error: "Not found" }); return; }
  await db.delete(userDocuments).where(eq(userDocuments.id, id));
  res.status(204).send();
});

/* ── POST /api/rag/documents/:id/chat ────────────────────────────────── */
router.post("/rag/documents/:id/chat", requireAuth, async (req, res) => {
  const docId = Number(req.params.id);
  const body = z.object({ message: z.string().min(1).max(2000) }).safeParse(req.body);
  if (!body.success || !docId) { res.status(400).json({ error: "Invalid request" }); return; }

  const userId = (req as any).userId;

  const [doc] = await db.select().from(userDocuments)
    .where(and(eq(userDocuments.id, docId), eq(userDocuments.userId, userId)));
  if (!doc) { res.status(404).json({ error: "Document not found" }); return; }

  const [docChunks, kbChunks] = await Promise.all([
    searchDocumentChunks(userId, docId, body.data.message),
    searchKnowledge(body.data.message, 3),
  ]);

  const docContext = buildRagContext(docChunks.map(c => ({ content: c.content, title: `${doc.title} (chunk ${c.chunkIndex + 1})` })));
  const kbContext = buildRagContext(kbChunks);

  const systemPrompt = `You are CanCompliance AI — a specialized Canadian compliance assistant. A user is asking questions about a document they uploaded titled "${doc.title}".

Answer questions ONLY based on the retrieved document content and knowledge base below. If the answer is not in the retrieved content, say so clearly. Always cite which chunk or knowledge source you are drawing from.

${docContext}${kbContext}

Always include relevant Canadian statute citations where applicable. End with a disclaimer if giving legal interpretation.`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send sources metadata first
  const sources = [
    ...docChunks.map((c, i) => ({ type: "document", label: `${doc.title} — chunk ${c.chunkIndex + 1}` })),
    ...kbChunks.map(c => ({ type: "knowledge", label: `${c.title}` })),
  ];
  res.write(`data: ${JSON.stringify({ sources })}\n\n`);

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: body.data.message }],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
    }
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

/* ── POST /api/rag/copilot-context ───────────────────────────────────── */
// Used internally by AI Copilot to retrieve RAG context for a query
router.post("/rag/copilot-context", requireAuth, async (req, res) => {
  const body = z.object({ query: z.string().min(1).max(500) }).safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid query" }); return; }
  const chunks = await searchKnowledge(body.data.query, 5);
  res.json({ context: buildRagContext(chunks), sources: chunks.map(c => ({ source: c.source, title: c.title })) });
});

export { searchKnowledge, buildRagContext as buildContext };
export default router;
