import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const complianceChecks = pgTable("compliance_checks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  module: text("module").notNull(),
  province: text("province"),
  status: text("status").notNull(),
  score: integer("score").notNull(),
  title: text("title").notNull(),
  statute: text("statute").notNull(),
  remediation: text("remediation").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type InsertComplianceCheck = typeof complianceChecks.$inferInsert;
