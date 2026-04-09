import { FileText, Trash2, Download, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAudit } from "../context/AuditContext";

const RESULT_COLORS: Record<string, string> = {
  pass: "var(--green)",
  fail: "var(--amber)",
  flag: "var(--red)",
  block: "var(--red)",
};

// System 3 — Smart Audit Trail v2
// Analyzes patterns: repeat failures, high-risk modules with no records
const HIGH_RISK_MODULES = ["FINTRAC", "CASL", "PIPEDA", "Privacy", "Employment"];

function analyzePatterns(auditLog: any[]) {
  const insights: { type: "warning" | "info" | "success"; text: string }[] = [];

  // Pattern 1: Repeat failures in same module
  const moduleFails: Record<string, number> = {};
  auditLog.forEach(e => {
    if (e.result === "FAIL" || e.result === "BLOCK") {
      moduleFails[e.module] = (moduleFails[e.module] || 0) + 1;
    }
  });
  Object.entries(moduleFails).forEach(([mod, count]) => {
    if (count >= 2) {
      insights.push({
        type: "warning",
        text: `Pattern: ${count} repeat ${mod} failures — this is a systematic issue, not a one-off. Indicates a structural compliance gap that a single fix won't resolve.`,
      });
    }
  });

  // Pattern 2: High-risk modules with no checks
  const checkedModules = new Set(auditLog.map(e => e.module));
  const uncheckedHighRisk = HIGH_RISK_MODULES.filter(m => !checkedModules.has(m));
  if (uncheckedHighRisk.length > 0) {
    insights.push({
      type: "warning",
      text: `Coverage gap: ${uncheckedHighRisk.join(", ")} — these are high-enforcement modules with no checks on record. CRTC and FINTRAC are actively enforcing in 2026.`,
    });
  }

  // Pattern 3: All checks passing
  const allPass = auditLog.length > 0 && auditLog.every(e => e.result === "PASS");
  if (allPass && auditLog.length >= 3) {
    insights.push({
      type: "success",
      text: `Strong posture: All ${auditLog.length} checks are passing. Maintain this by running checks monthly and when business activities change.`,
    });
  }

  // Pattern 4: FINTRAC flagged — C-12 risk
  const fintracFails = auditLog.filter(e => e.module === "FINTRAC" && e.result !== "PASS");
  if (fintracFails.length > 0) {
    insights.push({
      type: "warning",
      text: `Bill C-12 risk amplifier: ${fintracFails.length} FINTRAC failure(s) detected. Under Bill C-12 (in force Mar 26, 2026), FINTRAC can now challenge whether your program is "reasonably designed" — not just whether rules were met. Penalty: up to $20M or 3% global revenue.`,
    });
  }

  // Pattern 5: CASL + PIPEDA failures together
  const caslFails = auditLog.filter(e => e.module === "CASL" && e.result !== "PASS");
  const pipedaFails = auditLog.filter(e => (e.module === "PIPEDA" || e.module === "Privacy") && e.result !== "PASS");
  if (caslFails.length > 0 && pipedaFails.length > 0) {
    insights.push({
      type: "warning",
      text: `Co-occurring data law failures: CASL + PIPEDA violations together signal a systemic gap in your consent and data handling practices. Quebec CAI is conducting joint audits targeting exactly this pattern in 2026.`,
    });
  }

  // Pattern 6: Good coverage with some gaps
  if (auditLog.length >= 5 && insights.filter(i => i.type === "warning").length === 0) {
    insights.push({
      type: "info",
      text: `Good compliance coverage: ${checkedModules.size} module(s) checked. Recommendation: run all 16 modules quarterly to maintain full coverage and generate an audit-ready compliance certificate.`,
    });
  }

  return insights;
}

export default function AuditTrail() {
  const { auditLog, clearAudit, metrics } = useAudit();

  const exportCSV = () => {
    const header = "ID,Module,Rule ID,Input,Result,Statute,Timestamp\n";
    const rows = auditLog.map(e =>
      [e.id, e.module, e.ruleId, `"${e.input}"`, e.result, `"${e.statute}"`, e.timestamp].join(",")
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "cancompliance-audit.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const patterns = analyzePatterns(auditLog);

  return (
    <AppLayout title="Smart Audit Trail v2" subtitle="System 3 — Pattern analysis · Immutable log · CRTC-ready export">
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            {auditLog.length} check{auditLog.length !== 1 ? "s" : ""} logged. Includes check ID, statute citation, inputs, and timestamp for regulatory audit readiness.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {auditLog.length > 0 && (
              <>
                <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, color: "var(--text2)", cursor: "pointer", fontFamily: "var(--mono)" }}>
                  <Download size={13} /> Export CSV
                </button>
                <button onClick={clearAudit} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "var(--bg2)", border: "1px solid var(--red)33", borderRadius: 6, fontSize: 11, color: "var(--red)", cursor: "pointer", fontFamily: "var(--mono)" }} data-testid="clear-audit">
                  <Trash2 size={13} /> Clear Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total", val: metrics.total, color: "var(--text1)" },
            { label: "Pass", val: metrics.pass, color: "var(--green)" },
            { label: "Fail", val: metrics.fail, color: "var(--amber)" },
            { label: "Flag", val: metrics.flag, color: "var(--red)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 4 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 24, fontFamily: "var(--mono)", color: s.color, fontWeight: 700 }}>{s.val}</div>
            </div>
          ))}
        </div>

        {auditLog.length === 0 ? (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 40, textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 12 }}>
            No checks logged yet — run compliance checks in any module to populate the audit trail
          </div>
        ) : (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "140px 90px 80px 1fr 60px", gap: 12, fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)" }}>
              <div>CHECK ID</div>
              <div>MODULE</div>
              <div>RESULT</div>
              <div>INPUT / STATUTE</div>
              <div>TIME</div>
            </div>
            {auditLog.map(e => {
              const rLow = e.result.toLowerCase();
              const color = RESULT_COLORS[rLow] || "var(--text2)";
              return (
                <div key={e.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "140px 90px 80px 1fr 60px", gap: 12, alignItems: "start" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", wordBreak: "break-all" }}>{e.id}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 500 }}>{e.module}</div>
                  <div>
                    <span style={{ fontSize: 9, fontFamily: "var(--mono)", color, background: color + "22", padding: "2px 6px", borderRadius: 3 }}>
                      {e.result}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>{e.input}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2, fontStyle: "italic" }}>{e.statute}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>{e.timestamp}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* System 3 — Smart Audit Trail v2 Pattern Analysis */}
        {auditLog.length > 0 && patterns.length > 0 && (
          <div style={{ marginTop: 20, background: "var(--bg2)", border: "1px solid rgba(200,241,53,0.15)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={13} style={{ color: "#c8f135" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#c8f135" }}>SYSTEM 3 — SMART AUDIT TRAIL v2 · AI pattern analysis</span>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {patterns.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", borderRadius: 8, background: p.type === "warning" ? "rgba(240,68,56,0.07)" : p.type === "success" ? "rgba(18,183,106,0.07)" : "rgba(200,241,53,0.05)", border: `1px solid ${p.type === "warning" ? "rgba(240,68,56,0.2)" : p.type === "success" ? "rgba(18,183,106,0.15)" : "rgba(200,241,53,0.12)"}` }}>
                  {p.type === "warning" ? <AlertTriangle size={13} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} /> : p.type === "success" ? <CheckCircle size={13} style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }} /> : <TrendingUp size={13} style={{ color: "#c8f135", flexShrink: 0, marginTop: 1 }} />}
                  <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
