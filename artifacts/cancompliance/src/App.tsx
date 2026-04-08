import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
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

function AppBody() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/casl" component={CaslChecker} />
      <Route path="/pipeda" component={PipedaChecker} />
      <Route path="/bill96" component={Bill96Checker} />
      <Route path="/ai-copilot" component={AiCopilot} />
      <Route path="/compliance-score" component={WrappedComplianceScore} />
      <Route path="/growth" component={Growth} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/ccpsa" component={WrappedCCSPA} />
      <Route path="/cpla" component={WrappedCPLA} />
      <Route path="/fintrac" component={WrappedFintrac} />
      <Route path="/esg" component={WrappedESG} />
      <Route path="/supply-chain" component={WrappedSupplyChain} />
      <Route path="/payroll" component={WrappedPayroll} />
      <Route path="/gst-hst" component={WrappedGstHst} />
      <Route path="/employment" component={WrappedEmployment} />
      <Route path="/privacy" component={WrappedPrivacy} />
      <Route path="/safety" component={WrappedSafety} />
      <Route path="/customs" component={WrappedCustoms} />
      <Route path="/ai-governance" component={WrappedAiGovernance} />
      <Route path="/epr" component={WrappedEPR} />
      <Route path="/casl-ledger" component={CaslLedger} />
      <Route path="/audit-trail" component={AuditTrail} />
      <Route path="/deadlines" component={Deadlines} />
      <Route path="/jurisdiction" component={JurisdictionSetup} />
      <Route path="/control-mapper" component={ControlMapper} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuditProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppBody />
          </WouterRouter>
        </AuditProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
