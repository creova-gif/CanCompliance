import { useState } from "react";
import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react";

const MODULES = [
  { id: "casl", label: "CASL — Anti-Spam", maxFine: 10000000, desc: "Up to $10M/violation for organizations", icon: "📧", statute: "CASL s.20" },
  { id: "pipeda", label: "PIPEDA / CPPA — Privacy", maxFine: 25000000, desc: "Up to $25M or 5% global revenue under CPPA", icon: "🔒", statute: "CPPA s.93" },
  { id: "fintrac", label: "FINTRAC — AML/KYC", maxFine: 500000, desc: "Up to $500K/violation + potential criminal charges", icon: "🏦", statute: "PCMLTFA s.73" },
  { id: "employment", label: "Employment Standards", maxFine: 100000, desc: "Up to $100K/violation + order to pay wages", icon: "👥", statute: "ESA s.95" },
  { id: "aoda", label: "AODA — Accessibility", maxFine: 100000, desc: "Up to $100K/day for corporations in Ontario", icon: "♿", statute: "AODA s.37" },
  { id: "esg", label: "ESG — Greenwashing", maxFine: 10000000, desc: "Up to $10M for misleading environmental claims", icon: "🌿", statute: "Competition Act s.74.01" },
  { id: "gst", label: "GST / HST", maxFine: 25000, desc: "Penalty + interest — 5% of unpaid amount + daily interest", icon: "🧾", statute: "Excise Tax Act s.280" },
  { id: "payroll", label: "Payroll — CRA", maxFine: 50000, desc: "10% penalty on unremitted amounts + interest", icon: "💰", statute: "ITA s.227" },
  { id: "safety", label: "Workplace Safety (OHS)", maxFine: 1500000, desc: "Up to $1.5M/violation under federal Canada Labour Code", icon: "⛑️", statute: "CLC s.148" },
  { id: "supplychain", label: "S-211 — Supply Chain", maxFine: 250000, desc: "Up to $250K for failure to report", icon: "🔗", statute: "Fighting Against Forced Labour Act s.20" },
  { id: "customs", label: "Customs — CBSA", maxFine: 500000, desc: "Seizure + AMPS penalties up to $500K", icon: "🚢", statute: "Customs Act s.109.1" },
  { id: "ccpsa", label: "CCPSA — Product Safety", maxFine: 5000000, desc: "Up to $5M/day while violation continues", icon: "🛡️", statute: "CCPSA s.32" },
];

export default function FineExposure() {
  const [checks, setChecks] = useState<Record<string, "pass" | "fail" | "flag">>({});
  const [revenue, setRevenue] = useState("1000000");
  const [calc, setCalc] = useState(false);

  const toggle = (id: string, val: "pass" | "fail" | "flag") => {
    setChecks(prev => ({ ...prev, [id]: prev[id] === val ? undefined as any : val }));
    setCalc(false);
  };

  const failedModules = MODULES.filter(m => checks[m.id] === "fail");
  const flaggedModules = MODULES.filter(m => checks[m.id] === "flag");
  const rev = parseFloat(revenue) || 0;

  const maxExposure = failedModules.reduce((sum, m) => {
    if (m.id === "pipeda") return sum + Math.max(m.maxFine, rev * 0.05);
    return sum + m.maxFine;
  }, 0);
  const flagExposure = flaggedModules.reduce((sum, m) => sum + m.maxFine * 0.15, 0);
  const totalExposure = maxExposure + flagExposure;

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");
  const fmtM = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${Math.round(n)}`;

  return (
    <div className="page-content">
      <div style={{ background: "rgba(240,68,56,0.08)", border: "1px solid rgba(240,68,56,0.25)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>Total Fine Exposure Calculator</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Select your compliance status for each module. We'll calculate your total maximum fine exposure based on Canadian statutory maximums. This is the number that matters in board meetings and investor due diligence.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Mark your compliance status for each module</div>
          <div className="space-y-2">
            {MODULES.map(m => {
              const status = checks[m.id];
              return (
                <div key={m.id} style={{ background: "var(--bg2)", border: `1px solid ${status === "fail" ? "rgba(240,68,56,0.4)" : status === "flag" ? "rgba(245,166,35,0.3)" : "var(--border)"}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, transition: "border-color 0.2s" }}>
                  <div style={{ fontSize: 18 }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)", marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{m.desc}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["pass", "flag", "fail"] as const).map(v => (
                      <button key={v} onClick={() => toggle(m.id, v)}
                        aria-label={`${v} ${m.label}`}
                        data-module={m.id}
                        data-status={v}
                        style={{ padding: "4px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700, cursor: "pointer", border: "1px solid", fontFamily: "var(--mono)", letterSpacing: "0.5px",
                          background: status === v ? (v === "pass" ? "rgba(18,183,106,0.2)" : v === "flag" ? "rgba(245,166,35,0.2)" : "rgba(240,68,56,0.2)") : "transparent",
                          borderColor: status === v ? (v === "pass" ? "var(--green)" : v === "flag" ? "var(--amber)" : "var(--red)") : "var(--border)",
                          color: status === v ? (v === "pass" ? "var(--green)" : v === "flag" ? "var(--amber)" : "var(--red)") : "var(--text3)",
                        }}>
                        {v.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, position: "sticky", top: 60 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Annual Revenue (for % penalties)</div>
            <input type="number" min="0" value={revenue} onChange={e => setRevenue(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 12, outline: "none", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text1)", marginBottom: 20 }} />

            <div style={{ textAlign: "center", marginBottom: 20, padding: "20px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Total Max Fine Exposure</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: totalExposure > 0 ? "var(--red)" : "var(--green)", fontFamily: "var(--mono)", lineHeight: 1.1 }}>
                {fmtM(totalExposure)}
              </div>
              {totalExposure > 0 && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6 }}>{fmt(totalExposure)} CAD statutory maximum</div>}
            </div>

            {failedModules.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Non-compliant ({failedModules.length})</div>
                {failedModules.map(m => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 10, color: "var(--text2)" }}>{m.label.split("—")[0].trim()}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--red)" }}>{fmtM(m.id === "pipeda" ? Math.max(m.maxFine, rev * 0.05) : m.maxFine)}</div>
                  </div>
                ))}
              </div>
            )}

            {flaggedModules.length > 0 && (
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>At risk ({flaggedModules.length})</div>
                {flaggedModules.map(m => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 10, color: "var(--text2)" }}>{m.label.split("—")[0].trim()}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)" }}>~{fmtM(m.maxFine * 0.15)}</div>
                  </div>
                ))}
              </div>
            )}

            {totalExposure === 0 && (
              <div style={{ textAlign: "center", color: "var(--text3)", fontSize: 11, padding: "10px 0" }}>
                Mark module statuses above to calculate your exposure
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
