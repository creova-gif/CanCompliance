import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Award, Copy, Share2, ExternalLink } from "lucide-react";

const MODULES = [
  { name: "CASL", score: 40, status: "fail" },
  { name: "PIPEDA", score: 75, status: "flag" },
  { name: "Bill 96 (Quebec)", score: 60, status: "flag" },
  { name: "Employment Standards", score: 85, status: "pass" },
  { name: "WSIB", score: 90, status: "pass" },
  { name: "Payroll / CRA", score: 88, status: "pass" },
];

const OVERALL_SCORE = Math.round(MODULES.reduce((a, m) => a + m.score, 0) / MODULES.length);

const CERT_ID = `CC-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

function ScoreRing({ score, animated }: { score: number; animated: boolean }) {
  const size = 200;
  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const displayScore = animated ? score : 0;
  const offset = circ - (displayScore / 100) * circ;

  const color = score >= 80 ? "#36c97e" : score >= 60 ? "#f5a623" : "#ff4d3a";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={animated ? offset : circ}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-semibold" style={{ color }}>{animated ? score : 0}</div>
        <div className="font-mono text-[11px] text-muted-foreground">/100</div>
      </div>
    </div>
  );
}

export default function ComplianceScore() {
  const [animated, setAnimated] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const certUrl = `https://cancompliance.ca/cert/${CERT_ID.toLowerCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(certUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = OVERALL_SCORE >= 80 ? "text-green-400" : OVERALL_SCORE >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <AppLayout title="Compliance Score" subtitle="Overall standing">
      <div className="max-w-3xl">
        <div className="mb-7">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Your Compliance Standing</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Compliance Score</h1>
          <p className="text-[13px] text-muted-foreground">Based on your most recent checks across all active modules.</p>
        </div>

        <div className="grid grid-cols-5 gap-6 mb-6">
          {/* Score Ring */}
          <div className="col-span-2 bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4">
            <ScoreRing score={OVERALL_SCORE} animated={animated} />
            <div className="text-center">
              <div className={`text-[15px] font-semibold ${scoreColor} mb-1`}>
                {OVERALL_SCORE >= 80 ? "Good standing" : OVERALL_SCORE >= 60 ? "Needs attention" : "At risk"}
              </div>
              <div className="text-[12px] text-muted-foreground">as of {today}</div>
            </div>
            <button
              data-testid="btn-generate-certificate"
              onClick={() => setShowCert(true)}
              className="w-full py-2.5 rounded-lg border border-border text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Generate Certificate
            </button>
          </div>

          {/* Module Breakdown */}
          <div className="col-span-3 bg-card border border-border rounded-xl p-6">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Module Breakdown</div>
            <div className="space-y-4">
              {MODULES.map((m) => {
                const mc = m.status === "pass" ? "bg-green-500" : m.status === "flag" ? "bg-amber-500" : "bg-red-500";
                const tc = m.status === "pass" ? "text-green-400" : m.status === "flag" ? "text-amber-400" : "text-red-400";
                const bc = m.status === "pass" ? "bg-green-500/10 text-green-400 border-green-500/20" : m.status === "flag" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20";
                return (
                  <div key={m.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-foreground">{m.name}</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${bc} uppercase`}>{m.status}</span>
                      </div>
                      <span className={`font-mono text-[12px] font-medium ${tc}`}>{animated ? m.score : 0}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${mc} rounded-full`}
                        style={{ width: animated ? `${m.score}%` : "0%", transition: "width 1.2s ease-out" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        {showCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-card border border-primary/30 rounded-2xl w-full max-w-md overflow-hidden">
              <div className="bg-primary/10 border-b border-primary/20 px-6 py-5 text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">CanCompliance Verified</div>
                <div className="font-serif italic text-xl text-foreground">Compliance Certificate</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Score</span>
                    <span className={`font-semibold ${scoreColor}`}>{OVERALL_SCORE}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Certificate ID</span>
                    <span className="font-mono text-[12px] text-foreground">{CERT_ID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Issued</span>
                    <span className="text-[12px] text-foreground">{today}</span>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Active Modules</div>
                    <div className="flex flex-wrap gap-1">
                      {MODULES.filter(m => m.status === "pass").map(m => (
                        <span key={m.name} className="font-mono text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">{m.name}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    data-testid="btn-copy-cert-link"
                    onClick={handleCopy}
                    className="flex-1 py-2.5 rounded-lg border border-border text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-[12px] font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share on LinkedIn
                  </a>
                </div>

                <button
                  data-testid="btn-close-cert"
                  onClick={() => setShowCert(false)}
                  className="w-full py-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
