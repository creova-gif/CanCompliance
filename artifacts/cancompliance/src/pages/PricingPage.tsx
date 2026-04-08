import { useState } from "react";
import { Link } from "wouter";
import { PublicNav, PublicFooter } from "@/components/PublicLayout";
import { Check, X, ArrowRight, Shield, Zap, Building2, ChevronRight } from "lucide-react";

const TIERS = [
  {
    id: "free",
    name: "Free",
    icon: Shield,
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: "Explore Canadian compliance at zero cost",
    popularFor: "Solo founders and consultants just getting started",
    color: "#64748b",
    features: [
      { text: "3 compliance checks / month", included: true },
      { text: "CASL, PIPEDA, Bill 96 modules", included: true },
      { text: "Statute citations on every result", included: true },
      { text: "Basic result export (PDF)", included: true },
      { text: "Compliance Inbox (read-only)", included: true },
      { text: "All 14 compliance modules", included: false },
      { text: "Full remediation plans", included: false },
      { text: "AI Copilot (Claude & GPT)", included: false },
      { text: "Document Scanner", included: false },
      { text: "Intelligence Layer (7 tools)", included: false },
    ],
    cta: "Create Free Account",
    href: "/sign-up",
    featured: false,
  },
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    monthlyPrice: 29,
    annualPrice: 23,
    tagline: "For growing SMBs that need complete coverage",
    popularFor: "Small businesses with 1–10 employees needing full compliance",
    color: "#c8f135",
    features: [
      { text: "Unlimited compliance checks", included: true },
      { text: "All 14 compliance modules", included: true },
      { text: "Full remediation plans", included: true },
      { text: "PDF report exports", included: true },
      { text: "Compliance deadline calendar", included: true },
      { text: "CASL Consent Ledger", included: true },
      { text: "Compliance Inbox (full access)", included: true },
      { text: "AI Copilot (Claude & GPT)", included: false },
      { text: "Document Scanner", included: false },
      { text: "Intelligence Layer (7 tools)", included: false },
    ],
    cta: "Start Starter",
    href: "/sign-up",
    featured: false,
  },
  {
    id: "professional",
    name: "Professional",
    icon: Shield,
    monthlyPrice: 79,
    annualPrice: 63,
    tagline: "For businesses serious about compliance",
    popularFor: "Businesses with legal/regulatory risk, investors, or US expansion",
    color: "#c8f135",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "AI Copilot — Claude Sonnet + GPT-5.2", included: true },
      { text: "Document Scanner (contract audit)", included: true },
      { text: "Full Intelligence Layer (all 7 tools)", included: true },
      { text: "Compliance certificate + website badge", included: true },
      { text: "Benchmarking vs. sector & province", included: true },
      { text: "Legislation Tracker + readiness score", included: true },
      { text: "Audit-ready PDF reports", included: true },
      { text: "Priority email support", included: true },
      { text: "Client workspaces (up to 25)", included: false },
    ],
    cta: "Start Professional",
    href: "/sign-up",
    featured: true,
  },
  {
    id: "agency",
    name: "Agency",
    icon: Building2,
    monthlyPrice: 199,
    annualPrice: 159,
    tagline: "For agencies managing multiple client accounts",
    popularFor: "Accounting firms, law firms, and business consultants",
    color: "#7F77DD",
    features: [
      { text: "Everything in Professional", included: true },
      { text: "Up to 25 client workspaces", included: true },
      { text: "White-label PDF reports", included: true },
      { text: "Dedicated compliance advisor", included: true },
      { text: "SLA-backed support (4hr response)", included: true },
      { text: "Custom compliance modules", included: true },
      { text: "API access (coming Q3 2025)", included: true },
      { text: "Volume pricing available", included: true },
      { text: "Quarterly compliance briefings", included: true },
      { text: "Team management + roles", included: true },
    ],
    cta: "Contact Sales",
    href: "mailto:sales@cancompliance.ca",
    featured: false,
  },
];

const COMPARISON_ROWS = [
  { category: "Core", feature: "Compliance checks / month", free: "3", starter: "Unlimited", pro: "Unlimited", agency: "Unlimited" },
  { category: "Core", feature: "Compliance modules", free: "3", starter: "All 14", pro: "All 14", agency: "All 14 + custom" },
  { category: "Core", feature: "Statute citations on results", free: true, starter: true, pro: true, agency: true },
  { category: "Core", feature: "Remediation plans", free: false, starter: true, pro: true, agency: true },
  { category: "Core", feature: "PDF export", free: false, starter: true, pro: true, agency: true },
  { category: "AI", feature: "AI Copilot (Claude + GPT)", free: false, starter: false, pro: true, agency: true },
  { category: "AI", feature: "Document Scanner (contract audit)", free: false, starter: false, pro: true, agency: true },
  { category: "Intelligence", feature: "Intelligence Layer (7 tools)", free: false, starter: false, pro: true, agency: true },
  { category: "Intelligence", feature: "Compliance Inbox", free: "Read-only", starter: true, pro: true, agency: true },
  { category: "Intelligence", feature: "Legislation Tracker + readiness", free: false, starter: false, pro: true, agency: true },
  { category: "Intelligence", feature: "Benchmarking vs. sector", free: false, starter: false, pro: true, agency: true },
  { category: "Compliance", feature: "CASL Consent Ledger", free: false, starter: true, pro: true, agency: true },
  { category: "Compliance", feature: "Compliance certificate + badge", free: false, starter: false, pro: true, agency: true },
  { category: "Compliance", feature: "Audit-ready reports", free: false, starter: false, pro: true, agency: true },
  { category: "Agency", feature: "Client workspaces", free: "1", starter: "1", pro: "1", agency: "Up to 25" },
  { category: "Agency", feature: "White-label reports", free: false, starter: false, pro: false, agency: true },
  { category: "Agency", feature: "Dedicated advisor", free: false, starter: false, pro: false, agency: true },
  { category: "Support", feature: "Support channel", free: "None", starter: "Email", pro: "Priority email", agency: "Dedicated advisor" },
  { category: "Support", feature: "Money-back guarantee", free: true, starter: true, pro: true, agency: true },
];

const FAQS = [
  { q: "Is CanCompliance actual legal advice?", a: "No. CanCompliance provides compliance tooling — automated checks, statute citations, and remediation guidance based on Canadian law. It is not a substitute for a qualified Canadian lawyer. We always recommend consulting a lawyer for your specific situation." },
  { q: "What counts as a compliance check?", a: "Each time you run a check on a module (CASL, PIPEDA, employment standards, etc.) it uses one check. Viewing results, exporting reports, or using AI Copilot does not count against your check limit." },
  { q: "Can I cancel at any time?", a: "Yes. Cancel anytime from your account settings. You retain full access until the end of your current billing period. No cancellation fees, no questions asked." },
  { q: "Do you offer a money-back guarantee?", a: "Yes — 30 days on all paid plans. If you're not satisfied for any reason in the first 30 days, contact us at support@cancompliance.ca for a full refund." },
  { q: "Is my data stored in Canada?", a: "Your compliance data and account information are stored on Canadian servers. AI Copilot queries are processed by Anthropic PBC or OpenAI in the US — disclosed in our Privacy Policy in accordance with PIPEDA Principle 4.1.3." },
  { q: "What is the Intelligence Layer?", a: "7 advanced compliance intelligence tools: Compliance Inbox (real regulatory updates), Legislation Tracker (12 bills in progress), Red Tape Calculator (CFIB-based cost model), Document Scanner (AI contract audit), Benchmarking (sector comparison), Government Programs hub ($3.8M+ in funding), and Trust Network (supplier compliance proofs). Available on Professional and Agency plans." },
  { q: "How does the annual discount work?", a: "Paying annually gives you 2 months free (20% savings). For example, Professional is $79/mo monthly or $63/mo billed annually ($756/yr vs. $948/yr)." },
  { q: "What happens if I exceed my check limit on the Free plan?", a: "You'll see a prompt to upgrade. You won't lose your results or account data — you simply won't be able to run additional checks until the next month or until you upgrade." },
];

const ADDONS = [
  { name: "Compliance Certificate", desc: "Dated PDF certificate showing your compliance status across all 14 modules.", price: "Included in Professional+", available: false },
  { name: "Website Compliance Badge", desc: "Verified 'CanCompliance Certified' badge to embed on your website and proposals.", price: "Included in Professional+", available: false },
  { name: "Custom Module", desc: "Need a compliance check for a specific industry regulation? We'll build it.", price: "Contact Sales", available: true },
  { name: "API Access", desc: "Programmatic access to compliance checks and results via REST API.", price: "Coming Q3 2025", available: true },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  let lastCategory = "";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 max-w-5xl mx-auto w-full text-center">
        <div className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 w-[600px] h-[350px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(ellipse at center, #c8f135 0%, transparent 70%)" }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-primary tracking-[3px] uppercase mb-5 border border-primary/20 rounded-full px-3 py-1 bg-primary/5">
            All prices in CAD · 30-day guarantee · Cancel anytime
          </div>
          <h1 className="font-serif italic text-5xl text-foreground leading-tight mb-4">
            Transparent pricing.<br /><span style={{ color: "#c8f135" }}>No surprises.</span>
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
            Start free with 3 checks per month. Upgrade when you need AI Copilot, the Document Scanner, or the full Intelligence Layer.
            Every plan includes a 30-day money-back guarantee.
          </p>
          <div className="flex items-center justify-center gap-3 mb-10">
            <Link href="/sign-up">
              <button className="px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: "#c8f135", color: "#09090a" }}>
                Start Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/features">
              <button className="px-5 py-2.5 rounded-lg text-[13px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-1.5">
                See all features <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-muted border border-border rounded-xl p-1">
            <button
              data-testid="btn-monthly"
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={!annual ? { background: "var(--card)", color: "var(--foreground)" } : { color: "var(--muted-foreground)" }}
            >
              Monthly
            </button>
            <button
              data-testid="btn-annual"
              onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-lg text-[12px] font-medium transition-all flex items-center gap-2"
              style={annual ? { background: "var(--card)", color: "var(--foreground)" } : { color: "var(--muted-foreground)" }}
            >
              Annual
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#c8f13520", color: "#c8f135" }}>Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-10 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-4 gap-4">
          {TIERS.map(tier => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            const TierIcon = tier.icon;
            return (
              <div
                key={tier.id}
                data-testid={`pricing-tier-${tier.id}`}
                className="relative bg-card rounded-2xl overflow-hidden flex flex-col"
                style={tier.featured
                  ? { border: "2px solid #c8f135", boxShadow: "0 0 50px rgba(200,241,53,0.12), 0 8px 30px rgba(0,0,0,0.5)" }
                  : { border: "1px solid var(--border)" }
                }
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest px-4 py-1 rounded-full font-bold" style={{ background: "#c8f135", color: "#09090a" }}>Most Popular</span>
                  </div>
                )}
                {tier.featured && <div className="h-0.5 w-full" style={{ background: "#c8f135" }} />}

                <div className="p-5 border-b border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: tier.color + "20" }}>
                      <TierIcon className="w-3.5 h-3.5" style={{ color: tier.color }} />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tier.name}</div>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    {price > 0 && <span className="text-[12px] text-muted-foreground mb-1.5">/mo</span>}
                  </div>
                  {annual && price > 0 && (
                    <div className="font-mono text-[10px] text-primary mb-1">billed ${price * 12}/yr</div>
                  )}
                  {!annual && price > 0 && (
                    <div className="font-mono text-[10px] text-muted-foreground mb-1">or ${Math.round(price * 0.8)}/mo annually</div>
                  )}
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-2 mb-1">{tier.tagline}</div>
                  <div className="text-[10px] text-muted-foreground/60 font-mono leading-relaxed">{tier.popularFor}</div>
                </div>

                <div className="p-5 flex-1 space-y-2">
                  {tier.features.map(f => (
                    <div key={f.text} className="flex items-start gap-2">
                      {f.included
                        ? <Check className="w-3.5 h-3.5 text-pass flex-shrink-0 mt-0.5" />
                        : <X className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                      }
                      <span className={`text-[11px] leading-relaxed ${f.included ? "text-muted-foreground" : "text-muted-foreground/40"}`}>{f.text}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 pt-0">
                  {tier.href.startsWith("mailto:") ? (
                    <button
                      data-testid={`btn-cta-${tier.id}`}
                      onClick={() => { window.location.href = tier.href; }}
                      className="w-full py-3 rounded-xl text-[12px] font-semibold transition-colors border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {tier.cta}
                    </button>
                  ) : (
                    <Link href={tier.href}>
                      <button
                        data-testid={`btn-cta-${tier.id}`}
                        className="w-full py-3 rounded-xl text-[12px] font-semibold transition-colors"
                        style={tier.featured
                          ? { background: "#c8f135", color: "#09090a" }
                          : { border: "1px solid var(--border)", color: "var(--muted-foreground)", background: "transparent" }
                        }
                      >
                        {tier.cta}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 text-center text-[11px] text-muted-foreground font-mono">
          All plans include 30-day money-back guarantee · All prices in CAD · Not legal advice · Cancel anytime
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Full comparison</div>
          <h2 className="font-serif italic text-3xl text-foreground">What's included in each plan</h2>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 border-b border-border bg-muted/30">
            <div className="p-4 text-[11px] text-muted-foreground font-mono">Feature</div>
            {["Free", "Starter", "Professional", "Agency"].map((t, i) => (
              <div key={t} className="p-4 text-center">
                <div className={`text-[12px] font-semibold`} style={i === 2 ? { color: "#c8f135" } : { color: "var(--muted-foreground)" }}>{t}</div>
                {i === 2 && <div className="font-mono text-[9px] text-primary mt-0.5">★ Most Popular</div>}
              </div>
            ))}
          </div>
          {COMPARISON_ROWS.map((row, i) => {
            const showCategory = row.category !== lastCategory;
            lastCategory = row.category;
            return (
              <div key={row.feature}>
                {showCategory && (
                  <div className="px-4 py-2 bg-muted/20 border-b border-border">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{row.category}</span>
                  </div>
                )}
                <div className="grid grid-cols-5 border-b border-border last:border-0" style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <div className="p-4 text-[12px] text-foreground">{row.feature}</div>
                  {[row.free, row.starter, row.pro, row.agency].map((val, j) => (
                    <div key={j} className="p-4 flex justify-center items-center">
                      {typeof val === "boolean" ? (
                        val
                          ? <Check className="w-4 h-4 text-pass" />
                          : <X className="w-4 h-4 text-muted-foreground/30" />
                      ) : (
                        <span className={`text-[11px] text-center font-mono ${j === 2 ? "text-foreground" : "text-muted-foreground"}`}>{val as string}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-10 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Add-ons & extras</div>
          <h2 className="font-serif italic text-3xl text-foreground">Extend your compliance coverage</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {ADDONS.map(a => (
            <div key={a.name} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-[13px] font-semibold text-foreground">{a.name}</div>
                <div className="font-mono text-[10px] text-primary whitespace-nowrap">{a.price}</div>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">FAQ</div>
          <h2 className="font-serif italic text-3xl text-foreground">Frequently asked questions</h2>
        </div>
        <div className="space-y-4">
          {FAQS.map(faq => (
            <div key={faq.q} className="bg-card border border-border rounded-xl p-5">
              <div className="text-[13px] font-semibold text-foreground mb-2">{faq.q}</div>
              <div className="text-[12px] text-muted-foreground leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-2xl p-14 border text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.06) 0%, rgba(18,183,106,0.03) 100%)", borderColor: "rgba(200,241,53,0.18)" }}>
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(ellipse at center, #c8f135 0%, transparent 70%)" }} />
          <div className="relative">
            <h2 className="font-serif italic text-4xl text-foreground mb-4">3 free checks. No credit card. No commitment.</h2>
            <p className="text-[14px] text-muted-foreground mb-8 max-w-md mx-auto">Start with CASL, PIPEDA, and Bill 96. Upgrade when you're ready for the full engine.</p>
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
              <Link href="/features">
                <button className="px-8 py-4 rounded-lg text-[14px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  Explore Features
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
