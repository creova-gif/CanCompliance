import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

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
      <Route path="/compliance-score" component={ComplianceScore} />
      <Route path="/growth" component={Growth} />
      <Route path="/pricing" component={Pricing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppBody />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
