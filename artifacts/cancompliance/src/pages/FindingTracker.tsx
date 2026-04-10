import { useState } from "react";
import { ClipboardCheck, Plus, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

type Status = "open" | "in_progress" | "remediated" | "verified" | "accepted";
type Severity = "critical" | "high" | "medium" | "low";
type Finding = {
  id: string; title: string; module: string; severity: Severity; status: Status;
  description: string; recommendation: string; owner: string; dueDate: string;
  createdAt: string; closedAt?: string; notes: string;
};

const INITIAL: Finding[] = [
  { id: "f001", title: "No FINTRAC training for new tellers", module: "FINTRAC", severity: "high", status: "in_progress", description: "Three new employees onboarded in Q3 have not completed mandatory FINTRAC AML training.", recommendation: "Assign FINTRAC compliance training via LMS. Obtain signed attestation within 30 days. File training records.", owner: "HR Manager", dueDate: "2025-10-15", createdAt: "2025-09-01", notes: "Training module purchased, enrollment in progress" },
  { id: "f002", title: "PIPEDA privacy notice outdated", module: "PIPEDA", severity: "medium", status: "open", description: "Website privacy notice references old data retention periods. Does not reflect CPPA readiness.", recommendation: "Update privacy notice to reflect current data practices and CPPA preparation language. Have legal review.", owner: "Legal Counsel", dueDate: "2025-11-01", createdAt: "2025-09-10", notes: "" },
  { id: "f003", title: "Missing CASL unsubscribe mechanism on transactional emails", module: "CASL", severity: "critical", status: "open", description: "Transactional email templates for order confirmations do not contain a functional unsubscribe mechanism.", recommendation: "Add CRTC-compliant unsubscribe link to all commercial electronic messages. Implement 10-day processing SLA.", owner: "Dev Lead", dueDate: "2025-10-01", createdAt: "2025-08-28", notes: "" },
  { id: "f004", title: "Quebec Law 25 DPI not completed for new CRM integration", module: "Privacy", severity: "high", status: "remediated", description: "A Privacy Impact Assessment was not completed before deploying the new CRM integration with Salesforce.", recommendation: "Retroactively complete PIA using CAI template. Document findings. Implement data minimization where flagged.", owner: "Privacy Officer", dueDate: "2025-09-30", createdAt: "2025-08-01", closedAt: "2025-09-28", notes: "PIA completed and filed. Remediation accepted by Privacy Officer." },
  { id: "f005", title: "ESA termination notice calculation error", module: "Employment", severity: "medium", status: "verified", description: "Payroll system was computing 4 weeks notice for 6+ year employees where ESA s.57 requires 6 weeks.", recommendation: "Update payroll system formula. Identify all terminated employees in last 12 months and assess exposure.", owner: "Payroll Manager", dueDate: "2025-08-15", createdAt: "2025-07-20", closedAt: "2025-08-14", notes: "System fixed. 2 affected employees received makeup pay. No MLITSD complaint filed." },
];

const SEV_COLOR: Record<Severity, string> = { critical: "#f04438", high: "var(--red)", medium: "var(--amber)", low: "var(--green)" };
const SEV_BG: Record<Severity, string> = { critical: "rgba(240,68,56,0.15)", high: "rgba(240,68,56,0.10)", medium: "rgba(245,166,35,0.12)", low: "rgba(18,183,106,0.10)" };
const STATUS_COLOR: Record<Status, string> = { open: "var(--red)", in_progress: "var(--amber)", remediated: "#7F77DD", verified: "var(--green)", accepted: "var(--text3)" };
const STATUS_LABEL: Record<Status, string> = { open: "Open", in_progress: "In Progress", remediated: "Remediated", verified: "Verified", accepted: "Risk Accepted" };

export default function FindingTracker() {
  const [findings, setFindings] = useState<Finding[]>(INITIAL);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>("f001");
  const [showAdd, setShowAdd] = useState(false);
  const [newFinding, setNewFinding] = useState({ title: "", module: "CASL", severity: "medium" as Severity, description: "", recommendation: "", owner: "", dueDate: "" });

  const filtered = findings.filter(f => filter === "all" || f.status === filter);
  const counts = { all: findings.length, open: findings.filter(f=>f.status==="open").length, in_progress: findings.filter(f=>f.status==="in_progress").length, remediated: findings.filter(f=>f.status==="remediated").length, verified: findings.filter(f=>f.status==="verified").length, accepted: findings.filter(f=>f.status==="accepted").length };

  const advance = (id: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id !== id) return f;
      const next: Record<Status, Status> = { open: "in_progress", in_progress: "remediated", remediated: "verified", verified: "verified", accepted: "accepted" };
      return { ...f, status: next[f.status], closedAt: next[f.status] === "verified" ? new Date().toISOString().split("T")[0] : f.closedAt };
    }));
  };

  const addFinding = () => {
    if (!newFinding.title) return;
    const f: Finding = { ...newFinding, id: `f${Date.now()}`, status: "open", createdAt: new Date().toISOString().split("T")[0], notes: "" };
    setFindings(prev => [f, ...prev]);
    setShowAdd(false);
    setNewFinding({ title: "", module: "CASL", severity: "medium", description: "", recommendation: "", owner: "", dueDate: "" });
  };

  const inp = "w-full px-3 py-2 rounded-lg border text-[11px] focus:outline-none";
  const inpStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };

  return (
    <div className="page-content">
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["all", "open", "in_progress", "remediated", "verified"] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.5px", border: "1px solid", background: filter === s ? (s === "open" ? "rgba(240,68,56,0.15)" : s === "in_progress" ? "rgba(245,166,35,0.15)" : s === "verified" ? "rgba(18,183,106,0.15)" : "var(--bg3)") : "transparent", borderColor: filter === s ? STATUS_COLOR[s as Status] || "var(--border)" : "var(--border)", color: filter === s ? STATUS_COLOR[s as Status] || "var(--text1)" : "var(--text3)" }}>
                {STATUS_LABEL[s as Status] || "All"} ({counts[s]})
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowAdd(s => !s)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(200,241,53,0.4)", background: "rgba(200,241,53,0.08)", color: "#c8f135", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={12} /> New Finding
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "var(--bg2)", border: "1px solid rgba(200,241,53,0.3)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#c8f135", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>New Audit Finding</div>
          <div className="grid grid-cols-2 gap-3">
            <div style={{ gridColumn: "1/-1" }}>
              <input placeholder="Finding title" value={newFinding.title} onChange={e => setNewFinding(f => ({ ...f, title: e.target.value }))} style={inpStyle} className={inp} />
            </div>
            <select value={newFinding.module} onChange={e => setNewFinding(f => ({ ...f, module: e.target.value }))} style={{ ...inpStyle, width: "100%" }} className={inp}>
              {["CASL","PIPEDA","FINTRAC","Employment","Privacy","Safety","ESG","Payroll","Customs","GST/HST","AODA","CPPA"].map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={newFinding.severity} onChange={e => setNewFinding(f => ({ ...f, severity: e.target.value as Severity }))} style={{ ...inpStyle, width: "100%" }} className={inp}>
              <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
            <textarea placeholder="Description" value={newFinding.description} onChange={e => setNewFinding(f => ({ ...f, description: e.target.value }))} style={{ ...inpStyle, gridColumn: "1/-1", resize: "vertical" } as any} className={inp} rows={2} />
            <textarea placeholder="Recommendation" value={newFinding.recommendation} onChange={e => setNewFinding(f => ({ ...f, recommendation: e.target.value }))} style={{ ...inpStyle, gridColumn: "1/-1", resize: "vertical" } as any} className={inp} rows={2} />
            <input placeholder="Owner" value={newFinding.owner} onChange={e => setNewFinding(f => ({ ...f, owner: e.target.value }))} style={inpStyle} className={inp} />
            <input type="date" value={newFinding.dueDate} onChange={e => setNewFinding(f => ({ ...f, dueDate: e.target.value }))} style={inpStyle} className={inp} />
          </div>
          <button onClick={addFinding} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "#c8f135", color: "#09090a", cursor: "pointer", border: "none" }}>Create Finding</button>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map(f => (
          <div key={f.id} style={{ background: "var(--bg2)", border: `1px solid ${expanded === f.id ? SEV_COLOR[f.severity] + "40" : "var(--border)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
            <div onClick={() => setExpanded(e => e === f.id ? null : f.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer" }}>
              {expanded === f.id ? <ChevronDown size={14} color="var(--text3)" /> : <ChevronRight size={14} color="var(--text3)" />}
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: SEV_COLOR[f.severity], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)" }}>{f.title}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>{f.module} · {f.id} · {f.owner}</div>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: SEV_COLOR[f.severity], background: SEV_BG[f.severity], padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", marginRight: 8 }}>{f.severity}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: STATUS_COLOR[f.status], textTransform: "uppercase" }}>{STATUS_LABEL[f.status]}</div>
            </div>
            {expanded === f.id && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Description</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{f.description}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Recommendation</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{f.recommendation}</div>
                  </div>
                  {f.notes && (
                    <div style={{ gridColumn: "1/-1" }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Notes</div>
                      <div style={{ fontSize: 11, color: "var(--text2)" }}>{f.notes}</div>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>Due: {f.dueDate || "—"}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>Created: {f.createdAt}</div>
                    {f.closedAt && <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)" }}>Closed: {f.closedAt}</div>}
                  </div>
                  {f.status !== "verified" && f.status !== "accepted" && (
                    <button onClick={() => advance(f.id)} style={{ marginLeft: "auto", padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(200,241,53,0.4)", background: "rgba(200,241,53,0.08)", color: "#c8f135" }}>
                      Advance → {STATUS_LABEL[{ open: "in_progress", in_progress: "remediated", remediated: "verified" } [f.status] as Status]}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
