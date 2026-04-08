import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Check } from "lucide-react";

const TIERS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "For individuals exploring compliance",
    features: [
      "3 compliance checks / month",
      "CASL, PIPEDA, Bill 96 modules",
      "Statute citations",
      "Basic result export",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 23,
    description: "For growing SMBs with compliance needs",
    features: [
      "Unlimited compliance checks",
      "All 13 compliance modules",
      "Full remediation plans",
      "PDF reports",
      "Email support",
    ],
    cta: "Start Starter",
    featured: false,
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 79,
    annualPrice: 63,
    description: "For businesses serious about compliance",
    features: [
      "Everything in Starter",
      "AI Copilot (Claude-powered)",
      "Compliance certificate",
      "Website badge",
      "Priority support",
      "Audit-ready reports",
    ],
    cta: "Start Professional",
    featured: true,
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 199,
    annualPrice: 159,
    description: "CREOVA — for agencies managing multiple clients",
    features: [
      "Everything in Professional",
      "Up to 25 client workspaces",
      "White-label reports",
      "Dedicated compliance advisor",
      "SLA-backed support",
      "Custom compliance modules",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <AppLayout title="Pricing" subtitle="Simple, transparent pricing for Canadian businesses">
      <div className="max-w-5xl">
        <div className="mb-10">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Plans</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Choose your plan</h1>
          <p className="text-[13px] text-muted-foreground mb-6">No hidden fees. Cancel anytime. All prices in CAD.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-muted border border-border rounded-lg p-1">
            <button
              data-testid="btn-monthly"
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                !annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              data-testid="btn-annual"
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all flex items-center gap-2 ${
                annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Annual
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {TIERS.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.id}
                data-testid={`pricing-tier-${tier.id}`}
                className={`bg-card rounded-xl overflow-hidden flex flex-col ${
                  tier.featured
                    ? "border-2 border-primary relative"
                    : "border border-border"
                }`}
                style={tier.featured ? { boxShadow: "0 0 40px rgba(200,241,53,0.10), 0 4px 24px rgba(0,0,0,0.5)" } : undefined}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                )}
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-widest" style={{ background: "#c8f135", color: "#09090a" }}>
                    Most Popular
                  </div>
                )}

                <div className="p-5 border-b border-border">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{tier.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-semibold text-foreground">${price}</span>
                    {price > 0 && <span className="text-[12px] text-muted-foreground mb-1">/{annual ? "mo" : "mo"}</span>}
                  </div>
                  {annual && price > 0 && (
                    <div className="font-mono text-[10px] text-primary">billed ${price * 12}/yr</div>
                  )}
                  <div className="text-[12px] text-muted-foreground mt-2 leading-relaxed">{tier.description}</div>
                </div>

                <div className="p-5 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] text-muted-foreground leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 pt-0">
                  <button
                    data-testid={`btn-cta-${tier.id}`}
                    className={`w-full py-2.5 rounded-lg text-[12px] font-semibold transition-colors ${
                      tier.featured
                        ? "hover:opacity-90"
                        : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    style={tier.featured ? { background: "#c8f135", color: "#09090a" } : undefined}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-[12px] text-muted-foreground">
          All plans include 30-day money-back guarantee. Not legal advice — CanCompliance provides compliance tooling, not legal services.
        </div>
      </div>
    </AppLayout>
  );
}
