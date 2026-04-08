import { useState } from "react";
import { useAudit } from "../context/AuditContext";
import { Target, Loader2, BarChart3, TrendingUp, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@clerk/react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function getColor(s: number) {
  if (s >= 80) return "var(--green)";
  if (s >= 60) return "var(--amber)";
  return "var(--red)";
}

function getTier(s: number) {
  if (s >= 90) return "Excellent — strong compliance posture";
  if (s >= 75) return "Good — minor gaps to address";
  if (s >= 55) return "Fair — several compliance items need action";
  if (s >= 35) return "At risk — significant violations present";
  return "Critical — immediate legal review required";
}

const PRIORITY_COLORS: Record<string, string> = { BLOCK: "var(--red)", FAIL: "var(--amber)", FLAG: "var(--primary)" };

// System 1 — AI Risk Scoring Engine
// Weighted compliance risk model using real enforcement trend data (2025–2026)
const RISK_WEIGHTS: Record<string, { base: number; trend: "up" | "stable" | "down"; multiplier: number; enforcement: string; penalty: string }> = {
  "FINTRAC": { base: 35, trend: "up", multiplier: 1.25, enforcement: "$176.9M penalty Oct 2025 · Bill C-12 IN FORCE Mar 26, 2026", penalty: "Up to $20M or 3% revenue" },
  "CASL": { base: 25, trend: "up", multiplier: 1.20, enforcement: "$1.1M CRTC fine Jan 2026 · 4 fines Q1 2026", penalty: "Up to $10M/day" },
  "PIPEDA": { base: 20, trend: "up", multiplier: 1.15, enforcement: "CPPA incoming · CAI joint audits Quebec", penalty: "Up to $100K + incoming CPPA $25M" },
  "Employment": { base: 18, trend: "stable", multiplier: 1.0, enforcement: "Ontario ESA orders increasing · AI hiring law 2026", penalty: "ESA orders · $15K fine" },
  "Bill 96": { base: 15, trend: "up", multiplier: 1.10, enforcement: "OLF enforcement began 2024 · 500+ businesses inspected", penalty: "Up to $30K first offence" },
  "ESG": { base: 14, trend: "up", multiplier: 1.15, enforcement: "Competition Bureau $3M fines · Bill C-59 in force", penalty: "3% global revenue" },
  "CCPSA": { base: 12, trend: "stable", multiplier: 1.0, enforcement: "Health Canada recalls up 18% 2025", penalty: "Up to $5M" },
  "Payroll": { base: 12, trend: "stable", multiplier: 1.0, enforcement: "CRA compliance sweep targeting misclassification", penalty: "10–20% surcharge" },
  "Safety": { base: 11, trend: "up", multiplier: 1.10, enforcement: "WorkSafeBC first psychological safety orders Sept 2025", penalty: "Up to $1.5M" },
  "S-211": { base: 10, trend: "up", multiplier: 1.05, enforcement: "First annual reports due May 2024 · enforcement escalating", penalty: "Up to $250K" },
  "Privacy": { base: 20, trend: "up", multiplier: 1.15, enforcement: "CPPA Third Reading passed · CAI joint audits", penalty: "Up to $25M (CPPA)" },
  "Customs": { base: 9, trend: "stable", multiplier: 1.0, enforcement: "CARM Phase 3 mandatory — bond requirements", penalty: "Seizure + penalties" },
  "AI Gov.": { base: 8, trend: "up", multiplier: 1.20, enforcement: "AIDA framework + Ontario Workers IV Act 2026", penalty: "Up to $25M (forthcoming)" },
  "EPR": { base: 7, trend: "stable", multiplier: 1.0, enforcement: "Ontario Blue Box enforcement active", penalty: "Provincial fines" },
  "GST/HST": { base: 10, trend: "stable", multiplier: 1.0, enforcement: "CRA digital services sweep for SaaS businesses", penalty: "Penalties + interest" },
  "CPLA": { base: 8, trend: "stable", multiplier: 1.0, enforcement: "Bill 96 bilingual labelling now enforced", penalty: "Up to $30K" },
};

function computeWeightedRisk(auditLog: any[]) {
  const moduleRisks: Record<string, { weight: number; hasFail: boolean; hasSomething: boolean }> = {};
  auditLog.forEach(e => {
    const mod = e.module;
    const w = RISK_WEIGHTS[mod];
    if (!moduleRisks[mod]) moduleRisks[mod] = { weight: w ? w.base * w.multiplier : 10, hasFail: false, hasSomething: true };
    if (e.result === "FAIL" || e.result === "BLOCK" || e.result === "FLAG") moduleRisks[mod].hasFail = true;
  });
  let totalRisk = 0;
  let maxPossible = 0;
  Object.entries(moduleRisks).forEach(([mod, data]) => {
    maxPossible += data.weight;
    if (data.hasFail) totalRisk += data.weight;
  });
  return maxPossible === 0 ? 0 : Math.round((totalRisk / maxPossible) * 100);
}

export default function ComplianceScore() {
  const { metrics, auditLog, computeScore, currentJurisdiction } = useAudit();
  const { getToken } = useAuth();
  const score = computeScore();
  const [planLoading, setPlanLoading] = useState(false);
  const [remediationPlan, setRemediationPlan] = useState("");
  const [planError, setPlanError] = useState("");
  const [showPlan, setShowPlan] = useState(false);

  const modTotals: Record<string, { pass: number; fail: number; flag: number; block: number; total: number }> = {};
  auditLog.forEach(e => {
    if (!modTotals[e.module]) modTotals[e.module] = { pass: 0, fail: 0, flag: 0, block: 0, total: 0 };
    const r = e.result.toLowerCase() as "pass" | "fail" | "flag" | "block";
    modTotals[e.module][r] = (modTotals[e.module][r] || 0) + 1;
    modTotals[e.module].total++;
  });

  const actions: { priority: string; mod: string; msg: string; points: string }[] = [];
  Object.entries(modTotals).forEach(([mod, d]) => {
    if (d.block > 0) actions.push({ priority: "BLOCK", mod, msg: `${d.block} hard block(s) in ${mod} — immediate action required`, points: "+20 pts" });
    if (d.fail > 0) actions.push({ priority: "FAIL", mod, msg: `${d.fail} failure(s) in ${mod} — resolve to gain points`, points: "+12 pts" });
    if (d.flag > 0) actions.push({ priority: "FLAG", mod, msg: `${d.flag} flagged item(s) in ${mod} — lawyer review recommended`, points: "+6 pts" });
  });
  actions.sort((a, b) => { const o: Record<string, number> = { BLOCK: 0, FAIL: 1, FLAG: 2 }; return o[a.priority] - o[b.priority]; });

  const RADIUS = 68;
  const CIRC = 2 * Math.PI * RADIUS;
  const offset = score !== null ? CIRC - (CIRC * score / 100) : CIRC;
  const color = score !== null ? getColor(score) : "var(--text3)";

  // System 1: AI Risk Scoring Engine
  const weightedRisk = computeWeightedRisk(auditLog);
  const topRisks = Object.entries(RISK_WEIGHTS)
    .filter(([mod]) => modTotals[mod]?.fail > 0 || modTotals[mod]?.block > 0)
    .sort((a, b) => (b[1].base * b[1].multiplier) - (a[1].base * a[1].multiplier))
    .slice(0, 5);

  // System 8: AI Remediation Planner
  const generateRemediationPlan = async () => {
    setPlanLoading(true);
    setRemediationPlan("");
    setPlanError("");
    setShowPlan(true);

    const failures = auditLog.filter(e => e.result === "FAIL" || e.result === "BLOCK" || e.result === "FLAG");
    const summaryByModule: Record<string, string[]> = {};
    failures.forEach(e => {
      if (!summaryByModule[e.module]) summaryByModule[e.module] = [];
      summaryByModule[e.module].push(`${e.result}: ${e.input} (${e.statute})`);
    });

    const failureSummary = Object.entries(summaryByModule).map(([mod, items]) =>
      `${mod}:\n${items.slice(0, 3).map(i => `  - ${i}`).join("\n")}`
    ).join("\n\n");

    const prompt = `You are a Canadian compliance expert. Generate a concrete, week-by-week 30-day remediation plan for the following compliance failures.

Business context:
- Province/Jurisdiction: ${currentJurisdiction || "Ontario (assumed)"}
- Compliance score: ${score ?? "Not calculated"}
- Active failures and flags:
${failureSummary || "No specific failures recorded yet — generate a general plan based on highest-risk Canadian laws."}

ENFORCEMENT CONTEXT (April 2026):
- Bill C-12 IN FORCE (Mar 26, 2026): FINTRAC effectiveness standard changed — 40× penalty
- CRTC: 4 CASL fines in Q1 2026 — implied consent top trigger
- Quebec CAI joint audits with CRTC active
- WorkSafeBC: first psychological safety enforcement orders

Generate a 30-day remediation plan with:

WEEK 1 (Days 1–7) — CRITICAL IMMEDIATE ACTIONS:
[3-4 specific, concrete actions with statute references and exact deadlines]

WEEK 2 (Days 8–14) — HIGH PRIORITY FIXES:
[3-4 actions]

WEEK 3 (Days 15–21) — MEDIUM PRIORITY IMPROVEMENTS:
[3-4 actions]

WEEK 4 (Days 22–30) — MONITORING & DOCUMENTATION:
[3-4 actions to establish ongoing compliance monitoring]

COMPLIANCE CERTIFICATE READINESS:
[Summary of what will be achieved if this plan is followed, and what evidence to collect for each statute]

For each action, cite the exact statute section and maximum penalty avoided. Be specific and actionable — not generic. This is Canadian law, not American.`;

    try {
      const token = await getToken();
      const resp = await fetch(`${API_BASE}/api/anthropic/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: "AI Remediation Plan" }),
      });
      if (!resp.ok) throw new Error("Failed to create session");
      const { id: convId } = await resp.json();

      const msgResp = await fetch(`${API_BASE}/api/anthropic/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: prompt }),
      });
      if (!msgResp.ok) throw new Error("Failed to generate plan");

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
              if (d.content) { full += d.content; setRemediationPlan(full); }
            } catch {}
          }
        }
      }
    } catch (e: any) {
      setPlanError(e.message || "Failed to generate plan");
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <AppLayout title="Live Compliance Score" subtitle="System 1 & 8 — AI Risk Engine + Remediation Planner">
      <div style={{ maxWidth: 900 }}>

        {/* Score ring + metrics */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 8 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 220 }}>
            <svg width={160} height={160} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={80} cy={80} r={RADIUS} fill="none" stroke="var(--bg4)" strokeWidth={10} />
              <circle cx={80} cy={80} r={RADIUS} fill="none" stroke={color} strokeWidth={10}
                strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }} />
              <text x={80} y={80} textAnchor="middle" dominantBaseline="central"
                fill={color} fontSize={score !== null ? 36 : 24} fontFamily="var(--mono)" fontWeight="bold"
                style={{ transform: "rotate(90deg)", transformOrigin: "80px 80px" }}>
                {score !== null ? score : "—"}
              </text>
            </svg>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color, textAlign: "center", marginTop: 8 }}>
              {score !== null ? getTier(score) : "Run checks to generate score"}
            </div>
            {currentJurisdiction && (
              <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", marginTop: 6 }}>
                Jurisdiction: {currentJurisdiction}
              </div>
            )}

            {/* System 8 — Remediation Planner button */}
            {auditLog.length > 0 && (
              <button
                data-testid="btn-remediation-plan"
                onClick={generateRemediationPlan}
                disabled={planLoading}
                style={{ marginTop: 16, width: "100%", padding: "8px 14px", background: "#c8f135", color: "#09090a", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: planLoading ? 0.6 : 1 }}
              >
                {planLoading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={13} />}
                {planLoading ? "Generating..." : "Generate 30-Day Plan"}
              </button>
            )}
          </div>

          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, alignContent: "start", minWidth: 200 }}>
            {[
              { label: "Total Checks", val: metrics.total, color: "var(--text1)" },
              { label: "Pass", val: metrics.pass, color: "var(--green)" },
              { label: "Fail", val: metrics.fail, color: "var(--amber)" },
              { label: "Flag", val: metrics.flag, color: "var(--red)" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 4 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 28, fontFamily: "var(--mono)", color: s.color, fontWeight: 700 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System 1 — AI Risk Scoring Engine */}
        {auditLog.length > 0 && (
          <div style={{ marginTop: 20, background: "var(--bg2)", border: "1px solid rgba(200,241,53,0.15)", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <BarChart3 size={14} style={{ color: "#c8f135" }} />
              <div style={{ fontSize: 11, color: "#c8f135", fontFamily: "var(--mono)" }}>SYSTEM 1 — AI RISK SCORING ENGINE · Real enforcement data 2025–2026</div>
              <div style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 12, padding: "2px 10px", borderRadius: 6, background: weightedRisk > 60 ? "rgba(240,68,56,0.15)" : weightedRisk > 30 ? "rgba(245,166,35,0.15)" : "rgba(18,183,106,0.15)", color: weightedRisk > 60 ? "var(--red)" : weightedRisk > 30 ? "var(--amber)" : "var(--green)" }}>
                Risk Score: {weightedRisk}%
              </div>
            </div>

            {topRisks.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", padding: "12px 0", fontFamily: "var(--mono)" }}>
                No failures detected — risk score is low. Run checks across all 14 modules to assess exposure.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {topRisks.map(([mod, w]) => (
                  <div key={mod} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)", minWidth: 90 }}>{mod}</div>
                      <div style={{ flex: 1, height: 4, background: "var(--bg4)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, (w.base * w.multiplier / 44) * 100)}%`, height: "100%", background: w.trend === "up" ? "var(--red)" : "var(--amber)", borderRadius: 2 }} />
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: w.trend === "up" ? "var(--red)" : "var(--amber)", display: "flex", alignItems: "center", gap: 4 }}>
                        <TrendingUp size={10} />
                        {Math.round(w.base * w.multiplier)}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.5 }}>{w.enforcement}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", marginTop: 3 }}>MAX: {w.penalty}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 12, fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", lineHeight: 1.6 }}>
              Risk score weighted by: enforcement trend (2025–26), penalty exposure, and regulatory activity. FINTRAC highest risk due to Bill C-12.
            </div>
          </div>
        )}

        {/* System 8 — AI Remediation Planner output */}
        {showPlan && (
          <div style={{ marginTop: 20, background: "var(--bg2)", border: "1px solid rgba(200,241,53,0.2)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={14} style={{ color: "#c8f135" }} />
              <div style={{ fontSize: 11, color: "#c8f135", fontFamily: "var(--mono)" }}>SYSTEM 8 — AI REMEDIATION PLANNER · 30-day plan generated by Claude Sonnet</div>
              <button onClick={() => setShowPlan(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 12 }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              {planError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "rgba(240,68,56,0.1)", border: "1px solid rgba(240,68,56,0.2)", borderRadius: 8, marginBottom: 12 }}>
                  <AlertTriangle size={14} style={{ color: "var(--red)" }} />
                  <span style={{ fontSize: 12, color: "var(--red)" }}>{planError}</span>
                </div>
              )}
              {planLoading && !remediationPlan && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text3)", fontSize: 12 }}>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite", color: "#c8f135" }} />
                  Claude is building your personalized 30-day remediation plan...
                </div>
              )}
              {remediationPlan && (
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                  {remediationPlan}
                  {planLoading && <span style={{ color: "#c8f135", animation: "blink 1s step-end infinite" }}>▌</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Module breakdown */}
        <div style={{ marginTop: 24, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 16 }}>MODULE BREAKDOWN</div>
          {Object.keys(modTotals).length === 0 ? (
            <div style={{ color: "var(--text3)", fontSize: 12, fontFamily: "var(--mono)", textAlign: "center", padding: "24px 0" }}>
              No checks run yet — visit the 13 module pages to run compliance checks
            </div>
          ) : (
            Object.entries(modTotals).map(([mod, d]) => {
              const ms = Math.round(((d.pass + d.flag * 0.5) / d.total) * 100);
              const mc = getColor(ms);
              const riskWeight = RISK_WEIGHTS[mod];
              return (
                <div key={mod} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: 110, fontSize: 12, color: "var(--text2)", flexShrink: 0 }}>{mod}</div>
                  <div style={{ flex: 1, height: 5, background: "var(--bg4)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: ms + "%", height: "100%", background: mc, borderRadius: 3, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: mc, width: 32, textAlign: "right" }}>{ms}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", width: 55 }}>{d.total} check{d.total !== 1 ? "s" : ""}</div>
                  {riskWeight && (
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: riskWeight.trend === "up" ? "var(--red)" : "var(--text3)", width: 50, textAlign: "right" }}>
                      {riskWeight.trend === "up" ? "↑ HIGH" : "STABLE"}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Priority Actions */}
        <div style={{ marginTop: 20, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 16 }}>PRIORITY ACTIONS</div>
          {actions.length === 0 ? (
            <div style={{ color: metrics.total === 0 ? "var(--text3)" : "var(--green)", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
              {metrics.total === 0 ? "Run checks to generate priority actions" : "All checks passing — great compliance posture"}
            </div>
          ) : (
            actions.slice(0, 8).map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "2px 7px", borderRadius: 3, background: PRIORITY_COLORS[a.priority] + "22", color: PRIORITY_COLORS[a.priority] }}>{a.priority}</span>
                <span style={{ flex: 1, fontSize: 12, color: "var(--text2)" }}>{a.msg}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)" }}>{a.points}</span>
              </div>
            ))
          )}
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `}</style>
      </div>
    </AppLayout>
  );
}
