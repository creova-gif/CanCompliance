import { useState } from "react";
import { Link } from "wouter";
import { Zap, Package, Coffee, ShoppingBag, Monitor, Stethoscope, Hammer, Truck } from "lucide-react";

type Pack = {
  id: string;
  name: string;
  icon: React.FC<any>;
  desc: string;
  color: string;
  bg: string;
  modules: { href: string; label: string; priority: "critical" | "high" | "medium"; why: string }[];
  tools: { href: string; label: string; why: string }[];
  tipText: string;
};

const PACKS: Pack[] = [
  {
    id: "restaurant",
    name: "Restaurant & Food Service",
    icon: Coffee,
    desc: "Food handling, employment standards, and OHS are your primary risks. Plus GST/HST if you pass $30K.",
    color: "var(--amber)",
    bg: "rgba(245,166,35,0.08)",
    modules: [
      { href: "/safety", label: "Workplace Safety (OHS)", priority: "critical", why: "Kitchen safety — mandatory OHSA poster, hazard assessments, incident reporting for slips & burns" },
      { href: "/employment", label: "Employment Standards", priority: "critical", why: "Tip sharing rules, minimum wage, overtime, termination — every province differs" },
      { href: "/payroll", label: "Payroll / CPP / EI", priority: "critical", why: "CRA remittances — most restaurants miss deadline, triggering 10% penalty" },
      { href: "/gst-hst", label: "GST / HST", priority: "high", why: "Once you hit $30K revenue, you must register and charge GST on food sales (some exempt)" },
      { href: "/casl", label: "CASL (loyalty emails)", priority: "medium", why: "Loyalty programs and promo emails require valid CASL consent from customers" },
    ],
    tools: [
      { href: "/deadlines", label: "Compliance Deadlines", why: "T4 season, WSIB renewal, HST filing dates" },
      { href: "/fine-exposure", label: "Fine Exposure Calculator", why: "See your total fine risk across OHS, ESA, and payroll at a glance" },
    ],
    tipText: "Restaurant operators: Your biggest risk is an employment standards complaint (unpaid overtime, tip theft). Second biggest is an OHS inspection. Run both checks first.",
  },
  {
    id: "retail",
    name: "Retail & E-Commerce",
    icon: ShoppingBag,
    desc: "CASL for marketing, CCPSA for products, and CPLA for bilingual packaging are your critical risks.",
    color: "#7F77DD",
    bg: "rgba(127,119,221,0.08)",
    modules: [
      { href: "/casl", label: "CASL — Email Marketing", priority: "critical", why: "Every promotional email requires valid consent. CRTC has fined retailers $1.1M+ for violations" },
      { href: "/ccpsa", label: "CCPSA — Product Safety", priority: "critical", why: "All products sold in Canada must meet safety standards. Retailers are responsible, not just manufacturers" },
      { href: "/cpla", label: "CPLA — Bilingual Packaging", priority: "high", why: "All product labels in Canada must be bilingual (English + French) — applies to imports too" },
      { href: "/gst-hst", label: "GST / HST", priority: "critical", why: "Online retailers: GST on all taxable sales, including to Quebec (must also register for QST)" },
      { href: "/casl-ledger", label: "CASL Consent Ledger", priority: "high", why: "Maintain express consent records for marketing lists — your audit defence" },
    ],
    tools: [
      { href: "/digital-platform", label: "Digital Platform Reporting", why: "If you use a marketplace (Etsy, Amazon), understand your T4A obligations" },
      { href: "/grant-finder", label: "Grant Finder", why: "CDAP ($15K) for e-commerce compliance tech upgrades" },
    ],
    tipText: "E-commerce retailers: If you sell on Amazon.ca or Shopify, you likely still need your own GST number and CASL consent mechanism. The platform doesn't handle this for you.",
  },
  {
    id: "tech",
    name: "Tech Startup / SaaS",
    icon: Monitor,
    desc: "Privacy (PIPEDA/CPPA), CASL, and AI governance are your primary compliance risks as a data-first business.",
    color: "#c8f135",
    bg: "rgba(200,241,53,0.06)",
    modules: [
      { href: "/pipeda", label: "PIPEDA — Privacy", priority: "critical", why: "You collect personal data. PIPEDA applies from day one, regardless of company size" },
      { href: "/cppa", label: "Bill C-27 / CPPA", priority: "critical", why: "CPPA will replace PIPEDA — get ahead of it now, especially the Privacy Officer requirement" },
      { href: "/casl", label: "CASL — Outreach", priority: "critical", why: "Cold outreach and product update emails require CASL compliance — CRTC monitors tech companies" },
      { href: "/ai-governance", label: "AI Governance / AIDA", priority: "high", why: "If your product includes AI features, Canada's proposed AIDA creates transparency obligations" },
      { href: "/aoda", label: "AODA (if Ontario)", priority: "high", why: "SaaS products serving Ontario customers must be WCAG 2.0 AA accessible" },
    ],
    tools: [
      { href: "/policy-generator", label: "Policy Generator", why: "Auto-generate privacy policy, CASL policy, AI disclosure — all investor-ready" },
      { href: "/grant-finder", label: "SR&ED Tax Credits", why: "Up to 35% refundable credit on qualifying R&D spend — most tech startups qualify" },
    ],
    tipText: "Tech founders: Before your Series A due diligence, investors will ask for privacy policy, CASL consent mechanism, and data processing agreements. Get these done now.",
  },
  {
    id: "healthcare",
    name: "Healthcare Clinic",
    icon: Stethoscope,
    desc: "Patient data privacy, employment standards for healthcare workers, and OHS are your critical obligations.",
    color: "var(--green)",
    bg: "rgba(18,183,106,0.07)",
    modules: [
      { href: "/privacy", label: "PIPEDA / Law 25 — Patient Data", priority: "critical", why: "Patient health information is the most sensitive category under PIPEDA. Breach penalties are severe." },
      { href: "/cppa", label: "CPPA — Health Data", priority: "critical", why: "CPPA will require express consent for health data and 72-hour breach notification" },
      { href: "/employment", label: "Healthcare Employment Standards", priority: "critical", why: "Healthcare overtime, on-call pay, and termination rules are heavily regulated in all provinces" },
      { href: "/safety", label: "OHS — Clinical Safety", priority: "critical", why: "Needlestick prevention, biohazard protocols, and violence prevention plans are mandatory" },
      { href: "/payroll", label: "Payroll / Benefits", priority: "high", why: "Healthcare benefit plans and professional dues have specific CRA tax treatment" },
    ],
    tools: [
      { href: "/policy-attestation", label: "Policy Attestation", why: "Document staff sign-off on privacy, safety, and confidentiality policies — critical for PHIPA audits" },
      { href: "/vendor-risk", label: "Vendor Risk", why: "EMR vendors and cloud providers holding patient data need DPA/BAA agreements" },
    ],
    tipText: "Clinics: Your EMR vendor (Jane App, Accuro, OSCAR) processes patient PHI. You need a data processing agreement with them — most clinics don't have one.",
  },
  {
    id: "construction",
    name: "Construction & Trades",
    icon: Hammer,
    desc: "OHS, WSIB, employment standards, and CRA remittances are your four highest-risk areas.",
    color: "var(--red)",
    bg: "rgba(240,68,56,0.07)",
    modules: [
      { href: "/safety", label: "OHS / Construction Safety", priority: "critical", why: "Construction sites are highest-risk for OHS inspection. Fall protection plans, WHMIS, and JSAs are mandatory." },
      { href: "/employment", label: "Employment Standards", priority: "critical", why: "Subtrade workers and owner-operators: classification as employee vs. contractor matters enormously for liability" },
      { href: "/payroll", label: "Payroll / CRA Remittances", priority: "critical", why: "Construction companies commonly miss remittances — directors are personally liable for unremitted amounts" },
      { href: "/gst-hst", label: "GST / HST — Holdback Rules", priority: "high", why: "Construction holdback under Ontario's CJOA — timing of GST on holdback amounts is complex" },
      { href: "/supply-chain", label: "Supply Chain / S-211", priority: "medium", why: "Large GC contracts increasingly require S-211 compliance disclosure from all subcontractors" },
    ],
    tools: [
      { href: "/scale-advisor", label: "Ready to Scale?", why: "Moving from 10 to 50 employees? New JHSC and pay equity obligations kick in" },
      { href: "/deadlines", label: "Compliance Deadlines", why: "WSIB renewal, T4 season, HST filing — all construction businesses miss at least one" },
    ],
    tipText: "Construction: Your two biggest risks are (1) an OHS compliance order during a surprise Ministry inspection, and (2) director liability for unremitted payroll deductions. Run both checks first.",
  },
  {
    id: "transport",
    name: "Transport & Logistics",
    icon: Truck,
    desc: "CBSA customs compliance, employment standards for drivers, and safety regulations are your primary risks.",
    color: "var(--amber)",
    bg: "rgba(245,166,35,0.07)",
    modules: [
      { href: "/customs", label: "Customs / CBSA / CARM", priority: "critical", why: "Every cross-border shipment — CARM portal registration is now mandatory for all importers" },
      { href: "/employment", label: "Driver Employment Standards", priority: "critical", why: "Trucking has specific federal CLC provisions — overtime, rest periods, and log requirements" },
      { href: "/safety", label: "OHS — Transport Safety", priority: "critical", why: "Commercial vehicles: HOS regulations, pre-trip inspection records, and WHMIS for cargo" },
      { href: "/payroll", label: "Payroll / Owner-Operators", priority: "high", why: "Owner-operators: T4A vs T4 classification — CRA actively audits transport companies" },
      { href: "/gst-hst", label: "GST / HST — Zero-rated", priority: "medium", why: "International transport may be zero-rated — but you must still be registered and claim ITCs" },
    ],
    tools: [
      { href: "/fine-exposure", label: "Fine Exposure Calculator", why: "Customs penalties + CBSA fines can be substantial — know your exposure" },
      { href: "/grant-finder", label: "Grant Finder", why: "EDC export programs for cross-border expansion support" },
    ],
    tipText: "Transport operators: CARM (Canada Border Services Agency's new import system) is mandatory. If you import goods and haven't registered, you may be blocked at the border.",
  },
];

export default function IndustryPack() {
  const [selected, setSelected] = useState<string>("tech");
  const pack = PACKS.find(p => p.id === selected)!;
  const Icon = pack.icon;

  const PRIORITY_COLOR = { critical: "var(--red)", high: "var(--amber)", medium: "#7F77DD" };
  const PRIORITY_BG = { critical: "rgba(240,68,56,0.12)", high: "rgba(245,166,35,0.12)", medium: "rgba(127,119,221,0.12)" };

  return (
    <div className="page-content">
      <div style={{ background: "rgba(200,241,53,0.07)", border: "1px solid rgba(200,241,53,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "#c8f135", background: "rgba(200,241,53,0.15)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>BUSINESS OWNER TOOL · INDUSTRY COMPLIANCE STARTER PACKS</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>Industry Compliance Pack — Compliance obligations mapped to your business type</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Skip the 30-minute setup. Select your industry below and we'll show you exactly which compliance modules apply to your business, in priority order, with industry-specific context.
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {PACKS.map(p => {
          const PIcon = p.icon;
          return (
            <button key={p.id} onClick={() => setSelected(p.id)}
              style={{ textAlign: "left", padding: "12px 14px", borderRadius: 10, cursor: "pointer", border: `1px solid ${selected === p.id ? p.color + "50" : "var(--border)"}`, background: selected === p.id ? p.bg : "transparent", transition: "all 0.15s", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <PIcon size={16} color={selected === p.id ? p.color : "var(--text3)"} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: selected === p.id ? "var(--text1)" : "var(--text2)" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.4, marginTop: 2 }}>{p.desc.split(".")[0]}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ background: "var(--bg2)", border: `1px solid ${pack.color}30`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: pack.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={20} color={pack.color} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text1)" }}>{pack.name}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{pack.desc}</div>
          </div>
        </div>

        <div style={{ background: pack.bg, borderRadius: 8, padding: "10px 14px", border: `1px solid ${pack.color}25`, marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: pack.color, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Industry Tip</div>
          <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{pack.tipText}</div>
        </div>

        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Priority compliance modules for {pack.name}</div>
        <div className="space-y-2">
          {pack.modules.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 12, background: PRIORITY_BG[m.priority], borderLeft: `3px solid ${PRIORITY_COLOR[m.priority]}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{m.why}</div>
              </div>
              <div style={{ flexShrink: 0, display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: PRIORITY_COLOR[m.priority], textTransform: "uppercase", background: PRIORITY_BG[m.priority], padding: "2px 8px", borderRadius: 4 }}>{m.priority}</div>
                <Link href={m.href}>
                  <button style={{ padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(200,241,53,0.4)", background: "rgba(200,241,53,0.08)", color: "#c8f135" }}>Run →</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Recommended intelligence tools</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {pack.tools.map((t, i) => (
              <Link key={i} href={t.href}>
                <button title={t.why} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text2)" }}>{t.label} →</button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
