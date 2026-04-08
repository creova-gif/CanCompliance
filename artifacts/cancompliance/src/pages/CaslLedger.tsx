import { useState } from "react";
import { Mail, Plus, Trash2, UserX, Activity, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, CaslRecord } from "../context/AuditContext";
import { useAuth } from "@clerk/react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function CaslLedger() {
  const { caslRecords, addCaslRecord, unsubscribeCasl } = useAudit();
  const { getToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthAnalysis, setHealthAnalysis] = useState("");
  const [analyzerError, setAnalyzerError] = useState("");

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

  // System 9 — CASL Consent Health Analyzer
  const runHealthAnalysis = async () => {
    setAnalyzerLoading(true);
    setHealthAnalysis("");
    setAnalyzerError("");

    const total = caslRecords.length;
    const express = caslRecords.filter(r => r.type === "express").length;
    const implied = caslRecords.filter(r => r.type !== "express").length;
    const active = caslRecords.filter(r => !r.unsubscribed && !isExpired(r)).length;
    const expired = caslRecords.filter(isExpired).length;
    const unsubscribed = caslRecords.filter(r => r.unsubscribed).length;
    const missingConsentText = caslRecords.filter(r => !r.consentText).length;
    const missingSource = caslRecords.filter(r => !r.source).length;
    const now = new Date();
    const expiringSoon = caslRecords.filter(r => {
      if (!r.expiresAt || r.unsubscribed) return false;
      const diff = new Date(r.expiresAt).getTime() - now.getTime();
      return diff > 0 && diff < 60 * 24 * 60 * 60 * 1000;
    }).length;

    // Compute raw health score
    let score = 100;
    if (total === 0) { score = 0; }
    else {
      score -= (expired / total) * 30;
      score -= (missingConsentText / total) * 20;
      score -= (missingSource / total) * 10;
      score -= expiringSoon > 0 ? 10 : 0;
      score -= implied > express ? 10 : 0;
    }
    const finalScore = Math.max(0, Math.round(score));
    setHealthScore(finalScore);

    const prompt = `You are a CASL compliance expert. Analyze this CASL consent ledger and provide specific, actionable recommendations.

LEDGER STATISTICS:
- Total records: ${total}
- Express consent: ${express} (${total > 0 ? Math.round(express/total*100) : 0}%)
- Implied consent: ${implied} (${total > 0 ? Math.round(implied/total*100) : 0}%)
- Currently active: ${active}
- Expired records: ${expired}
- Unsubscribed: ${unsubscribed}
- Missing consent text: ${missingConsentText}
- Missing source/collection point: ${missingSource}
- Expiring in 60 days: ${expiringSoon}

CRTC ENFORCEMENT CONTEXT (2026):
- CRTC issued 4 CASL fines in Q1 2026 — implied consent expiry is the #1 trigger
- $1.1M fine in January 2026 — failure to maintain adequate consent records
- Bill C-12 in force March 26, 2026 — though this affects FINTRAC, CRTC is coordinating with CAI

Provide a CASL Consent Health Analysis with:

1. HEALTH SCORE INTERPRETATION: What this ${finalScore}/100 score means for CRTC risk exposure

2. CRITICAL ISSUES (if any): Specific problems that must be fixed immediately with statute citations (CASL S.10(1), S.11, CRTC Reg 2012-36)

3. IMPROVEMENT ACTIONS: 3-5 specific, numbered actions to improve the ledger — with deadlines and exact statute references

4. CRTC AUDIT READINESS: What a CRTC auditor would look for in this ledger and what's missing

Keep response under 400 words. Be direct and specific, not generic.`;

    try {
      const token = await getToken();
      const resp = await fetch(`${API_BASE}/api/anthropic/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: "CASL Health Analysis" }),
      });
      if (!resp.ok) throw new Error("Failed to start analysis");
      const { id: convId } = await resp.json();

      const msgResp = await fetch(`${API_BASE}/api/anthropic/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: prompt }),
      });
      if (!msgResp.ok) throw new Error("Failed to generate analysis");

      const reader = msgResp.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const d = JSON.parse(line.slice(6));
              if (d.content) { full += d.content; setHealthAnalysis(full); }
            } catch {}
          }
        }
      }
    } catch (e: any) {
      setAnalyzerError(e.message || "Analysis failed");
    } finally {
      setAnalyzerLoading(false);
    }
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

        {/* System 9 — CASL Consent Health Analyzer */}
        <div style={{ marginTop: 20, background: "var(--bg2)", border: "1px solid rgba(200,241,53,0.15)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={14} style={{ color: "#c8f135" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#c8f135" }}>SYSTEM 9 — CASL CONSENT HEALTH ANALYZER · AI-powered ledger audit</span>
            </div>
            {healthScore !== null && (
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: healthScore >= 80 ? "var(--green)" : healthScore >= 60 ? "var(--amber)" : "var(--red)" }}>
                Health Score: {healthScore}/100
              </div>
            )}
          </div>
          <div style={{ padding: "16px 20px" }}>
            {!healthAnalysis && !analyzerLoading && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
                  Analyze your full CASL consent ledger against 2026 CRTC enforcement patterns. Generates a 0–100 health score and Claude-powered gap analysis with specific remediation actions.
                </div>
                <button
                  data-testid="btn-casl-health"
                  onClick={runHealthAnalysis}
                  disabled={analyzerLoading || caslRecords.length === 0}
                  style={{ flexShrink: 0, padding: "8px 16px", background: "#c8f135", color: "#09090a", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: caslRecords.length === 0 ? "not-allowed" : "pointer", opacity: caslRecords.length === 0 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Activity size={13} />
                  {caslRecords.length === 0 ? "Add records first" : "Analyze Ledger"}
                </button>
              </div>
            )}

            {analyzerLoading && !healthAnalysis && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text3)", fontSize: 12 }}>
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite", color: "#c8f135" }} />
                Claude is analyzing your CASL consent ledger...
              </div>
            )}

            {analyzerError && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "rgba(240,68,56,0.1)", border: "1px solid rgba(240,68,56,0.2)", borderRadius: 8 }}>
                <AlertTriangle size={14} style={{ color: "var(--red)" }} />
                <span style={{ fontSize: 12, color: "var(--red)" }}>{analyzerError}</span>
              </div>
            )}

            {(healthAnalysis || (healthScore !== null && analyzerLoading)) && (
              <div>
                {healthScore !== null && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 32, fontFamily: "var(--mono)", fontWeight: 700, color: healthScore >= 80 ? "var(--green)" : healthScore >= 60 ? "var(--amber)" : "var(--red)" }}>{healthScore}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: healthScore >= 80 ? "var(--green)" : healthScore >= 60 ? "var(--amber)" : "var(--red)" }}>
                        {healthScore >= 80 ? "Strong consent posture" : healthScore >= 60 ? "Moderate risk — action needed" : "High CRTC risk — urgent action required"}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", marginTop: 2 }}>CASL Consent Health Score · 0–100 scale</div>
                    </div>
                    <button onClick={() => { setHealthScore(null); setHealthAnalysis(""); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                )}
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                  {healthAnalysis}
                  {analyzerLoading && <span style={{ color: "#c8f135" }}>▌</span>}
                </div>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </AppLayout>
  );
}
