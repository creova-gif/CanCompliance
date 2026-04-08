import { useEffect, useRef } from "react";
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
import ComplianceScore from "@/pages/ComplianceScore";
import Growth from "@/pages/Growth";
import Pricing from "@/pages/Pricing";
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
  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <Component />;
}

function HomeRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect to="/dashboard" />;
  return <Landing />;
}

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        forceRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        forceRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
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
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/casl" component={() => <ProtectedRoute component={CaslChecker} />} />
      <Route path="/pipeda" component={() => <ProtectedRoute component={PipedaChecker} />} />
      <Route path="/bill96" component={() => <ProtectedRoute component={Bill96Checker} />} />
      <Route path="/ai-copilot" component={() => <ProtectedRoute component={AiCopilot} />} />
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
            <AppBody />
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
