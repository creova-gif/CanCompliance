import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

export default function AODA() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [employees, setEmployees] = useState("25");
  const [province, setProvince] = useState("ontario");
  const [hasPolicy, setHasPolicy] = useState("no");
  const [hasWebsite, setHasWebsite] = useState("yes");
  const [wcagLevel, setWcagLevel] = useState("none");
  const [hasTraining, setHasTraining] = useState("no");
  const [hasEmergency, setHasEmergency] = useState("no");
  const [hasFeedback, setHasFeedback] = useState("no");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const emp = parseInt(employees) || 0;
      const issues: string[] = [];
      let result: "pass" | "fail" | "flag" = "pass";

      const isOntario = province === "ontario";
      const obligated = isOntario && emp >= 1;
      const largeOrg = emp >= 50;

      if (obligated) {
        if (hasPolicy === "no") issues.push("No accessibility policy — AODA s.3 requires written policy for all Ontario employers");
        if (hasWebsite === "yes" && wcagLevel === "none") issues.push("Website not WCAG 2.0 Level AA compliant — IASR s.14 mandatory for 20+ employee organizations");
        if (hasWebsite === "yes" && wcagLevel === "a") issues.push("Website only WCAG 2.0 Level A — IASR s.14 requires Level AA");
        if (hasTraining === "no") issues.push("No AODA training program — mandatory for all staff under IASR s.7");
        if (hasEmergency === "no" && largeOrg) issues.push("No individualized emergency plans for employees with disabilities — OHSA + IASR s.27 requirement");
        if (hasFeedback === "no" && largeOrg) issues.push("No accessible feedback process — IASR s.11 requires feedback mechanism for 50+ employee orgs");
      } else if (!isOntario) {
        issues.push("Province selected is not Ontario — AODA only applies in Ontario. Check your province's accessibility standards.");
      }

      if (issues.length >= 3) result = "fail";
      else if (issues.length >= 1) result = "flag";

      const entry = {
        id: uid(), module: "AODA", ruleId: "AODA-C01",
        input: `${employees} employees · ${province} · WCAG: ${wcagLevel}`,
        result: result.toUpperCase(), statute: "AODA 2005 · IASR O.Reg 191/11",
        timestamp: ts(),
      };
      logCheck(entry);

      const maxFine = emp >= 20 ? "$100,000/day" : "$50,000/day";
      const title = result === "pass"
        ? "PASS — AODA accessibility obligations appear to be met"
        : result === "fail"
        ? `FAIL — ${issues.length} AODA violations detected — risk up to ${maxFine}`
        : `FLAG — ${issues.length} AODA gap(s) identified — remediation required`;

      const statute = "Accessibility for Ontarians with Disabilities Act, 2005 (AODA) · Integrated Accessibility Standards Regulation (IASR) O.Reg 191/11 · WCAG 2.0 Level AA required for websites of 20+ employee organizations. Fines up to $100,000/day for corporations.";

      const action = issues.length === 0
        ? "Your organization meets current AODA obligations. Continue annual accessibility reviews and file your next compliance report with the Ontario government on schedule."
        : `AODA gaps identified:\n${issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}\n\nImmediate priority: achieve WCAG 2.0 Level AA on your website and document your accessibility policy.`;

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Province", val: province },
        { label: "Employees", val: emp },
        { label: "Max fine", val: emp >= 20 ? "$100K/day" : "$50K/day" },
      ]});
      setLoading(false);
    }, 700);
  };

  const sel = "w-full px-3 py-2 rounded-lg border text-[12px] appearance-none cursor-pointer focus:outline-none";
  const selStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };
  const lbl = "block text-[11px] font-medium mb-1.5 uppercase tracking-widest";
  const lblStyle = { color: "var(--text3)", fontFamily: "var(--mono)" };

  return (
    <div className="page-content">
      <div style={{ background: "rgba(200,241,53,0.08)", border: "1px solid rgba(200,241,53,0.25)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "var(--green)", background: "rgba(18,183,106,0.2)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>AODA 2005 · IN FORCE · IASR O.REG 191/11</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>WCAG 2.0 Level AA — Website accessibility is legally mandatory in Ontario</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Every Ontario organization with 1+ employee must comply with AODA. Organizations with 20+ employees must have WCAG 2.0 Level AA compliant websites. Fines reach <strong>$100,000 per day</strong> for corporations. Most SMBs are non-compliant and unaware.
        </div>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>AODA Compliance Checker</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={lblStyle} className={lbl}>Number of Employees</label>
            <input type="number" min="1" value={employees} onChange={e => setEmployees(e.target.value)}
              style={{ ...selStyle, padding: "8px 12px", borderRadius: 8, fontSize: 12, width: "100%", outline: "none" }} />
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)} style={selStyle} className={sel}>
              <option value="ontario">Ontario</option>
              <option value="bc">British Columbia</option>
              <option value="alberta">Alberta</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Written accessibility policy?</label>
            <select value={hasPolicy} onChange={e => setHasPolicy(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — documented</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Business has a website?</label>
            <select value={hasWebsite} onChange={e => setHasWebsite(e.target.value)} style={selStyle} className={sel}>
              <option value="yes">Yes</option><option value="no">No</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Website WCAG compliance level</label>
            <select value={wcagLevel} onChange={e => setWcagLevel(e.target.value)} style={selStyle} className={sel}>
              <option value="none">Not assessed / non-compliant</option>
              <option value="a">WCAG 2.0 Level A only</option>
              <option value="aa">WCAG 2.0 Level AA ✓</option>
              <option value="aaa">WCAG 2.0 Level AAA ✓</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>AODA training for all staff?</label>
            <select value={hasTraining} onChange={e => setHasTraining(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — documented</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Emergency plans for disabilities?</label>
            <select value={hasEmergency} onChange={e => setHasEmergency(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Accessible feedback mechanism?</label>
            <select value={hasFeedback} onChange={e => setHasFeedback(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
        </div>
        <button onClick={run} disabled={loading}
          className="mt-5 w-full py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#c8f135", color: "#09090a" }}>
          {loading ? "Running AODA check…" : "Run AODA Compliance Check →"}
        </button>
      </div>

      {res && <ResultCard result={res.result} title={res.title} statute={res.statute} action={res.action} meta={res.meta} />}

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>AODA Compliance Timeline</div>
        <div className="space-y-3">
          {[
            { year: "2012", size: "50+ employees", req: "Accessibility policy + customer service training", done: true },
            { year: "2014", size: "1+ employees", req: "Customer service standard — all public-facing staff", done: true },
            { year: "2021", size: "20+ employees", req: "WCAG 2.0 Level AA websites mandatory", done: true },
            { year: "2025", size: "All obligated orgs", req: "Annual reporting to Ontario government", done: true },
            { year: "Ongoing", size: "All", req: "Document compliance, respond to audits within 30 days", done: false },
          ].map((m, i) => (
            <div key={i} className="flex items-start gap-3" style={{ background: "var(--bg3)", padding: "10px 14px", borderRadius: 8 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: m.done ? "var(--green)" : "var(--amber)", minWidth: 56 }}>{m.year}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", minWidth: 80, fontFamily: "var(--mono)" }}>{m.size}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", flex: 1 }}>{m.req}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
