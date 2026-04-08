import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShieldCheck, Globe, Search, Leaf, Network,
  DollarSign, Receipt, Users, Lock, HardHat, Package, Brain,
  Recycle, Mail, Target, FileText, Clock, MapPin, Bot,
  TrendingUp, CreditCard, BookOpen, LogOut, UserCircle, Shield
} from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { useUser, useClerk } from "@clerk/react";

const MODULES = [
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
];

const TOOLS = [
  { href: "/casl-ledger", label: "CASL Ledger", icon: Mail },
  { href: "/compliance-score", label: "Score Engine", icon: Target },
  { href: "/audit-trail", label: "Audit Trail", icon: FileText },
  { href: "/deadlines", label: "Deadlines", icon: Clock },
  { href: "/jurisdiction", label: "Jurisdiction", icon: MapPin },
  { href: "/control-mapper", label: "Control Mapper", icon: BookOpen },
  { href: "/ai-copilot", label: "AI Copilot", icon: Bot, badge: "AI" },
  { href: "/growth", label: "Growth Tools", icon: TrendingUp },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

function NavItem({ href, label, sub, icon: Icon, badge }: { href: string; label: string; sub?: string; icon: any; badge?: string }) {
  const [location] = useLocation();
  const isActive = location === href;
  return (
    <Link href={href}>
      <div
        data-testid={`nav-${label.toLowerCase().replace(/[\s/.]+/g, "-")}`}
        className={cn(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer text-[12px] transition-all duration-100 border",
          isActive
            ? "bg-muted text-foreground border-border"
            : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
        )}
      >
        <div className={cn("w-1 h-1 rounded-full flex-shrink-0", isActive ? "bg-primary" : "bg-muted-foreground/20")} />
        <Icon className="w-3 h-3 flex-shrink-0" />
        <span className="font-medium">{label}</span>
        {sub && <span className="text-muted-foreground text-[10px] truncate hidden xl:block">{sub}</span>}
        {badge && <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{badge}</span>}
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

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const displayName = user?.firstName ?? email.split("@")[0] ?? "Account";
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-52 min-h-screen bg-sidebar border-r border-sidebar-border fixed top-0 left-0 z-50 flex flex-col">
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
            <span className="font-mono text-[9px]" style={{ color: "var(--green)" }}>{metrics.pass}P</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--amber)" }}>{metrics.fail}F</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--red)" }}>{metrics.flag}X</span>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <Link href="/dashboard">
            <div
              data-testid="nav-dashboard"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer text-[12px] font-semibold transition-all duration-100 border border-transparent hover:bg-muted hover:text-foreground text-muted-foreground mb-1"
            >
              <LayoutDashboard className="w-3 h-3" />
              Dashboard
            </div>
          </Link>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-2 mb-1">13 Compliance Modules</div>
          <div className="space-y-0.5">
            {MODULES.map(m => <NavItem key={m.href} {...m} />)}
          </div>

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mt-3 mb-1">Tools &amp; Reporting</div>
          <div className="space-y-0.5">
            {TOOLS.map(t => <NavItem key={t.href} {...t} />)}
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
              onClick={() => signOut()}
              className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors font-mono"
              title="Sign out"
            >
              <LogOut className="w-3 h-3" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="ml-52 flex-1 flex flex-col min-h-screen">
        <header className="h-12 bg-card border-b border-border flex items-center px-6 gap-4 sticky top-0 z-40">
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

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
