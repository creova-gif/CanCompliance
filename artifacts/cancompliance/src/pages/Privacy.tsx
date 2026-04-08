import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

export default function Privacy() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [type, setType] = useState("federal");
  const [p1, setP1] = useState(false);
  const [p2, setP2] = useState(false);
  const [p3, setP3] = useState(false);
  const [p4, setP4] = useState(false);
  const [p5, setP5] = useState(false);
  const [p6, setP6] = useState(false);
  const [policy, setPolicy] = useState("current");
  const [officer, setOfficer] = useState("yes");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const isQC = type === "qc";
      const issues: string[] = [], flags: string[] = [];

      if (policy === "no") issues.push("FAIL: No privacy policy published. PIPEDA Principle 8 requires organizations to make their privacy policies available. Quebec Law 25 requires publication on your website.");
      if (policy === "outdated") flags.push("FLAG: Privacy policy not updated in 2+ years. With ongoing regulatory changes (Quebec Law 25 fully in force 2024, incoming CPPA), your policy likely does not reflect current obligations.");
      if (officer === "no") flags.push("FLAG: No designated privacy officer. PIPEDA Principle 1 (Accountability) requires a designated individual to be accountable for the organization's compliance. Quebec Law 25 requires a person in authority to be designated.");
      if (p1) issues.push("FAIL: Sensitive data collected requires EXPRESS (opt-in) consent under PIPEDA. Implied consent is insufficient for health, financial, biometric, or other sensitive data.");
      if (p2) {
        if (isQC) issues.push("FAIL: Quebec Law 25 s.12.1 — When an automated decision system makes a decision based exclusively on automated processing that produces legal or similarly significant effects, you must inform the person and on request provide the reasons, principal factors, and right to human review.");
        else flags.push("FLAG: Automated decision systems — PIPEDA requires meaningful transparency when automated decisions significantly affect individuals. Document the system and provide an explanation mechanism.");
      }
      if (p3) flags.push("FLAG: Cross-border data transfer — PIPEDA requires comparable protection when transferring personal information outside Canada. Use contractual protections (data processing agreements). Document transfer mechanisms.");
      if (p4 && isQC) issues.push("FAIL: Quebec Law 25 — A Privacy Impact Assessment (PIA) is MANDATORY before launching any technology project involving personal information. Cannot proceed without completing and documenting the PIA.");
      if (p4 && !isQC) flags.push("FLAG: Best practice — conduct a Privacy Impact Assessment before launching new data projects. While not mandatory federally under PIPEDA, it will be mandatory under the incoming CPPA.");
      if (p5) issues.push("FAIL: Data breach occurred — under PIPEDA, you must report to the Office of the Privacy Commissioner if it creates a real risk of significant harm, AND notify affected individuals directly. Failure to report: up to $100,000 penalty.");
      if (p6) flags.push("FLAG: Children's data requires heightened consent. PIPEDA requires verifiable parental consent for children who cannot meaningfully consent themselves. Quebec Law 25 has specific children's privacy provisions.");

      const result: Result = issues.length > 0 ? "fail" : flags.length > 0 ? "flag" : "pass";
      const title = result === "fail" ? `FAIL — ${issues.length} privacy violation(s) under ${isQC ? "Quebec Law 25" : "PIPEDA"}`
        : result === "flag" ? `FLAG — ${flags.length} privacy risk(s) require attention`
        : "PASS — Privacy practices meet current Canadian requirements";

      const statute = "Personal Information Protection and Electronic Documents Act SC 2000 c.5 (PIPEDA)" + (isQC ? " · Act respecting the protection of personal information in the private sector (Law 25) RSQ c.P-39.1" : " · OPC Guidance");
      const action = result === "pass"
        ? "Privacy practices are compliant with current PIPEDA requirements and applicable provincial law. Monitor for the incoming federal CPPA legislation (expected 2026) which will bring fines up to the greater of $25M or 5% of global revenue."
        : (issues.concat(flags)).map(i => "• " + i).join("<br>");

      const entry = { id: uid(), module: "Privacy", ruleId: "FR-CA-I01", input: `${type} · policy:${policy} · officer:${officer}`, result: result.toUpperCase(), statute: "PIPEDA · Law 25", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Jurisdiction", val: isQC ? "Quebec Law 25" : "PIPEDA" },
        { label: "Issues", val: issues.length },
        { label: "Flags", val: flags.length },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Lock size={20} />
        <span>Privacy / PIPEDA</span>
      </div>
      <p className="page-desc">PIPEDA and Quebec Law 25 compliance assessment — consent practices, privacy policies, officer designation, breach reporting, and Privacy Impact Assessments.</p>

      <div className="form-grid">
        <label className="form-label">
          Applicable Jurisdiction
          <select className="form-select" value={type} onChange={e => setType(e.target.value)} data-testid="priv-type">
            <option value="federal">Federal PIPEDA (all other provinces)</option>
            <option value="qc">Quebec Law 25 (most stringent)</option>
            <option value="bc">BC PIPA</option>
            <option value="ab">Alberta PIPA</option>
          </select>
        </label>
        <label className="form-label">
          Privacy Policy Status
          <select className="form-select" value={policy} onChange={e => setPolicy(e.target.value)} data-testid="priv-policy">
            <option value="current">Published and current (updated within 2 years)</option>
            <option value="outdated">Published but outdated (2+ years old)</option>
            <option value="no">No published privacy policy</option>
          </select>
        </label>
        <label className="form-label">
          Designated Privacy Officer
          <select className="form-select" value={officer} onChange={e => setOfficer(e.target.value)} data-testid="priv-officer">
            <option value="yes">Yes — designated and documented</option>
            <option value="no">No designated privacy officer</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>RISK FLAGS — check all that apply to your organization:</div>
        <div className="checks-grid">
          {[
            [p1, setP1, "You collect sensitive data (health, financial, biometric) with implied/passive consent"],
            [p2, setP2, "You use automated systems to make decisions that affect individuals"],
            [p3, setP3, "You transfer personal data outside Canada"],
            [p4, setP4, "You launched a technology project without completing a Privacy Impact Assessment"],
            [p5, setP5, "A data breach occurred and may create a real risk of significant harm"],
            [p6, setP6, "You collect personal data from individuals under 18"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="priv-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Lock size={15} />}
        Run Privacy Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
