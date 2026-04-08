import { useState } from "react";
import { BookOpen, Loader2, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface ControlRule {
  trigger: string;
  module: string;
  law: string;
  obligation: string;
  penalty: string;
  urgency: "critical" | "active" | "upcoming";
}

const CONTROL_RULES: ControlRule[] = [
  { trigger: "send email", module: "CASL", law: "CASL s.6", obligation: "Express or valid implied consent required before sending commercial electronic messages", penalty: "Up to $10,000,000 per violation", urgency: "critical" },
  { trigger: "commercial email", module: "CASL", law: "CASL s.6", obligation: "Must include sender identification, mailing address, and unsubscribe mechanism", penalty: "Up to $10,000,000 per violation", urgency: "critical" },
  { trigger: "collect personal data", module: "PIPEDA / Privacy", law: "PIPEDA Principle 3", obligation: "Identify purposes before or at collection; obtain appropriate consent", penalty: "Up to $100,000 per violation", urgency: "active" },
  { trigger: "personal information", module: "PIPEDA / Privacy", law: "PIPEDA SC 2000 c.5", obligation: "Appoint privacy officer, publish privacy policy, implement safeguards", penalty: "Up to $100,000 per violation", urgency: "active" },
  { trigger: "sell product", module: "CCPSA", law: "CCPSA SC 2010 c.21", obligation: "No prohibited substances; mandatory bilingual warnings; manufacturer info on label", penalty: "Up to $5,000,000 or imprisonment", urgency: "active" },
  { trigger: "hire employee", module: "Payroll", law: "Income Tax Act s.153", obligation: "Deduct and remit CPP, EI, and income tax. Issue T4 by Feb 28", penalty: "$100–$7,500 per failure", urgency: "active" },
  { trigger: "employee", module: "Employment Standards", law: "ESA 2000 / provincial", obligation: "Pay at or above minimum wage; overtime at 1.5× after threshold; termination notice", penalty: "Regulatory order + back pay", urgency: "active" },
  { trigger: "cash transaction", module: "FINTRAC", law: "PCMLTFA s.7", obligation: "Report to FINTRAC within 15 days for transactions ≥$10,000 CAD; collect KYC", penalty: "Up to $500,000 (criminal)", urgency: "critical" },
  { trigger: "import goods", module: "Customs / CBSA", law: "Customs Act s.32", obligation: "Register with CARM (mandatory Oct 2024); file B3; pay duty and GST", penalty: "Goods seized + penalties", urgency: "critical" },
  { trigger: "green", module: "ESG / Greenwashing", law: "Competition Act s.74.01", obligation: "Substantiate all environmental claims with adequate testing or recognized methodology", penalty: "Min $10M or 3% of global revenue", urgency: "active" },
  { trigger: "sustainable", module: "ESG / Greenwashing", law: "Competition Act s.74.01 (Bill C-59)", obligation: "Ensure 'sustainable' claims are supported by recognized methodology documentation", penalty: "Min $10M or 3% of global revenue", urgency: "active" },
  { trigger: "environmental", module: "ESG / Greenwashing", law: "Competition Act s.74.01", obligation: "All environmental product claims must be based on adequate and proper testing", penalty: "Min $10M or 3% of global revenue", urgency: "active" },
  { trigger: "package", module: "CPLA", law: "CPLA RSC 1985 c.C-38", obligation: "Net quantity in metric; bilingual product identity (EN + FR); dealer address", penalty: "Summary conviction", urgency: "active" },
  { trigger: "label", module: "CPLA", law: "CPLA RSC 1985 c.C-38", obligation: "Mandatory bilingual labelling; French at least as prominent as English (Quebec)", penalty: "Summary conviction", urgency: "active" },
  { trigger: "french", module: "Bill 96 / CPLA", law: "Charter of the French Language (Bill 96)", obligation: "All consumer-facing text in Quebec must have French at least as prominent as any other language", penalty: "Up to $30,000 per offence", urgency: "critical" },
  { trigger: "ai", module: "AI Governance", law: "Workers for Workers IV / AIDA", obligation: "Disclose AI use in Ontario job postings (mandatory Jan 2026); Quebec Law 25 s.12.1 for automated decisions", penalty: "ESA penalties + Law 25 fines", urgency: "upcoming" },
  { trigger: "supply chain", module: "S-211", law: "S-211 SC 2023 c.9", obligation: "If covered: file annual forced labour report with Public Safety Canada by May 31", penalty: "Up to $250,000", urgency: "active" },
  { trigger: "shareholder", module: "CBCA ISC", law: "CBCA s.21.1", obligation: "If shareholder controls ≥25%: file ISC data with Corporations Canada within 15 days of any change", penalty: "Up to $200,000", urgency: "active" },
  { trigger: "revenue", module: "GST/HST", law: "Excise Tax Act s.148", obligation: "Register for GST/HST when annual taxable revenue exceeds $30,000 in any rolling 4 quarters", penalty: "5% + 1%/month on net tax", urgency: "active" },
  { trigger: "safety", module: "Workplace Safety", law: "OHSA / provincial OHS", obligation: "Written health & safety policy; violence/harassment policy; WSIB registration; JHSC (20+ employees)", penalty: "Up to $1,500,000 (ON corporations)", urgency: "active" },
  { trigger: "packaging", module: "EPR / Blue Box", law: "RRCEA O.Reg 391/21 (ON)", obligation: "Register with EPR program (Blue Box/ÉEQ); report tonnage annually by March 31 in Ontario", penalty: "Up to $100,000/day", urgency: "active" },
  { trigger: "children", module: "CCPSA / CPLA", law: "CCPSA · Toys Regulations SOR/2011-17", obligation: "No small parts for under 3; no phthalates; no lead; mandatory age grading; bilingual safety warnings", penalty: "Recall + up to $5,000,000", urgency: "critical" },
  { trigger: "data breach", module: "PIPEDA / Law 25", law: "PIPEDA s.10.1 · Law 25 s.3.5", obligation: "Report breach to OPC (PIPEDA: real risk of harm; QC Law 25: within 72 hours); notify affected individuals", penalty: "Up to $100,000 (PIPEDA); up to $25M (QC Law 25)", urgency: "critical" },
];

const URGENCY_COLORS = { critical: "var(--red)", active: "var(--green)", upcoming: "var(--amber)" };

export default function ControlMapper() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ControlRule[]>([]);
  const [searched, setSearched] = useState(false);

  const search = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const found = CONTROL_RULES.filter(r =>
      r.trigger.toLowerCase().includes(q) ||
      r.module.toLowerCase().includes(q) ||
      r.law.toLowerCase().includes(q) ||
      r.obligation.toLowerCase().includes(q)
    );
    setResults(found);
    setSearched(true);
  };

  return (
    <AppLayout title="Control Mapper" subtitle="Describe an action — get every Canadian law it triggers">
      <div style={{ maxWidth: 860 }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20, lineHeight: 1.6 }}>
          Describe a business activity or action and CanCompliance will identify every Canadian federal and provincial law, regulation, and compliance obligation it triggers — along with penalties for non-compliance.
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="e.g. send email to customers, collect personal data, import goods from China, hire employees..."
            data-testid="mapper-query"
          />
          <button className="run-btn" style={{ marginTop: 0, flexShrink: 0 }} onClick={search} data-testid="mapper-search">
            <BookOpen size={14} />
            Map Obligations
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {["send email", "collect personal data", "sell product", "hire employees", "import goods", "environmental claims"].map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); }}
              style={{ padding: "4px 12px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, fontSize: 11, color: "var(--text2)", cursor: "pointer", fontFamily: "var(--mono)" }}
            >
              {q}
            </button>
          ))}
        </div>

        {searched && (
          <div>
            {results.length === 0 ? (
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 32, textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 12 }}>
                No matching obligations found for "{query}" — try broader terms like "email", "data", or "product"
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 14 }}>
                  {results.length} obligation{results.length !== 1 ? "s" : ""} triggered for "{query}"
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {results.map((r, i) => {
                    const color = URGENCY_COLORS[r.urgency];
                    return (
                      <div key={i} style={{ background: "var(--bg2)", border: `1px solid ${color}33`, borderRadius: 10, padding: "16px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 13, color: "var(--text1)", fontWeight: 600 }}>{r.module}</div>
                          <ArrowRight size={12} style={{ color: "var(--text3)" }} />
                          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>{r.law}</div>
                          <div style={{ marginLeft: "auto", fontSize: 9, fontFamily: "var(--mono)", color, background: color + "22", padding: "2px 7px", borderRadius: 3 }}>
                            {r.urgency.toUpperCase()}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 8 }}>{r.obligation}</div>
                        <div style={{ fontSize: 11, color: "var(--red)", fontFamily: "var(--mono)" }}>
                          Penalty: {r.penalty}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
