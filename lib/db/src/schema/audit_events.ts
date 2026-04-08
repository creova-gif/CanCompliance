import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const auditEvents = pgTable("audit_events", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  action: text("action").notNull(),
  module: text("module"),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type AuditEvent = typeof auditEvents.$inferSelect;
export type InsertAuditEvent = typeof auditEvents.$inferInsert;
