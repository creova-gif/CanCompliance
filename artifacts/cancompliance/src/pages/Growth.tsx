import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Copy, Share2, Award, Code, Users } from "lucide-react";

const CERT_ID = `CC-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const REFERRAL_CODE = `CAN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const BADGE_HTML = `<!-- CanCompliance Badge -->
<a href="https://cancompliance.ca/cert/${CERT_ID.toLowerCase()}" 
   target="_blank" rel="noopener noreferrer">
  <img src="https://cancompliance.ca/badge.svg" 
       alt="CanCompliance Verified" 
       width="160" height="40" />
</a>`;

export default function Growth() {
  const [copiedCert, setCopiedCert] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const certUrl = `https://cancompliance.ca/cert/${CERT_ID.toLowerCase()}`;

  const copy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout title="Growth Tools" subtitle="Certificates, badges, and referrals">
      <div className="max-w-3xl space-y-6">
        <div className="mb-7">
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Growth Loop</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Share Your Compliance</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Share your compliance certificate, embed a badge on your website, and refer other Canadian businesses. The loop: scan → fix → share → others scan.
          </p>
        </div>

        {/* Certificate */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <Award className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[13px] font-medium text-foreground">Shareable Compliance Certificate</div>
              <div className="text-[11px] text-muted-foreground font-mono">Public certificate with unique ID</div>
            </div>
          </div>
          <div className="p-5">
            <div className="bg-muted/50 border border-border rounded-xl p-6 mb-4">
              <div className="text-center mb-4">
                <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">CanCompliance Verified</div>
                <div className="font-serif italic text-xl text-foreground">Compliance Certificate</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Certificate ID</div>
                  <div className="font-mono text-foreground">{CERT_ID}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                  <div className="text-flag font-semibold">62 / 100</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Issued</div>
                  <div className="text-foreground">{new Date().toLocaleDateString("en-CA")}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Modules</div>
                  <div className="text-foreground">WSIB, Payroll, Employment</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                data-testid="btn-copy-cert"
                onClick={() => copy(certUrl, setCopiedCert)}
                className="flex-1 py-2.5 rounded-lg border border-border text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedCert ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`}
                target="_blank"
                rel="noreferrer"
                data-testid="btn-share-linkedin"
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share on LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <Code className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[13px] font-medium text-foreground">Website Compliance Badge</div>
              <div className="text-[11px] text-muted-foreground font-mono">Embed on your website — every embed is an impression</div>
            </div>
          </div>
          <div className="p-5">
            <div className="mb-4">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Badge Preview</div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
                <Award className="w-4 h-4 text-primary" />
                <span className="font-mono text-[11px] text-primary font-medium tracking-widest uppercase">CanCompliance Verified</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Embed Code</div>
            <div className="relative">
              <pre className="bg-muted rounded-lg p-4 text-[11px] text-muted-foreground overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {BADGE_HTML}
              </pre>
              <button
                data-testid="btn-copy-badge"
                onClick={() => copy(BADGE_HTML, setCopiedBadge)}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded bg-background border border-border text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3 h-3" />
                {copiedBadge ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Referral */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[13px] font-medium text-foreground">Referral Program</div>
              <div className="text-[11px] text-muted-foreground font-mono">Get 1 month free for each business you refer</div>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-muted rounded-xl p-4">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Your Referral Code</div>
                <div className="font-mono text-xl text-primary font-medium">{REFERRAL_CODE}</div>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Successful Referrals</div>
                <div className="text-3xl font-semibold text-foreground">2</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                data-testid="btn-copy-referral"
                onClick={() => copy(`https://cancompliance.ca?ref=${REFERRAL_CODE}`, setCopiedRef)}
                className="flex-1 py-2.5 rounded-lg border border-border text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedRef ? "Copied!" : "Copy Referral Link"}
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://cancompliance.ca?ref=${REFERRAL_CODE}`)}&summary=${encodeURIComponent("I use CanCompliance to keep my business compliant with Canadian law — CASL, PIPEDA, Bill 96 and more. Check it out:")}`}
                target="_blank"
                rel="noreferrer"
                data-testid="btn-share-referral-linkedin"
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
