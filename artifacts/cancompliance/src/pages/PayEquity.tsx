import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

export default function PayEquity() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [employees, setEmployees] = useState("30");
  const [province, setProvince] = useState("ontario");
  const [hasPlan, setHasPlan] = useState("no");
  const [hasJobEval, setHasJobEval] = useState("no");
  const [hasPostedSalary, setHasPostedSalary] = useState("no");
  const [hasGenderGap, setHasGenderGap] = useState("unknown");
  const [hasFederalContracts, setHasFederalContracts] = useState("no");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const emp = parseInt(employees) || 0;
      const issues: string[] = [];
      let result: "pass" | "fail" | "flag" = "pass";

      const isFederal = hasFederalContracts === "yes";
      const isOntario = province === "ontario";
      const isBC = province === "bc";
      const isPEI = province === "pei";

      if (isOntario && emp >= 10) {
        if (hasPlan === "no") issues.push("No Pay Equity Plan — Ontario Pay Equity Act requires plan for 10+ employees, posted in workplace");
        if (hasJobEval === "no" && emp >= 10) issues.push("No gender-neutral job evaluation system — required to compare male/female job classes under Ontario PEA");
        if (hasGenderGap === "yes") issues.push("Known gender pay gap exists — equity adjustments must be made with retroactive pay under Ontario PEA");
      }
      if (isBC && emp >= 50) {
        if (hasPostedSalary === "no") issues.push("No salary transparency in job postings — BC Pay Transparency Act requires salary ranges in all job ads since 2023");
        if (hasJobEval === "no") issues.push("No pay transparency report — BC employers with 50+ employees must file annual pay transparency report");
      }
      if (isPEI) {
        if (hasPostedSalary === "no") issues.push("No salary posting — PEI Pay Equity Act requires salary disclosure in job advertisements");
      }
      if (isFederal && emp >= 10) {
        if (hasPlan === "no") issues.push("No pay equity plan — Federal Pay Equity Act (2021) requires proactive plans for federally regulated employers with 10+ employees");
        if (hasJobEval === "no") issues.push("No job evaluation methodology — required under Federal Pay Equity Act to compare work of equal value");
      }

      if (issues.length >= 3) result = "fail";
      else if (issues.length >= 1) result = "flag";

      const entry = {
        id: uid(), module: "Pay Equity", ruleId: "PE-CA-C01",
        input: `${emp} employees · ${province} · federal contracts: ${hasFederalContracts}`,
        result: result.toUpperCase(), statute: "Ontario Pay Equity Act · Federal Pay Equity Act 2021 · BC Pay Transparency Act",
        timestamp: ts(),
      };
      logCheck(entry);

      const title = result === "pass"
        ? "PASS — Pay equity obligations appear met for your jurisdiction"
        : result === "fail"
        ? `FAIL — ${issues.length} pay equity violations detected — risk of complaints and retroactive pay orders`
        : `FLAG — ${issues.length} pay equity gap(s) requiring attention`;

      const statute = "Ontario Pay Equity Act (1990) — applies to 10+ employee workplaces. Federal Pay Equity Act (2021) — applies to federally regulated employers. BC Pay Transparency Act (2023) — salary posting mandatory. PEI Pay Equity Act. Violations can result in retroactive wage increases, pay equity hearings, and reputational damage.";

      const action = issues.length === 0
        ? "Pay equity practices appear compliant. Update your pay equity plan every 5 years (Ontario) or when significant changes occur. Maintain documentation of your job evaluation methodology."
        : `Pay equity gaps:\n${issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}\n\nStart with a gender-neutral job evaluation system and document your methodology. Ontario employers must post the plan in the workplace.`;

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Employees", val: emp },
        { label: "Province", val: province },
        { label: "Gaps", val: `${issues.length}` },
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
      <div style={{ background: "rgba(127,119,221,0.10)", border: "1px solid rgba(127,119,221,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "#7F77DD", background: "rgba(127,119,221,0.2)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>MULTI-PROVINCE · FEDERAL PAY EQUITY ACT 2021 · BC PAY TRANSPARENCY 2023</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>Pay Equity & Transparency — Stacked obligations across provinces</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Ontario, BC, PEI, and federally regulated employers face layered pay equity requirements. BC now mandates salary ranges in every job posting. Ontario requires a documented pay equity plan for 10+ employees. The Federal Pay Equity Act introduced proactive employer obligations in 2021.
        </div>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Pay Equity & Transparency Checker</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={lblStyle} className={lbl}>Number of Employees</label>
            <input type="number" min="1" value={employees} onChange={e => setEmployees(e.target.value)}
              style={{ ...selStyle, padding: "8px 12px", borderRadius: 8, fontSize: 12, width: "100%", outline: "none" }} />
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Primary province of operations</label>
            <select value={province} onChange={e => setProvince(e.target.value)} style={selStyle} className={sel}>
              <option value="ontario">Ontario</option>
              <option value="bc">British Columbia</option>
              <option value="pei">PEI</option>
              <option value="federal">Federal jurisdiction</option>
              <option value="other">Other province</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Federal government contracts?</label>
            <select value={hasFederalContracts} onChange={e => setHasFederalContracts(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — federally regulated / crown</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Pay equity plan documented?</label>
            <select value={hasPlan} onChange={e => setHasPlan(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — posted in workplace</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Gender-neutral job evaluation system?</label>
            <select value={hasJobEval} onChange={e => setHasJobEval(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — documented methodology</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Salary ranges in job postings?</label>
            <select value={hasPostedSalary} onChange={e => setHasPostedSalary(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — all postings include range</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Known gender pay gap?</label>
            <select value={hasGenderGap} onChange={e => setHasGenderGap(e.target.value)} style={selStyle} className={sel}>
              <option value="unknown">Not assessed</option>
              <option value="no">No — gap analysis shows equity</option>
              <option value="yes">Yes — gap exists</option>
            </select>
          </div>
        </div>
        <button onClick={run} disabled={loading}
          className="mt-5 w-full py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#c8f135", color: "#09090a" }}>
          {loading ? "Checking pay equity obligations…" : "Run Pay Equity Check →"}
        </button>
      </div>

      {res && <ResultCard result={res.result} title={res.title} statute={res.statute} action={res.action} meta={res.meta} />}

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Province-by-Province Requirements</div>
        <div className="space-y-2">
          {[
            { prov: "Ontario", law: "Pay Equity Act", threshold: "10+ employees", key: "Gender-neutral job eval + posted plan required" },
            { prov: "BC", law: "Pay Transparency Act (2023)", threshold: "50+ employees", key: "Salary ranges in ALL job postings, annual report" },
            { prov: "PEI", law: "Pay Equity Act", threshold: "10+ public sector", key: "Salary disclosure in job ads" },
            { prov: "Federal", law: "Pay Equity Act (2021)", threshold: "10+ fed. regulated", key: "Proactive plan within 3 years of new obligation" },
            { prov: "Alberta, SK, MB, NS", law: "No provincial act", threshold: "N/A", key: "Federal protections apply for fed-regulated only" },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3" style={{ background: "var(--bg3)", padding: "10px 14px", borderRadius: 8 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#7F77DD", minWidth: 72 }}>{r.prov}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", minWidth: 60 }}>{r.threshold}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", flex: 1 }}>{r.key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
