import { useState } from "react";
import { Link2, CheckCircle2, Clock, Database, FileText, Users, Shield, GitBranch, Cloud, Mail, Kanban, Building2, Globe, Lock, Server, Zap, AlertTriangle, RefreshCw } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  evidenceTypes: string[];
  icon: string;
  iconColor: string;
  iconBg: string;
  connected: boolean;
  lastSync?: string;
  evidenceCount?: number;
  autoCollects: string[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    category: "Engineering",
    description: "Auto-collect access control logs, code review evidence, branch protection policies.",
    evidenceTypes: ["Access control", "Code review logs", "Security policies"],
    icon: "GH",
    iconColor: "#f0f6ff",
    iconBg: "#24292e",
    connected: true,
    lastSync: "4 min ago",
    evidenceCount: 23,
    autoCollects: ["Branch protection rules", "Required reviewer policies", "Commit signing enforcement", "Security advisory subscriptions"],
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    description: "Pull CloudTrail audit logs, IAM policies, S3 encryption configs, and VPC flow logs.",
    evidenceTypes: ["CloudTrail logs", "IAM policies", "Encryption config"],
    icon: "AWS",
    iconColor: "#ff9900",
    iconBg: "#232f3e",
    connected: true,
    lastSync: "12 min ago",
    evidenceCount: 47,
    autoCollects: ["CloudTrail event history", "IAM access analyzer findings", "S3 bucket policies & encryption", "GuardDuty threat findings"],
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    category: "Productivity",
    description: "Employee directory, access logs, MFA status, and data retention policies.",
    evidenceTypes: ["User directory", "MFA status", "Access logs"],
    icon: "GW",
    iconColor: "#4285F4",
    iconBg: "#1a1a2e",
    connected: false,
    autoCollects: ["Admin audit logs", "User MFA/2FA enrollment status", "Drive sharing permissions", "Data retention policy settings"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Workspace retention policies, DLP alerts, and data export compliance records.",
    evidenceTypes: ["Retention policy", "DLP alerts", "Export records"],
    icon: "SL",
    iconColor: "#E01E5A",
    iconBg: "#1a1a2e",
    connected: false,
    autoCollects: ["Message retention policy", "Data export audit logs", "External sharing settings", "DLP policy enforcement records"],
  },
  {
    id: "jira",
    name: "Jira / Confluence",
    category: "ITSM",
    description: "Pull change management tickets, incident records, and risk register documentation.",
    evidenceTypes: ["Change tickets", "Incident records", "Risk register"],
    icon: "JR",
    iconColor: "#0052CC",
    iconBg: "#1a1a2e",
    connected: false,
    autoCollects: ["Change management tickets", "Incident/problem records", "Risk register items", "Audit preparation checklists"],
  },
  {
    id: "bamboohr",
    name: "BambooHR",
    category: "HR",
    description: "Sync employee compliance training completion, policy sign-offs, and onboarding records.",
    evidenceTypes: ["Training completion", "Policy sign-offs", "Onboarding records"],
    icon: "BH",
    iconColor: "#73c41d",
    iconBg: "#1a2e1a",
    connected: false,
    autoCollects: ["Employee training completion records", "Policy acknowledgment logs", "Onboarding completion status", "Termination/offboarding checklist completion"],
  },
  {
    id: "microsoft365",
    name: "Microsoft 365",
    category: "Productivity",
    description: "Azure AD access logs, Intune device compliance, and Microsoft Purview data governance.",
    evidenceTypes: ["Azure AD logs", "Device compliance", "Data governance"],
    icon: "M365",
    iconColor: "#00BCF2",
    iconBg: "#1a2a3a",
    connected: false,
    autoCollects: ["Azure AD sign-in logs", "Conditional access policies", "Intune device compliance status", "Purview data classification results"],
  },
  {
    id: "okta",
    name: "Okta",
    category: "Identity",
    description: "SSO access logs, MFA enforcement, privileged access reviews, and user lifecycle.",
    evidenceTypes: ["SSO audit logs", "MFA enforcement", "Access reviews"],
    icon: "OK",
    iconColor: "#007DC1",
    iconBg: "#1a1a2e",
    connected: false,
    autoCollects: ["Authentication event logs", "MFA enrollment & enforcement", "Privileged access review records", "User provisioning/deprovisioning logs"],
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    category: "ITSM",
    description: "ITSM change records, vendor SLAs, security incident reports, and GRC workflows.",
    evidenceTypes: ["Change records", "Vendor SLAs", "Incident reports"],
    icon: "SN",
    iconColor: "#00a1e0",
    iconBg: "#1a1a2e",
    connected: false,
    autoCollects: ["Change request audit trail", "Problem/incident records", "GRC control test results", "Vendor risk assessment responses"],
  },
  {
    id: "docusign",
    name: "DocuSign",
    category: "Legal",
    description: "Contract audit trails, e-signature records, vendor agreement tracking, and renewal alerts.",
    evidenceTypes: ["Signature audit trail", "Contract records", "Vendor agreements"],
    icon: "DS",
    iconColor: "#FFCC00",
    iconBg: "#1a1a12",
    connected: false,
    autoCollects: ["Envelope completion certificates", "Signer authentication records", "Contract expiry dates", "Vendor BAA signing status"],
  },
  {
    id: "snowflake",
    name: "Snowflake",
    category: "Data",
    description: "Data access audit logs, column-level encryption status, and data residency configuration.",
    evidenceTypes: ["Query audit logs", "Encryption status", "Data residency"],
    icon: "SF",
    iconColor: "#29B5E8",
    iconBg: "#1a2530",
    connected: false,
    autoCollects: ["Access history query logs", "Dynamic data masking policies", "Network policy configurations", "Data sharing agreement records"],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "CRM data access logs, field-level security, consent management, and PIPEDA compliance.",
    evidenceTypes: ["Data access logs", "Consent records", "Field-level security"],
    icon: "CRM",
    iconColor: "#00A1E0",
    iconBg: "#1a2030",
    connected: false,
    autoCollects: ["Field audit trail logs", "Record access history", "Privacy consent records", "Shield event monitoring data"],
  },
];

const CATEGORIES = ["All", "Engineering", "Cloud", "Productivity", "HR", "Identity", "ITSM", "Legal", "Data", "CRM", "Communication"];

export default function IntegrationsHub() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const connected = integrations.filter(i => i.connected);
  const totalEvidence = connected.reduce((sum, i) => sum + (i.evidenceCount || 0), 0);

  const connect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? {
        ...i, connected: true, lastSync: "Just now", evidenceCount: Math.floor(Math.random() * 30) + 5
      } : i));
      setConnecting(null);
    }, 2000);
  };

  const disconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false, lastSync: undefined, evidenceCount: undefined } : i));
  };

  const sync = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, lastSync: "Just now", evidenceCount: (i.evidenceCount || 0) + Math.floor(Math.random() * 5) } : i));
      setSyncing(null);
    }, 1500);
  };

  const filtered = selectedCategory === "All" ? integrations : integrations.filter(i => i.category === selectedCategory);

  return (
    <div className="page-content">
      <div style={{ background: "rgba(127,119,221,0.06)", border: "1px solid rgba(127,119,221,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Link2 className="w-3.5 h-3.5" style={{ color: "#7F77DD" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#7F77DD", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Integration Hub · Auto Evidence Collection</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Connect your cloud and enterprise tools. CanCompliance automatically pulls audit-ready evidence into your Evidence Portal — eliminating manual collection.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Connected", value: connected.length.toString(), icon: CheckCircle2, color: "var(--green)", sub: `of ${integrations.length} available` },
          { label: "Evidence items", value: totalEvidence.toString(), icon: FileText, color: "#c8f135", sub: "Auto-collected" },
          { label: "Last synced", value: "4 min ago", icon: Clock, color: "var(--text2)", sub: "GitHub + AWS" },
          { label: "Coverage", value: `${Math.round(connected.length / integrations.length * 100)}%`, icon: Shield, color: "#7F77DD", sub: "Integration coverage" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon className="w-4 h-4" style={{ color: card.color }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>{card.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: card.color, fontFamily: "var(--mono)", marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            style={{ padding: "4px 12px", borderRadius: 5, fontSize: 10, fontWeight: 500, cursor: "pointer", border: "1px solid",
              background: selectedCategory === cat ? "#c8f135" : "transparent",
              borderColor: selectedCategory === cat ? "#c8f135" : "var(--border)",
              color: selectedCategory === cat ? "#09090a" : "var(--text2)" }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {filtered.map(integ => {
          const isConnecting = connecting === integ.id;
          const isSyncing = syncing === integ.id;
          const isExpanded = expanded === integ.id;
          return (
            <div key={integ.id} data-integration={integ.id} data-connected={integ.connected ? "true" : "false"} style={{ background: "var(--bg2)", border: `1px solid ${integ.connected ? "rgba(200,241,53,0.2)" : "var(--border)"}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: integ.iconBg, flexShrink: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 900, color: integ.iconColor, letterSpacing: "-0.5px" }}>{integ.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text1)" }}>{integ.name}</div>
                      {integ.connected && (
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 5px rgba(18,183,106,0.5)" }} />
                      )}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{integ.category}</div>
                  </div>
                </div>

                <div style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.6, marginBottom: 12 }}>{integ.description}</div>

                {integ.connected && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div style={{ background: "var(--bg3)", borderRadius: 6, padding: "6px 10px" }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", marginBottom: 2, textTransform: "uppercase" }}>Last Sync</div>
                      <div style={{ fontSize: 10, color: "var(--green)" }}>{isSyncing ? "Syncing…" : integ.lastSync}</div>
                    </div>
                    <div style={{ background: "var(--bg3)", borderRadius: 6, padding: "6px 10px" }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", marginBottom: 2, textTransform: "uppercase" }}>Evidence</div>
                      <div style={{ fontSize: 10, color: "#c8f135", fontWeight: 700 }}>{integ.evidenceCount} items</div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 6 }}>
                  {integ.connected ? (
                    <>
                      <button onClick={() => sync(integ.id)} disabled={isSyncing}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg3)", cursor: "pointer", fontSize: 10, fontWeight: 600, color: "var(--text2)" }}>
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing" : "Sync Now"}
                      </button>
                      <button onClick={() => disconnect(integ.id)}
                        style={{ padding: "7px 12px", borderRadius: 7, border: "1px solid rgba(240,68,56,0.3)", background: "rgba(240,68,56,0.05)", cursor: "pointer", fontSize: 10, fontWeight: 600, color: "var(--red)" }}>
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button onClick={() => connect(integ.id)} disabled={isConnecting}
                      data-action="connect" data-integration-connect={integ.id}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 7, border: "none", cursor: isConnecting ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 11, background: isConnecting ? "var(--bg3)" : "#c8f135", color: isConnecting ? "var(--text3)" : "#09090a" }}>
                      {isConnecting ? <><RefreshCw className="w-3 h-3 animate-spin" /> Connecting…</> : <><Zap className="w-3 h-3" /> Connect</>}
                    </button>
                  )}
                  <button onClick={() => setExpanded(isExpanded ? null : integ.id)}
                    style={{ padding: "7px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontSize: 9, color: "var(--text3)" }}>
                    {isExpanded ? "▲" : "▼"}
                  </button>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Auto-collected evidence</div>
                    {integ.autoCollects.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", borderBottom: i < integ.autoCollects.length - 1 ? "1px solid var(--border)" : "none" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: integ.connected ? "var(--green)" : "var(--border)", flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: "var(--text2)" }}>{item}</span>
                      </div>
                    ))}
                    {!integ.connected && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, padding: "6px 8px", background: "rgba(245,166,35,0.08)", borderRadius: 5, border: "1px solid rgba(245,166,35,0.15)" }}>
                        <AlertTriangle className="w-3 h-3" style={{ color: "var(--amber)", flexShrink: 0 }} />
                        <span style={{ fontSize: 9, color: "var(--text3)" }}>Connect to start auto-collecting evidence</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
