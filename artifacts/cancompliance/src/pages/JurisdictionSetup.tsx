import { useState } from "react";
import { MapPin, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAudit } from "../context/AuditContext";

type Urgency = "critical" | "active" | "upcoming";

interface ModuleRule {
  module: string;
  law: string;
  urgency: Urgency;
  panel: string;
}

interface JurisdictionRules {
  province: string;
  alwaysActive: ModuleRule[];
  conditional: Record<string, ModuleRule[]>;
  futureRisks: string[];
}

const JURISDICTION_RULES: Record<string, JurisdictionRules> = {
  ON: {
    province: "Ontario",
    alwaysActive: [
      { module: "Employment standards (ESA 2000)", law: "ESA 2000 — min wage $17.20/hr, OT at 44h", urgency: "active", panel: "employment" },
      { module: "Workplace safety (OHSA)", law: "OHSA — policy required for all employers", urgency: "active", panel: "safety" },
      { module: "GST / HST at 13%", law: "Excise Tax Act — HST 13% on taxable supplies", urgency: "active", panel: "gsthst" },
    ],
    conditional: {
      email: [{ module: "CASL consent ledger", law: "CASL — opt-in required, $10M max penalty", urgency: "critical", panel: "casl" }],
      product: [
        { module: "CCPSA product safety", law: "Canada Consumer Product Safety Act", urgency: "active", panel: "ccpsa" },
        { module: "CPLA bilingualism", law: "CPLA — EN + FR required on packaging", urgency: "active", panel: "cpla" },
      ],
      data: [{ module: "PIPEDA privacy", law: "PIPEDA — consent, purpose limitation, breach reporting", urgency: "active", panel: "privacy" }],
      fintech: [{ module: "FINTRAC AML/KYC", law: "PCMLTFA — $10K trigger, STR obligations", urgency: "critical", panel: "fintrac" }],
      employer: [{ module: "CRA payroll — CPP/EI", law: "Income Tax Act + CPP Act + EI Act", urgency: "active", panel: "payroll" }],
      esg: [{ module: "ESG greenwashing", law: "Competition Act (Bill C-59) — substantiation required", urgency: "active", panel: "esg" }],
      ai: [{ module: "AI governance (ON 2026)", law: "Workers for Workers IV — AI hiring disclosure required", urgency: "upcoming", panel: "ai" }],
      import: [{ module: "CBSA / CARM customs", law: "Customs Act — CARM mandatory since Oct 2024", urgency: "critical", panel: "customs" }],
    },
    futureRisks: [
      "Bill C-27 successor (CPPA) expected 2026 — fines up to $25M or 5% global revenue",
      "Ontario AI hiring disclosure law effective 2026 — all employers must disclose AI use in job postings",
      "Blue Box EPR tonnage reporting — producers must file annually by March 31",
    ],
  },
  QC: {
    province: "Quebec",
    alwaysActive: [
      { module: "Employment standards (LNT)", law: "LNT — min wage $15.75/hr, OT at 40h", urgency: "active", panel: "employment" },
      { module: "Quebec Law 25 privacy (MANDATORY)", law: "Law 25 — PIA required, automated decision disclosure, 72h breach report", urgency: "critical", panel: "privacy" },
      { module: "CPLA + Bill 96 bilingualism", law: "Bill 96 — French at least as prominent as English, in force June 2025", urgency: "critical", panel: "cpla" },
      { module: "GST 5% + QST 9.975%", law: "Excise Tax Act + QST Act — file separately with Revenu Québec", urgency: "active", panel: "gsthst" },
    ],
    conditional: {
      email: [{ module: "CASL consent ledger", law: "CASL — opt-in required, $10M max penalty", urgency: "critical", panel: "casl" }],
      product: [{ module: "CCPSA product safety", law: "Canada Consumer Product Safety Act", urgency: "active", panel: "ccpsa" }],
      fintech: [{ module: "FINTRAC AML/KYC", law: "PCMLTFA — $10K trigger", urgency: "critical", panel: "fintrac" }],
      employer: [{ module: "CRA payroll + QPP", law: "QPP instead of CPP for Quebec employees — file separately", urgency: "active", panel: "payroll" }],
      ai: [{ module: "AI governance (Law 25 s.12.1)", law: "Law 25 — automated decisions must be disclosed, right to explanation", urgency: "critical", panel: "ai" }],
      import: [{ module: "CBSA / CARM customs", law: "Customs Act — CARM mandatory since Oct 2024", urgency: "critical", panel: "customs" }],
    },
    futureRisks: [
      "Quebec Law 25 PIA enforcement is active NOW — non-compliant businesses face immediate OPC investigation",
      "Bill 96 grace period ends June 1 2027 — all French-language compliance must be complete",
      "CPPA federal legislation expected 2026 — will layer on top of Law 25, not replace it",
    ],
  },
  BC: {
    province: "British Columbia",
    alwaysActive: [
      { module: "Employment standards (BCESA)", law: "BC ESA — min wage $17.85/hr, OT at 40h", urgency: "active", panel: "employment" },
      { module: "Workplace safety — psychological harassment (MANDATORY)", law: "BC Workers Compensation Act — harassment prevention policy mandatory Sept 1 2025", urgency: "critical", panel: "safety" },
      { module: "GST 5% + PST 7%", law: "Excise Tax Act — GST federal; PST administered by BC Ministry of Finance", urgency: "active", panel: "gsthst" },
    ],
    conditional: {
      email: [{ module: "CASL consent ledger", law: "CASL — opt-in required, $10M max penalty", urgency: "critical", panel: "casl" }],
      product: [{ module: "BC Product Stewardship (EPR)", law: "BC Recycling Regulation — electronics, batteries, packaging stewardship", urgency: "active", panel: "epr" }],
      employer: [{ module: "CRA payroll — CPP/EI", law: "Income Tax Act + CPP Act + EI Act", urgency: "active", panel: "payroll" }],
      fintech: [{ module: "FINTRAC AML/KYC", law: "PCMLTFA — $10K trigger, STR obligations", urgency: "critical", panel: "fintrac" }],
    },
    futureRisks: [
      "BC harassment prevention policy enforcement — WorkSafeBC begins audits Q1 2026",
      "BC privacy legislation (PIPA) amendment expected — aligning with Law 25 requirements",
    ],
  },
  AB: {
    province: "Alberta",
    alwaysActive: [
      { module: "Employment standards (AB ESA)", law: "Alberta Employment Standards Code — min wage $15.00/hr, OT at 44h", urgency: "active", panel: "employment" },
      { module: "Workplace safety (OHS Act)", law: "Alberta OHS Act — written hazard assessment required", urgency: "active", panel: "safety" },
      { module: "GST 5% (no provincial tax)", law: "Excise Tax Act — GST 5% only; Alberta has no PST", urgency: "active", panel: "gsthst" },
    ],
    conditional: {
      email: [{ module: "CASL consent ledger", law: "CASL — opt-in required, $10M max penalty", urgency: "critical", panel: "casl" }],
      data: [{ module: "Alberta PIPA", law: "Personal Information Protection Act SA 2003 — provincial privacy law", urgency: "active", panel: "privacy" }],
      employer: [{ module: "CRA payroll — CPP/EI", law: "Income Tax Act + CPP Act + EI Act", urgency: "active", panel: "payroll" }],
    },
    futureRisks: [
      "Alberta PIPA expected to be updated to align with federal CPPA in 2026",
    ],
  },
};

const ACTIVITIES = [
  { id: "email", label: "Send commercial email / marketing" },
  { id: "product", label: "Sell physical products" },
  { id: "data", label: "Collect personal data from customers" },
  { id: "fintech", label: "Handle cash / payments / financial services" },
  { id: "employer", label: "Have employees / payroll" },
  { id: "esg", label: "Make environmental claims / ESG marketing" },
  { id: "ai", label: "Use AI in hiring or decision-making" },
  { id: "import", label: "Import goods into Canada" },
];

const URGENCY_ICON: Record<Urgency, React.FC<{ size?: number }>> = {
  critical: ({ size }) => <AlertCircle size={size} color="var(--red)" />,
  active: ({ size }) => <CheckCircle size={size} color="var(--green)" />,
  upcoming: ({ size }) => <AlertTriangle size={size} color="var(--amber)" />,
};

const URGENCY_COLOR: Record<Urgency, string> = {
  critical: "var(--red)",
  active: "var(--green)",
  upcoming: "var(--amber)",
};

export default function JurisdictionSetup() {
  const { setCurrentJurisdiction } = useAudit();
  const [province, setProvince] = useState("ON");
  const [activities, setActivities] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);

  const toggleActivity = (id: string) => {
    setActivities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const apply = () => {
    const rules = JURISDICTION_RULES[province];
    setCurrentJurisdiction(rules?.province || province);
    setApplied(true);
  };

  const rules = JURISDICTION_RULES[province];

  const applicableModules: ModuleRule[] = [
    ...(rules?.alwaysActive || []),
    ...activities.flatMap(a => rules?.conditional[a] || []),
  ];

  const deduplicated = applicableModules.filter((m, i) => applicableModules.findIndex(x => x.module === m.module) === i);

  return (
    <AppLayout title="Jurisdiction Setup" subtitle="Personalize your compliance profile by province and activity">
      <div style={{ maxWidth: 860 }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20, lineHeight: 1.6 }}>
          Select your primary province of operation and business activities. CanCompliance will generate a personalized compliance roadmap showing which modules apply to your organization.
        </div>

        <div className="form-grid" style={{ marginBottom: 20 }}>
          <label className="form-label">
            Primary Province of Operation
            <select className="form-select" value={province} onChange={e => { setProvince(e.target.value); setApplied(false); }} data-testid="jur-province">
              <option value="ON">Ontario</option>
              <option value="QC">Quebec</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>BUSINESS ACTIVITIES — check all that apply:</div>
          <div className="checks-grid">
            {ACTIVITIES.map(a => (
              <label key={a.id} className="check-row">
                <input type="checkbox" checked={activities.includes(a.id)} onChange={() => { toggleActivity(a.id); setApplied(false); }} />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="run-btn" onClick={apply} data-testid="jur-apply">
          <MapPin size={14} />
          Generate My Compliance Profile
        </button>

        {applied && rules && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13, color: "var(--text1)", fontWeight: 600, marginBottom: 16 }}>
              {rules.province} — {deduplicated.length} applicable compliance module{deduplicated.length !== 1 ? "s" : ""}
            </div>

            <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
              {deduplicated.map((m, i) => {
                const Icon = URGENCY_ICON[m.urgency];
                const color = URGENCY_COLOR[m.urgency];
                return (
                  <div key={i} style={{ background: "var(--bg2)", border: `1px solid ${color}33`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flexShrink: 0, marginTop: 1 }}><Icon size={15} /></div>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--text1)", fontWeight: 500 }}>{m.module}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{m.law}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 9, fontFamily: "var(--mono)", color, background: color + "22", padding: "2px 7px", borderRadius: 3, flexShrink: 0 }}>
                      {m.urgency.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>

            {rules.futureRisks.length > 0 && (
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>UPCOMING RISKS — MONITOR</div>
                {rules.futureRisks.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < rules.futureRisks.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <AlertTriangle size={12} style={{ color: "var(--amber)", flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{r}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
