import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Network, Send, CheckCircle, Clock, AlertTriangle, Shield, Users, Plus, X } from "lucide-react";
import { useUser } from "@clerk/react";

const COMPLIANCE_AREAS = [
  { id: "casl", label: "CASL", desc: "Commercial email consent & unsubscribe" },
  { id: "pipeda", label: "PIPEDA", desc: "Privacy & data protection" },
  { id: "s211", label: "S-211", desc: "Modern Slavery Act supply chain" },
  { id: "employment", label: "Employment", desc: "Employment standards compliance" },
  { id: "esg", label: "ESG", desc: "Greenwashing & environmental claims" },
  { id: "fintrac", label: "FINTRAC", desc: "AML / KYC obligations" },
];

interface TrustRequest {
  id: string;
  supplierName: string;
  supplierEmail: string;
  areas: string[];
  status: "Pending" | "Verified" | "Overdue";
  sentDate: string;
  responseDate?: string;
}

const DEMO_REQUESTS: TrustRequest[] = [
  {
    id: "req-001",
    supplierName: "Maple Logistics Inc.",
    supplierEmail: "compliance@maplelogistics.ca",
    areas: ["CASL", "S-211", "PIPEDA"],
    status: "Verified",
    sentDate: "Mar 15, 2025",
    responseDate: "Mar 18, 2025",
  },
  {
    id: "req-002",
    supplierName: "Northern Packaging Co.",
    supplierEmail: "info@northernpackaging.ca",
    areas: ["ESG", "S-211"],
    status: "Overdue",
    sentDate: "Mar 1, 2025",
  },
  {
    id: "req-003",
    supplierName: "TechServ Ottawa",
    supplierEmail: "legal@techserv.ca",
    areas: ["CASL", "PIPEDA", "Employment"],
    status: "Pending",
    sentDate: "Apr 3, 2025",
  },
];

const STATUS_CONFIG = {
  Verified: { color: "#12b76a", bg: "#12b76a15", icon: CheckCircle },
  Pending: { color: "#f5a623", bg: "#f5a62315", icon: Clock },
  Overdue: { color: "#f04438", bg: "#f0443815", icon: AlertTriangle },
};

const VERIFIED_AREAS = ["CASL", "GST/HST", "Employment", "Payroll"];

export default function TrustNetwork() {
  const { user } = useUser();
  const [requests, setRequests] = useState<TrustRequest[]>(DEMO_REQUESTS);
  const [showForm, setShowForm] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const displayName = user?.firstName ?? user?.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "Your Business";

  function toggleArea(areaLabel: string) {
    setSelectedAreas(prev =>
      prev.includes(areaLabel) ? prev.filter(a => a !== areaLabel) : [...prev, areaLabel]
    );
  }

  function sendRequest() {
    if (!supplierName.trim() || !supplierEmail.trim() || selectedAreas.length === 0) return;
    const newReq: TrustRequest = {
      id: `req-${Date.now()}`,
      supplierName,
      supplierEmail,
      areas: selectedAreas,
      status: "Pending",
      sentDate: new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }),
    };
    setRequests(prev => [newReq, ...prev]);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setShowForm(false);
      setSupplierName("");
      setSupplierEmail("");
      setSelectedAreas([]);
    }, 2000);
  }

  const verifiedCount = requests.filter(r => r.status === "Verified").length;
  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const overdueCount = requests.filter(r => r.status === "Overdue").length;
  const networkScore = Math.round((verifiedCount / Math.max(requests.length, 1)) * 100);

  return (
    <AppLayout title="Trust Network" subtitle="Request compliance proof from suppliers — build your B2B trust profile">
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">B2B Viral Loop · Network Effect</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Compliance Trust Network</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            Request compliance proof from your suppliers and vendors. Each request pulls them into the network. 
            Your trust profile grows as you run passing checks — show customers and partners that you're compliant at a glance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Network Score", value: `${networkScore}%`, color: networkScore >= 70 ? "text-pass" : "text-flag", sub: "suppliers verified" },
            { label: "Verified", value: verifiedCount.toString(), color: "text-pass", sub: "suppliers" },
            { label: "Pending", value: pendingCount.toString(), color: "text-flag", sub: "awaiting response" },
            { label: "Overdue", value: overdueCount.toString(), color: "text-fail", sub: "no response" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`text-2xl font-semibold ${s.color} mb-0.5`}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-5">
          {/* Trust profile */}
          <div className="col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <div className="text-[13px] font-medium text-foreground">Your Trust Profile</div>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Verified as</div>
                  <div className="text-[15px] font-semibold text-foreground">{displayName}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">CanCompliance Trust ID · CC-{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Verified Compliance Areas</div>
                  <div className="flex flex-wrap gap-1.5">
                    {VERIFIED_AREAS.map(area => (
                      <span key={area} className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: "#12b76a30", background: "#12b76a10", color: "#12b76a" }}>
                        <CheckCircle className="w-2.5 h-2.5" />
                        {area}
                      </span>
                    ))}
                    {["FINTRAC", "ESG"].map(area => (
                      <span key={area} className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground">
                        <Clock className="w-2.5 h-2.5" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Network Activity</div>
                  <div className="space-y-2 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total requests sent</span>
                      <span className="font-mono text-foreground">{requests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network size</span>
                      <span className="font-mono text-foreground">{requests.length} suppliers</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trust score</span>
                      <span className="font-mono" style={{ color: "#c8f135" }}>{networkScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[13px] font-medium text-foreground mb-3">How the Trust Loop Works</div>
              <div className="space-y-3">
                {[
                  { step: "1", text: "You request compliance proof from a supplier" },
                  { step: "2", text: "They receive an email inviting them to verify on CanCompliance" },
                  { step: "3", text: "They run checks → you see verified status update" },
                  { step: "4", text: "They're now in the network — and can request proof from their suppliers" },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold mt-0.5" style={{ background: "#c8f135", color: "#09090a" }}>
                      {item.step}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requests panel */}
          <div className="col-span-3 space-y-4">
            {/* Request form */}
            {!showForm ? (
              <button
                data-testid="btn-new-request"
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-xl p-4 text-[13px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                Request compliance proof from a supplier
              </button>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary" />
                    <div className="text-[13px] font-medium text-foreground">New Compliance Request</div>
                  </div>
                  <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1.5">Supplier / Vendor Name</label>
                      <input
                        data-testid="input-supplier-name"
                        value={supplierName}
                        onChange={e => setSupplierName(e.target.value)}
                        placeholder="Acme Supplier Co."
                        className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1.5">Contact Email</label>
                      <input
                        data-testid="input-supplier-email"
                        type="email"
                        value={supplierEmail}
                        onChange={e => setSupplierEmail(e.target.value)}
                        placeholder="compliance@supplier.ca"
                        className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Areas to Verify</label>
                    <div className="grid grid-cols-2 gap-2">
                      {COMPLIANCE_AREAS.map(area => (
                        <button
                          key={area.id}
                          data-testid={`area-${area.id}`}
                          onClick={() => toggleArea(area.label)}
                          className="flex items-start gap-2 p-2.5 rounded-lg border text-left transition-all"
                          style={selectedAreas.includes(area.label)
                            ? { borderColor: "#c8f135", background: "#c8f13510" }
                            : { borderColor: "var(--border)" }
                          }
                        >
                          <div
                            className="w-3.5 h-3.5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center"
                            style={selectedAreas.includes(area.label)
                              ? { background: "#c8f135", borderColor: "#c8f135" }
                              : { borderColor: "var(--border)" }
                            }
                          >
                            {selectedAreas.includes(area.label) && <CheckCircle className="w-2.5 h-2.5 text-black" />}
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-foreground">{area.label}</div>
                            <div className="text-[10px] text-muted-foreground">{area.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    data-testid="btn-send-request"
                    onClick={sendRequest}
                    disabled={!supplierName || !supplierEmail || selectedAreas.length === 0 || sent}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
                    style={{ background: "#c8f135", color: "#09090a" }}
                  >
                    {sent ? <><CheckCircle className="w-4 h-4" /> Request Sent!</> : <><Send className="w-4 h-4" /> Send Compliance Request</>}
                  </button>
                  <p className="text-[10px] text-muted-foreground font-mono">The supplier will receive an email inviting them to verify their compliance on CanCompliance.</p>
                </div>
              </div>
            )}

            {/* Requests list */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div className="text-[13px] font-medium text-foreground">Supplier Requests</div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{requests.length} total</span>
              </div>
              <div className="divide-y divide-border">
                {requests.map(req => {
                  const cfg = STATUS_CONFIG[req.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={req.id} className="px-5 py-4" data-testid={`request-${req.id}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-medium text-foreground">{req.supplierName}</span>
                            <span
                              className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded"
                              style={{ background: cfg.bg, color: cfg.color }}
                            >
                              <StatusIcon className="w-2.5 h-2.5" />
                              {req.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono mb-1.5">{req.supplierEmail}</div>
                          <div className="flex flex-wrap gap-1">
                            {req.areas.map(area => (
                              <span key={area} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{area}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono text-[10px] text-muted-foreground">Sent {req.sentDate}</div>
                          {req.responseDate && <div className="font-mono text-[10px] text-pass">Verified {req.responseDate}</div>}
                          {req.status === "Overdue" && <div className="font-mono text-[10px] text-fail">No response</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>Compliance verification requests are sent via email through CanCompliance's notification system. Supplier data is handled in accordance with PIPEDA and used only for trust verification purposes. CanCompliance does not share supplier data with third parties.</span>
        </div>
      </div>
    </AppLayout>
  );
}
