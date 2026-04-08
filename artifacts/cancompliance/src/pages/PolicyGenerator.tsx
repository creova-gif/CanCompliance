import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { FileText, Loader2, Copy, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { useAuth } from "@clerk/react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const POLICY_TYPES = [
  {
    id: "casl_consent",
    label: "CASL Consent Capture Form",
    description: "Express consent form with CRTC-compliant language, sender ID, and purpose statement",
    laws: ["CASL S.6–10", "CRTC Reg 2012-36"],
    badge: "HIGH PRIORITY",
    badgeColor: "#f04438",
    inputs: [
      { id: "business_name", label: "Business Name", placeholder: "Acme Corp", type: "text" },
      { id: "province", label: "Province", type: "select", options: ["Ontario", "British Columbia", "Quebec", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "PEI", "Newfoundland"] },
      { id: "message_type", label: "Type of commercial messages", placeholder: "e.g. promotional emails, newsletters, product updates", type: "text" },
      { id: "website", label: "Website / unsubscribe URL", placeholder: "https://example.com/unsubscribe", type: "text" },
    ],
  },
  {
    id: "privacy_policy",
    label: "PIPEDA + Law 25 Privacy Policy",
    description: "Full bilingual privacy policy covering PIPEDA principles, Quebec Law 25 requirements, and CPPA readiness",
    laws: ["PIPEDA Sch.1", "Law 25", "CPPA (incoming)"],
    badge: "RECOMMENDED",
    badgeColor: "#c8f135",
    inputs: [
      { id: "business_name", label: "Business Name", placeholder: "Acme Corp", type: "text" },
      { id: "province", label: "Primary Province", type: "select", options: ["Ontario", "British Columbia", "Quebec", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "PEI", "Newfoundland"] },
      { id: "data_types", label: "Data types collected", placeholder: "e.g. name, email, payment, browsing history", type: "text" },
      { id: "third_parties", label: "Third-party services", placeholder: "e.g. Stripe, Mailchimp, Google Analytics", type: "text" },
      { id: "us_transfer", label: "US data transfer?", type: "select", options: ["Yes — data processed in USA", "No — Canada-only processing"] },
    ],
  },
  {
    id: "casl_unsubscribe",
    label: "CASL Unsubscribe Mechanism Policy",
    description: "Internal policy for maintaining a CASL-compliant unsubscribe process with 10-business-day processing requirement",
    laws: ["CASL S.11", "CRTC CASL Compliance Bulletin 2015-2-1"],
    badge: null,
    badgeColor: null,
    inputs: [
      { id: "business_name", label: "Business Name", placeholder: "Acme Corp", type: "text" },
      { id: "unsubscribe_email", label: "Unsubscribe email address", placeholder: "unsubscribe@example.com", type: "text" },
      { id: "responsible_person", label: "Responsible person / title", placeholder: "Marketing Manager", type: "text" },
      { id: "crm_system", label: "CRM / email platform used", placeholder: "e.g. Mailchimp, HubSpot, Salesforce", type: "text" },
    ],
  },
  {
    id: "electronic_monitoring",
    label: "Ontario Electronic Monitoring Policy",
    description: "Mandatory written policy for Ontario employers with 25+ employees — required under ESA s.21.1.1",
    laws: ["ESA S.21.1.1 (O. Reg. 128/22)", "Ontario Human Rights Code"],
    badge: "MANDATORY 25+",
    badgeColor: "#f5a623",
    inputs: [
      { id: "business_name", label: "Business Name", placeholder: "Acme Corp", type: "text" },
      { id: "employee_count", label: "Number of employees", placeholder: "e.g. 32", type: "text" },
      { id: "monitoring_types", label: "Monitoring methods used", placeholder: "e.g. email monitoring, GPS tracking, screen monitoring", type: "text" },
      { id: "monitoring_purpose", label: "Purpose of monitoring", placeholder: "e.g. security, productivity, quality assurance", type: "text" },
    ],
  },
  {
    id: "harassment_prevention",
    label: "BC Psychological Harassment Prevention Policy",
    description: "Mandatory policy under BC Workers Compensation Act — psychological safety requirements in force September 2025",
    laws: ["Workers Compensation Act S.116–121", "WorkSafeBC OHS Reg 4.112"],
    badge: "BC MANDATORY",
    badgeColor: "#9b8afb",
    inputs: [
      { id: "business_name", label: "Business Name", placeholder: "Acme Corp", type: "text" },
      { id: "industry", label: "Industry", placeholder: "e.g. retail, healthcare, technology", type: "text" },
      { id: "reporting_person", label: "Harassment complaint contact", placeholder: "e.g. HR Manager, Title", type: "text" },
      { id: "investigation_timeline", label: "Investigation timeline (days)", placeholder: "e.g. 30", type: "text" },
    ],
  },
];

export default function PolicyGenerator() {
  const { getToken } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("casl_consent");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [policy, setPolicy] = useState<string>("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const selected = POLICY_TYPES.find(p => p.id === selectedType)!;

  const setInput = (id: string, val: string) => setInputs(prev => ({ ...prev, id: val, [id]: val }));

  const generate = async () => {
    setGenerating(true);
    setPolicy("");
    setError("");

    const contextLines = selected.inputs.map(inp => `${inp.label}: ${inputs[inp.id] || "Not provided"}`).join("\n");

    const prompts: Record<string, string> = {
      casl_consent: `You are a Canadian compliance lawyer specializing in CASL (Canada's Anti-Spam Legislation).

Generate a complete CASL express consent form for the following business:
${contextLines}

The consent form must:
1. Be clearly labeled as an express consent checkbox (unchecked by default)
2. Name the sender clearly with business name and contact information
3. State exactly what types of commercial electronic messages will be sent
4. Include a working unsubscribe mechanism
5. Cite CASL S.6(1) requirements
6. Include implied consent notice for existing business relationships (CASL S.10(9))
7. Add a "Not Legal Advice" disclaimer
8. Be in plain English (and French notice for Quebec businesses)

Format as a complete, production-ready consent form with HTML comment annotations showing what each section satisfies.`,

      privacy_policy: `You are a Canadian privacy lawyer specializing in PIPEDA and Quebec Law 25.

Generate a complete Privacy Policy for the following business:
${contextLines}

The policy must cover all 10 PIPEDA Fair Information Principles, specifically:
- Principle 1: Accountability (name privacy officer or contact)
- Principle 2: Identifying purposes (list all specific uses)
- Principle 3: Consent (express vs. implied consent procedures)
- Principle 4.1.3: Cross-border transfers (if US_transfer = Yes, add mandatory PIPEDA disclosure)
- Principle 5: Limiting collection (data minimization statement)
- Principle 8: Openness (how to access/correct/delete data)
- Principle 9: Individual access (30-day response timeline)

If province = Quebec: Add Law 25 specific sections:
- Privacy Impact Assessment (PIA) obligation (s.63)
- Privacy by default (s.9.1)
- Automated decision-making disclosure (s.12.1)
- 72-hour breach notification (s.3.8)

Include "Not legal advice — have your lawyer review this policy."`,

      casl_unsubscribe: `You are a Canadian CASL compliance expert.

Generate a complete internal CASL Unsubscribe Mechanism Policy for:
${contextLines}

The policy must document:
1. All unsubscribe methods available (email, link, reply, phone — per CASL S.11(1))
2. 10-business-day processing requirement (CASL S.11(2))
3. No-charge unsubscribe rule (CASL S.11(1)(d))
4. Record retention requirements (PCMLTFA-aligned, minimum 3 years)
5. How list suppression is maintained in ${inputs.crm_system || "the CRM system"}
6. Roles and responsibilities for compliance
7. Regular audit process (minimum quarterly)
8. Escalation procedure for complaints
9. Reference to CRTC Compliance Bulletin 2015-2-1

Format as a formal internal policy document with version date, effective date, and approval section.`,

      electronic_monitoring: `You are a Canadian employment lawyer specializing in Ontario ESA compliance.

Generate a complete Ontario Electronic Monitoring Policy for:
${contextLines}

This policy is MANDATORY under Employment Standards Act, 2000 s.21.1.1 and O.Reg. 128/22 for employers with 25+ employees.

The policy must include:
1. Statement that electronic monitoring takes place
2. Description of monitoring: ${inputs.monitoring_types || "as specified"}
3. Purpose of monitoring: ${inputs.monitoring_purpose || "as specified"}
4. How the information collected may be used
5. Employee notification process
6. Data retention and destruction schedule
7. Who can access monitoring data
8. Employee rights under the Ontario Human Rights Code
9. Effective date and version number
10. Acknowledgment signature section

Include: "This policy was prepared in compliance with ESA s.21.1.1 and O.Reg. 128/22. Employers must provide this written policy to all employees within 30 days of a new employee's start date. Not legal advice."`,

      harassment_prevention: `You are a Canadian HR lawyer specializing in British Columbia workplace health and safety law.

Generate a complete Psychological Harassment Prevention Policy for:
${contextLines}

This policy is MANDATORY under BC Workers Compensation Act and WorkSafeBC OHS Regulation 4.112, effective September 1, 2025.

The policy must include:
1. Statement of commitment to psychological safety and harassment-free workplace
2. Definition of workplace harassment (WCA S.116 definition)
3. Examples of prohibited conduct (repeated behaviour + single serious incidents)
4. Reporting procedure — report to ${inputs.reporting_person || "designated person"}
5. Investigation process and timeline: ${inputs.investigation_timeline || "30"} days
6. Interim protective measures
7. Confidentiality obligations
8. Anti-retaliation protections
9. Training and awareness requirements
10. Annual policy review requirement
11. Reference to Workers Compensation Act S.116–121 and OHS Reg 4.112

Include: "This policy complies with WorkSafeBC OHS Regulation 4.112 (effective September 1, 2025). Not legal advice — consult an employment lawyer for your specific situation."`,
    };

    try {
      const token = await getToken();
      const resp = await fetch(`${API_BASE}/api/anthropic/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: `Policy: ${selected.label}` }),
      });
      if (!resp.ok) throw new Error("Failed to create conversation");
      const { id: convId } = await resp.json();

      const msgResp = await fetch(`${API_BASE}/api/anthropic/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: prompts[selectedType] }),
      });
      if (!msgResp.ok) throw new Error("Failed to generate policy");

      const reader = msgResp.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const d = JSON.parse(line.slice(6));
              if (d.content) { full += d.content; setPolicy(full); }
            } catch {}
          }
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate policy. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(policy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout title="Policy Generator" subtitle="AI-generated Canadian compliance policies — Claude Sonnet 4">
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-6 p-5 rounded-xl border border-border bg-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#c8f13518" }}>
            <Wand2 className="w-5 h-5" style={{ color: "#c8f135" }} />
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "#c8f135" }}>System 6 — Policy Generator</div>
            <div className="text-[14px] font-semibold text-foreground mb-1">5 compliance-ready policies powered by Claude Sonnet</div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Select a policy type, fill in your business details, and Claude generates a statute-cited, jurisdiction-specific policy in under 60 seconds.
              Each policy is tailored to Canadian law — not a generic template. Always have a lawyer review before using in production.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {POLICY_TYPES.map(p => (
            <button
              key={p.id}
              data-testid={`policy-type-${p.id}`}
              onClick={() => { setSelectedType(p.id); setPolicy(""); setError(""); setInputs({}); }}
              className="relative p-3 rounded-xl border text-left transition-all"
              style={selectedType === p.id
                ? { background: "#c8f13510", borderColor: "#c8f13540", boxShadow: "0 0 16px rgba(200,241,53,0.08)" }
                : { background: "var(--card)", borderColor: "var(--border)" }
              }
            >
              {p.badge && (
                <div className="font-mono text-[8px] px-1.5 py-0.5 rounded mb-2 inline-block" style={{ background: p.badgeColor + "20", color: p.badgeColor! }}>
                  {p.badge}
                </div>
              )}
              <div className="text-[11px] font-semibold text-foreground leading-snug mb-1">{p.label}</div>
              <div className="text-[10px] text-muted-foreground leading-relaxed">{p.description.slice(0, 60)}...</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.laws.map(l => (
                  <span key={l} className="font-mono text-[8px] text-muted-foreground">{l}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Input panel */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-foreground">{selected.label}</div>
                  <div className="font-mono text-[9px] text-muted-foreground mt-0.5">{selected.laws.join(" · ")}</div>
                </div>
                {selected.badge && (
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ background: selected.badgeColor + "20", color: selected.badgeColor! }}>
                    {selected.badge}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div className="text-[12px] text-muted-foreground leading-relaxed">{selected.description}</div>

                {selected.inputs.map(inp => (
                  <div key={inp.id}>
                    <label className="block font-mono text-[9px] text-muted-foreground uppercase tracking-wide mb-1.5">{inp.label}</label>
                    {inp.type === "select" ? (
                      <select
                        data-testid={`input-${inp.id}`}
                        value={inputs[inp.id] || ""}
                        onChange={e => setInput(inp.id, e.target.value)}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary"
                      >
                        <option value="">Select...</option>
                        {(inp as any).options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        data-testid={`input-${inp.id}`}
                        type="text"
                        value={inputs[inp.id] || ""}
                        onChange={e => setInput(inp.id, e.target.value)}
                        placeholder={(inp as any).placeholder || ""}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                      />
                    )}
                  </div>
                ))}

                <button
                  data-testid="btn-generate-policy"
                  onClick={generate}
                  disabled={generating}
                  className="w-full py-3 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: "#c8f135", color: "#09090a" }}
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating with Claude...</>
                  ) : (
                    <><Wand2 className="w-4 h-4" /> Generate Policy</>
                  )}
                </button>
                <p className="text-[10px] text-muted-foreground text-center font-mono">Not legal advice · Have your lawyer review</p>
              </div>
            </div>
          </div>

          {/* Output panel */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl overflow-hidden min-h-[400px] flex flex-col">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <div className="text-[13px] font-semibold text-foreground">Generated Policy</div>
                {policy && (
                  <button
                    data-testid="btn-copy-policy"
                    onClick={copy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {copied ? <><CheckCircle className="w-3.5 h-3.5 text-pass" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                )}
              </div>

              <div className="flex-1 p-5">
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-fail/10 border border-fail/20 mb-4">
                    <AlertTriangle className="w-4 h-4 text-fail flex-shrink-0 mt-0.5" />
                    <div className="text-[12px] text-fail">{error}</div>
                  </div>
                )}

                {!policy && !error && !generating && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <FileText className="w-12 h-12 text-muted-foreground/20 mb-4" />
                    <div className="text-[13px] text-muted-foreground mb-2">Configure inputs on the left and click Generate</div>
                    <div className="text-[11px] text-muted-foreground/60 font-mono">Claude Sonnet 4 · Statute-cited · Canadian law</div>
                  </div>
                )}

                {(policy || generating) && (
                  <div className="relative">
                    {generating && !policy && (
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground mb-4">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        Claude is generating your policy...
                      </div>
                    )}
                    <div className="font-mono text-[11px] text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-xl p-4 border border-border max-h-[600px] overflow-y-auto">
                      {policy}
                      {generating && <span className="animate-pulse text-primary">▌</span>}
                    </div>

                    {!generating && policy && (
                      <div className="mt-4 p-4 rounded-xl border flex items-start gap-3" style={{ background: "#f5a62310", borderColor: "#f5a62325" }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f5a623" }} />
                        <p className="text-[11px] leading-relaxed" style={{ color: "#f5a623" }}>
                          This policy was generated by AI and cites Canadian statutes as of April 2026. Laws change — have a qualified Canadian lawyer review this before publishing or distributing it.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
