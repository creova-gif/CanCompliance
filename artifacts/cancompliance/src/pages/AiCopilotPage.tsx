import { Link } from "wouter";
import { PublicNav, PublicFooter } from "@/components/PublicLayout";
import { Bot, ArrowRight, Zap, MessageSquare, Shield, Globe, CheckCircle, Sparkles, Clock, FileText, Code2, ChevronRight } from "lucide-react";

const SAMPLE_CONVERSATIONS = [
  {
    q: "Is my CASL consent compliant if I use a pre-checked checkbox?",
    a: "No — a pre-checked checkbox does not satisfy CASL's express consent requirements under section 10(1). Express consent requires an opt-in mechanism where the individual actively checks the box themselves. A pre-checked box may only satisfy implied consent in limited circumstances (s.10(9)). Maximum penalty: $10M/day (s.20). Fix: Change to an unchecked opt-in checkbox with a clear description of what the person is consenting to receive.",
    model: "Claude Sonnet",
    statute: "CASL S.10(1), S.20",
  },
  {
    q: "What does PIPEDA say about sharing customer data with US vendors?",
    a: "Under PIPEDA Principle 4.1.3, you remain accountable for personal information transferred to third parties — including US-based vendors — for processing. You must ensure comparable levels of protection through contractual obligations. Disclose the cross-border transfer in your privacy policy. For Quebec customers, Law 25 requires a Privacy Impact Assessment (PIA) before any offshore transfer and explicit disclosure on your website. Penalty: $100,000 (PIPEDA); up to $25M or 4% of revenue (Law 25).",
    model: "GPT-5.2",
    statute: "PIPEDA Sch.1 Prin.4.1.3; Law 25 S.17, S.63.3",
  },
  {
    q: "Do I need a French version of my website for Quebec customers?",
    a: "Under Bill 96 (An Act Respecting French), businesses that provide services to Quebec consumers must make their website available in French. If you offer an English version, you must offer a French version of equal quality. This applies to online businesses serving Quebec regardless of where you're incorporated. Deadline: June 1, 2025 for most provisions. Penalty: up to $30,000 for first offence; up to $115,000 for repeat offence.",
    model: "Claude Sonnet",
    statute: "Bill 96 / Charter of the French Language S.52, S.206",
  },
  {
    q: "What are the WSIB reporting deadlines for new employers in Ontario?",
    a: "Under the Workplace Safety and Insurance Act (WSIA), new employers must register with WSIB within 10 days of hiring their first employee. Serious workplace injuries must be reported within 3 days. Fatalities must be reported immediately by phone. Premium remittances are due quarterly for new accounts. Failure to register: retroactive premiums + 25% surcharge + potential prosecution. Failure to report injury: up to $500,000 penalty.",
    model: "GPT-5.2",
    statute: "WSIA S.10, S.52; O. Reg. 175/98",
  },
];

const USE_CASES = [
  { icon: MessageSquare, title: "Real-time Q&A", desc: "Ask anything about Canadian compliance. Get an answer with the exact statute section and penalty range in seconds. No generalist advice." },
  { icon: FileText, title: "Contract review guidance", desc: "Paste a clause and ask if it's PIPEDA-compliant, CASL-compliant, or if it violates Employment Standards. Spots issues a generalist lawyer might miss." },
  { icon: Globe, title: "Province-specific rules", desc: "Quebec employment law is different from Ontario's. Get jurisdiction-specific answers, not generic Canadian advice — province is always considered." },
  { icon: Zap, title: "Regulation interpretation", desc: "New regulation published? Paste the section and ask what it means for your business. Translates legalese into plain English action steps." },
  { icon: Clock, title: "Deadline awareness", desc: "Ask about filing deadlines, remittance schedules, and renewal dates for any Canadian regulatory obligation. Every deadline is statute-backed." },
  { icon: Code2, title: "Technical compliance", desc: "How does your tech stack affect PIPEDA compliance? Does your SaaS cookie setup satisfy CASL? The AI understands both law and technology." },
];

const MODELS = [
  {
    name: "Claude Sonnet",
    by: "Anthropic",
    strength: "Deep legal reasoning, nuanced compliance analysis, multi-step statute interpretation. Preferred for complex multi-law questions.",
    badge: "Recommended",
    color: "#c8f135",
    icon: "◆",
  },
  {
    name: "GPT-5.2",
    by: "OpenAI",
    strength: "Comprehensive knowledge base, precise regulatory citations, strong performance on technical compliance questions and structured outputs.",
    badge: "Latest",
    color: "#7F77DD",
    icon: "●",
  },
];

const QUICK_QUESTIONS = [
  "Is my CASL consent compliant if I use a pre-checked checkbox?",
  "What does PIPEDA say about sharing customer data with third parties?",
  "Do I need French labels in Quebec for online-only products?",
  "What are the WSIB reporting deadlines for new employers in Ontario?",
  "Explain the key Bill 96 requirements for e-commerce businesses",
  "What are the new Ontario employment standards for remote workers?",
  "How do I calculate CPP contributions for a new employee?",
  "What triggers a FINTRAC reporting obligation for my business?",
];

export default function AiCopilotPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[600px] opacity-[0.055]"
          style={{ background: "radial-gradient(ellipse at 50% 30%, #c8f135 0%, transparent 60%)" }} />

        <div className="relative flex flex-col items-center">

          {/* ── Dual-model visual lockup ── */}
          <div className="flex items-center gap-5 mb-8">

            {/* Claude chip */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border text-[11px] font-mono font-medium shadow-sm"
              style={{ borderColor: "rgba(200,241,53,0.3)", background: "rgba(200,241,53,0.06)", color: "#c8f135" }}>
              <span style={{ fontSize: 9, letterSpacing: 1 }}>◆</span>
              Claude Sonnet
            </div>

            {/* Connector line left */}
            <div className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(200,241,53,0.3))" }} />

            {/* Center icon with rings */}
            <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
              {/* Slow-spinning outer ring */}
              <div className="absolute inset-0 rounded-full border border-dashed opacity-25"
                style={{ borderColor: "#c8f135", animation: "spin 16s linear infinite" }} />
              {/* Static inner ring */}
              <div className="absolute rounded-full border opacity-15"
                style={{ inset: 10, borderColor: "#c8f135" }} />
              {/* Glow */}
              <div className="absolute inset-0 rounded-full opacity-10 blur-md"
                style={{ background: "#c8f135" }} />
              {/* Icon */}
              <div className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.18) 0%, rgba(18,183,106,0.12) 100%)", border: "1px solid rgba(200,241,53,0.35)", boxShadow: "0 0 16px rgba(200,241,53,0.12)" }}>
                <Bot className="w-5 h-5" style={{ color: "#c8f135" }} />
              </div>
            </div>

            {/* Connector line right */}
            <div className="w-8 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(127,119,221,0.3))" }} />

            {/* GPT chip */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border text-[11px] font-mono font-medium shadow-sm"
              style={{ borderColor: "rgba(127,119,221,0.3)", background: "rgba(127,119,221,0.06)", color: "#9490e8" }}>
              <span style={{ fontSize: 9 }}>●</span>
              GPT-5.2
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-primary tracking-[2.5px] uppercase mb-5 border border-primary/20 rounded-full px-3.5 py-1.5 bg-primary/5">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            Statute-cited answers · Real Canadian law
          </div>

          {/* Heading */}
          <h1 className="font-serif italic text-5xl md:text-[62px] text-foreground leading-tight mb-5 text-center">
            Your compliance lawyer,<br />
            <span style={{ color: "#c8f135" }}>on demand.</span>
          </h1>

          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 text-center">
            Ask any Canadian compliance question — CASL, PIPEDA, Bill 96, Employment Standards, FINTRAC, GST/HST — and get a precise answer with the exact statute section, penalty amount, and step-by-step fix.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <Link href="/sign-up">
              <button data-testid="btn-copilot-signup"
                className="px-7 py-3.5 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: "#c8f135", color: "#09090a" }}>
                Try AI Copilot Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="px-7 py-3.5 rounded-lg text-[13px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                Sign In to Ask
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-7 py-3.5 rounded-lg text-[13px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-1.5">
                Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <p className="text-[11px] text-muted-foreground font-mono">Available on Professional and Agency plans · Not legal advice</p>

          {/* Mini live preview strip */}
          <div className="mt-10 w-full max-w-2xl rounded-2xl border overflow-hidden shadow-xl"
            style={{ borderColor: "rgba(200,241,53,0.12)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)" }}>
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(200,241,53,0.15)" }}>
                <Bot className="w-2.5 h-2.5" style={{ color: "#c8f135" }} />
              </div>
              <span className="font-mono text-[9px] text-muted-foreground">AI Copilot · Claude Sonnet · CASL S.10(1)</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-70" />
                <span className="font-mono text-[9px] text-muted-foreground">Live</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[72%] rounded-xl px-3.5 py-2.5 text-[12px] font-medium leading-snug"
                  style={{ background: "#c8f135", color: "#09090a" }}>
                  Is a pre-checked checkbox valid for CASL consent?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl px-3.5 py-2.5 text-[12px] text-foreground leading-relaxed bg-muted">
                  No — CASL s.10(1) requires <span style={{ color: "#c8f135" }}>express opt-in</span>. A pre-checked box does not qualify.
                  Maximum penalty: <span className="text-red-400">$10M/day</span> (s.20). Fix: Use an unchecked checkbox with a plain-language consent description.
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Quick questions preview */}
      <section className="py-10 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-6">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Example questions you can ask right now</div>
        </div>
        <div className="grid md:grid-cols-4 gap-2">
          {QUICK_QUESTIONS.map(q => (
            <div key={q} className="bg-card border border-border rounded-lg p-3 text-[11px] text-muted-foreground leading-relaxed hover:border-primary/20 hover:text-foreground transition-all cursor-pointer">
              {q}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href="/sign-up">
            <span className="text-[12px] text-primary hover:underline underline-offset-2 font-mono cursor-pointer">Sign up to ask any of these →</span>
          </Link>
        </div>
      </section>

      {/* Model comparison */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Choose your AI model</div>
          <h2 className="font-serif italic text-3xl text-foreground mb-3">Two world-class AI models. One compliance platform.</h2>
          <p className="text-[13px] text-muted-foreground">Switch between models mid-conversation. Each brings different strengths.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {MODELS.map(model => (
            <div key={model.name} className="bg-card border border-border rounded-xl p-6 hover:border-primary/20 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: model.color }} />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: model.color + "20", color: model.color }}>
                    {model.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-foreground">{model.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">by {model.by}</div>
                  </div>
                </div>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ background: model.color + "20", color: model.color }}>{model.badge}</span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{model.strength}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live example conversations */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(200,241,53,0.025) 50%, transparent 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Real examples</div>
            <h2 className="font-serif italic text-4xl text-foreground mb-3">What real answers look like.</h2>
            <p className="text-[14px] text-muted-foreground max-w-2xl mx-auto">Every answer includes: the relevant statute, the maximum penalty, and the specific fix. No vague advice. No "consult a lawyer" cop-outs without useful guidance.</p>
          </div>
          <div className="space-y-5">
            {SAMPLE_CONVERSATIONS.map((conv, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{conv.model}</span>
                  <span className="ml-auto font-mono text-[9px] px-2 py-0.5 rounded bg-primary/5 text-primary">{conv.statute}</span>
                </div>
                <div className="px-5 pt-4 pb-3 flex justify-end">
                  <div className="max-w-[75%] rounded-xl px-4 py-3 text-[13px]" style={{ background: "#c8f135", color: "#09090a" }}>
                    {conv.q}
                  </div>
                </div>
                <div className="px-5 pb-5 flex justify-start">
                  <div className="max-w-[80%] rounded-xl px-4 py-3 bg-muted text-[13px] text-foreground leading-relaxed">
                    {conv.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/sign-up">
              <button className="px-6 py-3 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto" style={{ background: "#c8f135", color: "#09090a" }}>
                Ask your own question — Sign up free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Use cases</div>
          <h2 className="font-serif italic text-4xl text-foreground mb-3">How Canadian businesses use AI Copilot.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {USE_CASES.map(uc => (
            <div key={uc.title} className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <uc.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[13px] font-semibold text-foreground mb-2">{uc.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy notice */}
      <section className="py-10 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground mb-2">Data handling — PIPEDA compliant disclosure</div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
              Your questions are processed by Anthropic PBC or OpenAI in the United States. This is a cross-border transfer under PIPEDA Principle 4.1.3, disclosed in our Privacy Policy.
              Conversations are stored in your account and can be permanently deleted from Account Settings at any time. Do not enter personal information about third parties (employee names, client data) into AI Copilot.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-pass" />
                PIPEDA-compliant cross-border disclosure
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-pass" />
                Delete your conversation history anytime
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-pass" />
                No data sold or shared for training
              </div>
              <Link href="/privacy-policy">
                <span className="text-[11px] text-primary hover:underline underline-offset-2 cursor-pointer">Read Privacy Policy →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-2xl p-14 border text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.07) 0%, rgba(18,183,106,0.03) 100%)", borderColor: "rgba(200,241,53,0.2)" }}>
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(ellipse at center, #c8f135 0%, transparent 70%)" }} />
          <div className="relative">
            <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-serif italic text-4xl text-foreground mb-4">Start asking compliance questions now</h2>
            <p className="text-[14px] text-muted-foreground mb-8 max-w-lg mx-auto">
              AI Copilot is included on Professional ($79/mo) and Agency ($199/mo) plans. 30-day money-back guarantee.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/sign-up">
                <button className="px-8 py-4 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: "#c8f135", color: "#09090a" }}>
                  Create Account — Access AI Copilot <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="px-8 py-4 rounded-lg text-[14px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/pricing">
                <button className="px-8 py-4 rounded-lg text-[14px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
