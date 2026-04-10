import { useState } from "react";
import { Users, BookOpen, UserPlus, UserMinus, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, AlertTriangle, Send, Plus } from "lucide-react";

const TRAINING_MODULES = [
  { id: "privacy101", title: "Privacy & Data Protection (PIPEDA / CPPA)", duration: "45 min", required: true, statute: "PIPEDA s.4.7 / CPPA s.12", deadline: "Annual" },
  { id: "casl", title: "CASL Anti-Spam Compliance", duration: "30 min", required: true, statute: "CASL s.7", deadline: "Annual" },
  { id: "harassment", title: "Workplace Harassment Prevention", duration: "60 min", required: true, statute: "Ontario OHSA s.32.0.1", deadline: "New hire + Annual" },
  { id: "safety", title: "Health & Safety Awareness", duration: "90 min", required: true, statute: "CLC s.125(z.09)", deadline: "New hire + Annual" },
  { id: "security", title: "Information Security & Phishing", duration: "45 min", required: true, statute: "PIPEDA / CPPA breach prevention", deadline: "Annual" },
  { id: "aml", title: "Anti-Money Laundering (AML/KYC)", duration: "60 min", required: false, statute: "PCMLTFA s.9.6", deadline: "Annual (financial roles)" },
  { id: "accessibility", title: "AODA Accessibility Awareness", duration: "30 min", required: false, statute: "AODA s.7", deadline: "Annual" },
  { id: "esg", title: "ESG & Sustainability Reporting", duration: "45 min", required: false, statute: "Competition Act s.74.01", deadline: "Annual" },
];

const EMPLOYEES = [
  { id: "e1", name: "Alex Chen", role: "Compliance Officer", department: "Legal", hireDate: "2022-03-15" },
  { id: "e2", name: "Jordan Lee", role: "Senior Auditor", department: "Finance", hireDate: "2021-07-01" },
  { id: "e3", name: "Sam Patel", role: "Business Owner", department: "Executive", hireDate: "2019-01-10" },
  { id: "e4", name: "Riley Kim", role: "Software Engineer", department: "Engineering", hireDate: "2023-06-20" },
  { id: "e5", name: "Morgan Davis", role: "Sales Manager", department: "Sales", hireDate: "2022-11-01" },
];

type TrainingStatus = "completed" | "in-progress" | "not-started" | "overdue";

function generateTrainingMatrix(): Record<string, Record<string, TrainingStatus>> {
  const matrix: Record<string, Record<string, TrainingStatus>> = {};
  const statuses: TrainingStatus[] = ["completed", "completed", "completed", "in-progress", "not-started", "overdue"];
  EMPLOYEES.forEach(emp => {
    matrix[emp.id] = {};
    TRAINING_MODULES.forEach((mod, i) => {
      const seed = (emp.id.charCodeAt(1) + i) % statuses.length;
      matrix[emp.id][mod.id] = statuses[seed];
    });
    matrix[emp.id]["privacy101"] = "completed";
    matrix[emp.id]["casl"] = emp.id === "e4" ? "in-progress" : "completed";
    matrix[emp.id]["harassment"] = emp.id === "e5" ? "overdue" : "completed";
  });
  return matrix;
}

const TRAINING_MATRIX = generateTrainingMatrix();

const STATUS_CONFIG: Record<TrainingStatus, { label: string; color: string; bg: string; icon: any }> = {
  completed: { label: "Done", color: "var(--green)", bg: "rgba(18,183,106,0.1)", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "#c8f135", bg: "rgba(200,241,53,0.1)", icon: Clock },
  "not-started": { label: "Not Started", color: "var(--text3)", bg: "var(--bg3)", icon: XCircle },
  overdue: { label: "OVERDUE", color: "var(--red)", bg: "rgba(240,68,56,0.1)", icon: AlertTriangle },
};

const ONBOARDING_ITEMS = [
  { id: "o1", category: "Day 1", task: "Register as employer with CRA (BN, payroll account)", statute: "ITA s.150.1", required: true },
  { id: "o2", category: "Day 1", task: "Begin CPP/EI deductions and employer contributions", statute: "CPP Act / EI Act", required: true },
  { id: "o3", category: "Day 1", task: "Complete WSIB employer registration (Ontario)", statute: "WSIA s.10", required: true },
  { id: "o4", category: "Day 1", task: "Provide Employment Standards poster to new hire", statute: "ESA s.2", required: true },
  { id: "o5", category: "Week 1", task: "Assign mandatory safety training (WHMIS, harassment)", statute: "OHSA s.25(2)(a)", required: true },
  { id: "o6", category: "Week 1", task: "Collect T4 employment information (TD1 forms)", statute: "ITA s.227(1)", required: true },
  { id: "o7", category: "Week 1", task: "Add employee to payroll system and benefits", statute: "ESA s.48", required: true },
  { id: "o8", category: "Week 1", task: "Privacy consent acknowledgment for employee data", statute: "PIPEDA / CPPA", required: true },
  { id: "o9", category: "Month 1", task: "Complete background check (if required by role)", statute: "PIPEDA s.4.4", required: false },
  { id: "o10", category: "Month 1", task: "Role-specific compliance training assigned & started", statute: "Internal policy", required: true },
  { id: "o11", category: "Month 1", task: "Provide access only to systems required for role (least privilege)", statute: "PIPEDA / CPPA / OSFI", required: true },
  { id: "o12", category: "Month 1", task: "Add to emergency contact list and JHSC notification", statute: "CLC s.135.1", required: false },
];

const OFFBOARDING_ITEMS = [
  { id: "off1", category: "Day of termination", task: "Revoke all system access (email, VPN, cloud, SaaS apps)", statute: "PIPEDA / CPPA / OSFI B-10", critical: true },
  { id: "off2", category: "Day of termination", task: "Collect company devices, access cards, and keys", statute: "Common law duty", critical: true },
  { id: "off3", category: "Day of termination", task: "Change shared passwords and service accounts immediately", statute: "PIPEDA / CPPA", critical: true },
  { id: "off4", category: "Day of termination", task: "Issue Record of Employment (ROE) within 5 calendar days", statute: "EI Act s.19(3)", critical: true },
  { id: "off5", category: "Within 7 days", task: "Final pay including vacation accrued (Ontario: immediately or next payday)", statute: "ESA s.11(5)", critical: true },
  { id: "off6", category: "Within 7 days", task: "Remove from payroll and benefits", statute: "ESA / CLC", critical: false },
  { id: "off7", category: "Within 7 days", task: "Delete personal data on company systems (PIPEDA retention limits)", statute: "PIPEDA / CPPA s.7(3)", critical: false },
  { id: "off8", category: "Within 7 days", task: "Archive and transfer work files per data governance policy", statute: "Internal / PIPEDA", critical: false },
  { id: "off9", category: "Within 30 days", task: "Issue T4 at year-end or on request", statute: "ITA s.200(1)", critical: false },
  { id: "off10", category: "Within 30 days", task: "Confirm NDAs / non-solicitation notice sent to employee", statute: "Common law / Contract", critical: false },
  { id: "off11", category: "Within 30 days", task: "Remove from JHSC, emergency contacts, and mailing lists", statute: "CASL s.11 / OHSA", critical: false },
  { id: "off12", category: "Ongoing", task: "Retain employee records for minimum 3 years (Ontario: last date of employment)", statute: "ESA Reg. 285 s.15", critical: false },
];

function StatusPill({ status }: { status: TrainingStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 5, background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
      <Icon className="w-2.5 h-2.5" style={{ color: cfg.color, flexShrink: 0 }} />
      <span style={{ fontSize: 8, fontWeight: 700, color: cfg.color, fontFamily: "var(--mono)", whiteSpace: "nowrap" }}>{cfg.label}</span>
    </div>
  );
}

export default function WorkforceCompliance() {
  const [tab, setTab] = useState<"training" | "onboarding" | "offboarding">("training");
  const [onboardingChecks, setOnboardingChecks] = useState<Record<string, boolean>>({});
  const [offboardingChecks, setOffboardingChecks] = useState<Record<string, boolean>>({});
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("e1");
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const employee = EMPLOYEES.find(e => e.id === selectedEmployee)!;
  const empTraining = TRAINING_MATRIX[selectedEmployee];
  const overdueCount = Object.values(empTraining).filter(s => s === "overdue").length;
  const completedCount = Object.values(empTraining).filter(s => s === "completed").length;

  const sendReminder = (empId: string) => {
    setSendingReminder(empId);
    setTimeout(() => { setSendingReminder(null); setReminderSent(empId); setTimeout(() => setReminderSent(null), 2500); }, 1200);
  };

  const onboardDone = Object.values(onboardingChecks).filter(Boolean).length;
  const offboardDone = Object.values(offboardingChecks).filter(Boolean).length;

  return (
    <div className="page-content">
      <div style={{ background: "rgba(18,183,106,0.06)", border: "1px solid rgba(18,183,106,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Users className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Workforce Compliance · Training · Onboarding · Offboarding</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Manage employee compliance training, statutory onboarding obligations, and privacy-compliant offboarding workflows — all mapped to Canadian legislation.
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {([
          { key: "training", label: "Security Training", icon: BookOpen },
          { key: "onboarding", label: "Onboarding", icon: UserPlus },
          { key: "offboarding", label: "Offboarding", icon: UserMinus },
        ] as const).map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
                background: tab === t.key ? "#c8f135" : "transparent",
                borderColor: tab === t.key ? "#c8f135" : "var(--border)",
                color: tab === t.key ? "#09090a" : "var(--text2)" }}>
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "training" && (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Employees</div>
            {EMPLOYEES.map(emp => {
              const empData = TRAINING_MATRIX[emp.id];
              const overdue = Object.values(empData).filter(s => s === "overdue").length;
              return (
                <div key={emp.id} onClick={() => setSelectedEmployee(emp.id)}
                  style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 6, background: selectedEmployee === emp.id ? "rgba(200,241,53,0.06)" : "var(--bg2)", border: `1px solid ${selectedEmployee === emp.id ? "#c8f135" : "var(--border)"}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text1)" }}>{emp.name}</div>
                  <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>{emp.role}</div>
                  {overdue > 0 && <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--red)", marginTop: 4, display: "block" }}>⚠ {overdue} overdue</span>}
                </div>
              );
            })}
          </div>

          <div>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)" }}>{employee.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{employee.role} · {employee.department}</div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 900, color: "var(--green)" }}>{completedCount}</div>
                    <div style={{ fontSize: 9, color: "var(--text3)" }}>Completed</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 900, color: "var(--red)" }}>{overdueCount}</div>
                    <div style={{ fontSize: 9, color: "var(--text3)" }}>Overdue</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 900, color: "var(--text2)" }}>{TRAINING_MODULES.length}</div>
                    <div style={{ fontSize: 9, color: "var(--text3)" }}>Total</div>
                  </div>
                </div>
              </div>
              <div style={{ width: "100%", height: 4, borderRadius: 2, background: "var(--bg3)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${completedCount / TRAINING_MODULES.length * 100}%`, background: "#c8f135", borderRadius: 2 }} />
              </div>
            </div>

            {TRAINING_MODULES.map(mod => {
              const status = empTraining[mod.id];
              const isExpanded = expandedModule === mod.id;
              return (
                <div key={mod.id} style={{ background: "var(--bg2)", border: `1px solid ${status === "overdue" ? "rgba(240,68,56,0.3)" : "var(--border)"}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)" }}>{mod.title}</span>
                        {mod.required && <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--red)", border: "1px solid rgba(240,68,56,0.3)", borderRadius: 3, padding: "1px 5px" }}>REQUIRED</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8, fontSize: 9, color: "var(--text3)" }}>
                        <span>{mod.duration}</span>
                        <span>·</span>
                        <span>{mod.statute}</span>
                        <span>·</span>
                        <span>{mod.deadline}</span>
                      </div>
                    </div>
                    <StatusPill status={status} />
                    {(status === "not-started" || status === "overdue") && (
                      <button onClick={() => sendReminder(mod.id)} disabled={!!sendingReminder}
                        style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: reminderSent === mod.id ? "rgba(18,183,106,0.1)" : "transparent", cursor: "pointer", fontSize: 9, color: reminderSent === mod.id ? "var(--green)" : "var(--text2)", fontWeight: 600 }}>
                        {sendingReminder === mod.id ? "Sending…" : reminderSent === mod.id ? "✓ Sent" : <><Send className="w-2.5 h-2.5 inline-block mr-1" />Remind</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "onboarding" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>New hire compliance checklist · Canadian statutory obligations</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: "#c8f135" }}>{onboardDone}/{ONBOARDING_ITEMS.length} complete</div>
          </div>
          {["Day 1", "Week 1", "Month 1"].map(category => (
            <div key={category} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border)" }}>{category}</div>
              {ONBOARDING_ITEMS.filter(i => i.category === category).map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 6, background: onboardingChecks[item.id] ? "rgba(18,183,106,0.04)" : "var(--bg2)", border: `1px solid ${onboardingChecks[item.id] ? "rgba(18,183,106,0.2)" : "var(--border)"}` }}>
                  <input type="checkbox" checked={!!onboardingChecks[item.id]} onChange={e => setOnboardingChecks(prev => ({ ...prev, [item.id]: e.target.checked }))}
                    style={{ marginTop: 2, accentColor: "#c8f135", cursor: "pointer", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: onboardingChecks[item.id] ? "var(--text3)" : "var(--text1)", textDecoration: onboardingChecks[item.id] ? "line-through" : "none" }}>{item.task}</div>
                    <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>{item.statute}</div>
                  </div>
                  {item.required && <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--red)", border: "1px solid rgba(240,68,56,0.3)", borderRadius: 3, padding: "1px 5px", flexShrink: 0 }}>STATUTORY</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "offboarding" && (
        <div>
          <div style={{ background: "rgba(240,68,56,0.06)", border: "1px solid rgba(240,68,56,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: "var(--red)" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Critical: Access revocation must happen on day of termination</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--text2)" }}>Failure to revoke access is one of the most common PIPEDA / CPPA violations. The system clock starts the moment employment ends.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Employee departure checklist · Privacy-compliant offboarding</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: "#c8f135" }}>{offboardDone}/{OFFBOARDING_ITEMS.length} complete</div>
          </div>
          {["Day of termination", "Within 7 days", "Within 30 days", "Ongoing"].map(category => (
            <div key={category} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border)" }}>
                {category === "Day of termination" ? <span style={{ color: "var(--red)" }}>⚡ {category}</span> : category}
              </div>
              {OFFBOARDING_ITEMS.filter(i => i.category === category).map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 6, background: offboardingChecks[item.id] ? "rgba(18,183,106,0.04)" : "var(--bg2)", border: `1px solid ${offboardingChecks[item.id] ? "rgba(18,183,106,0.2)" : item.critical ? "rgba(240,68,56,0.15)" : "var(--border)"}` }}>
                  <input type="checkbox" checked={!!offboardingChecks[item.id]} onChange={e => setOffboardingChecks(prev => ({ ...prev, [item.id]: e.target.checked }))}
                    style={{ marginTop: 2, accentColor: "#c8f135", cursor: "pointer", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: offboardingChecks[item.id] ? "var(--text3)" : "var(--text1)", textDecoration: offboardingChecks[item.id] ? "line-through" : "none" }}>{item.task}</div>
                    <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>{item.statute}</div>
                  </div>
                  {item.critical && !offboardingChecks[item.id] && <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--red)", border: "1px solid rgba(240,68,56,0.3)", borderRadius: 3, padding: "1px 5px", flexShrink: 0 }}>CRITICAL</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
