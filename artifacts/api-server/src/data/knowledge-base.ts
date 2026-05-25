export interface KnowledgeSeed {
  source: string;
  title: string;
  content: string;
}

export const KNOWLEDGE_BASE: KnowledgeSeed[] = [
  // ── CASL ────────────────────────────────────────────────────────────────
  {
    source: "casl",
    title: "CASL — Overview and Scope",
    content: "Canada's Anti-Spam Legislation (CASL) governs all Commercial Electronic Messages (CEMs) sent to or from Canadian computers. A CEM is any electronic message (email, SMS, instant message) that encourages participation in a commercial activity. CASL applies regardless of where the sender is located — if the message is sent to a Canadian recipient, CASL applies. Maximum penalties: $1M per violation for individuals, $10M per violation for organizations. CASL came into force July 1, 2014. Private right of action provisions are not yet in force.",
  },
  {
    source: "casl",
    title: "CASL — Express vs Implied Consent",
    content: "CASL requires prior consent before sending a CEM. Express consent: recipient explicitly agreed (checkbox, signature, verbal confirmation) to receive CEMs. Must not be pre-checked. Implied consent applies where: existing business relationship within last 2 years (purchase, contract), existing non-business relationship within last 2 years (donation, volunteer work), conspicuous publication of address and no opt-out statement, or person gave business card. Implied consent expires after 2 years from last transaction. CASL s.6(1) — sender must have consent before transmitting. CASL s.10 — forms of consent.",
  },
  {
    source: "casl",
    title: "CASL — Identification and Unsubscribe Requirements",
    content: "Every CEM must contain: (1) clear identification of the sender and any organization on whose behalf it is sent; (2) current contact information including mailing address and one of: phone number, email, or web address; (3) a functional unsubscribe mechanism that works for at least 60 days after sending. Unsubscribe must be processed within 10 business days. CASL s.6(2) — content requirements. CASL s.11(1) — unsubscribe requirement. Failure to include any of these elements is a separate violation from consent failures. CRTC enforces — $1.1M fine levied in 2021.",
  },
  {
    source: "casl",
    title: "CASL — Enforcement and CRTC Fines",
    content: "The Canadian Radio-television and Telecommunications Commission (CRTC) enforces CASL. Notable enforcement: 2021 — CRTC issued $1.1M fine against Kohl & Frisch. 2019 — $150,000 fine against Grapevine Interactive. 2016 — $200,000 fine against Compu-Finder for 3 million CEMs without consent. CASL has extraterritorial reach — foreign companies sending to Canadian recipients are subject to CASL. The CRTC can impose administrative monetary penalties (AMPs) up to $10M. CASL s.20 — AMPs. CASL s.47 — maximum penalty amounts.",
  },
  // ── PIPEDA ──────────────────────────────────────────────────────────────
  {
    source: "pipeda",
    title: "PIPEDA — Overview and Application",
    content: "The Personal Information Protection and Electronic Documents Act (PIPEDA) is Canada's federal private-sector privacy law, enacted in 2000. PIPEDA applies to organizations that collect, use, or disclose personal information in the course of commercial activity, unless a substantially similar provincial law applies (Quebec Law 25, BC PIPA, AB PIPA). PIPEDA establishes 10 fair information principles in Schedule 1. The Office of the Privacy Commissioner of Canada (OPC) enforces PIPEDA. Penalties for non-compliance: up to $100,000 CAD fine under current PIPEDA. The successor law CPPA (Bill C-27) will increase penalties to $25M or 4% of global revenue.",
  },
  {
    source: "pipeda",
    title: "PIPEDA — 10 Fair Information Principles",
    content: "PIPEDA Schedule 1 contains 10 principles: 1) Accountability — designate a privacy officer; 2) Identifying Purposes — state why data is collected before/at collection; 3) Consent — obtain meaningful consent; 4) Limiting Collection — collect only what is necessary; 5) Limiting Use, Disclosure and Retention — use data only for stated purposes; 6) Accuracy — keep data up to date; 7) Safeguards — protect data with security appropriate to sensitivity; 8) Openness — make privacy practices publicly available; 9) Individual Access — provide access on request; 10) Challenging Compliance — provide recourse. Each principle has associated compliance requirements.",
  },
  {
    source: "pipeda",
    title: "PIPEDA — Breach Notification Requirements",
    content: "Since November 2018, PIPEDA requires mandatory breach notification. Organizations must notify the Office of the Privacy Commissioner (OPC) of any breach of security safeguards involving personal information that creates a 'real risk of significant harm' to individuals. Must also notify affected individuals 'as soon as feasible'. Must keep breach records for 24 months and provide them to OPC on request. PIPEDA s.10.1 — breach of security safeguards. Significant harm includes: bodily harm, humiliation, financial loss, identity theft, negative effects on credit record, damage to reputation. Failure to notify: up to $100,000 fine.",
  },
  {
    source: "pipeda",
    title: "PIPEDA — Cross-Border Data Transfers",
    content: "PIPEDA Principle 4.1.3 allows personal information to be transferred to third parties (including internationally) for processing, but the originating organization remains accountable. Organizations must use contractual or other means to ensure comparable protection. Best practice: notify individuals of cross-border transfers in privacy policy. This applies to cloud services hosted outside Canada (e.g., US, EU). Quebec Law 25 goes further — requires privacy impact assessment before any transfer outside Quebec. PIPEDA does not require data to be stored in Canada, but this is changing under CPPA (Bill C-27).",
  },
  // ── CPPA / Bill C-27 ────────────────────────────────────────────────────
  {
    source: "cppa",
    title: "CPPA — Bill C-27 Overview (PIPEDA Successor)",
    content: "The Consumer Privacy Protection Act (CPPA), Part 1 of Bill C-27, will replace PIPEDA for private-sector organizations. Bill C-27 passed Third Reading in the House of Commons and is currently before the Senate (2025). Key changes from PIPEDA: (1) Penalties: up to $25M or 4% of global annual revenue, whichever is greater; (2) Strengthened consent requirements including right to withdraw; (3) New right to de-indexing, data portability, and automated decision-making transparency; (4) Privacy Management Programme mandatory for all organizations; (5) Algorithmic transparency for decisions affecting individuals; (6) Children's privacy heightened protections.",
  },
  {
    source: "cppa",
    title: "CPPA — New Rights Under Bill C-27",
    content: "Bill C-27 introduces significant new individual rights: (1) Right to Data Portability — receive personal data in interoperable format; (2) Right to Disposal — request deletion of personal data; (3) Right to De-indexing — request removal from search engine results; (4) Right to Explanation — explanation of automated decision-making affecting significant interests; (5) Right to Withdraw Consent — at any time, with reasonable notice; (6) Right to Challenge Accuracy — dispute inaccurate information. Organizations must implement processes for each right. Timeline: in force approximately 1-2 years after Senate passage. CPPA s.62-76 covers these rights.",
  },
  // ── AODA ────────────────────────────────────────────────────────────────
  {
    source: "aoda",
    title: "AODA — Overview and Application",
    content: "The Accessibility for Ontarians with Disabilities Act (AODA) requires organizations in Ontario to meet specific accessibility standards. AODA applies to all Ontario organizations — public sector, private sector, and non-profits. The Integrated Accessibility Standards Regulation (IASR, O.Reg 191/11) contains specific requirements including website accessibility. Organizations with 20 or more employees must comply with WCAG 2.0 Level AA for new or significantly refreshed websites as of January 1, 2021. Maximum penalties: $100,000/day for corporations, $50,000/day for directors/officers. Enforced by Accessibility Directorate of Ontario.",
  },
  {
    source: "aoda",
    title: "AODA — WCAG 2.0 AA Requirements",
    content: "AODA IASR O.Reg 191/11 s.14 requires Ontario organizations with 20+ employees to conform to WCAG 2.0 Level AA for websites by January 1, 2021. WCAG 2.0 has 4 principles: Perceivable (alt text, captions, contrast), Operable (keyboard accessible, seizure-safe, navigable), Understandable (readable, predictable, input assistance), Robust (compatible with assistive technologies). Key Level AA requirements: 4.5:1 minimum contrast ratio for normal text, 3:1 for large text; all functionality keyboard-accessible; no content that flashes more than 3 times per second; skip navigation links; form labels. WCAG criterion references: 1.1.1, 1.4.3, 2.1.1, 2.4.1, 4.1.2.",
  },
  {
    source: "aoda",
    title: "AODA — Compliance Timeline",
    content: "AODA compliance timeline: January 1, 2012 — AODA customer service standards (all organizations with 1+ employees). January 1, 2014 — IASR in force; new websites WCAG 2.0 Level A. January 1, 2021 — existing websites WCAG 2.0 Level AA (organizations with 20+ employees); self-service kiosks. 2025 and beyond — ongoing enforcement and additional standards under development. Public sector organizations had earlier deadlines. AODA 2005, IASR O.Reg 191/11. For organizations under 20 employees: WCAG 2.0 Level A was required for new sites; Level AA strongly recommended. AODA covers: customer service, information and communications, employment, transportation, design of public spaces.",
  },
  // ── Quebec Law 25 ────────────────────────────────────────────────────────
  {
    source: "law25",
    title: "Quebec Law 25 — Overview and Penalties",
    content: "Law 25 (Bill 64, Act to modernize legislative provisions as regards the protection of personal information) amended Quebec's Act respecting the protection of personal information in the private sector. Law 25 applies to any organization doing business in Quebec, regardless of location. Three implementation phases: September 2022 (privacy incident reporting, privacy officer designation), September 2023 (privacy impact assessments, data portability, right to be forgotten, consent clarity), September 2023 (full regime). Penalties: up to $25M or 4% of worldwide turnover, whichever is greater — among the highest in North America. Enforced by Commission d'accès à l'information (CAI).",
  },
  {
    source: "law25",
    title: "Quebec Law 25 — Key Requirements",
    content: "Law 25 requires: (1) Privacy officer designation — name and title must be published on website; (2) Privacy policy in plain language, easily accessible; (3) Privacy Impact Assessment (PIA) before launching new projects or transferring data outside Quebec; (4) Data inventory — know what personal information you hold and where; (5) Consent — freely given, informed, for specific purposes; cannot be bundled with service terms; (6) Right to access, correction, and deletion of personal information; (7) Cross-border transfer agreements — PIA required before transferring to other provinces or countries; (8) Breach notification to CAI within 72 hours if serious injury risk. As of September 2023, all requirements are in force.",
  },
  {
    source: "law25",
    title: "Quebec Bill 96 — French Language Requirements",
    content: "Bill 96 (Act respecting French, the official and common language of Quebec) amended the Charter of the French Language. Key requirements for businesses: (1) Websites offering products or services to Quebec consumers must be available in French (Charter s.51); (2) All written communications with clients in Quebec must be in French; (3) Contracts with consumers must be in French first; (4) Software used by employees in Quebec must have a French version; (5) Employee communications must be in French. Penalties: $700 to $30,000 for individuals, $3,000 to $150,000 for legal persons per violation. Enforced by Office québécois de la langue française (OQLF).",
  },
  // ── Employment Standards ─────────────────────────────────────────────────
  {
    source: "employment",
    title: "Employment Standards Act — Ontario Key Requirements",
    content: "Ontario's Employment Standards Act, 2000 (ESA) sets minimum standards for most Ontario employees. Key requirements: (1) Minimum wage — $17.20/hour (2024, updated annually); (2) Overtime — 1.5x for hours over 44/week (standard employees); (3) Vacation — 2 weeks/year (4%) after 1 year, 3 weeks/year (6%) after 5 years; (4) Public holidays — 9 public holidays with premium pay; (5) Notice/severance — 1 week per year of service (notice), 1 week per year for employees with 5+ years at companies with $2.5M+ payroll (severance); (6) Leaves — pregnancy (17 weeks), parental (61 weeks), personal emergency (3 days). Written employment contracts recommended. ESA 2000, O.Reg 285/01.",
  },
  {
    source: "employment",
    title: "Employment Standards — Pay Equity in Ontario",
    content: "Ontario's Pay Equity Act requires equal pay for work of equal or comparable value (not just identical work) between male- and female-dominated job classes. Applies to all Ontario employers with 10+ employees. Key obligations: conduct pay equity analysis; maintain pay equity once achieved; post pay equity plan for employers with 100+ employees. Federal pay equity under the Pay Equity Act (2021, applies to federally regulated employers with 10+ employees) requires completion of pay equity plan within 3 years of the Act applying. Penalties for non-compliance: under Ontario Pay Equity Act — pay equity maintenance orders; under federal Act — administrative monetary penalties.",
  },
  // ── FINTRAC / AML ────────────────────────────────────────────────────────
  {
    source: "fintrac",
    title: "FINTRAC — AML/ATF Reporting Requirements",
    content: "The Financial Transactions and Reports Analysis Centre of Canada (FINTRAC) enforces Canada's Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA). Reporting entities include: banks, credit unions, money services businesses, real estate brokers, accountants, dealers in precious metals and stones, life insurance companies, securities dealers, casinos. Key obligations: (1) Register with FINTRAC if operating a money services business; (2) Report suspicious transactions (STR) within 30 days; (3) Report large cash transactions ($10,000+) within 15 days; (4) Report international electronic funds transfers ($10,000+); (5) Keep records for 5 years; (6) Client identification and KYC procedures; (7) Risk-based compliance program. Penalties: up to $2M and/or 5 years imprisonment.",
  },
  // ── Supply Chain / S-211 ─────────────────────────────────────────────────
  {
    source: "supplychain",
    title: "Bill S-211 — Fighting Against Forced Labour and Child Labour Act",
    content: "Canada's Fighting Against Forced Labour and Child Labour in Supply Chains Act (Bill S-211, in force January 1, 2024) requires certain entities to report annually on measures taken to prevent and reduce the risk of forced labour or child labour in their supply chains. Who must report: government institutions; entities listed on a Canadian stock exchange; entities meeting two of three thresholds in two consecutive fiscal years (assets $20M+, revenue $40M+, 250+ employees). Annual report due May 31 each year to Public Safety Canada. Report must describe: structure and supply chains; due diligence policies; risk assessment; training; effectiveness measures. Penalty for non-compliance: up to $250,000 fine. Non-compliant entities publicly named by the Minister.",
  },
  // ── AI Governance ────────────────────────────────────────────────────────
  {
    source: "aigovernance",
    title: "AIDA — Artificial Intelligence and Data Act (Bill C-27 Part 3)",
    content: "The Artificial Intelligence and Data Act (AIDA), Part 3 of Bill C-27, would be Canada's first federal AI regulatory framework for 'high-impact AI systems'. Currently before the Senate. Key requirements: (1) Register and assess high-impact AI systems; (2) Identify and mitigate risks of biased output and physical/psychological harm; (3) Maintain logs and documentation; (4) Stop deployment if imminent harm identified; (5) Notify AI and Data Commissioner of serious harm incidents. 'High-impact' definition to be set by regulation — expected to cover AI in employment, credit, healthcare, law enforcement, critical infrastructure. Penalties: up to $25M or 3% of global revenue for violations. Separate Minister Solomon AI bill proposed broader AI framework.",
  },
  {
    source: "aigovernance",
    title: "AI Governance — Best Practices for Canadian Organizations",
    content: "Organizations using AI in Canada should prepare for AIDA/C-27 by implementing AI governance frameworks aligned with NIST AI RMF and EU AI Act. Key practices: (1) AI inventory — document all AI systems in use, their purpose and impact level; (2) Bias testing — evaluate AI outputs for discriminatory patterns before deployment; (3) Human oversight — establish processes for human review of high-stakes AI decisions; (4) Transparency — disclose to individuals when AI is used in decisions affecting them; (5) Privacy compliance — ensure AI data pipelines comply with PIPEDA/Law 25; (6) Incident response — process for reporting AI harms; (7) Employee training on responsible AI use. PIPEDA applies to AI data processing. AODA may apply to AI interfaces used by the public.",
  },
  // ── GST/HST ──────────────────────────────────────────────────────────────
  {
    source: "gsthst",
    title: "GST/HST — Registration and Collection Requirements",
    content: "Canadian businesses must register for GST/HST when taxable sales exceed $30,000 in a single quarter or over four consecutive calendar quarters (small supplier threshold). GST rate: 5%; HST rates vary by province (Ontario 13%, Nova Scotia 15%, etc.). Key obligations: (1) Obtain GST/HST registration number from CRA; (2) Charge and collect applicable GST/HST on taxable supplies; (3) File returns — monthly (over $6M revenue), quarterly ($1.5M–$6M), or annually (under $1.5M); (4) Remit net tax (GST/HST collected minus input tax credits claimed); (5) Issue invoices with GST/HST number for sales over $100. Digital services threshold: non-resident digital platforms must register if supplying digital services to Canadian consumers. CRA ETA s.165–166. Penalties: 20% of unreported tax for repeated failures.",
  },
  // ── ESG / Greenwashing ───────────────────────────────────────────────────
  {
    source: "esg",
    title: "ESG and Greenwashing — Competition Act Requirements",
    content: "Canada's Competition Act was amended in 2024 to strengthen greenwashing protections. Environmental and climate claims must now be substantiated by 'adequate and proper testing' before being made. Key changes: (1) Section 74.01(1)(b.1) — misleading environmental representations are a reviewable matter; (2) Environmental claims must be based on internationally recognized methodology; (3) Remedies: prohibition orders, corrective notices, disgorgement of benefits, administrative monetary penalties. Competition Bureau has increased scrutiny of climate pledges. Voluntary ESG reporting (TCFD, GRI, ISSB) is standard for public companies. S-211 supply chain reporting creates mandatory ESG element. Federal sustainable finance taxonomy under development. Maximum AMP under Competition Act: 3% of global revenue.",
  },
  // ── Beneficial Ownership ─────────────────────────────────────────────────
  {
    source: "beneficial",
    title: "Beneficial Ownership — Federal and Provincial Requirements",
    content: "Canada's Beneficial Ownership Transparency Act (2023) amended the Canada Business Corporations Act (CBCA) to require federally incorporated companies to maintain a register of individuals with significant control (ISCs) — those who own or control 25%+ of shares or votes. As of January 22, 2024, beneficial ownership data must be filed with Corporations Canada and made publicly accessible through a registry. Provincial requirements vary: BC (since 2020), Ontario (since 2023), and others have similar registers. Key details to record: full legal name, date of birth, last known address, residential address, citizenship, date became ISC, nature of control. Penalties for non-compliance with CBCA: up to $200,000 fine for corporations, up to $200,000 and/or 6 months imprisonment for individuals.",
  },
  // ── CRA / Payroll ─────────────────────────────────────────────────────────
  {
    source: "payroll",
    title: "CRA Payroll — Employer Obligations",
    content: "Canadian employers must deduct and remit three types of payroll deductions: (1) Income Tax — based on employee's TD1 form and province of employment; (2) Canada Pension Plan (CPP) — 5.95% employee + 5.95% employer (2024) on pensionable earnings between $3,500 and $68,500; (3) Employment Insurance (EI) — 1.66% employee + 2.32% employer on insurable earnings up to $63,200 (2024). Remittance schedule: regular (monthly), quarterly (if payroll < $3,000 average monthly), accelerated (semi-monthly for $25,000–$99,999 average monthly). T4 slips due February 28 each year for prior year. ROE (Record of Employment) required within 5 calendar days of interruption of earnings. Penalties: 10% for late remittances, 20% for repeat failures.",
  },
  // ── Global Frameworks ────────────────────────────────────────────────────
  {
    source: "gdpr",
    title: "GDPR — Overview for Canadian Organizations",
    content: "The EU General Data Protection Regulation (GDPR) applies to Canadian organizations that offer goods/services to EU residents or monitor EU residents' behaviour. Key GDPR requirements: (1) Lawful basis for processing (consent, legitimate interest, contract, legal obligation); (2) Data Subject Rights: access, rectification, erasure, portability, objection; (3) Privacy by Design and by Default; (4) Data Protection Impact Assessments (DPIAs) for high-risk processing; (5) 72-hour breach notification to supervisory authority; (6) Data Protection Officer (DPO) for certain organizations. Penalties: up to €20M or 4% of global annual turnover. GDPR adequacy: EU recognized Canada's PIPEDA as adequate for transfers, but this may need renewal under CPPA. GDPR Article 3 — territorial scope.",
  },
  {
    source: "hipaa",
    title: "HIPAA — Health Data Requirements",
    content: "The Health Insurance Portability and Accountability Act (HIPAA) is a US federal law that applies to covered entities (healthcare providers, health plans, clearinghouses) and business associates that handle Protected Health Information (PHI). Canadian organizations that provide services to US healthcare entities may be subject to HIPAA as business associates. Key requirements: HIPAA Privacy Rule (permissible uses/disclosures of PHI), HIPAA Security Rule (administrative, physical, technical safeguards for electronic PHI), HIPAA Breach Notification Rule (notify within 60 days). Penalties: $100 to $50,000 per violation, annual cap $1.9M. Canadian health data law: provinces have their own health privacy acts (Ontario PHIPA, Quebec LSSSS) that may apply alongside.",
  },
  {
    source: "soc2",
    title: "SOC 2 — Trust Services Criteria",
    content: "SOC 2 (System and Organization Controls 2) is a US auditing standard by AICPA based on 5 Trust Services Criteria (TSC): Security (common criteria, mandatory), Availability, Processing Integrity, Confidentiality, and Privacy. Type I report: tests design of controls at a point in time. Type II report: tests effectiveness of controls over a period (6-12 months) — preferred by enterprise buyers. Common criteria include: logical access (CC6), change management (CC8), risk assessment (CC3), monitoring (CC4), incident response (CC7). For Canadian SaaS companies: SOC 2 Type II is increasingly required by enterprise procurement. Typically takes 6-12 months and $30,000-$75,000 for first audit. AICPA AT-C 205.",
  },
  // ── Product / CanCompliance Platform ─────────────────────────────────────
  {
    source: "product",
    title: "CanCompliance — Product Overview",
    content: "CanCompliance is a full-stack Canadian compliance SaaS platform for small and medium businesses (SMBs). Version 5.0 includes 21 Canadian compliance modules, 6 global frameworks (SOC 2, ISO 27001, GDPR, HIPAA, NIST AI RMF, EU AI Act), a universal control library with 50 controls, role-based toolsets for 3 personas (Compliance Officer, Auditor, Business Owner), enterprise platform layer (Monitoring Center, Integrations Hub, Workforce Compliance, AI Remediation), intelligence layer (Compliance Inbox, Red Tape Calculator, Legislation Tracker, Document Scanner, Benchmarking), and Website QA Scanner for AODA and SEO. The platform provides automated compliance checks, AI-powered guidance via Claude Sonnet, and audit-ready evidence collection.",
  },
  {
    source: "product",
    title: "CanCompliance — Pricing Tiers",
    content: "CanCompliance pricing: Free tier ($0/month) — 3 compliance checks/month, basic modules, AI Copilot 5 queries, suitable for solopreneurs evaluating the platform. Starter tier ($29/month) — unlimited compliance checks, all 21 Canadian modules, AI Copilot 50 queries, PDF export, for SMBs with 1-19 employees. Professional tier ($79/month) — everything in Starter plus full Enterprise Platform (Monitoring Center, Integrations Hub, Workforce Compliance), API access, suitable for growing businesses with 20-99 employees. Agency tier ($249/month) — everything plus multi-client workspace, white-label reports, priority support, for compliance consultants and organizations with 100+ employees.",
  },
  {
    source: "product",
    title: "CanCompliance — AI Copilot Features",
    content: "CanCompliance AI Copilot is powered by Anthropic Claude Sonnet. It is a specialized Canadian compliance assistant with expertise in CASL, PIPEDA, Bill 96/Law 25, Employment Standards, WSIB/WCB, CRA Payroll, Bill S-211, CARM, and all 21 Canadian compliance modules. The Copilot provides streaming real-time responses, conversation history persisted per user, and always includes specific statute section citations (e.g., 'CASL S.11(1)', 'PIPEDA Schedule 1, Principle 8'). Requires explicit AI consent acceptance before first use. Rate limited to 15 queries/minute. Now RAG-enhanced: retrieves relevant compliance chunks from the knowledge base to ground answers in accurate, specific regulatory content.",
  },
  {
    source: "product",
    title: "CanCompliance — Document Library and RAG",
    content: "CanCompliance Document Library allows users to upload their own compliance documents (contracts, policies, agreements, regulatory filings) and ask questions about them using RAG (Retrieval-Augmented Generation). Documents are chunked and indexed using PostgreSQL full-text search. When a user asks a question, the system retrieves the most relevant chunks from both the internal compliance knowledge base and the user's uploaded documents, then uses Claude Sonnet to generate a grounded answer with source attribution. This allows compliance officers and auditors to interrogate their own policy documents, vendor contracts, and procedures against Canadian regulatory standards.",
  },
  {
    source: "product",
    title: "CanCompliance — Enterprise Platform Features",
    content: "CanCompliance Enterprise Platform (Professional tier and above) includes: Monitoring Center — 12 compliance modules on automated 5-hour scan schedules with alerts and activity feed; Integrations Hub — 12 integrations (GitHub, AWS, Google Workspace, Slack, Jira, BambooHR, M365, Okta, ServiceNow, DocuSign, Snowflake, Salesforce) for automated evidence collection; Workforce Compliance — security training matrix (8 employees × 6 modules), onboarding/offboarding checklists with Canadian statute references (PIPEDA, ESA, PCMLTFA); AI Remediation — generates compliance code fixes and policy templates for 8 violation types with multi-language code tabs.",
  },
  {
    source: "product",
    title: "CanCompliance — Intelligence Layer",
    content: "CanCompliance Intelligence Layer provides: Compliance Inbox — curated regulatory updates with real Canadian enforcement cases (CRTC $1.1M CASL fine, CPPA Senate reading, BC Pay Transparency); Red Tape Calculator — quantifies compliance burden in hours and dollars using CFIB methodology (735-hour/year national average); Legislation Tracker — tracks 12 real Canadian bills through Parliament including C-27, C-26, C-63, AIDA; Benchmarking — anonymously compares user compliance score vs. national/industry/provincial averages; Government Programs — tracks 9 programs including OSFI FinTech Sandbox, CRI $1.7M fund, Regulators' Capacity Fund $3.8M; Trust Network — B2B compliance proof sharing with suppliers.",
  },
  // ── Market Context ────────────────────────────────────────────────────────
  {
    source: "market",
    title: "Canadian RegTech Market — Size and Opportunity",
    content: "The global RegTech market is projected to reach USD 19.6 billion in 2025, with a CAGR of nearly 23% to 2032. Canada's compliance services market is $4.2B annually. The Canadian Federation of Independent Business (CFIB) estimates Canadian businesses spend 768 million hours annually on compliance, with regulatory costs reaching $51.5 billion annually in 2024 — $17.9 billion attributed to red tape specifically. There are 1.2 million+ Canadian SMBs (1-499 employees). The window to establish a 'Canadian compliance OS' is real: no dominant Canadian-first compliance SaaS operates below the enterprise price point. Global incumbents (OneTrust, ServiceNow GRC) cost $50,000-$500,000/year, pricing out SMBs.",
  },
  {
    source: "market",
    title: "Government Partnership Opportunity — Canada",
    content: "The Canadian government is actively funding RegTech: Centre for Regulatory Innovation (CRI) — committed $1.7M over three years for streamlining approval processes and modernizing standards. Regulators' Capacity Fund — $3.8M to modernize regulations through RegTech projects. BizPaL expansion — includes legislation and compliance documentation to help businesses find applicable regulations. OSFI FinTech Sandbox — regulatory sandbox for financial services RegTech. FCAC Consumer Protection Pilot — testing digital compliance tools. The government is both a regulatory body AND a paying customer and distribution channel. CRA API integration enables automated tax compliance checking. These are open application programs — no political connections required, only a working product.",
  },
  // ── Website QA ────────────────────────────────────────────────────────────
  {
    source: "websiteqa",
    title: "Website QA — WCAG 2.0 AA Critical Requirements",
    content: "For AODA compliance (organizations with 20+ employees in Ontario), websites must meet WCAG 2.0 Level AA. Critical requirements: (1) 1.1.1 Non-text Content — all images need alt text; decorative images use alt=''; (2) 1.4.3 Contrast — 4.5:1 minimum for normal text, 3:1 for large text (18pt+ or 14pt bold); (3) 2.1.1 Keyboard — all functionality available via keyboard without specific timing; (4) 2.4.1 Bypass Blocks — skip navigation link as first focusable element; (5) 2.4.7 Focus Visible — visible focus indicator (never use outline:none globally); (6) 3.1.1 Language of Page — html lang attribute required. Maximum AODA penalty: $100,000/day for corporations. Website QA Scanner in CanCompliance automates these checks.",
  },
  {
    source: "websiteqa",
    title: "SEO — Technical Optimization Requirements",
    content: "Technical SEO essentials for Canadian B2B SaaS: (1) Meta descriptions — unique 150-160 character descriptions on every page; (2) Open Graph tags — og:title, og:description, og:image (1200×630px), og:url for social sharing; (3) Single H1 per page with primary keyword; (4) Core Web Vitals — LCP < 2.5s (good), FID < 100ms, CLS < 0.1; Google ranking signal since 2021; (5) Schema.org JSON-LD — SoftwareApplication, Organization, FAQ schemas for rich results in SERPs; (6) Next-gen image formats — WebP/AVIF reduce file size 25-50%; (7) Canonical URLs — prevent duplicate content on filtered/paginated pages; (8) Title tags — 50-60 characters, front-load primary keyword. CanCompliance Website QA Scanner audits all of these.",
  },
  // ── User Stories Excerpts ─────────────────────────────────────────────────
  {
    source: "user_stories",
    title: "User Story — CASL Email Compliance Check",
    content: "As a marketing manager at a Canadian company, I want to verify my email marketing program meets CASL requirements so I can avoid fines up to $10M per violation. The CASL checker covers all three CASL pillars: consent (express vs. implied), identification (sender name, contact info), and unsubscribe (functional mechanism, 10 business day processing, 60-day validity). Each question includes the relevant statute. A PASS result confirms compliance with specific citations. A FAIL result shows the specific violation and remediation steps. Fine exposure ($1M individual / $10M corporate) is shown on FAIL. Results are persisted to the audit trail with timestamp for regulatory evidence purposes.",
  },
  {
    source: "user_stories",
    title: "User Story — Onboarding and Time to First Check",
    content: "New CanCompliance users go through a 4-step onboarding modal: (1) Province selection — Quebec selection triggers Law 25 notice; Ontario triggers AODA notice; (2) Business type selection — tech, retail, finance, healthcare, other; (3) Live CASL demo check; (4) Initial compliance score display. Goal: time-to-first-compliance-check under 5 minutes from signup. The dashboard shows prominent Quick Actions with 3-5 top compliance checks. Demo role sessions allow prospects to explore as Compliance Officer, Auditor, or Business Owner without creating an account. Each demo role shows a personalized dashboard with role-specific pinned tools and welcome message.",
  },
  {
    source: "user_stories",
    title: "User Story — Board Compliance Report",
    content: "As a Compliance Officer preparing for a board meeting, I want to generate a board-ready compliance report in one click so I can present our regulatory standing to directors. The Board Report tool generates a formatted report with sections: Executive Summary (overall score, key risks), Compliance Score by module, Open Items with owners and due dates, Upcoming regulatory deadlines, and a 90-day trend line. The report cites the specific Canadian statutes that apply to the organization. It can be exported as PDF. The report is role-specific to Compliance Officers. Related tools include Policy Attestation for tracking employee policy sign-offs and Vendor Risk scorecard for third-party risk.",
  },
];
