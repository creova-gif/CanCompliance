import { useState } from "react";
import { useAudit } from "../context/AuditContext";
import { BarChart3, CheckCircle2, AlertTriangle, XCircle, TrendingUp, FileText, Calendar, Download } from "lucide-react";

const MODULES = ["CASL","PIPEDA","FINTRAC","Employment","Safety","Payroll","GST/HST","Privacy","Customs","ESG","S-211","CCPSA","CPPA","AODA","Beneficial Ownership","Pay Equity"];
const GLOBAL = ["SOC 2","ISO 27001","GDPR","HIPAA","NIST AI RMF","EU AI Act"];

export default function BoardReport() {
  const { auditLog, computeScore } = useAudit();
  const score = computeScore();
  const [period, setPeriod] = useState("Q3 2025");
  const [orgName, setOrgName] = useState("Acme Corp Inc.");
  const [auditor, setAuditor] = useState("Chief Compliance Officer");
  const [generated, setGenerated] = useState(false);

  const passes = auditLog.filter(e => e.result === "PASS").length;
  const fails = auditLog.filter(e => e.result === "FAIL").length;
  const flags = auditLog.filter(e => e.result === "FLAG").length;
  const checkedModules = [...new Set(auditLog.map(e => e.module))];
  const unchecked = MODULES.filter(m => !checkedModules.includes(m));

  const riskRating = score >= 80 ? "LOW" : score >= 60 ? "MEDIUM" : score >= 40 ? "HIGH" : "CRITICAL";
  const riskColor = score >= 80 ? "var(--green)" : score >= 60 ? "var(--amber)" : "var(--red)";

  const topFindings = auditLog.filter(e => e.result === "FAIL" || e.result === "FLAG").slice(0, 5);

  const today = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="page-content">
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Report Configuration</div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Organization</label>
            <input value={orgName} onChange={e => setOrgName(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 12, outline: "none", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text1)" }} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Reporting Period</label>
            <input value={period} onChange={e => setPeriod(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 12, outline: "none", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text1)" }} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Prepared By</label>
            <input value={auditor} onChange={e => setAuditor(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 12, outline: "none", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text1)" }} />
          </div>
        </div>
        <button onClick={() => setGenerated(true)}
          style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: "#c8f135", color: "#09090a", display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={14} /> Generate Board Report
        </button>
      </div>

      {generated && (
        <div style={{ background: "var(--bg2)", border: "1px solid rgba(200,241,53,0.25)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.08) 0%, transparent 100%)", padding: "28px 32px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 10 }}>CONFIDENTIAL — BOARD OF DIRECTORS</div>
            <div style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 26, color: "var(--text1)", marginBottom: 6 }}>Compliance Status Report</div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>{orgName} · {period} · Prepared by {auditor} · {today}</div>
          </div>

          <div style={{ padding: "24px 32px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Executive Summary</div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: "Overall Score", val: `${score}/100`, color: riskColor, sub: `${riskRating} RISK` },
                { label: "Modules Checked", val: `${checkedModules.length}/${MODULES.length}`, color: "#c8f135", sub: "of 16 total" },
                { label: "Checks Passed", val: passes, color: "var(--green)", sub: "PASS" },
                { label: "Violations Found", val: fails + flags, color: fails > 0 ? "var(--red)" : "var(--amber)", sub: `${fails} fail · ${flags} flag` },
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--bg3)", borderRadius: 10, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: "var(--mono)", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: s.color, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: score >= 80 ? "rgba(18,183,106,0.07)" : score >= 60 ? "rgba(245,166,35,0.07)" : "rgba(240,68,56,0.07)", border: `1px solid ${riskColor}30`, borderRadius: 10, padding: "14px 18px", marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: riskColor, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Board Risk Opinion — {period}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                {orgName}'s compliance posture for {period} is rated <strong style={{ color: riskColor }}>{riskRating}</strong> with a composite score of <strong>{score}/100</strong>. 
                {checkedModules.length < 8 ? ` ${16 - checkedModules.length} modules have not been assessed this period — assessment coverage should be expanded before next board review.` : ` ${checkedModules.length} of 16 modules have been assessed with ${passes} checks passing.`}
                {fails > 0 ? ` ${fails} active violation(s) require remediation before next regulatory review cycle.` : " No critical violations are currently outstanding."}
              </div>
            </div>

            {topFindings.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>Active Findings Requiring Board Attention</div>
                <div className="space-y-2">
                  {topFindings.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, padding: "12px 16px", background: f.result === "FAIL" ? "rgba(240,68,56,0.08)" : "rgba(245,166,35,0.08)", border: `1px solid ${f.result === "FAIL" ? "rgba(240,68,56,0.3)" : "rgba(245,166,35,0.3)"}`, borderRadius: 8 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: f.result === "FAIL" ? "var(--red)" : "var(--amber)", minWidth: 36 }}>{f.result}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 3 }}>{f.module} · {f.statute?.split(" ")[0]}</div>
                        <div style={{ fontSize: 11, color: "var(--text2)" }}>{f.input}</div>
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>{f.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unchecked.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>Modules Not Yet Assessed This Period</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {unchecked.map(m => (
                    <span key={m} style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", background: "var(--bg3)", padding: "3px 10px", borderRadius: 6 }}>{m}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>Management Attestation</div>
              <div style={{ background: "var(--bg3)", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)", marginBottom: 2 }}>{auditor}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{orgName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>Report date</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text1)" }}>{today}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button onClick={() => window.print()} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none", background: "#c8f135", color: "#09090a", display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={13} /> Export / Print Report
              </button>
              <button onClick={() => setGenerated(false)} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "transparent", color: "var(--text2)" }}>
                Edit Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {!generated && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 8 }}>Configure your report above and click Generate</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>The report will pull live data from your audit trail and compliance checks.</div>
          {auditLog.length === 0 && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", borderRadius: 8, fontSize: 11, color: "var(--amber)" }}>
              No compliance checks recorded yet. Run some module checks first to populate your board report with real data.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
