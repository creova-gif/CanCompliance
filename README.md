# CanCompliance

**AI-assisted compliance scanning for Canadian businesses — CASL, privacy, and Quebec French-language requirements, checked automatically.**

[![Status](https://img.shields.io/badge/status-active_development-yellow)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

---

## What this is

CanCompliance scans a business's public-facing communications and website against specific Canadian regulatory requirements and flags gaps before a regulator does. It currently checks against:

- **CASL** (Canada's Anti-Spam Legislation) — commercial electronic message rules: unsubscribe mechanisms, express consent, and related requirements
- **Quebec French-language requirements** (Charter of the French Language / Bill 96) — French-language website content, labelling, and contract requirements for businesses serving Quebec
- **Privacy basics** — privacy policy presence, named privacy officer, consent handling, and data access rights

On top of the automated checks, there's an AI research layer (Anthropic + OpenAI, RAG-backed against a seeded compliance knowledge base) so a user can ask follow-up questions in plain language instead of just reading a pass/fail report.

This is genuinely useful, substantive product logic — not a demo. It deserved better documentation than it had.

---

## Core Features

- **Automated CASL check** — evaluates unsubscribe compliance, consent handling, and commercial-email rules
- **Quebec French-language check** — flags missing French labels, French website content, and French contract requirements for Quebec-facing businesses
- **Privacy policy audit** — checks for policy presence, privacy officer designation, and data access rights language
- **AI compliance assistant** — RAG-powered chat grounded in a CASL/privacy knowledge base, for follow-up questions beyond the automated scan
- **Enforcement tracking** — a live ticker surfacing recent enforcement actions for context
- **Predictive alerts** — flags emerging risk areas before they become a finding
- **Authenticated + public views** — a public-facing marketing/onboarding layer and a separate authenticated app for ongoing monitoring

> **Compliance/regulatory context note:** this tool *checks for* CASL, Quebec language law, and privacy-policy compliance — it is not itself a substitute for legal advice, and that distinction should be explicit in the product's own UI/ToS if it isn't already.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, shadcn/ui components |
| Backend | Node.js + Express |
| Auth | Clerk |
| Database / ORM | Drizzle ORM (Postgres) |
| AI | Anthropic + OpenAI, RAG over a seeded compliance knowledge base |
| Monorepo tooling | pnpm workspaces |
| Logging | Pino |

---

## Project Structure

```
CanCompliance/
├── artifacts/
│   ├── api-server/          # Express backend
│   │   └── src/
│   │       ├── routes/      # compliance.ts, rag.ts, anthropic/, openai/, health.ts
│   │       ├── middlewares/ # clerkProxyMiddleware, requireAuth
│   │       └── data/        # knowledge-base.ts — seeded CASL/privacy content
│   └── cancompliance/       # React frontend
│       └── src/
│           ├── components/  # EnforcementTicker, PredictiveAlerts, ResultCard, etc.
│           ├── AppLayout.tsx     (authenticated)
│           └── PublicLayout.tsx  (public-facing)
```

---

## Getting Started (Local Dev)

### Prerequisites
- Node.js 18+
- **pnpm** (this repo enforces pnpm — npm/yarn installs are blocked by a preinstall check)
- A Postgres database
- Clerk account (auth)
- Anthropic and/or OpenAI API keys (AI assistant features)

### Installation

```bash
git clone https://github.com/creova-gif/CanCompliance.git
cd CanCompliance
pnpm install
```

### Environment Variables

No `.env.example` currently exists in the repo — this is the first thing to add. At minimum, based on the code, you'll need:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (Drizzle) |
| `CLERK_SECRET_KEY` / `CLERK_PUBLISHABLE_KEY` | Auth |
| `ANTHROPIC_API_KEY` | AI compliance assistant |
| `OPENAI_API_KEY` | AI compliance assistant |

### Running locally

```bash
pnpm run build
pnpm run typecheck
```
(Confirm exact dev-server command per package — the workspace root script currently only defines `build` and `typecheck`; a `dev` script should be added for local iteration if one doesn't already exist per-package.)

---

## Roadmap / Status

- [x] CASL automated check logic
- [x] Quebec French-language check logic
- [x] Privacy policy audit logic
- [x] AI RAG assistant over compliance knowledge base
- [ ] `.env.example` for onboarding new developers
- [ ] LICENSE file (currently declared as MIT in `package.json` metadata but no actual `LICENSE` file exists at the repo root — worth resolving one way or the other)
- [ ] Public documentation of what "compliance checked" actually covers, for legal clarity with end users

---

## Contributing

This is a private, proprietary CREOVA product. External contributions are not accepted at this time.

## License

`package.json` currently declares `"license": "MIT"`, but no `LICENSE` file exists at the repo root — this is inconsistent and should be resolved explicitly (see LICENSE template provided separately).

## Credits

Built by CREOVA. Product lead: Justin Mafie.
