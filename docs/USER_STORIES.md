# CanCompliance — User Stories
**Version:** 5.0  
**Date:** May 2026  
**Format:** As a [persona], I want to [action], so that [outcome].

---

## Epic 1: Onboarding & First Run

### US-001 — Demo without signing up
**As a** curious business owner visiting the landing page,  
**I want to** see a live compliance scan of my website URL without creating an account,  
**so that** I can immediately understand the value of the product before committing to signup.

**Acceptance Criteria:**
- URL input field is visible above the fold on the landing page
- Entering a URL and clicking "Scan" returns results within 3 seconds
- Results show at least 3 violations with statute citations and severity levels
- A "Demo Simulation" badge is visible to set expectations
- A clear CTA to sign up appears after results are shown

---

### US-002 — Role-based demo session
**As a** potential buyer evaluating the platform for my team,  
**I want to** explore the app as a specific role (Compliance Officer, Auditor, or Business Owner) without creating an account,  
**so that** I can see the exact tools relevant to my job function without a sales call.

**Acceptance Criteria:**
- Three demo role cards visible on the sign-in page
- Clicking a role card immediately redirects to a personalized dashboard
- Pinned tools, sidebar highlights, and welcome message are role-specific
- Demo session resets on tab close (no persistent data)

---

### US-003 — Province and business type onboarding
**As a** new user after signing up,  
**I want to** tell the platform my province and business type,  
**so that** the platform only shows regulations that actually apply to me.

**Acceptance Criteria:**
- 4-step onboarding modal appears on first login
- Province selector includes all 13 Canadian provinces/territories
- Quebec selection triggers a "Law 25 applies to you" notice
- Business type selection (tech, retail, finance, healthcare, other)
- Step 3 runs a live CASL demo check
- Step 4 shows an initial compliance score
- Onboarding can be dismissed and re-triggered from Settings

---

### US-004 — Time to first compliance check under 5 minutes
**As a** business owner who just signed up,  
**I want to** complete my first compliance check within 5 minutes of landing,  
**so that** I immediately understand my regulatory standing without a learning curve.

**Acceptance Criteria:**
- Dashboard shows prominent "Quick Actions" section with 3–5 top compliance checks
- Each check requires no more than 4 questions to complete
- Result with statute citation is shown immediately after submission
- Result is saved to the audit trail automatically
- No configuration or setup required before running a check

---

## Epic 2: Compliance Checking

### US-010 — CASL email consent verification
**As a** marketing manager at a Canadian company,  
**I want to** verify that my email marketing program meets CASL requirements,  
**so that** I can avoid fines up to $10M per violation.

**Acceptance Criteria:**
- Questionnaire covers all three CASL pillars: consent, identification, unsubscribe
- Each question includes a plain-English explanation and the relevant statute
- PASS result confirms compliance with a specific citation (e.g., "CASL s.10 — satisfied")
- FAIL result shows the specific violation and a remediation action
- Fine exposure ($1M individual / $10M corporate) shown on FAIL result
- Result stored in audit trail with timestamp

---

### US-011 — PIPEDA privacy self-assessment
**As a** startup CTO handling user data,  
**I want to** run a PIPEDA compliance check,  
**so that** I know whether my data handling practices meet Canada's federal privacy law.

**Acceptance Criteria:**
- 4-question assessment covering the 10 Schedule 1 fair information principles
- Response to "Do you transfer data outside Canada?" triggers a cross-border transfer notice
- FLAG result for partial compliance with specific improvement actions
- PASS result includes "Key strengths" summary
- Quebec users see an additional note about Law 25 obligations

---

### US-012 — AODA accessibility compliance check
**As a** compliance officer at an Ontario company with 45 employees,  
**I want to** verify that our website meets AODA requirements,  
**so that** we avoid the $100,000/day corporate fine for non-compliant organizations.

**Acceptance Criteria:**
- Employee count field gates WCAG requirements (20+ = WCAG 2.0 AA mandatory)
- WCAG level selector has clear labels (None / A / AA / AAA)
- Selecting "None" for a 45-employee company results in FAIL
- Compliance timeline shows relevant 2021 and 2025 milestones
- CTA to run Website QA Scanner for automated WCAG audit
- Fine amount ($100,000/day) prominent on FAIL result

---

### US-013 — Website accessibility automated scan
**As a** developer responsible for our company's website,  
**I want to** scan our URL and get a list of WCAG violations with code fixes,  
**so that** I can remediate accessibility issues before our AODA audit.

**Acceptance Criteria:**
- URL input field accepts domain or full URL (https:// added if missing)
- Scan completes with progress bar and phase labels in under 5 seconds
- Accessibility score (0–100) displayed with a ring chart
- Issues categorized by severity: Critical, High, Medium, Low
- Each issue includes: WCAG criterion, description, business impact, and code fix
- Code fix has a "Copy" button that changes to "Copied!" on click
- AODA compliance status card shows PASS/PARTIAL/FAIL with legal context
- Results vary by URL entered (deterministic seeding)

---

### US-014 — SEO audit alongside accessibility
**As a** marketing manager,  
**I want to** see my website's SEO issues in the same scan as accessibility,  
**so that** I can fix both classes of problems in a single dev sprint.

**Acceptance Criteria:**
- SEO tab available alongside Accessibility tab after scan
- SEO score (0–100) with ring chart
- Issues include: missing meta descriptions, Open Graph tags, multiple H1s, LCP score, missing schema markup
- Each SEO issue includes business impact and code fix
- Overview tab shows combined "Quick Wins" list prioritized by highest impact

---

### US-015 — AI document scanner
**As a** compliance officer reviewing a new supplier contract,  
**I want to** paste the contract text and receive a Canadian compliance audit,  
**so that** I can identify regulatory risks before signing.

**Acceptance Criteria:**
- Text paste area accepts up to 10,000 characters
- Pre-loaded sample contracts available (NDA, service agreement, employment contract)
- Streaming output begins within 1.5 seconds of clicking "Analyze"
- Output is structured: violation name, statute citation, penalty exposure, remediation
- Each scan creates an entry in the user's audit trail
- AI consent gate shown before first use; can be accepted once per account
- Rate limiting: clear error message if 15/min limit is hit

---

## Epic 3: Intelligence & Monitoring

### US-020 — Regulatory update inbox
**As a** compliance officer,  
**I want to** receive a curated feed of Canadian regulatory changes,  
**so that** I am alerted to new obligations before they become enforcement actions.

**Acceptance Criteria:**
- Inbox shows minimum 8 updates at launch with real case details
- Each update has: title, date, jurisdiction tag, severity badge, and summary
- Filter by jurisdiction (Federal / Ontario / Quebec / BC / Alberta)
- Filter by severity (Critical / High / Medium / Low)
- Filter by category tag (Privacy / Anti-Spam / Accessibility / Finance / AI)
- Each update links to the relevant compliance module
- Email subscription form for weekly digest
- Unread count badge visible in sidebar

---

### US-021 — Red Tape cost calculator
**As a** business owner preparing a board deck,  
**I want to** calculate how much compliance is costing my company per year,  
**so that** I can quantify the ROI of a compliance platform in my next board meeting.

**Acceptance Criteria:**
- 5 inputs: company size, industry, province, annual revenue, hourly staff cost
- Output shows total compliance hours and dollar cost
- 7-category breakdown bar chart with Canadian regulatory categories
- Comparison to national average (735 hours/year benchmark)
- "CanCompliance saves you X hours/year" card with specific dollar savings
- LinkedIn and Twitter/X share cards pre-populated with calculated results
- No sign-in required (available on public landing page as lead gen)

---

### US-022 — Legislation tracker with readiness scoring
**As a** compliance officer tracking Bill C-27 (CPPA),  
**I want to** see the current parliamentary status of pending Canadian legislation and my readiness,  
**so that** I can prepare before new laws come into force.

**Acceptance Criteria:**
- Minimum 12 bills tracked with accurate parliamentary status
- Bills categorized: Privacy / AI / Anti-Spam / Finance / Accessibility
- Status badge reflects current stage: Tabled → First Reading → Committee → Senate → Royal Assent
- Readiness panel shows 6 critical bills with a % readiness bar based on user's compliance data
- Each bill has an expandable detail section with action items
- "Watch" toggle per bill

---

### US-023 — Continuous monitoring center
**As a** compliance officer at a 200-person company,  
**I want to** see the live status of all 12 compliance modules on an automated schedule,  
**so that** I don't have to manually rerun checks to know if my compliance posture has changed.

**Acceptance Criteria:**
- Module Status tab shows all 12 modules with last run, next run, status, and history sparkline
- Scheduled runs every 5 hours (displayed as next run time)
- "Run All Now" button triggers immediate run of all modules with visual progress
- Alerts tab surfaces new violations with severity badges (Critical/High/Medium/Low)
- Each unread alert has a "Dismiss" button; dismissed alerts are visually dimmed
- Activity Feed tab shows timestamped log of all automated runs and status changes
- Unread alert count badge shown in Platform sidebar section

---

## Epic 4: Evidence & Audit

### US-030 — Evidence portal for audit prep
**As an** internal auditor preparing for an external audit,  
**I want to** see all compliance evidence in one place with status tracking,  
**so that** I can provide auditors with a complete evidence package in one export.

**Acceptance Criteria:**
- Evidence list with type, status, expiry date, and last updated
- Status workflow: Pending Upload → Submitted → Under Review → Accepted / Rejected
- File upload button with progress indicator
- Evidence tagged to specific regulation (CASL, PIPEDA, AODA, etc.)
- Auto-populated evidence from connected integrations (GitHub, AWS)
- Filter by status and regulation

---

### US-031 — Integrations for automated evidence collection
**As an** auditor managing evidence for a tech company,  
**I want to** connect GitHub and AWS to automatically pull audit evidence,  
**so that** I eliminate 80% of manual evidence collection work.

**Acceptance Criteria:**
- 12 integrations available including GitHub, AWS, Google Workspace, Okta
- Each integration shows: category, description, what evidence it auto-collects
- "Connect" button with 2-second async simulation and green connected indicator
- Connected integrations show: last sync time, evidence item count, "Sync Now" button
- Category filter: Engineering / Cloud / HR / Identity / ITSM / etc.
- Evidence items auto-populate in the Evidence Portal after connection
- Stat cards show: total connected, total evidence items, last synced, coverage %

---

### US-032 — Audit trail with immutable timestamps
**As an** external auditor reviewing a client's compliance history,  
**I want to** see a timestamped, immutable log of every compliance check ever run,  
**so that** I can demonstrate to regulators that compliance monitoring was continuous.

**Acceptance Criteria:**
- Audit trail shows all events: compliance checks, document scans, policy attestations
- Each entry includes: timestamp (ISO 8601), user ID, action, module, result
- Entries cannot be edited or deleted (append-only)
- Filter by module, date range, and result (PASS/FLAG/FAIL)
- Export as JSON or CSV

---

### US-033 — Finding tracker for remediation
**As an** internal auditor after a compliance review,  
**I want to** create and track findings with owners and due dates,  
**so that** I can demonstrate that all identified issues are being remediated.

**Acceptance Criteria:**
- Create finding with: severity, description, regulation reference, owner, due date
- Status workflow: Open → In Progress → Pending Verification → Closed
- Findings list filterable by severity (Critical/High/Medium/Low) and status
- Expand finding to see full details and status history
- "Advance Status" button moves finding to next workflow stage

---

## Epic 5: Role-Based Tools

### US-040 — Policy attestation tracking
**As a** compliance officer responsible for annual policy reviews,  
**I want to** send policies to employees and track who has signed off,  
**so that** I have documented proof that all staff have read and acknowledged our compliance policies.

**Acceptance Criteria:**
- Policy library with CASL, PIPEDA, AODA, AML, and custom policy templates
- Employee list with per-policy sign-off status (Signed / Pending / Overdue)
- "Send Reminder" button for employees with Pending or Overdue status
- Due date display per policy
- Export attestation report showing all employees and statuses

---

### US-041 — Vendor risk management
**As a** compliance officer managing 15 vendor relationships,  
**I want to** score and track vendor compliance risk,  
**so that** I can identify high-risk vendors before they create a PIPEDA data breach liability.

**Acceptance Criteria:**
- Vendor list with risk score (0–100), status, and category
- Risk score calculated from: privacy risk, security, contract, jurisdiction
- Status: Active / Under Review / Approved / Flagged
- Expand vendor to see risk breakdown with reasoning
- High-risk vendors (score ≥ 70) automatically flagged with red indicator

---

### US-042 — Fine exposure awareness for business owners
**As a** business owner with 30 employees,  
**I want to** see my total fine exposure across all regulations,  
**so that** I can prioritize which compliance issues to fix first based on financial risk.

**Acceptance Criteria:**
- Module-by-module fine amounts in CAD with severity status
- Status buttons for each module: PASS (green) / FLAG (amber) / FAIL (red)
- Total annual exposure shown as a monetary figure
- Highest-exposure modules highlighted
- Link from each module to run the corresponding compliance check
- Results vary based on company size input

---

### US-043 — Workforce security training tracking
**As an** HR manager responsible for annual security training,  
**I want to** see which employees have completed which training modules,  
**so that** I can demonstrate PIPEDA-required security safeguards are in place.

**Acceptance Criteria:**
- Training matrix showing 8 employees × 6 training modules
- Per-cell status: Completed (green) / In Progress (amber) / Not Started (red)
- Overall completion % per employee and per module
- "Send Reminder" button per in-progress/not-started module
- Canadian statute reference for each training requirement (PIPEDA, ESA, PCMLTFA)

---

### US-044 — Onboarding checklist with legal references
**As an** HR manager bringing on a new employee,  
**I want to** follow a legally-aware onboarding checklist with Canadian statute references,  
**so that** I ensure no mandatory onboarding step (PIPEDA consent, ESA notice, etc.) is missed.

**Acceptance Criteria:**
- Onboarding tab in Workforce Compliance page
- Checklist items with checkbox, description, and Canadian statute reference
- Items include: PIPEDA privacy notice, ESA written employment contract, PCMLTFA background check, benefits enrollment, IT access provisioning
- Check items off as they are completed
- Progress bar shows % complete
- Offboarding tab with equivalent deprovisioning checklist

---

## Epic 6: AI & Remediation

### US-050 — AI Copilot for compliance questions
**As a** business owner with a specific compliance question,  
**I want to** ask an AI assistant a natural language question about Canadian regulations,  
**so that** I get an accurate, statute-cited answer in 30 seconds instead of waiting for a lawyer's callback.

**Acceptance Criteria:**
- Chat interface with streaming SSE response (real-time output)
- AI persona: Canadian compliance specialist
- Responses include specific statute citations (e.g., "CASL s.6(1) states...")
- Conversation history persisted per user across sessions
- AI consent gate shown before first use (one-time accept)
- Rate limit: 15 queries/minute with clear error message
- Cannot give legal advice disclaimer shown in UI

---

### US-051 — AI-generated code fixes for compliance violations
**As a** developer whose company received a CASL violation notice,  
**I want to** generate production-ready code to fix the specific CASL consent issue,  
**so that** I can implement the fix in my next sprint without reading 50 pages of legislation.

**Acceptance Criteria:**
- 8 violation types selectable from left panel (CASL, PIPEDA, AODA, Cookie, etc.)
- Selecting a violation shows: description, penalty exposure, and "Generate AI Fix" button
- Click "Generate" → 1.4 second animation → multi-tab code output appears
- Code tabs include relevant languages (React/TSX, SQL, Policy template, Config)
- "Copy Fix" button on each tab with "Copied!" visual confirmation
- Legal disclaimer: "Review with legal counsel before production deployment"

---

### US-052 — Policy generator
**As a** startup founder who has never written a privacy policy,  
**I want to** generate a PIPEDA-compliant privacy policy template for my company,  
**so that** I have a starting document I can have a lawyer review and adopt.

**Acceptance Criteria:**
- Policy type selector: Privacy Policy, CASL Consent Form, Cookie Policy, AODA Accessibility Statement
- Company name and details input fields
- Generated policy references correct Canadian statutes
- Output is formatted as a readable document
- Download as text option
- Disclaimer that legal review is required

---

## Epic 7: Platform & Trust

### US-060 — Trust badge for website
**As a** B2B software company,  
**I want to** display a CanCompliance trust badge on my website,  
**so that** enterprise customers can see at a glance that we take Canadian compliance seriously.

**Acceptance Criteria:**
- Badge generator in Growth Tools
- Embeddable HTML snippet with live status indicator
- Badge shows overall compliance score and "CanCompliance Verified" text
- Badge links to a public verification page showing the company's compliance status
- Score updates dynamically as compliance checks are run

---

### US-061 — Supplier compliance proof request
**As a** procurement manager at a large retailer,  
**I want to** request compliance proof from a supplier,  
**so that** I can verify they meet our supplier code of conduct requirements before onboarding them.

**Acceptance Criteria:**
- "Send Proof Request" button with email input
- Supplier receives an email with a link to verify their compliance on CanCompliance
- If supplier doesn't have an account, the email becomes a CanCompliance signup invite
- Requestor can see status: Pending / Verified / Declined
- Verified suppliers earn a "Trust Badge" visible in the Trust Network

---

### US-062 — Compliance benchmarking
**As a** compliance officer preparing a board report,  
**I want to** see how our compliance score compares to other companies in our industry,  
**so that** I can contextualize our performance and justify compliance investment to the board.

**Acceptance Criteria:**
- User's score vs. national average, industry average, provincial average on one chart
- Percentile rank (e.g., "Top 23% of Ontario fintech companies")
- Module-level comparison: user bar vs. sector average bar per regulation
- Network-wide pass rates (e.g., "Only 48% of companies pass CASL nationally")
- Data is anonymized and aggregated — no individual company data exposed

---

## Epic 8: Developer & API

### US-070 — API key for compliance integrations
**As a** developer building a SaaS product for Canadian customers,  
**I want to** integrate CanCompliance's CASL and PIPEDA checks into my own product via API,  
**so that** my customers get compliance guidance without leaving my platform.

**Acceptance Criteria:**
- Developer Portal accessible from sidebar
- API key generated in one click with copy button
- Endpoint documentation: CASL check, PIPEDA check, URL Scanner, AI query
- Code samples in cURL, Node.js, Python
- Usage dashboard with request counts and rate limit status
- Webhook configuration for compliance status change notifications (v2)

---

## User Story Priority Matrix

| Epic | Stories | Priority | Effort |
|------|---------|----------|--------|
| Onboarding | US-001 to US-004 | P0 | M |
| Compliance Checking | US-010 to US-015 | P0–P1 | L |
| Intelligence | US-020 to US-023 | P1 | L |
| Evidence & Audit | US-030 to US-033 | P1 | M |
| Role-Based Tools | US-040 to US-044 | P1 | M |
| AI & Remediation | US-050 to US-052 | P1 | M |
| Platform & Trust | US-060 to US-062 | P2 | S |
| Developer & API | US-070 | P2 | S |

**Priority:** P0 = Launch blocker | P1 = Launch milestone | P2 = Growth milestone  
**Effort:** S = Small (1–3 days) | M = Medium (1–2 weeks) | L = Large (2–4 weeks)

---

*All stories follow INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable.*  
*Acceptance criteria are written to be directly testable by QA via Playwright end-to-end tests.*
