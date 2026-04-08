import { Router } from "express";
import { db } from "@workspace/db";
import { conversations as conversationsTable, messages as messagesTable, auditEvents } from "@workspace/db";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { eq, and } from "drizzle-orm";
import {
  CreateAnthropicConversationBody,
  SendAnthropicMessageBody,
  GetAnthropicConversationParams,
  DeleteAnthropicConversationParams,
  ListAnthropicMessagesParams,
  SendAnthropicMessageParams,
} from "@workspace/api-zod";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

const CANADA_COMPLIANCE_SYSTEM_PROMPT = `You are CanCompliance AI — a specialized Canadian compliance assistant powered by Claude. You are an expert in all major Canadian federal and provincial regulatory frameworks.

Your expertise includes:
- CASL (Canada's Anti-Spam Legislation) — email consent, unsubscribe requirements, CEM rules
- PIPEDA (Personal Information Protection and Electronic Documents Act) — privacy obligations
- Bill 96 (Charter of the French Language amendments) — Quebec language requirements
- Employment Standards Act (Ontario and other provinces) — minimum wage, leaves, termination
- WSIB/WCB — workers compensation registration and premiums
- CRA Payroll — T4s, remittances, deductions, source withholdings
- Bill S-211 — Modern Slavery Act supply chain reporting
- CARM — CBSA Assessment and Revenue Management

Response format:
1. Answer the question directly and clearly
2. Always cite the specific statute section (e.g., "CASL S.11(1)", "PIPEDA Schedule 1, Principle 8")
3. Include the maximum penalty where relevant
4. Provide a concrete, actionable next step
5. End every response with: "⚠️ This is general compliance information, not legal advice. Consult a qualified Canadian lawyer for your specific situation."

Be precise, professional, and helpful. SMB owners are counting on you to help them avoid costly fines.`;

router.get("/anthropic/conversations", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const conversations = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, userId))
    .orderBy(conversationsTable.createdAt);
  res.json(conversations);
});

router.post("/anthropic/conversations", requireAuth, async (req, res) => {
  const parseResult = CreateAnthropicConversationBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const userId = (req as any).userId;
  const [conversation] = await db
    .insert(conversationsTable)
    .values({ title: parseResult.data.title, userId })
    .returning();

  await db.insert(auditEvents).values({
    userId,
    action: "conversation_created",
    module: "ai_copilot",
    details: { conversationId: conversation.id, title: parseResult.data.title },
  });

  res.status(201).json(conversation);
});

router.get("/anthropic/conversations/:id", requireAuth, async (req, res) => {
  const params = GetAnthropicConversationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const userId = (req as any).userId;
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, params.data.id), eq(conversationsTable.userId, userId)));
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, params.data.id))
    .orderBy(messagesTable.createdAt);
  res.json({ ...conversation, messages });
});

router.delete("/anthropic/conversations/:id", requireAuth, async (req, res) => {
  const params = DeleteAnthropicConversationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const userId = (req as any).userId;
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, params.data.id), eq(conversationsTable.userId, userId)));
  if (!conversation) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await db.delete(messagesTable).where(eq(messagesTable.conversationId, params.data.id));
  await db.delete(conversationsTable).where(eq(conversationsTable.id, params.data.id));

  await db.insert(auditEvents).values({
    userId,
    action: "conversation_deleted",
    module: "ai_copilot",
    details: { conversationId: params.data.id },
  });

  res.status(204).send();
});

router.get("/anthropic/conversations/:id/messages", requireAuth, async (req, res) => {
  const params = ListAnthropicMessagesParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const userId = (req as any).userId;
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, params.data.id), eq(conversationsTable.userId, userId)));
  if (!conversation) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, params.data.id))
    .orderBy(messagesTable.createdAt);
  res.json(messages);
});

router.post("/anthropic/conversations/:id/messages", requireAuth, async (req, res) => {
  const params = SendAnthropicMessageParams.safeParse({ id: Number(req.params.id) });
  const bodyParse = SendAnthropicMessageBody.safeParse(req.body);

  if (!params.success || !bodyParse.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const conversationId = params.data.id;
  const userContent = bodyParse.data.content;
  const userId = (req as any).userId;

  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, conversationId), eq(conversationsTable.userId, userId)));
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  await db.insert(messagesTable).values({
    conversationId,
    role: "user",
    content: userContent,
  });

  await db.insert(auditEvents).values({
    userId,
    action: "ai_message_sent",
    module: "ai_copilot",
    details: { conversationId, contentLength: userContent.length },
  });

  const priorMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(messagesTable.createdAt);

  const chatMessages = priorMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: CANADA_COMPLIANCE_SYSTEM_PROMPT,
    messages: chatMessages,
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      fullResponse += event.delta.text;
      res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
    }
  }

  await db.insert(messagesTable).values({
    conversationId,
    role: "assistant",
    content: fullResponse,
  });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
