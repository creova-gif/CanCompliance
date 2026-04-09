import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAudit, uid, ts } from "@/context/AuditContext";
import { AlertTriangle, CheckCircle2, Globe } from "lucide-react";

const CHAPTERS = [
  {
    id: "Art.5", ref: "EU AI Act — Article 5",
    name: "Prohibited AI Practices",
    questions: [
      { id: "euai_p1", text: "Does your organization use any AI system for subliminal manipulation that bypasses a person's free will (e.g., exploiting psychological vulnerabilities)?", weight: 10, inverse: true },
      { id: "euai_p2", text: "Do you use AI for real-time remote biometric identification in public spaces (prohibited except law enforcement with judicial authorization)?", weight: 10, inverse: true },
      { id: "euai_p3", text: "Do you deploy AI for social scoring of individuals by public authorities based on social behaviour?", weight: 10, inverse: true },
      { id: "euai_p4", text: "Do you use AI systems that exploit children's or disabled people's vulnerabilities to distort behaviour harmfully?", weight: 9, inverse: true },
    ],
  },
  {
    id: "Art.9–15", ref: "EU AI Act — Articles 9–15 (Annex III)",
    name: "High-Risk AI — Obligations",
    questions: [
      { id: "euai_hr1", text: "Have you classified your AI systems against the Annex III high-risk categories (hiring, credit, education, health, law enforcement, biometrics)?", weight: 10 },
      { id: "euai_hr2", text: "Is there a documented risk management system that spans the entire AI system lifecycle for each high-risk system?", weight: 10 },
      { id: "euai_hr3", text: "Is technical documentation (Art. 11) maintained for each high-risk AI system, including training data, architecture, and performance metrics?", weight: 9 },
      { id: "euai_hr4", text: "Are high-risk AI systems designed so human oversight is possible — including the ability to halt, override, or disregard AI decisions?", weight: 10 },
      { id: "euai_hr5", text: "Have high-risk AI systems undergone a conformity assessment before deployment (self-assessment or third-party per Annex VI)?", weight: 9 },
    ],
  },
  {
    id: "Art.13", ref: "EU AI Act — Article 13",
    name: "Transparency & Disclosure",
    questions: [
      { id: "euai_t1", text: "Are users of your AI system informed they are interacting with an AI system (not a human), where applicable?", weight: 9 },
      { id: "euai_t2", text: "Do you disclose when AI-generated content (deepfakes, synthetic media) is artificially created or manipulated?", weight: 8 },
      { id: "euai_t3", text: "Do affected individuals receive meaningful information about the logic and significance of AI-driven decisions affecting them?", weight: 9 },
      { id: "euai_t4", text: "Are instructions for use (Art. 13) provided with high-risk AI systems, including known limitations and intended purpose?", weight: 8 },
    ],
  },
  {
    id: "Art.17–29", ref: "EU AI Act — Articles 17–29",
    name: "Data Governance & Monitoring",
    questions: [
      { id: "euai_dg1", text: "Are training, validation, and test data sets documented, with known biases identified and mitigated (Art. 10)?", weight: 10 },
      { id: "euai_dg2", text: "Is there a Quality Management System (Art. 17) for AI systems that covers development, deployment, and post-market monitoring?", weight: 8 },
      { id: "euai_dg3", text: "For high-risk systems, is post-market monitoring (Art. 72) active to identify risks arising from real-world use?", weight: 9 },
      { id: "euai_dg4", text: "Serious incidents involving high-risk AI are reported to the relevant national authority within 15 days (Art. 73)?", weight: 9 },
    ],
  },
];

type Answer = "yes" | "no" | "partial" | null;

export default function EuAiAct() {
  const { logCheck } = useAudit();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);

  const allQ = CHAPTERS.flatMap(c => c.questions);

  const total = allQ.reduce((s, q) => s + q.weight, 0);
  const earned = allQ.reduce((s, q) => {
    const a = answers[q.id];
    if (q.inverse) {
      return s + (a === "no" ? q.weight : a === "partial" ? q.weight * 0.5 : 0);
    }
    return s + (a === "yes" ? q.weight : a === "partial" ? q.weight * 0.5 : 0);
  }, 0);
  const score = Math.round((earned / total) * 100);

  const handleSubmit = () => {
    CHAPTERS.forEach(ch => {
      ch.questions.forEach(q => {
        const a = answers[q.id];
        let result: "PASS" | "FLAG" | "FAIL";
        if (q.inverse) {
          result = a === "no" ? "PASS" : a === "partial" ? "FLAG" : "FAIL";
        } else {
          result = a === "yes" ? "PASS" : a === "partial" ? "FLAG" : "FAIL";
        }
        logCheck({
          id: uid(), module: "EU AI Act", ruleId: q.id,
          input: q.text, result, statute: ch.ref, timestamp: ts(),
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
    <AppLayout title="EU AI Act" subtitle="Regulation (EU) 2024/1689 · In force August 1, 2024 · Compliance phased to 2026">
      {/* Header */}
      <div className="rounded-xl p-5 mb-6 flex items-start gap-4" style={{ background: "rgba(200,241,53,0.06)", border: "1px solid rgba(200,241,53,0.15)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,241,53,0.1)" }}>
          <Globe className="w-5 h-5" style={{ color: "#c8f135" }} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-foreground mb-1">EU Artificial Intelligence Act — Regulation (EU) 2024/1689</div>
          <div className="text-[11px] text-muted-foreground leading-relaxed mb-2">The world's first comprehensive AI law. Entered into force August 1, 2024. Risk-tiered: Prohibited AI (immediate), High-Risk AI systems (August 2026), General-Purpose AI (August 2025). Applies to any organization offering AI systems in the EU, regardless of where they are based. Non-compliance penalties: up to €35M or 7% of global turnover.</div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Risk-tiered regulation", color: "#c8f135" },
              { label: "EU 2024/1689", color: "#7F77DD" },
              { label: "Up to €35M / 7% revenue penalty", color: "#f04438" },
              { label: "Applies to Canadian exporters to EU", color: "#f5a623" },
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

      {/* Key compliance note */}
      <div className="rounded-lg px-4 py-3 mb-6 text-[11px] text-muted-foreground leading-relaxed" style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.2)" }}>
        <span style={{ color: "#f5a623" }} className="font-semibold">Note on Prohibited Practices:</span> For prohibited AI questions (Article 5), answering "No" is the correct/compliant answer. If your organization uses any of these practices, you are non-compliant and must immediately cease use.
      </div>

      {/* Assessment */}
      <div className="space-y-6">
        {CHAPTERS.map(ch => {
          const chEarned = ch.questions.reduce((s, q) => {
            const a = answers[q.id];
            if (q.inverse) return s + (a === "no" ? q.weight : a === "partial" ? q.weight * 0.5 : 0);
            return s + (a === "yes" ? q.weight : a === "partial" ? q.weight * 0.5 : 0);
          }, 0);
          const chTotal = ch.questions.reduce((s, q) => s + q.weight, 0);
          const chPct = Math.round((chEarned / chTotal) * 100);

          return (
            <div key={ch.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: "rgba(200,241,53,0.10)", color: "#c8f135" }}>{ch.id}</span>
                    <span className="text-[13px] font-semibold text-foreground">{ch.name}</span>
                    {ch.id === "Art.5" && <span className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(240,68,56,0.12)", color: "#f04438" }}>PROHIBITED</span>}
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground mt-0.5">{ch.ref}</div>
                </div>
                {submitted && (
                  <div className="text-right">
                    <div className="text-lg font-semibold" style={{ color: chPct >= 70 ? "#12b76a" : chPct >= 50 ? "#f5a623" : "#f04438" }}>{chPct}%</div>
                    <div className="w-24 h-1 bg-border rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full bar-animate" style={{ background: chPct >= 70 ? "#12b76a" : chPct >= 50 ? "#f5a623" : "#f04438", width: `${chPct}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                {ch.questions.map(q => (
                  <div key={q.id} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-start gap-2 mb-2">
                      {q.inverse && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ background: "rgba(240,68,56,0.12)", color: "#f04438" }}>PROHIBITED</span>}
                      <div className="text-[12px] text-foreground leading-relaxed">{q.text}</div>
                    </div>
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
                        (() => {
                          const a = answers[q.id];
                          const passed = q.inverse ? a === "no" : a === "yes";
                          const flagged = q.inverse ? a === "partial" : a === "partial";
                          return passed
                            ? <CheckCircle2 className="w-3.5 h-3.5 badge-pass-pulse" style={{ color: "#12b76a" }} />
                            : flagged
                              ? <AlertTriangle className="w-3.5 h-3.5 badge-flag-pulse" style={{ color: "#f5a623" }} />
                              : <AlertTriangle className="w-3.5 h-3.5 badge-fail-pulse" style={{ color: "#f04438" }} />;
                        })()
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
          Generate EU AI Act Compliance Assessment
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
                {score >= 70 ? "EU AI Act — Good Alignment" : score >= 50 ? "EU AI Act — Moderate Gaps" : "EU AI Act — Critical Compliance Gaps"}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground">{score}/100 · EU 2024/1689 · {new Date().toLocaleDateString("en-CA")}</div>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            {score >= 70
              ? "Your organization shows strong EU AI Act alignment. Ensure you are registered in the EU AI database if applicable (August 2026 deadline), and maintain your technical documentation for high-risk systems."
              : score >= 50
                ? "Moderate compliance posture. Key gaps likely in High-Risk AI obligations (Articles 9–15) — particularly conformity assessment and human oversight requirements. Address before the August 2026 enforcement deadline."
                : "Critical gaps detected. If you offer AI systems to EU users, non-compliance exposes you to fines of up to €35M or 7% of global annual turnover. Immediate legal review recommended. Prohibited practices (Article 5) must cease immediately if applicable."
            }
          </div>
        </div>
      )}
    </AppLayout>
  );
}
