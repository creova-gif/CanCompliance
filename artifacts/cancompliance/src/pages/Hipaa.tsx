import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, ts } from "@/context/AuditContext";
import { AlertTriangle, CheckCircle2, Heart } from "lucide-react";

const SAFEGUARDS = [
  {
    id: "§164.308", name: "Administrative Safeguards",
    questions: [
      { id: "hipaa_as1", text: "Do you have a documented Security Management Process including risk analysis and risk management?", weight: 10 },
      { id: "hipaa_as2", text: "Is there a designated Security Officer responsible for HIPAA compliance?", weight: 9 },
      { id: "hipaa_as3", text: "Do workforce members receive HIPAA security training upon hire and annually?", weight: 8 },
      { id: "hipaa_as4", text: "Do you have Business Associate Agreements (BAAs) with all vendors that access PHI?", weight: 10 },
      { id: "hipaa_as5", text: "Is there a documented contingency plan (backup, disaster recovery, emergency access) for PHI systems?", weight: 8 },
    ],
  },
  {
    id: "§164.310", name: "Physical Safeguards",
    questions: [
      { id: "hipaa_ps1", text: "Are physical access controls in place to limit PHI systems to authorized personnel only?", weight: 8 },
      { id: "hipaa_ps2", text: "Are workstations with PHI access positioned to prevent unauthorized viewing?", weight: 7 },
      { id: "hipaa_ps3", text: "Is hardware containing PHI decommissioned using NIST-compliant media sanitization?", weight: 8 },
    ],
  },
  {
    id: "§164.312", name: "Technical Safeguards",
    questions: [
      { id: "hipaa_ts1", text: "Does each user have unique login credentials for accessing systems containing PHI?", weight: 9 },
      { id: "hipaa_ts2", text: "Are automatic logoff controls implemented for PHI workstations after inactivity?", weight: 8 },
      { id: "hipaa_ts3", text: "Is PHI encrypted at rest (AES-256) and in transit (TLS 1.2+)?", weight: 10 },
      { id: "hipaa_ts4", text: "Are audit logs capturing all PHI access (user, action, timestamp, record) maintained?", weight: 9 },
    ],
  },
  {
    id: "§164.404", name: "Breach Notification Rule",
    questions: [
      { id: "hipaa_bn1", text: "Is there a defined process to identify, assess, and respond to PHI breaches within 60 days?", weight: 10 },
      { id: "hipaa_bn2", text: "Do you notify affected individuals, HHS, and media (if >500 affected) as required?", weight: 9 },
      { id: "hipaa_bn3", text: "Is a breach log maintained documenting all incidents investigated (including those not reported)?", weight: 8 },
    ],
  },
];

type Answer = "yes" | "partial" | "no";

export default function Hipaa() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<{ score: number; status: "pass" | "partial" | "fail" } | null>(null);
  const { logCheck } = useAudit();

  const allQuestions = SAFEGUARDS.flatMap(s => s.questions);
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
    logCheck({ id: uid(), module: "HIPAA", ruleId: "HIPAA-SR", input: `${Object.keys(answers).length} safeguards answered`, result: status === "pass" ? "PASS" : status === "partial" ? "FLAG" : "FAIL", statute: "45 CFR §164 Security Rule", timestamp: ts() });
  };

  const statusColor = result?.status === "pass" ? "#12b76a" : result?.status === "partial" ? "#f5a623" : "#f04438";

  return (
    <AppLayout title="HIPAA — Health Data Security" subtitle="Health Insurance Portability and Accountability Act · PHI Safeguards">
      <div className="bg-card border border-border rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(18,183,106,0.08)", border: "1px solid rgba(18,183,106,0.2)" }}>
          <Heart size={16} style={{ color: "#12b76a" }} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-foreground mb-1">HIPAA Security Rule — PHI Safeguards Assessment</div>
          <div className="text-[12px] text-muted-foreground leading-relaxed">Required for any organization creating, receiving, maintaining, or transmitting Protected Health Information (PHI). Canadian healthcare companies serving US patients or partnering with US covered entities must comply. Civil penalties up to $1.9M per violation category per year.</div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Max Annual</div>
          <div className="text-xl font-semibold text-fail">$1.9M</div>
          <div className="font-mono text-[9px] text-muted-foreground">per violation</div>
        </div>
      </div>

      {!result ? (
        <div className="space-y-5">
          {SAFEGUARDS.map(group => (
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
                        <button key={a} data-testid={`${q.id}-${a}`}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: a }))}
                          className="flex-1 py-2 rounded-lg text-[11px] font-mono uppercase tracking-wide border transition-all"
                          style={answers[q.id] === a
                            ? { background: a === "yes" ? "rgba(18,183,106,0.15)" : a === "partial" ? "rgba(245,166,35,0.15)" : "rgba(240,68,56,0.12)", color: a === "yes" ? "#12b76a" : a === "partial" ? "#f5a623" : "#f04438", borderColor: a === "yes" ? "#12b76a" : a === "partial" ? "#f5a623" : "#f04438" }
                            : { color: "var(--muted-foreground)", borderColor: "var(--border)" }}>
                          {a === "yes" ? "Yes" : a === "partial" ? "Partial" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={answered < allQuestions.length} data-testid="hipaa-submit"
            className="w-full py-3 rounded-xl text-[13px] font-semibold disabled:opacity-40"
            style={{ background: "#c8f135", color: "#09090a" }}>
            {answered < allQuestions.length ? `Answer ${allQuestions.length - answered} more questions` : "Assess HIPAA Compliance"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border rounded-xl p-6 text-center" style={{ borderColor: `${statusColor}40` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: statusColor }}>HIPAA SECURITY RULE RESULT</div>
            <div className="text-5xl font-bold mb-1" style={{ color: statusColor }}>{result.score}<span className="text-2xl">/100</span></div>
            <div className="font-mono text-[11px] uppercase tracking-widest mt-2 mb-4" style={{ color: statusColor }}>
              {result.status === "pass" ? "SAFEGUARDS IN PLACE" : result.status === "partial" ? "GAPS IDENTIFIED" : "SIGNIFICANT VIOLATIONS"}
            </div>
            <p className="text-[12px] text-muted-foreground max-w-md mx-auto">
              {result.status === "fail" ? "Critical PHI safeguard failures detected. HHS Office for Civil Rights (OCR) investigations result in penalties up to $1.9M per violation category." : result.status === "partial" ? "Partial compliance found. Remediate gaps before handling PHI from US covered entities or entering BAAs." : "Your PHI safeguards are substantially implemented. Schedule annual risk assessment to maintain compliance."}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[12px] font-medium text-foreground mb-3">Remediation Required</div>
            <div className="space-y-2">
              {allQuestions.filter(q => answers[q.id] !== "yes").slice(0, 5).map(q => (
                <div key={q.id} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <AlertTriangle size={12} className="text-flag flex-shrink-0 mt-0.5" />
                  {q.text}
                </div>
              ))}
              {allQuestions.filter(q => answers[q.id] !== "yes").length === 0 && (
                <div className="flex items-center gap-2 text-[11px] text-pass"><CheckCircle2 size={12} />All safeguards implemented.</div>
              )}
            </div>
          </div>
          <button onClick={() => { setAnswers({}); setResult(null); }} className="text-[12px] text-muted-foreground hover:text-foreground font-mono">← Reassess</button>
        </div>
      )}
    </AppLayout>
  );
}
