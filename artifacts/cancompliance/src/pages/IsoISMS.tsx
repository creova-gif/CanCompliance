import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, ts } from "@/context/AuditContext";
import { AlertTriangle, CheckCircle2, Lock } from "lucide-react";

const CLAUSES = [
  {
    id: "A.5", name: "Organizational Controls",
    questions: [
      { id: "iso_a5_1", text: "Do you have a documented and board-approved Information Security Policy?", weight: 9 },
      { id: "iso_a5_2", text: "Are information security roles and responsibilities formally assigned and communicated?", weight: 8 },
      { id: "iso_a5_3", text: "Do you have a process for identifying, classifying, and labelling information assets?", weight: 7 },
    ],
  },
  {
    id: "A.6", name: "People Controls",
    questions: [
      { id: "iso_a6_1", text: "Are background checks performed on new employees handling sensitive information?", weight: 7 },
      { id: "iso_a6_2", text: "Do all staff complete annual information security awareness training?", weight: 8 },
      { id: "iso_a6_3", text: "Is there a formal disciplinary process for security policy violations?", weight: 6 },
    ],
  },
  {
    id: "A.8", name: "Technology Controls",
    questions: [
      { id: "iso_a8_1", text: "Are all endpoints (laptops, mobile) enrolled in MDM with remote wipe capability?", weight: 8 },
      { id: "iso_a8_2", text: "Do you perform vulnerability scanning at least monthly?", weight: 9 },
      { id: "iso_a8_3", text: "Is data encrypted at rest and in transit using industry-standard algorithms?", weight: 9 },
      { id: "iso_a8_4", text: "Do you maintain a network diagram and restrict network access to authorized segments?", weight: 7 },
    ],
  },
  {
    id: "Cl.6", name: "Risk Assessment",
    questions: [
      { id: "iso_cl6_1", text: "Have you completed a formal risk assessment identifying information security threats and vulnerabilities?", weight: 10 },
      { id: "iso_cl6_2", text: "Is there a risk treatment plan with accepted, mitigated, or transferred risks documented?", weight: 9 },
      { id: "iso_cl6_3", text: "Do you maintain a Statement of Applicability (SoA) for Annex A controls?", weight: 8 },
    ],
  },
  {
    id: "Cl.10", name: "Improvement",
    questions: [
      { id: "iso_cl10_1", text: "Do you conduct at least one internal audit of your ISMS annually?", weight: 9 },
      { id: "iso_cl10_2", text: "Is management review of ISMS conducted at least annually with documented minutes?", weight: 8 },
      { id: "iso_cl10_3", text: "Are nonconformities tracked with corrective actions closed within defined timelines?", weight: 7 },
    ],
  },
];

type Answer = "yes" | "partial" | "no";

export default function IsoISMS() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<{ score: number; status: "pass" | "partial" | "fail" } | null>(null);
  const { logCheck } = useAudit();

  const allQuestions = CLAUSES.flatMap(c => c.questions);
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
    logCheck({ id: uid(), module: "ISO 27001", ruleId: "ISO27001-ISMS", input: `${Object.keys(answers).length} clauses answered`, result: status === "pass" ? "PASS" : status === "partial" ? "FLAG" : "FAIL", statute: "ISO/IEC 27001:2022", timestamp: ts() });
  };

  const statusColor = result?.status === "pass" ? "#12b76a" : result?.status === "partial" ? "#f5a623" : "#f04438";
  const statusLabel = result?.status === "pass" ? "CERTIFICATION READY" : result?.status === "partial" ? "GAPS PRESENT" : "NOT READY";

  return (
    <AppLayout title="ISO 27001 — ISMS Assessment" subtitle="Information Security Management System · 93 Annex A Controls">
      <div className="bg-card border border-border rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)" }}>
          <Lock size={16} style={{ color: "#c8f135" }} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-foreground mb-1">ISO/IEC 27001:2022 — ISMS Gap Assessment</div>
          <div className="text-[12px] text-muted-foreground leading-relaxed">ISO 27001 is the world's leading information security standard, required by government, finance, and healthcare buyers. This assessment covers the 5 key clauses and selected Annex A controls most commonly audited.</div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Controls</div>
          <div className="text-2xl font-semibold text-foreground">93</div>
          <div className="font-mono text-[9px] text-muted-foreground">Annex A</div>
        </div>
      </div>

      {!result ? (
        <div className="space-y-5">
          {CLAUSES.map(group => (
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
          <button onClick={handleSubmit} disabled={answered < allQuestions.length} data-testid="iso-submit"
            className="w-full py-3 rounded-xl text-[13px] font-semibold disabled:opacity-40"
            style={{ background: "#c8f135", color: "#09090a" }}>
            {answered < allQuestions.length ? `Answer ${allQuestions.length - answered} more questions` : "Assess ISO 27001 Readiness"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border rounded-xl p-6 text-center" style={{ borderColor: `${statusColor}40` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: statusColor }}>ISO 27001 READINESS</div>
            <div className="text-5xl font-bold mb-1" style={{ color: statusColor }}>{result.score}<span className="text-2xl">/100</span></div>
            <div className="font-mono text-[11px] uppercase tracking-widest mt-2 mb-4" style={{ color: statusColor }}>{statusLabel}</div>
            <p className="text-[12px] text-muted-foreground max-w-md mx-auto">
              {result.status === "pass"
                ? "Your ISMS controls are substantially aligned. Engage an accredited CB (certification body) for formal audit."
                : "Address the gaps below before pursuing ISO 27001 certification. Certification bodies will reject applications with critical control deficiencies."}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[12px] font-medium text-foreground mb-3">Highest Priority Gaps</div>
            <div className="space-y-2">
              {allQuestions.filter(q => answers[q.id] !== "yes").slice(0, 5).map(q => (
                <div key={q.id} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <AlertTriangle size={12} className="text-flag flex-shrink-0 mt-0.5" />
                  {q.text}
                </div>
              ))}
              {allQuestions.filter(q => answers[q.id] !== "yes").length === 0 && (
                <div className="flex items-center gap-2 text-[11px] text-pass"><CheckCircle2 size={12} />All criteria met.</div>
              )}
            </div>
          </div>
          <button onClick={() => { setAnswers({}); setResult(null); }} className="text-[12px] text-muted-foreground hover:text-foreground font-mono">← Reassess</button>
        </div>
      )}
    </AppLayout>
  );
}
