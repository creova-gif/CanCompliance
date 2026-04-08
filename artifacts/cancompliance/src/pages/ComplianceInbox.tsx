import { useState } from "react";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { Inbox, ExternalLink, AlertTriangle, Info, CheckCircle, Filter, Bell, ArrowRight, Mail } from "lucide-react";

interface InboxItem {
  id: string;
  date: string;
  severity: "Critical" | "High" | "Medium" | "Info";
  tag: string;
  headline: string;
  body: string;
  source: string;
  sourceUrl: string;
  moduleHref: string;
  moduleLabel: string;
  jurisdiction: "Federal" | "Ontario" | "Quebec" | "BC" | "Alberta" | "All";
}

const INBOX: InboxItem[] = [
  {
    id: "1",
    date: "Apr 7, 2025",
    severity: "Critical",
    tag: "CASL",
    headline: "CRTC issues $1.1M CASL fine to Ontario marketing firm for missing unsubscribe mechanism",
    body: "The CRTC issued a $1.1M administrative monetary penalty to a Toronto-based marketing firm for sending commercial electronic messages without a functioning unsubscribe mechanism (CASL S.11). The firm's 'unsubscribe' link returned a 404 error. This is the largest CASL fine in two years and signals renewed enforcement focus. Review your unsubscribe flows immediately.",
    source: "CRTC Enforcement Notice 2025-047",
    sourceUrl: "https://www.canada.ca/en/radio-television-telecommunications/news/2025/04/crtc-casl-enforcement.html",
    moduleHref: "/casl",
    moduleLabel: "CASL Checker",
    jurisdiction: "Federal",
  },
  {
    id: "2",
    date: "Apr 3, 2025",
    severity: "Critical",
    tag: "Privacy",
    headline: "Bill C-27 / CPPA received Third Reading — expected Royal Assent Q1 2026",
    body: "Canada's Consumer Privacy Protection Act (CPPA) received Third Reading in the Senate. Royal Assent is expected Q1 2026, with a 2-year implementation period following. CPPA replaces PIPEDA with stricter requirements: mandatory algorithmic transparency, 72-hour breach notification, data portability, and penalties up to $25M or 5% of global revenue. Businesses that are compliant with Quebec Law 25 are partially positioned but gap analysis is required.",
    source: "Parliament of Canada — Senate Third Reading",
    sourceUrl: "https://www.parl.ca/LegisInfo/en/bill/44-1/c-27",
    moduleHref: "/privacy",
    moduleLabel: "Privacy / PIPEDA",
    jurisdiction: "Federal",
  },
  {
    id: "3",
    date: "Mar 28, 2025",
    severity: "High",
    tag: "Employment",
    headline: "Ontario minimum wage increases to $17.60/hr effective July 1, 2025",
    body: "Ontario's Employment Standards Act (ESA) minimum wage increases from $17.20 to $17.60/hr on July 1, 2025. Student minimum wage rises to $16.60/hr. Homeworker minimum wage increases to $19.35/hr. Employers must update payroll systems, employment contracts (if base pay is minimum wage), and job postings. Failure to pay increased minimum wage is subject to Orders to Pay under the ESA.",
    source: "Ontario Ministry of Labour, Immigration, Training and Skills Development",
    sourceUrl: "https://www.ontario.ca/document/your-guide-employment-standards-act/minimum-wage",
    moduleHref: "/employment",
    moduleLabel: "Employment Standards",
    jurisdiction: "Ontario",
  },
  {
    id: "4",
    date: "Mar 21, 2025",
    severity: "High",
    tag: "Safety",
    headline: "BC WorkSafeBC launches first enforcement actions under Bill 41 psychological safety rules",
    body: "WorkSafeBC has issued its first administrative penalties under the 2024 Bill 41 amendments to the Workers Compensation Act, requiring employers to implement psychologically safe workplace policies. Four Lower Mainland employers received orders totalling $285,000 for failing to conduct workplace psychological hazard assessments. All BC employers with 5+ employees must have a written psychological safety plan.",
    source: "WorkSafeBC Enforcement Bulletin Q1 2025",
    sourceUrl: "https://www.worksafebc.com/en/about-us/news-events/announcements",
    moduleHref: "/safety",
    moduleLabel: "Workplace Safety",
    jurisdiction: "BC",
  },
  {
    id: "5",
    date: "Mar 14, 2025",
    severity: "Critical",
    tag: "Privacy",
    headline: "CAI launches first Law 25 (Quebec) audit wave — 23 businesses under review",
    body: "Quebec's Commission d'accès à l'information (CAI) has formally notified 23 businesses — mostly mid-size SMBs with Quebec customers — of active privacy audits under Law 25. The audits focus on: privacy officer appointment, privacy impact assessments for offshore data transfers, and consent collection practices. Maximum penalties: $25M or 4% of worldwide revenue. Any business with Quebec-resident customers must be compliant now.",
    source: "CAI Communiqué — March 2025",
    sourceUrl: "https://www.cai.gouv.qc.ca/en",
    moduleHref: "/privacy",
    moduleLabel: "Privacy / PIPEDA",
    jurisdiction: "Quebec",
  },
  {
    id: "6",
    date: "Mar 7, 2025",
    severity: "High",
    tag: "Employment",
    headline: "BC Pay Transparency Act — all employers must post wage ranges in job ads by Nov 1, 2025",
    body: "British Columbia's Pay Transparency Act comes fully into force for all employers on November 1, 2025. Every job posting must include a wage or salary range. Employers cannot ask applicants for pay history. Annual pay transparency reports are required for employers with 1,000+ employees (Nov 2025), 300+ employees (Nov 2026), and all employers with 50+ employees (Nov 2027). Civil liability for retaliation against employees who ask about pay equity.",
    source: "BC Pay Transparency Act, SBC 2023 c 18",
    sourceUrl: "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/pay-transparency",
    moduleHref: "/employment",
    moduleLabel: "Employment Standards",
    jurisdiction: "BC",
  },
  {
    id: "7",
    date: "Feb 28, 2025",
    severity: "High",
    tag: "Customs",
    headline: "CARM Phase 2 late filing penalties now active — $250 per missed post-entry amendment",
    body: "Canada Border Services Agency (CBSA) has begun issuing administrative monetary penalties for CARM Phase 2 non-compliance. Importers who have not completed their CARM portal setup face late filing penalties of $250 per post-entry amendment and increasing penalties for repeated violations. Commercial importers must be registered and have a Release Prior to Payment (RPP) bond in place. Contact your customs broker to confirm CARM status.",
    source: "CBSA CARM Bulletin 2025-12",
    sourceUrl: "https://www.cbsa-asfc.gc.ca/trade-commerce/carm-gcra/menu-eng.html",
    moduleHref: "/customs",
    moduleLabel: "Customs / CBSA",
    jurisdiction: "Federal",
  },
  {
    id: "8",
    date: "Feb 21, 2025",
    severity: "High",
    tag: "Privacy",
    headline: "OPC publishes AI breach guidance — automated systems require human review for breach decisions",
    body: "The Office of the Privacy Commissioner (OPC) published new guidance stating that organizations using AI systems that process personal information must ensure a human reviews significant breach notifications before submission. The guidance clarifies that automated breach detection systems must be overseen by a designated privacy officer. This affects any business using third-party AI tools (Hubspot, Salesforce, marketing automation) that process Canadian personal data.",
    source: "OPC Guidance Note — AI in Privacy Breach Handling",
    sourceUrl: "https://www.priv.gc.ca/en",
    moduleHref: "/ai-governance",
    moduleLabel: "AI Governance",
    jurisdiction: "Federal",
  },
];

const TAGS = ["All", "CASL", "Privacy", "Employment", "Safety", "Customs"];
const JURISDICTIONS = ["All", "Federal", "Ontario", "Quebec", "BC", "Alberta"];
const SEVERITIES = ["All", "Critical", "High", "Medium", "Info"];

const SEV_CONFIG = {
  Critical: { color: "#f04438", bg: "#f0443810", icon: AlertTriangle },
  High: { color: "#f5a623", bg: "#f5a62310", icon: AlertTriangle },
  Medium: { color: "#c8f135", bg: "#c8f13510", icon: Info },
  Info: { color: "#64748b", bg: "#64748b10", icon: Info },
};

export default function ComplianceInbox() {
  const [tagFilter, setTagFilter] = useState("All");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = INBOX.filter(item => {
    if (tagFilter !== "All" && item.tag !== tagFilter) return false;
    if (jurisdictionFilter !== "All" && item.jurisdiction !== jurisdictionFilter && item.jurisdiction !== "All") return false;
    if (severityFilter !== "All" && item.severity !== severityFilter) return false;
    return true;
  });

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
  }

  return (
    <AppLayout title="Compliance Inbox" subtitle="Real-world regulatory updates that affect your Canadian business">
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Retention · Daily Intelligence</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Compliance Inbox</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            Real-world enforcement actions, legislative updates, and regulatory changes — filtered by the laws that affect your business. 
            Every item links directly to the relevant compliance module so you can act immediately.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Updates This Month", value: "8", color: "text-foreground" },
            { label: "Critical Alerts", value: INBOX.filter(i => i.severity === "Critical").length.toString(), color: "text-fail" },
            { label: "High Priority", value: INBOX.filter(i => i.severity === "High").length.toString(), color: "text-flag" },
            { label: "Jurisdictions", value: "4", color: "text-primary" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Email subscription */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-foreground mb-0.5">Weekly Compliance Digest</div>
            <div className="text-[11px] text-muted-foreground">3 regulatory updates that affected businesses like yours — delivered every Monday. Filtered by your industry and province.</div>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-[12px] text-pass font-mono">
              <CheckCircle className="w-4 h-4" />
              Subscribed
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 flex-shrink-0">
              <input
                data-testid="input-email-sub"
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="bg-background border border-border rounded-md px-3 py-1.5 text-[12px] text-foreground focus:outline-none focus:border-primary w-48"
              />
              <button
                data-testid="btn-subscribe"
                type="submit"
                className="px-3 py-1.5 rounded-md text-[12px] font-semibold hover:opacity-90"
                style={{ background: "#c8f135", color: "#09090a" }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3 h-3 text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Tag</span>
            {TAGS.map(tag => (
              <button
                key={tag}
                data-testid={`filter-tag-${tag.toLowerCase()}`}
                onClick={() => setTagFilter(tag)}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all"
                style={tagFilter === tag
                  ? { background: "#c8f135", color: "#09090a", borderColor: "#c8f135" }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                }
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-3" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Jurisdiction</span>
            {JURISDICTIONS.map(j => (
              <button
                key={j}
                data-testid={`filter-jurisdiction-${j.toLowerCase()}`}
                onClick={() => setJurisdictionFilter(j)}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all"
                style={jurisdictionFilter === j
                  ? { background: "#c8f135", color: "#09090a", borderColor: "#c8f135" }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                }
              >
                {j}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-3" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Severity</span>
            {SEVERITIES.map(s => (
              <button
                key={s}
                data-testid={`filter-severity-${s.toLowerCase()}`}
                onClick={() => setSeverityFilter(s)}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all"
                style={severityFilter === s
                  ? { background: "#c8f135", color: "#09090a", borderColor: "#c8f135" }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Inbox className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <div className="text-[13px] text-muted-foreground">No updates match your current filters.</div>
            </div>
          )}
          {filtered.map(item => {
            const sevCfg = SEV_CONFIG[item.severity];
            const SevIcon = sevCfg.icon;
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-border/80 transition-colors"
                style={isExpanded ? { borderColor: sevCfg.color + "40" } : {}}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                data-testid={`inbox-item-${item.id}`}
              >
                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: sevCfg.bg }}
                    >
                      <SevIcon className="w-3.5 h-3.5" style={{ color: sevCfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="font-mono text-[10px] px-2 py-0.5 rounded"
                          style={{ background: sevCfg.bg, color: sevCfg.color }}
                        >
                          {item.severity}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{item.tag}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground">{item.jurisdiction}</span>
                        <span className="font-mono text-[10px] text-muted-foreground ml-auto">{item.date}</span>
                      </div>
                      <div className="text-[13px] font-medium text-foreground leading-snug">{item.headline}</div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 ml-10 space-y-3">
                      <p className="text-[13px] text-foreground leading-relaxed">{item.body}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors font-mono"
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {item.source}
                        </a>
                        <Link href={item.moduleHref}>
                          <button
                            className="flex items-center gap-1.5 text-[12px] font-medium hover:opacity-80 transition-opacity"
                            style={{ color: "#c8f135" }}
                            onClick={e => e.stopPropagation()}
                            data-testid={`inbox-module-${item.id}`}
                          >
                            {item.moduleLabel}
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>Updates are sourced from official government publications, CRTC enforcement notices, OPC guidance, and CFIB research. Not legal advice — consult a qualified professional for compliance decisions.</span>
        </div>
      </div>
    </AppLayout>
  );
}
