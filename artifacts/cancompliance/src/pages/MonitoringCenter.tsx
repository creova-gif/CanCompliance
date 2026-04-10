import { useState } from "react";
import { Activity, RefreshCw, Bell, CheckCircle2, XCircle, AlertTriangle, Clock, TrendingUp, Zap, BellOff, Play, ChevronRight } from "lucide-react";

const MODULES_STATUS = [
  { id: "casl", label: "CASL — Anti-Spam", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "FLAG", "PASS"], statute: "CASL s.20", duration: "1.2s" },
  { id: "pipeda", label: "PIPEDA — Privacy", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "FLAG", "PASS", "PASS", "PASS", "PASS", "PASS"], statute: "PIPEDA s.4.7", duration: "0.9s" },
  { id: "fintrac", label: "FINTRAC — AML/KYC", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "FAIL", history: ["PASS", "PASS", "PASS", "FAIL", "FAIL", "PASS", "PASS", "FAIL"], statute: "PCMLTFA s.9.6", duration: "1.5s" },
  { id: "employment", label: "Employment Standards", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"], statute: "ESA s.17", duration: "0.7s" },
  { id: "aoda", label: "AODA — Accessibility", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "FLAG", history: ["FLAG", "FLAG", "FLAG", "PASS", "FLAG", "FLAG", "FLAG", "FLAG"], statute: "AODA s.14", duration: "2.1s" },
  { id: "esg", label: "ESG — Greenwashing", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"], statute: "Competition Act s.74.01", duration: "0.8s" },
  { id: "gst", label: "GST / HST Filing", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "FLAG", "PASS", "PASS", "PASS"], statute: "ETA s.240", duration: "0.6s" },
  { id: "payroll", label: "Payroll — CRA", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"], statute: "ITA s.227", duration: "0.7s" },
  { id: "safety", label: "Workplace Safety (OHS)", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"], statute: "CLC s.125", duration: "1.0s" },
  { id: "cppa", label: "CPPA — Bill C-27", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "FLAG", history: ["FLAG", "FLAG", "PASS", "FLAG", "FLAG", "FLAG", "FLAG", "FLAG"], statute: "CPPA s.12", duration: "1.1s" },
  { id: "aml", label: "Beneficial Ownership", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"], statute: "CBCA s.21.1", duration: "0.9s" },
  { id: "payequity", label: "Pay Equity", lastRun: "2 min ago", nextRun: "In 4h 58m", status: "PASS", history: ["PASS", "PASS", "PASS", "PASS", "PASS", "FLAG", "PASS", "PASS"], statute: "PESA s.10", duration: "0.8s" },
];

const ALERTS = [
  { id: 1, severity: "CRITICAL", module: "FINTRAC — AML/KYC", message: "AML compliance program standard changed (Bill C-12, effective March 26, 2026). Re-check required.", time: "3h ago", read: false },
  { id: 2, severity: "HIGH", module: "AODA — Accessibility", message: "Website WCAG 2.0 AA score dropped to 61% on last automated scan. 4 new violations detected.", time: "6h ago", read: false },
  { id: 3, severity: "HIGH", module: "CPPA — Bill C-27", message: "Bill C-27 progressed to Senate 3rd reading. Royal Assent imminent. PIA process urgently required.", time: "1d ago", read: false },
  { id: 4, severity: "MEDIUM", module: "GST / HST", message: "Q1 2026 filing deadline in 12 days. Current revenue threshold suggests quarterly filing required.", time: "1d ago", read: true },
  { id: 5, severity: "LOW", module: "Pay Equity", message: "Ontario Pay Transparency Act: annual report due March 31. Prepare salary disclosure data.", time: "2d ago", read: true },
];

const ACTIVITY_FEED = [
  { time: "2 min ago", event: "Scheduled run completed", detail: "12 modules — 9 PASS · 2 FLAG · 1 FAIL", color: "var(--green)" },
  { time: "5h ago", event: "Alert triggered", detail: "FINTRAC compliance program standard changed (Bill C-12)", color: "var(--red)" },
  { time: "5h 2m ago", event: "Scheduled run completed", detail: "12 modules — 9 PASS · 2 FLAG · 1 FAIL", color: "var(--green)" },
  { time: "10h ago", event: "Scheduled run completed", detail: "12 modules — 10 PASS · 2 FLAG · 0 FAIL", color: "var(--green)" },
  { time: "15h ago", event: "Status change detected", detail: "AODA — Accessibility: PASS → FLAG (WCAG scan results)", color: "var(--amber)" },
  { time: "15h 2m ago", event: "Scheduled run completed", detail: "12 modules — 11 PASS · 1 FLAG · 0 FAIL", color: "var(--green)" },
  { time: "1d ago", event: "Alert triggered", detail: "CPPA Bill C-27 Senate 3rd reading — action required", color: "var(--red)" },
  { time: "1d ago", event: "Scheduled run completed", detail: "12 modules — 9 PASS · 3 FLAG · 0 FAIL", color: "var(--green)" },
];

const STATUS_COLOR = {
  PASS: "var(--green)",
  FAIL: "var(--red)",
  FLAG: "var(--amber)",
};
const STATUS_BG = {
  PASS: "rgba(18,183,106,0.08)",
  FAIL: "rgba(240,68,56,0.08)",
  FLAG: "rgba(245,166,35,0.08)",
};

export default function MonitoringCenter() {
  const [runningAll, setRunningAll] = useState(false);
  const [runningModule, setRunningModule] = useState<string | null>(null);
  const [modules, setModules] = useState(MODULES_STATUS);
  const [alerts, setAlerts] = useState(ALERTS);
  const [activeTab, setActiveTab] = useState<"modules" | "alerts" | "activity">("modules");

  const passing = modules.filter(m => m.status === "PASS").length;
  const failing = modules.filter(m => m.status === "FAIL").length;
  const flagged = modules.filter(m => m.status === "FLAG").length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const runAll = () => {
    setRunningAll(true);
    setTimeout(() => setRunningAll(false), 2200);
  };

  const runModule = (id: string) => {
    setRunningModule(id);
    setTimeout(() => setRunningModule(null), 1500);
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  return (
    <div className="page-content">
      <div style={{ background: "rgba(18,183,106,0.06)", border: "1px solid rgba(18,183,106,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px rgba(18,183,106,0.6)" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Continuous Monitoring · Live</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text2)" }}>
              {modules.length} checks running every 5 hours · Last run 2 min ago · Next run in 4h 58m
            </div>
          </div>
          <button onClick={runAll} disabled={runningAll}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", cursor: runningAll ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 11, background: runningAll ? "var(--bg3)" : "#c8f135", color: runningAll ? "var(--text3)" : "#09090a" }}>
            {runningAll ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            {runningAll ? "Running…" : "Run All Now"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Checks", value: modules.length.toString(), icon: Activity, color: "#7F77DD", sub: "Across all modules" },
          { label: "Passing", value: passing.toString(), icon: CheckCircle2, color: "var(--green)", sub: `${Math.round(passing / modules.length * 100)}% success rate` },
          { label: "Failing / Flagged", value: `${failing} / ${flagged}`, icon: XCircle, color: "var(--red)", sub: `${failing} critical · ${flagged} warnings` },
          { label: "Unread Alerts", value: unreadAlerts.toString(), icon: Bell, color: unreadAlerts > 0 ? "var(--amber)" : "var(--green)", sub: unreadAlerts > 0 ? "Action required" : "All reviewed" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon className="w-4 h-4" style={{ color: card.color }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>{card.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: card.color, fontFamily: "var(--mono)", marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {([
          { key: "modules", label: "Module Status" },
          { key: "alerts", label: `Alerts ${unreadAlerts > 0 ? `(${unreadAlerts} new)` : ""}` },
          { key: "activity", label: "Activity Feed" },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid",
              background: activeTab === tab.key ? "#c8f135" : "transparent",
              borderColor: activeTab === tab.key ? "#c8f135" : "var(--border)",
              color: activeTab === tab.key ? "#09090a" : "var(--text2)" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "modules" && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 80px 80px auto", padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg3)" }}>
            {["Module", "Last Run", "Next Run", "Duration", "Status", ""].map(h => (
              <div key={h} style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</div>
            ))}
          </div>
          {modules.map(m => {
            const isRunning = runningModule === m.id || runningAll;
            return (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 80px 80px auto", padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)" }}>{m.label}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginTop: 2 }}>{m.statute}</div>
                </div>
                <div style={{ fontSize: 10, color: "var(--text2)" }}>
                  {isRunning ? <span style={{ color: "#c8f135" }}>Running…</span> : m.lastRun}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{m.nextRun}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>{m.duration}</div>
                <div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                    background: STATUS_BG[m.status as keyof typeof STATUS_BG],
                    color: STATUS_COLOR[m.status as keyof typeof STATUS_COLOR],
                    border: `1px solid ${STATUS_COLOR[m.status as keyof typeof STATUS_COLOR]}40` }}>
                    {isRunning ? "···" : m.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {m.history.map((h, i) => (
                    <div key={i} title={h} style={{ width: 6, height: 20, borderRadius: 2, background: STATUS_COLOR[h as keyof typeof STATUS_COLOR], opacity: i < m.history.length - 1 ? 0.4 + (i / m.history.length) * 0.4 : 1 }} />
                  ))}
                  <button onClick={() => runModule(m.id)} disabled={!!runningModule || runningAll} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 7px", cursor: "pointer", marginLeft: 6 }}>
                    <RefreshCw className="w-3 h-3" style={{ color: "var(--text3)" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "alerts" && (
        <div className="space-y-3">
          {alerts.map(alert => {
            const severityColor = alert.severity === "CRITICAL" ? "var(--red)" : alert.severity === "HIGH" ? "var(--amber)" : alert.severity === "MEDIUM" ? "#f5a623" : "var(--text3)";
            return (
              <div key={alert.id} data-alert-id={alert.id} data-alert-read={alert.read ? "true" : "false"} style={{ background: alert.read ? "var(--bg2)" : "rgba(200,241,53,0.03)", border: `1px solid ${alert.read ? "var(--border)" : "rgba(200,241,53,0.15)"}`, borderRadius: 10, padding: "14px 16px", opacity: alert.read ? 0.65 : 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: `${severityColor}15`, color: severityColor, border: `1px solid ${severityColor}30` }}>{alert.severity}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text1)" }}>{alert.module}</span>
                      <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>{alert.time}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{alert.message}</div>
                  </div>
                  {!alert.read && (
                    <button onClick={() => dismissAlert(alert.id)} data-action="dismiss" data-alert-dismiss={alert.id} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "var(--text3)", fontSize: 9, fontFamily: "var(--mono)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "activity" && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {ACTIVITY_FEED.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", padding: "12px 16px", borderBottom: i < ACTIVITY_FEED.length - 1 ? "1px solid var(--border)" : "none", alignItems: "start", gap: 16 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>{item.time}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text1)" }}>
                <ChevronRight className="w-3 h-3 inline-block mr-1" style={{ color: item.color }} />
                {item.event}
              </div>
              <div style={{ fontSize: 10, color: "var(--text2)" }}>{item.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
