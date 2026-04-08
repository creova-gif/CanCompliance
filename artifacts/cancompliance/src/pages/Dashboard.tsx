import { useState, useEffect } from "react";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowRight, Flame } from "lucide-react";

const DIGEST_UPDATES = [
  { module: "EMPLOYMENT", headline: "Ontario minimum wage increases to $17.20/hr effective Oct 2024", href: "/casl" },
  { module: "PIPEDA", headline: "Quebec Law 25 (Law 25) PIA requirements now in force — assess your data practices", href: "/pipeda" },
  { module: "CASL", headline: "CRTC enforcement: $200K fine issued to Toronto retailer for missing unsubscribe", href: "/casl" },
  { module: "CARM", headline: "CARM Phase 2 deadline extended — update your customs broker authorization", href: "/casl" },
  { module: "EMPLOYMENT", headline: "BC harassment and violence prevention requirements updated — review your policy", href: "/casl" },
  { module: "AI LAW", headline: "Canada's proposed AI hiring law: disclosure requirements for automated screening", href: "/casl" },
  { module: "S-211", headline: "Supply chain reporting: S-211 (Modern Slavery Act) deadline May 31 for fiscal-year reporters", href: "/casl" },
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

export default function Dashboard() {
  const [digest] = useState(() => DIGEST_UPDATES[Math.floor(Math.random() * DIGEST_UPDATES.length)]);
  const [streak] = useState(3);
  const today = new Date().getDay();

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById("paywall-notification");
      if (el) el.style.display = "flex";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout title="Dashboard" subtitle="Overview">
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
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[13px] font-medium text-foreground mb-4">Quick Actions</div>
            <div className="space-y-2">
              {[
                { label: "Run CASL check", href: "/casl" },
                { label: "Check PIPEDA compliance", href: "/pipeda" },
                { label: "Quebec Bill 96 review", href: "/bill96" },
                { label: "Ask AI Copilot", href: "/ai-copilot" },
                { label: "View compliance score", href: "/compliance-score" },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <div
                    data-testid={`quick-action-${a.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span className="text-[12px] text-muted-foreground hover:text-foreground">{a.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
