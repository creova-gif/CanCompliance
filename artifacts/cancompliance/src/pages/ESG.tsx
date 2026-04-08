import { useState } from "react";
import { Leaf, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "flag";

const KEYWORDS = [
  { kw: "carbon neutral", risk: "high" },
  { kw: "net zero", risk: "high" },
  { kw: "carbon free", risk: "high" },
  { kw: "zero emissions", risk: "high" },
  { kw: "eco-friendly", risk: "med" },
  { kw: "sustainable", risk: "med" },
  { kw: "green", risk: "low" },
  { kw: "biodegradable", risk: "med" },
  { kw: "compostable", risk: "med" },
  { kw: "recyclable", risk: "med" },
  { kw: "planet positive", risk: "high" },
  { kw: "climate positive", risk: "high" },
  { kw: "environmentally friendly", risk: "med" },
  { kw: "carbon offset", risk: "high" },
];

export default function ESG() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [text, setText] = useState("");
  const [revenue, setRevenue] = useState("");
  const [context, setContext] = useState("marketing");
  const [proof, setProof] = useState("none");

  const fmt = (n: number) => "$" + n.toLocaleString("en-CA");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const found = KEYWORDS.filter(k => lower.includes(k.kw));
      const highRisk = found.filter(k => k.risk === "high");
      const rev = parseFloat(revenue) || 0;

      const penaltyCalc = () => {
        const p1 = 10000000;
        const p2 = rev * 0.03;
        return fmt(Math.max(p1, p2));
      };

      let result: Result, title: string, statute: string, action: string;

      if (context === "securities" && found.length > 0) {
        result = "pass";
        title = "PASS — Securities disclosure context: enforcement unlikely";
        statute = "Competition Act s.74.01 — Competition Bureau Final Guidelines (June 5, 2025): Environmental claims in mandatory or voluntary securities disclosures are unlikely to result in enforcement action unless used to promote a product outside the sale of securities.";
        action = `Found ${found.length} environmental term(s) in your text. In a securities/ESG disclosure context, the Competition Bureau has indicated this is unlikely to trigger enforcement. However, monitor for Budget 2025 amendments and ensure claims remain accurate.`;
      } else if (found.length === 0) {
        result = "pass";
        title = "PASS — No regulated environmental keywords detected";
        statute = "Competition Act s.74.01 · Bill C-59 Anti-Greenwashing — No substantiation obligations triggered.";
        action = "No environmental benefit claims detected. If environmental claims are added in future, re-run this check before publication.";
      } else if (proof === "none" && highRisk.length > 0) {
        result = "flag";
        title = `FLAG — ${highRisk.length} high-risk claim(s) without substantiation: legal review required`;
        statute = "Competition Act s.74.01(1)(b) — Greenwashing. Environmental benefit claims about a product must be based on adequate and proper testing. Business/activity claims must use an internationally recognized methodology.";
        action = `<strong>Flagged claims:</strong> ${highRisk.map(k => `"${k.kw}"`).join(", ")}<br><br>These claims require substantiation before publication. Without adequate testing or methodology documentation, you are exposed to Competition Bureau enforcement. Maximum penalty: ${rev > 0 ? penaltyCalc() : "minimum $10M"}.`;
      } else if (found.length > 0 && proof !== "intl" && proof !== "canadian") {
        result = "flag";
        title = `FLAG — ${found.length} environmental claim(s) require substantiation review`;
        statute = "Competition Act s.74.01 — Bill C-59. Environmental product claims must be based on adequate and proper testing.";
        action = `<strong>Detected terms:</strong> ${found.map(k => `"${k.kw}"`).join(", ")}<br><br>Partial substantiation may not meet the "adequate and proper testing" standard. Obtain full third-party testing aligned with a recognized Canadian or international standard. Maximum penalty exposure: ${rev > 0 ? penaltyCalc() : "minimum $10M"}.`;
      } else {
        result = "pass";
        title = `PASS — ${found.length} environmental claim(s) with substantiation on record`;
        statute = "Competition Act s.74.01 — Substantiation requirement met with recognized methodology.";
        action = `Found ${found.length} environmental term(s): ${found.map(k => `"${k.kw}"`).join(", ")}. Substantiation type "${proof}" is on record. Maintain documentation for audit. Monitor for regulatory changes — Budget 2025 proposes removing the international methodology requirement.`;
      }

      const entry = { id: uid(), module: "ESG", ruleId: "FR-CA-D01", input: `${found.length} keywords · ${context} · proof: ${proof}`, result: result.toUpperCase(), statute: "Competition Act s.74.01", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Keywords found", val: found.length },
        { label: "High-risk claims", val: highRisk.length },
        { label: "Max penalty exposure", val: rev > 0 ? penaltyCalc() : "Min. $10M" },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Leaf size={20} />
        <span>ESG — Greenwashing Check</span>
      </div>
      <p className="page-desc">Competition Act (Bill C-59) anti-greenwashing screening. Analyzes marketing text for environmental claims requiring substantiation under Competition Bureau enforcement guidelines (updated June 2025).</p>

      <div className="form-grid">
        <label className="form-label" style={{ gridColumn: "1 / -1" }}>
          Marketing / Advertising Text to Analyze
          <textarea className="form-input" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Paste your product description, ad copy, website text, or ESG disclosure here..." data-testid="esg-text" style={{ resize: "vertical" }} />
        </label>
        <label className="form-label">
          Annual Revenue (CAD)
          <input className="form-input" type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="For penalty calculation" data-testid="esg-revenue" />
        </label>
        <label className="form-label">
          Disclosure Context
          <select className="form-select" value={context} onChange={e => setContext(e.target.value)} data-testid="esg-context">
            <option value="marketing">Marketing / advertising / packaging</option>
            <option value="securities">Securities / ESG disclosure</option>
            <option value="website">Website / social media</option>
            <option value="report">Annual report (non-securities)</option>
          </select>
        </label>
        <label className="form-label">
          Substantiation on File
          <select className="form-select" value={proof} onChange={e => setProof(e.target.value)} data-testid="esg-proof">
            <option value="none">None — no documentation</option>
            <option value="internal">Internal testing only</option>
            <option value="third-party">Third-party testing (no intl methodology)</option>
            <option value="canadian">Canadian standards (CSA/ULC)</option>
            <option value="intl">Internationally recognized methodology (ISO, GHG Protocol)</option>
          </select>
        </label>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="esg-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Leaf size={15} />}
        Analyze ESG Claims
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
