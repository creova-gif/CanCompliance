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
  pass: { label: "PASS", Icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/5 border-green-500/20" },
  fail: { label: "FAIL", Icon: XCircle, color: "text-red-400", bg: "bg-red-500/5 border-red-500/20" },
  flag: { label: "FLAG", Icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/20" },
  block: { label: "BLOCK", Icon: AlertOctagon, color: "text-red-300", bg: "bg-red-900/10 border-red-500/30" },
};

function ResultBox({ result }: { result: ComplianceResult }) {
  const s = STATUS_CONFIG[result.status];
  return (
    <div className={`rounded-xl border p-5 mt-5 ${s.bg}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${s.color} ${s.bg} tracking-widest uppercase`}>
          {s.label}
        </span>
        <span className={`font-mono text-[11px] ${s.color}`}>Score: {result.score}/100</span>
      </div>
      <div className={`text-[15px] font-semibold ${s.color} mb-2`}>{result.title}</div>
      <div className="font-mono text-[11px] text-muted-foreground bg-black/20 rounded-lg px-3 py-2 mb-3 leading-relaxed">
        {result.statute}
      </div>
      <div className="text-[13px] text-muted-foreground leading-relaxed">{result.remediation}</div>
      <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
        <div className="font-mono text-[10px] text-muted-foreground">MODULE: <span className="text-foreground">{result.module.toUpperCase()}</span></div>
        <div className="font-mono text-[10px] text-muted-foreground">CHECKED: <span className="text-foreground">{new Date(result.timestamp).toLocaleTimeString()}</span></div>
      </div>
    </div>
  );
}

export default function CaslChecker() {
  const [form, setForm] = useState({
    sendsCommercialEmails: "yes",
    hasCaslUnsubscribe: "no",
    honorsUnsubscribe: "no",
    expressConsent: "no",
    province: "Ontario",
  });
  const [result, setResult] = useState<ComplianceResult | null>(null);

  const mutation = useRunComplianceCheck({
    mutation: {
      onSuccess: (data) => setResult(data as ComplianceResult),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: { module: "casl", province: form.province, data: form } });
  };

  const provinces = ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "PEI", "Newfoundland"];
  const yesNo = [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }];

  return (
    <AppLayout title="CASL Checker" subtitle="Canada's Anti-Spam Legislation">
      <div className="max-w-2xl">
        <div className="mb-7">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">CASL — Canada's Anti-Spam Legislation</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Email Compliance Check</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            CASL regulates commercial electronic messages sent to Canadian recipients. Violations can result in fines up to $10 million per organization.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: "sendsCommercialEmails", label: "Do you send commercial electronic messages (emails, texts, social DMs)?" },
              { key: "hasCaslUnsubscribe", label: "Do your emails include a clearly described, functioning unsubscribe mechanism?" },
              { key: "honorsUnsubscribe", label: "Do you honor unsubscribe requests within 10 business days?" },
              { key: "expressConsent", label: "Did you obtain express consent before sending commercial messages?" },
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

            <div className="form-group">
              <label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Province / Territory</label>
              <select
                data-testid="select-province"
                value={form.province}
                onChange={(e) => setForm(f => ({ ...f, province: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-[13px] text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <button
              data-testid="btn-run-casl-check"
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Running CASL Check...
                </>
              ) : "Run CASL Check"}
            </button>
          </form>

          {result && <ResultBox result={result} />}
        </div>
      </div>
    </AppLayout>
  );
}
