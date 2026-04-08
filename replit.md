# Workspace

## Overview

**CanCompliance** — a full-stack Canadian compliance SaaS web app for SMBs.

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

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## CanCompliance App Architecture

### Artifacts
- `artifacts/cancompliance` — React+Vite frontend, served at `/`
- `artifacts/api-server` — Express API backend on port 8080

### Frontend Pages (artifacts/cancompliance/src/pages/)
- `Landing.tsx` — Hero, URL scanner (live CASL/PIPEDA scan), stats, features, testimonials, CTA
- `Dashboard.tsx` — Overview with daily digest, metrics, recent checks, streak tracker, quick actions, paywall toast (3s delay)
- `CaslChecker.tsx` — CASL compliance form with yes/no questions + result box with statute citation
- `PipedaChecker.tsx` — PIPEDA form with 4 questions + result box
- `Bill96Checker.tsx` — Quebec language law form + result box
- `AiCopilot.tsx` — SSE-streaming Claude Sonnet chat with conversation history (raw fetch + ReadableStream)
- `ComplianceScore.tsx` — Animated SVG ring chart, per-module breakdown, certificate modal
- `Growth.tsx` — Shareable certificate, website badge embed code, referral program
- `Pricing.tsx` — 4-tier pricing (Free / Starter / Professional / Agency) with monthly/annual toggle

### Frontend Components (artifacts/cancompliance/src/components/)
- `AppLayout.tsx` — Sidebar navigation, header with Upgrade button, main content area
- `OnboardingModal.tsx` — 4-step onboarding: province, business type, live CASL demo, score result

### Backend Routes (artifacts/api-server/src/routes/)
- `compliance.ts` — CASL, PIPEDA, Bill 96 logic with statute citations and penalty amounts
- `anthropic/index.ts` — SSE streaming chat with Canadian compliance system prompt, conversation/message CRUD

### Database (lib/db/src/)
- Tables: `conversations`, `messages` (Drizzle schema)

### Design
- Dark-only app (`--background: 50 10% 5%`)
- Accent: `hsl(74 91% 61%)` ≈ #d4f542 (yellow-green primary)
- Fonts: Manrope (sans), IBM Plex Mono (mono), Instrument Serif (serif)
