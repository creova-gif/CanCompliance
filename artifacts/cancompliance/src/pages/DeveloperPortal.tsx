import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Code2, Key, Zap, Copy, Trash2, Plus, Check, Globe, Shield, RefreshCw, Webhook, BookOpen, ExternalLink } from "lucide-react";
import { useUser } from "@clerk/react";
import { getDemoUser } from "@/lib/demoSession";

interface ApiKey {
  id: number;
  name: string;
  keyPrefix: string;
  scopes: string;
  callCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

const ENDPOINTS = [
  {
    method: "POST", path: "/api/compliance/run-check", badge: "CASL · PIPEDA · FINTRAC",
    desc: "Run a compliance check against Canadian and global regulations. Returns status, score, statute citations, and remediation steps.",
    body: `{
  "module": "CASL",
  "data": {
    "sendsCommercialEmails": "yes",
    "hasUnsubscribe": "yes",
    "expressConsent": "no"
  }
}`,
    response: `{
  "status": "fail",
  "score": 34,
  "title": "CASL Violation — Missing express consent",
  "statute": "CASL S.6(1)(a)",
  "remediation": "Obtain express written consent before sending CEMs."
}`,
  },
  {
    method: "POST", path: "/api/compliance/scan-url", badge: "All modules",
    desc: "Scan a public URL (website or PDF link) for compliance violations. Claude reads the content and flags issues with statute citations.",
    body: `{
  "url": "https://example.com/privacy-policy"
}`,
    response: `{
  "violations": [
    {
      "statute": "PIPEDA S.4.3",
      "issue": "No named Privacy Officer contact",
      "severity": "high"
    }
  ],
  "score": 71,
  "summary": "2 violations found"
}`,
  },
  {
    method: "GET", path: "/api/developer/keys", badge: "Auth required",
    desc: "List all active API keys for the authenticated user.",
    body: null,
    response: `{
  "keys": [
    {
      "id": 1,
      "name": "Production",
      "keyPrefix": "cc_live_a3f8b2",
      "scopes": "casl,pipeda,fintrac",
      "callCount": 1284,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}`,
  },
];

const PARTNERS = [
  { name: "Wave Accounting", users: "2M+ Canadian users", logo: "W", color: "#1a73e8", desc: "Embed CASL + GST/HST compliance checks directly in invoice and email workflows." },
  { name: "Humi", users: "Thousands of Canadian employers", logo: "H", color: "#7F77DD", desc: "Surface Employment Standards and Payroll compliance alerts inside HR workflows." },
  { name: "Shopify", users: "100K+ Canadian merchants", logo: "S", color: "#12b76a", desc: "Flag PIPEDA, CASL, and Consumer Protection issues for e-commerce stores." },
  { name: "QuickBooks", users: "600K+ Canadian SMBs", logo: "Q", color: "#f5a623", desc: "Integrate GST/HST, payroll tax, and FINTRAC compliance into bookkeeping flows." },
  { name: "Xero", users: "Global + Canadian", logo: "X", color: "#c8f135", desc: "Connect accounting data with compliance checks across tax and regulatory modules." },
  { name: "Custom", users: "Any platform", logo: "+", color: "#9ca3af", desc: "RESTful JSON API — integrate with any SaaS, internal tool, or customer portal." },
];

const RATE_LIMITS = [
  { plan: "Starter", price: "Free", checks: "100/month", rate: "10/min", modules: "CASL, PIPEDA" },
  { plan: "Professional", price: "$79/mo", checks: "5,000/month", rate: "60/min", modules: "All 16 modules" },
  { plan: "Enterprise", price: "Custom", checks: "Unlimited", rate: "500/min", modules: "All + custom" },
];

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: "#0d0d0f", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <span className="font-mono text-[10px] text-muted-foreground">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="w-3 h-3" style={{ color: "#12b76a" }} /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

export default function DeveloperPortal() {
  const { user } = useUser();
  const demoUser = getDemoUser();
  const isDemoMode = !!demoUser;

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"keys" | "docs" | "partners" | "webhooks">("keys");

  const userId = user?.id;

  const fetchKeys = async () => {
    if (!userId || isDemoMode) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/developer/keys`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, [userId]);

  const handleCreate = async () => {
    if (!newKeyName.trim() || isDemoMode) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/developer/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newKeyName.trim(), scopes: ["casl", "pipeda", "fintrac", "gdpr", "hipaa"] }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedKey(data.rawKey);
        setNewKeyName("");
        await fetchKeys();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: number) => {
    if (isDemoMode) return;
    setRevoking(id);
    try {
      await fetch(`${BASE}/api/developer/keys/${id}`, { method: "DELETE", credentials: "include" });
      setKeys(k => k.filter(k => k.id !== id));
    } finally {
      setRevoking(null);
    }
  };

  const DEMO_KEYS: ApiKey[] = [
    { id: 1, name: "Production", keyPrefix: "cc_live_a3f8b2c1", scopes: "casl,pipeda,fintrac,gdpr,hipaa", callCount: 1284, lastUsedAt: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: 2, name: "Staging", keyPrefix: "cc_live_d9e4f7a2", scopes: "casl,pipeda", callCount: 47, lastUsedAt: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  ];

  const displayKeys = isDemoMode ? DEMO_KEYS : keys;

  const quickStartCode = `curl -X POST https://api.cancompliance.ca/v1/compliance/check \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "module": "CASL",
    "data": {
      "sendsCommercialEmails": "yes",
      "hasUnsubscribe": "yes",
      "expressConsent": "no"
    }
  }'`;

  const jsCode = `import { CanComplianceClient } from "@cancompliance/sdk";

const client = new CanComplianceClient({
  apiKey: process.env.CANCOMPLIANCE_API_KEY,
});

const result = await client.check({
  module: "CASL",
  data: { sendsCommercialEmails: "yes", expressConsent: "no" },
});

console.log(result.status);   // "fail"
console.log(result.statute);  // "CASL S.6(1)(a)"`;

  const pythonCode = `import cancompliance

client = cancompliance.Client(api_key=os.environ["CANCOMPLIANCE_API_KEY"])

result = client.check(
    module="CASL",
    data={"sendsCommercialEmails": "yes", "expressConsent": "no"}
)

print(result.status)   # fail
print(result.statute)  # CASL S.6(1)(a)`;

  const webhookCode = `// CanCompliance sends a POST to your endpoint on compliance events
{
  "event": "compliance.check.completed",
  "timestamp": "2026-04-09T10:30:00Z",
  "data": {
    "module": "CASL",
    "status": "fail",
    "statute": "CASL S.6(1)(a)",
    "userId": "user_abc123"
  }
}`;

  const TABS = [
    { id: "keys", label: "API Keys", icon: Key },
    { id: "docs", label: "Endpoint Docs", icon: Code2 },
    { id: "partners", label: "Integration Partners", icon: Globe },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
  ] as const;

  return (
    <AppLayout title="Compliance API" subtitle="Embed Canadian compliance logic into any product">
      {/* Hero stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "API Uptime", value: "99.98%", color: "#12b76a" },
          { label: "Avg Latency", value: "210ms", color: "#c8f135" },
          { label: "Compliance Endpoints", value: "14", color: "#7F77DD" },
          { label: "Regulations Covered", value: "19", color: "#f5a623" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5">
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">{s.label}</div>
            <div className="text-3xl font-semibold leading-none mb-1 stat-animate" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Context banner */}
      <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ background: "rgba(200,241,53,0.06)", border: "1px solid rgba(200,241,53,0.15)" }}>
        <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#c8f135" }} />
        <div className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="font-semibold" style={{ color: "#c8f135" }}>Distribution without sales.</span> Wave Accounting (2M Canadian users), Humi (thousands of employers), and Shopify (100K+ merchants) can surface CanCompliance checks inside the tools SMBs use every day — through a single REST API call. Every check they run is a recurring API event that scales automatically.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-all duration-150 border-b-2 -mb-px"
            style={{
              borderColor: activeTab === t.id ? "#c8f135" : "transparent",
              color: activeTab === t.id ? "#c8f135" : "var(--muted-foreground)",
            }}>
            <t.icon className="w-3 h-3" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── API KEYS TAB ── */}
      {activeTab === "keys" && (
        <div className="space-y-5">
          {/* Create key */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="font-semibold text-foreground text-[13px] mb-1">Generate API Key</div>
            <div className="text-[11px] text-muted-foreground mb-4">Keys grant access to all compliance endpoints. Store them securely — they are shown only once.</div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
                placeholder={isDemoMode ? "Demo mode — sign in to create real keys" : "Key name (e.g. Production, Staging, Wave Integration)"}
                disabled={isDemoMode}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
              />
              <button
                onClick={handleCreate}
                disabled={!newKeyName.trim() || loading || isDemoMode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold disabled:opacity-40 transition-all duration-150"
                style={{ background: "#c8f135", color: "#09090a" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Generate
              </button>
            </div>
          </div>

          {/* Newly created key — show once */}
          {createdKey && (
            <div className="rounded-xl p-4 alert-animate" style={{ background: "rgba(18,183,106,0.08)", border: "1px solid rgba(18,183,106,0.3)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4" style={{ color: "#12b76a" }} />
                <span className="font-semibold text-[12px]" style={{ color: "#12b76a" }}>API key generated — copy it now, it won't be shown again</span>
              </div>
              <div className="flex items-center gap-3 bg-background rounded-lg p-3 font-mono text-[11px] text-foreground">
                <span className="flex-1 break-all">{createdKey}</span>
                <button onClick={() => { navigator.clipboard.writeText(createdKey); }} className="flex-shrink-0">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
              <button onClick={() => setCreatedKey(null)} className="mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors">Dismiss</button>
            </div>
          )}

          {/* Keys list */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="text-[12px] font-medium text-foreground">Active Keys</div>
              <button onClick={fetchKeys} disabled={loading || isDemoMode} className="text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "spin-smooth" : ""}`} />
              </button>
            </div>
            {displayKeys.length === 0 ? (
              <div className="px-5 py-8 text-center text-[12px] text-muted-foreground">No API keys yet — generate one above to get started.</div>
            ) : (
              <div className="divide-y divide-border">
                {displayKeys.map(k => (
                  <div key={k.id} className="flex items-center gap-4 px-5 py-4 card-hover">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,241,53,0.1)" }}>
                      <Key className="w-4 h-4" style={{ color: "#c8f135" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-[13px] text-foreground">{k.name}</span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(18,183,106,0.1)", color: "#12b76a" }}>Active</span>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">{k.keyPrefix}••••••••••••••••</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {k.scopes.split(",").map(s => (
                          <span key={s} className="inline-block mr-1 px-1 py-0.5 rounded font-mono text-[8px]" style={{ background: "rgba(127,119,221,0.1)", color: "#7F77DD" }}>{s.toUpperCase()}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[12px] font-medium text-foreground">{k.callCount?.toLocaleString() ?? 0} calls</div>
                      <div className="text-[10px] text-muted-foreground">{k.lastUsedAt ? `Last used ${new Date(k.lastUsedAt).toLocaleDateString("en-CA")}` : "Never used"}</div>
                      <div className="text-[9px] text-muted-foreground/60">Created {new Date(k.createdAt).toLocaleDateString("en-CA")}</div>
                    </div>
                    <button
                      onClick={() => handleRevoke(k.id)}
                      disabled={revoking === k.id || isDemoMode}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-fail/10 transition-colors disabled:opacity-40"
                      title="Revoke key"
                    >
                      <Trash2 className={`w-3.5 h-3.5 ${revoking === k.id ? "spin-smooth" : ""}`} style={{ color: "#f04438" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rate limits */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border font-medium text-[12px] text-foreground">Rate Limits by Plan</div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Plan", "Price", "Checks/month", "Rate limit", "Modules"].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RATE_LIMITS.map(r => (
                  <tr key={r.plan} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-[12px] font-medium text-foreground">{r.plan}</td>
                    <td className="px-5 py-3 font-mono text-[11px]" style={{ color: "#c8f135" }}>{r.price}</td>
                    <td className="px-5 py-3 text-[11px] text-muted-foreground">{r.checks}</td>
                    <td className="px-5 py-3 text-[11px] text-muted-foreground">{r.rate}</td>
                    <td className="px-5 py-3 text-[11px] text-muted-foreground">{r.modules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ENDPOINT DOCS TAB ── */}
      {activeTab === "docs" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="font-semibold text-foreground text-[13px] mb-3">Quick Start</div>
            <div className="space-y-3">
              <CodeBlock code={quickStartCode} lang="curl" />
              <CodeBlock code={jsCode} lang="javascript (Node.js)" />
              <CodeBlock code={pythonCode} lang="python" />
            </div>
          </div>

          {ENDPOINTS.map(ep => (
            <div key={ep.path} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 px-5 py-4 border-b border-border">
                <span className="font-mono text-[10px] font-bold px-2 py-1 rounded flex-shrink-0 mt-0.5"
                  style={{
                    background: ep.method === "POST" ? "rgba(200,241,53,0.1)" : ep.method === "GET" ? "rgba(18,183,106,0.1)" : "rgba(240,68,56,0.1)",
                    color: ep.method === "POST" ? "#c8f135" : ep.method === "GET" ? "#12b76a" : "#f04438",
                  }}>
                  {ep.method}
                </span>
                <div className="flex-1">
                  <div className="font-mono text-[12px] text-foreground mb-1">{ep.path}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{ep.desc}</div>
                  <div className="mt-1">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(127,119,221,0.1)", color: "#7F77DD" }}>{ep.badge}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4">
                {ep.body && (
                  <div>
                    <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">Request Body</div>
                    <CodeBlock code={ep.body} lang="json" />
                  </div>
                )}
                <div className={ep.body ? "" : "col-span-2"}>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">Response</div>
                  <CodeBlock code={ep.response} lang="json" />
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-lg p-4 text-[11px] text-muted-foreground" style={{ background: "rgba(127,119,221,0.06)", border: "1px solid rgba(127,119,221,0.15)" }}>
            <span style={{ color: "#7F77DD" }} className="font-semibold">Authentication:</span> All endpoints require an <code className="font-mono text-[10px] px-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>Authorization: Bearer YOUR_API_KEY</code> header. Keys are generated above. Invalid or revoked keys return HTTP 401.
          </div>
        </div>
      )}

      {/* ── INTEGRATION PARTNERS TAB ── */}
      {activeTab === "partners" && (
        <div className="space-y-5">
          <div className="text-[11px] text-muted-foreground leading-relaxed mb-2">
            Embed CanCompliance compliance checks into the tools Canadian SMBs already use. No sign-up friction — the check happens inside the partner product, powered by CanCompliance's API.
          </div>
          <div className="grid grid-cols-3 gap-4">
            {PARTNERS.map(p => (
              <div key={p.name} className="bg-card border border-border rounded-xl p-5 card-hover flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[16px] font-bold flex-shrink-0"
                    style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}>
                    {p.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-[13px] text-foreground">{p.name}</div>
                    <div className="font-mono text-[9px] text-muted-foreground">{p.users}</div>
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed flex-1">{p.desc}</div>
                <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: p.color }}>
                  <ExternalLink className="w-3 h-3" />
                  View integration guide
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="font-semibold text-foreground text-[13px] mb-2">Partner Reach Model</div>
            <div className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              At 0.1% API conversion from partner user bases, CanCompliance reaches 2,700+ paying customers without a single sales call. Each API event is a recurring revenue moment.
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { platform: "Wave", users: "2,000,000", conv: "0.1%", paying: "2,000" },
                { platform: "Humi", users: "50,000", conv: "0.5%", paying: "250" },
                { platform: "Shopify CA", users: "100,000", conv: "0.45%", paying: "450" },
              ].map(r => (
                <div key={r.platform} className="rounded-lg p-4" style={{ background: "rgba(200,241,53,0.05)", border: "1px solid rgba(200,241,53,0.12)" }}>
                  <div className="font-semibold text-[12px] text-foreground mb-1">{r.platform}</div>
                  <div className="font-mono text-[9px] text-muted-foreground">{parseInt(r.users).toLocaleString()} users</div>
                  <div className="font-mono text-[9px] text-muted-foreground">{r.conv} conversion</div>
                  <div className="text-lg font-semibold mt-2" style={{ color: "#c8f135" }}>{parseInt(r.paying).toLocaleString()}</div>
                  <div className="font-mono text-[9px] text-muted-foreground">est. paying customers</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WEBHOOKS TAB ── */}
      {activeTab === "webhooks" && (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="font-semibold text-foreground text-[13px] mb-1">Webhook Events</div>
            <div className="text-[11px] text-muted-foreground mb-4">CanCompliance can push real-time compliance events to your endpoint as they happen — no polling required.</div>
            <div className="space-y-2 mb-4">
              {[
                { event: "compliance.check.completed", desc: "A compliance check was run and scored", severity: "info" },
                { event: "compliance.check.failed", desc: "A check returned FAIL status with violations", severity: "fail" },
                { event: "compliance.deadline.approaching", desc: "A regulatory deadline is within 30 days", severity: "warn" },
                { event: "compliance.legislation.updated", desc: "A tracked bill changed status", severity: "info" },
                { event: "api.key.rate_limited", desc: "Your key hit the rate limit ceiling", severity: "warn" },
              ].map(ev => (
                <div key={ev.event} className="flex items-center gap-3 px-4 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ev.severity === "fail" ? "#f04438" : ev.severity === "warn" ? "#f5a623" : "#12b76a" }} />
                  <code className="font-mono text-[10px] text-foreground">{ev.event}</code>
                  <span className="text-[11px] text-muted-foreground">{ev.desc}</span>
                </div>
              ))}
            </div>
            <CodeBlock code={webhookCode} lang="json — webhook payload" />
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="font-semibold text-foreground text-[13px] mb-3">Register Webhook Endpoint</div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="https://your-app.com/webhooks/cancompliance"
                disabled={isDemoMode}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
              />
              <button
                disabled={isDemoMode}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold disabled:opacity-40 transition-all"
                style={{ background: "#c8f135", color: "#09090a" }}
              >
                Register
              </button>
            </div>
            {isDemoMode && <div className="mt-2 text-[10px] text-muted-foreground">Sign in to register a real webhook endpoint.</div>}
          </div>

          <div className="rounded-lg p-4" style={{ background: "rgba(127,119,221,0.06)", border: "1px solid rgba(127,119,221,0.15)" }}>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#7F77DD" }} />
              <div className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-semibold" style={{ color: "#7F77DD" }}>Webhook security:</span> Each webhook delivery includes an <code className="font-mono text-[10px] px-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>X-CanCompliance-Signature</code> header — HMAC-SHA256 of the payload using your webhook secret. Always verify this before processing.
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
