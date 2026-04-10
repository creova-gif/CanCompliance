import { useState } from "react";
import { TrendingUp, Users, DollarSign, Building2, CheckCircle2, AlertCircle } from "lucide-react";

type Milestone = {
  id: string;
  trigger: string;
  desc: string;
  obligations: { law: string; req: string; deadline: string; severity: "must" | "should" | "consider" }[];
};

const MILESTONES: Milestone[] = [
  {
    id: "first_hire",
    trigger: "Hiring your first employee",
    desc: "The moment you hire one person, a cascade of Canadian employment obligations is triggered.",
    obligations: [
      { law: "Employment Standards", req: "Register as an employer with CRA (payroll account)", deadline: "Before first pay", severity: "must" },
      { law: "CPP / EI", req: "Begin deducting CPP contributions and EI premiums from day one", deadline: "First pay period", severity: "must" },
      { law: "Income Tax", req: "Withhold federal + provincial income tax and remit to CRA", deadline: "By 15th of following month", severity: "must" },
      { law: "WSIB / WCB", req: "Register with your provincial workers' compensation board", deadline: "Within 10 days of first hire", severity: "must" },
      { law: "Employment Standards Act", req: "Provide written employment agreement with hours, pay, and duties", deadline: "Before start date", severity: "must" },
      { law: "OHS", req: "Conduct a workplace hazard assessment and post OHSA rights poster", severity: "must", deadline: "Day 1" },
    ],
  },
  {
    id: "ten_employees",
    trigger: "Reaching 10 employees",
    desc: "At 10 employees, pay equity and health & safety committee obligations kick in across most provinces.",
    obligations: [
      { law: "Pay Equity Act (ON)", req: "Develop and post a written pay equity plan if operating in Ontario", deadline: "Within 3 years", severity: "must" },
      { law: "OHS (ON/QC)", req: "Joint Health & Safety Committee (JHSC) required at 20+, health & safety rep at 6+", deadline: "Upon reaching threshold", severity: "must" },
      { law: "AODA (ON)", req: "Multi-year accessibility plan required; WCAG 2.0 Level A website compliance", deadline: "Before 2025 filing", severity: "must" },
      { law: "Federal Pay Equity Act", req: "If federally regulated: start pay equity process within 3 years", deadline: "3 years post-obligation", severity: "must" },
      { law: "Privacy", req: "Appoint a privacy officer and formalize your PIPEDA privacy program", deadline: "Immediately", severity: "should" },
    ],
  },
  {
    id: "thirty_thousand",
    trigger: "Reaching $30,000 in annual revenue",
    desc: "GST/HST registration becomes mandatory. Missing this can trigger CRA audits and retroactive penalties.",
    obligations: [
      { law: "Excise Tax Act", req: "Register for GST/HST — mandatory once you exceed $30,000 in 4 consecutive quarters", deadline: "Within 29 days of crossing threshold", severity: "must" },
      { law: "CRA", req: "Begin charging, collecting, and remitting GST/HST on every taxable supply", deadline: "Upon registration", severity: "must" },
      { law: "Quebec", req: "If operating in Quebec, register for QST (Quebec Sales Tax) separately — threshold also $30K", deadline: "Same as GST registration", severity: "must" },
      { law: "Bookkeeping", req: "Maintain books and records for 6 years from end of fiscal year — CRA requirement", deadline: "Ongoing", severity: "must" },
    ],
  },
  {
    id: "fifty_employees",
    trigger: "Reaching 50 employees",
    desc: "At 50 employees, accessibility, pay transparency, and health & safety committee obligations significantly expand.",
    obligations: [
      { law: "AODA (ON)", req: "Full WCAG 2.0 Level AA website accessibility and accessibility reports to government", deadline: "Annual filing", severity: "must" },
      { law: "BC Pay Transparency Act", req: "If in BC: Annual pay transparency report filed with BC government", deadline: "November 1 annually", severity: "must" },
      { law: "JHSC (ON)", req: "Full Joint Health and Safety Committee with certified members required", deadline: "Upon reaching 50", severity: "must" },
      { law: "Pay Equity (ON)", req: "Pay equity plan must be fully implemented and posted in workplace", deadline: "Now if not done", severity: "must" },
      { law: "Employee Data", req: "Expand PIPEDA/CPPA privacy program to cover employee personal data systematically", deadline: "Immediately", severity: "should" },
      { law: "Group Benefits", req: "Consider group benefits plan — Employment Standards Act does not require it but affects recruitment", deadline: "Consider now", severity: "consider" },
    ],
  },
  {
    id: "one_million",
    trigger: "Reaching $1,000,000 in annual revenue",
    desc: "At $1M revenue, you enter the category most regulators and auditors watch. Corporate governance matters now.",
    obligations: [
      { law: "CRA", req: "Move to monthly GST/HST remittances if annual taxable supplies exceed $1.5M", deadline: "CRA will notify", severity: "must" },
      { law: "CBCA", req: "Ensure beneficial ownership register is filed with Corporations Canada if federally incorporated", deadline: "Immediately if not done", severity: "must" },
      { law: "T4A", req: "If you use contractors: file T4A slips for any contractor paid $500+ per year", deadline: "By Feb 28 each year", severity: "must" },
      { law: "SR&ED", req: "Evaluate SR&ED tax credit eligibility — 15–35% CRA refundable credit on R&D spend", deadline: "With annual T2 corporate return", severity: "should" },
      { law: "Director Liability", req: "Directors personally liable for unremitted payroll deductions — ensure remittances are current", deadline: "Ongoing", severity: "must" },
      { law: "Insurance", req: "Review D&O, cyber, and product liability coverage given increased regulatory exposure", deadline: "Annual renewal", severity: "consider" },
    ],
  },
  {
    id: "us_expansion",
    trigger: "Expanding to the United States",
    desc: "Selling to US customers triggers a new set of cross-border compliance obligations — especially for digital businesses.",
    obligations: [
      { law: "PIPEDA / CPPA", req: "Implement cross-border data transfer agreements for any US-stored personal data", deadline: "Before launch", severity: "must" },
      { law: "US State Privacy", req: "If selling to California: CCPA compliance required. Virginia, Colorado, Texas laws also apply", deadline: "Before selling to US consumers", severity: "must" },
      { law: "CUSMA / Customs", req: "Ensure HS codes and CBSA export documentation are correct for goods shipped to USA", deadline: "Before first shipment", severity: "must" },
      { law: "US Tax", req: "Economic nexus rules — may trigger sales tax obligations in US states without physical presence", deadline: "Before US revenue starts", severity: "must" },
      { law: "CASL", req: "CASL still applies to commercial emails sent to Canadians — even if you're primarily US-focused now", deadline: "Ongoing", severity: "should" },
    ],
  },
];

const SEV_COLOR = { must: "var(--red)", should: "var(--amber)", consider: "#7F77DD" };
const SEV_BG = { must: "rgba(240,68,56,0.12)", should: "rgba(245,166,35,0.12)", consider: "rgba(127,119,221,0.12)" };

export default function ScaleAdvisor() {
  const [selected, setSelected] = useState<string>("first_hire");
  const milestone = MILESTONES.find(m => m.id === selected)!;

  return (
    <div className="page-content">
      <div style={{ background: "rgba(200,241,53,0.07)", border: "1px solid rgba(200,241,53,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "#c8f135", background: "rgba(200,241,53,0.15)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>BUSINESS OWNER TOOL · SCALING COMPLIANCE GUIDE</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>Ready to Scale? — What compliance obligations kick in at each milestone</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>The most common SMB question: "What do I need to worry about when I hit [milestone]?" This tool maps every Canadian compliance obligation to the business milestone that triggers it — so you're never caught off guard.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Your scaling milestone</div>
          <div className="space-y-2">
            {MILESTONES.map(m => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${selected === m.id ? "rgba(200,241,53,0.4)" : "var(--border)"}`, background: selected === m.id ? "rgba(200,241,53,0.05)" : "transparent", color: selected === m.id ? "#c8f135" : "var(--text2)", fontSize: 11, fontWeight: selected === m.id ? 700 : 400, transition: "all 0.15s" }}>
                {m.trigger}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#c8f135", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Selected milestone</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text1)", marginBottom: 8 }}>{milestone.trigger}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.65 }}>{milestone.desc}</div>
          </div>

          <div className="space-y-3">
            {milestone.obligations.map((ob, i) => (
              <div key={i} style={{ background: SEV_BG[ob.severity], border: `1px solid ${SEV_COLOR[ob.severity]}30`, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${SEV_COLOR[ob.severity]}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text1)", flex: 1 }}>{ob.req}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: SEV_COLOR[ob.severity], textTransform: "uppercase", flexShrink: 0, padding: "2px 8px", borderRadius: 4, background: `${SEV_COLOR[ob.severity]}20` }}>{ob.severity}</div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", background: "var(--bg3)", padding: "2px 8px", borderRadius: 4 }}>{ob.law}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>⏰ {ob.deadline}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            {(["must", "should", "consider"] as const).map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: SEV_COLOR[s] }} />
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
