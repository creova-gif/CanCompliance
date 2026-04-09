import { X, AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAudit } from "../context/AuditContext";

interface Alert {
  id: string;
  type: "critical" | "high" | "medium";
  title: string;
  body: string;
  statute: string;
  action: string;
}

export default function PredictiveAlerts() {
  const { currentJurisdiction, auditLog, caslRecords } = useAudit();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const now = new Date();
  const currentYear = now.getFullYear();

  const allAlerts: Alert[] = [];

  // Alert 1: Bill C-12 — always fires (March 26, 2026 is in the past)
  allAlerts.push({
    id: "c12",
    type: "critical",
    title: "Bill C-12 IN FORCE — FINTRAC compliance program standard changed",
    body: `Effective March 26, 2026, FINTRAC can now challenge your compliance program's effectiveness even if specific rules are met. The new "reasonably designed, risk-based and effective" standard applies. Maximum penalty increased 40× to $20M or 3% of global revenue.`,
    statute: "PCMLTFA S.9.6 (amended by C-12) · Effective March 26, 2026",
    action: "Review your FINTRAC compliance program against the new effectiveness standard before your next FINTRAC examination.",
  });

  // Alert 2: CRTC enforcement surge — fires if any CASL checks run with fails
  const caslFails = auditLog.filter(e => e.module === "CASL" && (e.result === "FAIL" || e.result === "FLAG"));
  if (caslFails.length > 0) {
    allAlerts.push({
      id: "crtc_surge",
      type: "high",
      title: "CRTC enforcement surge detected — your CASL failures are high-risk",
      body: `CRTC issued 4 CASL enforcement fines in January–February 2026. Top trigger: implied consent expiry and unsubscribe mechanism failures. You have ${caslFails.length} CASL flag(s)/failure(s) in your audit trail that match current enforcement patterns.`,
      statute: "CASL S.6–11 · CRTC Enforcement Bulletin 2026-Q1",
      action: "Prioritize CASL remediation — specifically unsubscribe mechanisms and implied consent expiry tracking.",
    });
  }

  // Alert 3: Quebec CAI joint audits — fires if jurisdiction is Quebec
  if (currentJurisdiction?.includes("Quebec") || currentJurisdiction?.includes("QC")) {
    allAlerts.push({
      id: "qc_cai",
      type: "high",
      title: "Quebec CAI conducting joint audits with CRTC — dual compliance required",
      body: "The Commission d'accès à l'information (CAI) is running joint audits with the CRTC targeting Law 25 and CASL cross-compliance in Quebec. Quebec businesses are exposed to both federal CASL fines and provincial Law 25 fines simultaneously.",
      statute: "Law 25 (Bill 64) · CASL · CAI Joint Audit Program 2026",
      action: "Ensure both your CASL consent records AND your Law 25 Privacy Impact Assessment (PIA) are current and documented.",
    });
  }

  // Alert 4: Ontario AI hiring law — fires in 2026
  if (currentYear >= 2026) {
    const aiGovernanceFails = auditLog.filter(e => e.module === "AI Governance" || e.module === "AI Gov.");
    if (aiGovernanceFails.length > 0 || currentJurisdiction?.includes("Ontario")) {
      allAlerts.push({
        id: "on_ai_hiring",
        type: "medium",
        title: "Ontario AI hiring tool disclosure required in 2026",
        body: "Ontario's Workers for Workers Act IV requires disclosure when AI tools are used in the hiring process. If you use AI for resume screening, interviews, or hiring decisions in Ontario, you must disclose this to candidates.",
        statute: "Workers for Workers Act IV S.8.4 · Ontario ESA (2026 amendment)",
        action: "Audit your hiring process for any AI tool usage and add required disclosure to job postings and application forms.",
      });
    }
  }

  // Alert 5: CASL implied consent expiry — fires if ledger has near-expiry records
  const expiringRecords = caslRecords.filter(r => {
    if (!r.expiresAt || r.unsubscribed) return false;
    const expiry = new Date(r.expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 60;
  });
  if (expiringRecords.length > 0) {
    allAlerts.push({
      id: "casl_expiry",
      type: "medium",
      title: `${expiringRecords.length} CASL implied consent record(s) expiring within 60 days`,
      body: `CRTC's top enforcement trigger in 2026 is sending emails to contacts whose implied consent has expired. ${expiringRecords.length} record(s) in your ledger expire within 60 days. Implied business relationship consent expires 2 years from the last transaction (CASL S.10(9)(a)).`,
      statute: "CASL S.10(9) · CRTC Implied Consent Guidance 2024",
      action: "Contact expiring-consent subscribers now to re-obtain express consent before expiry. Do not send CEMs after expiry.",
    });
  }

  const visible = allAlerts.filter(a => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  const COLORS: Record<string, { bg: string; border: string; icon: string; label: string }> = {
    critical: { bg: "rgba(240,68,56,0.07)", border: "rgba(240,68,56,0.25)", icon: "#f04438", label: "CRITICAL ALERT" },
    high: { bg: "rgba(245,166,35,0.07)", border: "rgba(245,166,35,0.2)", icon: "#f5a623", label: "HIGH RISK" },
    medium: { bg: "rgba(200,241,53,0.05)", border: "rgba(200,241,53,0.15)", icon: "#c8f135", label: "ACTION NEEDED" },
  };

  return (
    <div className="space-y-2 mb-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: "#c8f135" }} />
        <TrendingUp className="w-3 h-3" style={{ color: "#c8f135" }} />
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">System 2 — Predictive Compliance Alert Engine · {visible.length} alert{visible.length !== 1 ? "s" : ""} active</span>
      </div>
      {visible.map((alert, i) => {
        const cfg = COLORS[alert.type];
        return (
          <div key={alert.id} className="alert-animate rounded-xl p-4 relative card-hover" style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, animationDelay: `${i * 0.08}s` }}>
            <button
              onClick={() => setDismissed(p => new Set([...p, alert.id]))}
              className="absolute top-3 right-3 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: cfg.icon }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[8px] font-bold" style={{ color: cfg.icon }}>{cfg.label}</span>
                </div>
                <div className="text-[12px] font-semibold text-foreground mb-1.5">{alert.title}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed mb-2">{alert.body}</div>
                <div className="font-mono text-[9px] text-muted-foreground/60 mb-2">{alert.statute}</div>
                <div className="flex items-start gap-1.5">
                  <Zap className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: cfg.icon }} />
                  <span className="text-[11px] font-medium leading-relaxed" style={{ color: cfg.icon }}>{alert.action}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
