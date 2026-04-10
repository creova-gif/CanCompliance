import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShieldCheck, Globe, Search, Leaf, Network,
  DollarSign, Receipt, Users, Lock, HardHat, Package, Brain,
  Recycle, Mail, Target, FileText, Clock, MapPin, Bot,
  TrendingUp, BookOpen, LogOut, UserCircle, Shield,
  Calculator, Gavel, ScanLine, BarChart3, Lightbulb, Inbox, Share2, Wand2, FlaskConical,
  Layers, Heart, Megaphone, Languages, Fingerprint, Code2,
  ShieldAlert, Accessibility, Building, Monitor, Scale, CheckSquare, AlertTriangle,
  ClipboardCheck, Upload, Coffee, CandlestickChart, BadgeDollarSign, Zap, Network as NetworkIcon
} from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { useUser, useClerk } from "@clerk/react";
import EnforcementTicker from "./EnforcementTicker";
import PredictiveAlerts from "./PredictiveAlerts";
import { getDemoRole, getDemoUser, clearDemoRole } from "@/lib/demoSession";

const MODULES = [
  { href: "/casl", label: "CASL", sub: "Anti-Spam Checker", icon: Megaphone },
  { href: "/pipeda", label: "PIPEDA", sub: "Privacy Checker", icon: Fingerprint },
  { href: "/bill96", label: "Bill 96", sub: "Quebec French Law", icon: Languages },
  { href: "/ccpsa", label: "CCPSA", sub: "Product Safety", icon: ShieldCheck },
  { href: "/cpla", label: "CPLA", sub: "Packaging / Bilingualism", icon: Globe },
  { href: "/fintrac", label: "FINTRAC", sub: "AML / KYC", icon: Search },
  { href: "/esg", label: "ESG", sub: "Greenwashing", icon: Leaf },
  { href: "/supply-chain", label: "S-211", sub: "Supply Chain", icon: Network },
  { href: "/payroll", label: "Payroll", sub: "CPP / EI / Tax", icon: DollarSign },
  { href: "/gst-hst", label: "GST / HST", sub: "Tax Filing", icon: Receipt },
  { href: "/employment", label: "Employment", sub: "Standards", icon: Users },
  { href: "/privacy", label: "Privacy", sub: "PIPEDA / Law 25", icon: Lock },
  { href: "/safety", label: "Safety", sub: "OHS", icon: HardHat },
  { href: "/customs", label: "Customs", sub: "CBSA / CARM", icon: Package },
  { href: "/ai-governance", label: "AI Gov.", sub: "AIDA / Workers IV", icon: Brain },
  { href: "/epr", label: "EPR", sub: "Environmental", icon: Recycle },
  { href: "/cppa", label: "CPPA", sub: "Bill C-27 Privacy", icon: ShieldAlert, badge: "NEW" },
  { href: "/aoda", label: "AODA", sub: "Accessibility", icon: Users },
  { href: "/beneficial-ownership", label: "Beneficial Owner.", sub: "CBCA Registry", icon: Building, badge: "NEW" },
  { href: "/digital-platform", label: "Digital Platform", sub: "CRA DAC-7", icon: Monitor, badge: "NEW" },
  { href: "/pay-equity", label: "Pay Equity", sub: "Multi-Province", icon: Scale },
];

const OFFICER_TOOLS = [
  { href: "/policy-attestation", label: "Policy Attestation", icon: CheckSquare, badge: "NEW" },
  { href: "/vendor-risk", label: "Vendor Risk", icon: AlertTriangle, badge: "NEW" },
  { href: "/board-report", label: "Board Report", icon: BarChart3, badge: "NEW" },
];

const AUDITOR_TOOLS = [
  { href: "/finding-tracker", label: "Finding Tracker", icon: ClipboardCheck, badge: "NEW" },
  { href: "/evidence-portal", label: "Evidence Portal", icon: Upload, badge: "NEW" },
];

const OWNER_TOOLS = [
  { href: "/industry-pack", label: "Industry Pack", icon: Coffee, badge: "NEW" },
  { href: "/fine-exposure", label: "Fine Exposure", icon: BadgeDollarSign, badge: "NEW" },
  { href: "/scale-advisor", label: "Scale Advisor", icon: TrendingUp, badge: "NEW" },
  { href: "/grant-finder", label: "Grant Finder", icon: Lightbulb, badge: "NEW" },
];

const TOOLS = [
  { href: "/casl-ledger", label: "CASL Ledger", icon: Mail },
  { href: "/compliance-score", label: "Score Engine", icon: Target },
  { href: "/audit-trail", label: "Audit Trail", icon: FileText },
  { href: "/deadlines", label: "Deadlines", icon: Clock },
  { href: "/jurisdiction", label: "Jurisdiction", icon: MapPin },
  { href: "/control-mapper", label: "Control Mapper", icon: BookOpen },
  { href: "/copilot", label: "AI Copilot", icon: Bot, badge: "AI" },
  { href: "/document-scanner", label: "Doc Scanner", icon: ScanLine, badge: "AI" },
  { href: "/policy-generator", label: "Policy Gen.", icon: Wand2, badge: "NEW" },
  { href: "/growth", label: "Growth Tools", icon: TrendingUp },
  { href: "/developer", label: "API Portal", icon: Code2, badge: "NEW" },
];

const INTELLIGENCE = [
  { href: "/compliance-inbox", label: "Inbox", icon: Inbox, sub: "Regulatory updates", badge: "8" },
  { href: "/legislation-tracker", label: "Legislation", icon: Gavel, sub: "Bills in progress" },
  { href: "/red-tape-calculator", label: "Red Tape Calc", icon: Calculator, sub: "Compliance cost" },
  { href: "/benchmarking", label: "Benchmarking", icon: BarChart3, sub: "Sector compare" },
  { href: "/sandbox-advisor", label: "Gov. Programs", icon: Lightbulb, sub: "Grants & sandboxes" },
  { href: "/trust-network", label: "Trust Network", icon: Share2, sub: "Supplier proofs" },
];

const GLOBAL_FRAMEWORKS = [
  { href: "/frameworks", label: "Frameworks Hub", sub: "All 13 frameworks", icon: Layers, badge: "13" },
  { href: "/control-library", label: "Control Library", sub: "50 universal controls", icon: BookOpen },
  { href: "/soc2", label: "SOC 2", sub: "Trust Services Criteria", icon: Shield },
  { href: "/iso27001", label: "ISO 27001", sub: "ISMS", icon: ShieldCheck },
  { href: "/gdpr", label: "GDPR", sub: "EU Data Protection", icon: Globe },
  { href: "/hipaa", label: "HIPAA", sub: "Health Data (PHI)", icon: Heart },
  { href: "/nist-ai-rmf", label: "NIST AI RMF", sub: "AI Risk Framework", icon: Brain },
  { href: "/eu-ai-act", label: "EU AI Act", sub: "Regulation (EU) 2024/1689", icon: Globe },
];

function NavItem({ href, label, sub, icon: Icon, badge }: { href: string; label: string; sub?: string; icon: any; badge?: string }) {
  const [location] = useLocation();
  const isActive = location === href;
  return (
    <Link href={href}>
      <div
        data-testid={`nav-${label.toLowerCase().replace(/[\s/.]+/g, "-")}`}
        className={cn(
          "sidebar-nav-item flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer text-[12px] border",
          "transition-all duration-150 ease-out",
          "hover:translate-x-0.5",
          isActive
            ? "bg-muted text-foreground border-border nav-active-glow"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border-transparent"
        )}
      >
        <div className={cn(
          "w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200",
          isActive ? "bg-primary scale-125 shadow-[0_0_4px_rgba(200,241,53,0.6)]" : "bg-muted-foreground/20"
        )} />
        <Icon className={cn("w-3 h-3 flex-shrink-0 transition-all duration-150", isActive ? "text-primary" : "")} />
        <span className="font-medium truncate">{label}</span>
        {badge && <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary flex-shrink-0">{badge}</span>}
      </div>
    </Link>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  const { metrics, computeScore } = useAudit();
  const score = computeScore();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  // Demo session takes precedence over Clerk user
  const demoUser = getDemoUser();
  const isDemoMode = !!demoUser;
  const demoRole = getDemoRole();

  const email = demoUser?.email ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const displayName = demoUser?.displayName ?? user?.firstName ?? email.split("@")[0] ?? "Account";
  const initials = demoUser?.initials ?? displayName.slice(0, 1).toUpperCase();
  const userRole = demoRole ?? (user?.unsafeMetadata?.role as string) ?? "";

  const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
    "Compliance Officer": { color: "#c8f135", bg: "rgba(200,241,53,0.1)" },
    "Auditor": { color: "#12b76a", bg: "rgba(18,183,106,0.1)" },
    "Business Owner": { color: "#f5a623", bg: "rgba(245,166,35,0.1)" },
  };
  const roleStyle = ROLE_COLORS[userRole] ?? null;

  const handleExitDemo = () => {
    clearDemoRole();
    window.location.href = "/sign-in";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-52 h-screen bg-sidebar border-r border-sidebar-border fixed top-0 left-0 z-50 flex flex-col">
        <Link href="/">
          <div className="px-4 py-4 border-b border-sidebar-border cursor-pointer hover:bg-muted/40 transition-colors">
            <div className="font-mono text-[9px] text-primary tracking-widest uppercase mb-0.5">CANCOMPLIANCE v2</div>
            <div className="font-serif italic text-lg text-foreground leading-tight">CanCompliance</div>
            <div className="font-mono text-[9px] text-muted-foreground mt-1">Canadian Compliance SaaS</div>
          </div>
        </Link>

        {/* Score mini badge */}
        <div className="px-4 py-2.5 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-muted-foreground">LIVE SCORE</span>
            <span className="font-mono text-[11px]" style={{
              color: score === null ? "var(--text3)" : score >= 80 ? "var(--green)" : score >= 60 ? "var(--amber)" : "var(--red)"
            }}>
              {score !== null ? score : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[9px] text-muted-foreground">{metrics.total} checks</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--green)" }}>{metrics.pass} pass</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--amber)" }}>{metrics.fail} fail</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--red)" }}>{metrics.flag} flag</span>
          </div>
        </div>

        <nav className="sidebar-nav sidebar-scroll-fade flex-1 px-2 py-3 overflow-y-auto">
          <Link href="/dashboard">
            <div
              data-testid="nav-dashboard"
              className={cn(
                "sidebar-nav-item flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer text-[12px] font-semibold transition-all duration-150 ease-out border hover:translate-x-0.5 mb-1",
                location === "/dashboard"
                  ? "bg-muted text-foreground border-border nav-active-glow"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border-transparent"
              )}
            >
              <div className={cn("w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200", location === "/dashboard" ? "bg-primary scale-125 shadow-[0_0_4px_rgba(200,241,53,0.6)]" : "bg-muted-foreground/20")} />
              <LayoutDashboard className={cn("w-3 h-3 flex-shrink-0 transition-all duration-150", location === "/dashboard" ? "text-primary" : "")} />
              Dashboard
            </div>
          </Link>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-2 mb-1">21 Compliance Modules</div>
          <div className="space-y-0.5">
            {MODULES.map(m => <NavItem key={m.href} {...m} />)}
          </div>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-3 mb-1">Tools &amp; Reporting</div>
          <div className="space-y-0.5">
            {TOOLS.map(t => <NavItem key={t.href} {...t} />)}
          </div>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-3 mb-1" style={{ color: "#c8f135", opacity: 0.7 }}>Compliance Officer</div>
          <div className="space-y-0.5">
            {OFFICER_TOOLS.map(t => <NavItem key={t.href} {...t} />)}
          </div>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-3 mb-1" style={{ color: "#12b76a", opacity: 0.7 }}>Auditor Tools</div>
          <div className="space-y-0.5">
            {AUDITOR_TOOLS.map(t => <NavItem key={t.href} {...t} />)}
          </div>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-3 mb-1" style={{ color: "#f5a623", opacity: 0.7 }}>Business Owner</div>
          <div className="space-y-0.5">
            {OWNER_TOOLS.map(t => <NavItem key={t.href} {...t} />)}
          </div>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-3 mb-1">Intelligence</div>
          <div className="space-y-0.5">
            {INTELLIGENCE.map(t => <NavItem key={t.href} {...t} />)}
          </div>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-3 mb-1">Global Frameworks</div>
          <div className="space-y-0.5">
            {GLOBAL_FRAMEWORKS.map(t => <NavItem key={t.href} {...t} />)}
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border">
          <Link href="/account">
            <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: "#c8f135", color: "#09090a" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-foreground truncate">{displayName}</div>
                <div className="text-[9px] text-muted-foreground truncate font-mono">{email}</div>
                {userRole && roleStyle && (
                  <div className="mt-0.5">
                    <span className="font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-widest"
                      style={{ color: roleStyle.color, background: roleStyle.bg }}>
                      {userRole}
                    </span>
                  </div>
                )}
              </div>
              <UserCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            </div>
          </Link>
          <div className="border-t border-sidebar-border/50 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-pass shadow-[0_0_5px_rgba(18,183,106,0.7)]" />
              Engine online
            </div>
            <button
              data-testid="btn-sign-out"
              onClick={() => isDemoMode ? handleExitDemo() : signOut()}
              className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors font-mono"
              title={isDemoMode ? "Exit Demo" : "Sign out"}
            >
              <LogOut className="w-3 h-3" />
              {isDemoMode ? "Exit Demo" : "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="ml-52 flex-1 flex flex-col min-h-screen">
        <EnforcementTicker />
        <div className="sticky top-0 z-50">
          {isDemoMode && (
            <div className="flex items-center gap-3 px-5 py-2 text-[11px]"
              style={{ background: "rgba(245,166,35,0.12)", borderBottom: "1px solid rgba(245,166,35,0.25)" }}>
              <FlaskConical size={12} style={{ color: "#f5a623" }} />
              <span style={{ color: "#f5a623" }} className="font-mono uppercase tracking-widest">Demo Mode</span>
              <span className="text-muted-foreground">· You are viewing as <span className="font-medium" style={{ color: "#f5a623" }}>{userRole}</span> ({displayName}) · data is not saved</span>
              <button onClick={handleExitDemo}
                className="ml-auto font-mono text-[10px] px-2.5 py-1 rounded border transition-colors hover:bg-muted"
                style={{ borderColor: "rgba(245,166,35,0.4)", color: "#f5a623" }}>
                Exit Demo
              </button>
            </div>
          )}
          <header className="h-12 bg-card border-b border-border flex items-center px-6 gap-4">
          {title && (
            <>
              <div className="text-[13px] font-medium text-foreground">{title}</div>
              {subtitle && <div className="text-[11px] text-muted-foreground font-mono">{subtitle}</div>}
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            {actions}
            <Link href="/privacy-policy">
              <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="w-3 h-3" />
                Privacy
              </button>
            </Link>
            <Link href="/pricing">
              <button
                data-testid="btn-upgrade"
                className="px-3 py-1.5 rounded-md text-[11px] font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "#c8f135", color: "#09090a" }}
              >
                Upgrade
              </button>
            </Link>
          </div>
        </header>
        </div>

        <main key={location} className="flex-1 p-6 page-enter">
          <PredictiveAlerts />
          {children}
        </main>
      </div>
    </div>
  );
}
