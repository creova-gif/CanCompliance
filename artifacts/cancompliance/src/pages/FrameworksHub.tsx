import { useState } from "react";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowRight, CheckCircle2, AlertTriangle, Clock, Globe, Flag, Layers, Shield } from "lucide-react";

const FRAMEWORKS = [
  {
    group: "Canadian",
    items: [
      { id: "pipeda", name: "PIPEDA", full: "Personal Information Protection and Electronic Documents Act", region: "Canada", type: "Privacy", score: 62, status: "partial", href: "/privacy", controls: 12, key: ["Consent collection", "Data access rights", "Breach notification", "Accountability principle"] },
      { id: "casl", name: "CASL", full: "Canada's Anti-Spam Legislation", region: "Canada", type: "Marketing", score: 74, status: "partial", href: "/casl", controls: 8, key: ["Express consent", "Unsubscribe mechanism", "Sender identification", "Consent records"] },
      { id: "law25", name: "Quebec Law 25", full: "Act Respecting the Protection of Personal Information in the Private Sector", region: "Quebec", type: "Privacy", score: 48, status: "risk", href: "/privacy", controls: 14, key: ["Privacy Impact Assessment", "72-hr breach notification", "French privacy notices", "Data transfer assessment"] },
      { id: "casl-fintrac", name: "FINTRAC", full: "Financial Transactions and Reports Analysis Centre", region: "Canada", type: "AML/KYC", score: 55, status: "partial", href: "/fintrac", controls: 10, key: ["Transaction reporting", "KYC identity verification", "$10K threshold", "PCMLTFA compliance"] },
      { id: "s211", name: "S-211", full: "Fighting Against Forced Labour and Child Labour in Supply Chains Act", region: "Canada", type: "Supply Chain", score: 40, status: "risk", href: "/supply-chain", controls: 6, key: ["Annual reporting", "Due diligence steps", "Remediation plans", "Board approval"] },
      { id: "aida", name: "AIDA", full: "Artificial Intelligence and Data Act (Bill C-27)", region: "Canada", type: "AI Governance", score: 30, status: "risk", href: "/ai-governance", controls: 9, key: ["High-impact system identification", "Bias risk assessment", "Transparency obligations", "Minister notification"] },
    ],
  },
  {
    group: "Global",
    items: [
      { id: "soc2", name: "SOC 2", full: "Service Organization Control 2 (AICPA Trust Services Criteria)", region: "USA / International", type: "Security", score: 0, status: "new", href: "/soc2", controls: 61, key: ["Security (CC1–CC9)", "Availability controls", "Confidentiality", "Privacy criteria"] },
      { id: "iso27001", name: "ISO 27001", full: "Information Security Management System", region: "International", type: "Security", score: 0, status: "new", href: "/iso27001", controls: 93, key: ["Risk register", "Statement of Applicability", "Access control policy", "Incident response plan"] },
      { id: "gdpr", name: "GDPR", full: "General Data Protection Regulation (EU)", region: "European Union", type: "Privacy", score: 0, status: "new", href: "/gdpr", controls: 18, key: ["Lawful basis for processing", "Data subject rights", "DPA appointment", "72-hr breach reporting"] },
      { id: "hipaa", name: "HIPAA", full: "Health Insurance Portability and Accountability Act", region: "USA", type: "Healthcare", score: 0, status: "new", href: "/hipaa", controls: 42, key: ["PHI safeguards", "Minimum necessary rule", "BAA agreements", "Audit logs for PHI"] },
      { id: "nist-ai", name: "NIST AI RMF", full: "NIST AI Risk Management Framework (1.0)", region: "USA / International", type: "AI Governance", score: 0, status: "new", href: "/ai-governance", controls: 20, key: ["GOVERN function", "MAP risk categories", "MEASURE performance", "MANAGE & monitor"] },
      { id: "eu-ai", name: "EU AI Act", full: "Regulation on Artificial Intelligence (EU 2024/1689)", region: "European Union", type: "AI Governance", score: 0, status: "new", href: "/ai-governance", controls: 16, key: ["High-risk AI classification", "Conformity assessment", "Data governance", "Human oversight"] },
    ],
  },
];

const STATUS_CONFIG = {
  partial: { label: "IN PROGRESS", color: "#f5a623", bg: "rgba(245,166,35,0.1)", border: "rgba(245,166,35,0.25)", icon: Clock },
  risk: { label: "GAPS FOUND", color: "#f04438", bg: "rgba(240,68,56,0.08)", border: "rgba(240,68,56,0.2)", icon: AlertTriangle },
  pass: { label: "COMPLIANT", color: "#12b76a", bg: "rgba(18,183,106,0.08)", border: "rgba(18,183,106,0.2)", icon: CheckCircle2 },
  new: { label: "NOT STARTED", color: "#7F77DD", bg: "rgba(127,119,221,0.08)", border: "rgba(127,119,221,0.2)", icon: Shield },
};

const TYPE_COLORS: Record<string, string> = {
  Privacy: "#c8f135",
  Marketing: "#c8f135",
  Security: "#7F77DD",
  "AI Governance": "#f5a623",
  Healthcare: "#12b76a",
  "AML/KYC": "#f04438",
  "Supply Chain": "#f5a623",
};

export default function FrameworksHub() {
  const [activeGroup, setActiveGroup] = useState<"Canadian" | "Global">("Canadian");

  const activeFrameworks = FRAMEWORKS.find(f => f.group === activeGroup)!.items;

  const allFrameworks = FRAMEWORKS.flatMap(f => f.items);
  const avgScore = allFrameworks.filter(f => f.score > 0).reduce((s, f) => s + f.score, 0) / Math.max(1, allFrameworks.filter(f => f.score > 0).length);
  const inProgress = allFrameworks.filter(f => f.status === "partial").length;
  const withGaps = allFrameworks.filter(f => f.status === "risk").length;
  const notStarted = allFrameworks.filter(f => f.status === "new").length;

  return (
    <AppLayout title="Multi-Framework Engine" subtitle="Canadian + Global compliance coverage">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Frameworks Supported", value: "12", unit: "& growing", color: "text-primary" },
          { label: "Avg Compliance Score", value: Math.round(avgScore).toString(), unit: "/ 100", color: avgScore >= 70 ? "text-pass" : avgScore >= 50 ? "text-flag" : "text-fail" },
          { label: "Frameworks Active", value: (inProgress + withGaps).toString(), unit: "in use", color: "text-foreground" },
          { label: "Action Required", value: (withGaps).toString(), unit: "frameworks", color: "text-fail" },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5">
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">{m.label}</div>
            <div className={`text-3xl font-semibold leading-none mb-1 ${m.color}`}>{m.value}</div>
            <div className="text-[11px] text-muted-foreground">{m.unit}</div>
          </div>
        ))}
      </div>

      {/* Tab switch */}
      <div className="flex items-center gap-2 mb-5">
        {(["Canadian", "Global"] as const).map(g => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors"
            style={activeGroup === g
              ? { background: "#c8f135", color: "#09090a" }
              : { background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
          >
            {g === "Canadian" ? <Flag size={12} /> : <Globe size={12} />}
            {g} Frameworks
          </button>
        ))}
        <div className="ml-auto font-mono text-[10px] text-muted-foreground">
          <Layers size={11} className="inline mr-1.5" />
          Cross-framework control mapping active
        </div>
      </div>

      {/* Framework Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {activeFrameworks.map(fw => {
          const sc = STATUS_CONFIG[fw.status as keyof typeof STATUS_CONFIG];
          const StatusIcon = sc.icon;
          const typeColor = TYPE_COLORS[fw.type] ?? "#c8f135";
          return (
            <Link key={fw.id} href={fw.href}>
              <div
                data-testid={`framework-${fw.id}`}
                className="bg-card border rounded-xl p-5 cursor-pointer hover:border-primary/40 transition-all group"
                style={{ borderColor: sc.border }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[18px] font-bold text-foreground leading-tight">{fw.name}</div>
                    <div className="font-mono text-[9px] mt-0.5" style={{ color: typeColor }}>{fw.type.toUpperCase()} · {fw.region}</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-widest flex-shrink-0"
                    style={{ color: sc.color, background: sc.bg }}>
                    <StatusIcon size={9} />
                    {sc.label}
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground mb-4 leading-relaxed">{fw.full}</div>

                {/* Progress bar (only if started) */}
                {fw.score > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-muted-foreground">COMPLIANCE</span>
                      <span className="font-mono text-[11px]" style={{ color: sc.color }}>{fw.score}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${fw.score}%`, background: sc.color }} />
                    </div>
                  </div>
                )}

                {/* Key requirements */}
                <div className="space-y-1 mb-4">
                  {fw.key.map(k => (
                    <div key={k} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: typeColor }} />
                      {k}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-mono text-[9px] text-muted-foreground">{fw.controls} controls</span>
                  <ArrowRight size={13} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Control overlap banner */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(200,241,53,0.1)" }}>
            <Layers size={14} style={{ color: "#c8f135" }} />
          </div>
          <div>
            <div className="text-[13px] font-medium text-foreground">Cross-Framework Control Mapping</div>
            <div className="text-[11px] text-muted-foreground">Controls shared across multiple frameworks — audit once, satisfy many</div>
          </div>
          <Link href="/control-library">
            <button className="ml-auto text-[11px] font-mono text-primary hover:underline flex items-center gap-1">
              View Control Library <ArrowRight size={11} />
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Access Control", overlap: ["SOC 2 CC6", "ISO A.9", "HIPAA §164.312", "PIPEDA Prin. 7"], color: "#7F77DD" },
            { name: "Breach Notification", overlap: ["PIPEDA s.10.1", "Law 25 Art. 3.5", "GDPR Art. 33", "HIPAA §164.404"], color: "#f04438" },
            { name: "Data Encryption", overlap: ["SOC 2 CC6.7", "ISO A.10", "HIPAA §164.312(e)", "GDPR Art. 32"], color: "#c8f135" },
            { name: "Audit Logging", overlap: ["SOC 2 CC7", "ISO A.12.4", "CASL s.13", "FINTRAC s.24"], color: "#12b76a" },
          ].map(c => (
            <div key={c.name} className="bg-muted/40 rounded-lg p-3">
              <div className="text-[11px] font-medium text-foreground mb-2">{c.name}</div>
              <div className="space-y-1">
                {c.overlap.map(o => (
                  <div key={o} className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                    style={{ color: c.color, background: `${c.color}15` }}>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
