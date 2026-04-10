import { useState } from "react";
import { Wand2, Code2, FileText, Shield, Mail, DollarSign, Users, Lock, HardHat, Package, Leaf, Globe, ChevronDown, ChevronUp, Copy, Check, Zap, AlertTriangle } from "lucide-react";

const VIOLATION_TYPES = [
  {
    id: "casl-consent",
    label: "CASL — No valid express consent",
    icon: Mail,
    statute: "CASL s.10",
    penalty: "Up to $10M",
    color: "#c8f135",
    fix: {
      title: "CASL Express Consent Mechanism",
      description: "Implement a compliant double-opt-in consent flow with audit trail logging.",
      tabs: [
        {
          label: "React Component",
          lang: "tsx",
          code: `// CanCompliance-generated: CASL-compliant consent component
import { useState } from "react";

interface ConsentRecord {
  email: string;
  timestamp: string;
  ipAddress: string;
  consentText: string;
  method: "express" | "implied";
}

export function CASLConsentForm({ onConsent }: { onConsent: (r: ConsentRecord) => void }) {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const CONSENT_TEXT =
    "I consent to receive commercial electronic messages from [Company Name]. " +
    "I understand I may unsubscribe at any time by clicking the unsubscribe link in any message.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checked) return;

    const record: ConsentRecord = {
      email,
      timestamp: new Date().toISOString(),
      ipAddress: await fetch("https://api.ipify.org?format=json")
        .then(r => r.json()).then(d => d.ip).catch(() => "unknown"),
      consentText: CONSENT_TEXT,
      method: "express",
    };

    // Log to your audit trail
    await fetch("/api/casl-consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    onConsent(record);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="casl-success">
      ✓ Consent recorded. Confirmation email sent to {email}.
      <small>Retained per CASL s.13(2) — 3-year record-keeping requirement</small>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="casl-consent-form">
      <input
        type="email" required value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
      />
      <label className="casl-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
          required
        />
        {/* CASL requires checkbox NOT pre-checked — CASL s.10(1)(d) */}
        <span>{CONSENT_TEXT}</span>
      </label>
      <button type="submit" disabled={!checked}>Subscribe</button>
      <small>
        [Company Name] · [Address] · [Phone]
        {/* Required sender identification per CASL s.6(2)(b) */}
      </small>
    </form>
  );
}`,
        },
        {
          label: "Unsubscribe Handler",
          lang: "typescript",
          code: `// CASL s.11 — Unsubscribe mechanism (must process within 10 business days)
import express from "express";

const router = express.Router();

router.post("/api/casl-unsubscribe", async (req, res) => {
  const { email, token } = req.body;

  // 1. Verify token to prevent abuse
  const isValid = await verifyUnsubscribeToken(token, email);
  if (!isValid) return res.status(400).json({ error: "Invalid token" });

  // 2. Update suppression list immediately
  await db.consentRecords.update({
    where: { email },
    data: {
      status: "unsubscribed",
      unsubscribedAt: new Date(),
      // CASL s.11(3) — retain record of withdrawal
    },
  });

  // 3. Add to suppression list — do NOT re-add without new express consent
  await db.suppressionList.upsert({
    where: { email },
    create: { email, suppressedAt: new Date(), reason: "user_request" },
    update: { suppressedAt: new Date() },
  });

  // 4. Confirm to user (within 10 business days per CASL s.11(2))
  res.json({ success: true, message: "Unsubscribed. You will not receive further messages." });
});

// Helper: Check suppression before every send
export async function isEmailSuppressed(email: string): Promise<boolean> {
  const record = await db.suppressionList.findUnique({ where: { email } });
  return !!record;
}`,
        },
        {
          label: "Policy Template",
          lang: "markdown",
          code: `# CASL Compliance Policy — [Company Name]
**Effective Date:** [Date] | **Reviewed:** Annually | **Owner:** Privacy Officer

## 1. Scope
This policy applies to all Commercial Electronic Messages (CEMs) sent by [Company Name]
to recipients with Canadian electronic addresses.

## 2. Consent Requirements (CASL s.10)
- **Express consent** required before sending promotional CEMs
- Checkbox must NOT be pre-ticked
- Consent request must clearly identify the organization
- Retain consent records for minimum 3 years (CASL s.13(2))

## 3. Sender Identification (CASL s.6)
Every CEM must include:
- [ ] Legal name of sender
- [ ] Mailing address + one of: phone, email, or web address
- [ ] Unsubscribe mechanism

## 4. Unsubscribe (CASL s.11)
- Mechanism must be free, simple, and quick
- Process requests within **10 business days**
- Maintain suppression list indefinitely

## 5. Record-Keeping
| Record Type | Retention |
|---|---|
| Express consent records | 3 years minimum |
| Withdrawal records | Indefinitely |
| CEM send logs | 3 years |`,
        },
      ],
    },
  },
  {
    id: "pipeda-breach",
    label: "PIPEDA — No breach notification plan",
    icon: Lock,
    statute: "PIPEDA s.10.1",
    penalty: "Up to $100K",
    color: "#7F77DD",
    fix: {
      title: "PIPEDA Breach Response Playbook",
      description: "Implement a 72-hour breach notification workflow with OPC reporting.",
      tabs: [
        {
          label: "Breach Response Handler",
          lang: "typescript",
          code: `// PIPEDA Breach Notification System — s.10.1 compliant
// Real risk of significant harm (RROSH) assessment + OPC reporting

interface BreachEvent {
  id: string;
  discoveredAt: Date;
  description: string;
  affectedRecords: number;
  dataTypes: string[];
  containmentStatus: "open" | "contained";
}

export class BreachNotificationService {
  // Step 1: Assess Real Risk of Significant Harm
  assessRROSH(breach: BreachEvent): { isRROSH: boolean; factors: string[] } {
    const factors: string[] = [];
    const sensitiveTypes = ["SIN", "financial", "health", "biometric", "location"];

    if (breach.dataTypes.some(t => sensitiveTypes.includes(t))) {
      factors.push("Sensitive personal information involved");
    }
    if (breach.affectedRecords > 1000) {
      factors.push("Large number of individuals affected");
    }

    return {
      isRROSH: factors.length > 0,
      factors,
    };
  }

  // Step 2: Report to OPC within 72 hours if RROSH
  async reportToOPC(breach: BreachEvent): Promise<void> {
    // OPC breach reporting portal: https://www.priv.gc.ca/en/report-a-concern/
    const report = {
      organizationName: process.env.ORG_NAME,
      breachDate: breach.discoveredAt.toISOString(),
      description: breach.description,
      affectedCount: breach.affectedRecords,
      dataTypes: breach.dataTypes,
      containmentMeasures: breach.containmentStatus,
    };

    await fetch("https://opc-reporting-endpoint/breach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
  }

  // Step 3: Notify affected individuals (no timeline specified but "as soon as feasible")
  async notifyIndividuals(emails: string[], breach: BreachEvent): Promise<void> {
    for (const email of emails) {
      await sendEmail({
        to: email,
        subject: "Important Security Notice from [Company Name]",
        body: this.buildNotificationEmail(breach),
      });
    }
  }

  private buildNotificationEmail(breach: BreachEvent): string {
    return \`
Dear Customer,

We are writing to inform you of a security incident at [Company Name].

What happened: \${breach.description}
When: \${breach.discoveredAt.toLocaleDateString("en-CA")}
What information: \${breach.dataTypes.join(", ")}

What we are doing: We have [containment measures taken].

What you can do: [Specific recommended actions].

For questions, contact our Privacy Officer at privacy@[company].ca

[Company Name] Privacy Officer
\`;
  }
}`,
        },
        {
          label: "Breach Log Schema",
          lang: "sql",
          code: `-- PIPEDA Breach Record-Keeping (s.10.3 — maintain records)
CREATE TABLE breach_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discovered_at TIMESTAMPTZ NOT NULL,
  reported_to_opc_at TIMESTAMPTZ,
  opc_file_number VARCHAR(50),
  description TEXT NOT NULL,
  affected_records_count INTEGER,
  data_types TEXT[], -- e.g. ARRAY['email', 'SIN', 'financial']
  is_rrosh BOOLEAN NOT NULL DEFAULT false,
  rrosh_factors JSONB,
  containment_status VARCHAR(20) DEFAULT 'open',
  containment_measures TEXT,
  individuals_notified_at TIMESTAMPTZ,
  individuals_notified_count INTEGER,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Retain for 2 years per PIPEDA guidelines
  retain_until TIMESTAMPTZ GENERATED ALWAYS AS (discovered_at + INTERVAL '2 years') STORED
);

CREATE INDEX idx_breach_discovered ON breach_records(discovered_at DESC);
CREATE INDEX idx_breach_rrosh ON breach_records(is_rrosh) WHERE is_rrosh = true;`,
        },
      ],
    },
  },
  {
    id: "fintrac-aml",
    label: "FINTRAC — Missing AML compliance program",
    icon: Shield,
    statute: "PCMLTFA s.9.6",
    penalty: "Up to $500K + criminal",
    color: "#f5a623",
    fix: {
      title: "FINTRAC AML Program Template",
      description: "Generate a PCMLTFA-compliant AML/KYC program with transaction monitoring.",
      tabs: [
        {
          label: "KYC Verification",
          lang: "typescript",
          code: `// FINTRAC KYC Identity Verification — PCMLTFA s.9.1 compliant
import { z } from "zod";

const KYCSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  address: z.object({
    street: z.string(),
    city: z.string(),
    province: z.string().length(2),
    postalCode: z.string().regex(/^[A-Z]\d[A-Z] \d[A-Z]\d$/),
  }),
  idType: z.enum(["passport", "drivers_license", "national_id"]),
  idNumber: z.string().min(5),
  idExpiry: z.string(),
  idJurisdiction: z.string(),
});

export class FINTRACKYCService {
  // PCMLTFA s.9.1: Verify identity for transactions >= CAD $10,000
  async verifyIdentity(customerId: string, data: unknown) {
    const parsed = KYCSchema.parse(data);

    // Record verification per FINTRAC record-keeping requirements
    const record = await db.kycRecords.create({
      data: {
        customerId,
        verifiedAt: new Date(),
        idType: parsed.idType,
        idNumber: this.hashSensitiveData(parsed.idNumber),
        idExpiry: parsed.idExpiry,
        idJurisdiction: parsed.idJurisdiction,
        // Retain for 5 years per PCMLTFA s.6
        retainUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
      },
    });

    return record;
  }

  // PCMLTFA: Screen against OSFI Consolidated Sanctions List
  async screenSanctions(name: string, dob: string): Promise<boolean> {
    const response = await fetch(
      \`https://www.osfi-bsif.gc.ca/api/sanctions/search?name=\${encodeURIComponent(name)}\`
    );
    const result = await response.json();
    return result.matches.length === 0;
  }

  private hashSensitiveData(data: string): string {
    // Use bcrypt or SHA-256 — never store raw ID numbers
    return require("crypto").createHash("sha256").update(data).digest("hex");
  }
}`,
        },
        {
          label: "STR Filing",
          lang: "typescript",
          code: `// FINTRAC Suspicious Transaction Report (STR) — PCMLTFA s.7
// Must file within 30 days of detection (3 days for terrorist financing)

interface SuspiciousTransaction {
  reportingEntityId: string;
  transactionDate: Date;
  transactionAmount: number;
  currency: string;
  suspicionGrounds: string;
  subjectInfo: { name: string; dob?: string; address?: string };
}

export async function fileSTR(tx: SuspiciousTransaction): Promise<string> {
  // FINTRAC F2R Portal: https://f2r.fintrac-canafe.gc.ca
  const payload = {
    reportType: "STR",
    reportingEntity: { id: tx.reportingEntityId },
    transaction: {
      date: tx.transactionDate.toISOString(),
      amount: tx.transactionAmount,
      currency: tx.currency,
      groundsForSuspicion: tx.suspicionGrounds,
    },
    subject: tx.subjectInfo,
    submittedAt: new Date().toISOString(),
  };

  // IMPORTANT: Do NOT tip off the subject (PCMLTFA s.8)
  const response = await fetch("https://api.fintrac-canafe.gc.ca/reports/str", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.FINTRAC_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  return result.confirmationNumber; // Retain this for 5 years
}`,
        },
      ],
    },
  },
  {
    id: "employment-overtime",
    label: "Employment Standards — Overtime violations",
    icon: Users,
    statute: "Ontario ESA s.17",
    penalty: "Up to $100K + wages",
    color: "#12b76a",
    fix: {
      title: "ESA Hours of Work Tracker",
      description: "Build overtime calculation and threshold alerts compliant with Ontario ESA.",
      tabs: [
        {
          label: "Overtime Calculator",
          lang: "typescript",
          code: `// Ontario ESA s.17 — Hours of Work & Overtime Pay Calculator
// Regular: 8hrs/day, 44hrs/week threshold for overtime

interface WorkRecord {
  employeeId: string;
  date: string;
  hoursWorked: number;
  overtimeAgreement?: boolean; // ESA s.17(2): written agreement required
}

export class OntarioOvertimeCalculator {
  // ESA s.22: Overtime pay = 1.5x regular rate after 44 hours/week
  calculateWeeklyPay(records: WorkRecord[], hourlyRate: number) {
    const totalHours = records.reduce((sum, r) => sum + r.hoursWorked, 0);
    const regularHours = Math.min(totalHours, 44);
    const overtimeHours = Math.max(0, totalHours - 44);

    return {
      totalHours,
      regularHours,
      overtimeHours,
      regularPay: regularHours * hourlyRate,
      overtimePay: overtimeHours * hourlyRate * 1.5,
      totalPay: (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5),
      // ESA s.17(1)(b): Maximum 48 hours without written agreement
      exceedsLimit: totalHours > 48 && !records.some(r => r.overtimeAgreement),
    };
  }

  // ESA s.21.1: Ensure minimum 11-hour rest between shifts
  checkRestPeriods(shifts: Array<{ start: Date; end: Date }>): string[] {
    const violations: string[] = [];
    for (let i = 1; i < shifts.length; i++) {
      const gapMs = shifts[i].start.getTime() - shifts[i - 1].end.getTime();
      const gapHours = gapMs / (1000 * 60 * 60);
      if (gapHours < 11) {
        violations.push(
          \`Shift on \${shifts[i].start.toDateString()}: only \${gapHours.toFixed(1)}h rest (minimum 11h required)\`
        );
      }
    }
    return violations;
  }
}`,
        },
      ],
    },
  },
  {
    id: "wcag-aoda",
    label: "AODA — WCAG 2.0 AA non-compliance",
    icon: Globe,
    statute: "AODA s.14(4)",
    penalty: "Up to $100K/day",
    color: "#c8f135",
    fix: {
      title: "WCAG 2.0 AA Accessibility Fixes",
      description: "Common accessibility fixes for AODA WCAG 2.0 Level AA compliance.",
      tabs: [
        {
          label: "Accessibility Audit Script",
          lang: "typescript",
          code: `// WCAG 2.0 AA Automated Audit — AODA IASR s.14(4)
// Run this in CI/CD to catch accessibility regressions

import { chromium } from "playwright";
import { injectAxe, checkA11y } from "axe-playwright";

async function runWCAGAudit(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await injectAxe(page);

  // Check against WCAG 2.0 AA ruleset (AODA requirement)
  const results = await checkA11y(page, undefined, {
    axeOptions: {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    },
    detailedReport: true,
    detailedReportOptions: { html: true },
  });

  await browser.close();
  return results;
}

// Key WCAG 2.0 AA requirements for AODA:
// 1.1.1 Non-text Content (Level A) — all images need alt text
// 1.4.3 Contrast (Level AA) — 4.5:1 ratio for normal text
// 2.1.1 Keyboard (Level A) — all interactive elements keyboard accessible
// 2.4.1 Bypass Blocks (Level A) — skip navigation
// 3.1.1 Language of Page (Level A) — lang attribute on <html>
// 4.1.2 Name, Role, Value (Level A) — ARIA labels on custom controls`,
        },
        {
          label: "Common Fixes",
          lang: "html",
          code: `<!-- WCAG 2.0 AA fixes for AODA compliance -->

<!-- 1. Skip Navigation (WCAG 2.4.1) -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<!-- 2. Image alt text (WCAG 1.1.1) -->
<!-- BAD: --> <img src="logo.png" />
<!-- GOOD: --> <img src="logo.png" alt="CanCompliance — Canadian Compliance Platform" />
<!-- Decorative: --> <img src="decoration.png" alt="" role="presentation" />

<!-- 3. Form labels (WCAG 1.3.1) -->
<!-- BAD: --> <input type="email" placeholder="Email" />
<!-- GOOD: -->
<label for="email">Email address <span aria-hidden="true">*</span></label>
<input id="email" type="email" aria-required="true" autocomplete="email" />

<!-- 4. Color contrast (WCAG 1.4.3) — 4.5:1 for normal text -->
<style>
  /* Compliant: #09090a on #c8f135 = 12.1:1 ratio ✓ */
  .btn-primary { background: #c8f135; color: #09090a; }

  /* Non-compliant: gray on white < 4.5:1 */
  /* .muted { color: #999; background: #fff; } ✗ */
</style>

<!-- 5. ARIA landmarks (WCAG 4.1.2) -->
<header role="banner">...</header>
<nav role="navigation" aria-label="Main navigation">...</nav>
<main id="main-content" role="main">...</main>
<footer role="contentinfo">...</footer>

<!-- 6. Focus indicators (WCAG 2.4.7) -->
<style>
  :focus-visible {
    outline: 2px solid #c8f135;
    outline-offset: 2px;
  }
</style>`,
        },
      ],
    },
  },
  {
    id: "esg-greenwashing",
    label: "ESG — Unsubstantiated environmental claims",
    icon: Leaf,
    statute: "Competition Act s.74.01",
    penalty: "Up to $10M",
    color: "#12b76a",
    fix: {
      title: "ESG Claim Substantiation Framework",
      description: "Policy and workflow to substantiate environmental claims under Canada's Competition Act.",
      tabs: [
        {
          label: "Claim Review Checklist",
          lang: "markdown",
          code: `# ESG Claim Substantiation Checklist
## Competition Act s.74.01 — Environmental Claims

### Before Publishing Any Environmental Claim:

**Step 1: Identify claim type**
- [ ] Absolute claim ("carbon neutral", "zero waste") — requires ISO 14064 certification
- [ ] Comparative claim ("X% less emissions than [product]") — requires baseline methodology
- [ ] Process claim ("made from recycled materials") — requires supply chain verification
- [ ] Certification claim ("certified by [org]") — requires valid certification

**Step 2: Gather substantiation**
- [ ] Third-party audit/verification report (ISO 14064, GRI, SASB)
- [ ] LCA (Life Cycle Assessment) for product-level claims
- [ ] GHG inventory for emissions claims (Scopes 1, 2, 3 if material)
- [ ] Methodology documentation for calculations

**Step 3: Claim review**
- [ ] Legal review of exact claim wording
- [ ] Ensure claim is not misleading (even if technically true)
- [ ] Disclose material limitations/caveats
- [ ] Match claims exactly to certification scope

**Step 4: Documentation**
- [ ] File substantiation evidence (retain 3+ years)
- [ ] Log claim approval with reviewer name + date
- [ ] Set review date (no more than 12 months)

### Common Violations (CRTC/Competition Bureau enforcement):
| Claim | Issue | Fix |
|---|---|---|
| "100% eco-friendly" | Vague, unsubstantiated | Replace with specific metric |
| "Carbon neutral" | Requires offsets + certification | Get ISO 14064-1 verification |
| "Green packaging" | No standard definition | Specify: "30% recycled content (post-consumer)" |`,
        },
      ],
    },
  },
  {
    id: "gst-registration",
    label: "GST/HST — Unregistered past $30K threshold",
    icon: DollarSign,
    statute: "Excise Tax Act s.240",
    penalty: "Arrears + 5% + interest",
    color: "#f04438",
    fix: {
      title: "GST/HST Registration & Filing Setup",
      description: "CRA-compliant GST/HST collection and remittance implementation.",
      tabs: [
        {
          label: "Registration Steps",
          lang: "markdown",
          code: `# GST/HST Registration & Compliance — CRA

## Immediate Actions (you've exceeded $30,000 in 4 calendar quarters)

### 1. Register for GST/HST (within 29 days of crossing threshold)
- Online: business.cra-arc.gc.ca → My Business Account
- By phone: 1-800-959-5525
- You will receive a Business Number (BN) + GST/HST account number (RT0001)

### 2. Determine your filing period
| Annual taxable revenue | Filing frequency |
|---|---|
| $1.5M or less | Annual (or quarterly/monthly by choice) |
| $1.5M – $6M | Quarterly |
| Over $6M | Monthly |

### 3. GST/HST rates by province
| Province | Rate |
|---|---|
| Ontario | 13% HST |
| British Columbia | 5% GST |
| Quebec | 5% GST + 9.975% QST |
| Alberta | 5% GST |
| Nova Scotia | 15% HST |
| New Brunswick | 15% HST |

## Back-filing for missed periods
If you were required to register but didn't:
1. Register immediately
2. Calculate GST/HST you should have collected
3. File voluntary disclosure via CRA My Business Account
4. Voluntary disclosure may reduce penalties (IC00-1R6)`,
        },
        {
          label: "Collection Middleware",
          lang: "typescript",
          code: `// GST/HST Tax Collection Middleware
// Applies correct rate based on customer province (place of supply rules)

const GST_HST_RATES: Record<string, { rate: number; type: "GST" | "HST"; gst: number; pst?: number }> = {
  AB: { rate: 0.05, type: "GST", gst: 0.05 },
  BC: { rate: 0.05, type: "GST", gst: 0.05 }, // + 7% PST (separate)
  MB: { rate: 0.05, type: "GST", gst: 0.05 }, // + 7% RST (separate)
  NB: { rate: 0.15, type: "HST", gst: 0.05 },
  NL: { rate: 0.15, type: "HST", gst: 0.05 },
  NS: { rate: 0.15, type: "HST", gst: 0.05 },
  NT: { rate: 0.05, type: "GST", gst: 0.05 },
  NU: { rate: 0.05, type: "GST", gst: 0.05 },
  ON: { rate: 0.13, type: "HST", gst: 0.05 },
  PE: { rate: 0.15, type: "HST", gst: 0.05 },
  QC: { rate: 0.05, type: "GST", gst: 0.05 }, // + 9.975% QST (separate)
  SK: { rate: 0.05, type: "GST", gst: 0.05 }, // + 6% PST (separate)
  YT: { rate: 0.05, type: "GST", gst: 0.05 },
};

export function calculateGSTHST(subtotal: number, province: string) {
  const tax = GST_HST_RATES[province.toUpperCase()] ?? GST_HST_RATES.ON;
  const taxAmount = subtotal * tax.rate;
  return {
    subtotal,
    taxType: tax.type,
    taxRate: tax.rate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round((subtotal + taxAmount) * 100) / 100,
  };
}`,
        },
      ],
    },
  },
  {
    id: "safety-inspection",
    label: "OHS — No written safety program",
    icon: HardHat,
    statute: "Canada Labour Code s.125",
    penalty: "Up to $1M/violation",
    color: "#f5a623",
    fix: {
      title: "OHS Safety Program Template",
      description: "Canada Labour Code s.125 compliant written safety program.",
      tabs: [
        {
          label: "Safety Program Template",
          lang: "markdown",
          code: `# Workplace Health & Safety Program
## [Company Name] — Canada Labour Code s.125 Compliant

**Version:** 1.0 | **Approved by:** [Name, Title] | **Date:** [Date]
**Review cycle:** Annual

---

## 1. Policy Statement
[Company Name] is committed to providing a safe and healthy workplace for all employees,
contractors, and visitors. This is a legal obligation under the Canada Labour Code
Part II (federally regulated) / Ontario OHSA (provincially regulated).

## 2. Roles & Responsibilities

### Employer Duties (CLC s.125):
- [ ] Provide safe equipment and a safe workplace
- [ ] Investigate and document all accidents
- [ ] Establish a Joint Health & Safety Committee (20+ employees)
- [ ] Train all employees on hazard identification

### JHSC Requirements (20+ employees):
- [ ] At least 2 members (1 worker-selected, 1 employer-selected)
- [ ] Meet at least monthly
- [ ] Conduct workplace inspections monthly
- [ ] Review all incident reports

## 3. Hazard Identification & Risk Assessment
**Process (required per CLC s.125(z.01)):**
1. Walk-through inspection by JHSC monthly
2. Document all identified hazards
3. Assess likelihood × severity = risk score
4. Implement controls (eliminate → substitute → engineer → admin → PPE)

## 4. Incident Reporting (CLC s.125(c))
| Incident Type | Report to | Timeline |
|---|---|---|
| Fatality | Labour Canada + coroner | Immediately |
| Serious injury | Labour Canada | Immediately |
| All incidents | JHSC + Manager | Same day |
| Near misses | Safety officer | Same day |

## 5. Emergency Procedures
- [ ] Emergency contact list posted at all exits
- [ ] First aid kit locations identified
- [ ] Trained first aiders designated (ratio per CLC Reg.)
- [ ] Fire evacuation plan + drill (annually)`,
        },
      ],
    },
  },
];

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(code); } catch (_) { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg3)", borderRadius: "8px 8px 0 0", padding: "6px 14px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>{lang}</span>
        <button onClick={copy} data-action="copy-fix" data-copied={copied ? "true" : "false"} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "var(--green)" : "var(--text3)", display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: "var(--mono)" }}>
          {copied ? "Copied!" : "Copy Fix"}
        </button>
      </div>
      <pre style={{ background: "var(--bg3)", borderRadius: "0 0 8px 8px", padding: "14px", overflowX: "auto", fontSize: 11, lineHeight: 1.6, margin: 0, color: "var(--text2)", fontFamily: "var(--mono)" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function AiRemediation() {
  const [selected, setSelected] = useState<typeof VIOLATION_TYPES[0] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedViolation, setExpandedViolation] = useState<string | null>(null);

  const generate = () => {
    if (!selected) return;
    setGenerating(true);
    setGenerated(false);
    setActiveTab(0);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1400);
  };

  return (
    <div className="page-content">
      <div style={{ background: "rgba(127,119,221,0.08)", border: "1px solid rgba(127,119,221,0.25)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Wand2 className="w-3.5 h-3.5" style={{ color: "#7F77DD" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#7F77DD", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>AI Remediation Engine · Code Fix Generator</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Select a compliance violation below. The engine generates audit-ready code snippets, policy templates, and SQL schemas — tailored to Canadian regulatory requirements.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Select violation type</div>
          <div className="space-y-1.5">
            {VIOLATION_TYPES.map(v => {
              const Icon = v.icon;
              const isSelected = selected?.id === v.id;
              return (
                <button key={v.id} onClick={() => { setSelected(v); setGenerated(false); setGenerating(false); }}
                  data-violation={v.id} data-selected={isSelected ? "true" : "false"}
                  style={{ width: "100%", textAlign: "left", background: isSelected ? `rgba(200,241,53,0.06)` : "var(--bg2)", border: `1px solid ${isSelected ? "#c8f135" : "var(--border)"}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isSelected ? "#c8f135" : "var(--text3)" }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text1)", lineHeight: 1.3 }}>{v.label}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)" }}>{v.statute}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--red)" }}>{v.penalty}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {!selected && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "var(--text3)", minHeight: 300 }}>
              <Wand2 className="w-8 h-8" style={{ opacity: 0.3 }} />
              <div style={{ fontSize: 12, textAlign: "center" }}>Select a violation type to generate<br />AI-powered code fixes and policy templates</div>
            </div>
          )}

          {selected && !generated && !generating && (
            <div>
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${selected.color}15`, flexShrink: 0 }}>
                    {(() => { const Icon = selected.icon; return <Icon className="w-4 h-4" style={{ color: selected.color }} />; })()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 4 }}>{selected.fix.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{selected.fix.description}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "rgba(240,68,56,0.1)", color: "var(--red)", border: "1px solid rgba(240,68,56,0.2)" }}>
                    ⚠ {selected.penalty}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "var(--bg3)", color: "var(--text3)", border: "1px solid var(--border)" }}>
                    {selected.statute}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "rgba(127,119,221,0.1)", color: "#7F77DD", border: "1px solid rgba(127,119,221,0.2)" }}>
                    {selected.fix.tabs.length} output{selected.fix.tabs.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button onClick={generate}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, background: "#c8f135", color: "#09090a" }}>
                  <Wand2 className="w-4 h-4" />
                  Generate AI Fix &amp; Templates
                </button>
              </div>
              <div style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--text2)" }}>
                  <AlertTriangle className="w-3 h-3" style={{ color: "var(--amber)", flexShrink: 0 }} />
                  Generated code is a starting point. Review with legal counsel before deploying in production.
                </div>
              </div>
            </div>
          )}

          {generating && (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap className="w-5 h-5" style={{ color: "#c8f135" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 6 }}>Generating remediation code…</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>Analyzing {selected!.statute} · Generating compliant templates</div>
              </div>
              <div style={{ width: 200, height: 3, borderRadius: 2, background: "var(--bg3)", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#c8f135", width: "70%", borderRadius: 2, animation: "pulse 1s ease-in-out infinite" }} />
              </div>
            </div>
          )}

          {generated && selected && (
            <div>
              <div style={{ background: "rgba(18,183,106,0.06)", border: "1px solid rgba(18,183,106,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Code2 className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
                <span style={{ fontSize: 11, color: "var(--text1)", fontWeight: 600 }}>{selected.fix.title}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginLeft: "auto" }}>{selected.fix.tabs.length} outputs generated</span>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {selected.fix.tabs.map((tab, i) => (
                  <button key={i} onClick={() => setActiveTab(i)}
                    style={{ padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "1px solid", fontFamily: "var(--mono)",
                      background: activeTab === i ? "#c8f135" : "transparent",
                      borderColor: activeTab === i ? "#c8f135" : "var(--border)",
                      color: activeTab === i ? "#09090a" : "var(--text2)" }}>
                    <FileText className="w-3 h-3 inline-block mr-1.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {selected.fix.tabs[activeTab] && (
                <CodeBlock
                  code={selected.fix.tabs[activeTab].code}
                  lang={selected.fix.tabs[activeTab].lang}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
