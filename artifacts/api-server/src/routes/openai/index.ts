import { Router } from "express";
import { db } from "@workspace/db";
import { conversations as conversationsTable, messages as messagesTable, auditEvents } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

const CANADA_COMPLIANCE_SYSTEM_PROMPT = `You are CanCompliance AI — a specialized Canadian compliance assistant. You are an expert in all major Canadian federal and provincial regulatory frameworks.

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

router.post("/openai/conversations/:id/messages", requireAuth, async (req, res) => {
  const convId = Number(req.params.id);
  if (isNaN(convId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { content } = req.body;
  if (!content || typeof content !== "string") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const userId = (req as any).userId;

  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, convId), eq(conversationsTable.userId, userId)));

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  await db.insert(messagesTable).values({ conversationId: convId, role: "user", content });

  await db.insert(auditEvents).values({
    userId,
    action: "ai_message_sent",
    module: "ai_copilot_gpt",
    details: { conversationId: convId, contentLength: content.length },
  });

  const priorMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, convId))
    .orderBy(messagesTable.createdAt);

  const chatMessages = priorMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: CANADA_COMPLIANCE_SYSTEM_PROMPT },
      ...chatMessages,
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      fullResponse += delta;
      res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
    }
  }

  await db.insert(messagesTable).values({ conversationId: convId, role: "assistant", content: fullResponse });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
