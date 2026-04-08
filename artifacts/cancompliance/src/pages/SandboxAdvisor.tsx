import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Lightbulb, CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp, AlertTriangle, DollarSign } from "lucide-react";

interface Program {
  id: string;
  name: string;
  authority: string;
  sector: string[];
  type: "Sandbox" | "Exemption" | "Pilot" | "Funding";
  fundingAmount?: string;
  deadline?: string;
  description: string;
  eligibilityReqs: string[];
  howToApply: string;
  url: string;
}

const PROGRAMS: Program[] = [
  {
    id: "osfi-sandbox",
    name: "OSFI FinTech Regulatory Sandbox",
    authority: "Office of the Superintendent of Financial Institutions (OSFI)",
    sector: ["Financial Services", "FinTech", "Insurance", "Banking"],
    type: "Sandbox",
    description: "Allows FinTech companies to test innovative financial products in a controlled environment with relaxed regulatory requirements. OSFI works with applicants to tailor supervisory expectations. Companies can operate for 12–24 months with reduced compliance burden.",
    eligibilityReqs: [
      "Canadian-incorporated company or registered foreign entity",
      "Product/service is genuinely innovative (not just digital delivery of existing service)",
      "Consumer protection safeguards in place",
      "Limited scope — not systemic to the Canadian financial system",
      "Willing to report to OSFI quarterly",
    ],
    howToApply: "Submit a sandbox application letter to OSFI describing your innovation, target market, risk assessment, and proposed safeguards. Response within 60 days.",
    url: "https://www.osfi-bsif.gc.ca/en/about-osfi/who-we-supervise/fintech",
  },
  {
    id: "fcac-sandbox",
    name: "FCAC Financial Consumer Protection Pilot",
    authority: "Financial Consumer Agency of Canada (FCAC)",
    sector: ["Financial Services", "FinTech", "Consumer Finance"],
    type: "Pilot",
    description: "FCAC's pilot program allows innovative financial products to be tested without full compliance with the FCAC's market conduct requirements for up to 18 months. Focused on products that materially improve financial consumer outcomes.",
    eligibilityReqs: [
      "Product targets financial consumers (not businesses)",
      "Demonstrates measurable benefit to consumers (cost, access, or education)",
      "Has consumer redress mechanism",
      "Applicant agrees to FCAC monitoring and data sharing",
      "Canadian customer base only during pilot",
    ],
    howToApply: "Submit to FCAC's Innovation team with a detailed consumer protection framework and outcome measurement plan.",
    url: "https://www.canada.ca/en/financial-consumer-agency.html",
  },
  {
    id: "cri-fund",
    name: "Centre for Regulatory Innovation — RegTech Fund",
    authority: "ISED Canada / Centre for Regulatory Innovation",
    sector: ["Technology / SaaS", "RegTech", "Financial Services", "Healthcare", "E-commerce"],
    type: "Funding",
    fundingAmount: "Up to $1.7M",
    description: "Canada's Centre for Regulatory Innovation partners with private-sector RegTech companies to reduce the $17.9B annual red tape burden. CanCompliance-type tools are a primary target. Funding supports pilots with federal departments and co-development of compliance tools.",
    eligibilityReqs: [
      "Canadian company with a working product (not pre-revenue)",
      "Technology addresses a documented federal regulatory burden",
      "Willing to pilot with a federal department",
      "Demonstrates impact on regulatory efficiency",
      "Not primarily a government contractor",
    ],
    howToApply: "Submit an expression of interest through the CRI portal. CRI runs cohort calls — next intake typically Q2/Q3 annually.",
    url: "https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/regulatory-innovation.html",
  },
  {
    id: "cfib-partnership",
    name: "CFIB Data Partnership Program",
    authority: "Canadian Federation of Independent Business (CFIB)",
    sector: ["Retail", "Food & Beverage", "Construction", "Professional Services", "E-commerce", "Non-profit"],
    type: "Pilot",
    description: "CFIB partners with compliance technology providers to offer their tools to CFIB's 100,000+ member businesses. Partnership includes CFIB endorsement, co-marketing, and access to CFIB's regulatory benchmarking data. Not a government program — but the most direct path to SMB distribution.",
    eligibilityReqs: [
      "Tool addresses compliance burden for SMBs (not enterprise)",
      "Canadian-developed product",
      "Demonstrated use case for 2+ regulatory areas",
      "Willing to offer CFIB members a preferred rate",
      "Agrees to share anonymized usage data for CFIB research",
    ],
    howToApply: "Contact CFIB's Member Relations team and present a product demo. CFIB evaluates quarterly.",
    url: "https://www.cfib-fcei.ca",
  },
  {
    id: "bizpal",
    name: "BizPaL Integration Partnership",
    authority: "ISED Canada / BizPaL National Office",
    sector: ["Technology / SaaS", "Retail", "Construction", "Food & Beverage", "Professional Services"],
    type: "Pilot",
    description: "BizPaL is the federal government's business permit and licensing platform, actively expanding to compliance documentation. ISED is funding private-sector partners to build compliance layers on top of BizPaL's regulatory database. Successful partners become the consumer-facing interface for federal compliance data.",
    eligibilityReqs: [
      "Ability to integrate with BizPaL API (REST)",
      "Product serves Canadian SMBs (not individuals)",
      "Privacy-compliant data handling (PIPEDA certified)",
      "Canadian company or Canadian subsidiary",
      "Willing to enter data sharing agreement with ISED",
    ],
    howToApply: "Contact BizPaL's national office at ISED to discuss API integration. Formal RFP process for larger integrations.",
    url: "https://www.canada.ca/en/services/business/bizpal.html",
  },
  {
    id: "cra-sandbox",
    name: "CRA Tax Data API Access Program",
    authority: "Canada Revenue Agency (CRA)",
    sector: ["Financial Services", "Technology / SaaS", "Professional Services", "FinTech"],
    type: "Sandbox",
    description: "CRA's authorized representative API allows accredited software providers to access T4/T1/HST filing data on behalf of clients. Becoming an authorized provider gives your product direct CRA data integration — eliminating manual data entry for payroll, GST/HST, and tax filing.",
    eligibilityReqs: [
      "CRA-accredited software (certification process required)",
      "SOC 2 Type II or equivalent security certification",
      "Canadian data residency for all CRA data",
      "Established user base (100+ active clients minimum)",
      "2-year minimum company history",
    ],
    howToApply: "Apply to CRA's Software Developer Program. Certification takes 6–12 months and requires technical review of your data handling practices.",
    url: "https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-businesses.html",
  },
  {
    id: "reg-capacity-fund",
    name: "Regulators' Capacity Fund",
    authority: "Treasury Board of Canada Secretariat",
    sector: ["Technology / SaaS", "RegTech", "Financial Services", "Healthcare", "E-commerce", "Professional Services"],
    type: "Funding",
    fundingAmount: "Up to $3.8M",
    deadline: "Intake opens Q3 2025",
    description: "The Regulators' Capacity Fund provides up to $3.8M per project to help Canadian businesses and technology providers improve regulatory compliance systems. The fund targets organizations helping regulators modernize digital infrastructure, reduce administrative burden, and develop data-driven compliance tools. Compliance technology companies are a primary target — especially those that reduce per-regulation compliance cost for SMBs.",
    eligibilityReqs: [
      "Canadian-incorporated company",
      "Project addresses documented regulatory burden (not just internal compliance)",
      "Demonstrates measurable outcomes (time saved, cost reduced per business)",
      "Technology is scalable across multiple regulatory areas",
      "Not primarily a lobbying or advocacy organization",
    ],
    howToApply: "Submit through the Treasury Board's regulatory modernization intake portal. Applications are reviewed by the Regulatory Reform Committee. Next intake window Q3 2025.",
    url: "https://www.canada.ca/en/treasury-board-secretariat/services/federal-regulatory-management/regulatory-modernization.html",
  },
  {
    id: "ont-red-tape",
    name: "Ontario Red Tape Challenge",
    authority: "Ontario Ministry of Red Tape Reduction",
    sector: ["Retail", "Construction", "Food & Beverage", "Professional Services", "Technology / SaaS", "Non-profit"],
    type: "Pilot",
    deadline: "Ongoing — quarterly submissions",
    description: "Ontario's Red Tape Challenge is a government portal where businesses report specific regulatory burdens for government review and potential relief. Reports that are accepted often lead to regulatory exemptions, streamlined reporting processes, or updated guidelines. Technology companies documenting compliance burdens for SMBs are eligible and can submit on behalf of client cohorts.",
    eligibilityReqs: [
      "Business operating in Ontario or serving Ontario-based businesses",
      "Documented regulatory burden (specific act, regulation, or requirement)",
      "Quantified cost of compliance where possible",
      "Proposed alternative approach or recommendation",
    ],
    howToApply: "Submit through the Ontario Red Tape Challenge portal. Submissions are reviewed by the Ministry of Red Tape Reduction. High-impact submissions may be invited to consultations.",
    url: "https://www.ontario.ca/page/red-tape-challenge",
  },
  {
    id: "bc-better-reg",
    name: "BC Better Regulation Office",
    authority: "BC Ministry of Finance — Better Regulation Office",
    sector: ["Retail", "Construction", "Professional Services", "Food & Beverage", "Technology / SaaS"],
    type: "Pilot",
    deadline: "Ongoing",
    description: "British Columbia's Better Regulation Office works with businesses and industry associations to identify and reduce unnecessary regulatory burden. The office runs annual regulatory reviews and will accept applications from compliance technology providers to participate in BC's regulatory modernization agenda. Participating companies gain access to BC regulatory working groups and early-stage policy consultations.",
    eligibilityReqs: [
      "Business operating in BC or serving BC-based businesses",
      "Clear regulatory burden documentation across multiple BC businesses",
      "Willingness to participate in regulatory modernization working groups",
      "Technology or process innovation that reduces compliance cost",
    ],
    howToApply: "Contact the BC Better Regulation Office directly through their portal. Engagement process varies by sector — arrange a preliminary call before submitting a formal proposal.",
    url: "https://www2.gov.bc.ca/gov/content/employment-business/business/permits-licences-and-regulations/reducing-regulatory-burden",
  },
];

const SECTORS = ["All", "Financial Services", "FinTech", "Technology / SaaS", "Retail", "Construction", "Healthcare", "Professional Services", "E-commerce"];

interface EligibilityResult {
  program: Program;
  matchedReqs: number;
  totalReqs: number;
  score: number;
}

const TYPE_COLORS: Record<Program["type"], string> = {
  "Sandbox": "#7F77DD",
  "Exemption": "#1D9E75",
  "Pilot": "#c8f135",
  "Funding": "#f5a623",
};

export default function SandboxAdvisor() {
  const [sector, setSector] = useState("");
  const [revenue, setRevenue] = useState("");
  const [stage, setStage] = useState("");
  const [filter, setFilter] = useState("All");
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  function checkEligibility() {
    if (!sector || !revenue || !stage) return;
    const filtered = PROGRAMS.filter(p => p.sector.some(s => s === sector || s.includes(sector.split(" ")[0])));
    const scored: EligibilityResult[] = filtered.map(program => {
      let matched = 0;
      if (stage !== "idea") matched++;
      if (revenue === ">1m" || revenue === "500k-1m") matched++;
      if (sector === "Financial Services" && program.authority.includes("OSFI")) matched++;
      if (stage === "revenue" && program.id === "cri-fund") matched++;
      return {
        program,
        matchedReqs: Math.min(program.eligibilityReqs.length, matched + 2),
        totalReqs: program.eligibilityReqs.length,
        score: Math.round(((matched + 2) / program.eligibilityReqs.length) * 100),
      };
    });
    scored.sort((a, b) => b.score - a.score);
    setResults(scored);
  }

  const displayPrograms = results
    ? results.map(r => r.program)
    : filter === "All"
      ? PROGRAMS
      : PROGRAMS.filter(p => p.sector.includes(filter));

  return (
    <AppLayout title="Regulatory Sandbox Advisor" subtitle="Find government programs, sandboxes, and funding your business qualifies for">
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Gov. Partnership Tool</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Regulatory Sandbox Eligibility Checker</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            Canada's Centre for Regulatory Innovation has $1.7M+ in active RegTech funding. OSFI and FCAC both run fintech sandboxes. 
            BizPaL is seeking private-sector compliance partners. Find which programs your business qualifies for.
          </p>
        </div>

        {/* Eligibility checker */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <Lightbulb className="w-4 h-4 text-primary" />
            <div className="text-[13px] font-medium text-foreground">Eligibility Check</div>
          </div>
          <div className="p-5 grid grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Your Sector</label>
              <select
                data-testid="select-sector"
                value={sector}
                onChange={e => setSector(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select...</option>
                {["Financial Services", "FinTech", "Technology / SaaS", "Retail", "Construction", "Healthcare", "Food & Beverage", "Professional Services", "E-commerce", "Non-profit"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Annual Revenue (CAD)</label>
              <select
                data-testid="select-revenue"
                value={revenue}
                onChange={e => setRevenue(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select...</option>
                <option value="pre">Pre-revenue</option>
                <option value="<100k">Under $100K</option>
                <option value="100k-500k">$100K–$500K</option>
                <option value="500k-1m">$500K–$1M</option>
                <option value=">1m">Over $1M</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Company Stage</label>
              <select
                data-testid="select-stage"
                value={stage}
                onChange={e => setStage(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select...</option>
                <option value="idea">Idea / Pre-product</option>
                <option value="mvp">MVP / Beta</option>
                <option value="revenue">Early Revenue</option>
                <option value="growth">Growth Stage</option>
              </select>
            </div>
          </div>
          <div className="px-5 pb-5">
            <button
              data-testid="btn-check-eligibility"
              onClick={checkEligibility}
              disabled={!sector || !revenue || !stage}
              className="px-6 py-2.5 rounded-md text-[13px] font-semibold disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ background: "#c8f135", color: "#09090a" }}
            >
              Check My Eligibility
            </button>
          </div>
        </div>

        {!results && (
          <div className="flex gap-2 flex-wrap">
            {SECTORS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-3 py-1 rounded-md text-[11px] font-mono border transition-all"
                style={filter === s
                  ? { background: "#c8f135", color: "#09090a", borderColor: "#c8f135" }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Programs */}
        <div className="space-y-3">
          {displayPrograms.map(program => {
            const eligResult = results?.find(r => r.program.id === program.id);
            return (
              <div key={program.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpanded(expanded === program.id ? null : program.id)}
                  data-testid={`program-${program.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="font-mono text-[10px] px-2 py-0.5 rounded"
                          style={{ background: `${TYPE_COLORS[program.type]}20`, color: TYPE_COLORS[program.type] }}
                        >
                          {program.type}
                        </span>
                        {program.fundingAmount && (
                          <span className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-flag/10 text-flag">
                            <DollarSign className="w-2.5 h-2.5" />
                            {program.fundingAmount}
                          </span>
                        )}
                        {eligResult && (
                          <span
                            className="font-mono text-[10px] px-2 py-0.5 rounded"
                            style={{ background: eligResult.score >= 60 ? "#12b76a20" : "#f5a62320", color: eligResult.score >= 60 ? "#12b76a" : "#f5a623" }}
                          >
                            {eligResult.score}% match
                          </span>
                        )}
                      </div>
                      <div className="text-[13px] font-medium text-foreground mb-0.5">{program.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{program.authority}</div>
                    </div>
                    {expanded === program.id ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  </div>
                </div>

                {expanded === program.id && (
                  <div className="border-t border-border px-5 py-4 space-y-4">
                    <p className="text-[13px] text-foreground leading-relaxed">{program.description}</p>

                    <div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Eligibility Requirements</div>
                      <div className="space-y-1.5">
                        {program.eligibilityReqs.map((req, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-pass flex-shrink-0 mt-0.5" />
                            <span className="text-[12px] text-foreground">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        How to Apply
                      </div>
                      <p className="text-[12px] text-foreground leading-relaxed">{program.howToApply}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {program.sector.slice(0, 4).map(s => (
                          <span key={s} className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                        ))}
                      </div>
                      <a
                        href={program.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
                      >
                        Official source <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>Program details are current as of April 2025. Government programs change frequently — always verify on the official source before applying. This is not legal or regulatory advice.</span>
        </div>
      </div>
    </AppLayout>
  );
}
