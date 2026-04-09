import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, ts } from "@/context/AuditContext";
import { AlertTriangle, CheckCircle2, Globe } from "lucide-react";

const ARTICLES = [
  {
    id: "Art. 5–7", name: "Lawful Basis & Consent",
    questions: [
      { id: "gdpr_lb1", text: "Have you documented a lawful basis (consent, contract, legitimate interest, etc.) for each processing activity?", weight: 10 },
      { id: "gdpr_lb2", text: "Where consent is used, is it freely given, specific, informed, and unambiguous (no pre-ticked boxes)?", weight: 9 },
      { id: "gdpr_lb3", text: "Do you maintain a Record of Processing Activities (RoPA) as required by Art. 30?", weight: 9 },
    ],
  },
  {
    id: "Art. 13–15", name: "Transparency & Rights",
    questions: [
      { id: "gdpr_tr1", text: "Do you provide a GDPR-compliant privacy notice at the point of data collection?", weight: 8 },
      { id: "gdpr_tr2", text: "Can individuals request access to their data and receive a response within 30 days?", weight: 9 },
      { id: "gdpr_tr3", text: "Is there a process for right to erasure (right to be forgotten) and data portability?", weight: 8 },
    ],
  },
  {
    id: "Art. 25", name: "Privacy by Design",
    questions: [
      { id: "gdpr_pd1", text: "Is privacy considered during system design (privacy by default — minimal data collection)?", weight: 8 },
      { id: "gdpr_pd2", text: "Do you conduct Data Protection Impact Assessments (DPIA) for high-risk processing?", weight: 9 },
    ],
  },
  {
    id: "Art. 33", name: "Breach Notification",
    questions: [
      { id: "gdpr_bn1", text: "Is there a process to notify the supervisory authority within 72 hours of becoming aware of a breach?", weight: 10 },
      { id: "gdpr_bn2", text: "Where risk to individuals is high, do you notify affected persons without undue delay?", weight: 9 },
      { id: "gdpr_bn3", text: "Do you maintain an internal breach register documenting all incidents (even if not reported)?", weight: 8 },
    ],
  },
  {
    id: "Art. 46", name: "International Transfers",
    questions: [
      { id: "gdpr_it1", text: "Do transfers of EU personal data outside the EEA rely on adequacy decisions or Standard Contractual Clauses (SCCs)?", weight: 10 },
      { id: "gdpr_it2", text: "Have you conducted Transfer Impact Assessments (TIA) for transfers to non-adequate countries (e.g., Canada for non-PIPEDA-covered data)?", weight: 8 },
    ],
  },
];

type Answer = "yes" | "partial" | "no";

export default function Gdpr() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<{ score: number; status: "pass" | "partial" | "fail" } | null>(null);
  const { logCheck } = useAudit();

  const allQuestions = ARTICLES.flatMap(a => a.questions);
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
    logCheck({ id: uid(), module: "GDPR", ruleId: "GDPR-EU", input: `${Object.keys(answers).length} articles answered`, result: status === "pass" ? "PASS" : status === "partial" ? "FLAG" : "FAIL", statute: "EU GDPR 2016/679", timestamp: ts() });
  };

  const statusColor = result?.status === "pass" ? "#12b76a" : result?.status === "partial" ? "#f5a623" : "#f04438";

  return (
    <AppLayout title="GDPR — Data Protection Assessment" subtitle="EU General Data Protection Regulation · Max penalty: €20M or 4% global revenue">
      <div className="bg-card border border-border rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(240,68,56,0.08)", border: "1px solid rgba(240,68,56,0.2)" }}>
          <Globe size={16} style={{ color: "#f04438" }} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-foreground mb-1">GDPR Compliance Self-Assessment</div>
          <div className="text-[12px] text-muted-foreground leading-relaxed">The GDPR applies to any organization processing personal data of EU residents, regardless of where the business is located. Canadian companies serving EU customers must comply. Penalties up to €20M or 4% of global annual revenue.</div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Max Fine</div>
          <div className="text-xl font-semibold text-fail">€20M</div>
          <div className="font-mono text-[9px] text-muted-foreground">or 4% revenue</div>
        </div>
      </div>

      {!result ? (
        <div className="space-y-5">
          {ARTICLES.map(group => (
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
          <button onClick={handleSubmit} disabled={answered < allQuestions.length} data-testid="gdpr-submit"
            className="w-full py-3 rounded-xl text-[13px] font-semibold disabled:opacity-40"
            style={{ background: "#c8f135", color: "#09090a" }}>
            {answered < allQuestions.length ? `Answer ${allQuestions.length - answered} more questions` : "Assess GDPR Compliance"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border rounded-xl p-6 text-center" style={{ borderColor: `${statusColor}40` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: statusColor }}>GDPR COMPLIANCE RESULT</div>
            <div className="text-5xl font-bold mb-1" style={{ color: statusColor }}>{result.score}<span className="text-2xl">/100</span></div>
            <div className="font-mono text-[11px] uppercase tracking-widest mt-2 mb-4" style={{ color: statusColor }}>
              {result.status === "pass" ? "COMPLIANT" : result.status === "partial" ? "PARTIAL COMPLIANCE" : "NON-COMPLIANT — HIGH RISK"}
            </div>
            <p className="text-[12px] text-muted-foreground max-w-md mx-auto">
              {result.status === "fail" ? "Significant GDPR violations detected. EU supervisory authorities can issue fines up to €20M or 4% of global annual revenue." : result.status === "partial" ? "Address gaps before EU market expansion or enterprise sales to EU customers." : "Your GDPR controls are substantially in place. Maintain documentation and conduct annual review."}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[12px] font-medium text-foreground mb-3">Priority Remediation Items</div>
            <div className="space-y-2">
              {allQuestions.filter(q => answers[q.id] !== "yes").slice(0, 5).map(q => (
                <div key={q.id} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <AlertTriangle size={12} className="text-flag flex-shrink-0 mt-0.5" />
                  {q.text}
                </div>
              ))}
              {allQuestions.filter(q => answers[q.id] !== "yes").length === 0 && (
                <div className="flex items-center gap-2 text-[11px] text-pass"><CheckCircle2 size={12} />All articles addressed.</div>
              )}
            </div>
          </div>
          <button onClick={() => { setAnswers({}); setResult(null); }} className="text-[12px] text-muted-foreground hover:text-foreground font-mono">← Reassess</button>
        </div>
      )}
    </AppLayout>
  );
}
