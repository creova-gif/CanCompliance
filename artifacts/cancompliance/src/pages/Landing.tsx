import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Scan, AlertTriangle, Shield, Globe, Mail, Bot, FileText, Zap, Lock, BarChart3, ChevronRight } from "lucide-react";
import { useScanUrl } from "@workspace/api-client-react";
import OnboardingModal from "@/components/OnboardingModal";

const TRUST_BADGES = ["CASL", "PIPEDA", "Bill 96", "FINTRAC", "CCPSA", "ESG", "S-211", "GST/HST", "OHS", "CBSA", "AIDA", "EPR", "Law 25"];

export default function Landing() {
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState<null | {
    url: string;
    overallScore: number;
    isDemo: boolean;
    violations: Array<{ law: string; issue: string; severity: string; citation: string }>;
  }>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [, setLocation] = useLocation();
  const resultsRef = useRef<HTMLDivElement>(null);

  const scanMutation = useScanUrl({
    mutation: {
      onSuccess: (data) => {
        setScanResult(data);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      },
    },
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    scanMutation.mutate({ data: { url: normalized } });
  };

  const handleGetFullReport = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} onClose={() => setShowOnboarding(false)} />
      )}

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b border-border flex items-center px-6 gap-4">
        <Link href="/">
          <span className="font-serif italic text-lg text-foreground cursor-pointer hover:opacity-80 transition-opacity">CanCompliance</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <a href="#features" className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <Link href="/pricing">
            <button className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </button>
          </Link>
          <Link href="/ai-copilot">
            <button className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors">
              AI Copilot
            </button>
          </Link>
          <Link href="/sign-in">
            <button data-testid="btn-signin" className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors">
              Sign In
            </button>
          </Link>
          <button
            data-testid="btn-start-free"
            onClick={() => setShowOnboarding(true)}
            className="px-4 py-1.5 rounded-lg text-[12px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            style={{ background: "#c8f135", color: "#09090a" }}
          >
            Start Free <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center max-w-4xl mx-auto overflow-hidden">
        {/* Accent radial glow behind headline */}
        <div
          className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 w-[600px] h-[340px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse at center, #c8f135 0%, transparent 70%)" }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-primary tracking-[3px] uppercase mb-6 border border-primary/20 rounded-full px-3 py-1 bg-primary/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Canada Compliance Engine — 13 laws covered
          </div>

          <h1 className="font-serif italic text-5xl md:text-6xl text-foreground leading-tight mb-5">
            Stay <span style={{ color: "#c8f135" }}>compliant.</span><br />
            Avoid the fines.
          </h1>
          <p className="text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            CanCompliance checks your business against CASL, PIPEDA, Bill 96, FINTRAC, employment standards, and 8 more — in seconds. Built for Canadian SMBs.
          </p>

          {/* Hero CTAs */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <button
              data-testid="btn-hero-start"
              onClick={() => setShowOnboarding(true)}
              className="px-6 py-3 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ background: "#c8f135", color: "#09090a" }}
            >
              Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
            </button>
            <Link href="/dashboard">
              <button className="px-6 py-3 rounded-lg text-[13px] font-medium border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2">
                View Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Trust badge strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
            {TRUST_BADGES.map((badge) => (
              <span key={badge} className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-border text-muted-foreground bg-muted/40">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14">
          {[
            { value: "$51.5B", label: "Annual fines issued" },
            { value: "1.2M", label: "Canadian SMBs at risk" },
            { value: "735h/yr", label: "Wasted on compliance" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className="text-2xl font-semibold mb-1" style={{ color: "#c8f135" }}>{stat.value}</div>
              <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* URL Scanner */}
        <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto text-left" style={{ borderColor: "rgba(200,241,53,0.12)" }}>
          <div className="flex items-center gap-2 font-mono text-[10px] text-primary uppercase tracking-widest mb-3">
            <Zap className="w-3.5 h-3.5" />
            Live Compliance Scan
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">Scan your website for violations</h2>
          <p className="text-[13px] text-muted-foreground mb-6">Enter your URL and see your compliance risk in 30 seconds — no sign-up required.</p>

          <form onSubmit={handleScan} className="flex gap-3">
            <input
              data-testid="input-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourbusiness.ca"
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button
              data-testid="btn-scan"
              type="submit"
              disabled={scanMutation.isPending || !url}
              className="px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              style={{ background: "#c8f135", color: "#09090a" }}
            >
              {scanMutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-3.5 h-3.5" />
                  Scan for violations
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Scan Results */}
      {scanResult && (
        <section ref={resultsRef} className="pb-16 px-6 max-w-2xl mx-auto">
          <div className="bg-card border border-fail/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Scan Results</div>
                  {scanResult.isDemo && (
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-flag/40 text-flag uppercase tracking-widest">Demo Simulation</span>
                  )}
                </div>
                <div className="text-[13px] text-muted-foreground">{scanResult.url}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold text-fail">{scanResult.overallScore}</div>
                <div className="text-[11px] text-muted-foreground font-mono">/ 100</div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="font-mono text-[10px] text-fail uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                {scanResult.violations.length} violations detected
              </div>

              {scanResult.violations.map((v, i) => (
                <div key={i} data-testid={`violation-${i}`} className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{v.law}</span>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                        v.severity === "high" ? "bg-fail/10 text-fail" : "bg-flag/10 text-flag"
                      }`}>
                        {v.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-[13px] text-foreground font-medium mb-1">{v.issue}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{v.citation}</div>
                </div>
              ))}

              <button
                data-testid="btn-full-report"
                onClick={handleGetFullReport}
                className="w-full mt-4 py-3 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ background: "#c8f135", color: "#09090a" }}
              >
                See your full report free <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-muted-foreground">No credit card required</p>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">What's Included</div>
          <h2 className="font-serif italic text-3xl text-foreground">Everything Canadian businesses need</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "13 Compliance Modules", desc: "CASL, PIPEDA, Bill 96, FINTRAC, ESG, Payroll, CCPSA, OHS, Customs, AI Governance, EPR, Employment & Supply Chain — all in one engine." },
            { icon: FileText, title: "Real-time Statute Citations", desc: "Every check cites the exact statute section, maximum penalty, and actionable remediation steps." },
            { icon: Bot, title: "AI Copilot (Claude-powered)", desc: "Ask any compliance question and get a precise answer with statute citations — powered by Claude Sonnet." },
            { icon: BarChart3, title: "Live Compliance Score", desc: "Your real-time score updates as you run checks. Export a compliance certificate to share with investors and clients." },
            { icon: Lock, title: "CASL Consent Ledger", desc: "Tamper-evident consent records with automatic expiry tracking. Express and implied consent — CRTC-ready." },
            { icon: Globe, title: "Jurisdiction Intelligence", desc: "Set your province and size once. We show only the rules that apply to your business in your province." },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/20 transition-colors">
              <f.icon className="w-5 h-5 text-primary mb-4" />
              <h3 className="text-[14px] font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Trusted by Canadian businesses</div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "We avoided a $45,000 CASL fine we didn't even know was coming. The unsubscribe audit caught it before the CRTC did.", name: "Sarah M.", role: "Marketing Director, Toronto e-commerce brand" },
            { quote: "Finally a tool that understands Quebec. The Bill 96 checker saved us months of legal fees figuring out what we actually needed to do.", name: "Jean-François B.", role: "CEO, Montreal SaaS company" },
            { quote: "The AI copilot is genuinely useful. It's like having a compliance lawyer on call who actually explains things clearly.", name: "Priya K.", role: "Founder, Calgary professional services firm" },
          ].map((t) => (
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

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div
          className="rounded-2xl p-12 max-w-2xl mx-auto border"
          style={{
            background: "linear-gradient(135deg, rgba(200,241,53,0.05) 0%, rgba(18,183,106,0.03) 100%)",
            borderColor: "rgba(200,241,53,0.18)"
          }}
        >
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">Get started today</div>
          <h2 className="font-serif italic text-3xl text-foreground mb-4">Start your free compliance scan</h2>
          <p className="text-[13px] text-muted-foreground mb-8">3 free checks per month. No credit card. No lawyers. Just answers.</p>
          <button
            data-testid="btn-cta-start"
            onClick={() => setShowOnboarding(true)}
            className="px-8 py-3.5 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity"
            style={{ background: "#c8f135", color: "#09090a" }}
          >
            Get Started Free
          </button>
          <p className="mt-4 text-[11px] text-muted-foreground">3 checks free monthly · Cancel anytime · Not legal advice</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[9px] text-primary tracking-widest uppercase">CANCOMPLIANCE</span>
                <span className="font-serif italic text-base text-foreground">CanCompliance</span>
              </div>
              <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                Canadian compliance automation for SMBs. 13 laws, one platform.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Product</div>
                <div className="space-y-2">
                  {[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Pricing", href: "/pricing" },
                    { label: "AI Copilot", href: "/ai-copilot" },
                    { label: "Score Engine", href: "/compliance-score" },
                    { label: "Privacy Policy", href: "/privacy-policy" },
                  ].map((l) => (
                    <Link key={l.label} href={l.href}>
                      <div className="text-[12px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l.label}</div>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Compliance</div>
                <div className="space-y-2">
                  {[
                    { label: "CASL", href: "/casl" },
                    { label: "PIPEDA", href: "/pipeda" },
                    { label: "Bill 96", href: "/bill96" },
                    { label: "FINTRAC", href: "/fintrac" },
                    { label: "Employment", href: "/employment" },
                  ].map((l) => (
                    <Link key={l.label} href={l.href}>
                      <div className="text-[12px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l.label}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="font-mono text-[11px] text-muted-foreground">
              &copy; 2026 CanCompliance. Built for Canadian SMBs.
            </div>
            <div className="font-mono text-[11px] text-muted-foreground text-center md:text-right">
              Not legal advice. Consult a qualified Canadian lawyer for your specific situation.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
