import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Gavel, AlertTriangle, Clock, TrendingUp, Bell, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface Bill {
  id: string;
  title: string;
  shortName: string;
  status: "Royal Assent" | "3rd Reading" | "Committee" | "2nd Reading" | "Introduced" | "Pre-legislative";
  category: "Privacy" | "AI" | "Tax" | "Environment" | "Employment" | "Trade" | "Cybersecurity";
  estimatedInForce: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  affectedModules: string[];
  summary: string;
  complianceCost: string;
  action: string;
  statute: string;
}

const BILLS: Bill[] = [
  {
    id: "C-27",
    title: "Consumer Privacy Protection Act (CPPA)",
    shortName: "Bill C-27",
    status: "Committee",
    category: "Privacy",
    estimatedInForce: "Q1 2026 (est.)",
    riskLevel: "Critical",
    affectedModules: ["Privacy / PIPEDA", "AI Governance", "CASL"],
    summary: "Replaces PIPEDA entirely. Introduces the Artificial Intelligence and Data Act (AIDA). Requires data portability, 72-hour breach notification to OPC, and mandatory algorithmic transparency for high-impact AI systems. Quebec Law 25 compliance will count toward CPPA compliance — but gaps remain.",
    complianceCost: "$8,000–$45,000 for SMBs",
    action: "Begin CPPA gap analysis now. Review your privacy policy, consent flows, and any AI-driven systems for AIDA obligations.",
    statute: "CPPA Part 1; AIDA Part 3",
  },
  {
    id: "C-26",
    title: "Critical Cyber Systems Protection Act (CCSPA)",
    shortName: "Bill C-26",
    status: "3rd Reading",
    category: "Cybersecurity",
    estimatedInForce: "Q3 2025 (est.)",
    riskLevel: "High",
    affectedModules: ["Privacy / PIPEDA", "AI Governance"],
    summary: "Mandates cybersecurity programs for federally regulated businesses in banking, telecom, energy, and transport. Requires 72-hour incident reporting to CSE. Non-compliance: administrative monetary penalties up to $15M. If you operate in any regulated sector, this applies to you.",
    complianceCost: "$15,000–$100,000+ for in-scope businesses",
    action: "Assess whether your sector falls under 'critical infrastructure.' If yes, engage a cybersecurity firm for a CCSPA readiness assessment.",
    statute: "CCSPA S.9–19",
  },
  {
    id: "C-8",
    title: "Online Harms Act",
    shortName: "Bill C-63",
    status: "Committee",
    category: "Employment",
    estimatedInForce: "Q4 2025 (est.)",
    riskLevel: "High",
    affectedModules: ["CASL", "Privacy / PIPEDA"],
    summary: "Requires online platforms with 2.5M+ monthly users to moderate harmful content. Introduces a Digital Safety Commission. Smaller platforms with user-generated content must implement acceptable use policies and reporting mechanisms. Creates a private right of action for online hate content.",
    complianceCost: "$5,000–$25,000 for mid-size platforms",
    action: "If you operate an online platform with user-generated content, review your content moderation policy and terms of service.",
    statute: "Online Harms Act S.2, S.54",
  },
  {
    id: "AI-REG",
    title: "AI Governance Regulations (AIDA Implementation)",
    shortName: "AIDA Regs",
    status: "Pre-legislative",
    category: "AI",
    estimatedInForce: "Q2 2026 (est.)",
    riskLevel: "Critical",
    affectedModules: ["AI Governance", "Privacy / PIPEDA", "Employment Standards"],
    summary: "Secondary regulations under AIDA (Bill C-27 Part 3) will define 'high-impact AI systems,' set transparency requirements for automated hiring/lending/insurance decisions, and establish mandatory impact assessments. Minister Solomon confirmed a principles-based approach — details still being consulted.",
    complianceCost: "$12,000–$60,000 for AI-using businesses",
    action: "Inventory your use of AI tools in hiring, lending, pricing, or content moderation. These are likely 'high-impact' under AIDA. Start documenting AI governance policies now.",
    statute: "AIDA S.5–12; C-27 Part 3",
  },
  {
    id: "S-211-2",
    title: "Fighting Against Forced Labour Act — Amendments",
    shortName: "S-211 Expansion",
    status: "Pre-legislative",
    category: "Trade",
    estimatedInForce: "Q3 2026 (est.)",
    riskLevel: "Medium",
    affectedModules: ["S-211 Supply Chain"],
    summary: "Government consulting on expanding S-211 (Modern Slavery Act) reporting to cover more business sizes (removing the $40M revenue threshold) and potentially requiring supplier audits rather than just disclosure. If enacted, this would apply to all SMBs with international supply chains.",
    complianceCost: "$2,000–$15,000 for affected businesses",
    action: "If you import goods, begin mapping your Tier 2+ supply chain now. Voluntary reporting before requirements kick in signals proactive compliance.",
    statute: "Fighting Against Forced Labour Act; proposed expansion Bill",
  },
  {
    id: "C-59",
    title: "Fall Economic Statement Act (Greenwashing)",
    shortName: "Bill C-59 Amendments",
    status: "Royal Assent",
    category: "Environment",
    estimatedInForce: "In Force — June 2024",
    riskLevel: "High",
    affectedModules: ["ESG Greenwashing"],
    summary: "Amendments to Competition Act s.74.01 now prohibit unsubstantiated environmental claims in advertising. Companies must have adequate scientific evidence for any 'green' or 'sustainable' claim. The Competition Bureau has already launched 8+ investigations. First-time violations: up to 3% of global revenue.",
    complianceCost: "Already in force — compliance required now",
    action: "Audit all marketing materials for environmental claims. Any claim using 'sustainable,' 'green,' 'carbon neutral,' or 'eco-friendly' must be substantiated. Remove or substantiate immediately.",
    statute: "Competition Act s.74.01(1)(b.1); Bill C-59 S.29",
  },
  {
    id: "CPPA-QC",
    title: "Quebec Law 25 Phase 3 (Full Implementation)",
    shortName: "Law 25 Phase 3",
    status: "Royal Assent",
    category: "Privacy",
    estimatedInForce: "In Force — Sept 2023 (ongoing obligations)",
    riskLevel: "High",
    affectedModules: ["Privacy / PIPEDA", "CASL"],
    summary: "All three phases of Quebec's Law 25 are now in force. Phase 3 requires: data portability on request, documented privacy impact assessments for offshore data transfers, and appointment of a privacy officer. CAI enforcement has issued its first fines — up to 4% of worldwide revenue or $25M.",
    complianceCost: "Already in force — non-compliance fines active",
    action: "If you have Quebec customers, verify: privacy officer appointed, PIA completed for offshore transfers, portability mechanism in place.",
    statute: "Law 25; Act Respecting the Protection of Personal Information",
  },
  {
    id: "WHMIS-2025",
    title: "WHMIS 2015 GHS Update (Safety Data Sheets)",
    shortName: "WHMIS 2025 Update",
    status: "2nd Reading",
    category: "Employment",
    estimatedInForce: "Q1 2026 (est.)",
    riskLevel: "Medium",
    affectedModules: ["Workplace Safety (OHS)"],
    summary: "Health Canada is updating WHMIS 2015 to align with GHS Revision 9. Requires updated Safety Data Sheets (SDS) format for all hazardous products. Existing WHMIS 2015 SDS will need to be replaced. Businesses with workplace hazardous materials must train workers on the new format.",
    complianceCost: "$500–$5,000 for most SMBs",
    action: "Inventory your hazardous products. Contact suppliers for updated SDS when regulations come into force. Update WHMIS training materials.",
    statute: "Hazardous Products Act; WHMIS Regulations",
  },
];

const STATUS_COLORS: Record<Bill["status"], string> = {
  "Royal Assent": "#12b76a",
  "3rd Reading": "#c8f135",
  "Committee": "#f5a623",
  "2nd Reading": "#f5a623",
  "Introduced": "#94a3b8",
  "Pre-legislative": "#64748b",
};

const RISK_COLORS: Record<Bill["riskLevel"], string> = {
  "Critical": "#f04438",
  "High": "#f5a623",
  "Medium": "#c8f135",
  "Low": "#12b76a",
};

const CATEGORIES = ["All", "Privacy", "AI", "Tax", "Environment", "Employment", "Trade", "Cybersecurity"];

export default function LegislationTracker() {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [watching, setWatching] = useState<Set<string>>(new Set());

  const filtered = filter === "All" ? BILLS : BILLS.filter(b => b.category === filter);

  function toggleWatch(id: string) {
    setWatching(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <AppLayout title="Legislation Tracker" subtitle="Laws in progress that will affect your Canadian business">
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Forward-Risk Intelligence</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Upcoming Canadian Legislation</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            12+ major pieces of legislation are in active development. Track which laws will affect your business, 
            their estimated in-force dates, projected compliance costs, and what you should do now to prepare.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Bills Tracked", value: BILLS.length.toString(), color: "text-foreground" },
            { label: "Critical Risk", value: BILLS.filter(b => b.riskLevel === "Critical").toString().length || BILLS.filter(b => b.riskLevel === "Critical").length, color: "text-fail" },
            { label: "In Force (act now)", value: BILLS.filter(b => b.status === "Royal Assent").length.toString(), color: "text-pass" },
            { label: "Watching", value: watching.size.toString(), color: "text-primary" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              data-testid={`filter-${cat.toLowerCase()}`}
              onClick={() => setFilter(cat)}
              className="px-3 py-1 rounded-md text-[11px] font-mono border transition-all"
              style={filter === cat
                ? { background: "#c8f135", color: "#09090a", borderColor: "#c8f135" }
                : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bills list */}
        <div className="space-y-3">
          {filtered.map(bill => (
            <div key={bill.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div
                className="px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === bill.id ? null : bill.id)}
                data-testid={`bill-${bill.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: "#c8f135", color: "#09090a" }}>
                        {bill.shortName}
                      </span>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{ background: `${STATUS_COLORS[bill.status]}20`, color: STATUS_COLORS[bill.status] }}
                      >
                        {bill.status}
                      </span>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{ background: `${RISK_COLORS[bill.riskLevel]}15`, color: RISK_COLORS[bill.riskLevel] }}
                      >
                        {bill.riskLevel} Risk
                      </span>
                    </div>
                    <div className="text-[13px] font-medium text-foreground mb-0.5">{bill.title}</div>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {bill.estimatedInForce}
                      </span>
                      <span>{bill.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      data-testid={`watch-${bill.id}`}
                      onClick={e => { e.stopPropagation(); toggleWatch(bill.id); }}
                      className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-mono transition-all"
                      style={watching.has(bill.id)
                        ? { borderColor: "#c8f135", color: "#c8f135", background: "#c8f13510" }
                        : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                      }
                    >
                      <Bell className="w-3 h-3" />
                      {watching.has(bill.id) ? "Watching" : "Watch"}
                    </button>
                    {expanded === bill.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              {expanded === bill.id && (
                <div className="border-t border-border px-5 py-4 space-y-4">
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">Summary</div>
                    <p className="text-[13px] text-foreground leading-relaxed">{bill.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">Affected Modules</div>
                      <div className="flex flex-wrap gap-1.5">
                        {bill.affectedModules.map(m => (
                          <span key={m} className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{m}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">Projected Compliance Cost</div>
                      <div className="text-[13px] text-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-flag" />
                        {bill.complianceCost}
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">What to Do Now</div>
                        <p className="text-[12px] text-foreground leading-relaxed">{bill.action}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>Statute reference: {bill.statute}</span>
                    <a
                      href={`https://www.parl.ca/LegisInfo/en/bill/44-1/${bill.id.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Parliament of Canada <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {watching.size > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <Bell className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-medium text-foreground mb-0.5">Watching {watching.size} bill{watching.size > 1 ? "s" : ""}</div>
              <p className="text-[11px] text-muted-foreground">
                Dashboard digest alerts will surface updates for bills you're watching. 
                AI Copilot can provide a detailed impact analysis for any watched bill.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
