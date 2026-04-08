import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { FileText, Upload, AlertTriangle, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useAuth } from "@clerk/react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface Finding {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "PASS";
  law: string;
  clause: string;
  issue: string;
  fix: string;
  statute: string;
}

interface ScanResult {
  documentType: string;
  overallRisk: "Critical" | "High" | "Medium" | "Low" | "Pass";
  findingsCount: { critical: number; high: number; medium: number; low: number; pass: number };
  findings: Finding[];
  summary: string;
}

const SEVERITY_CONFIG = {
  CRITICAL: { label: "CRITICAL", bg: "bg-fail/10", text: "text-fail", border: "border-fail/20" },
  HIGH: { label: "HIGH", bg: "bg-flag/10", text: "text-flag", border: "border-flag/20" },
  MEDIUM: { label: "MEDIUM", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  LOW: { label: "LOW", bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
  PASS: { label: "PASS", bg: "bg-pass/10", text: "text-pass", border: "border-pass/20" },
};

const SAMPLE_CONTRACTS = [
  {
    label: "Privacy Policy (with issues)",
    text: `PRIVACY POLICY

We collect your name, email address, phone number, location data, browsing history, and device information when you use our service.

We may share your information with our partners, affiliates, and third parties for marketing purposes. We may also sell your data to data brokers.

We send promotional emails to all registered users. By creating an account, you consent to receive marketing communications.

We store your data on servers located in the United States.

We keep your data indefinitely.

If you have questions, email us at privacy@example.com.`,
  },
  {
    label: "Employment Contract (with issues)",
    text: `EMPLOYMENT AGREEMENT

Employee agrees to be available 24/7 and work as many hours as required by the employer.

Overtime will be compensated at the regular rate of pay.

Employee waives all rights to vacation pay.

Either party may terminate this agreement without notice.

Non-compete clause: Employee shall not work in any related field for 5 years anywhere in Canada following termination.

Employee consents to monitoring of all communications including personal devices.

This agreement is governed by the laws of Delaware, USA.`,
  },
  {
    label: "Clean supplier agreement",
    text: `SUPPLIER AGREEMENT

This agreement is between ABC Corp (the "Supplier") and XYZ Ltd (the "Purchaser").

1. GOODS AND SERVICES: Supplier agrees to provide goods as described in Schedule A.

2. PAYMENT: Payment terms are Net 30 from invoice date.

3. DATA PROTECTION: Both parties agree to comply with PIPEDA and applicable provincial privacy laws. Personal information exchanged shall be used only for the purposes of this agreement.

4. FORCED LABOUR: Supplier certifies compliance with the Fighting Against Forced Labour and Child Labour in Supply Chains Act (S-211).

5. CASL COMPLIANCE: Any commercial electronic messages sent in connection with this agreement comply with CASL requirements.

6. GOVERNING LAW: This agreement is governed by the laws of Ontario.`,
  },
];

function parseScanResponse(text: string): ScanResult {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]+?)\n```/) || text.match(/\{[\s\S]+\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
  } catch {}
  const findings: Finding[] = [];
  const lines = text.split("\n");
  let documentType = "Contract";
  let overallRisk: ScanResult["overallRisk"] = "Medium";
  let summary = "";
  for (const line of lines) {
    if (line.toLowerCase().includes("document type:")) documentType = line.split(":")[1]?.trim() || documentType;
    if (line.toLowerCase().includes("overall risk:")) {
      const r = line.split(":")[1]?.trim() || "";
      if (r.toLowerCase().includes("critical")) overallRisk = "Critical";
      else if (r.toLowerCase().includes("high")) overallRisk = "High";
      else if (r.toLowerCase().includes("medium")) overallRisk = "Medium";
      else if (r.toLowerCase().includes("low")) overallRisk = "Low";
      else if (r.toLowerCase().includes("pass")) overallRisk = "Pass";
    }
  }
  const summaryMatch = text.match(/summary[:\s]+([^\n]+(?:\n(?![A-Z])[^\n]+)*)/i);
  if (summaryMatch) summary = summaryMatch[1].trim().substring(0, 400);
  const critical = (text.match(/CRITICAL/g) || []).length;
  const high = (text.match(/\bHIGH\b/g) || []).length;
  const medium = (text.match(/\bMEDIUM\b/g) || []).length;
  return {
    documentType,
    overallRisk,
    findingsCount: { critical, high, medium, low: 0, pass: 0 },
    findings,
    summary: summary || text.substring(0, 600),
  };
}

export default function DocumentScanner() {
  const { getToken } = useAuth();
  const [docText, setDocText] = useState("");
  const [docName, setDocName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [rawOutput, setRawOutput] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocName(file.name);
    const text = await file.text();
    setDocText(text.substring(0, 8000));
  }

  function loadSample(sample: typeof SAMPLE_CONTRACTS[0]) {
    setDocText(sample.text);
    setDocName(sample.label);
    setResult(null);
    setRawOutput("");
    setError("");
  }

  async function scan() {
    if (!docText.trim()) return;
    setScanning(true);
    setResult(null);
    setRawOutput("");
    setError("");

    try {
      const token = await getToken();

      // System 5 — Document Scanner v2: per-type specialized prompts
      // Detect document type from content and filename to choose specialized prompt
      const textLower = (docText + " " + docName).toLowerCase();
      let detectedType = "general";
      if (textLower.includes("privacy") || textLower.includes("personal information") || textLower.includes("data protection")) detectedType = "privacy";
      else if (textLower.includes("employment") || textLower.includes("employee") || textLower.includes("termination") || textLower.includes("salary")) detectedType = "employment";
      else if (textLower.includes("supplier") || textLower.includes("vendor") || textLower.includes("supply chain") || textLower.includes("forced labour")) detectedType = "supplier";
      else if (textLower.includes("terms of service") || textLower.includes("terms and conditions") || textLower.includes("user agreement")) detectedType = "tos";
      else if (textLower.includes("marketing") || textLower.includes("email") || textLower.includes("consent") || textLower.includes("unsubscribe")) detectedType = "casl";
      else if (textLower.includes("esg") || textLower.includes("sustainability") || textLower.includes("environmental") || textLower.includes("green")) detectedType = "esg";
      else if (textLower.includes("contract") || textLower.includes("agreement") || textLower.includes("services agreement")) detectedType = "contract";

      const TYPE_EXPERT_PROMPTS: Record<string, string> = {
        privacy: `You are a Canadian privacy law expert specializing in PIPEDA, Quebec Law 25, and the incoming CPPA 2026. Focus your analysis on: (1) PIPEDA's 10 fair information principles, especially consent, purpose limitation, and data retention, (2) Quebec Law 25 — privacy impact assessments, explicit consent for sensitive data, right to deindexing, (3) CPPA incoming — automated decision-making, algorithmic transparency, right to deletion, (4) CASL intersection — if marketing is mentioned, email consent requirements, (5) Cross-border data transfer clauses (PIPEDA S.7), (6) Data breach notification language (under 72-hour requirement).`,
        employment: `You are a Canadian employment law expert covering all provinces. Focus on: (1) Employment Standards Acts — province-specific overtime thresholds (ON: 44hrs/week, BC: 40hrs/week), vacation entitlements (ON: min 2 weeks/year), (2) Termination clauses — working notice, pay in lieu, ESA minimums vs. common law, (3) Non-compete enforceability — Ontario ban on non-competes since Oct 2021 (ESA S.67.2), BC and other provinces, (4) WSIB/WCB mandatory coverage disclosure, (5) Ontario AI hiring disclosure (Workers for Workers Act IV), (6) Pay transparency requirements (BC Pay Transparency Act, Ontario Pay Transparency Act), (7) Misclassification of employees as independent contractors.`,
        supplier: `You are a Canadian trade and supply chain compliance expert. Focus on: (1) Fighting Against Forced Labour and Child Labour in Supply Chains Act (S-211) — due diligence requirements, annual reporting obligation (May 31 deadline), (2) CBSA CARM — bond requirements, classification obligations, (3) PIPEDA data sharing clauses for supplier data, (4) Competition Act S.74.01 — misleading claims in supplier representations, (5) Product safety obligations under CCPSA if goods are involved, (6) French language requirements under Bill 96 for Quebec suppliers, (7) Environmental compliance for goods imported or manufactured.`,
        tos: `You are a Canadian consumer protection and digital law expert. Focus on: (1) CASL S.6 — if electronic messages are mentioned, consent and unsubscribe requirements, (2) Consumer Protection Acts (Ontario CPA, BC BPCPA) — unfair practices, cooling-off periods, (3) Competition Act — misleading advertising, drip pricing (S.74.01(1.1) — mandatory price components disclosure), (4) PIPEDA data collection through terms — implied consent is insufficient for digital services under CAI guidelines, (5) Quebec Law 25 — francophone users must receive services in French, (6) Limitation of liability clauses vs. consumer rights that cannot be waived, (7) Auto-renewal subscription disclosure requirements.`,
        casl: `You are a CASL (Canada's Anti-Spam Legislation) expert. This document may involve commercial electronic messages. Focus exclusively on: (1) CASL S.6 — three requirements: consent (express vs. implied), sender identification, unsubscribe mechanism, (2) Express consent requirements — specific request, cannot be bundled with other consents, pre-checked boxes ARE invalid (CRTC Bulletin), (3) Implied consent categories — existing business relationship (expires 2 years after last transaction per S.10(9)(a)), existing non-business relationship (expires 2 years), conspicuous publication (S.10(9)(b)), (4) Unsubscribe mechanism — must process within 10 business days per S.11(3), (5) CRTC enforcement context: 4 fines Q1 2026, $1.1M fine January 2026, implied consent expiry top trigger, (6) S.13 — prohibition on harvesting email addresses, (7) CASL S.2 "commercial electronic message" definition — does this document involve CEMs?`,
        esg: `You are a Canadian ESG, competition, and environmental compliance expert. Focus on: (1) Competition Act (Bill C-59, in force) — greenwashing provisions S.74.01(1)(b), environmental claims must have "adequate and proper testing", up to 3% global revenue or $10M penalty, (2) S-211 Forced Labour Act — ESG supply chain due diligence reporting, (3) Ontario Blue Box EPR and provincial EPR schemes — producer responsibility reporting, (4) Federal TCFD-aligned climate disclosure requirements for public companies, (5) Corporate Net-Zero claims — Competition Bureau guidance on sustainability claim substantiation, (6) Environmental false or misleading representations in advertising.`,
        contract: `You are a Canadian commercial contracts and regulatory compliance expert. Focus on: (1) PIPEDA data sharing provisions in the contract, (2) CASL compliance for any marketing or communications provisions, (3) S-211 forced labour representation and warranty clauses, (4) Competition Act — representations that could be misleading, (5) Province-specific law governing clauses — enforceability by province, (6) Limitation of liability vs. negligence standards, (7) Termination and dispute resolution — arbitration clauses and consumer rights in Quebec (CAI).`,
        general: `You are a senior Canadian business compliance lawyer with expertise across CASL, PIPEDA, Law 25, CPPA, Employment Standards (all provinces), CCPSA, Competition Act (including Bill C-59 greenwashing), S-211, FINTRAC, Bill 96, OHSA, and customs/trade law. Analyze this document comprehensively.`,
      };

      const expertContext = TYPE_EXPERT_PROMPTS[detectedType] || TYPE_EXPERT_PROMPTS.general;

      const systemPrompt = `${expertContext}

ENFORCEMENT CONTEXT (April 2026):
- Bill C-12 IN FORCE (Mar 26, 2026): FINTRAC effectiveness standard changed — if FINTRAC is relevant, flag it
- CRTC: 4 CASL enforcement fines Q1 2026 — implied consent expiry is top trigger
- Quebec CAI joint audits with CRTC — Law 25 + CASL cross-compliance
- Competition Bureau: actively pursuing greenwashing cases under Bill C-59

Return a JSON object with this exact structure:
{
  "documentType": "Privacy Policy | Employment Contract | Supplier Agreement | Terms of Service | CASL/Marketing | ESG Policy | Commercial Contract | Other",
  "overallRisk": "Critical | High | Medium | Low | Pass",
  "summary": "2-3 sentence summary of compliance status, mentioning the most serious issues",
  "findingsCount": { "critical": 0, "high": 0, "medium": 0, "low": 0, "pass": 0 },
  "findings": [
    {
      "severity": "CRITICAL | HIGH | MEDIUM | LOW | PASS",
      "law": "CASL | PIPEDA | Law 25 | CPPA | Bill 96 | Employment Standards | S-211 | Competition Act | OHSA | FINTRAC | Other",
      "clause": "specific clause text or section reference from the document",
      "issue": "what is specifically wrong with this clause under Canadian law",
      "fix": "exact corrective language or action required",
      "statute": "exact statute section e.g. CASL S.6(1)(a), PIPEDA Schedule 1 Principle 4.3"
    }
  ]
}

Include both issues (CRITICAL/HIGH/MEDIUM/LOW) AND things done correctly (PASS). Be specific — cite the exact clause from the document and the exact statute. Do not be generic. This is Canadian law, not American.`;

      const response = await fetch(`${API_BASE}/api/anthropic/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: `Document Scan: ${docName || "Untitled"}` }),
      });
      if (!response.ok) throw new Error("Failed to create conversation");
      const { id: convId } = await response.json();

      const msgResponse = await fetch(`${API_BASE}/api/anthropic/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          role: "user",
          content: `Please analyze this document for Canadian compliance issues:\n\n---\n${docText}\n---\n\n${systemPrompt}`,
        }),
      });

      if (!msgResponse.ok || !msgResponse.body) throw new Error("Scan failed");

      const reader = msgResponse.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.delta) fullText += data.delta;
              else if (data.content) fullText += data.content;
            } catch {}
          }
        }
      }

      setRawOutput(fullText);
      const parsed = parseScanResponse(fullText);
      setResult(parsed);
    } catch (err: any) {
      setError(err.message || "Scan failed. Please try again.");
    } finally {
      setScanning(false);
    }
  }

  const riskColor = result ? {
    "Critical": "#f04438",
    "High": "#f5a623",
    "Medium": "#c8f135",
    "Low": "#12b76a",
    "Pass": "#12b76a",
  }[result.overallRisk] : "#c8f135";

  return (
    <AppLayout title="Document Scanner" subtitle="Upload a contract or policy — Claude flags Canadian compliance issues">
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">AI Feature · Pro</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Contract & Document Scanner</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            Upload a contract, privacy policy, employment agreement, or supplier terms. Claude reads it and flags 
            CASL non-compliance, PIPEDA/Law 25 gaps, employment standard violations, greenwashing claims, 
            and missing S-211 language — with exact statute citations and fix recommendations.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[13px] font-medium text-foreground">Document Input</div>
                <div className="text-[11px] text-muted-foreground font-mono">Paste text or upload a .txt / .md file — max 8,000 characters</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Lock className="w-3 h-3" />
              Not stored after scan
            </div>
          </div>

          {/* Sample contracts */}
          <div className="px-5 pt-4">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Try a sample</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {SAMPLE_CONTRACTS.map(s => (
                <button
                  key={s.label}
                  data-testid={`sample-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => loadSample(s)}
                  className="px-3 py-1 rounded-md text-[11px] border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 pb-5 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  {docName ? `File: ${docName}` : "Document Text"}
                </label>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors font-mono"
                >
                  <Upload className="w-3 h-3" />
                  Upload file
                </button>
                <input ref={fileRef} type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleFile} />
              </div>
              <textarea
                data-testid="textarea-document"
                value={docText}
                onChange={e => setDocText(e.target.value)}
                placeholder="Paste your contract, privacy policy, employment agreement, or terms of service here..."
                className="w-full bg-muted border border-border rounded-md px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none leading-relaxed"
                rows={10}
              />
              <div className="text-[10px] text-muted-foreground font-mono mt-1 text-right">{docText.length}/8,000 chars</div>
            </div>
            <button
              data-testid="btn-scan-document"
              onClick={scan}
              disabled={!docText.trim() || scanning}
              className="px-6 py-2.5 rounded-md text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ background: "#c8f135", color: "#09090a" }}
            >
              {scanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning with Claude...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Scan Document
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-fail/10 border border-fail/20 rounded-xl px-5 py-3 text-[13px] text-fail flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Overview */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium text-foreground">Scan Results — {result.documentType}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">Claude compliance audit · {new Date().toLocaleDateString("en-CA")}</div>
                </div>
                <div
                  className="font-mono text-[11px] px-3 py-1 rounded-md font-semibold"
                  style={{ background: `${riskColor}20`, color: riskColor }}
                >
                  {result.overallRisk} Risk
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[13px] text-foreground leading-relaxed mb-4">{result.summary}</p>
                <div className="grid grid-cols-5 gap-3">
                  {(["critical", "high", "medium", "low", "pass"] as const).map(sev => (
                    <div key={sev} className="bg-muted rounded-lg p-3 text-center">
                      <div className={`text-xl font-semibold mb-0.5 ${
                        sev === "critical" ? "text-fail" :
                        sev === "high" ? "text-flag" :
                        sev === "medium" ? "text-yellow-400" :
                        sev === "pass" ? "text-pass" : "text-muted-foreground"
                      }`}>{result.findingsCount[sev]}</div>
                      <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">{sev}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Findings */}
            {result.findings.length > 0 && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <div className="text-[13px] font-medium text-foreground">Detailed Findings</div>
                  <div className="text-[11px] text-muted-foreground font-mono">Statute citations and fix recommendations</div>
                </div>
                <div className="divide-y divide-border">
                  {result.findings.map((finding, i) => {
                    const cfg = SEVERITY_CONFIG[finding.severity];
                    return (
                      <div key={i}>
                        <div
                          className="px-5 py-3.5 cursor-pointer hover:bg-muted/20 transition-colors flex items-start gap-3"
                          onClick={() => setExpanded(expanded === i ? null : i)}
                          data-testid={`finding-${i}`}
                        >
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium text-foreground">{finding.law} — {finding.clause}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">{finding.statute}</div>
                          </div>
                          {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                        </div>
                        {expanded === i && (
                          <div className="px-5 pb-4 pl-16 space-y-3">
                            <div>
                              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Issue</div>
                              <p className="text-[12px] text-foreground leading-relaxed">{finding.issue}</p>
                            </div>
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                              <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Recommended Fix
                              </div>
                              <p className="text-[12px] text-foreground leading-relaxed">{finding.fix}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Raw output toggle */}
            {rawOutput && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="w-full px-5 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <span className="font-mono text-[11px] text-muted-foreground">Full Claude analysis</span>
                  {showRaw ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                {showRaw && (
                  <div className="px-5 pb-5">
                    <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                      {rawOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Disclosure */}
        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>Document text is sent to Anthropic (Claude) for analysis and is not stored by CanCompliance. This tool provides guidance — not legal advice. Consult a Canadian lawyer for binding legal matters.</span>
        </div>
      </div>
    </AppLayout>
  );
}
