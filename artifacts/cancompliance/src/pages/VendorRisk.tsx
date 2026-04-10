import { useState } from "react";
import { Network, AlertTriangle, CheckCircle2, Plus, Trash2 } from "lucide-react";

type Vendor = {
  id: string; name: string; category: string; dataAccess: string; criticality: string;
  hasContract: boolean; hasBAA: boolean; hasSoc2: boolean; hasPenTest: boolean; incidentHistory: boolean;
  score: number; risk: "low" | "medium" | "high" | "critical";
};

function calcRisk(v: Omit<Vendor, "score" | "risk">): { score: number; risk: Vendor["risk"] } {
  let score = 100;
  if (!v.hasContract) score -= 30;
  if (!v.hasBAA && v.dataAccess === "pii") score -= 25;
  if (!v.hasSoc2 && v.criticality === "critical") score -= 20;
  if (!v.hasPenTest && (v.criticality === "critical" || v.criticality === "high")) score -= 15;
  if (v.incidentHistory) score -= 20;
  if (v.dataAccess === "financial") score -= 10;
  score = Math.max(0, score);
  const risk: Vendor["risk"] = score >= 80 ? "low" : score >= 60 ? "medium" : score >= 40 ? "high" : "critical";
  return { score, risk };
}

const INITIAL_VENDORS: Vendor[] = [
  { id: "v1", name: "Stripe (Payments)", category: "Payments", dataAccess: "financial", criticality: "critical", hasContract: true, hasBAA: false, hasSoc2: true, hasPenTest: true, incidentHistory: false, ...calcRisk({ name:"", category:"Payments", dataAccess:"financial", criticality:"critical", hasContract:true, hasBAA:false, hasSoc2:true, hasPenTest:true, incidentHistory:false }) },
  { id: "v2", name: "MailChimp (Email)", category: "Marketing", dataAccess: "pii", criticality: "medium", hasContract: true, hasBAA: false, hasSoc2: true, hasPenTest: false, incidentHistory: false, ...calcRisk({ name:"", category:"Marketing", dataAccess:"pii", criticality:"medium", hasContract:true, hasBAA:false, hasSoc2:true, hasPenTest:false, incidentHistory:false }) },
  { id: "v3", name: "Unnamed Contractor", category: "Development", dataAccess: "pii", criticality: "high", hasContract: false, hasBAA: false, hasSoc2: false, hasPenTest: false, incidentHistory: false, ...calcRisk({ name:"", category:"Development", dataAccess:"pii", criticality:"high", hasContract:false, hasBAA:false, hasSoc2:false, hasPenTest:false, incidentHistory:false }) },
];

const RISK_COLOR = { low: "var(--green)", medium: "var(--amber)", high: "var(--red)", critical: "#f04438" };
const RISK_BG = { low: "rgba(18,183,106,0.12)", medium: "rgba(245,166,35,0.12)", high: "rgba(240,68,56,0.12)", critical: "rgba(240,68,56,0.2)" };

export default function VendorRisk() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [selected, setSelected] = useState<string | null>("v1");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Technology", dataAccess: "none", criticality: "medium", hasContract: false, hasBAA: false, hasSoc2: false, hasPenTest: false, incidentHistory: false });

  const addVendor = () => {
    if (!form.name) return;
    const { score, risk } = calcRisk(form);
    const v: Vendor = { ...form, id: `v${Date.now()}`, score, risk };
    setVendors(prev => [...prev, v]);
    setShowAdd(false);
    setForm({ name: "", category: "Technology", dataAccess: "none", criticality: "medium", hasContract: false, hasBAA: false, hasSoc2: false, hasPenTest: false, incidentHistory: false });
  };

  const removeVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    if (selected === id) setSelected(null);
  };

  const sel = vendors.find(v => v.id === selected);
  const avgScore = vendors.length > 0 ? Math.round(vendors.reduce((s, v) => s + v.score, 0) / vendors.length) : 0;
  const critical = vendors.filter(v => v.risk === "critical" || v.risk === "high").length;

  const inp = "w-full px-3 py-1.5 rounded-lg border text-[11px] focus:outline-none";
  const inpStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };

  return (
    <div className="page-content">
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Vendors tracked", val: vendors.length, color: "#c8f135" },
          { label: "Avg risk score", val: `${avgScore}/100`, color: avgScore >= 70 ? "var(--green)" : avgScore >= 50 ? "var(--amber)" : "var(--red)" },
          { label: "High / Critical", val: critical, color: "var(--red)" },
          { label: "Missing contracts", val: vendors.filter(v => !v.hasContract).length, color: "var(--amber)" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "var(--mono)" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Vendor Registry</div>
            <button onClick={() => setShowAdd(s => !s)} style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.3)", borderRadius: 6, padding: "3px 8px", color: "#c8f135", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <Plus size={10} /> Add
            </button>
          </div>
          {showAdd && (
            <div style={{ marginBottom: 12, background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
              <input placeholder="Vendor name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ ...inpStyle, marginBottom: 6 }} className={inp} />
              <select value={form.dataAccess} onChange={e => setForm(f => ({ ...f, dataAccess: e.target.value }))} style={{ ...inpStyle, width: "100%", marginBottom: 6 }} className={inp}>
                <option value="none">No data access</option>
                <option value="internal">Internal data only</option>
                <option value="pii">Accesses PII / personal data</option>
                <option value="financial">Accesses financial data</option>
                <option value="health">Accesses health data</option>
              </select>
              <select value={form.criticality} onChange={e => setForm(f => ({ ...f, criticality: e.target.value }))} style={{ ...inpStyle, width: "100%", marginBottom: 8 }} className={inp}>
                <option value="low">Low criticality</option>
                <option value="medium">Medium criticality</option>
                <option value="high">High criticality</option>
                <option value="critical">Business critical</option>
              </select>
              <div className="space-y-1.5">
                {([["hasContract", "Written contract in place"], ["hasBAA", "BAA / DPA signed"], ["hasSoc2", "SOC 2 report available"], ["hasPenTest", "Annual pen test done"], ["incidentHistory", "Prior security incident"]] as const).map(([key, label]) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--text2)", cursor: "pointer" }}>
                    <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
              <button onClick={addVendor} style={{ marginTop: 10, width: "100%", padding: "6px 0", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#c8f135", color: "#09090a", cursor: "pointer", border: "none" }}>Add Vendor</button>
            </div>
          )}
          <div className="space-y-2">
            {vendors.map(v => (
              <div key={v.id} onClick={() => setSelected(v.id)}
                style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${selected === v.id ? "rgba(200,241,53,0.4)" : "var(--border)"}`, background: selected === v.id ? "rgba(200,241,53,0.04)" : "var(--bg3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text1)" }}>{v.name}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 800, color: RISK_COLOR[v.risk] }}>{v.score}</div>
                    <button onClick={e => { e.stopPropagation(); removeVendor(v.id); }} style={{ color: "var(--text3)", background: "transparent", border: "none", cursor: "pointer", padding: 2 }}><Trash2 size={11} /></button>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: RISK_COLOR[v.risk], textTransform: "uppercase", background: RISK_BG[v.risk], display: "inline-block", padding: "1px 6px", borderRadius: 3 }}>{v.risk} risk</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {sel ? (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text1)", marginBottom: 4 }}>{sel.name}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>{sel.category} · {sel.dataAccess} · {sel.criticality} criticality</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: RISK_COLOR[sel.risk], fontFamily: "var(--mono)" }}>{sel.score}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: RISK_COLOR[sel.risk], textTransform: "uppercase" }}>{sel.risk} risk</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Written contract", val: sel.hasContract, impact: -30 },
                  { label: "BAA / DPA signed", val: sel.hasBAA, impact: -25 },
                  { label: "SOC 2 report", val: sel.hasSoc2, impact: -20 },
                  { label: "Annual pen test", val: sel.hasPenTest, impact: -15 },
                  { label: "Prior incidents", val: !sel.incidentHistory, impact: -20 },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg3)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.val ? "var(--green)" : "var(--red)", flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 11, color: "var(--text2)" }}>{c.label}</div>
                    {!c.val && <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)" }}>{c.impact}</div>}
                  </div>
                ))}
              </div>

              {(!sel.hasContract || !sel.hasBAA) && (
                <div style={{ background: "rgba(240,68,56,0.08)", border: "1px solid rgba(240,68,56,0.25)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>OSFI B-10 / PIPEDA Remediation Required</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>
                    {!sel.hasContract && "• Execute a written data processing agreement before next engagement. "}
                    {!sel.hasBAA && sel.dataAccess === "pii" && "• BAA/DPA required under PIPEDA s.10.3 for any vendor processing Canadian personal data. "}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 40, textAlign: "center", color: "var(--text3)", fontSize: 12 }}>
              Select a vendor to view its risk assessment
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
