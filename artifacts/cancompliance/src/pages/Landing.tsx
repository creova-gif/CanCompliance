import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Scan, AlertTriangle, CheckCircle, Shield, Globe, Mail, Bot, Award, FileText } from "lucide-react";
import { useScanUrl } from "@workspace/api-client-react";
import OnboardingModal from "@/components/OnboardingModal";

export default function Landing() {
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState<null | {
    url: string;
    overallScore: number;
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
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-primary tracking-widest uppercase">CANCOMPLIANCE</span>
          <span className="font-serif italic text-lg text-foreground">CanCompliance</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/dashboard">
            <button data-testid="btn-signin" className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors">
              Sign In
            </button>
          </Link>
          <button
            data-testid="btn-start-free"
            onClick={() => setShowOnboarding(true)}
            className="px-4 py-1.5 rounded-lg text-[12px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            Start Free <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="font-mono text-[10px] text-primary tracking-[3px] uppercase mb-6">Canada Compliance Engine</div>
        <h1 className="font-serif italic text-5xl md:text-6xl text-foreground leading-tight mb-6">
          Stay compliant.<br />Avoid the fines.
        </h1>
        <p className="text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
          CanCompliance checks your business against CASL, PIPEDA, Bill 96, employment standards, and more — in seconds. Built for Canadian SMBs.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14">
          {[
            { value: "$51.5B", label: "Annual fines issued" },
            { value: "1.2M", label: "SMBs at risk" },
            { value: "735h/yr", label: "Wasted on compliance" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className="text-2xl font-semibold text-primary mb-1">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* URL Scanner */}
        <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto text-left">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Live Compliance Scan</div>
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
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
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
          <div className="bg-card border border-red-500/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Scan Results</div>
                <div className="text-[13px] text-muted-foreground">{scanResult.url}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold text-red-400">{scanResult.overallScore}</div>
                <div className="text-[11px] text-muted-foreground font-mono">/ 100</div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="font-mono text-[10px] text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                {scanResult.violations.length} violations detected
              </div>

              {scanResult.violations.map((v, i) => (
                <div key={i} data-testid={`violation-${i}`} className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{v.law}</span>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                        v.severity === "high" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
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
                className="w-full mt-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                See your full report free <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-muted-foreground">No credit card required</p>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">What's Included</div>
          <h2 className="font-serif italic text-3xl text-foreground">Everything Canadian businesses need</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "8 Compliance Modules", desc: "CASL, PIPEDA, Bill 96, Employment Standards, WSIB, Payroll, Modern Slavery, and CARM — all in one engine." },
            { icon: FileText, title: "Real-time Statute Citations", desc: "Every check cites the exact statute section, maximum penalty, and actionable remediation steps." },
            { icon: Bot, title: "AI Copilot (Claude-powered)", desc: "Ask any compliance question and get a precise answer with statute citations — powered by Claude Sonnet." },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6">
              <f.icon className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-[14px] font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">What people say</div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "We avoided a $45,000 CASL fine we didn't even know was coming. The unsubscribe audit caught it before the CRTC did.", name: "Sarah M.", role: "Marketing Director, Toronto e-commerce brand" },
            { quote: "Finally a tool that understands Quebec. The Bill 96 checker saved us months of legal fees figuring out what we actually needed to do.", name: "Jean-François B.", role: "CEO, Montreal SaaS company" },
            { quote: "The AI copilot is genuinely useful. It's like having a compliance lawyer on call who actually explains things clearly.", name: "Priya K.", role: "Founder, Calgary professional services firm" },
          ].map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-6">
              <div className="text-[13px] text-muted-foreground leading-relaxed mb-4 italic">"{t.quote}"</div>
              <div className="text-[13px] font-medium text-foreground">{t.name}</div>
              <div className="text-[11px] text-muted-foreground font-mono">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="bg-card border border-primary/20 rounded-2xl p-12 max-w-2xl mx-auto">
          <h2 className="font-serif italic text-3xl text-foreground mb-4">Start your free compliance scan</h2>
          <p className="text-[13px] text-muted-foreground mb-8">3 free checks per month. No credit card. No lawyers. Just answers.</p>
          <button
            data-testid="btn-cta-start"
            onClick={() => setShowOnboarding(true)}
            className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-[14px] hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[11px] text-muted-foreground">
            &copy; 2024 CanCompliance. Built for Canadian SMBs.
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">
            Not legal advice. Consult a qualified Canadian lawyer for your specific situation.
          </div>
        </div>
      </footer>
    </div>
  );
}
