import { useState } from "react";
import { Users, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

const MIN_WAGES: Record<string, number> = { ON: 17.20, BC: 17.85, AB: 15.00, QC: 15.75, FED: 17.30, MB: 15.80, SK: 14.00 };
const OT_THRESHOLDS: Record<string, number> = { ON: 44, BC: 40, AB: 44, QC: 40, FED: 40, MB: 40, SK: 40 };
const NOTICE: Record<string, Record<string, string>> = {
  under3m: { ON: "No notice required", BC: "No notice", AB: "No notice", QC: "No notice", FED: "No notice" },
  "3mto1y": { ON: "1 week", BC: "1 week", AB: "1 week", QC: "1 week", FED: "2 weeks" },
  "1to3y": { ON: "2 weeks", BC: "2 weeks", AB: "2 weeks", QC: "2 weeks", FED: "4 weeks" },
  "3to5y": { ON: "3 weeks", BC: "3 weeks", AB: "3 weeks", QC: "3 weeks", FED: "6 weeks" },
  "5to10y": { ON: "4 weeks", BC: "5 weeks", AB: "4 weeks", QC: "4 weeks", FED: "8 weeks" },
  over10y: { ON: "8 weeks", BC: "8 weeks", AB: "8 weeks", QC: "8 weeks", FED: "8 weeks + severance" },
};

export default function Employment() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [province, setProvince] = useState("ON");
  const [wage, setWage] = useState("");
  const [hours, setHours] = useState("40");
  const [tenure, setTenure] = useState("1to3y");
  const [size, setSize] = useState("5to24");
  const [c4, setC4] = useState(false);
  const [c5, setC5] = useState(false);
  const [c6, setC6] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const wageNum = parseFloat(wage) || 0;
      const hoursNum = parseFloat(hours) || 40;
      const fmt = (n: number) => "$" + n.toFixed(2);
      const minWage = MIN_WAGES[province] || 15.00;
      const otThreshold = OT_THRESHOLDS[province] || 40;
      const issues: string[] = [];
      const policyIssues: string[] = [];

      if (wageNum > 0 && wageNum < minWage) {
        issues.push(`FAIL: Wage ${fmt(wageNum)}/hr is below the ${province} minimum wage of ${fmt(minWage)}/hr. Underpayment is recoverable by the employee plus penalties.`);
      }

      let overtimeHours = 0, overtimePay = 0;
      if (hoursNum > otThreshold) {
        overtimeHours = hoursNum - otThreshold;
        overtimePay = overtimeHours * wageNum * 1.5;
        issues.push(`Overtime: ${overtimeHours.toFixed(1)}h worked beyond ${otThreshold}h threshold. Employee is entitled to ${fmt(overtimePay)} overtime premium at 1.5× regular rate.`);
      }

      const sizeNum: Record<string, number> = { under5: 4, "5to24": 14, "25to49": 37, "50to99": 75, "100plus": 150 }[size] || 0;

      if (c4 && province === "BC") policyIssues.push("BC FAIL: Psychological harassment prevention policy is MANDATORY from September 1, 2025. Written policy must address prevention, reporting, and response.");
      if (c5 && province === "ON" && sizeNum >= 25) policyIssues.push("ON FLAG: Electronic monitoring policy required for employers with 25+ employees in Ontario (ESA s.21.1.1). Must be in writing and provided to all employees.");
      if (c6 && province === "ON" && sizeNum >= 25) policyIssues.push("ON FLAG: Right to disconnect policy required for employers with 25+ employees (ESA s.21.1.2). Policy must outline expectations for responding to communications outside work hours.");

      const notice = NOTICE[tenure]?.[province] || "Varies by jurisdiction";
      const hasWageFail = issues.some(i => i.startsWith("FAIL"));
      const hasPolicyFail = policyIssues.some(i => i.includes("FAIL"));
      const result: Result = (hasWageFail || hasPolicyFail) ? "fail" : issues.length > 0 || policyIssues.length > 0 ? "flag" : "pass";

      const title = result === "fail" ? `FAIL — Employment standards violation(s) in ${province}`
        : result === "flag" ? `FLAG — ${issues.length + policyIssues.length} compliance item(s) require attention`
        : `PASS — Employment standards met in ${province}`;

      const statute = result === "pass"
        ? `${province === "ON" ? "Employment Standards Act 2000" : province === "BC" ? "Employment Standards Act RSBC 1996" : province === "FED" ? "Canada Labour Code RSC 1985" : "Employment Standards legislation"} — No violations detected.`
        : `${province === "ON" ? "Employment Standards Act 2000 s.23.1 (minimum wage), s.22 (overtime), s.57 (termination)" : province === "BC" ? "Employment Standards Act RSBC 1996 — ss.16, 40, 63" : "Applicable employment standards legislation"}`;

      const action = result === "pass"
        ? `Wage of ${fmt(wageNum)}/hr is at or above the ${province} minimum wage of ${fmt(minWage)}/hr. Hours (${hoursNum}h/wk) are within the ${otThreshold}h standard threshold. Termination notice for this tenure: <strong>${notice}</strong>. All checked policies are in place.`
        : (issues.concat(policyIssues)).map(i => "• " + i).join("<br>") + `<br><br><strong>Required termination notice for this tenure:</strong> ${notice}`;

      const entry = { id: uid(), module: "Employment", ruleId: "FR-CA-H01", input: `${province} · ${fmt(wageNum)}/hr · ${hoursNum}h/wk · ${tenure}`, result: result.toUpperCase(), statute: "ESA / Labour Code", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Min wage", val: fmt(minWage) + "/hr" },
        { label: "OT threshold", val: otThreshold + "h/wk" },
        { label: "Notice period", val: notice },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Users size={20} />
        <span>Employment Standards</span>
      </div>
      <p className="page-desc">Provincial employment standards checker — minimum wage, overtime thresholds, termination notice periods, and mandatory workplace policies by jurisdiction.</p>

      <div className="form-grid">
        <label className="form-label">
          Province / Jurisdiction
          <select className="form-select" value={province} onChange={e => setProvince(e.target.value)} data-testid="emp-province">
            <option value="ON">Ontario (ESA 2000)</option>
            <option value="BC">British Columbia</option>
            <option value="AB">Alberta</option>
            <option value="QC">Quebec (LNT)</option>
            <option value="FED">Federal (Canada Labour Code)</option>
            <option value="MB">Manitoba</option>
            <option value="SK">Saskatchewan</option>
          </select>
        </label>
        <label className="form-label">
          Hourly Wage (CAD)
          <input className="form-input" type="number" step="0.01" value={wage} onChange={e => setWage(e.target.value)} placeholder="e.g. 18.50" data-testid="emp-wage" />
        </label>
        <label className="form-label">
          Hours Worked Per Week
          <input className="form-input" type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="40" data-testid="emp-hours" />
        </label>
        <label className="form-label">
          Employment Tenure
          <select className="form-select" value={tenure} onChange={e => setTenure(e.target.value)} data-testid="emp-tenure">
            <option value="under3m">Under 3 months</option>
            <option value="3mto1y">3 months to 1 year</option>
            <option value="1to3y">1 to 3 years</option>
            <option value="3to5y">3 to 5 years</option>
            <option value="5to10y">5 to 10 years</option>
            <option value="over10y">Over 10 years</option>
          </select>
        </label>
        <label className="form-label">
          Employer Size
          <select className="form-select" value={size} onChange={e => setSize(e.target.value)} data-testid="emp-size">
            <option value="under5">Under 5 employees</option>
            <option value="5to24">5 to 24 employees</option>
            <option value="25to49">25 to 49 employees</option>
            <option value="50to99">50 to 99 employees</option>
            <option value="100plus">100+ employees</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>POLICY GAPS — check if any policy is MISSING:</div>
        <div className="checks-grid">
          {[
            [c4, setC4, "Psychological harassment prevention policy is MISSING (BC — mandatory Sept 1 2025)"],
            [c5, setC5, "Electronic monitoring policy is MISSING (Ontario employers with 25+ employees)"],
            [c6, setC6, "Right to disconnect policy is MISSING (Ontario employers with 25+ employees)"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="emp-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Users size={15} />}
        Run Employment Standards Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
