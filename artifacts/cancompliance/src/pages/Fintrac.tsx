import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

export default function Fintrac() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("cash");
  const [customer, setCustomer] = useState("individual");
  const [sector, setSector] = useState("retail");
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [s3, setS3] = useState(false);
  const [s4, setS4] = useState(false);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const amountNum = parseFloat(amount) || 0;
      const highRisk = ["crypto", "casino", "moneysvc"].includes(sector);
      const suspiciousCount = [s1, s2, s3, s4].filter(Boolean).length;

      let result: Result, title: string, statute: string, action: string;

      if (amountNum >= 10000) {
        result = "fail";
        title = `FAIL — Large transaction: ${fmt(amountNum)} exceeds $10,000 CAD threshold`;
        statute = "PCMLTFA s.7 — Large Cash Transaction Report. Transactions of $10,000 CAD or more in a single transaction or series must be reported to FINTRAC within 15 days.";
        action = `Mandatory KYC verification required. File a Large Cash Transaction Report (LCTR) with FINTRAC within 15 days. Collect: full legal name, address, date of birth, nature of business. Log transaction ID, amount, date, and method.`;
      } else if (suspiciousCount >= 1 || customer === "pep") {
        result = "flag";
        title = `FLAG — ${customer === "pep" ? "PEP detected + " : ""}${suspiciousCount} suspicious indicator(s) — enhanced due diligence required`;
        statute = "PCMLTFA s.9.3 — Suspicious Transaction Report (STR). A STR must be filed when there are reasonable grounds to suspect ML/TF activity, regardless of transaction amount.";
        action = `Transaction is below the $10,000 threshold but ${customer === "pep" ? "involves a Politically Exposed Person and " : ""}suspicious indicators are present. Apply enhanced due diligence. If grounds for suspicion remain, file an STR with FINTRAC within 30 days. Document your assessment reasoning contemporaneously.`;
      } else if (highRisk) {
        result = "flag";
        title = "FLAG — High-risk sector: enhanced monitoring required";
        statute = "PCMLTFA s.9.6 — Ongoing monitoring obligations for high-risk business relationships.";
        action = `Sector "${sector}" is categorized as high-risk by FINTRAC. Apply enhanced due diligence, more frequent monitoring, and senior management approval for the business relationship. Document risk assessment.`;
      } else {
        result = "pass";
        title = `PASS — Transaction of ${fmt(amountNum)} cleared all FINTRAC checks`;
        statute = "PCMLTFA — No reporting obligations triggered at this threshold with current indicators.";
        action = "No FINTRAC reporting obligation triggered. Transaction is below $10,000 threshold and no suspicious indicators are present. Continue standard monitoring. Maintain records for 5 years per PCMLTFA s.24.";
      }

      const entry = { id: uid(), module: "FINTRAC", ruleId: "FR-CA-C01", input: `${fmt(amountNum)} · ${type} · ${customer}`, result: result.toUpperCase(), statute: "PCMLTFA s.7, s.9.3", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Amount", val: fmt(amountNum) },
        { label: "Threshold", val: "$10,000 CAD" },
        { label: "Suspicious flags", val: `${suspiciousCount}/4` },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      {/* System 7 — FINTRAC Bill C-12 Patch */}
      <div style={{ background: "rgba(240,68,56,0.12)", border: "1px solid rgba(240,68,56,0.35)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "var(--red)", background: "rgba(240,68,56,0.25)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 4 }}>BILL C-12 · IN FORCE · MAR 26, 2026</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", marginTop: 2 }}>SYSTEM 7 — FINTRAC BILL C-12 PATCH</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--red)", marginBottom: 6 }}>New "effectiveness" standard — FINTRAC can now challenge your compliance program design</div>
          <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65, marginBottom: 8 }}>
            Bill C-12 amended PCMLTFA effective <strong>March 26, 2026</strong>. FINTRAC can now impose penalties if your compliance program is not "reasonably designed, risk-based and effective" — even if you technically met every specific requirement. This is a fundamental shift from rule-based to principles-based enforcement.
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginBottom: 2 }}>PENALTY INCREASE</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)", fontWeight: 700 }}>40× — Up to $20M or 3% global revenue</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginBottom: 2 }}>NEW VIOLATION TYPE</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--amber)" }}>PCMLTFA S.9.6 "Very Serious" · Effectiveness standard</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginBottom: 2 }}>ENFORCEMENT RECORD</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)" }}>$176.9M AMP — Oct 2025 (pre-C-12)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-header">
        <Search size={20} />
        <span>FINTRAC — AML / KYC</span>
      </div>
      <p className="page-desc">Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA) transaction screening. Checks $10,000 LCTR threshold, STR obligations, PEP detection, and sector risk.</p>

      <div className="form-grid">
        <label className="form-label">
          Transaction Amount (CAD)
          <input className="form-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" data-testid="fintrac-amount" />
        </label>
        <label className="form-label">
          Transaction Type
          <select className="form-select" value={type} onChange={e => setType(e.target.value)} data-testid="fintrac-type">
            <option value="cash">Cash</option>
            <option value="wire">Wire transfer</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="cheque">Cheque</option>
            <option value="eft">EFT / ACH</option>
          </select>
        </label>
        <label className="form-label">
          Customer Type
          <select className="form-select" value={customer} onChange={e => setCustomer(e.target.value)} data-testid="fintrac-customer">
            <option value="individual">Individual</option>
            <option value="corporation">Corporation</option>
            <option value="pep">Politically Exposed Person (PEP)</option>
            <option value="third-party">Third party / agent</option>
          </select>
        </label>
        <label className="form-label">
          Business Sector
          <select className="form-select" value={sector} onChange={e => setSector(e.target.value)} data-testid="fintrac-sector">
            <option value="retail">Retail</option>
            <option value="real_estate">Real estate</option>
            <option value="crypto">Cryptocurrency exchange</option>
            <option value="casino">Casino / gaming</option>
            <option value="moneysvc">Money service business</option>
            <option value="financial">Financial institution</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>SUSPICIOUS INDICATORS — check all that apply:</div>
        <div className="checks-grid">
          {[
            [s1, setS1, "Transaction amount is just below a reporting threshold (structuring)"],
            [s2, setS2, "Customer unwilling to provide identification or shows unusual concern about records"],
            [s3, setS3, "Transaction is inconsistent with customer's known business or profile"],
            [s4, setS4, "Multiple transactions totalling ≥$10,000 in 24-hour period"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="fintrac-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Search size={15} />}
        Run FINTRAC Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
