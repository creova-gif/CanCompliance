import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, ts } from "@/context/AuditContext";
import { AlertTriangle, CheckCircle2, Brain } from "lucide-react";

const FUNCTIONS = [
  {
    id: "GV", ref: "NIST AI RMF 1.0 — GOVERN",
    name: "GOVERN — Culture & Accountability",
    questions: [
      { id: "nist_gv1", text: "Has senior leadership formally approved an AI risk management policy that is communicated across the organization?", weight: 10 },
      { id: "nist_gv2", text: "Is a specific owner or team designated as accountable for AI risk, with clear reporting lines to leadership?", weight: 9 },
      { id: "nist_gv3", text: "Do staff who develop or deploy AI systems receive training on AI risks, bias, and ethics?", weight: 8 },
      { id: "nist_gv4", text: "Are external stakeholders (customers, vendors) consulted about impacts of your AI systems?", weight: 7 },
      { id: "nist_gv5", text: "Is there a documented process to respond to AI-related incidents, complaints, or harms?", weight: 9 },
    ],
  },
  {
    id: "MP", ref: "NIST AI RMF 1.0 — MAP",
    name: "MAP — Risk Context & Categorization",
    questions: [
      { id: "nist_mp1", text: "Have you inventoried all AI systems in use and their intended purposes (including third-party AI tools)?", weight: 10 },
      { id: "nist_mp2", text: "Have you assessed the context of deployment — who uses the AI, in what setting, and with what consequences?", weight: 9 },
      { id: "nist_mp3", text: "Are the potential harms (bias, discrimination, privacy breach, safety risk) documented for each AI system?", weight: 10 },
      { id: "nist_mp4", text: "Is a risk categorization applied (low / medium / high impact) based on harm potential and affected population?", weight: 8 },
      { id: "nist_mp5", text: "Are legal and regulatory requirements (AIDA, EU AI Act, GDPR, HIPAA) mapped to each AI system?", weight: 8 },
    ],
  },
  {
    id: "MS", ref: "NIST AI RMF 1.0 — MEASURE",
    name: "MEASURE — Analysis & Quantification",
    questions: [
      { id: "nist_ms1", text: "Are AI models evaluated for accuracy, bias, and fairness before deployment using structured testing?", weight: 10 },
      { id: "nist_ms2", text: "Do you measure demographic disparities in AI outputs (e.g., approval rates by gender, race, age)?", weight: 9 },
      { id: "nist_ms3", text: "Is model performance monitored continuously in production (drift, accuracy degradation, anomaly detection)?", weight: 9 },
      { id: "nist_ms4", text: "Are data lineage and data quality documented for training data sets?", weight: 8 },
      { id: "nist_ms5", text: "Do you conduct adversarial testing (red-teaming) to identify robustness failures?", weight: 7 },
    ],
  },
  {
    id: "MG", ref: "NIST AI RMF 1.0 — MANAGE",
    name: "MANAGE — Risk Response & Mitigation",
    questions: [
      { id: "nist_mg1", text: "Are risk treatment plans documented for each high-risk AI system, with assigned owners and timelines?", weight: 10 },
      { id: "nist_mg2", text: "Is there a human-in-the-loop mechanism for high-stakes AI decisions (e.g., lending, hiring, medical)?", weight: 10 },
      { id: "nist_mg3", text: "Can AI-driven decisions be explained to affected individuals in plain language?", weight: 9 },
      { id: "nist_mg4", text: "Do you have a documented AI incident response process tested in the past 12 months?", weight: 8 },
      { id: "nist_mg5", text: "Are retired or replaced AI models de-commissioned with data properly deleted or archived?", weight: 7 },
    ],
  },
];

type Answer = "yes" | "no" | "partial" | null;

export default function NistAiRmf() {
  const { logCheck } = useAudit();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = FUNCTIONS.flatMap(f => f.questions).reduce((s, q) => s + q.weight, 0);
  const earned = FUNCTIONS.flatMap(f => f.questions).reduce((s, q) => {
    const a = answers[q.id];
    return s + (a === "yes" ? q.weight : a === "partial" ? q.weight * 0.5 : 0);
  }, 0);
  const score = Math.round((earned / total) * 100);

  const handleSubmit = () => {
    FUNCTIONS.forEach(fn => {
      fn.questions.forEach(q => {
        const a = answers[q.id];
        const result = a === "yes" ? "PASS" : a === "partial" ? "FLAG" : "FAIL";
        logCheck({
          id: uid(), module: "NIST AI RMF", ruleId: q.id,
          input: q.text, result, statute: fn.ref, timestamp: ts(),
        });
      });
    });
    setSubmitted(true);
  };

  const OPTION_BTNS: { val: Answer; label: string; color: string; border: string }[] = [
    { val: "yes", label: "Yes", color: "rgba(18,183,106,0.12)", border: "rgba(18,183,106,0.4)" },
    { val: "partial", label: "Partial", color: "rgba(245,166,35,0.10)", border: "rgba(245,166,35,0.35)" },
    { val: "no", label: "No", color: "rgba(240,68,56,0.10)", border: "rgba(240,68,56,0.35)" },
  ];

  return (
    <AppLayout title="NIST AI RMF" subtitle="AI Risk Management Framework 1.0 — GOVERN · MAP · MEASURE · MANAGE">
      {/* Header */}
      <div className="rounded-xl p-5 mb-6 flex items-start gap-4" style={{ background: "rgba(127,119,221,0.08)", border: "1px solid rgba(127,119,221,0.2)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(127,119,221,0.15)" }}>
          <Brain className="w-5 h-5" style={{ color: "#7F77DD" }} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-foreground mb-1">NIST AI Risk Management Framework 1.0</div>
          <div className="text-[11px] text-muted-foreground leading-relaxed mb-2">Published by NIST (National Institute of Standards and Technology) in January 2023. Adopted globally as the reference framework for AI governance. Aligns with Canada's AIDA, the EU AI Act, and ISO/IEC 42001. The framework's four functions — GOVERN, MAP, MEASURE, MANAGE — create a lifecycle approach to identifying, assessing, and responding to AI risk.</div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "20 core practices", color: "#7F77DD" },
              { label: "4 core functions", color: "#7F77DD" },
              { label: "USA / International", color: "#c8f135" },
              { label: "Aligns with AIDA + ISO 42001", color: "#12b76a" },
            ].map(t => (
              <span key={t.label} className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ background: `${t.color}18`, color: t.color }}>{t.label}</span>
            ))}
          </div>
        </div>
        {submitted && (
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-semibold" style={{ color: score >= 70 ? "#12b76a" : score >= 50 ? "#f5a623" : "#f04438" }}>{score}</div>
            <div className="font-mono text-[9px] text-muted-foreground">/ 100</div>
          </div>
        )}
      </div>

      {/* Assessment */}
      <div className="space-y-6">
        {FUNCTIONS.map(fn => {
          const fnEarned = fn.questions.reduce((s, q) => {
            const a = answers[q.id];
            return s + (a === "yes" ? q.weight : a === "partial" ? q.weight * 0.5 : 0);
          }, 0);
          const fnTotal = fn.questions.reduce((s, q) => s + q.weight, 0);
          const fnPct = Math.round((fnEarned / fnTotal) * 100);

          return (
            <div key={fn.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: "rgba(127,119,221,0.12)", color: "#7F77DD" }}>{fn.id}</span>
                    <span className="text-[13px] font-semibold text-foreground">{fn.name}</span>
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground mt-0.5">{fn.ref}</div>
                </div>
                {submitted && (
                  <div className="text-right">
                    <div className="text-lg font-semibold" style={{ color: fnPct >= 70 ? "#12b76a" : fnPct >= 50 ? "#f5a623" : "#f04438" }}>{fnPct}%</div>
                    <div className="w-24 h-1 bg-border rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full bar-animate" style={{ background: fnPct >= 70 ? "#12b76a" : fnPct >= 50 ? "#f5a623" : "#f04438", width: `${fnPct}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                {fn.questions.map(q => (
                  <div key={q.id} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="text-[12px] text-foreground mb-2 leading-relaxed">{q.text}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {OPTION_BTNS.map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setAnswers(p => ({ ...p, [q.id]: opt.val }))}
                          className="px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-150"
                          style={{
                            background: answers[q.id] === opt.val ? opt.color : "transparent",
                            border: `1px solid ${answers[q.id] === opt.val ? opt.border : "rgba(255,255,255,0.08)"}`,
                            color: answers[q.id] === opt.val ? "var(--foreground)" : "var(--muted-foreground)",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                      <span className="ml-auto font-mono text-[9px] text-muted-foreground">{q.weight}pt</span>
                      {submitted && (
                        answers[q.id] === "yes"
                          ? <CheckCircle2 className="w-3.5 h-3.5 badge-pass-pulse" style={{ color: "#12b76a" }} />
                          : answers[q.id] === "partial"
                            ? <AlertTriangle className="w-3.5 h-3.5 badge-flag-pulse" style={{ color: "#f5a623" }} />
                            : <AlertTriangle className="w-3.5 h-3.5 badge-fail-pulse" style={{ color: "#f04438" }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Result */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < 3}
          className="mt-6 w-full py-3 rounded-xl text-[13px] font-semibold transition-all duration-150 disabled:opacity-40"
          style={{ background: "#c8f135", color: "#09090a" }}
        >
          Generate NIST AI RMF Assessment
        </button>
      ) : (
        <div className="mt-6 rounded-xl p-5 fade-in" style={{ background: score >= 70 ? "rgba(18,183,106,0.08)" : score >= 50 ? "rgba(245,166,35,0.08)" : "rgba(240,68,56,0.08)", border: `1px solid ${score >= 70 ? "rgba(18,183,106,0.3)" : score >= 50 ? "rgba(245,166,35,0.25)" : "rgba(240,68,56,0.25)"}` }}>
          <div className="flex items-center gap-3 mb-3">
            {score >= 70
              ? <CheckCircle2 className="w-5 h-5" style={{ color: "#12b76a" }} />
              : <AlertTriangle className="w-5 h-5" style={{ color: score >= 50 ? "#f5a623" : "#f04438" }} />
            }
            <div>
              <div className="font-semibold text-foreground">
                {score >= 70 ? "AI Risk Management — Solid Foundation" : score >= 50 ? "AI Risk Management — Gaps Present" : "AI Risk Management — Significant Gaps"}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground">{score}/100 · NIST AI RMF 1.0 · {new Date().toLocaleDateString("en-CA")}</div>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            {score >= 70
              ? "Your AI governance practices align well with the NIST AI RMF core functions. Continue monitoring deployed models and review GOVERN documentation annually. Ensure AIDA alignment as Canadian legislation is finalized."
              : score >= 50
                ? "Moderate alignment with NIST AI RMF. Priority gaps likely in the MEASURE function (bias testing, drift monitoring) and MANAGE function (incident response, human oversight). Review flagged items above."
                : "Critical gaps in AI risk management detected. Immediate attention required on AI system inventory (MAP), bias evaluation (MEASURE), and human oversight controls (MANAGE). These gaps expose your organization to AIDA liability and reputational risk."
            }
          </div>
        </div>
      )}
    </AppLayout>
  );
}
