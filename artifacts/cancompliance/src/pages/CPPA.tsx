import { useState } from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

export default function CPPA() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [employees, setEmployees] = useState("10");
  const [collects, setCollects] = useState("yes");
  const [hasOfficer, setHasOfficer] = useState("no");
  const [hasPIA, setHasPIA] = useState("no");
  const [hasConsent, setHasConsent] = useState("no");
  const [hasBreachPlan, setHasBreachPlan] = useState("no");
  const [usesAI, setUsesAI] = useState("no");
  const [crossBorder, setCrossBorder] = useState("no");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const emp = parseInt(employees) || 0;
      const collectsData = collects === "yes";
      const issues: string[] = [];
      let result: "pass" | "fail" | "flag" = "pass";

      if (collectsData && hasOfficer === "no") issues.push("No designated Privacy Officer — mandatory under CPPA s.62");
      if (collectsData && hasPIA === "no") issues.push("No Privacy Impact Assessment (PIA) process — required under CPPA s.57");
      if (collectsData && hasConsent === "no") issues.push("No valid consent mechanism — CPPA requires express, informed, opt-in consent for sensitive data");
      if (collectsData && hasBreachPlan === "no") issues.push("No breach response plan — 72-hour notification to Privacy Commissioner mandatory under CPPA s.10");
      if (usesAI === "yes") issues.push("AI decision-making in use — CPPA s.22.1 requires automated decision transparency and opt-out rights");
      if (crossBorder === "yes") issues.push("Cross-border data transfers detected — CPPA s.17 requires equivalent protection agreements");

      if (issues.length >= 3) result = "fail";
      else if (issues.length >= 1) result = "flag";

      const entry = {
        id: uid(), module: "CPPA", ruleId: "CPPA-C01",
        input: `${employees} employees · data: ${collects} · officer: ${hasOfficer}`,
        result: result.toUpperCase(), statute: "Bill C-27 — CPPA s.10, s.17, s.22, s.57, s.62",
        timestamp: ts(),
      };
      logCheck(entry);

      const title = result === "pass"
        ? "PASS — CPPA readiness confirmed for current data practices"
        : result === "fail"
        ? `FAIL — ${issues.length} critical CPPA gaps detected — risk of fines up to $25M or 5% of global revenue`
        : `FLAG — ${issues.length} CPPA gap(s) detected — remediation required before Bill C-27 receives Royal Assent`;

      const statute = "Bill C-27 (Consumer Privacy Protection Act) — Replaces PIPEDA. Expected to receive Royal Assent. Penalties up to CAD $25,000,000 or 5% of global annual gross revenue, whichever is greater.";

      const action = issues.length === 0
        ? "Your organization appears ready for CPPA. Maintain your Privacy Officer designation, PIA program, consent records, and breach response plan. Review annually as the law comes into force."
        : `CPPA gaps identified:\n${issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}\n\nPriority: Appoint a Privacy Officer and document your PIA process before Royal Assent.`;

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Employees", val: emp },
        { label: "Gaps found", val: `${issues.length}` },
        { label: "Max fine", val: "$25M CAD or 5% revenue" },
      ]});
      setLoading(false);
    }, 700);
  };

  const sel = "w-full px-3 py-2 rounded-lg border text-[12px] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40";
  const selStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };
  const lbl = "block text-[11px] font-medium mb-1.5 uppercase tracking-widest";
  const lblStyle = { color: "var(--text3)", fontFamily: "var(--mono)" };

  return (
    <div className="page-content">
      <div style={{ background: "rgba(127,119,221,0.10)", border: "1px solid rgba(127,119,221,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "#7F77DD", background: "rgba(127,119,221,0.2)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>BILL C-27 · SENATE REVIEW · IMMINENT ROYAL ASSENT</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#7F77DD", marginBottom: 4 }}>Consumer Privacy Protection Act — Replaces PIPEDA entirely</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Bill C-27 introduces the CPPA, the most significant overhaul of Canadian privacy law in 25 years. Once in force, it mandates Privacy Officers, Privacy Impact Assessments, AI transparency, enhanced consent standards, and breach notification within 72 hours. Fines up to <strong>$25M CAD or 5% of global annual revenue</strong>.
        </div>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>CPPA Readiness Assessment</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={lblStyle} className={lbl}>Employees</label>
            <input type="number" min="1" value={employees} onChange={e => setEmployees(e.target.value)}
              style={{ ...selStyle, padding: "8px 12px", borderRadius: 8, fontSize: 12, width: "100%", outline: "none" }} />
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Collects personal information?</label>
            <select value={collects} onChange={e => setCollects(e.target.value)} style={selStyle} className={sel}>
              <option value="yes">Yes</option><option value="no">No</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Designated Privacy Officer?</label>
            <select value={hasOfficer} onChange={e => setHasOfficer(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Privacy Impact Assessment process?</label>
            <select value={hasPIA} onChange={e => setHasPIA(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Valid consent mechanism?</label>
            <select value={hasConsent} onChange={e => setHasConsent(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Breach response plan (72hr)?</label>
            <select value={hasBreachPlan} onChange={e => setHasBreachPlan(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Uses AI / automated decisions?</label>
            <select value={usesAI} onChange={e => setUsesAI(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Transfers data cross-border?</label>
            <select value={crossBorder} onChange={e => setCrossBorder(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
        </div>
        <button onClick={run} disabled={loading}
          className="mt-5 w-full py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#c8f135", color: "#09090a" }}>
          {loading ? "Running CPPA assessment…" : "Run CPPA Readiness Check →"}
        </button>
      </div>

      {res && <ResultCard result={res.result} title={res.title} statute={res.statute} action={res.action} meta={res.meta} />}

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>CPPA vs. PIPEDA — Key Differences</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Privacy Officer", "Optional under PIPEDA", "Mandatory under CPPA s.62"],
            ["Fines", "Up to $100,000", "Up to $25M or 5% global revenue"],
            ["Consent", "Implied consent allowed", "Express opt-in for sensitive data"],
            ["AI Decisions", "Not addressed", "Transparency + opt-out required"],
            ["Breach notice", "No timeline", "72-hour notification required"],
            ["Data Mobility", "Not required", "Consumer data portability right"],
          ].map(([topic, old, newRule], i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{topic}</div>
              <div className="flex gap-2">
                <div style={{ flex: 1, fontSize: 10, color: "var(--red)", lineHeight: 1.5 }}>Before: {old}</div>
                <div style={{ flex: 1, fontSize: 10, color: "var(--green)", lineHeight: 1.5 }}>After: {newRule}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
