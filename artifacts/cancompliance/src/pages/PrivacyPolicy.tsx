import { Link } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Link href="/">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          <Shield className="w-4 h-4 text-primary" style={{ color: "#c8f135" }} />
          <span className="font-serif italic text-foreground">CanCompliance</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "#c8f135" }}>Privacy Policy</div>
        <h1 className="text-3xl font-serif italic text-foreground mb-2">How We Handle Your Data</h1>
        <p className="text-sm text-muted-foreground font-mono mb-8">Effective April 8, 2026 · Governed by PIPEDA and Quebec Law 25</p>

        <div className="space-y-8 text-[14px] text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Who We Are</h2>
            <p>CanCompliance is operated by CanCompliance Inc., a Canadian corporation. We provide compliance tooling for Canadian small and medium-sized businesses. We are not a law firm and do not provide legal advice.</p>
            <p className="mt-2">Privacy Officer: <span className="text-foreground">privacy@cancompliance.ca</span></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. What Data We Collect</h2>
            <ul className="space-y-2 list-none">
              {[
                ["Account data", "Email address and name provided when you sign up via our authentication provider (Clerk Inc., US-based)."],
                ["Compliance check inputs", "Your answers to compliance module questions (e.g., \"Do you send commercial emails?\"). These are used to generate your compliance result."],
                ["AI Copilot messages", "Questions you send to the AI Copilot and the assistant's responses. These are stored in our database and transmitted to Anthropic PBC or OpenAI Inc. (US-based) depending on the model you select."],
                ["Usage events", "An immutable log of actions you take (compliance checks run, conversations created) for your own audit trail. We do not use this for advertising."],
              ].map(([title, desc]) => (
                <li key={title} className="border border-border rounded-lg p-3">
                  <div className="text-foreground font-medium text-sm mb-1">{title}</div>
                  <div>{desc}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Cross-Border Data Transfers</h2>
            <div className="bg-muted border border-border rounded-lg p-4 space-y-2">
              <div className="text-foreground font-medium text-sm">Third-party processors (PIPEDA S.7 disclosure)</div>
              <div className="space-y-1">
                {[
                  ["Clerk Inc.", "Authentication", "United States", "SOC 2 Type II"],
                  ["Anthropic PBC", "AI responses (Claude model)", "United States", "Enterprise DPA available"],
                  ["OpenAI Inc.", "AI responses (GPT model)", "United States", "Enterprise DPA available"],
                  ["Replit Inc.", "Infrastructure hosting", "United States", "SOC 2 Type II"],
                  ["Neon Inc.", "Database hosting", "United States", "SOC 2 Type II"],
                ].map(([vendor, purpose, location, cert]) => (
                  <div key={vendor} className="grid grid-cols-4 gap-2 text-xs py-1.5 border-t border-border/50">
                    <span className="text-foreground font-medium">{vendor}</span>
                    <span>{purpose}</span>
                    <span>{location}</span>
                    <span style={{ color: "#c8f135" }}>{cert}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2">By using the AI Copilot, you consent to your messages being processed by Anthropic or OpenAI in the United States depending on your selected model. Do not enter personal information about third parties in the AI Copilot.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Legal Basis (PIPEDA Principle 3 — Consent)</h2>
            <p>We collect your data only for the purposes stated above. We do not sell your data. We do not use your compliance check data for training AI models. Your AI Copilot messages may be processed by Anthropic or OpenAI subject to their respective usage policies.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Your Rights (PIPEDA + Law 25)</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li><span className="text-foreground">Access</span> — Request a copy of your stored data from your Account page.</li>
              <li><span className="text-foreground">Correction</span> — Contact us to correct inaccurate data.</li>
              <li><span className="text-foreground">Deletion</span> — Delete all your compliance data and AI conversations from your Account page at any time.</li>
              <li><span className="text-foreground">Portability</span> — Export your compliance history as JSON from your Account page.</li>
              <li><span className="text-foreground">Withdraw consent</span> — You may stop using the AI Copilot at any time to stop cross-border AI data transfers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Data Retention</h2>
            <p>We retain your compliance check history and AI conversations for as long as your account is active. You may delete all data at any time. Audit event logs are retained for 3 years as required by PIPEDA. Account data is deleted within 30 days of account closure.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Security</h2>
            <p>Data is encrypted in transit (TLS 1.3) and at rest. Access is authenticated via Clerk. Compliance check results are scoped to authenticated users only. AI conversations are user-isolated in the database.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Breach Notification</h2>
            <p>In the event of a data breach involving a real risk of significant harm, we will notify affected users and the Office of the Privacy Commissioner of Canada (OPC) within 72 hours, as required by PIPEDA S.10.1.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">9. Contact Us</h2>
            <p>To exercise your rights or file a complaint: <span className="text-foreground">privacy@cancompliance.ca</span></p>
            <p className="mt-1">If you are unsatisfied with our response, you may contact the Office of the Privacy Commissioner of Canada at <span className="text-foreground">priv.gc.ca</span>.</p>
          </section>

        </div>
      </main>
    </div>
  );
}
