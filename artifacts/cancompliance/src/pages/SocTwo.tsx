import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, ts } from "@/context/AuditContext";
import { CheckCircle2, XCircle, AlertTriangle, Shield } from "lucide-react";

const CRITERIA = [
  {
    id: "CC1",
    name: "Control Environment",
    questions: [
      { id: "cc1_1", text: "Does your organization have a documented code of conduct or ethics policy that all employees acknowledge?", weight: 8 },
      { id: "cc1_2", text: "Is there a formal org chart with defined roles and reporting lines for security responsibilities?", weight: 7 },
      { id: "cc1_3", text: "Do board/management demonstrate commitment to integrity and ethical values in documented form?", weight: 6 },
    ],
  },
  {
    id: "CC2",
    name: "Communication & Information",
    questions: [
      { id: "cc2_1", text: "Is your security policy communicated to all personnel at least annually?", weight: 7 },
      { id: "cc2_2", text: "Do you have a process for users to report security concerns or incidents?", weight: 8 },
    ],
  },
  {
    id: "CC6",
    name: "Logical & Physical Access",
    questions: [
      { id: "cc6_1", text: "Do you enforce multi-factor authentication (MFA) for all remote and privileged access?", weight: 10 },
      { id: "cc6_2", text: "Is access provisioned on a least-privilege basis with documented approval workflows?", weight: 9 },
      { id: "cc6_3", text: "Do you conduct quarterly user access reviews and revoke unused permissions?", weight: 8 },
      { id: "cc6_4", text: "Are encryption controls in place for data at rest and in transit?", weight: 9 },
    ],
  },
  {
    id: "CC7",
    name: "System Operations",
    questions: [
      { id: "cc7_1", text: "Do you have a centralized logging system capturing all user and admin activity?", weight: 9 },
      { id: "cc7_2", text: "Are security events monitored with alerts for anomalous behavior?", weight: 8 },
      { id: "cc7_3", text: "Is there a documented and tested incident response procedure?", weight: 9 },
    ],
  },
  {
    id: "CC9",
    name: "Risk Mitigation",
    questions: [
      { id: "cc9_1", text: "Do you perform annual risk assessments identifying threats to service availability and data integrity?", weight: 9 },
      { id: "cc9_2", text: "Are third-party vendors assessed for security risks before onboarding?", weight: 8 },
      { id: "cc9_3", text: "Do vendor contracts include data protection and security requirements?", weight: 7 },
    ],
  },
];

type Answer = "yes" | "no" | "partial";

const PENALTY_CONTEXT = "Failing a SOC 2 audit results in loss of certification, inability to win enterprise contracts, and potential $500K–$2M+ in lost annual revenue for B2B SaaS companies.";

export default function SocTwo() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<{ score: number; status: "pass" | "fail" | "partial" } | null>(null);
  const { logCheck } = useAudit();

  const allQuestions = CRITERIA.flatMap(c => c.questions);
  const answered = Object.keys(answers).length;

  const handleSubmit = () => {
    let total = 0, earned = 0;
    allQuestions.forEach(q => {
      total += q.weight;
      const a = answers[q.id];
      if (a === "yes") earned += q.weight;
      else if (a === "partial") earned += q.weight * 0.5;
    });
    const score = Math.round((earned / total) * 100);
    const status = score >= 80 ? "pass" : score >= 55 ? "partial" : "fail";
    setResult({ score, status });
    logCheck({ id: uid(), module: "SOC 2", ruleId: "SOC2-TSC", input: `${Object.keys(answers).length} criteria answered`, result: status === "pass" ? "PASS" : status === "partial" ? "FLAG" : "FAIL", statute: "AICPA Trust Services Criteria 2017", timestamp: ts() });
  };

  const statusColor = result?.status === "pass" ? "#12b76a" : result?.status === "partial" ? "#f5a623" : "#f04438";
  const statusLabel = result?.status === "pass" ? "AUDIT READY" : result?.status === "partial" ? "GAPS PRESENT" : "NOT READY";

  return (
    <AppLayout title="SOC 2 — Trust Services Criteria" subtitle="AICPA · Security, Availability, Confidentiality">
      {/* Header context */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(127,119,221,0.12)", border: "1px solid rgba(127,119,221,0.25)" }}>
          <Shield size={16} style={{ color: "#7F77DD" }} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-foreground mb-1">SOC 2 Type II — Service Organization Control</div>
          <div className="text-[12px] text-muted-foreground leading-relaxed">Assess your readiness against AICPA Trust Services Criteria. SOC 2 is required by most enterprise buyers, SaaS companies, and government vendors. Answer based on your current documented and implemented controls.</div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Controls</div>
          <div className="text-2xl font-semibold text-foreground">61</div>
          <div className="font-mono text-[9px] text-muted-foreground">TSC criteria</div>
        </div>
      </div>

      {!result ? (
        <div className="space-y-5">
          {CRITERIA.map(group => (
            <div key={group.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground">{group.id}</span>
                <span className="text-[13px] font-medium text-foreground">{group.name}</span>
              </div>
              <div className="divide-y divide-border">
                {group.questions.map(q => (
                  <div key={q.id} className="px-5 py-4">
                    <div className="text-[12px] text-foreground mb-3 leading-relaxed">{q.text}</div>
                    <div className="flex gap-2">
                      {(["yes", "partial", "no"] as Answer[]).map(a => (
                        <button
                          key={a}
                          data-testid={`${q.id}-${a}`}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: a }))}
                          className="flex-1 py-2 rounded-lg text-[11px] font-mono uppercase tracking-wide border transition-all"
                          style={answers[q.id] === a
                            ? { background: a === "yes" ? "rgba(18,183,106,0.15)" : a === "partial" ? "rgba(245,166,35,0.15)" : "rgba(240,68,56,0.12)", color: a === "yes" ? "#12b76a" : a === "partial" ? "#f5a623" : "#f04438", borderColor: a === "yes" ? "#12b76a" : a === "partial" ? "#f5a623" : "#f04438" }
                            : { color: "var(--muted-foreground)", borderColor: "var(--border)" }}
                        >
                          {a === "yes" ? "Yes" : a === "partial" ? "Partial" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={answered < allQuestions.length}
            data-testid="soc2-submit"
            className="w-full py-3 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-40"
            style={{ background: "#c8f135", color: "#09090a" }}
          >
            {answered < allQuestions.length ? `Answer all ${allQuestions.length - answered} remaining questions` : "Assess SOC 2 Readiness"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border rounded-xl p-6 text-center" style={{ borderColor: `${statusColor}40` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: statusColor }}>SOC 2 READINESS RESULT</div>
            <div className="text-5xl font-bold mb-1" style={{ color: statusColor }}>{result.score}<span className="text-2xl">/100</span></div>
            <div className="font-mono text-[11px] uppercase tracking-widest mt-2 mb-4" style={{ color: statusColor }}>{statusLabel}</div>
            {result.status !== "pass" && (
              <p className="text-[12px] text-muted-foreground max-w-md mx-auto">{PENALTY_CONTEXT}</p>
            )}
            {result.status === "pass" && (
              <p className="text-[12px] text-pass max-w-md mx-auto">Your controls are substantially aligned with SOC 2 Trust Services Criteria. Consider engaging a licensed CPA firm for formal Type II audit.</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[12px] font-medium text-foreground mb-3">Key Gaps to Address</div>
            <div className="space-y-2">
              {allQuestions.filter(q => answers[q.id] === "no" || answers[q.id] === "partial").slice(0, 5).map(q => (
                <div key={q.id} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <AlertTriangle size={12} className="text-flag flex-shrink-0 mt-0.5" />
                  {q.text}
                </div>
              ))}
              {allQuestions.filter(q => answers[q.id] === "no" || answers[q.id] === "partial").length === 0 && (
                <div className="flex items-center gap-2 text-[11px] text-pass">
                  <CheckCircle2 size={12} />
                  All criteria met — no critical gaps identified.
                </div>
              )}
            </div>
          </div>

          <button onClick={() => { setAnswers({}); setResult(null); }}
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-mono">
            ← Reassess
          </button>
        </div>
      )}
    </AppLayout>
  );
}
