import { useAudit } from "../context/AuditContext";
import { Target } from "lucide-react";

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

export default function ComplianceScore() {
  const { metrics, auditLog, computeScore, currentJurisdiction } = useAudit();
  const score = computeScore();

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

  return (
    <div className="page-content">
      <div className="page-header">
        <Target size={20} />
        <span>Live Compliance Score</span>
      </div>
      <p className="page-desc">Real-time compliance score computed from all checks run this session. Score = (pass + flag×0.5) / total × 100, minus block penalty (15 pts each, max −30). Run module checks to populate your score.</p>

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
            return (
              <div key={mod} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 110, fontSize: 12, color: "var(--text2)", flexShrink: 0 }}>{mod}</div>
                <div style={{ flex: 1, height: 5, background: "var(--bg4)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: ms + "%", height: "100%", background: mc, borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: mc, width: 32, textAlign: "right" }}>{ms}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", width: 55 }}>{d.total} check{d.total !== 1 ? "s" : ""}</div>
              </div>
            );
          })
        )}
      </div>

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
    </div>
  );
}
