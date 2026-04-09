import { useEffect, useRef, Component, ReactNode, useState } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation, Link } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, useAuth, useClerk, useSignIn, useSignUp, AuthenticateWithRedirectCallback } from "@clerk/react";
import { Eye, EyeOff, Scale, ClipboardCheck, Building2, ArrowRight } from "lucide-react";
import { getDemoRole, setDemoRole } from "@/lib/demoSession";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuditProvider } from "./context/AuditContext";
import AppLayout from "./components/AppLayout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CaslChecker from "@/pages/CaslChecker";
import PipedaChecker from "@/pages/PipedaChecker";
import Bill96Checker from "@/pages/Bill96Checker";
import AiCopilot from "@/pages/AiCopilot";
import AiCopilotPage from "@/pages/AiCopilotPage";
import Features from "@/pages/Features";
import PricingPage from "@/pages/PricingPage";
import ComplianceScore from "@/pages/ComplianceScore";
import Growth from "@/pages/Growth";
import CCPSA from "@/pages/CCPSA";
import CPLA from "@/pages/CPLA";
import Fintrac from "@/pages/Fintrac";
import ESG from "@/pages/ESG";
import SupplyChain from "@/pages/SupplyChain";
import Payroll from "@/pages/Payroll";
import GstHst from "@/pages/GstHst";
import Employment from "@/pages/Employment";
import Privacy from "@/pages/Privacy";
import Safety from "@/pages/Safety";
import Customs from "@/pages/Customs";
import AiGovernance from "@/pages/AiGovernance";
import EPR from "@/pages/EPR";
import CaslLedger from "@/pages/CaslLedger";
import AuditTrail from "@/pages/AuditTrail";
import Deadlines from "@/pages/Deadlines";
import JurisdictionSetup from "@/pages/JurisdictionSetup";
import ControlMapper from "@/pages/ControlMapper";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Account from "@/pages/Account";
import RedTapeCalculator from "@/pages/RedTapeCalculator";
import LegislationTracker from "@/pages/LegislationTracker";
import DocumentScanner from "@/pages/DocumentScanner";
import Benchmarking from "@/pages/Benchmarking";
import SandboxAdvisor from "@/pages/SandboxAdvisor";
import ComplianceInbox from "@/pages/ComplianceInbox";
import TrustNetwork from "@/pages/TrustNetwork";
import PolicyGenerator from "@/pages/PolicyGenerator";
import FrameworksHub from "@/pages/FrameworksHub";
import ControlLibrary from "@/pages/ControlLibrary";
import SocTwo from "@/pages/SocTwo";
import IsoISMS from "@/pages/IsoISMS";
import Gdpr from "@/pages/Gdpr";
import Hipaa from "@/pages/Hipaa";
import NistAiRmf from "@/pages/NistAiRmf";
import EuAiAct from "@/pages/EuAiAct";
import DeveloperPortal from "@/pages/DeveloperPortal";

// ─── Global Error Boundary ────────────────────────────────────────────────────
interface EBState { hasError: boolean; message: string }
class ErrorBoundary extends Component<{ children: ReactNode; label?: string }, EBState> {
  state: EBState = { hasError: false, message: "" };
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6"
          style={{ background: "#09090a" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(240,68,56,0.12)", border: "1px solid rgba(240,68,56,0.3)" }}>
            <span className="text-lg">!</span>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "#f04438" }}>
              {this.props.label ?? "Page Error"}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">{this.state.message || "Something went wrong loading this page."}</p>
          </div>
          <button
            onClick={() => { this.setState({ hasError: false, message: "" }); window.location.reload(); }}
            className="px-4 py-2 rounded-lg text-xs font-mono border border-border hover:border-primary/40 transition-colors"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Auth Loading Spinner ─────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#09090a" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: "#c8f135", borderRightColor: "rgba(200,241,53,0.3)" }} />
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function withLayout(Component: React.FC, title: string, subtitle?: string) {
  return function WrappedModule() {
    return (
      <AppLayout title={title} subtitle={subtitle}>
        <Component />
      </AppLayout>
    );
  };
}

const WrappedCCSPA = withLayout(CCPSA, "CCPSA — Product Safety", "Canada Consumer Product Safety Act screening");
const WrappedCPLA = withLayout(CPLA, "CPLA — Packaging & Bilingualism", "Consumer Packaging and Labelling Act · Bill 96");
const WrappedFintrac = withLayout(Fintrac, "FINTRAC — AML / KYC", "PCMLTFA transaction screening · $10K threshold");
const WrappedESG = withLayout(ESG, "ESG — Greenwashing Check", "Competition Act s.74.01 · Bill C-59 anti-greenwashing");
const WrappedSupplyChain = withLayout(SupplyChain, "S-211 — Supply Chain", "Forced labour reporting · CBCA ISC filings");
const WrappedPayroll = withLayout(Payroll, "Payroll — CPP / EI / Tax", "CRA payroll deduction calculator");
const WrappedGstHst = withLayout(GstHst, "GST / HST", "Registration threshold · net tax calculation · filing");
const WrappedEmployment = withLayout(Employment, "Employment Standards", "Minimum wage · overtime · termination notice by province");
const WrappedPrivacy = withLayout(Privacy, "Privacy / PIPEDA", "PIPEDA + Quebec Law 25 privacy compliance");
const WrappedSafety = withLayout(Safety, "Workplace Safety (OHS)", "OHSA · WorkSafeBC · JHSC · WSIB obligations");
const WrappedCustoms = withLayout(Customs, "Customs / CBSA", "CARM · duty rates · CUSMA · retaliatory tariffs");
const WrappedAiGovernance = withLayout(AiGovernance, "AI Governance", "AIDA · Workers IV · Quebec Law 25 s.12.1");
const WrappedEPR = withLayout(EPR, "EPR / Environmental", "Blue Box · ÉEQ · CEPA · battery & electronics stewardship");
const WrappedComplianceScore = withLayout(ComplianceScore, "Live Compliance Score", "Real-time score from all checks this session");

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isSignedIn, isLoaded } = useAuth();
  // Allow demo sessions to bypass Clerk auth
  if (getDemoRole()) {
    return (
      <ErrorBoundary label="Module Error">
        <Component />
      </ErrorBoundary>
    );
  }
  if (!isLoaded) return <PageLoader />;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return (
    <ErrorBoundary label="Module Error">
      <Component />
    </ErrorBoundary>
  );
}

function HomeRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  // Render landing immediately — redirect fires only once auth is confirmed
  if (isLoaded && isSignedIn) return <Redirect to="/dashboard" />;
  return <Landing />;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden sm:flex flex-col justify-between w-[320px] flex-shrink-0 border-r border-border px-8 py-10"
        style={{ background: "linear-gradient(160deg, rgba(200,241,53,0.04) 0%, transparent 60%)" }}>
        <div>
          <a href={basePath || "/"} className="font-serif italic text-xl text-foreground hover:opacity-80 transition-opacity">
            CanCompliance
          </a>
          <div className="mt-16">
            <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">Canada Compliance Engine</div>
            <h2 className="font-serif italic text-3xl text-foreground leading-snug mb-6">
              Stay <span style={{ color: "#c8f135" }}>compliant.</span><br />
              Avoid the fines.
            </h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-10">
              16 compliance modules, one platform. CASL, PIPEDA, Bill 96, FINTRAC, Employment Standards, and more — checked in seconds.
            </p>
            <div className="space-y-3">
              {[
                "Real-time statute citations",
                "AI Copilot powered by Claude & GPT",
                "Live compliance score",
                "PIPEDA-compliant data handling",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#c8f135" }} />
                  <span className="text-[13px] text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          Not legal advice · Built for Canadian SMBs
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}

// PublicRoute: if already signed in, skip auth pages and go straight to dashboard
// While Clerk is loading we render children immediately so there's no blank flash
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (isLoaded && isSignedIn) return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

const DEMO_PERSONAS = [
  {
    role: "Compliance Officer",
    short: "Full platform",
    desc: "All 14 modules, AI Copilot, score engine, policy generator",
    Icon: Scale,
    color: "#c8f135",
    bg: "rgba(200,241,53,0.08)",
    border: "rgba(200,241,53,0.2)",
  },
  {
    role: "Auditor",
    short: "Deep audit",
    desc: "Audit trail, control mapper, document scanner, remediation planner",
    Icon: ClipboardCheck,
    color: "#12b76a",
    bg: "rgba(18,183,106,0.08)",
    border: "rgba(18,183,106,0.2)",
  },
  {
    role: "Business Owner",
    short: "Quick scan",
    desc: "Compliance scan, jurisdiction setup, CASL ledger, deadlines",
    Icon: Building2,
    color: "#f5a623",
    bg: "rgba(245,166,35,0.08)",
    border: "rgba(245,166,35,0.2)",
  },
];

// ─── Shared input style ───────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-colors";
const btnPrimary = { background: "#c8f135", color: "#09090a" };

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <path d="M43.6 20.5h-1.6V20H24v8h11.3C33.6 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.3 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" fill="#FFC107"/>
      <path d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.3 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" fill="#FF3D00"/>
      <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.3-11.3-8H6.3C9.6 38.1 16.3 44 24 44z" fill="#4CAF50"/>
      <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2C37 38.8 44 34 44 24c0-1.2-.1-2.3-.4-3.5z" fill="#1976D2"/>
    </svg>
  );
}

function AuthFieldset({ label, type = "text", value, onChange, placeholder, children }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; children?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-[13px] font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required
          autoComplete={isPassword ? "current-password" : type === "email" ? "email" : "off"}
          className={inputCls + (isPassword ? " pr-10" : "")}
        />
        {isPassword && (
          <button type="button" tabIndex={-1}
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function AuthError({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="px-3 py-2.5 rounded-xl text-[12px] text-red-300 border border-red-500/20 bg-red-500/8">
      {msg}
    </div>
  );
}

function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || loading) return;
    setLoading(true); setError("");
    try {
      const result = await signIn!.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        setLocation("/dashboard");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Sign in failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signIn!.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${basePath}/sso-callback`,
        redirectUrlComplete: `${basePath}/dashboard`,
      });
    } catch { setError("Google sign-in unavailable. Use email below."); }
  };

  return (
    <PublicRoute>
      <AuthLayout>
        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="font-serif italic text-2xl text-foreground mb-1">Sign in to CanCompliance</h1>
            <p className="text-[13px] text-muted-foreground">Welcome back! Please sign in to continue.</p>
          </div>

          <button onClick={handleGoogle} type="button"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors mb-4 text-[13px] font-medium text-foreground">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthFieldset label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
            <AuthFieldset label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" />
            <AuthError msg={error} />
            <button type="submit" disabled={loading || !isLoaded}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-60"
              style={btnPrimary} data-testid="sign-in-submit">
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>

          <p className="text-center text-[12px] text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-foreground hover:underline font-medium">Sign up</Link>
          </p>

          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Try a demo role</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  data-testid={`demo-${p.role.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => { setDemoRole(p.role); setLocation("/dashboard"); }}
                  className="group flex flex-col items-start gap-2.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer h-full w-full text-left"
                  style={{
                    borderColor: "rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = p.border;
                    (e.currentTarget as HTMLButtonElement).style.background = p.bg;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                    <p.Icon size={14} style={{ color: p.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-foreground leading-tight mb-0.5">{p.role}</div>
                    <div className="font-mono text-[9px] uppercase tracking-wide" style={{ color: p.color }}>{p.short}</div>
                  </div>
                  <ArrowRight size={11} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform self-end" />
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-3">No sign-up needed · demo resets on tab close</p>
          </div>
        </div>
      </AuthLayout>
    </PublicRoute>
  );
}

function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Read ?role= from URL
  const urlRole = new URLSearchParams(window.location.search).get("role") ?? "";
  const persona = DEMO_PERSONAS.find(p => p.role === urlRole);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || loading) return;
    setLoading(true); setError("");
    try {
      // Persist the demo role into Clerk unsafeMetadata from day 1
      await signUp!.create({
        emailAddress: email,
        password,
        ...(urlRole ? { unsafeMetadata: { role: urlRole } } : {}),
      });
      await signUp!.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Sign up failed. Try a different email or stronger password.");
    } finally { setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || loading) return;
    setLoading(true); setError("");
    try {
      const result = await signUp!.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        setLocation("/dashboard");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || "Invalid code. Please check your email and try again.");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signUp!.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${basePath}/sso-callback`,
        redirectUrlComplete: `${basePath}/dashboard`,
      });
    } catch { setError("Google sign-up unavailable. Use email below."); }
  };

  if (step === "verify") {
    return (
      <PublicRoute>
        <AuthLayout>
          <div className="w-full max-w-sm">
            <div className="mb-7">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(200,241,53,0.12)", border: "1px solid rgba(200,241,53,0.3)" }}>
                <span style={{ color: "#c8f135", fontSize: 18 }}>✉</span>
              </div>
              <h1 className="font-serif italic text-2xl text-foreground mb-1">Check your email</h1>
              <p className="text-[13px] text-muted-foreground">
                We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>. Enter it below to verify your account.
              </p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-foreground mb-1.5">Verification code</label>
                <input type="text" inputMode="numeric" maxLength={6}
                  value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456" required autoFocus
                  className={inputCls + " text-center text-lg tracking-[0.3em] font-mono"}
                  data-testid="verify-code-input"
                />
              </div>
              <AuthError msg={error} />
              <button type="submit" disabled={loading || code.length < 6}
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-60"
                style={btnPrimary} data-testid="verify-submit">
                {loading ? "Verifying…" : "Verify Email"}
              </button>
            </form>
            <button onClick={() => { setStep("form"); setError(""); setCode(""); }}
              className="w-full text-center text-[12px] text-muted-foreground hover:text-foreground mt-4 transition-colors">
              ← Back to sign up
            </button>
          </div>
        </AuthLayout>
      </PublicRoute>
    );
  }

  return (
    <PublicRoute>
      <AuthLayout>
        <div className="w-full max-w-sm">
          <div className="mb-7">
            {persona && (
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border mb-5"
                style={{ borderColor: persona.border, background: persona.bg }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: persona.bg, border: `1px solid ${persona.border}` }}>
                  <persona.Icon size={13} style={{ color: persona.color }} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: persona.color }}>{persona.role}</div>
                  <div className="text-[10px] text-muted-foreground">{persona.short} access · {persona.desc.split(",")[0]}</div>
                </div>
              </div>
            )}
            <h1 className="font-serif italic text-2xl text-foreground mb-1">
              {persona ? `Create your ${persona.role} account` : "Create your account"}
            </h1>
            <p className="text-[13px] text-muted-foreground">Welcome! Please fill in the details to get started.</p>
          </div>

          <button onClick={handleGoogle} type="button"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors mb-4 text-[13px] font-medium text-foreground">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <AuthFieldset label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
            <AuthFieldset label="Password" type="password" value={password} onChange={setPassword} placeholder="Create a password (min 8 chars)" />
            <AuthError msg={error} />
            <button type="submit" disabled={loading || !isLoaded}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-60"
              style={btnPrimary} data-testid="sign-up-submit">
              {loading ? "Creating account…" : "Continue"}
            </button>
          </form>

          <p className="text-center text-[12px] text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground hover:underline font-medium">Sign in</Link>
          </p>

          <p className="text-center text-[10px] text-muted-foreground mt-4 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/privacy-policy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
            Not legal advice.
          </p>
        </div>
      </AuthLayout>
    </PublicRoute>
  );
}

function ClerkQueryCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsub;
  }, [addListener, qc]);

  return null;
}

function AppBody() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Switch>
      <Route path="/" component={HomeRoute} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/sso-callback" component={() => (
        <AuthLayout>
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: "#c8f135", borderRightColor: "rgba(200,241,53,0.3)" }} />
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Completing sign-in…</p>
            <AuthenticateWithRedirectCallback />
          </div>
        </AuthLayout>
      )} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/ai-copilot" component={AiCopilotPage} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/casl" component={() => <ProtectedRoute component={CaslChecker} />} />
      <Route path="/pipeda" component={() => <ProtectedRoute component={PipedaChecker} />} />
      <Route path="/bill96" component={() => <ProtectedRoute component={Bill96Checker} />} />
      <Route path="/copilot" component={() => <ProtectedRoute component={AiCopilot} />} />
      <Route path="/compliance-score" component={() => <ProtectedRoute component={WrappedComplianceScore} />} />
      <Route path="/growth" component={() => <ProtectedRoute component={Growth} />} />
      <Route path="/ccpsa" component={() => <ProtectedRoute component={WrappedCCSPA} />} />
      <Route path="/cpla" component={() => <ProtectedRoute component={WrappedCPLA} />} />
      <Route path="/fintrac" component={() => <ProtectedRoute component={WrappedFintrac} />} />
      <Route path="/esg" component={() => <ProtectedRoute component={WrappedESG} />} />
      <Route path="/supply-chain" component={() => <ProtectedRoute component={WrappedSupplyChain} />} />
      <Route path="/payroll" component={() => <ProtectedRoute component={WrappedPayroll} />} />
      <Route path="/gst-hst" component={() => <ProtectedRoute component={WrappedGstHst} />} />
      <Route path="/employment" component={() => <ProtectedRoute component={WrappedEmployment} />} />
      <Route path="/privacy" component={() => <ProtectedRoute component={WrappedPrivacy} />} />
      <Route path="/safety" component={() => <ProtectedRoute component={WrappedSafety} />} />
      <Route path="/customs" component={() => <ProtectedRoute component={WrappedCustoms} />} />
      <Route path="/ai-governance" component={() => <ProtectedRoute component={WrappedAiGovernance} />} />
      <Route path="/epr" component={() => <ProtectedRoute component={WrappedEPR} />} />
      <Route path="/casl-ledger" component={() => <ProtectedRoute component={CaslLedger} />} />
      <Route path="/audit-trail" component={() => <ProtectedRoute component={AuditTrail} />} />
      <Route path="/deadlines" component={() => <ProtectedRoute component={Deadlines} />} />
      <Route path="/jurisdiction" component={() => <ProtectedRoute component={JurisdictionSetup} />} />
      <Route path="/control-mapper" component={() => <ProtectedRoute component={ControlMapper} />} />
      <Route path="/account" component={() => <ProtectedRoute component={Account} />} />
      <Route path="/red-tape-calculator" component={() => <ProtectedRoute component={RedTapeCalculator} />} />
      <Route path="/legislation-tracker" component={() => <ProtectedRoute component={LegislationTracker} />} />
      <Route path="/document-scanner" component={() => <ProtectedRoute component={DocumentScanner} />} />
      <Route path="/benchmarking" component={() => <ProtectedRoute component={Benchmarking} />} />
      <Route path="/sandbox-advisor" component={() => <ProtectedRoute component={SandboxAdvisor} />} />
      <Route path="/compliance-inbox" component={() => <ProtectedRoute component={ComplianceInbox} />} />
      <Route path="/trust-network" component={() => <ProtectedRoute component={TrustNetwork} />} />
      <Route path="/policy-generator" component={() => <ProtectedRoute component={PolicyGenerator} />} />
      <Route path="/frameworks" component={() => <ProtectedRoute component={FrameworksHub} />} />
      <Route path="/control-library" component={() => <ProtectedRoute component={ControlLibrary} />} />
      <Route path="/soc2" component={() => <ProtectedRoute component={SocTwo} />} />
      <Route path="/iso27001" component={() => <ProtectedRoute component={IsoISMS} />} />
      <Route path="/gdpr" component={() => <ProtectedRoute component={Gdpr} />} />
      <Route path="/hipaa" component={() => <ProtectedRoute component={Hipaa} />} />
      <Route path="/nist-ai-rmf" component={() => <ProtectedRoute component={NistAiRmf} />} />
      <Route path="/eu-ai-act" component={() => <ProtectedRoute component={EuAiAct} />} />
      <Route path="/developer" component={() => <ProtectedRoute component={DeveloperPortal} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryCacheInvalidator />
        <TooltipProvider>
          <AuditProvider>
            <ErrorBoundary label="Application Error">
              <AppBody />
            </ErrorBoundary>
          </AuditProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
