import { useState } from "react";
import { X, CheckCircle, ChevronRight } from "lucide-react";
import { useRunComplianceCheck } from "@workspace/api-client-react";

interface OnboardingModalProps {
  onComplete: () => void;
  onClose: () => void;
}

const provinces = [
  "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba",
  "Saskatchewan", "Nova Scotia", "New Brunswick", "PEI", "Newfoundland",
];

export default function OnboardingModal({ onComplete, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [province, setProvince] = useState("");
  const [sendsEmails, setSendsEmails] = useState(false);
  const [hasEmployees, setHasEmployees] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const checkMutation = useRunComplianceCheck({
    mutation: {
      onSuccess: (data) => {
        setScore(data.score);
        setStep(4);
      },
    },
  });

  const handleStep3Continue = () => {
    checkMutation.mutate({
      data: {
        module: "casl",
        province: province || "Ontario",
        data: {
          sendsCommercialEmails: sendsEmails ? "yes" : "no",
          hasCaslUnsubscribe: "no",
          honorsUnsubscribe: "no",
          expressConsent: "no",
        },
      },
    });
  };

  const renderDots = () => (
    <div className="flex gap-2 justify-center mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === step ? "bg-primary w-6" : i < step ? "bg-primary/50" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md relative overflow-hidden">
        <button
          data-testid="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {renderDots()}

          {step === 1 && (
            <div>
              <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Step 1 of 3</div>
              <h2 className="text-2xl font-serif italic text-foreground mb-2">Where do you operate?</h2>
              <p className="text-[13px] text-muted-foreground mb-6">Province determines which regulations apply to your business.</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {provinces.map((p) => (
                  <button
                    key={p}
                    data-testid={`province-${p.toLowerCase()}`}
                    onClick={() => setProvince(p)}
                    className={`px-3 py-2 rounded-lg text-[12px] border transition-all ${
                      province === p
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                data-testid="btn-step1-continue"
                disabled={!province}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Step 2 of 3</div>
              <h2 className="text-2xl font-serif italic text-foreground mb-2">What does your business do?</h2>
              <p className="text-[13px] text-muted-foreground mb-6">This configures which compliance checks matter most for you.</p>
              <div className="space-y-3 mb-6">
                {[
                  { id: "emails", label: "We send commercial emails or newsletters", state: sendsEmails, setState: setSendsEmails },
                  { id: "employees", label: "We have employees (or contractors)", state: hasEmployees, setState: setHasEmployees },
                ].map(({ id, label, state, setState }) => (
                  <button
                    key={id}
                    data-testid={`check-${id}`}
                    onClick={() => setState(!state)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-[13px] transition-all ${
                      state ? "bg-primary/10 border-primary text-foreground" : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${state ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                      {state && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    {label}
                  </button>
                ))}
              </div>
              <button
                data-testid="btn-step2-continue"
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Step 3 of 3</div>
              <h2 className="text-2xl font-serif italic text-foreground mb-2">Live CASL demo check</h2>
              <p className="text-[13px] text-muted-foreground mb-6">See a real compliance result with statute citation — in under 60 seconds.</p>

              <div className="bg-muted rounded-xl p-4 mb-6 border border-border">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Sample scenario</div>
                <div className="space-y-2 text-[12px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Business sends promotional emails (e-commerce)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    No express consent obtained
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    No unsubscribe link in emails
                  </div>
                </div>
              </div>

              <button
                data-testid="btn-run-demo"
                onClick={handleStep3Continue}
                disabled={checkMutation.isPending}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {checkMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Running check...
                  </>
                ) : (
                  <>Run CASL Check <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">CASL Check Result</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px] uppercase tracking-widest mb-4">
                  FAIL
                </div>
                <div className="font-mono text-[11px] text-muted-foreground bg-black/30 rounded-lg px-4 py-3 text-left">
                  CASL S.6(1) + S.11(1) — Express Consent Required + Unsubscribe Mechanism Mandatory. Max penalty: $10M/violation.
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Your compliance score</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all duration-1000"
                      style={{ width: `${score ?? 0}%` }}
                    />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-red-400 font-mono">{score ?? 0}%</div>
              </div>

              <button
                data-testid="btn-enter-dashboard"
                onClick={onComplete}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                See full dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
