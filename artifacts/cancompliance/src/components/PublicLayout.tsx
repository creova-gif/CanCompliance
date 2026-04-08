import { Link } from "wouter";
import { useAuth } from "@clerk/react";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function PublicNav() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b border-border flex items-center px-6 gap-4">
      <Link href="/">
        <span className="font-serif italic text-lg text-foreground cursor-pointer hover:opacity-80 transition-opacity">CanCompliance</span>
      </Link>
      <div className="ml-auto flex items-center gap-3">
        <Link href="/features">
          <button className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors">Features</button>
        </Link>
        <Link href="/pricing">
          <button className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
        </Link>
        <Link href="/ai-copilot">
          <button className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors">AI Copilot</button>
        </Link>
        <Link href="/dashboard">
          <button className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </Link>
        {isSignedIn ? (
          <Link href="/dashboard">
            <button data-testid="btn-go-dashboard" className="px-4 py-1.5 rounded-lg text-[12px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5" style={{ background: "#c8f135", color: "#09090a" }}>
              Go to App <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        ) : (
          <>
            <Link href="/sign-in">
              <button data-testid="btn-signin" className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button data-testid="btn-start-free" className="px-4 py-1.5 rounded-lg text-[12px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5" style={{ background: "#c8f135", color: "#09090a" }}>
                Start Free <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border py-10 px-6 mt-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] text-primary tracking-widest uppercase">CANCOMPLIANCE</span>
              <span className="font-serif italic text-base text-foreground">CanCompliance</span>
            </div>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              Canadian compliance automation for SMBs. 14 laws, one platform.
            </p>
            <div className="mt-4 space-y-1">
              <Link href="/sign-up">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold hover:opacity-80 transition-opacity px-3 py-1.5 rounded-lg" style={{ background: "#c8f135", color: "#09090a" }}>
                  Start Free <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Product</div>
              <div className="space-y-2">
                {[
                  { label: "Features", href: "/features" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "AI Copilot", href: "/ai-copilot" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                ].map(l => (
                  <Link key={l.label} href={l.href}>
                    <div className="text-[12px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l.label}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Compliance</div>
              <div className="space-y-2">
                {[
                  { label: "CASL", href: "/casl" },
                  { label: "PIPEDA", href: "/pipeda" },
                  { label: "Bill 96", href: "/bill96" },
                  { label: "FINTRAC", href: "/fintrac" },
                  { label: "Employment", href: "/employment" },
                ].map(l => (
                  <Link key={l.label} href={l.href}>
                    <div className="text-[12px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l.label}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Account</div>
              <div className="space-y-2">
                {[
                  { label: "Sign In", href: "/sign-in" },
                  { label: "Create Account", href: "/sign-up" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map(l => (
                  <Link key={l.label} href={l.href}>
                    <div className="text-[12px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l.label}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-muted-foreground">&copy; 2026 CanCompliance. Built for Canadian SMBs.</div>
          <div className="font-mono text-[11px] text-muted-foreground text-center md:text-right">Not legal advice. Consult a qualified Canadian lawyer for your specific situation.</div>
        </div>
      </div>
    </footer>
  );
}
