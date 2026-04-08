import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Mail, Shield, Globe, Briefcase, HardHat,
  DollarSign, Bot, Award, TrendingUp, CreditCard, ChevronRight
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/casl", label: "CASL Checker", icon: Mail },
  { href: "/pipeda", label: "PIPEDA Checker", icon: Shield },
  { href: "/bill96", label: "Bill 96 (Quebec)", icon: Globe },
  { href: "/casl", label: "Employment", icon: Briefcase, override: true },
  { href: "/casl", label: "WSIB", icon: HardHat, override: true },
  { href: "/casl", label: "Payroll / CRA", icon: DollarSign, override: true },
  { href: "/ai-copilot", label: "AI Copilot", icon: Bot },
  { href: "/compliance-score", label: "Compliance Score", icon: Award },
  { href: "/growth", label: "Growth Tools", icon: TrendingUp },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border fixed top-0 left-0 z-50 flex flex-col">
        <div className="px-5 py-6 border-b border-sidebar-border">
          <div className="font-mono text-[10px] text-primary tracking-widest uppercase mb-1">CANCOMPLIANCE</div>
          <div className="font-serif italic text-xl text-foreground">CanCompliance</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mb-2">Compliance Modules</div>
          {navItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            const isActive = !item.override && location === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <div
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13px] font-normal transition-all duration-150 border",
                    isActive
                      ? "bg-muted text-foreground border-border"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}

          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-2 mb-2 mt-4">Tools</div>
          {navItems.slice(7).map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <div
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13px] font-normal transition-all duration-150 border",
                    isActive
                      ? "bg-muted text-foreground border-border"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.label === "AI Copilot" && (
                    <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">CLAUDE</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            Engine online
          </div>
        </div>
      </aside>

      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        <header className="h-14 bg-card border-b border-border flex items-center px-7 gap-4 sticky top-0 z-40">
          {title && (
            <>
              <div className="text-[13px] font-medium text-foreground">{title}</div>
              {subtitle && <div className="text-[11px] text-muted-foreground font-mono">{subtitle}</div>}
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            {actions}
            <Link href="/pricing">
              <button
                data-testid="btn-upgrade"
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Upgrade
              </button>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
