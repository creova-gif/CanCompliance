import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const TODAY = new Date("2026-04-08");

interface Deadline {
  id: string;
  module: string;
  obligation: string;
  authority: string;
  date: string;
  statute: string;
  penalty: string;
  recurring: string;
}

const DEADLINES: Deadline[] = [
  { id: "D01", module: "S-211", obligation: "Annual forced labour supply chain report", authority: "Minister of Public Safety", date: "2026-05-31", statute: "S-211 s.9", penalty: "Up to $250,000", recurring: "Annual (May 31)" },
  { id: "D02", module: "GST/HST", obligation: "GST/HST annual return (self-employed)", authority: "CRA", date: "2026-06-15", statute: "Excise Tax Act s.238", penalty: "5% + 1%/month", recurring: "Annual (June 15)" },
  { id: "D03", module: "Payroll", obligation: "T4 slips issued to employees", authority: "CRA", date: "2026-02-28", statute: "Income Tax Act s.200", penalty: "$100–$7,500", recurring: "Annual (Feb 28)" },
  { id: "D04", module: "Payroll", obligation: "T4 summary filed with CRA", authority: "CRA", date: "2026-02-28", statute: "Income Tax Act s.200(1)", penalty: "$100–$7,500", recurring: "Annual (Feb 28)" },
  { id: "D05", module: "EPR", obligation: "Ontario Blue Box annual tonnage report", authority: "Circular Materials Ontario", date: "2026-03-31", statute: "RRCEA O.Reg 391/21", penalty: "Up to $100,000/day", recurring: "Annual (March 31)" },
  { id: "D06", module: "EPR", obligation: "Quebec ÉEQ packaging declaration", authority: "ÉEQ / Environnement Québec", date: "2026-02-28", statute: "Reg. 2011-1", penalty: "Up to $1,000,000", recurring: "Annual (Feb 28)" },
  { id: "D07", module: "CBCA ISC", obligation: "ISC register update (change in control)", authority: "Corporations Canada", date: "Rolling — 15 days", statute: "CBCA s.21.1", penalty: "Up to $200,000", recurring: "Within 15 days of any change" },
  { id: "D08", module: "AI Gov.", obligation: "Ontario — AI hiring disclosure (mandatory)", authority: "Ontario MLTSD", date: "2026-01-01", statute: "Workers for Workers Four Act", penalty: "ESA penalties apply", recurring: "Ongoing from Jan 1 2026" },
  { id: "D09", module: "Privacy", obligation: "Report breach to OPC (real risk of harm)", authority: "Office of the Privacy Commissioner", date: "As soon as feasible", statute: "PIPEDA s.10.1", penalty: "Up to $100,000", recurring: "Within days of breach discovery" },
  { id: "D10", module: "FINTRAC", obligation: "Large Cash Transaction Report (LCTR)", authority: "FINTRAC", date: "Rolling — 15 days", statute: "PCMLTFA s.9", penalty: "Up to $500,000 (criminal)", recurring: "Within 15 business days of transaction" },
  { id: "D11", module: "GST/HST", obligation: "GST/HST quarterly return (Q1 2026)", authority: "CRA", date: "2026-04-30", statute: "Excise Tax Act s.238", penalty: "5% + 1%/month", recurring: "Quarterly" },
  { id: "D12", module: "Safety", obligation: "WSIB premium remittance (monthly employers)", authority: "WSIB Ontario", date: "2026-04-30", statute: "Workplace Safety and Insurance Act s.94", penalty: "1.5%/month on arrears", recurring: "Monthly" },
  { id: "D13", module: "Employment", obligation: "Ontario pay equity maintenance (100+ employees)", authority: "Pay Equity Commission of Ontario", date: "2026-01-01", statute: "Pay Equity Act RSO 1990", penalty: "Order to pay + interest", recurring: "Annual review" },
  { id: "D14", module: "EPR", obligation: "Canada Plastics Registry annual report", authority: "Environment and Climate Change Canada", date: "2026-06-30", statute: "CEPA s.66", penalty: "CEPA penalties", recurring: "Annual (June 30)" },
  { id: "D15", module: "CASL", obligation: "Review and refresh implied consent records", authority: "CRTC", date: "Rolling — ongoing", statute: "CASL s.10", penalty: "Up to $10,000,000", recurring: "Ongoing — review implied consent expiry" },
];

function daysUntil(dateStr: string): number | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyColor(days: number | null) {
  if (days === null) return "var(--text3)";
  if (days < 0) return "var(--red)";
  if (days <= 30) return "var(--amber)";
  if (days <= 90) return "var(--primary)";
  return "var(--green)";
}

function urgencyLabel(days: number | null) {
  if (days === null) return "ROLLING";
  if (days < 0) return "OVERDUE";
  if (days === 0) return "TODAY";
  return `${days}d`;
}

export default function Deadlines() {
  const sorted = [...DEADLINES].sort((a, b) => {
    const da = daysUntil(a.date);
    const db = daysUntil(b.date);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });

  const overdue = sorted.filter(d => { const days = daysUntil(d.date); return days !== null && days < 0; });
  const upcoming30 = sorted.filter(d => { const days = daysUntil(d.date); return days !== null && days >= 0 && days <= 30; });
  const upcoming90 = sorted.filter(d => { const days = daysUntil(d.date); return days !== null && days > 30 && days <= 90; });

  return (
    <AppLayout title="Compliance Deadlines" subtitle="2026 Canadian compliance filing calendar">
      <div style={{ maxWidth: 860 }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20, lineHeight: 1.6 }}>
          Key Canadian compliance filing dates, reporting obligations, and rolling triggers for your organization. Dates are approximate — confirm with applicable authority or legal counsel.
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Overdue", val: overdue.length, color: "var(--red)", icon: <AlertTriangle size={16} /> },
            { label: "Due within 30 days", val: upcoming30.length, color: "var(--amber)", icon: <Clock size={16} /> },
            { label: "Due within 90 days", val: upcoming90.length, color: "var(--primary)", icon: <CheckCircle size={16} /> },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: `1px solid ${s.color}44`, borderRadius: 8, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 2 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 28, fontFamily: "var(--mono)", color: s.color, fontWeight: 700 }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "90px 1fr 100px 80px 80px", gap: 12, fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)" }}>
            <div>MODULE</div>
            <div>OBLIGATION</div>
            <div>AUTHORITY</div>
            <div>DUE DATE</div>
            <div>URGENCY</div>
          </div>
          {sorted.map(d => {
            const days = daysUntil(d.date);
            const color = urgencyColor(days);
            return (
              <div key={d.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "90px 1fr 100px 80px 80px", gap: 12, alignItems: "start" }}>
                <div style={{ fontSize: 10, color: "var(--primary)", fontFamily: "var(--mono)", fontWeight: 600 }}>{d.module}</div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text1)" }}>{d.obligation}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{d.statute} · Penalty: {d.penalty}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{d.recurring}</div>
                </div>
                <div style={{ fontSize: 10, color: "var(--text2)" }}>{d.authority}</div>
                <div style={{ fontSize: 10, color: "var(--text2)", fontFamily: "var(--mono)" }}>
                  {d.date.length <= 10 && !d.date.includes("Rolling") ? d.date : "Rolling"}
                </div>
                <div>
                  <span style={{ fontSize: 9, fontFamily: "var(--mono)", color, background: color + "22", padding: "2px 7px", borderRadius: 3 }}>
                    {urgencyLabel(days)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
