import { Router } from "express";
import { createHash, randomBytes } from "crypto";
import { db, apiKeys } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

function generateKey(): { raw: string; prefix: string; hash: string } {
  const raw = `cc_live_${randomBytes(24).toString("hex")}`;
  const prefix = raw.substring(0, 16);
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, prefix, hash };
}

// List all API keys for the current user
router.get("/developer/keys", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const keys = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)))
      .orderBy(desc(apiKeys.createdAt));

    const sanitized = keys.map(k => ({
      id: k.id,
      name: k.name,
      keyPrefix: k.keyPrefix,
      scopes: k.scopes,
      callCount: k.callCount,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    }));

    res.json({ keys: sanitized });
  } catch (err) {
    res.status(500).json({ error: "Failed to list API keys" });
  }
});

// Generate a new API key
router.post("/developer/keys", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { name, scopes } = req.body;

    if (!name || typeof name !== "string" || name.length < 1) {
      res.status(400).json({ error: "Key name is required" });
      return;
    }

    const { raw, prefix, hash } = generateKey();
    const scopeStr = Array.isArray(scopes) ? scopes.join(",") : "casl,pipeda,fintrac,gdpr,hipaa";

    const [inserted] = await db
      .insert(apiKeys)
      .values({
        userId,
        name: name.trim().substring(0, 64),
        keyPrefix: prefix,
        keyHash: hash,
        scopes: scopeStr,
        isActive: true,
      })
      .returning();

    res.json({
      id: inserted.id,
      name: inserted.name,
      keyPrefix: inserted.keyPrefix,
      scopes: inserted.scopes,
      createdAt: inserted.createdAt,
      rawKey: raw, // only returned once
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate API key" });
  }
});

// Revoke an API key
router.delete("/developer/keys/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const keyId = parseInt(req.params.id, 10);

    if (isNaN(keyId)) {
      res.status(400).json({ error: "Invalid key ID" });
      return;
    }

    await db
      .update(apiKeys)
      .set({ isActive: false, revokedAt: new Date() })
      .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to revoke API key" });
  }
});

export default router;
