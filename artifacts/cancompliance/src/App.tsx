import { useEffect, useRef, Component, ReactNode } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk } from "@clerk/react";
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
              13 Canadian laws, one platform. CASL, PIPEDA, Bill 96, FINTRAC, Employment Standards, and more — checked in seconds.
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
    desc: "Full dashboard — all 14 modules, AI Copilot, score engine, policy generator",
    icon: "⚖️",
    color: "#c8f135",
  },
  {
    role: "Auditor",
    desc: "Audit trail, control mapper, document scanner, remediation planner",
    icon: "🔍",
    color: "#12b76a",
  },
  {
    role: "Business Owner",
    desc: "Quick compliance scan, jurisdiction setup, CASL ledger, deadlines",
    icon: "🏢",
    color: "#f5a623",
  },
];

function SignInPage() {
  const [, setLocation] = useLocation();
  return (
    <PublicRoute>
      <AuthLayout>
        <div className="w-full max-w-sm">
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            forceRedirectUrl={`${basePath}/dashboard`}
          />

          {/* Demo persona section */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground text-center mb-4">
              Or explore as a demo persona
            </div>
            <div className="space-y-2">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.role}
                  data-testid={`demo-${p.role.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setLocation(`/sign-up?role=${encodeURIComponent(p.role)}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-muted/50 transition-all text-left group"
                >
                  <span className="text-base flex-shrink-0">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-foreground group-hover:text-primary transition-colors">{p.role}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{p.desc}</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-3">
              Demo sign-up is free — no credit card needed
            </p>
          </div>
        </div>
      </AuthLayout>
    </PublicRoute>
  );
}

function SignUpPage() {
  return (
    <PublicRoute>
      <AuthLayout>
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
          forceRedirectUrl={`${basePath}/dashboard`}
        />
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
