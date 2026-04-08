import { Link } from "wouter";
import { SignUpButton } from "@clerk/react";
import { PublicNav, PublicFooter } from "@/components/PublicLayout";
import {
  Shield, FileText, Bot, BarChart3, Lock, Globe, Clock, Award,
  AlertTriangle, TrendingUp, Gavel, Calculator, ScanLine, Inbox,
  Share2, Lightbulb, Recycle, Package, DollarSign, HardHat,
  ArrowRight, CheckCircle, Zap, Users
} from "lucide-react";

const COMPLIANCE_MODULES = [
  { icon: Shield, name: "CASL", desc: "Commercial email consent, unsubscribe mechanisms, implied vs. express consent — CRTC-ready audit trail.", penalty: "Up to $10M/day", badge: "Most Cited" },
  { icon: Lock, name: "PIPEDA", desc: "Privacy officer appointment, breach notification, consent collection, data portability obligations.", penalty: "Up to $100K", badge: null },
  { icon: Globe, name: "Bill 96 / French Language", desc: "Quebec French language requirements for business names, contracts, workplace signage, and commerce.", penalty: "Up to $30K", badge: "Quebec" },
  { icon: DollarSign, name: "FINTRAC / AML", desc: "Anti-money laundering obligations, KYC procedures, beneficial ownership disclosure, suspicious transaction reporting.", penalty: "Criminal liability", badge: null },
  { icon: FileText, name: "GST/HST", desc: "Registration thresholds, filing frequency, input tax credits, digital services rules.", penalty: "Penalties + interest", badge: null },
  { icon: Users, name: "Employment Standards", desc: "Minimum wage, overtime, vacation pay, termination notice — province-specific rules for Ontario, BC, Quebec, Alberta.", penalty: "ESA Orders to Pay", badge: "Multi-Province" },
  { icon: DollarSign, name: "Payroll (CPP/EI)", desc: "CPP contribution rates, EI premiums, employer matching, T4 remittance deadlines.", penalty: "10–20% penalty", badge: null },
  { icon: HardHat, name: "Workplace Safety (OHS)", desc: "JHSC requirements, incident reporting (72-hour), WSIB registration, psychological safety obligations.", penalty: "Up to $1.5M", badge: null },
  { icon: Package, name: "CCPSA / Product Safety", desc: "Canada Consumer Product Safety Act — product labelling, incident reporting, recall obligations.", penalty: "Up to $5M", badge: null },
  { icon: Globe, name: "Supply Chain / S-211", desc: "Modern Slavery Act annual reporting — supply chain due diligence for importers and manufacturers.", penalty: "Up to $250K", badge: "New 2024" },
  { icon: Recycle, name: "ESG / Greenwashing", desc: "Competition Act greenwashing rules, environmental claim substantiation, Competition Bureau enforcement.", penalty: "3% of global revenue", badge: "Active Enforcement" },
  { icon: Recycle, name: "EPR / Packaging", desc: "Extended Producer Responsibility — Blue Box regs, packaging take-back programs, producer fees.", penalty: "Provincial fines", badge: null },
  { icon: Bot, name: "AI Governance", desc: "AIDA readiness, automated hiring/lending disclosure, algorithmic transparency, forthcoming AI regulations.", penalty: "Up to $25M (forthcoming)", badge: "Future Risk" },
  { icon: Package, name: "Customs / CARM", desc: "CBSA Assessment and Revenue Management, importer registration, Release Prior to Payment bond.", penalty: "Seizure + penalties", badge: null },
];

const INTELLIGENCE_FEATURES = [
  { icon: Inbox, name: "Compliance Inbox", desc: "Real regulatory updates — enforcement actions, fines, new laws — filtered by the rules that affect your business. Your daily compliance brief.", color: "#c8f135" },
  { icon: Gavel, name: "Legislation Tracker", desc: "12 real Canadian bills in active development. Track estimated in-force dates, penalties, and what to do now.", color: "#c8f135" },
  { icon: Calculator, name: "Red Tape Calculator", desc: "Quantify your compliance burden in hours and dollars. Compare to the 735-hr national average. See your CanCompliance savings.", color: "#c8f135" },
  { icon: ScanLine, name: "Document Scanner", desc: "Paste any contract, policy, or agreement. Claude Sonnet returns a statute-cited violation report with every fix specified.", color: "#c8f135" },
  { icon: BarChart3, name: "Benchmarking", desc: "Your compliance score vs. your sector and province. Score distribution histogram. Network-wide pass rates (CASL 48%, PIPEDA 44%).", color: "#c8f135" },
  { icon: Lightbulb, name: "Government Programs", desc: "9 real programs — Centre for Regulatory Innovation ($1.7M), Regulators' Capacity Fund ($3.8M), BizPaL — with eligibility checker.", color: "#c8f135" },
  { icon: Share2, name: "Trust Network", desc: "Request compliance proof from suppliers and vendors. Build a verified trust profile. B2B compliance in one click.", color: "#c8f135" },
];

const PLATFORM_FEATURES = [
  { icon: Bot, title: "AI Copilot — Claude & GPT", desc: "Ask any compliance question. Get statute-cited answers from Claude Sonnet or GPT-5.2. Persistent conversation history." },
  { icon: BarChart3, title: "Live Compliance Score", desc: "Your score updates in real time as you run checks. Export a compliance certificate to share with clients and investors." },
  { icon: Lock, title: "CASL Consent Ledger", desc: "Tamper-evident consent records with automatic expiry tracking. Express and implied consent history — CRTC-ready." },
  { icon: Clock, title: "Compliance Deadlines", desc: "Your personal compliance calendar — filing dates, renewal deadlines, and penalty-risk dates with 30-day alerts." },
  { icon: Globe, title: "Jurisdiction Intelligence", desc: "Set your province and size once. Only the rules that apply to your business, in your province, are surfaced." },
  { icon: FileText, title: "Audit Trail", desc: "Every compliance action logged with timestamp, user, and result. Full audit history for legal due diligence." },
  { icon: Award, title: "Compliance Certificate", desc: "A dated certificate showing your compliance status across all modules — share with partners, investors, and regulators." },
  { icon: TrendingUp, title: "Remediation Plans", desc: "Every violation comes with a step-by-step fix plan citing the exact statute. Not just a score — a roadmap." },
  { icon: AlertTriangle, title: "Control Mapper", desc: "Map your existing IT and business controls to Canadian statutory obligations. Understand your gap at a glance." },
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
            Everything Canadian businesses need
          </div>
          <h1 className="font-serif italic text-5xl md:text-6xl text-foreground leading-tight mb-5">
            One platform.<br /><span style={{ color: "#c8f135" }}>Every Canadian law.</span>
          </h1>
          <p className="text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            14 compliance modules. AI-powered analysis. Real-time statute citations. 
            Intelligence tools no competitor has for Canada.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16">
            <SignUpButton mode="modal">
              <button className="px-7 py-3.5 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: "#c8f135", color: "#09090a" }}>
                Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
            <Link href="/pricing">
              <button className="px-7 py-3.5 rounded-lg text-[13px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                View Pricing
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "14", label: "Compliance Modules" },
              { value: "$51.5B", label: "Fines avoided annually" },
              { value: "735h", label: "Hours saved per SMB" },
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

      {/* 14 Compliance Modules */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">The compliance engine</div>
          <h2 className="font-serif italic text-4xl text-foreground mb-3">14 Canadian laws. Checked in seconds.</h2>
          <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
            Every module cites the exact statute section, the maximum penalty, and the specific remediation steps. 
            Not vague advice — precise answers.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COMPLIANCE_MODULES.map(m => (
            <div key={m.name} className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <m.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-foreground">{m.name}</div>
                    {m.badge && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: "#c8f13520", color: "#c8f135" }}>{m.badge}</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Max Penalty</div>
                  <div className="font-mono text-[10px] text-fail font-medium">{m.penalty}</div>
                </div>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence Layer */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(200,241,53,0.03) 50%, transparent 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Intelligence Layer — v5.0</div>
            <h2 className="font-serif italic text-4xl text-foreground mb-3">Beyond checklists. <span style={{ color: "#c8f135" }}>Real intelligence.</span></h2>
            <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
              7 intelligence tools that turn compliance from reactive to proactive. No competitor in Canada has built this layer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTELLIGENCE_FEATURES.map((f, i) => (
              <div key={f.name} className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all group overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(200,241,53,0.04) 0%, transparent 60%)" }}
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#c8f13515" }}>
                      <f.icon className="w-4 h-4" style={{ color: "#c8f135" }} />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
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
          <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
            Every feature designed around how Canadian SMBs actually work — not how lawyers bill.
          </p>
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
        <div
          className="rounded-2xl p-14 border relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.06) 0%, rgba(18,183,106,0.03) 100%)", borderColor: "rgba(200,241,53,0.18)" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(ellipse at center, #c8f135 0%, transparent 70%)" }} />
          <div className="relative">
            <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">14 laws · 3 minutes</div>
            <h2 className="font-serif italic text-4xl text-foreground mb-4">Start your free compliance check today</h2>
            <p className="text-[14px] text-muted-foreground mb-8 max-w-lg mx-auto">3 free checks every month. No credit card. No lawyers required. Just answers with statute citations.</p>
            <div className="flex items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <button className="px-8 py-4 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: "#c8f135", color: "#09090a" }}>
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
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
