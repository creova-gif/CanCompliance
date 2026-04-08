import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

export default function AiGovernance() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [province, setProvince] = useState("ON");
  const [useCase, setUseCase] = useState("hiring");
  const [a1, setA1] = useState(false);
  const [a2, setA2] = useState(false);
  const [a3, setA3] = useState(false);
  const [a4, setA4] = useState(false);
  const [a5, setA5] = useState(false);
  const [highImpact, setHighImpact] = useState("no");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const isQC = province === "QC";
      const issues: string[] = [], flags: string[] = [];

      if (useCase === "hiring" && !a1) {
        if (province === "ON") issues.push("FAIL: Ontario — Working for Workers Four Act (Bill 149, 2024) requires employers to disclose AI use in job postings to applicants. All job postings that use AI in screening must include a disclosure. In force January 1, 2026.");
        else flags.push("FLAG: AI use in hiring — while not yet mandated federally, the OPC has issued guidance that using AI to screen candidates carries significant PIPEDA consent and transparency obligations. Disclose AI use to applicants.");
      }

      if (isQC && useCase !== "none" && !a2) {
        issues.push("FAIL: Quebec Law 25 s.12.1 — Any automated decision system that makes a decision based exclusively on automated processing producing legal or similarly significant effects must: (1) inform the person before the decision, (2) provide reasons on request, (3) allow human review. Non-compliance: administrative penalties up to $25M or 4% of worldwide revenue.");
      }

      if (highImpact === "yes" && !a3) {
        flags.push("FLAG: High-impact AI system — AIDA (Artificial Intelligence and Data Act, Bill C-27) passed committee stage in 2024. While not yet in force, federal guidance recommends impact assessments for high-impact AI systems. Conduct and document an AI impact assessment now.");
      }

      if (!a4) flags.push("FLAG: No documented AI governance policy. Best practice (and expected under AIDA and CPPA) is a written AI governance policy covering: permitted uses, prohibited uses, human oversight requirements, data minimization, and bias testing.");

      if (!a5 && (useCase === "hiring" || useCase === "credit" || useCase === "insurance")) {
        flags.push(`FLAG: AI use in ${useCase} decisions carries elevated discrimination risk under the Canadian Human Rights Act and applicable provincial human rights codes. Ensure bias audits are conducted and disparate impact is measured and documented.`);
      }

      const result: Result = issues.length > 0 ? "fail" : flags.length > 0 ? "flag" : "pass";
      const title = result === "fail" ? `FAIL — ${issues.length} AI governance violation(s) detected`
        : result === "flag" ? `FLAG — ${flags.length} AI governance gap(s) require attention`
        : "PASS — AI governance requirements met for current jurisdiction";

      const statute = "Artificial Intelligence and Data Act (Bill C-27, AIDA — not yet in force) · "
        + (isQC ? "Act respecting the protection of personal information in the private sector (Law 25) s.12.1 · " : "")
        + "Working for Workers Four Act SO 2024 (Ontario — AI hiring disclosure, in force Jan 1 2026) · Canadian Human Rights Act RSC 1985 c.H-6";

      const action = result === "pass"
        ? "AI governance requirements are met for your current use case and jurisdiction. Monitor closely — AIDA (federal) is expected to receive Royal Assent in 2025-2026, introducing mandatory impact assessments, transparency reports, and harm mitigation plans for high-impact AI systems."
        : (issues.concat(flags)).map(i => "• " + i).join("<br>");

      const entry = { id: uid(), module: "AI Gov.", ruleId: "FR-CA-L01", input: `${province} · ${useCase} · high-impact:${highImpact}`, result: result.toUpperCase(), statute: "AIDA · Law 25 · Workers IV", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Province", val: province },
        { label: "Use case", val: useCase },
        { label: "AIDA status", val: "In committee — not yet in force" },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Brain size={20} />
        <span>AI Governance</span>
      </div>
      <p className="page-desc">Canadian AI compliance check — Ontario hiring disclosure (Workers IV, Jan 2026), Quebec Law 25 s.12.1 automated decisions, AIDA readiness, and human rights obligations.</p>

      <div className="form-grid">
        <label className="form-label">
          Province / Jurisdiction
          <select className="form-select" value={province} onChange={e => setProvince(e.target.value)} data-testid="ai-province">
            <option value="ON">Ontario</option>
            <option value="QC">Quebec (Law 25 applies)</option>
            <option value="BC">British Columbia</option>
            <option value="AB">Alberta</option>
            <option value="FED">Federal</option>
          </select>
        </label>
        <label className="form-label">
          AI Use Case
          <select className="form-select" value={useCase} onChange={e => setUseCase(e.target.value)} data-testid="ai-usecase">
            <option value="hiring">Hiring / candidate screening</option>
            <option value="credit">Credit / lending decisions</option>
            <option value="insurance">Insurance underwriting</option>
            <option value="content">Content generation / moderation</option>
            <option value="analytics">Business analytics / forecasting</option>
            <option value="none">Not customer-facing</option>
          </select>
        </label>
        <label className="form-label">
          High-Impact AI System?
          <select className="form-select" value={highImpact} onChange={e => setHighImpact(e.target.value)} data-testid="ai-highimpact">
            <option value="no">No — internal / low-stakes use</option>
            <option value="yes">Yes — affects employment, credit, safety, or legal rights</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>GOVERNANCE CONTROLS IN PLACE — check all that apply:</div>
        <div className="checks-grid">
          {[
            [a1, setA1, "AI use disclosed to applicants in job postings (Ontario — mandatory Jan 1 2026)"],
            [a2, setA2, "Automated decisions disclosed to affected individuals with right to human review (Quebec Law 25)"],
            [a3, setA3, "AI Impact Assessment completed and documented"],
            [a4, setA4, "Written AI governance policy in place"],
            [a5, setA5, "Bias audit conducted for customer-facing AI decisions"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="ai-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Brain size={15} />}
        Run AI Governance Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
