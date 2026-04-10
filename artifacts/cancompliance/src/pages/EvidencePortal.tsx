import { useState } from "react";
import { Upload, FileText, CheckCircle2, Clock, Trash2, Plus, Paperclip } from "lucide-react";

type EvidenceStatus = "collected" | "pending" | "requested" | "rejected";
type Evidence = {
  id: string; title: string; control: string; framework: string; type: string;
  status: EvidenceStatus; owner: string; dueDate: string; notes: string; uploadedAt?: string; fileName?: string;
};

const INITIAL: Evidence[] = [
  { id: "e001", title: "CASL consent records export", control: "CASL-01", framework: "CASL", type: "Data Export", status: "collected", owner: "Marketing", dueDate: "2025-10-01", notes: "Exported from Mailchimp — 3,241 records with timestamps", uploadedAt: "2025-09-12", fileName: "casl_consent_export_Q3.csv" },
  { id: "e002", title: "FINTRAC AML training certificates", control: "FINTRAC-03", framework: "FINTRAC", type: "Certificate", status: "pending", owner: "HR Manager", dueDate: "2025-10-15", notes: "Awaiting completion by 3 staff members", uploadedAt: undefined, fileName: undefined },
  { id: "e003", title: "Privacy policy version control log", control: "PIPEDA-02", framework: "PIPEDA", type: "Documentation", status: "requested", owner: "Legal", dueDate: "2025-09-30", notes: "Requested from Legal on Sept 20. Reminder sent.", uploadedAt: undefined, fileName: undefined },
  { id: "e004", title: "WSIB registration certificate", control: "SAFETY-01", framework: "OHS", type: "Certificate", status: "collected", owner: "Operations", dueDate: "2025-08-01", notes: "Annual certificate", uploadedAt: "2025-08-05", fileName: "wsib_certificate_2025.pdf" },
  { id: "e005", title: "GST/HST remittance receipts Q2", control: "GST-01", framework: "GST/HST", type: "Financial Record", status: "collected", owner: "Finance", dueDate: "2025-07-30", notes: "All 3 months confirmed paid", uploadedAt: "2025-07-31", fileName: "gst_remittances_Q2_2025.pdf" },
  { id: "e006", title: "Employment contract templates review", control: "ESA-01", framework: "Employment", type: "Policy", status: "rejected", owner: "Legal", dueDate: "2025-09-01", notes: "Returned — missing ESA notice period clause for Ontario. Revision required.", uploadedAt: "2025-08-15", fileName: "employment_contract_template_v2.docx" },
];

const STATUS_COLOR: Record<EvidenceStatus, string> = { collected: "var(--green)", pending: "var(--amber)", requested: "#7F77DD", rejected: "var(--red)" };
const STATUS_BG: Record<EvidenceStatus, string> = { collected: "rgba(18,183,106,0.12)", pending: "rgba(245,166,35,0.12)", requested: "rgba(127,119,221,0.12)", rejected: "rgba(240,68,56,0.12)" };
const STATUS_LABEL: Record<EvidenceStatus, string> = { collected: "Collected", pending: "Pending", requested: "Requested", rejected: "Rejected" };

export default function EvidencePortal() {
  const [evidence, setEvidence] = useState<Evidence[]>(INITIAL);
  const [filter, setFilter] = useState<EvidenceStatus | "all">("all");
  const [selected, setSelected] = useState<string | null>("e001");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", control: "", framework: "CASL", type: "Documentation", owner: "", dueDate: "", notes: "" });
  const [uploading, setUploading] = useState<string | null>(null);

  const filtered = evidence.filter(e => filter === "all" || e.status === filter);
  const sel = evidence.find(e => e.id === selected);
  const counts = { all: evidence.length, collected: evidence.filter(e=>e.status==="collected").length, pending: evidence.filter(e=>e.status==="pending").length, requested: evidence.filter(e=>e.status==="requested").length, rejected: evidence.filter(e=>e.status==="rejected").length };

  const simulateUpload = (id: string) => {
    setUploading(id);
    setTimeout(() => {
      setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: "collected", uploadedAt: new Date().toISOString().split("T")[0], fileName: "evidence_upload.pdf" } : e));
      setUploading(null);
    }, 1500);
  };

  const addEvidence = () => {
    if (!form.title) return;
    const e: Evidence = { ...form, id: `e${Date.now()}`, status: "requested" };
    setEvidence(prev => [...prev, e]);
    setShowAdd(false);
    setForm({ title: "", control: "", framework: "CASL", type: "Documentation", owner: "", dueDate: "", notes: "" });
  };

  const inp = "w-full px-3 py-2 rounded-lg border text-[11px] focus:outline-none";
  const inpStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };
  const completionPct = Math.round((counts.collected / evidence.length) * 100);

  return (
    <div className="page-content">
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total evidence items", val: counts.all, color: "#c8f135" },
          { label: "Collected", val: counts.collected, color: "var(--green)" },
          { label: "Pending / Requested", val: counts.pending + counts.requested, color: "var(--amber)" },
          { label: "Completion", val: `${completionPct}%`, color: completionPct >= 80 ? "var(--green)" : completionPct >= 50 ? "var(--amber)" : "var(--red)" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "var(--mono)" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {(["all", "collected", "pending", "requested", "rejected"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "var(--mono)", textTransform: "uppercase", border: "1px solid", background: filter === s ? (STATUS_BG[s as EvidenceStatus] || "var(--bg3)") : "transparent", borderColor: filter === s ? (STATUS_COLOR[s as EvidenceStatus] || "var(--border)") : "var(--border)", color: filter === s ? (STATUS_COLOR[s as EvidenceStatus] || "var(--text1)") : "var(--text3)" }}>
            {s === "all" ? `All (${counts.all})` : `${STATUS_LABEL[s as EvidenceStatus]} (${counts[s]})`}
          </button>
        ))}
        <button onClick={() => setShowAdd(s => !s)} style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(200,241,53,0.4)", background: "rgba(200,241,53,0.08)", color: "#c8f135", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={12} /> Request Evidence
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "var(--bg2)", border: "1px solid rgba(200,241,53,0.3)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#c8f135", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Request New Evidence</div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Evidence title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ ...inpStyle, gridColumn: "1/-1" } as any} className={inp} />
            <input placeholder="Control ID (e.g. CASL-01)" value={form.control} onChange={e => setForm(f => ({ ...f, control: e.target.value }))} style={inpStyle} className={inp} />
            <select value={form.framework} onChange={e => setForm(f => ({ ...f, framework: e.target.value }))} style={{ ...inpStyle, width: "100%" }} className={inp}>
              {["CASL","PIPEDA","FINTRAC","Employment","Privacy","Safety","GST/HST","AODA","CPPA","SOC 2","ISO 27001"].map(m => <option key={m}>{m}</option>)}
            </select>
            <input placeholder="Owner (person responsible)" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} style={inpStyle} className={inp} />
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={inpStyle} className={inp} />
            <textarea placeholder="Notes / instructions" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inpStyle, resize: "vertical", gridColumn: "1/-1" } as any} className={inp} rows={2} />
          </div>
          <button onClick={addEvidence} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "#c8f135", color: "#09090a", cursor: "pointer", border: "none" }}>Request Evidence</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div className="space-y-2">
          {filtered.map(e => (
            <div key={e.id} onClick={() => setSelected(e.id)}
              style={{ background: "var(--bg2)", border: `1px solid ${selected === e.id ? "rgba(200,241,53,0.35)" : "var(--border)"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "border-color 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={14} color={STATUS_COLOR[e.status]} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)", marginBottom: 2 }}>{e.title}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>{e.framework} · {e.control} · {e.owner} · due {e.dueDate}</div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: STATUS_COLOR[e.status], background: STATUS_BG[e.status], padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{STATUS_LABEL[e.status]}</div>
              </div>
            </div>
          ))}
        </div>

        {sel && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, position: "sticky", top: 60, alignSelf: "flex-start" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Evidence Detail</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 4 }}>{sel.title}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: STATUS_COLOR[sel.status], background: STATUS_BG[sel.status], display: "inline-block", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", marginBottom: 14 }}>{STATUS_LABEL[sel.status]}</div>

            {[
              ["Framework", sel.framework], ["Control", sel.control], ["Type", sel.type],
              ["Owner", sel.owner], ["Due", sel.dueDate],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>{k}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{v}</div>
              </div>
            ))}

            {sel.notes && (
              <div style={{ marginTop: 12, background: "var(--bg3)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
                <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{sel.notes}</div>
              </div>
            )}

            {sel.fileName && (
              <div style={{ marginTop: 12, background: "rgba(18,183,106,0.08)", border: "1px solid rgba(18,183,106,0.25)", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <Paperclip size={12} color="var(--green)" />
                <div style={{ fontSize: 11, color: "var(--green)", fontFamily: "var(--mono)" }}>{sel.fileName}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", marginLeft: "auto" }}>{sel.uploadedAt}</div>
              </div>
            )}

            {sel.status !== "collected" && (
              <button onClick={() => simulateUpload(sel.id)} disabled={uploading === sel.id}
                style={{ marginTop: 14, width: "100%", padding: "8px 0", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none", background: uploading === sel.id ? "var(--bg3)" : "#c8f135", color: uploading === sel.id ? "var(--text3)" : "#09090a", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Upload size={13} />
                {uploading === sel.id ? "Uploading…" : "Upload Evidence File"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
