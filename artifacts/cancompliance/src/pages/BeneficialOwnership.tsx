import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

export default function BeneficialOwnership() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [incType, setIncType] = useState("federal");
  const [hasRegistry, setHasRegistry] = useState("no");
  const [ownersIdentified, setOwnersIdentified] = useState("no");
  const [owners25, setOwners25] = useState("");
  const [updatedAnnually, setUpdatedAnnually] = useState("no");
  const [hasChanges, setHasChanges] = useState("no");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const issues: string[] = [];
      let result: "pass" | "fail" | "flag" = "pass";

      const isFederal = incType === "federal";
      const isBC = incType === "bc";
      const applies = isFederal || isBC;

      if (applies) {
        if (hasRegistry === "no") issues.push("No beneficial ownership register maintained — mandatory under CBCA s.21.1 (federal) or BCBCA (BC) since 2023");
        if (ownersIdentified === "no") issues.push("25%+ owners not fully identified — all individuals controlling 25%+ of shares must be named with full particulars");
        if (owners25 && parseInt(owners25) > 0 && ownersIdentified === "no") issues.push(`${owners25} 25%+ owner(s) not documented in corporate records`);
        if (updatedAnnually === "no" && hasRegistry === "yes") issues.push("Register not updated annually or within 15 days of a change — CBCA s.21.1(4) requires prompt updates");
        if (hasChanges === "yes" && updatedAnnually === "no") issues.push("Ownership changes occurred but register not updated — 15-day update window may have lapsed");
      } else {
        issues.push("Your province may have separate beneficial ownership requirements — check with your provincial registry");
      }

      if (issues.length >= 2) result = "fail";
      else if (issues.length >= 1) result = "flag";

      const entry = {
        id: uid(), module: "Beneficial Ownership", ruleId: "BO-CBCA-C01",
        input: `${incType} · registry: ${hasRegistry} · owners ID'd: ${ownersIdentified}`,
        result: result.toUpperCase(), statute: "CBCA s.21.1 · BCBCA s.120.1 · Corporations Canada",
        timestamp: ts(),
      };
      logCheck(entry);

      const title = result === "pass"
        ? "PASS — Beneficial ownership register appears compliant"
        : result === "fail"
        ? `FAIL — ${issues.length} beneficial ownership violations — risk of $5,000+ director fines`
        : `FLAG — ${issues.length} gap(s) in beneficial ownership documentation`;

      const statute = "Canada Business Corporations Act (CBCA) s.21.1 — Mandatory since June 2019 (federal corps). BC Business Corporations Act s.120.1 — Mandatory since October 2020. All individuals holding 25%+ of shares or votes must be identified in a publicly accessible registry. Directors personally liable for non-compliance.";

      const action = issues.length === 0
        ? "Your beneficial ownership register is compliant. Ensure it is updated within 15 days of any ownership change, and verify it is available for inspection by shareholders and Corporations Canada on demand."
        : `Beneficial ownership gaps:\n${issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}\n\nFile your beneficial ownership register immediately at https://corporationscanada.ic.gc.ca — directors can be fined $5,000 personally for non-compliance.`;

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Incorporation", val: incType },
        { label: "Issues", val: `${issues.length}` },
        { label: "Director fine risk", val: "$5,000/director" },
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
      <div style={{ background: "rgba(240,68,56,0.10)", border: "1px solid rgba(240,68,56,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "var(--red)", background: "rgba(240,68,56,0.2)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>CBCA S.21.1 · MANDATORY SINCE 2023 · WIDELY MISSED</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>Beneficial Ownership Registry — Most federally incorporated SMBs are non-compliant</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Since 2023, all CBCA-incorporated companies must maintain a register of individuals who hold 25%+ of shares or voting rights and file it with Corporations Canada. Most SMBs have never heard of this requirement. <strong>Directors are personally liable</strong> for non-compliance.
        </div>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Beneficial Ownership Checker</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={lblStyle} className={lbl}>Incorporation type</label>
            <select value={incType} onChange={e => setIncType(e.target.value)} style={selStyle} className={sel}>
              <option value="federal">Federal (CBCA — Corporations Canada)</option>
              <option value="bc">BC provincial (BCBCA)</option>
              <option value="ontario">Ontario provincial (OBCA)</option>
              <option value="other">Other provincial</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>How many 25%+ shareholders?</label>
            <input type="number" min="0" value={owners25} onChange={e => setOwners25(e.target.value)} placeholder="e.g. 2"
              style={{ ...selStyle, padding: "8px 12px", borderRadius: 8, fontSize: 12, width: "100%", outline: "none" }} />
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Beneficial ownership register maintained?</label>
            <select value={hasRegistry} onChange={e => setHasRegistry(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No — not aware of requirement</option>
              <option value="partial">Partial — internally only</option>
              <option value="yes">Yes — filed with Corporations Canada</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>All 25%+ owners fully identified?</label>
            <select value={ownersIdentified} onChange={e => setOwnersIdentified(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — full particulars documented</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Register updated annually?</label>
            <select value={updatedAnnually} onChange={e => setUpdatedAnnually(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — last updated within 12 months</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Any ownership changes in last year?</label>
            <select value={hasChanges} onChange={e => setHasChanges(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — new investors / share transfers</option>
            </select>
          </div>
        </div>
        <button onClick={run} disabled={loading}
          className="mt-5 w-full py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#c8f135", color: "#09090a" }}>
          {loading ? "Checking beneficial ownership…" : "Run Beneficial Ownership Check →"}
        </button>
      </div>

      {res && <ResultCard result={res.result} title={res.title} statute={res.statute} action={res.action} meta={res.meta} />}

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>What must be in the register?</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Full legal name", "As on government-issued ID"],
            ["Date of birth", "Month and year sufficient"],
            ["Current address", "Latest known residential address"],
            ["Date they became owner", "Or ceased to hold 25%+"],
            ["Nature of control", "Shares, votes, or significant influence"],
            ["Public availability", "Available to Corporations Canada on request"],
          ].map(([field, detail], i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{field}</div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>{detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
