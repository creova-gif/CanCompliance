import { Link } from "wouter";
import { PublicNav, PublicFooter } from "@/components/PublicLayout";
import {
  Shield, FileText, Bot, BarChart3, Lock, Globe, Clock, Award,
  AlertTriangle, TrendingUp, Gavel, Calculator, ScanLine, Inbox,
  Share2, Lightbulb, Recycle, Package, DollarSign, HardHat,
  ArrowRight, CheckCircle, Zap, Users, Search, MapPin, ChevronRight
} from "lucide-react";

const COMPLIANCE_MODULES = [
  {
    icon: Shield, name: "CASL", full: "Canada's Anti-Spam Legislation",
    desc: "Check consent collection, unsubscribe mechanisms, implied vs. express consent. Automatic 3-year expiry tracking. CRTC-ready audit exports.",
    penalty: "Up to $10M/day", badge: "Most Enforced",
    checks: ["Express consent verification", "Unsubscribe mechanism audit", "Consent record export", "Sender ID compliance"],
  },
  {
    icon: Lock, name: "PIPEDA", full: "Personal Information Protection and Electronic Documents Act",
    desc: "Privacy officer appointment, breach notification (72-hour rule), consent collection, data portability, and cross-border transfer obligations.",
    penalty: "Up to $100K", badge: null,
    checks: ["Privacy policy audit", "Breach notification readiness", "Cross-border transfer check", "Data retention compliance"],
  },
  {
    icon: Globe, name: "Bill 96 / French Language", full: "An Act Respecting French, the Official and Common Language of Québec",
    desc: "Quebec French language requirements for business names, contracts, workplace signage, e-commerce, and all customer-facing communications.",
    penalty: "Up to $30K", badge: "Quebec Required",
    checks: ["Website language compliance", "Contract translation check", "Employee communication review", "Label requirements"],
  },
  {
    icon: Search, name: "FINTRAC / AML", full: "Financial Transactions and Reports Analysis Centre",
    desc: "Anti-money laundering obligations, KYC procedures, beneficial ownership disclosure, STR/EFTR reporting, compliance program requirements.",
    penalty: "Criminal liability", badge: null,
    checks: ["KYC procedure audit", "Beneficial ownership check", "STR reporting readiness", "Compliance officer review"],
  },
  {
    icon: FileText, name: "GST/HST", full: "Goods and Services / Harmonized Sales Tax",
    desc: "Registration threshold checks, filing frequency determination, input tax credits, digital services rules for SaaS and online businesses.",
    penalty: "Penalties + interest", badge: null,
    checks: ["Registration threshold check", "Filing frequency review", "Digital services applicability", "ITC eligibility"],
  },
  {
    icon: Users, name: "Employment Standards", full: "Provincial Employment Standards",
    desc: "Minimum wage by province, overtime, vacation pay, termination notice, statutory holidays — province-specific for ON, BC, QC, AB, SK, MB.",
    penalty: "ESA Orders to Pay", badge: "Multi-Province",
    checks: ["Minimum wage compliance", "Overtime calculation", "Termination notice audit", "Holiday entitlement review"],
  },
  {
    icon: DollarSign, name: "Payroll (CPP/EI)", full: "Canada Pension Plan & Employment Insurance",
    desc: "CPP contribution rates (2024: 5.95%), EI premiums, employer matching requirements, T4/T4A remittance deadlines, source deduction tables.",
    penalty: "10–20% penalty", badge: null,
    checks: ["CPP rate compliance", "EI premium calculation", "Remittance deadline audit", "T4 reporting check"],
  },
  {
    icon: HardHat, name: "Workplace Safety (OHS)", full: "Occupational Health & Safety",
    desc: "JHSC requirements by province, 72-hour incident reporting, WSIB registration, psychological safety obligations, federal Part II review.",
    penalty: "Up to $1.5M", badge: null,
    checks: ["JHSC requirement check", "Incident reporting audit", "WSIB registration review", "Psychological safety compliance"],
  },
  {
    icon: Package, name: "CCPSA / Product Safety", full: "Canada Consumer Product Safety Act",
    desc: "Product labelling (bilingual, safety warnings), incident reporting obligations, voluntary recall procedures, import documentation.",
    penalty: "Up to $5M", badge: null,
    checks: ["Label compliance audit", "Incident reporting readiness", "Recall procedure check", "Import documentation review"],
  },
  {
    icon: Globe, name: "Supply Chain / S-211", full: "Fighting Against Forced Labour and Child Labour in Supply Chains Act",
    desc: "Modern Slavery Act annual reporting — supply chain due diligence for importers and manufacturers. First reports due May 31 annually.",
    penalty: "Up to $250K", badge: "New 2024",
    checks: ["Reporting obligation check", "Supply chain mapping", "Due diligence audit", "Public report requirements"],
  },
  {
    icon: Recycle, name: "ESG / Greenwashing", full: "Competition Act Environmental Claims",
    desc: "Competition Bureau greenwashing enforcement, environmental claim substantiation requirements, penalty exposure calculation.",
    penalty: "3% of global revenue", badge: "Active Enforcement",
    checks: ["Environmental claim audit", "Substantiation requirement", "Marketing review", "Penalty exposure estimate"],
  },
  {
    icon: Recycle, name: "EPR / Packaging", full: "Extended Producer Responsibility",
    desc: "Ontario Blue Box Program, Quebec's eco-responsible packaging regulations, producer fee calculation, take-back program obligations.",
    penalty: "Provincial fines", badge: null,
    checks: ["EPR registration check", "Packaging audit", "Producer fee estimate", "Take-back compliance"],
  },
  {
    icon: Bot, name: "AI Governance", full: "Artificial Intelligence & Data Act (AIDA)",
    desc: "AIDA readiness, automated decision-making disclosure, algorithmic transparency, forthcoming high-impact AI system obligations.",
    penalty: "Up to $25M (forthcoming)", badge: "Future Risk",
    checks: ["AIDA readiness assessment", "Automated decision audit", "Transparency disclosure", "High-impact system review"],
  },
  {
    icon: Package, name: "Customs / CARM", full: "CBSA Assessment and Revenue Management",
    desc: "CBSA CARM importer registration, Release Prior to Payment bond requirements, HS code classification, origin documentation.",
    penalty: "Seizure + penalties", badge: null,
    checks: ["CARM registration check", "RPP bond assessment", "HS code review", "Origin documentation audit"],
  },
];

const INTELLIGENCE_FEATURES = [
  { icon: Inbox, name: "Compliance Inbox", desc: "Real enforcement actions and regulatory updates — CRTC $1.1M CASL fine, CPPA Third Reading, BC Pay Transparency. Filtered to your business type. Weekly digest email.", color: "#c8f135" },
  { icon: Gavel, name: "Legislation Tracker", desc: "12 real Canadian bills in active development (C-27, C-26, C-63, AIDA, S-209, Bill 96, Solomon AI Bill, and more). In-force date estimates + your readiness score per bill.", color: "#c8f135" },
  { icon: Calculator, name: "Red Tape Calculator", desc: "5-input calculator: business size, industry, province, revenue, hourly rate. 7-category cost breakdown per CFIB data. 735-hr national average comparison. CanCompliance savings card.", color: "#c8f135" },
  { icon: ScanLine, name: "Document Scanner", desc: "Paste any contract, policy, or agreement. Claude Sonnet applies a Canadian compliance system prompt and returns a structured violation report with statute citations and penalty amounts.", color: "#c8f135" },
  { icon: BarChart3, name: "Benchmarking", desc: "Your score vs. national/industry/province averages. Score distribution histogram. Network-wide pass rates (CASL 48%, PIPEDA 44%). 6 most common violations by sector.", color: "#c8f135" },
  { icon: Lightbulb, name: "Government Programs", desc: "9 programs: Centre for Regulatory Innovation ($1.7M), Regulators' Capacity Fund ($3.8M), OSFI FinTech Sandbox, BizPaL, CRA API, Ontario Red Tape Challenge — with eligibility checker.", color: "#c8f135" },
  { icon: Share2, name: "Trust Network", desc: "Send compliance proof requests to suppliers via email — select CASL, PIPEDA, S-211, Employment, ESG, FINTRAC. Requests tracked with Pending/Verified/Overdue status. Network trust score.", color: "#c8f135" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Set up your profile", desc: "Tell us your province, business size, and industry. Takes 60 seconds. CanCompliance filters to only the laws that apply to your specific situation." },
  { step: "02", title: "Run compliance checks", desc: "Select any module — CASL, PIPEDA, Bill 96, FINTRAC, Employment Standards. Answer targeted questions. Get a pass/fail result with the exact statute section and penalty in under 3 minutes." },
  { step: "03", title: "Fix what's flagged", desc: "Every violation comes with a precise remediation plan. Not vague advice — the exact steps, in order, citing the specific subsection and deadline. AI Copilot answers follow-up questions instantly." },
];

const PLATFORM_FEATURES = [
  { icon: Bot, title: "AI Copilot — Claude & GPT", desc: "Ask any compliance question, get statute-cited answers from Claude Sonnet or GPT-5.2. Persistent conversation history. Jurisdiction-aware responses." },
  { icon: BarChart3, title: "Live Compliance Score", desc: "Your real-time score updates as you run checks. Export a compliance certificate showing your status across all 16 modules." },
  { icon: Lock, title: "CASL Consent Ledger", desc: "Tamper-evident consent records with automatic 3-year expiry tracking. Express and implied consent history — CRTC-ready export." },
  { icon: Clock, title: "Compliance Deadlines", desc: "Personal compliance calendar — T4 deadlines, FINTRAC filings, WSIB renewals, remittance dates — with 30-day advance alerts." },
  { icon: MapPin, title: "Jurisdiction Intelligence", desc: "Set your province and size once. Only the rules that apply to your business and your province are surfaced — no noise." },
  { icon: FileText, title: "Audit Trail", desc: "Every compliance action logged with timestamp, user, and result. Full history for legal due diligence, investor requests, and regulatory inquiries." },
  { icon: Award, title: "Compliance Certificate", desc: "A dated certificate showing your compliance status across all modules — downloadable PDF to share with partners, investors, and regulators." },
  { icon: TrendingUp, title: "Remediation Plans", desc: "Every violation comes with a step-by-step fix plan citing the exact statute. Not just a score — a complete roadmap to compliance." },
  { icon: AlertTriangle, title: "Control Mapper", desc: "Map your existing IT and operational controls to Canadian statutory obligations. Understand your compliance gap at a glance." },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        <div
          className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse at center, #c8f135 0%, transparent 70%)" }}
        />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-primary tracking-[3px] uppercase mb-6 border border-primary/20 rounded-full px-3 py-1 bg-primary/5">
            <Zap className="w-3 h-3" />
            16 modules · 7 intelligence tools · AI Copilot
          </div>
          <h1 className="font-serif italic text-5xl md:text-6xl text-foreground leading-tight mb-5">
            One platform.<br /><span style={{ color: "#c8f135" }}>Every Canadian law.</span>
          </h1>
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            CanCompliance checks your business against 16 compliance modules in under 3 minutes.
            Every result cites the exact statute, the maximum penalty, and the specific steps to fix it.
            Built for Canadian SMBs — not compliance consultants.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link href="/sign-up">
              <button data-testid="btn-features-start" className="px-7 py-3.5 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: "#c8f135", color: "#09090a" }}>
                Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-7 py-3.5 rounded-lg text-[13px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                View Pricing
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-7 py-3.5 rounded-lg text-[13px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-1.5">
                Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "16", label: "Compliance Modules" },
              { value: "$51.5B", label: "Fines issued annually" },
              { value: "735h", label: "Avg hours wasted/yr" },
              { value: "3 min", label: "Average check time" },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                <div className="text-2xl font-semibold mb-1" style={{ color: "#c8f135" }}>{s.value}</div>
                <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">How it works</div>
          <h2 className="font-serif italic text-4xl text-foreground mb-3">From sign-up to compliant in 10 minutes.</h2>
          <p className="text-[14px] text-muted-foreground max-w-xl mx-auto">No consultants. No legal jargon. No guesswork.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px border-t border-dashed border-border" />
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} className="bg-card border border-border rounded-2xl p-7 relative">
              <div className="font-mono text-[36px] font-bold mb-4 leading-none" style={{ color: "#c8f13520" }}>{step.step}</div>
              <h3 className="text-[15px] font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 14 Compliance Modules */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">The compliance engine</div>
          <h2 className="font-serif italic text-4xl text-foreground mb-3">16 compliance modules. Checked in seconds.</h2>
          <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
            Every module cites the exact statute section, the maximum penalty, and the remediation steps.
            Not vague advice — precise answers with statute numbers.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COMPLIANCE_MODULES.map(m => (
            <div key={m.name} className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <m.icon className="w-4.5 h-4.5 text-primary" style={{ width: "1.1rem", height: "1.1rem" }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-foreground">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{m.full}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {m.badge && (
                    <div className="font-mono text-[9px] px-1.5 py-0.5 rounded mb-1" style={{ background: "#c8f13520", color: "#c8f135" }}>{m.badge}</div>
                  )}
                  <div className="font-mono text-[9px] text-fail font-medium">{m.penalty}</div>
                </div>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{m.desc}</p>
              <div className="grid grid-cols-2 gap-1">
                {m.checks.map(c => (
                  <div key={c} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-pass flex-shrink-0" />
                    <span className="text-[10px] text-muted-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence Layer */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(200,241,53,0.03) 50%, transparent 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-primary tracking-[3px] uppercase mb-3 border border-primary/20 rounded-full px-3 py-1 bg-primary/5">
              <Zap className="w-3 h-3" />
              Intelligence Layer — v5.0
            </div>
            <h2 className="font-serif italic text-4xl text-foreground mb-3">Beyond checklists. <span style={{ color: "#c8f135" }}>Real intelligence.</span></h2>
            <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
              7 intelligence tools that turn compliance from reactive to proactive. Real-time regulatory updates, AI document scanning,
              benchmarking data, and government program matching — no competitor in Canada has built this layer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTELLIGENCE_FEATURES.map((f, i) => (
              <div key={f.name} className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all group overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "radial-gradient(ellipse at top left, rgba(200,241,53,0.04) 0%, transparent 60%)" }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#c8f13515" }}>
                      <f.icon className="w-4 h-4" style={{ color: "#c8f135" }} />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">{String(i + 1).padStart(2, "0")} / 07</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-foreground mb-2">{f.name}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Platform</div>
          <h2 className="font-serif italic text-4xl text-foreground mb-3">Built to make compliance stick.</h2>
          <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">Every feature designed around how Canadian SMBs actually work — not how lawyers bill.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {PLATFORM_FEATURES.map(f => (
            <div key={f.title} className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center mb-4">
                <f.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="text-[13px] font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-8 text-center">Trusted by Canadian businesses</div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "We avoided a $45,000 CASL fine we didn't even know was coming. The unsubscribe audit caught it before the CRTC did.", name: "Sarah M.", role: "Marketing Director, Toronto e-commerce brand" },
            { quote: "Finally a tool that understands Quebec. The Bill 96 checker saved us months of legal fees.", name: "Jean-François B.", role: "CEO, Montreal SaaS company" },
            { quote: "The AI copilot is genuinely useful. It's like having a compliance lawyer on call who actually explains things clearly.", name: "Priya K.", role: "Founder, Calgary professional services firm" },
          ].map(t => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-6">
              <div className="text-[13px] text-muted-foreground leading-relaxed mb-5 italic">"{t.quote}"</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-primary">{t.name[0]}</span>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-foreground">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto w-full">
        <div className="rounded-2xl p-14 border relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.06) 0%, rgba(18,183,106,0.03) 100%)", borderColor: "rgba(200,241,53,0.18)" }}>
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(ellipse at center, #c8f135 0%, transparent 70%)" }} />
          <div className="relative">
            <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">16 modules · 3 minutes</div>
            <h2 className="font-serif italic text-4xl text-foreground mb-4">Start your free compliance check today</h2>
            <p className="text-[14px] text-muted-foreground mb-8 max-w-lg mx-auto">3 free checks every month. No credit card. No lawyers. Just answers with statute citations.</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/sign-up">
                <button className="px-8 py-4 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: "#c8f135", color: "#09090a" }}>
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="px-8 py-4 rounded-lg text-[14px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/pricing">
                <button className="px-8 py-4 rounded-lg text-[14px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  See Pricing
                </button>
              </Link>
            </div>
            <p className="mt-5 text-[11px] text-muted-foreground">3 checks free monthly · Cancel anytime · Not legal advice</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
