import { useState, useEffect } from "react";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowRight, Flame, Gavel, Calculator, BarChart3, Lightbulb, ScanLine, Inbox, Share2, Scale, ClipboardCheck, Building2, Layers, Shield } from "lucide-react";
import { useUser } from "@clerk/react";
import { getDemoRole } from "@/lib/demoSession";

const DIGEST_UPDATES = [
  { module: "EMPLOYMENT", headline: "Ontario minimum wage increases to $17.20/hr effective Oct 2024", href: "/employment" },
  { module: "PIPEDA", headline: "Quebec Law 25 (Law 25) PIA requirements now in force — assess your data practices", href: "/privacy" },
  { module: "CASL", headline: "CRTC enforcement: $200K fine issued to Toronto retailer for missing unsubscribe", href: "/casl" },
  { module: "CARM", headline: "CARM Phase 2 deadline extended — update your customs broker authorization", href: "/customs" },
  { module: "EMPLOYMENT", headline: "BC harassment and violence prevention requirements updated — review your policy", href: "/employment" },
  { module: "AI LAW", headline: "Canada's proposed AI hiring law: disclosure requirements for automated screening", href: "/ai-governance" },
  { module: "S-211", headline: "Supply chain reporting: S-211 (Modern Slavery Act) deadline May 31 for fiscal-year reporters", href: "/supply-chain" },
];

const RECENT_CHECKS = [
  { module: "CASL", status: "fail", statute: "CASL S.11(1)", date: "Today, 9:14 AM" },
  { module: "PIPEDA", status: "flag", statute: "PIPEDA S.5, Principle 8", date: "Today, 9:02 AM" },
  { module: "CASL", status: "pass", statute: "CASL S.6(1)", date: "Yesterday, 4:30 PM" },
  { module: "Bill 96", status: "fail", statute: "Bill 96 S.22", date: "Yesterday, 2:15 PM" },
  { module: "Employment", status: "flag", statute: "ESA 2000 S.21", date: "Apr 7, 11:00 AM" },
];

const STATUS_CONFIG = {
  pass: { label: "PASS", class: "bg-pass/10 text-pass border border-pass/20" },
  fail: { label: "FAIL", class: "bg-fail/10 text-fail border border-fail/20" },
  flag: { label: "FLAG", class: "bg-flag/10 text-flag border border-flag/20" },
  block: { label: "BLOCK", class: "bg-fail/10 text-block border border-fail/30" },
};

const ROLE_CONFIG: Record<string, {
  Icon: any;
  color: string;
  bg: string;
  border: string;
  welcome: string;
  subtitle: string;
  pinnedLabel: string;
  pinned: { label: string; href: string; badge?: string }[];
}> = {
  "Compliance Officer": {
    Icon: Scale,
    color: "#c8f135",
    bg: "rgba(200,241,53,0.06)",
    border: "rgba(200,241,53,0.2)",
    welcome: "Compliance Officer view",
    subtitle: "Full platform — all 14 modules, AI Copilot, score engine, policy generator",
    pinnedLabel: "Your pinned tools",
    pinned: [
      { label: "AI Copilot", href: "/copilot", badge: "AI" },
      { label: "Compliance Score", href: "/compliance-score" },
      { label: "Policy Generator", href: "/policy-generator", badge: "NEW" },
      { label: "Audit Trail", href: "/audit-trail" },
      { label: "CASL check", href: "/casl" },
    ],
  },
  "Auditor": {
    Icon: ClipboardCheck,
    color: "#12b76a",
    bg: "rgba(18,183,106,0.06)",
    border: "rgba(18,183,106,0.2)",
    welcome: "Auditor view",
    subtitle: "Audit trail, control mapper, document scanner, remediation planner",
    pinnedLabel: "Your audit tools",
    pinned: [
      { label: "Audit Trail", href: "/audit-trail" },
      { label: "Control Mapper", href: "/control-mapper" },
      { label: "Document Scanner", href: "/document-scanner", badge: "AI" },
      { label: "Benchmarking", href: "/benchmarking" },
      { label: "Compliance Score", href: "/compliance-score" },
    ],
  },
  "Business Owner": {
    Icon: Building2,
    color: "#f5a623",
    bg: "rgba(245,166,35,0.06)",
    border: "rgba(245,166,35,0.2)",
    welcome: "Business Owner view",
    subtitle: "Quick compliance scan, jurisdiction setup, CASL ledger, deadlines",
    pinnedLabel: "Your key actions",
    pinned: [
      { label: "CASL Ledger", href: "/casl-ledger" },
      { label: "Jurisdiction Setup", href: "/jurisdiction" },
      { label: "Deadlines", href: "/deadlines" },
      { label: "Red Tape Calculator", href: "/red-tape-calculator" },
      { label: "Run CASL check", href: "/casl" },
    ],
  },
};

const DEFAULT_QUICK_ACTIONS = [
  { label: "Run CASL check", href: "/casl" },
  { label: "Check PIPEDA compliance", href: "/pipeda" },
  { label: "Quebec Bill 96 review", href: "/bill96" },
  { label: "Ask AI Copilot", href: "/copilot" },
  { label: "View compliance score", href: "/compliance-score" },
];

export default function Dashboard() {
  const [digest] = useState(() => DIGEST_UPDATES[Math.floor(Math.random() * DIGEST_UPDATES.length)]);
  const [streak] = useState(3);
  const today = new Date().getDay();
  const { user } = useUser();
  const role = getDemoRole() ?? (user?.unsafeMetadata?.role as string) ?? "";
  const roleConfig = ROLE_CONFIG[role] ?? null;

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById("paywall-notification");
      if (el) el.style.display = "flex";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const quickActions = roleConfig ? roleConfig.pinned : DEFAULT_QUICK_ACTIONS;

  return (
    <AppLayout title="Dashboard" subtitle={roleConfig ? roleConfig.welcome : "Overview"}>
      {/* Role welcome banner */}
      {roleConfig && (
        <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border mb-5"
          style={{ borderColor: roleConfig.border, background: roleConfig.bg }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: roleConfig.border }}>
            <roleConfig.Icon size={14} style={{ color: roleConfig.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold" style={{ color: roleConfig.color }}>
              {roleConfig.welcome}
            </div>
            <div className="text-[11px] text-muted-foreground">{roleConfig.subtitle}</div>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded border flex-shrink-0 uppercase tracking-widest"
            style={{ color: roleConfig.color, borderColor: roleConfig.border, background: "transparent" }}>
            {role.toUpperCase()}
          </span>
        </div>
      )}

      {/* Daily Digest Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 flex items-center gap-4 mb-7">
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-widest flex-shrink-0">
          {digest.module}
        </span>
        <span className="text-[13px] text-foreground flex-1">{digest.headline}</span>
        <Link href={digest.href}>
          <span className="text-[12px] text-primary hover:underline font-mono flex items-center gap-1 flex-shrink-0 cursor-pointer">
            View Module <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Compliance Score", value: "62", unit: "/100", color: "text-flag" },
          { label: "Checks Run", value: "12", unit: "this month", color: "text-foreground" },
          { label: "Issues Found", value: "4", unit: "unresolved", color: "text-fail" },
          { label: "Streak", value: streak.toString(), unit: "days", color: "text-primary" },
        ].map((m) => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5">
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">{m.label}</div>
            <div className={`text-3xl font-semibold ${m.color} leading-none mb-1`}>{m.value}</div>
            <div className="text-[11px] text-muted-foreground">{m.unit}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Recent Checks Table */}
        <div className="col-span-3 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium text-foreground">Recent Checks</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">Last 5 compliance runs</div>
            </div>
            <Link href="/casl">
              <button data-testid="btn-run-check" className="px-3 py-1.5 rounded-lg text-[12px] border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                Run check
              </button>
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-5 py-2.5">Module</th>
                <th className="text-left font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-5 py-2.5">Status</th>
                <th className="text-left font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-5 py-2.5">Statute</th>
                <th className="text-left font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-5 py-2.5">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_CHECKS.map((check, i) => {
                const s = STATUS_CONFIG[check.status as keyof typeof STATUS_CONFIG];
                return (
                  <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-[12px] text-foreground">{check.module}</td>
                    <td className="px-5 py-3">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${s.class}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{check.statute}</td>
                    <td className="px-5 py-3 text-[11px] text-muted-foreground">{check.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right panel */}
        <div className="col-span-2 space-y-4">
          {/* Streak tracker */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-flag" />
              <div className="text-[13px] font-medium text-foreground">Compliance Streak</div>
              <div className="ml-auto font-mono text-[11px] text-flag">{streak} days</div>
            </div>
            <div className="flex gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                const isActive = i < streak;
                const isToday = i === (today === 0 ? 6 : today - 1);
                return (
                  <div key={i} className="flex-1 text-center">
                    <div className={`w-full h-8 rounded-lg mb-1 transition-all ${
                      isActive ? "bg-primary" : "bg-muted"
                    } ${isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-card" : ""}`} />
                    <div className="font-mono text-[9px] text-muted-foreground">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card border border-border rounded-xl p-5"
            style={roleConfig ? { borderColor: roleConfig.border } : undefined}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] font-medium text-foreground">
                {roleConfig ? roleConfig.pinnedLabel : "Quick Actions"}
              </div>
              {roleConfig && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest"
                  style={{ color: roleConfig.color, background: roleConfig.bg }}>
                  Personalized
                </span>
              )}
            </div>
            <div className="space-y-2">
              {quickActions.map((a) => (
                <Link key={a.label} href={a.href}>
                  <div
                    data-testid={`quick-action-${a.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span className="text-[12px] text-muted-foreground hover:text-foreground">{a.label}</span>
                    <div className="flex items-center gap-2">
                      {"badge" in a && a.badge && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                          style={{ background: a.badge === "AI" ? "rgba(127,119,221,0.15)" : "rgba(200,241,53,0.1)", color: a.badge === "AI" ? "#7F77DD" : "#c8f135" }}>
                          {a.badge}
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence section */}
      <div className="mt-7">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Intelligence Tools — New</div>
        <div className="grid grid-cols-7 gap-3">
          {[
            { icon: Inbox, label: "Compliance Inbox", sub: "Today's regulatory updates", href: "/compliance-inbox", badge: "8 NEW" },
            { icon: Gavel, label: "Legislation Tracker", sub: "12 bills in progress", href: "/legislation-tracker", badge: "CRITICAL" },
            { icon: Calculator, label: "Red Tape Calc", sub: "Quantify your cost", href: "/red-tape-calculator", badge: null },
            { icon: ScanLine, label: "Document Scanner", sub: "Claude audits contracts", href: "/document-scanner", badge: "AI" },
            { icon: BarChart3, label: "Benchmarking", sub: "Compare to your sector", href: "/benchmarking", badge: null },
            { icon: Lightbulb, label: "Gov. Programs", sub: "Funding & sandboxes", href: "/sandbox-advisor", badge: "$3.8M" },
            { icon: Share2, label: "Trust Network", sub: "Supplier compliance proofs", href: "/trust-network", badge: null },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <div
                data-testid={`intelligence-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {item.badge && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: item.badge === "AI" ? "#7F77DD20" : item.badge === "CRITICAL" ? "#f0443820" : "#c8f13520", color: item.badge === "AI" ? "#7F77DD" : item.badge === "CRITICAL" ? "#f04438" : "#c8f135" }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-medium text-foreground mb-0.5">{item.label}</div>
                <div className="text-[10px] text-muted-foreground">{item.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Risk Heat Map */}
      <div className="mt-7">
        <div className="flex items-center justify-between mb-3">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Risk Heat Map — By Category</div>
          <Link href="/frameworks">
            <span className="font-mono text-[10px] text-primary hover:underline flex items-center gap-1">
              <Layers size={10} /> Multi-Framework View
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {[
            { name: "Privacy", detail: "PIPEDA · Law 25 · GDPR", score: 62, risk: "medium", href: "/privacy", color: "#c8f135" },
            { name: "Cybersecurity", detail: "SOC 2 · ISO 27001", score: 0, risk: "high", href: "/soc2", color: "#7F77DD" },
            { name: "Employment", detail: "ESA · Pay Equity · OHS", score: 74, risk: "low", href: "/employment", color: "#12b76a" },
            { name: "Marketing", detail: "CASL · Consent Records", score: 70, risk: "low", href: "/casl-ledger", color: "#12b76a" },
            { name: "AI Governance", detail: "AIDA · NIST RMF · EU AI Act", score: 30, risk: "high", href: "/ai-governance", color: "#f04438" },
            { name: "Trade & Tax", detail: "CBSA · FINTRAC · GST", score: 55, risk: "medium", href: "/customs", color: "#f5a623" },
          ].map(r => {
            const riskBg = r.risk === "high" ? "rgba(240,68,56,0.07)" : r.risk === "medium" ? "rgba(245,166,35,0.06)" : "rgba(18,183,106,0.06)";
            const riskBorder = r.risk === "high" ? "rgba(240,68,56,0.22)" : r.risk === "medium" ? "rgba(245,166,35,0.2)" : "rgba(18,183,106,0.2)";
            return (
              <Link key={r.name} href={r.href}>
                <div className="rounded-xl p-4 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: riskBg, border: `1px solid ${riskBorder}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[8px] uppercase tracking-widest"
                      style={{ color: r.risk === "high" ? "#f04438" : r.risk === "medium" ? "#f5a623" : "#12b76a" }}>
                      {r.risk.toUpperCase()} RISK
                    </span>
                    <Shield size={12} style={{ color: r.risk === "high" ? "#f04438" : r.risk === "medium" ? "#f5a623" : "#12b76a" }} />
                  </div>
                  <div className="text-[13px] font-semibold text-foreground mb-0.5">{r.name}</div>
                  <div className="text-[9px] text-muted-foreground mb-3">{r.detail}</div>
                  {r.score > 0 ? (
                    <>
                      <div className="h-1 bg-muted rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.color }} />
                      </div>
                      <div className="font-mono text-[10px]" style={{ color: r.color }}>{r.score}%</div>
                    </>
                  ) : (
                    <div className="font-mono text-[9px] text-muted-foreground">Not assessed</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Paywall notification */}
      <div
        id="paywall-notification"
        data-testid="paywall-notification"
        style={{ display: "none" }}
        className="fixed bottom-5 right-5 z-50 bg-card border border-primary/30 rounded-xl px-5 py-4 max-w-xs shadow-2xl flex items-start gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-[13px] font-medium text-foreground mb-1">3 free checks used</div>
          <div className="text-[12px] text-muted-foreground mb-3">Upgrade to see your full remediation plan.</div>
          <Link href="/pricing">
            <button className="text-[12px] text-primary font-medium hover:underline">Upgrade now →</button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
