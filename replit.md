# Workspace

## Overview

**CanCompliance v2** — a full-stack Canadian compliance SaaS web app for SMBs. 13 compliance modules with live score engine, CASL consent ledger, audit trail, deadlines calendar, jurisdiction intelligence, and control mapper. Full security hardening: Clerk auth, user-scoped DB persistence, CORS/rate limiting, privacy policy, AI consent gate, and PIPEDA-compliant data rights.

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS v4, shadcn/ui, lucide-react
- **AI**: Anthropic Claude Sonnet via Replit AI Integrations (SSE streaming)
- **Auth**: Clerk (dev key auto-provisioned by Replit)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## CanCompliance App Architecture

### Artifacts
- `artifacts/cancompliance` — React+Vite frontend, served at `/cancompliance`
- `artifacts/api-server` — Express API backend on port 8080

### Frontend Pages (artifacts/cancompliance/src/pages/)

**Public routes (no auth required):**
- `Landing.tsx` — Hero, URL scanner (live CASL/PIPEDA scan demo with "Demo Simulation" badge), stats, features, testimonials, CTA
- `Pricing.tsx` — 4-tier pricing (Free / Starter / Professional / Agency) with monthly/annual toggle
- `PrivacyPolicy.tsx` — PIPEDA-compliant privacy policy, discloses Anthropic cross-border transfer

**Protected routes (Clerk auth required):**
- `Dashboard.tsx` — Overview with daily digest, metrics, recent checks, streak tracker, quick actions
- `CaslChecker.tsx` — CASL compliance form with yes/no questions + result box with statute citation
- `PipedaChecker.tsx` — PIPEDA form with 4 questions + result box
- `Bill96Checker.tsx` — Quebec language law form + result box
- `AiCopilot.tsx` — SSE-streaming Claude Sonnet chat with conversation history; `AiConsentGate` shown before first use (localStorage key: `cancompliance_ai_consent_v1`)
- `ComplianceScore.tsx` — Animated SVG ring chart, per-module breakdown, certificate modal
- `Growth.tsx` — Shareable certificate, website badge embed code, referral program
- `Account.tsx` — PIPEDA data rights: export all data as JSON + account deletion with confirmation
- Plus 9 more compliance module pages: CCPSA, CPLA, Fintrac, ESG, SupplyChain, Payroll, GstHst, Employment, Privacy, Safety, Customs, AiGovernance, EPR

### Frontend Components (artifacts/cancompliance/src/components/)
- `AppLayout.tsx` — Sidebar navigation with user avatar/email/sign-out, Privacy Policy link in header, Upgrade button
- `OnboardingModal.tsx` — 4-step onboarding: province, business type, live CASL demo, score result
- `AiConsentGate.tsx` — Consent gate for AI Copilot: must accept before first use

### Auth (Clerk)
- `ClerkProvider` wraps the entire app with dev key from `VITE_CLERK_PUBLISHABLE_KEY`
- `HomeRoute` uses `useAuth()`: signed-in → redirect `/dashboard`, signed-out → show `Landing`
- `ProtectedRoute` uses `useAuth()`: signed-out → redirect `/sign-in`, signed-in → render component
- Sign-in at `/sign-in`, sign-up at `/sign-up`
- `forceRedirectUrl` after auth: `/cancompliance/dashboard`

### Backend Routes (artifacts/api-server/src/routes/)
- `compliance.ts` — CASL, PIPEDA, Bill 96 logic; URL scanner returns `isDemo: true` flag; compliance checks user-scoped + persisted to DB with audit trail
- `anthropic/index.ts` — SSE streaming chat with Canadian compliance system prompt; conversations and messages user-scoped by Clerk `userId`; rate limited (15 req/min)
- Auth middleware: `clerkMiddleware()` + `requireAuth` on protected endpoints
- Rate limiting: 15 req/min for AI routes, 120 req/min general
- CORS: `credentials: true, origin: true` (cookies for Clerk sessions)

### Database (lib/db/src/)
- Tables: `conversations` (userId FK), `messages`, `compliance_checks` (userId, module, result, audit), `audit_events` (userId, action, resource, metadata)

### Design Rules
- **Critical**: `bg-primary` Tailwind does NOT render. Always use `style={{ background: "#c8f135", color: "#09090a" }}` for filled primary buttons
- Dark-only app (background `#09090a`)
- Accent: `#c8f135` (lime-green primary)
- Fonts: Manrope (sans), IBM Plex Mono (mono), Instrument Serif (serif)
- No emojis — use lucide-react icons only
- `data-testid` on all interactive elements

### URL Scanner Note
The URL scanner in `Landing.tsx` is a demo simulation (`isDemo: true` returned from API). Results show a "Demo Simulation" amber badge next to "Scan Results" heading. The `ScanUrlResult` type includes `isDemo: boolean` field.
