import { useState } from "react";
import { HardHat, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

export default function Safety() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [province, setProvince] = useState("ON");
  const [empCount, setEmpCount] = useState("");
  const [industry, setIndustry] = useState("office");
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [s3, setS3] = useState(false);
  const [s4, setS4] = useState(false);
  const [s5, setS5] = useState(false);
  const [s6, setS6] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const emp = parseInt(empCount) || 0;
      const jhscThreshold = 20;
      const needsJHSC = emp >= jhscThreshold;
      const needsDefibrillator = province === "ON" && emp >= 50;
      const issues: string[] = [];

      if (!s1) issues.push(`FAIL: Written health & safety policy is mandatory in ${province} for all employers. This must be signed by a senior officer, posted prominently, and reviewed annually.`);
      if (needsJHSC && !s2) issues.push(`FAIL: Joint Health & Safety Committee (JHSC) is MANDATORY for employers with ${emp} employees in ${province} (threshold: ${jhscThreshold}+ workers). Committee must meet at least monthly.`);
      if (province === "BC" && !s3) issues.push("FAIL: BC — Psychological Harassment Prevention Policy is MANDATORY from September 1, 2025 (Workers Compensation Amendment Act). Must include definition of harassment, reporting procedure, investigation process, and consequences.");
      if (!s4) issues.push(`FAIL: Workplace Violence and Harassment Policy is required under ${province === "ON" ? "OHSA s.32.0.1" : province === "BC" ? "Workers Compensation Act" : province === "QC" ? "Act respecting Labour Standards s.81.19" : "applicable OHS legislation"}. Must be in writing and reviewed annually.`);
      if (!s5) issues.push(`FAIL: WSIB/WCB premiums must be current. Unregistered employers face penalties plus retroactive premiums. Register at ${province === "ON" ? "wsib.ca" : province === "BC" ? "worksafebc.com" : province === "AB" ? "wcb.ab.ca" : province === "QC" ? "cnesst.gouv.qc.ca" : "applicable board"}.`);
      if (needsDefibrillator && !s6) issues.push("FLAG: Ontario OHSA (as amended by Bill 30, Nov 2025) — Certain employers with 50+ employees in buildings accessible to the public may be required to install an AED. Check specific OHSA regulations for your building type.");

      const highRisk = ["construction", "manufacturing", "warehouse"].includes(industry);
      if (highRisk && emp > 0) {
        issues.push(`FLAG: ${industry} sector is classified HIGH RISK. Ensure sector-specific regulations apply: ${
          industry === "construction" ? "Construction Regulations O.Reg 213/91 (ON) — supervisor certification, fall protection, and daily site inspections required."
          : industry === "manufacturing" ? "Industrial Establishments Regulation O.Reg 851 (ON) — machine guarding, lockout/tagout procedures mandatory."
          : "Warehouse: forklift operator certification, racking inspection programs required."
        }`);
      }

      const failCount = issues.filter(i => i.startsWith("FAIL")).length;
      const result: Result = failCount > 0 ? "fail" : issues.length > 0 ? "flag" : "pass";

      const title = result === "fail" ? `FAIL — ${failCount} mandatory safety program(s) missing`
        : result === "flag" ? `FLAG — ${issues.length} safety item(s) require review`
        : `PASS — Workplace safety programs are in place for ${province}`;

      const statute = province === "ON"
        ? "Occupational Health and Safety Act RSO 1990 c.O.1 (as amended by Working for Workers Seven Act 2025)"
        : province === "BC"
        ? "Workers Compensation Act RSBC 2019 (as amended Sept 2025)"
        : province === "QC"
        ? "Act respecting Occupational Health and Safety CQLR c.S-2.1"
        : "Canada Occupational Health and Safety Regulations SOR/86-304";

      const action = result === "pass"
        ? `All required safety programs are in place for a ${emp}-person ${industry} operation in ${province}. Conduct annual policy reviews and JHSC meeting minutes. Maximum penalty: ${province === "ON" ? "$1,500,000 for corporations (OHSA s.66)" : "$500,000+"}.`
        : issues.map(i => "• " + i).join("<br>");

      const entry = { id: uid(), module: "Safety", ruleId: "FR-CA-J01", input: `${province} · ${emp} employees · ${industry}`, result: result.toUpperCase(), statute: statute.split("(")[0].trim(), timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Province", val: province },
        { label: "JHSC required", val: needsJHSC ? `Yes (${jhscThreshold}+ threshold)` : "No" },
        { label: "Max penalty", val: province === "ON" ? "$1,500,000" : "up to $500K+" },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <HardHat size={20} />
        <span>Workplace Safety (OHS)</span>
      </div>
      <p className="page-desc">Occupational health and safety compliance check — mandatory policies, JHSC thresholds, WSIB/WCB registration, and sector-specific requirements by province.</p>

      <div className="form-grid">
        <label className="form-label">
          Province
          <select className="form-select" value={province} onChange={e => setProvince(e.target.value)} data-testid="safe-province">
            <option value="ON">Ontario (OHSA)</option>
            <option value="BC">British Columbia</option>
            <option value="AB">Alberta</option>
            <option value="QC">Quebec (LSST)</option>
            <option value="FED">Federal (Canada OHS Regs)</option>
          </select>
        </label>
        <label className="form-label">
          Number of Employees
          <input className="form-input" type="number" value={empCount} onChange={e => setEmpCount(e.target.value)} placeholder="e.g. 35" data-testid="safe-emp" />
        </label>
        <label className="form-label">
          Industry / Sector
          <select className="form-select" value={industry} onChange={e => setIndustry(e.target.value)} data-testid="safe-industry">
            <option value="office">Office / professional services</option>
            <option value="retail">Retail / hospitality</option>
            <option value="construction">Construction</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="warehouse">Warehouse / logistics</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>SAFETY PROGRAMS IN PLACE — check all that apply:</div>
        <div className="checks-grid">
          {[
            [s1, setS1, "Written health & safety policy (signed, posted, reviewed annually)"],
            [s2, setS2, "Joint Health & Safety Committee (JHSC) established and meeting monthly"],
            [s3, setS3, "Psychological Harassment Prevention Policy (BC — mandatory Sept 1 2025)"],
            [s4, setS4, "Workplace Violence and Harassment Policy in place"],
            [s5, setS5, "WSIB / WCB registered and premiums current"],
            [s6, setS6, "AED (defibrillator) installed in public-accessible building (Ontario 50+ emp)"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="safe-run">
        {loading ? <Loader2 size={15} className="spin" /> : <HardHat size={15} />}
        Run Safety Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
