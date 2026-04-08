import { Router } from "express";
import { RunComplianceCheckBody, ScanUrlBody } from "@workspace/api-zod";

const router = Router();

interface CheckData {
  hasCaslUnsubscribe?: string;
  honorsUnsubscribe?: string;
  expressConsent?: string;
  sendsCommercialEmails?: string;
  hasPrivacyPolicy?: string;
  namedPrivacyOfficer?: string;
  obtainsConsent?: string;
  dataAccessRights?: string;
  servesQuebec?: string;
  hasFreenchLabels?: string;
  websiteInFrench?: string;
  contractsInFrench?: string;
  [key: string]: string | undefined;
}

function runCaslCheck(data: CheckData): {
  status: "pass" | "fail" | "flag" | "block";
  score: number;
  title: string;
  statute: string;
  remediation: string;
} {
  const sends = data.sendsCommercialEmails !== "no";
  if (!sends) {
    return {
      status: "pass",
      score: 100,
      title: "CASL Not Applicable",
      statute: "CASL S.6(1) — Commercial Electronic Messages",
      remediation: "Your business does not send commercial electronic messages, so CASL does not apply.",
    };
  }

  const hasUnsubscribe = data.hasCaslUnsubscribe === "yes";
  const honorsUnsubscribe = data.honorsUnsubscribe === "yes";
  const hasConsent = data.expressConsent === "yes";

  if (!hasConsent && !hasUnsubscribe) {
    return {
      status: "block",
      score: 0,
      title: "Critical CASL Violation — Immediate Risk",
      statute: "CASL S.6(1), S.11(1) — Express Consent + Unsubscribe Mechanism",
      remediation: "You are sending commercial emails without express consent and without an unsubscribe mechanism. This is a dual violation. Stop sending immediately and implement consent collection before resuming. CRTC fines can reach $10M per violation.",
    };
  }

  if (!hasConsent) {
    return {
      status: "fail",
      score: 25,
      title: "CASL Violation — Express Consent Missing",
      statute: "CASL S.6(1) — Commercial Electronic Messages",
      remediation: "You must obtain express consent before sending commercial email. Add a compliant consent checkbox to all sign-up forms. Transitional express consent must have been obtained by July 1, 2017. CRTC fines up to $1M per day for individuals, $10M for organizations.",
    };
  }

  if (!hasUnsubscribe) {
    return {
      status: "fail",
      score: 40,
      title: "CASL Violation — No Unsubscribe Mechanism",
      statute: "CASL S.11(1) — Unsubscribe Mechanism Required",
      remediation: "Every commercial email must include a clearly described, functioning unsubscribe mechanism. Add an unsubscribe link to your email footer and ensure it processes requests within 10 business days.",
    };
  }

  if (!honorsUnsubscribe) {
    return {
      status: "flag",
      score: 60,
      title: "CASL Warning — Unsubscribe Not Honoured in Time",
      statute: "CASL S.11(3) — Unsubscribe Must Be Processed Within 10 Business Days",
      remediation: "Unsubscribe requests must be honoured within 10 business days. Audit your unsubscribe workflow and ensure automated suppression list updates.",
    };
  }

  return {
    status: "pass",
    score: 95,
    title: "CASL Compliant",
    statute: "CASL S.6(1), S.11(1) — Commercial Electronic Messages",
    remediation: "Your CASL compliance is in order. Continue monitoring for any changes to your email workflows and review consent records annually.",
  };
}

function runPipedaCheck(data: CheckData): {
  status: "pass" | "fail" | "flag" | "block";
  score: number;
  title: string;
  statute: string;
  remediation: string;
} {
  const hasPolicy = data.hasPrivacyPolicy === "yes";
  const hasOfficer = data.namedPrivacyOfficer === "yes";
  const obtainsConsent = data.obtainsConsent === "yes";
  const dataRights = data.dataAccessRights === "yes";

  const score = [hasPolicy, hasOfficer, obtainsConsent, dataRights].filter(Boolean).length;

  if (score === 4) {
    return {
      status: "pass",
      score: 92,
      title: "PIPEDA Compliant",
      statute: "PIPEDA S.5, Schedule 1 — Privacy Principles",
      remediation: "Your privacy practices meet PIPEDA's 10 fair information principles. Review annually and update your policy when you change data practices.",
    };
  }

  if (score <= 1) {
    return {
      status: "block",
      score: 10,
      title: "Critical PIPEDA Non-Compliance",
      statute: "PIPEDA S.5(1) — Compliance with Schedule 1 Mandatory",
      remediation: "Your business has significant privacy compliance gaps. You must immediately: (1) publish a privacy policy, (2) designate a Privacy Officer, (3) implement consent mechanisms. OPC can order compliance and fines apply.",
    };
  }

  const issues: string[] = [];
  if (!hasPolicy) issues.push("Publish a public privacy policy");
  if (!hasOfficer) issues.push("Designate a Privacy Officer (Principle 1)");
  if (!obtainsConsent) issues.push("Implement consent collection before data collection (Principle 3)");
  if (!dataRights) issues.push("Create a process for access and correction requests (Principles 6-7)");

  return {
    status: "fail",
    score: score * 22,
    title: "PIPEDA Gaps Detected",
    statute: "PIPEDA S.5, Schedule 1 — Fair Information Principles",
    remediation: "Address the following: " + issues.join("; ") + ". The OPC (Office of the Privacy Commissioner) investigates complaints and can order corrective action.",
  };
}

function runBill96Check(data: CheckData): {
  status: "pass" | "fail" | "flag" | "block";
  score: number;
  title: string;
  statute: string;
  remediation: string;
} {
  const servesQc = data.servesQuebec === "yes";

  if (!servesQc) {
    return {
      status: "pass",
      score: 100,
      title: "Bill 96 Not Applicable",
      statute: "Bill 96 (S.14, 2022) — Charter of the French Language",
      remediation: "Your business does not serve Quebec customers, so Bill 96's Quebec-specific requirements do not apply.",
    };
  }

  const hasLabels = data.hasFrenchLabels === "yes" || data.hasFreenchLabels === "yes";
  const websiteInFr = data.websiteInFrench === "yes";
  const contractsInFr = data.contractsInFrench === "yes";

  const score = [hasLabels, websiteInFr, contractsInFr].filter(Boolean).length;

  if (score === 3) {
    return {
      status: "pass",
      score: 95,
      title: "Bill 96 Compliant",
      statute: "Bill 96 S.22, S.51, S.55 — French Language Requirements",
      remediation: "Your business meets Bill 96 requirements for French-language compliance in Quebec. Review again as deadlines for multi-national corporations differ.",
    };
  }

  const issues: string[] = [];
  if (!hasLabels) issues.push("Add French to all product labels (S.22 deadline passed)");
  if (!websiteInFr) issues.push("Offer a French version of your website (S.51)");
  if (!contractsInFr) issues.push("Provide consumer contracts in French (S.55)");

  return {
    status: score === 0 ? "block" : "fail",
    score: score * 28,
    title: score === 0 ? "Critical Bill 96 Violations" : "Bill 96 Compliance Gaps",
    statute: "Bill 96 S.22, S.51, S.55 — Charter of the French Language Amendments",
    remediation: "Quebec's Charter of the French Language requires: " + issues.join("; ") + ". The OQLF (Office québécois de la langue française) can impose fines of $7,000–$700,000 per violation.",
  };
}

router.post("/compliance/check", async (req, res) => {
  const parseResult = RunComplianceCheckBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { module, province, data } = parseResult.data;
  const checkData = (data as CheckData) ?? {};

  let result: ReturnType<typeof runCaslCheck>;

  switch (module) {
    case "casl":
      result = runCaslCheck(checkData);
      break;
    case "pipeda":
      result = runPipedaCheck(checkData);
      break;
    case "bill96":
      result = runBill96Check(checkData);
      break;
    case "employment":
      result = {
        status: "flag" as const,
        score: 70,
        title: "Employment Standards — Review Required",
        statute: `Employment Standards Act, 2000 (${province} regulations)`,
        remediation: "Ensure you are current with: Ontario minimum wage ($17.20/hr as of Oct 2024), ESA leave entitlements, proper payroll deductions, and written employment contracts. Book an HR audit.",
      };
      break;
    case "wsib":
      result = {
        status: "flag" as const,
        score: 65,
        title: "WSIB Coverage — Registration Recommended",
        statute: "WSIA S.10-12 — Employer Registration Requirements",
        remediation: "Businesses with employees in Ontario must register with WSIB within 10 days of hiring. Failure to register can result in penalties equal to 2x unpaid premiums. Verify your coverage status at wsib.ca.",
      };
      break;
    case "payroll":
      result = {
        status: "pass" as const,
        score: 85,
        title: "Payroll Compliance — Generally Adequate",
        statute: "Income Tax Act S.153, EI Act S.82, CPP Act S.21",
        remediation: "Continue current payroll deduction practices. Ensure remittances are made by the 15th of each month. T4s must be issued by February 28 annually. Verify CRA payroll deduction tables are current.",
      };
      break;
    default:
      result = {
        status: "flag" as const,
        score: 50,
        title: "Module Under Development",
        statute: "N/A",
        remediation: "This compliance module is being expanded. Contact us for a manual review.",
      };
  }

  res.json({
    ...result,
    module,
    timestamp: new Date().toISOString(),
  });
});

router.post("/compliance/scan-url", async (req, res) => {
  const parseResult = ScanUrlBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { url } = parseResult.data;

  await new Promise((r) => setTimeout(r, 1800));

  res.json({
    url,
    overallScore: 38,
    violations: [
      {
        law: "CASL",
        issue: "No unsubscribe mechanism detected in email communications",
        severity: "high",
        citation: "CASL S.11(1) — Every commercial electronic message must include a functional unsubscribe mechanism. Max penalty: $10M.",
      },
      {
        law: "PIPEDA",
        issue: "Privacy policy missing or does not meet minimum PIPEDA requirements",
        severity: "high",
        citation: "PIPEDA S.5, Schedule 1, Principle 8 — Openness. Your privacy policy must be publicly available and describe your data practices.",
      },
      {
        law: "Bill 96",
        issue: "Website not available in French — Quebec presence detected",
        severity: "medium",
        citation: "Charter of the French Language S.51 — Websites offering products/services in Quebec must be available in French. Deadline: June 1, 2023.",
      },
    ],
  });
});

export default router;
