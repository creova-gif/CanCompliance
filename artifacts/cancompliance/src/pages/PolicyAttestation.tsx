import { useState } from "react";
import { CheckSquare, Clock, Plus, Trash2, Send, FileCheck } from "lucide-react";

type Policy = { id: string; name: string; version: string; dueDate: string; employees: string; category: string };
type Attestation = { policyId: string; employee: string; signedAt: string; status: "signed" | "pending" | "overdue" };

const SAMPLE_POLICIES: Policy[] = [
  { id: "p1", name: "Privacy & Data Protection Policy", version: "2.1", dueDate: "2025-12-31", employees: "All Staff", category: "Privacy" },
  { id: "p2", name: "Workplace Harassment Prevention Policy", version: "1.3", dueDate: "2025-11-30", employees: "All Staff", category: "HR" },
  { id: "p3", name: "CASL Compliance Policy", version: "1.0", dueDate: "2025-10-31", employees: "Marketing, Sales", category: "Legal" },
];

const SAMPLE_ATTESTATIONS: Attestation[] = [
  { policyId: "p1", employee: "Alice Moreau", signedAt: "2025-08-12", status: "signed" },
  { policyId: "p1", employee: "Ben Okafor", signedAt: "2025-08-13", status: "signed" },
  { policyId: "p1", employee: "Carla Singh", signedAt: "", status: "pending" },
  { policyId: "p2", employee: "Alice Moreau", signedAt: "2025-07-28", status: "signed" },
  { policyId: "p2", employee: "Ben Okafor", signedAt: "", status: "overdue" },
  { policyId: "p2", employee: "Carla Singh", signedAt: "", status: "overdue" },
  { policyId: "p3", employee: "Dana Tremblay", signedAt: "2025-09-01", status: "signed" },
];

const STATUS_COLOR: Record<string, string> = {
  signed: "var(--green)",
  pending: "var(--amber)",
  overdue: "var(--red)",
};

export default function PolicyAttestation() {
  const [policies] = useState<Policy[]>(SAMPLE_POLICIES);
  const [attestations] = useState<Attestation[]>(SAMPLE_ATTESTATIONS);
  const [selected, setSelected] = useState<string | null>("p1");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newVersion, setNewVersion] = useState("1.0");
  const [newDue, setNewDue] = useState("");
  const [newCat, setNewCat] = useState("Privacy");
  const [sent, setSent] = useState(false);

  const sel = selected ? policies.find(p => p.id === selected) : null;
  const selAtts = attestations.filter(a => a.policyId === selected);
  const signed = selAtts.filter(a => a.status === "signed").length;
  const pct = selAtts.length > 0 ? Math.round((signed / selAtts.length) * 100) : 0;

  const totalPending = attestations.filter(a => a.status === "pending" || a.status === "overdue").length;

  const inp = "w-full px-3 py-2 rounded-lg border text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/40";
  const inpStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };

  return (
    <div className="page-content">
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Policies tracked", val: policies.length, color: "#c8f135" },
          { label: "Pending signatures", val: totalPending, color: "var(--amber)" },
          { label: "Completion rate", val: `${Math.round((attestations.filter(a=>a.status==="signed").length / attestations.length)*100)}%`, color: "var(--green)" },
          { label: "Overdue", val: attestations.filter(a=>a.status==="overdue").length, color: "var(--red)" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "var(--mono)" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
        <div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Policies</div>
              <button onClick={() => setShowAdd(s => !s)} style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.3)", borderRadius: 6, padding: "3px 8px", color: "#c8f135", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <Plus size={10} /> Add
              </button>
            </div>
            {showAdd && (
              <div style={{ marginBottom: 12, background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
                <input placeholder="Policy name" value={newName} onChange={e => setNewName(e.target.value)} style={{ ...inpStyle, marginBottom: 6 }} className={inp} />
                <div style={{ display: "flex", gap: 6 }}>
                  <input placeholder="v1.0" value={newVersion} onChange={e => setNewVersion(e.target.value)} style={{ ...inpStyle, flex: 1 }} className={inp} />
                  <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} style={{ ...inpStyle, flex: 1 }} className={inp} />
                </div>
                <button style={{ marginTop: 8, width: "100%", padding: "6px 0", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#c8f135", color: "#09090a", cursor: "pointer", border: "none" }}>Create Policy</button>
              </div>
            )}
            <div className="space-y-2">
              {policies.map(p => {
                const patts = attestations.filter(a => a.policyId === p.id);
                const psigned = patts.filter(a => a.status === "signed").length;
                const ppct = patts.length > 0 ? Math.round((psigned / patts.length) * 100) : 0;
                return (
                  <div key={p.id} onClick={() => setSelected(p.id)} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${selected === p.id ? "rgba(200,241,53,0.4)" : "var(--border)"}`, background: selected === p.id ? "rgba(200,241,53,0.05)" : "var(--bg3)", transition: "all 0.15s" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${ppct}%`, background: ppct === 100 ? "var(--green)" : ppct > 50 ? "var(--amber)" : "var(--red)", transition: "width 0.3s" }} />
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>{ppct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {sel ? (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text1)", marginBottom: 4 }}>{sel.name}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#c8f135", background: "rgba(200,241,53,0.1)", padding: "2px 8px", borderRadius: 4 }}>v{sel.version}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", background: "var(--bg3)", padding: "2px 8px", borderRadius: 4 }}>{sel.category}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--amber)", background: "rgba(245,166,35,0.1)", padding: "2px 8px", borderRadius: 4 }}>Due: {sel.dueDate}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: pct === 100 ? "var(--green)" : pct > 60 ? "var(--amber)" : "var(--red)", fontFamily: "var(--mono)" }}>{pct}%</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{signed}/{selAtts.length} signed</div>
                </div>
              </div>

              <div style={{ height: 6, background: "var(--border)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--green)" : pct > 60 ? "var(--amber)" : "var(--red)", transition: "width 0.3s" }} />
              </div>

              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Attestation Status</div>
              <div className="space-y-2">
                {selAtts.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[a.status], flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: "var(--text1)", flex: 1 }}>{a.employee}</div>
                    {a.signedAt && <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>{a.signedAt}</div>}
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: STATUS_COLOR[a.status], textTransform: "uppercase" }}>{a.status}</div>
                  </div>
                ))}
              </div>

              {selAtts.some(a => a.status !== "signed") && (
                <button onClick={() => setSent(true)} style={{ marginTop: 14, padding: "10px 20px", borderRadius: 8, background: sent ? "var(--bg3)" : "#c8f135", color: sent ? "var(--text3)" : "#09090a", fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: 8 }}>
                  <Send size={13} />
                  {sent ? "Reminders sent ✓" : "Send reminder to unsigned employees"}
                </button>
              )}
            </div>
          ) : (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 12 }}>
              Select a policy to view attestation status
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 16 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Why policy attestation matters for compliance</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🔒", title: "PIPEDA / CPPA", desc: "Privacy policies must be communicated and acknowledged. Signed attestations are your proof of distribution." },
            { icon: "⚖️", title: "Employment Law", desc: "Harassment and workplace policies require documented staff acknowledgment — protects employer in disputes." },
            { icon: "🏦", title: "FINTRAC / AML", desc: "Compliance programs must show staff training. Signed attestation records satisfy PCMLTFA audit requirements." },
          ].map((c, i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#c8f135", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>{c.title}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
