import { useState } from "react";
import { Mail, Plus, Trash2, UserX } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, CaslRecord } from "../context/AuditContext";

export default function CaslLedger() {
  const { caslRecords, addCaslRecord, unsubscribeCasl } = useAudit();
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [type, setType] = useState("express");
  const [consentText, setConsentText] = useState("");
  const [source, setSource] = useState("");
  const [purpose, setPurpose] = useState("");

  const now = new Date();

  const submit = () => {
    if (!email) return;
    const captured = now.toISOString();
    const expiresAt = type === "express" ? "" : type === "implied_business"
      ? new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString();

    const rec: CaslRecord = {
      id: uid(),
      email,
      type,
      consentText,
      source,
      ip: "—",
      purpose,
      hasUnsub: true,
      capturedAt: captured,
      expiresAt,
      unsubscribed: false,
    };
    addCaslRecord(rec);
    setEmail(""); setConsentText(""); setSource(""); setPurpose("");
    setShowForm(false);
  };

  const isExpired = (r: CaslRecord) => {
    if (!r.expiresAt) return false;
    return new Date(r.expiresAt) < new Date();
  };

  const statusColor = (r: CaslRecord) => {
    if (r.unsubscribed) return "var(--red)";
    if (isExpired(r)) return "var(--amber)";
    return "var(--green)";
  };

  const statusLabel = (r: CaslRecord) => {
    if (r.unsubscribed) return "UNSUBSCRIBED";
    if (isExpired(r)) return "EXPIRED";
    return "ACTIVE";
  };

  return (
    <AppLayout title="CASL Consent Ledger" subtitle="Express & implied consent records · PCMLTFA-compliant audit trail">
      <div style={{ maxWidth: 860 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
              Maintain a tamper-evident CASL consent ledger. Express consent never expires; implied consent from a business relationship expires after 2 years; implied from inquiry — 6 months.
            </div>
          </div>
          <button className="run-btn" style={{ marginTop: 0, flexShrink: 0 }} onClick={() => setShowForm(v => !v)} data-testid="casl-add">
            <Plus size={14} />
            Add Record
          </button>
        </div>

        {showForm && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 14 }}>NEW CASL CONSENT RECORD</div>
            <div className="form-grid">
              <label className="form-label">
                Email Address
                <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="subscriber@example.com" data-testid="casl-email" />
              </label>
              <label className="form-label">
                Consent Type
                <select className="form-select" value={type} onChange={e => setType(e.target.value)} data-testid="casl-type">
                  <option value="express">Express — does not expire</option>
                  <option value="implied_business">Implied — existing business relationship (2yr)</option>
                  <option value="implied_inquiry">Implied — inquiry / quote (6mo)</option>
                </select>
              </label>
              <label className="form-label" style={{ gridColumn: "1 / -1" }}>
                Consent Text / Checkbox Label
                <input className="form-input" value={consentText} onChange={e => setConsentText(e.target.value)} placeholder="e.g. I agree to receive marketing emails from Acme Corp." data-testid="casl-text" />
              </label>
              <label className="form-label">
                Source / Collection Point
                <input className="form-input" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Contact form, checkout, trade show" data-testid="casl-source" />
              </label>
              <label className="form-label">
                Purpose
                <input className="form-input" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Marketing newsletters, product updates" data-testid="casl-purpose" />
              </label>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="run-btn" onClick={submit} data-testid="casl-submit">
                <Mail size={14} />
                Add to Ledger
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: "8px 16px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, color: "var(--text2)", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Records", val: caslRecords.length, color: "var(--text1)" },
            { label: "Active", val: caslRecords.filter(r => !r.unsubscribed && !isExpired(r)).length, color: "var(--green)" },
            { label: "Expired", val: caslRecords.filter(isExpired).length, color: "var(--amber)" },
            { label: "Unsubscribed", val: caslRecords.filter(r => r.unsubscribed).length, color: "var(--red)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontFamily: "var(--mono)", color: s.color, fontWeight: 700 }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {caslRecords.length === 0 ? (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 40, textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 12 }}>
            No consent records yet — add your first record above
          </div>
        ) : (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 110px 100px 130px 80px", gap: 12, fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)" }}>
              <div>EMAIL / PURPOSE</div>
              <div>TYPE</div>
              <div>CAPTURED</div>
              <div>EXPIRES</div>
              <div>STATUS</div>
            </div>
            {caslRecords.map(r => (
              <div key={r.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 110px 100px 130px 80px", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text1)", fontFamily: "var(--mono)" }}>{r.email}</div>
                  {r.purpose && <div style={{ fontSize: 10, color: "var(--text3)" }}>{r.purpose}</div>}
                  {r.source && <div style={{ fontSize: 10, color: "var(--text3)" }}>via {r.source}</div>}
                </div>
                <div style={{ fontSize: 10, color: "var(--text2)", fontFamily: "var(--mono)" }}>{r.type.replace("_", " ")}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>{new Date(r.capturedAt).toLocaleDateString("en-CA")}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                  {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-CA") : "Never"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, fontFamily: "var(--mono)", color: statusColor(r), background: statusColor(r) + "22", padding: "2px 6px", borderRadius: 3 }}>
                    {statusLabel(r)}
                  </span>
                  {!r.unsubscribed && (
                    <button
                      onClick={() => unsubscribeCasl(r.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 2 }}
                      title="Mark as unsubscribed"
                      data-testid={`unsub-${r.id}`}
                    >
                      <UserX size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 14, fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", lineHeight: 1.6 }}>
          CASL (Canada's Anti-Spam Legislation) s.10 — Express consent is indefinite; implied consent expires on the dates shown. Records must be retained for the period that consent is relied upon plus 3 years. Penalty: up to $10,000,000 per violation.
        </div>
      </div>
    </AppLayout>
  );
}
