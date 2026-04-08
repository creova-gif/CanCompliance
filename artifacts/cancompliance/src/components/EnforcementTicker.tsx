import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const ENFORCEMENT_ITEMS = [
  { label: "FINTRAC", text: "$176.9M penalty — largest in Canadian history — virtual currency business (Oct 2025)", urgency: "high" },
  { label: "CASL", text: "$1.1M fine — commercial electronic messages — CRTC enforcement surge continues (Jan 2026)", urgency: "high" },
  { label: "FINTRAC C-12", text: "Bill C-12 IN FORCE Mar 26, 2026 — new 'effectiveness' standard — penalty up to $20M or 3% global revenue", urgency: "critical" },
  { label: "WorkSafeBC", text: "First enforcement orders under psychological safety obligation — BC mandatory Sept 2025", urgency: "medium" },
  { label: "Quebec CAI", text: "Joint audits with CRTC targeting Law 25 + CASL cross-compliance — Quebec businesses now in scope", urgency: "medium" },
  { label: "CPPA", text: "Consumer Privacy Protection Act — Third Reading passed — expected in force 2025/2026", urgency: "medium" },
  { label: "CRTC", text: "4 CASL enforcement fines issued January–February 2026 — implied consent expiry the top trigger", urgency: "high" },
  { label: "Ontario Pay", text: "Pay Transparency Act enforcement begins — $50,000+ salary ranges required in job postings", urgency: "medium" },
  { label: "CBSA CARM", text: "Phase 3 importer bond requirements — RPP bonds now mandatory — non-registered importers seized", urgency: "medium" },
  { label: "OSFI", text: "New AI risk management guidelines for financial entities — automated decision audit requirements", urgency: "medium" },
];

const URGENCY_COLORS: Record<string, string> = {
  critical: "#f04438",
  high: "#f5a623",
  medium: "#c8f135",
};

export default function EnforcementTicker() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="flex items-center gap-0 overflow-hidden flex-shrink-0 relative"
      style={{ background: "#0d0d0f", borderBottom: "1px solid rgba(240,68,56,0.15)", height: 28 }}
    >
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 h-full z-10"
        style={{ background: "#f0443818", borderRight: "1px solid rgba(240,68,56,0.2)" }}
      >
        <AlertTriangle className="w-3 h-3" style={{ color: "#f04438" }} />
        <span className="font-mono text-[9px] uppercase tracking-widest font-bold" style={{ color: "#f04438" }}>LIVE ENFORCEMENT</span>
      </div>

      <div className="overflow-hidden flex-1">
        <div
          className="flex items-center gap-0 whitespace-nowrap"
          style={{ animation: "ticker-scroll 80s linear infinite" }}
        >
          {[...ENFORCEMENT_ITEMS, ...ENFORCEMENT_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-5 h-7">
              <span
                className="font-mono text-[8.5px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: URGENCY_COLORS[item.urgency] + "20", color: URGENCY_COLORS[item.urgency] }}
              >
                {item.label}
              </span>
              <span className="text-[11px] text-muted-foreground">{item.text}</span>
              <span className="text-muted-foreground/20 ml-3">·</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="flex-shrink-0 px-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors text-[10px] font-mono"
      >
        ×
      </button>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
