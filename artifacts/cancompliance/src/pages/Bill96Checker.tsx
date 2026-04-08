import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useRunComplianceCheck } from "@workspace/api-client-react";
import { CheckCircle, XCircle, AlertTriangle, AlertOctagon } from "lucide-react";

interface ComplianceResult {
  status: "pass" | "fail" | "flag" | "block";
  score: number;
  title: string;
  statute: string;
  remediation: string;
  module: string;
  timestamp: string;
}

const STATUS_CONFIG = {
  pass: { label: "PASS", color: "text-pass", bg: "bg-pass/5 border-pass/20" },
  fail: { label: "FAIL", color: "text-fail", bg: "bg-fail/5 border-fail/20" },
  flag: { label: "FLAG", color: "text-flag", bg: "bg-flag/5 border-flag/20" },
  block: { label: "BLOCK", color: "text-block", bg: "bg-fail/8 border-fail/30" },
};

function ResultBox({ result }: { result: ComplianceResult }) {
  const s = STATUS_CONFIG[result.status];
  return (
    <div className={`rounded-xl border p-5 mt-5 ${s.bg}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${s.color} ${s.bg} tracking-widest uppercase`}>{s.label}</span>
        <span className={`font-mono text-[11px] ${s.color}`}>Score: {result.score}/100</span>
      </div>
      <div className={`text-[15px] font-semibold ${s.color} mb-2`}>{result.title}</div>
      <div className="font-mono text-[11px] text-muted-foreground bg-black/20 rounded-lg px-3 py-2 mb-3 leading-relaxed">{result.statute}</div>
      <div className="text-[13px] text-muted-foreground leading-relaxed">{result.remediation}</div>
      <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
        <div className="font-mono text-[10px] text-muted-foreground">MODULE: <span className="text-foreground">{result.module.toUpperCase()}</span></div>
        <div className="font-mono text-[10px] text-muted-foreground">CHECKED: <span className="text-foreground">{new Date(result.timestamp).toLocaleTimeString()}</span></div>
      </div>
    </div>
  );
}

export default function Bill96Checker() {
  const [form, setForm] = useState({
    servesQuebec: "yes",
    hasFrenchLabels: "no",
    websiteInFrench: "no",
    contractsInFrench: "no",
    province: "Quebec",
  });
  const [result, setResult] = useState<ComplianceResult | null>(null);

  const mutation = useRunComplianceCheck({
    mutation: {
      onSuccess: (data) => setResult(data as ComplianceResult),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: { module: "bill96", province: "Quebec", data: form } });
  };

  const yesNo = [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }];

  return (
    <AppLayout title="Bill 96 Checker" subtitle="Charter of the French Language">
      <div className="max-w-2xl">
        <div className="mb-7">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Bill 96 — Loi sur la langue officielle et commune du Québec</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Quebec Language Compliance</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Bill 96 amended Quebec's Charter of the French Language. Businesses serving Quebec consumers must provide French-language products, services, and communications. OQLF fines range from $7,000 to $700,000.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: "servesQuebec", label: "Does your business serve consumers in Quebec (online or offline)?" },
              { key: "hasFrenchLabels", label: "Are your product labels, packaging, and catalogs available in French?" },
              { key: "websiteInFrench", label: "Is your website fully available in French?" },
              { key: "contractsInFrench", label: "Are consumer contracts, order forms, and receipts provided in French?" },
            ].map(({ key, label }) => (
              <div key={key} className="form-group">
                <label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{label}</label>
                <div className="flex gap-3">
                  {yesNo.map(({ value, label: l }) => (
                    <button
                      key={value}
                      type="button"
                      data-testid={`${key}-${value}`}
                      onClick={() => setForm(f => ({ ...f, [key]: value }))}
                      className={`flex-1 py-2 rounded-lg border text-[13px] font-medium transition-all ${
                        form[key as keyof typeof form] === value
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-muted border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              data-testid="btn-run-bill96-check"
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Running Bill 96 Check...
                </>
              ) : "Run Bill 96 Check"}
            </button>
          </form>

          {result && <ResultBox result={result} />}
        </div>
      </div>
    </AppLayout>
  );
}
