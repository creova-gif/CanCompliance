import { FileText, Trash2, Download } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAudit } from "../context/AuditContext";

const RESULT_COLORS: Record<string, string> = {
  pass: "var(--green)",
  fail: "var(--amber)",
  flag: "var(--red)",
  block: "var(--red)",
};

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

  return (
    <AppLayout title="Audit Trail" subtitle="Immutable log of all compliance checks — exportable for regulatory review">
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            {auditLog.length} check{auditLog.length !== 1 ? "s" : ""} logged this session. Records include check ID, statute citation, inputs, and timestamp for regulatory audit readiness.
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
      </div>
    </AppLayout>
  );
}
