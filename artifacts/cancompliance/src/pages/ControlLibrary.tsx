import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { CheckCircle2, AlertTriangle, Minus, Search } from "lucide-react";

type Control = {
  id: string;
  category: string;
  name: string;
  description: string;
  frameworks: string[];
  risk: "high" | "medium" | "low";
  status: "pass" | "fail" | "pending";
};

const CONTROLS: Control[] = [
  // Access & Identity
  { id: "AIM-01", category: "Access & Identity", name: "Multi-factor Authentication", description: "Require MFA for all privileged and remote access to systems processing regulated data.", frameworks: ["SOC 2", "ISO 27001", "HIPAA", "PIPEDA"], risk: "high", status: "fail" },
  { id: "AIM-02", category: "Access & Identity", name: "Role-Based Access Control (RBAC)", description: "Grant minimum necessary permissions based on job function. Review quarterly.", frameworks: ["SOC 2", "ISO 27001", "HIPAA", "GDPR", "PIPEDA"], risk: "high", status: "pass" },
  { id: "AIM-03", category: "Access & Identity", name: "User Provisioning & Deprovisioning", description: "Automated onboarding/offboarding; deactivate accounts within 24 hours of separation.", frameworks: ["SOC 2", "ISO 27001", "HIPAA"], risk: "high", status: "fail" },
  { id: "AIM-04", category: "Access & Identity", name: "Privileged Access Management (PAM)", description: "Segregate privileged accounts; log and review all privileged sessions.", frameworks: ["SOC 2", "ISO 27001", "NIST AI RMF"], risk: "high", status: "pending" },
  { id: "AIM-05", category: "Access & Identity", name: "Password Policy", description: "Minimum 12-character passwords, complexity requirements, no reuse of last 12.", frameworks: ["SOC 2", "ISO 27001", "HIPAA", "PIPEDA"], risk: "medium", status: "pass" },
  { id: "AIM-06", category: "Access & Identity", name: "Session Timeout Controls", description: "Auto-logout after 15 minutes of inactivity for systems holding regulated data.", frameworks: ["SOC 2", "HIPAA", "PIPEDA"], risk: "medium", status: "pending" },
  { id: "AIM-07", category: "Access & Identity", name: "Access Review", description: "Quarterly access recertification by system owners. Revoke unused access.", frameworks: ["SOC 2", "ISO 27001", "GDPR", "HIPAA"], risk: "medium", status: "fail" },
  { id: "AIM-08", category: "Access & Identity", name: "Vendor Access Controls", description: "Separate credentials for third-party vendors with time-limited tokens.", frameworks: ["SOC 2", "ISO 27001", "PIPEDA", "CASL"], risk: "high", status: "pending" },
  // Data Encryption
  { id: "ENC-01", category: "Data Encryption", name: "Encryption at Rest", description: "AES-256 encryption for all stored data containing PII or regulated information.", frameworks: ["SOC 2", "ISO 27001", "HIPAA", "GDPR", "PIPEDA", "Law 25"], risk: "high", status: "pass" },
  { id: "ENC-02", category: "Data Encryption", name: "Encryption in Transit", description: "TLS 1.2+ required for all data in transit. No unencrypted protocols (HTTP, FTP, Telnet).", frameworks: ["SOC 2", "ISO 27001", "HIPAA", "GDPR"], risk: "high", status: "pass" },
  { id: "ENC-03", category: "Data Encryption", name: "Key Management", description: "Rotate encryption keys annually. Store keys separate from encrypted data.", frameworks: ["SOC 2", "ISO 27001", "HIPAA"], risk: "high", status: "pending" },
  { id: "ENC-04", category: "Data Encryption", name: "Database Field-Level Encryption", description: "Encrypt sensitive fields (SIN, health data, payment) at database level.", frameworks: ["HIPAA", "PIPEDA", "GDPR", "Law 25"], risk: "high", status: "fail" },
  { id: "ENC-05", category: "Data Encryption", name: "Backup Encryption", description: "All backup media encrypted with separate backup encryption key.", frameworks: ["SOC 2", "ISO 27001", "HIPAA"], risk: "medium", status: "pending" },
  { id: "ENC-06", category: "Data Encryption", name: "Certificate Management", description: "Track TLS certificate expiry. Auto-renew or alert 30 days before expiry.", frameworks: ["SOC 2", "ISO 27001"], risk: "medium", status: "pass" },
  // Logging & Audit
  { id: "LOG-01", category: "Logging & Audit", name: "Centralized Audit Logging", description: "All user actions, admin events, and system changes logged to immutable audit trail.", frameworks: ["SOC 2", "ISO 27001", "HIPAA", "CASL", "FINTRAC"], risk: "high", status: "pass" },
  { id: "LOG-02", category: "Logging & Audit", name: "Log Retention", description: "Retain audit logs for minimum 7 years (FINTRAC) or per applicable regulation.", frameworks: ["FINTRAC", "CASL", "ISO 27001", "SOC 2"], risk: "high", status: "pending" },
  { id: "LOG-03", category: "Logging & Audit", name: "Tamper-Evident Logs", description: "Log integrity verification. Detect and alert on log modification or deletion.", frameworks: ["SOC 2", "ISO 27001", "HIPAA"], risk: "high", status: "fail" },
  { id: "LOG-04", category: "Logging & Audit", name: "Security Event Monitoring", description: "Real-time SIEM alerts for failed logins, privilege escalation, and anomalies.", frameworks: ["SOC 2", "ISO 27001", "NIST AI RMF"], risk: "high", status: "pending" },
  { id: "LOG-05", category: "Logging & Audit", name: "PHI Access Logging", description: "Log every access to health records including user, timestamp, and record accessed.", frameworks: ["HIPAA"], risk: "high", status: "pending" },
  { id: "LOG-06", category: "Logging & Audit", name: "Change Management Logging", description: "Log all infrastructure, code, and configuration changes with approver identity.", frameworks: ["SOC 2", "ISO 27001"], risk: "medium", status: "pass" },
  // Vendor & Third-Party
  { id: "VND-01", category: "Vendor Risk", name: "Vendor Security Assessment", description: "Annual security questionnaire for all vendors with access to customer data.", frameworks: ["SOC 2", "ISO 27001", "PIPEDA", "GDPR"], risk: "high", status: "fail" },
  { id: "VND-02", category: "Vendor Risk", name: "Business Associate Agreements (BAA)", description: "Execute BAAs with all vendors processing PHI before data sharing.", frameworks: ["HIPAA"], risk: "high", status: "pending" },
  { id: "VND-03", category: "Vendor Risk", name: "Data Processing Agreements (DPA)", description: "GDPR-compliant DPAs with all EU data processors documenting processing purposes.", frameworks: ["GDPR", "Law 25"], risk: "high", status: "fail" },
  { id: "VND-04", category: "Vendor Risk", name: "Sub-processor Management", description: "Inventory all sub-processors; notify customers of changes 30 days in advance.", frameworks: ["GDPR", "SOC 2", "PIPEDA"], risk: "medium", status: "pending" },
  { id: "VND-05", category: "Vendor Risk", name: "Cross-Border Transfer Safeguards", description: "Adequacy decisions or SCCs for data transfers outside Canada/EEA.", frameworks: ["PIPEDA", "GDPR", "Law 25"], risk: "high", status: "fail" },
  { id: "VND-06", category: "Vendor Risk", name: "Vendor Termination Protocol", description: "Ensure data deletion certificates and access revocation upon vendor offboarding.", frameworks: ["SOC 2", "ISO 27001", "GDPR", "PIPEDA"], risk: "medium", status: "pending" },
  // Incident Response
  { id: "INC-01", category: "Incident Response", name: "Incident Response Plan", description: "Documented, tested IRP with defined roles, escalation paths, and communication templates.", frameworks: ["SOC 2", "ISO 27001", "HIPAA", "PIPEDA"], risk: "high", status: "fail" },
  { id: "INC-02", category: "Incident Response", name: "Breach Notification — 72 Hours", description: "Notify OPC/CAI/regulator within 72 hours of discovering a breach of significant harm.", frameworks: ["PIPEDA", "Law 25", "GDPR", "HIPAA"], risk: "high", status: "pending" },
  { id: "INC-03", category: "Incident Response", name: "Breach Register", description: "Maintain a log of all breaches considered for reporting, including low-risk incidents.", frameworks: ["PIPEDA", "GDPR", "ISO 27001"], risk: "high", status: "pending" },
  { id: "INC-04", category: "Incident Response", name: "Tabletop Exercises", description: "Annual breach simulation tabletop exercises with executive and legal team.", frameworks: ["SOC 2", "ISO 27001", "HIPAA"], risk: "medium", status: "fail" },
  { id: "INC-05", category: "Incident Response", name: "Evidence Preservation", description: "Forensic-quality evidence collection procedures with chain-of-custody documentation.", frameworks: ["SOC 2", "ISO 27001", "FINTRAC"], risk: "medium", status: "pending" },
  { id: "INC-06", category: "Incident Response", name: "Post-Incident Review", description: "Root cause analysis within 2 weeks of any significant incident. Track remediation.", frameworks: ["SOC 2", "ISO 27001", "NIST AI RMF"], risk: "medium", status: "pending" },
  // Privacy & Consent
  { id: "PRI-01", category: "Privacy & Consent", name: "CASL Express Consent Records", description: "Maintain timestamped records of email consent with source, method, and opt-in language.", frameworks: ["CASL"], risk: "high", status: "pass" },
  { id: "PRI-02", category: "Privacy & Consent", name: "Unsubscribe Mechanism", description: "Functional unsubscribe in every commercial electronic message; process within 10 days.", frameworks: ["CASL", "GDPR"], risk: "high", status: "pass" },
  { id: "PRI-03", category: "Privacy & Consent", name: "Privacy Notice / Policy", description: "Plain-language privacy policy disclosing data types, purposes, transfers, and rights.", frameworks: ["PIPEDA", "GDPR", "Law 25", "CASL"], risk: "high", status: "pass" },
  { id: "PRI-04", category: "Privacy & Consent", name: "Data Subject Access Requests (DSAR)", description: "Process and respond to access/deletion/correction requests within 30 days.", frameworks: ["PIPEDA", "GDPR", "Law 25", "HIPAA"], risk: "high", status: "pending" },
  { id: "PRI-05", category: "Privacy & Consent", name: "Privacy Impact Assessment (PIA)", description: "Mandatory PIA before new systems processing personal information are deployed.", frameworks: ["Law 25", "GDPR", "PIPEDA"], risk: "high", status: "fail" },
  { id: "PRI-06", category: "Privacy & Consent", name: "Data Minimization", description: "Collect only personal data necessary for the stated purpose. Delete when no longer needed.", frameworks: ["GDPR", "PIPEDA", "Law 25", "CASL"], risk: "medium", status: "pending" },
  { id: "PRI-07", category: "Privacy & Consent", name: "Consent Withdrawal", description: "Mechanism for individuals to withdraw consent at any time; honor within 10 business days.", frameworks: ["CASL", "GDPR", "PIPEDA"], risk: "high", status: "pending" },
  { id: "PRI-08", category: "Privacy & Consent", name: "Data Retention & Deletion", description: "Documented retention schedules per data type; automated deletion at end of retention.", frameworks: ["GDPR", "PIPEDA", "Law 25", "HIPAA"], risk: "medium", status: "fail" },
  // AI Governance
  { id: "AIG-01", category: "AI Governance", name: "AI System Inventory", description: "Register all AI/ML systems with purpose, data inputs, risk classification, and owner.", frameworks: ["NIST AI RMF", "EU AI Act", "AIDA"], risk: "high", status: "pending" },
  { id: "AIG-02", category: "AI Governance", name: "High-Risk AI Classification", description: "Classify AI systems per AIDA/EU AI Act criteria. Document classification rationale.", frameworks: ["EU AI Act", "AIDA", "NIST AI RMF"], risk: "high", status: "pending" },
  { id: "AIG-03", category: "AI Governance", name: "Bias & Fairness Testing", description: "Pre-deployment bias testing across protected characteristics. Ongoing drift monitoring.", frameworks: ["NIST AI RMF", "EU AI Act", "AIDA"], risk: "high", status: "pending" },
  { id: "AIG-04", category: "AI Governance", name: "AI Transparency Documentation", description: "Model cards for all AI systems: training data, performance metrics, limitations.", frameworks: ["NIST AI RMF", "EU AI Act"], risk: "medium", status: "fail" },
  { id: "AIG-05", category: "AI Governance", name: "Human Oversight Controls", description: "Human review required for high-impact AI decisions (hiring, credit, health, law enforcement).", frameworks: ["EU AI Act", "AIDA", "NIST AI RMF"], risk: "high", status: "pending" },
  { id: "AIG-06", category: "AI Governance", name: "AI Incident Reporting", description: "Report serious AI incidents to minister (AIDA) or market surveillance (EU AI Act).", frameworks: ["AIDA", "EU AI Act"], risk: "high", status: "fail" },
  // Business Continuity
  { id: "BCP-01", category: "Business Continuity", name: "Disaster Recovery Plan", description: "Documented DRP with RTO < 4 hours and RPO < 1 hour for critical systems.", frameworks: ["SOC 2", "ISO 27001", "HIPAA"], risk: "high", status: "fail" },
  { id: "BCP-02", category: "Business Continuity", name: "Backup Testing", description: "Quarterly backup restoration tests with documented results.", frameworks: ["SOC 2", "ISO 27001", "HIPAA"], risk: "high", status: "pending" },
  { id: "BCP-03", category: "Business Continuity", name: "Uptime Availability Commitments", description: "SLA monitoring with 99.9% availability target; incident communication playbook.", frameworks: ["SOC 2"], risk: "medium", status: "pass" },
];

const CATEGORIES = ["All", ...Array.from(new Set(CONTROLS.map(c => c.category)))];
const FW_FILTERS = ["All", "SOC 2", "ISO 27001", "GDPR", "HIPAA", "PIPEDA", "CASL", "Law 25", "NIST AI RMF", "AIDA", "FINTRAC", "EU AI Act"];

const STATUS_CONFIG = {
  pass: { label: "PASS", color: "#12b76a", bg: "rgba(18,183,106,0.1)", icon: CheckCircle2 },
  fail: { label: "FAIL", color: "#f04438", bg: "rgba(240,68,56,0.08)", icon: AlertTriangle },
  pending: { label: "PENDING", color: "#f5a623", bg: "rgba(245,166,35,0.08)", icon: Minus },
};

const RISK_CONFIG = {
  high: { color: "#f04438" },
  medium: { color: "#f5a623" },
  low: { color: "#12b76a" },
};

export default function ControlLibrary() {
  const [category, setCategory] = useState("All");
  const [framework, setFramework] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = CONTROLS.filter(c =>
    (category === "All" || c.category === category) &&
    (framework === "All" || c.frameworks.includes(framework)) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const pass = CONTROLS.filter(c => c.status === "pass").length;
  const fail = CONTROLS.filter(c => c.status === "fail").length;
  const pending = CONTROLS.filter(c => c.status === "pending").length;

  return (
    <AppLayout title="Universal Control Library" subtitle={`${CONTROLS.length} controls · cross-framework mapping`}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Controls", value: CONTROLS.length.toString(), color: "text-foreground" },
          { label: "Passing", value: pass.toString(), color: "text-pass" },
          { label: "Failing", value: fail.toString(), color: "text-fail" },
          { label: "Pending Review", value: pending.toString(), color: "text-flag" },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{m.label}</div>
            <div className={`text-2xl font-semibold ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-5 space-y-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search controls…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] bg-muted/40 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors"
              style={category === c ? { background: "#c8f135", color: "#09090a" } : { color: "var(--muted-foreground)" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {FW_FILTERS.map(f => (
            <button key={f} onClick={() => setFramework(f)}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono border transition-colors"
              style={framework === f
                ? { background: "rgba(127,119,221,0.2)", color: "#7F77DD", borderColor: "#7F77DD" }
                : { color: "var(--muted-foreground)", borderColor: "transparent" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="text-[12px] font-medium text-foreground">{filtered.length} controls</div>
          <div className="font-mono text-[9px] text-muted-foreground">Showing {framework !== "All" ? framework : "all frameworks"}</div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-muted/40">
              {["ID", "Control", "Frameworks", "Risk", "Status"].map(h => (
                <th key={h} className="text-left font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-4 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const sc = STATUS_CONFIG[c.status];
              const StatusIcon = sc.icon;
              return (
                <tr key={c.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[12px] font-medium text-foreground mb-0.5">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed max-w-xs">{c.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.frameworks.slice(0, 3).map(f => (
                        <span key={f} className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(127,119,221,0.12)", color: "#7F77DD" }}>
                          {f}
                        </span>
                      ))}
                      {c.frameworks.length > 3 && (
                        <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{c.frameworks.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[9px] uppercase" style={{ color: RISK_CONFIG[c.risk].color }}>
                      {c.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] px-2 py-1 rounded-md w-fit"
                      style={{ color: sc.color, background: sc.bg }}>
                      <StatusIcon size={10} />
                      {sc.label}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
