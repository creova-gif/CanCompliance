# CanCompliance — Product Requirements Document
**Version:** 5.0  
**Date:** May 2026  
**Status:** Active Development  
**Owner:** Product Team

---

## 1. Executive Summary

CanCompliance is a full-stack Canadian compliance SaaS platform purpose-built for small and medium businesses (SMBs). It eliminates the need for external compliance consultants by providing automated checks, AI-powered guidance, and audit-ready evidence across 21 Canadian regulatory frameworks and 6 global standards — all in a single, role-aware workspace.

**Core value proposition:** A Canadian SMB can go from "I don't know if I'm compliant" to "I have a board-ready compliance report with statute citations" in under 10 minutes.

---

## 2. Problem Statement

### 2.1 The Compliance Gap
Canadian SMBs face an escalating regulatory burden:
- **735 hours/year** average time spent on regulatory compliance (CFIB data)
- **$10M maximum fine** for a single CASL violation
- **$100,000/day** AODA corporate fine for inaccessible websites
- **$25M or 4% of global revenue** under CPPA (Bill C-27, in force)
- Most SMBs lack in-house legal or compliance expertise

### 2.2 The Market Gap
Existing solutions are either:
- **Too expensive** — enterprise GRC platforms (OneTrust, ServiceNow GRC) cost $50,000–$500,000/year
- **Too narrow** — point solutions covering one regulation only
- **Too complex** — require compliance specialists to operate
- **US-centric** — don't cover Canadian-specific laws (CASL, PIPEDA, Quebec Law 25, AODA, Pay Equity)

### 2.3 The Opportunity
- **1.2M+ Canadian SMBs** with 1–499 employees are the addressable market
- **$4.2B** Canadian compliance services market (2025)
- Regulatory burden increasing: CPPA Senate reading, AODA enforcement tightening, CRA DAC-7 reporting
- No dominant Canadian-first compliance SaaS player below enterprise price point

---

## 3. Product Vision

> "CanCompliance becomes the compliance operating system for every Canadian SMB — the single source of truth for regulatory standing, evidence, and remediation."

**3-year vision:** Every new Canadian SMB signs up before their first hire. Compliance status is shared with banks, investors, and enterprise customers as a trust signal. The CanCompliance Trust Badge becomes a recognized Canadian business credential.

---

## 4. Target Users

### 4.1 Primary Personas

#### Persona A — The Compliance Officer (Enterprise)
- **Company size:** 50–500 employees
- **Role:** Dedicated compliance, legal, or risk manager
- **Pain:** Manually tracking 15+ regulations across spreadsheets; audit prep takes weeks
- **Goals:** Automated evidence collection, board-ready reporting, policy sign-off tracking
- **Key tools:** Policy Attestation, Vendor Risk, Board Report, Monitoring Center, AI Remediation

#### Persona B — The Auditor (External or Internal)
- **Company size:** Any (external auditor serves multiple clients)
- **Role:** Internal audit, external accountant/lawyer reviewing compliance
- **Pain:** Collecting evidence from clients takes days; no structured audit trail
- **Goals:** Centralized evidence portal, finding tracker, clean audit trail with timestamps
- **Key tools:** Finding Tracker, Evidence Portal, Audit Trail, Integrations Hub, Document Scanner

#### Persona C — The Business Owner (SMB Founder/CEO)
- **Company size:** 1–49 employees
- **Role:** Owner or founder wearing multiple hats
- **Pain:** Doesn't know which regulations apply; scared of fines but no time to research
- **Goals:** "Am I compliant?" in 5 minutes; know the fine exposure; find grants
- **Key tools:** Industry Pack, Fine Exposure Calculator, Scale Advisor, Grant Finder, CASL/PIPEDA Checker

### 4.2 Secondary Personas

#### Persona D — The Developer/CTO
- **Goal:** API access to compliance data; integrate checks into CI/CD
- **Key tools:** Developer Portal (API), AI Remediation (code fixes), Document Scanner

#### Persona E — The HR/People Ops Manager
- **Goal:** Ensure workforce is trained; onboarding/offboarding is legally compliant
- **Key tools:** Workforce Compliance, Policy Attestation

---

## 5. Goals & Success Metrics

### 5.1 Business Goals
| Goal | Target | Timeframe |
|------|--------|-----------|
| Monthly Active Users (MAU) | 10,000 | 12 months |
| Paying customers | 500 | 12 months |
| Monthly Recurring Revenue (MRR) | $50,000 | 18 months |
| NPS | ≥ 50 | 6 months |
| Churn rate | < 5%/month | Ongoing |

### 5.2 Engagement Metrics
| Metric | Target |
|--------|--------|
| Compliance checks run per active user/month | ≥ 8 |
| AI Copilot sessions per user/month | ≥ 3 |
| Dashboard DAU/MAU ratio | ≥ 35% |
| Time-to-first-check (after signup) | < 5 minutes |
| Completion rate of onboarding flow | ≥ 70% |

### 5.3 Quality Metrics
| Metric | Target |
|--------|--------|
| Page load time (P95) | < 2.5s |
| API response time (P95) | < 800ms |
| Uptime | 99.9% |
| WCAG 2.0 AA compliance (own site) | 100% |

---

## 6. Feature Requirements

### 6.1 Core Compliance Modules

#### F-001: CASL Checker
**Priority:** P0  
**Description:** Interactive questionnaire assessing Commercial Electronic Message compliance.  
**Requirements:**
- Yes/no question flow covering consent, identification, and unsubscribe requirements
- Real-time PASS/FLAG/FAIL result with CASL statute citations (s.6, s.10, s.11)
- Fine exposure calculation ($1M individual, $10M corporate)
- Result persisted to user audit trail with timestamp
- Accessible keyboard navigation and screen reader support

#### F-002: PIPEDA Privacy Checker
**Priority:** P0  
**Description:** 10-principle assessment against Canada's federal privacy law.  
**Requirements:**
- 4-question assessment covering accountability, consent, limiting use, safeguards
- Maps answers to PIPEDA Schedule 1 principles
- Flags organizations subject to "substantially similar" provincial laws (Quebec Law 25, BC PIPA, AB PIPA)
- Result includes remediation actions with statute citations

#### F-003: Quebec Bill 96 / Law 25 Checker
**Priority:** P0  
**Description:** Quebec-specific French language and privacy law compliance.  
**Requirements:**
- Separate module for Quebec-specific obligations (French website, privacy policy, documentation)
- Triggers on Quebec province selection or detected .qc.ca domains
- Penalty display: up to $25M or 4% of worldwide turnover (Law 25)

#### F-004: AODA Accessibility Checker
**Priority:** P1  
**Description:** Ontario Accessibility for Ontarians with Disabilities Act compliance checker.  
**Requirements:**
- Employee count gating: 20+ employees triggers WCAG 2.0 AA requirement
- WCAG compliance level selector (None / A / AA / AAA)
- Compliance timeline showing 2012/2014/2021/2025 milestones
- Maximum fine display: $100,000/day corporate, $50,000 individual
- Integration with Website QA Scanner for automated WCAG checks

#### F-005: Additional Canadian Modules (17 modules)
**Priority:** P1–P2  
Modules: FINTRAC/AML, Employment Standards, ESG/Greenwashing, Supply Chain (S-211), Payroll/CRA, GST/HST, Workplace Safety (OHS), Customs, AI Governance (AIDA), EPR/Packaging, CCPSA, CPLA, Beneficial Ownership, Digital Platform/DAC-7, Pay Equity, CPPA/Bill C-27

---

### 6.2 Intelligence Layer

#### F-010: Compliance Inbox
**Priority:** P1  
**Description:** Curated regulatory update feed with Canadian enforcement news.  
**Requirements:**
- Minimum 8 live regulatory updates at launch (real cases: CRTC $1.1M CASL fine, CPPA Senate reading, etc.)
- Filter by: jurisdiction (Federal/Provincial), severity (Critical/High/Medium), category tag
- Email subscription for weekly digest
- Deep-link to relevant compliance module for each update
- New update badge counter in sidebar

#### F-011: Red Tape Calculator
**Priority:** P1  
**Description:** Quantify annual compliance burden in hours and dollars.  
**Requirements:**
- 5 inputs: company size, industry, province, annual revenue, hourly cost of compliance staff
- Output: hours/year breakdown across 7 regulatory categories (based on CFIB methodology)
- National average comparison (735 hours/year benchmark)
- "CanCompliance saves you X hours/year" card with ROI calculation
- LinkedIn/X share cards with calculated savings
- No sign-up required (public tool for lead generation)

#### F-012: Legislation Tracker
**Priority:** P1  
**Description:** Track Canadian bills through Parliament with readiness scoring.  
**Requirements:**
- Minimum 12 bills tracked with real parliamentary status
- Status badges: Royal Assent / Senate 3rd Reading / Committee / Tabled / Proposed
- Readiness scoring panel: 6 critical bills with % readiness bars per user's profile
- Filter by category: Privacy / AI / Anti-Spam / Finance / Accessibility / Trade
- "Watch" toggle per bill (future: email alerts on status change)

#### F-013: Document Scanner
**Priority:** P1  
**Description:** AI-powered contract and policy audit using Claude Sonnet.  
**Requirements:**
- Text paste interface with sample contracts pre-loaded
- Streaming SSE response (real-time character-by-character output)
- System prompt: Canadian compliance specialist with CASL, PIPEDA, Law 25, employment standards expertise
- Structured output: violation by violation with statute citation and penalty estimate
- Audit trail entry created after each scan
- Rate limiting: 15 req/min per user
- AI consent gate shown before first use

#### F-014: Compliance Benchmarking
**Priority:** P2  
**Description:** Anonymous sector and provincial compliance score comparison.  
**Requirements:**
- User's score vs. national average, industry average, provincial average
- Percentile rank (e.g., "Top 23% of Ontario tech companies")
- Module-by-module breakdown bar chart vs. sector average
- Score distribution histogram (network-wide)
- Network-wide pass rates by regulation (e.g., "CASL 48% pass rate nationally")
- 6 most common violations by sector

---

### 6.3 Role-Based Tools

#### F-020: Policy Attestation Engine (Compliance Officer)
**Priority:** P1  
**Requirements:**
- Policy library with CASL, PIPEDA, AODA, AML templates
- Employee sign-off tracking with status indicators (Signed/Pending/Overdue)
- Bulk send attestation requests
- Deadline tracking with automated reminders (future)
- Export attestation report as PDF

#### F-021: Vendor Risk Scorecard (Compliance Officer)
**Priority:** P1  
**Requirements:**
- Vendor entry with data categories and jurisdiction
- Risk scoring across privacy, security, contract, and regulatory dimensions
- Status tracking: Active / Under Review / Approved / Flagged
- PIPEDA data sharing agreement tracking

#### F-022: Board Compliance Report Generator (Compliance Officer)
**Priority:** P1  
**Requirements:**
- One-click generation of board-ready compliance summary
- Sections: Executive Summary, Compliance Score, Module Status, Open Items, Upcoming Deadlines
- Export as formatted report

#### F-023: Finding Tracker (Auditor)
**Priority:** P1  
**Requirements:**
- Create findings with severity, owner, due date, and regulation reference
- Status workflow: Open → In Progress → Pending Verification → Closed
- Filter by severity and status
- Evidence attachment (future: link to Evidence Portal)

#### F-024: Evidence Portal (Auditor)
**Priority:** P1  
**Requirements:**
- Evidence item list with status, type, and expiry date
- Status: Pending Upload / Submitted / Under Review / Accepted / Rejected
- File upload simulation with progress
- Integration link: auto-populated from connected tools (GitHub, AWS, etc.)

#### F-025: Fine Exposure Calculator (Business Owner)
**Priority:** P1  
**Requirements:**
- Module-by-module fine exposure based on company size and jurisdiction
- PASS/FLAG/FAIL status per module with fine amounts
- Total exposure summary (annual risk in CAD)
- Link to relevant compliance module for remediation

#### F-026: Scale Advisor (Business Owner)
**Priority:** P2  
**Requirements:**
- Growth milestone selector: First Hire / 20 Employees / 50 Employees / Incorporated / Quebec Entry / Export
- Per-milestone: triggered regulations, timeline, action items, CFIB resource links

---

### 6.4 Enterprise Platform

#### F-030: Continuous Monitoring Center
**Priority:** P1  
**Description:** Scheduled automated compliance checks across all modules.  
**Requirements:**
- 12 modules on 5-hour scan schedule
- Module Status tab: status table with history sparklines, last/next run times
- Alerts tab: severity-categorized alerts (Critical/High/Medium/Low) with dismiss
- Activity Feed tab: timestamped log of all automated runs and status changes
- "Run All Now" manual trigger with 2.2s simulation
- Unread alert count in sidebar badge

#### F-031: Integrations Hub
**Priority:** P1  
**Description:** Connect cloud and enterprise tools for automated evidence collection.  
**Requirements:**
- 12 integrations: GitHub, AWS, Google Workspace, Slack, Jira, BambooHR, M365, Okta, ServiceNow, DocuSign, Snowflake, Salesforce
- Per-integration: category, description, auto-collected evidence list, connect/sync/disconnect
- Connect flow with 2s async simulation, green connected status indicator
- Category filter: Engineering / Cloud / Productivity / HR / Identity / ITSM / Legal / Data / CRM / Communication
- Evidence count and last sync time for connected integrations
- Stat cards: Connected count, Total evidence items, Coverage %

#### F-032: Workforce Compliance
**Priority:** P1  
**Description:** Security training matrix and onboarding/offboarding compliance checklists.  
**Requirements:**
- Security Training tab: 8 employees × 6 training modules matrix with status and % complete
- Per-employee: completion status per module, send reminder button
- Onboarding Checklist: Canadian statute references (PIPEDA, ESA, PCMLTFA)
- Offboarding Checklist: access revocation, data handling steps
- Progress tracking with completion percentages

#### F-033: AI Remediation Engine
**Priority:** P1  
**Description:** Generate audit-ready code fixes and policy templates for compliance violations.  
**Requirements:**
- 8 violation type templates: CASL consent, PIPEDA breach, AODA keyboard, Cookie compliance, Privacy policy, AML/KYC, Pay equity, AI governance
- Per-violation: multi-tab code output (React/SQL/Policy/Config)
- 1.4s generation animation simulating AI processing
- Copy Fix button per code tab (clipboard + visual "Copied!" confirmation)
- Legal disclaimer: "Review with legal counsel before production deployment"

---

### 6.5 Website QA Scanner

#### F-040: AODA/WCAG Accessibility Auditor
**Priority:** P1  
**Description:** Automated WCAG 2.0 AA accessibility audit for any URL.  
**Requirements:**
- URL input with demo URLs pre-populated
- 11-phase scan simulation with phase labels and progress bar
- Accessibility score (0–100) with ring chart visualization
- Issue breakdown by severity: Critical / High / Medium / Low
- Per-issue: WCAG criterion reference, impact statement, remediation text, code fix with copy button
- AODA compliance status card (Non-Compliant / Partial / Compliant)
- Issues organized by category: Keyboard, Images, Colour, Forms, Focus, Structure, Navigation, Language, ARIA

#### F-041: SEO Auditor
**Priority:** P1  
**Description:** Technical SEO audit covering metadata, structure, performance, and structured data.  
**Requirements:**
- SEO score (0–100) with ring chart
- Issue categories: Metadata, Structure, Performance, Structured Data
- Core Web Vitals LCP assessment
- Schema.org markup detection
- Open Graph tag validation
- Per-issue: impact statement, remediation code fix
- Combined Overview tab with Quick Wins list (highest-impact fixes first)

---

### 6.6 Global Compliance Frameworks

#### F-050: Multi-Framework Hub
**Priority:** P2  
**Requirements:**
- 6 global frameworks: SOC 2, ISO 27001, GDPR, HIPAA, NIST AI RMF, EU AI Act
- Universal control library: 50 controls mapped across frameworks
- Cross-framework control mapping (single control satisfying multiple frameworks)
- Risk heat map dashboard
- Per-framework: control checklist, readiness %, evidence requirements

---

### 6.7 Growth & Monetization

#### F-060: Trust Network
**Priority:** P2  
**Description:** B2B compliance proof sharing and supplier verification.  
**Requirements:**
- Verified badge earned by completing compliance checks
- Outgoing proof request: send compliance proof to suppliers/customers by email
- Incoming request handling: approve/deny compliance proof requests
- Trust score: network-wide signal based on passing checks
- Viral loop: every proof request email drives new signups

#### F-061: Growth Tools
**Priority:** P2  
**Requirements:**
- Shareable compliance certificate (unique URL per user)
- Website badge embed code (shows live compliance status)
- Referral program with unique referral link

---

### 6.8 Developer Platform

#### F-070: Compliance API Portal
**Priority:** P3  
**Requirements:**
- API key generation and management
- Endpoint documentation (CASL, PIPEDA, URL Scanner, AI Copilot)
- Code samples in cURL, Node.js, Python
- Usage dashboard with request counts
- Rate limit display per tier

---

### 6.9 Core Platform

#### F-080: Authentication
**Priority:** P0  
**Requirements:**
- Clerk-powered auth with email/password and Google OAuth
- Demo role bypass sessions (Compliance Officer / Auditor / Business Owner) — no signup required
- Role-based dashboard personalization on first login
- PIPEDA-compliant: user data export as JSON, account deletion

#### F-081: Onboarding Flow
**Priority:** P0  
**Requirements:**
- 4-step modal: Province → Business Type → Live CASL Demo → Compliance Score
- Personalization based on province (Ontario triggers AODA notice, Quebec triggers Law 25 notice)
- Demo session expires on tab close (localStorage)

#### F-082: Dashboard
**Priority:** P0  
**Requirements:**
- Role-personalized pinned tools (different per Compliance Officer / Auditor / Business Owner)
- Daily compliance digest (randomly surfaced from 6 regulatory updates)
- Streak tracker (consecutive days with compliance activity)
- Recent checks table with result and timestamp
- Quick action cards to most-used modules

#### F-083: Compliance Score Engine
**Priority:** P1  
**Requirements:**
- Animated SVG ring chart (0–100 score)
- Per-module breakdown bars showing individual module performance
- Compliance certificate modal (downloadable PNG)
- Score improves as modules are completed with PASS results

---

## 7. Technical Requirements

### 7.1 Architecture
- **Frontend:** React 19 + Vite 7, Tailwind CSS v4, shadcn/ui, TypeScript 5.9
- **Backend:** Express 5, Node.js 24, TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** Clerk (dev key auto-provisioned)
- **AI:** Anthropic Claude Sonnet via Replit AI Integrations (SSE streaming)
- **Monorepo:** pnpm workspaces with TypeScript project references
- **API contract:** OpenAPI spec + Orval codegen for React Query hooks

### 7.2 Security Requirements
- All authenticated routes behind Clerk `requireAuth` middleware
- User-scoped data: all DB queries filtered by `userId` (Clerk)
- Rate limiting: 15 req/min AI routes, 120 req/min general
- CORS: `credentials: true` for cookie-based Clerk sessions
- No secrets in frontend code
- PIPEDA-compliant data handling: export and deletion endpoints

### 7.3 Performance Requirements
- Initial page load: < 2.5s on 4G connection
- AI streaming starts: < 1.5s from request
- Compliance check API: < 500ms response
- No layout shift on navigation
- Code splitting per route

### 7.4 Accessibility Requirements
- WCAG 2.0 Level AA (as required by AODA for 20+ employee organizations)
- All interactive elements keyboard-accessible
- Semantic HTML landmarks
- Sufficient colour contrast (min 4.5:1 for normal text)
- Screen reader support for all form elements

---

## 8. Non-Functional Requirements

### 8.1 Data & Privacy
- All user data stored in Canadian data centres (Neon PostgreSQL)
- AI queries processed via Anthropic (cross-border transfer disclosed in Privacy Policy)
- Data retention: compliance check records kept for 7 years (CRA audit requirement)
- Right to erasure: account deletion removes all user data within 30 days
- PIPEDA-compliant privacy policy publicly accessible

### 8.2 Reliability
- Uptime SLA: 99.9% (scheduled maintenance excluded)
- Automated health checks on all API endpoints
- Graceful degradation: compliance checks function without AI features
- Error boundaries in React prevent full app crashes

### 8.3 Scalability
- Stateless API server (horizontal scaling ready)
- Database connection pooling
- SSE connections limited per user to prevent resource exhaustion

### 8.4 Compliance (of the platform itself)
- CASL-compliant email communications
- PIPEDA-compliant data handling
- AODA-compliant web interface
- SOC 2 Type II target (Year 2 roadmap)

---

## 9. Pricing & Monetization

| Tier | Price | Target User | Key Features |
|------|-------|-------------|--------------|
| Free | $0/mo | Solopreneur / Evaluation | 3 compliance checks/mo, basic modules, AI Copilot (5 queries) |
| Starter | $29/mo | SMB Owner (1–19 employees) | Unlimited checks, all 21 modules, AI Copilot (50 queries), PDF export |
| Professional | $79/mo | Growing Business (20–99) | Everything in Starter + Enterprise Platform (Monitoring, Integrations, Workforce), API access |
| Agency | $249/mo | Consultant / 100+ employees | Everything + multi-client workspace, white-label reports, priority support |

---

## 10. Roadmap

### Q3 2026 — Foundation (v5.0 — Current)
- [x] 21 Canadian compliance modules
- [x] 6 global frameworks
- [x] 3 role-based tool sets
- [x] Enterprise Platform (Monitoring, Integrations, Workforce, AI Remediation)
- [x] Intelligence Layer (Inbox, Calculator, Tracker, Scanner, Benchmarking)
- [x] Website QA Scanner (AODA + SEO)
- [x] Clerk auth + demo sessions
- [x] PostgreSQL persistence + audit trail

### Q4 2026 — Growth Layer
- [ ] Real-time WCAG scanner (headless browser integration)
- [ ] Government API integrations (BizPaL, CRA)
- [ ] Mobile app (React Native / Expo)
- [ ] Slack/Teams compliance alerts
- [ ] White-label reporting
- [ ] Multi-user organization accounts

### Q1 2027 — Network Effects
- [ ] Trust Badge public verification page
- [ ] Supplier compliance request portal (public-facing)
- [ ] Enterprise SSO (SAML/OIDC)
- [ ] SOC 2 Type I audit
- [ ] CRA DAC-7 filing integration

### Q2 2027 — Platform Expansion
- [ ] Municipal compliance modules (construction, food service, etc.)
- [ ] Quebec-specific bilingual UI
- [ ] Compliance insurance marketplace integration
- [ ] Automated regulatory change monitoring (NLP on government feeds)

---

## 11. Open Questions

1. **Real website scanning:** Should the Website QA Scanner use a real headless browser (Playwright) or remain simulated? Real scanning requires backend infrastructure and increases API costs.
2. **Evidence file storage:** Should the Evidence Portal support actual file uploads? Requires object storage (S3/Cloudflare R2) and virus scanning.
3. **Quebec bilingual requirement:** Should the app itself be available in French to comply with Bill 96 for Quebec users?
4. **Government API connectivity:** BizPaL API access requires government partnership agreement — timeline uncertain.
5. **AI model selection:** Claude Sonnet for Document Scanner and AI Copilot is high-quality but costly at scale. Consider Claude Haiku for basic queries.

---

*Document maintained by the CanCompliance Product Team. Last updated: May 2026.*
