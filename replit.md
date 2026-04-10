# Workspace

## Overview

**CanCompliance v5.0** — a full-stack Canadian + global compliance SaaS web app for SMBs. **21 Canadian compliance modules** (including CPPA/Bill C-27, AODA, Beneficial Ownership, Digital Platform/CRA DAC-7, Pay Equity) + 6 global frameworks (SOC 2, ISO 27001, GDPR, HIPAA, NIST AI RMF, EU AI Act). Universal control library (50 controls), frameworks hub, risk heat map dashboard, and multi-framework cross-control mapping. Role-based tool sections: Compliance Officer (Policy Attestation, Vendor Risk, Board Report), Auditor (Finding Tracker, Evidence Portal), Business Owner (Industry Pack, Fine Exposure Calculator, Scale Advisor, Grant Finder). Full security hardening: Clerk auth, user-scoped DB persistence, CORS/rate limiting, privacy policy, AI consent gate, and PIPEDA-compliant data rights.

**v5.0 Intelligence Layer (7 features fully implemented):**
1. **Compliance Inbox** — 8 real regulatory updates (CRTC $1.1M CASL fine, CPPA Senate reading, BC Pay Transparency, Quebec Law 25 audits, etc.), filterable by tag/jurisdiction/severity, email subscription, links to modules
2. **Trust Network** — B2B compliance proof requests from suppliers via email, trust profile builds as you run passing checks, network score, verified badge pills, viral loop mechanic
3. **Red Tape Calculator** — 5 inputs (size/industry/province/revenue/hourly rate), 7-category breakdown bar chart per CFIB data, 735-hr national average, 35% red-tape-specific cost, "CanCompliance can save you" savings card, LinkedIn/X share
4. **Legislation Tracker** — 12 real Canadian bills (C-27, C-26, C-63, AIDA, BC Pay Transparency, S-209, Solomon AI Bill, C-244, more), filterable by category, readiness scoring panel (6 critical bills with % readiness bars)
5. **Compliance Benchmarking** — Score vs. national/industry/province averages, percentile rank, module breakdown bars, score distribution histogram, network-wide pass rates (CASL 48%, PIPEDA 44%), 6 most common violations by sector
6. **Document Scanner** — Claude Sonnet AI with Canadian compliance system prompt, paste-and-audit any contract/policy/agreement, structured violation report with statute citations and penalty quantification, audit trail logging
7. **Government Partnership Hub** — 9 programs (OSFI FinTech Sandbox, FCAC Pilot, CRI $1.7M fund, CFIB Partnership, BizPaL Integration, CRA API, Regulators' Capacity Fund $3.8M, Ontario Red Tape Challenge, BC Better Regulation Office), eligibility checker

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

**Intelligence tools (sidebar section "Intelligence"):**
- `RedTapeCalculator.tsx` — Quantify compliance cost by industry/province/size; CFIB-methodology hours + dollar estimate; category breakdown; reduction actions
- `LegislationTracker.tsx` — 8 tracked Canadian bills (C-27/CPPA, C-26/CCSPA, C-63, AIDA, S-211 expansion, Bill C-59, Law 25, WHMIS); status/risk badges; expandable detail with action steps; "Watch" button
- `DocumentScanner.tsx` — Claude-powered contract/policy audit via SSE; flags CASL, PIPEDA/Law 25, employment standards, greenwashing, S-211; sample contracts included; structured finding output with statute citations
- `Benchmarking.tsx` — Anonymous sector/province compliance score comparison; module breakdown vs. sector average; provincial context; sector intelligence insights
- `SandboxAdvisor.tsx` — 6 government programs tracked (OSFI sandbox, FCAC pilot, CRI fund, CFIB partnership, BizPaL, CRA API); eligibility checker by sector/revenue/stage; expandable how-to-apply details

**Dashboard additions:**
- Intelligence row (5 cards): Legislation Tracker, Red Tape Calculator, Document Scanner, Benchmarking, Gov. Sandboxes

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
