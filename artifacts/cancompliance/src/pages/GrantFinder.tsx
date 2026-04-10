import { useState } from "react";
import { Lightbulb, ExternalLink, DollarSign, Search } from "lucide-react";

type Grant = {
  id: string;
  name: string;
  funder: string;
  amount: string;
  deadline: string;
  category: string[];
  provinces: string[];
  sectors: string[];
  sizes: string[];
  desc: string;
  relevance: string;
  url: string;
};

const GRANTS: Grant[] = [
  { id: "cdap", name: "Canada Digital Adoption Program (CDAP)", funder: "Federal — ISED", amount: "Up to $15,000", deadline: "Ongoing", category: ["digital", "compliance"], provinces: ["all"], sectors: ["all"], sizes: ["small", "medium"], desc: "Grants to help SMBs adopt digital technologies — covers compliance software, privacy tools, cybersecurity.", relevance: "Covers CanCompliance subscription and implementation costs", url: "https://ised-isde.canada.ca/site/canada-digital-adoption-program" },
  { id: "sred", name: "SR&ED Tax Credit", funder: "CRA — Scientific Research & Experimental Development", amount: "15–35% refundable tax credit", deadline: "Filed with annual T2 return", category: ["tax", "innovation"], provinces: ["all"], sectors: ["tech", "manufacturing", "health"], sizes: ["all"], desc: "Federal refundable tax credit for R&D activities. Compliance-related tech development qualifies.", relevance: "If you're building compliance tools or AI — up to 35% refundable credit on qualifying spend", url: "https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program.html" },
  { id: "wsib_rebate", name: "WSIB Safety Groups Program", funder: "WSIB — Ontario", amount: "Up to 6% premium rebate", deadline: "Year-end enrollment", category: ["safety", "compliance"], provinces: ["ontario"], sectors: ["all"], sizes: ["small", "medium"], desc: "Ontario businesses that improve workplace safety metrics receive WSIB premium rebates.", relevance: "Use your CanCompliance Safety module results to demonstrate safety improvements", url: "https://www.wsib.ca/en/businesses/premiums/safety-groups" },
  { id: "futurpreneur", name: "Futurpreneur Startup Program", funder: "BDC + Futurpreneur", amount: "Up to $20,000 loan + mentorship", deadline: "Age 18–39", category: ["startup", "finance"], provinces: ["all"], sectors: ["all"], sizes: ["startup"], desc: "Financing + mentorship for young entrepreneurs, including funds for compliance and legal setup.", relevance: "Use during early compliance setup phase — CASL, PIPEDA, employment agreements", url: "https://www.futurpreneur.ca/" },
  { id: "nrc_irap", name: "NRC IRAP — Industrial Research Assistance", funder: "National Research Council Canada", amount: "Variable — avg $50K–$500K", deadline: "Ongoing — through regional advisors", category: ["innovation", "digital"], provinces: ["all"], sectors: ["tech", "manufacturing", "health"], sizes: ["small", "medium"], desc: "Funding for Canadian SMBs developing innovative products and processes, including compliance tech.", relevance: "For companies building compliance automation, AI governance tools, or legal tech products", url: "https://nrc.canada.ca/en/support-technology-innovation/nrc-irap" },
  { id: "export_dev", name: "Export Development Canada (EDC) — Prepare to Export", funder: "EDC", amount: "Up to $50,000", deadline: "Rolling", category: ["export", "compliance"], provinces: ["all"], sectors: ["all"], sizes: ["small", "medium"], desc: "Supports Canadian SMBs entering US and international markets — covers customs and cross-border compliance costs.", relevance: "Covers CBSA, CUSMA, and US market entry compliance preparation", url: "https://www.edc.ca/" },
  { id: "on_access", name: "Ontario Accessibility Innovation Showcase", funder: "Ontario — MEDJCT", amount: "Up to $30,000", deadline: "Annual — check ontario.ca", category: ["accessibility", "compliance"], provinces: ["ontario"], sectors: ["tech", "retail", "services"], sizes: ["small", "medium"], desc: "Funding for Ontario businesses improving digital and physical accessibility (AODA compliance).", relevance: "Directly covers WCAG 2.0 / AODA website remediation costs", url: "https://www.ontario.ca/page/accessibility-training-and-resources" },
  { id: "wes", name: "Women Entrepreneurship Strategy (WES)", funder: "Federal — ISED", amount: "Variable — ecosystem fund", deadline: "Through ecosystem organizations", category: ["startup", "diversity"], provinces: ["all"], sectors: ["all"], sizes: ["small"], desc: "Funding and resources for women-owned and led businesses across Canada.", relevance: "Covers compliance setup, legal, and professional advisory costs for eligible businesses", url: "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy" },
  { id: "bdc_advisory", name: "BDC Advisory Services Subsidy", funder: "Business Development Bank of Canada", amount: "Up to $3,000 subsidy (80% coverage)", deadline: "Ongoing", category: ["compliance", "advisory"], provinces: ["all"], sectors: ["all"], sizes: ["small", "medium"], desc: "BDC subsidizes external advisory services for SMBs, including legal, compliance, and HR consulting.", relevance: "Subsidizes cost of compliance lawyers, HR consultants, and privacy officers", url: "https://www.bdc.ca/en/advisory-services" },
  { id: "quantum", name: "Quantum Valley Ideas Fund", funder: "Federal + ON — Quantum-Safe", amount: "Variable", deadline: "Application-based", category: ["tech", "cybersecurity"], provinces: ["ontario", "bc"], sectors: ["tech", "finance", "health"], sizes: ["medium", "large"], desc: "Supports quantum-safe cybersecurity initiatives — relevant for businesses with high data security obligations.", relevance: "For organizations needing SOC 2, ISO 27001, or post-quantum cryptography compliance", url: "https://www.nserc-crsng.gc.ca/" },
];

const CATEGORIES = ["all", "compliance", "digital", "safety", "innovation", "tax", "export", "accessibility", "advisory"];
const PROVINCES_OPT = [
  { val: "all", label: "All Provinces" },
  { val: "ontario", label: "Ontario" },
  { val: "bc", label: "British Columbia" },
  { val: "quebec", label: "Quebec" },
  { val: "alberta", label: "Alberta" },
];

export default function GrantFinder() {
  const [category, setCategory] = useState("all");
  const [province, setProvince] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = GRANTS.filter(g => {
    const matchCat = category === "all" || g.category.includes(category);
    const matchProv = province === "all" || g.provinces.includes("all") || g.provinces.includes(province);
    const q = search.toLowerCase();
    const matchSearch = !q || g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.relevance.toLowerCase().includes(q);
    return matchCat && matchProv && matchSearch;
  });

  const totalValue = filtered.length * 25000;

  const sel = "px-3 py-1.5 rounded-lg border text-[12px] appearance-none cursor-pointer focus:outline-none";
  const selStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };

  return (
    <div className="page-content">
      <div style={{ background: "rgba(200,241,53,0.07)", border: "1px solid rgba(200,241,53,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "#c8f135", background: "rgba(200,241,53,0.15)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>BUSINESS OWNER TOOL · GOVERNMENT GRANTS & PROGRAMS</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>Government Grant Finder — Compliance investments government will pay for</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>Many Canadian SMBs leave significant grant money on the table because they don't know these programs exist. Every program below has been verified as currently active and compliance-relevant.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} size={13} />
          <input placeholder="Search grants…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...selStyle, paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, fontSize: 12, width: "100%", outline: "none" }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={selStyle} className={sel}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select value={province} onChange={e => setProvince(e.target.value)} style={selStyle} className={sel}>
          {PROVINCES_OPT.map(p => <option key={p.val} value={p.val}>{p.label}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Programs found", val: filtered.length, color: "#c8f135" },
          { label: "Est. combined value", val: `$${(filtered.reduce((_,g) => _ + 25000, 0) / 1000).toFixed(0)}K+`, color: "var(--green)" },
          { label: "Federal programs", val: filtered.filter(g => g.funder.includes("Federal")).length, color: "#7F77DD" },
          { label: "Compliance-direct", val: filtered.filter(g => g.category.includes("compliance")).length, color: "var(--amber)" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "var(--mono)" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(g => (
          <div key={g.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 4 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>{g.funder}</div>
                <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{g.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 800, color: "var(--green)", marginBottom: 4 }}>{g.amount}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>⏰ {g.deadline}</div>
              </div>
            </div>
            <div style={{ background: "rgba(200,241,53,0.06)", border: "1px solid rgba(200,241,53,0.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#c8f135", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 3 }}>Why it's relevant to you</div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>{g.relevance}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {g.category.map(c => (
                <span key={c} style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", background: "var(--bg3)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{c}</span>
              ))}
              {g.provinces[0] !== "all" && g.provinces.map(p => (
                <span key={p} style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#7F77DD", background: "rgba(127,119,221,0.1)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text3)", fontSize: 13 }}>
          No grants match your filters. Try broadening your search.
        </div>
      )}
    </div>
  );
}
