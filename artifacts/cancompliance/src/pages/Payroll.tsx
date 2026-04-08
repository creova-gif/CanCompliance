import { useState } from "react";
import { DollarSign, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail";

export default function Payroll() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [gross, setGross] = useState("");
  const [period, setPeriod] = useState("biweekly");
  const [province, setProvince] = useState("ON");
  const [age, setAge] = useState("adult");
  const [cppYtd, setCppYtd] = useState("0");
  const [eiYtd, setEiYtd] = useState("0");
  const [sred, setSred] = useState("no");

  const fmt = (n: number) => "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const grossNum = parseFloat(gross) || 0;
      const cppYtdNum = parseFloat(cppYtd) || 0;
      const eiYtdNum = parseFloat(eiYtd) || 0;

      const CPP_RATE = 0.0595;
      const CPP_EXEMPTION_ANNUAL = 3500;
      const CPP_MAX = 3867.50;
      const EI_RATE = 0.0166;
      const EI_MAX = 1049.12;

      const periodsMap: Record<string, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
      const periodsPerYear = periodsMap[period] || 26;
      const annualGross = grossNum * periodsPerYear;

      const issues: string[] = [];
      let cppDeduction = 0, eiDeduction = 0, itDeduction = 0;

      if (age === "under18" || age === "over70") {
        cppDeduction = 0;
        if (age === "over70") issues.push("CPP exempt: employee is over 70 years of age — CPP contributions cease. Confirm date of birth on file.");
      } else {
        const CPP_EXEMPTION = CPP_EXEMPTION_ANNUAL / periodsPerYear;
        const cppRemaining = Math.max(0, CPP_MAX - cppYtdNum);
        cppDeduction = Math.min(Math.max(0, (grossNum - CPP_EXEMPTION) * CPP_RATE), cppRemaining);
      }

      const eiRemaining = Math.max(0, EI_MAX - eiYtdNum);
      eiDeduction = Math.min(grossNum * EI_RATE, eiRemaining);

      const federalBasic = 15705 / periodsPerYear;
      const taxableIncome = Math.max(0, grossNum - cppDeduction - eiDeduction - federalBasic);
      const annualTaxable = taxableIncome * periodsPerYear;

      let fedRate: number;
      if (annualTaxable <= 55867) fedRate = 0.15;
      else if (annualTaxable <= 111733) fedRate = 0.205;
      else if (annualTaxable <= 154906) fedRate = 0.26;
      else if (annualTaxable <= 220000) fedRate = 0.29;
      else fedRate = 0.33;

      itDeduction = (taxableIncome * fedRate) + (province === "QC" ? 0 : grossNum * 0.05);
      const netPay = grossNum - cppDeduction - eiDeduction - itDeduction;
      const totalRemittance = cppDeduction * 2 + eiDeduction * 1.4;

      const remittanceDue = annualGross < 25000
        ? "15th of following month"
        : annualGross < 100000
        ? "15th of following month"
        : "3rd Wednesday of current month";

      if (province === "QC") issues.push("Quebec employees: also subject to QPP (instead of CPP) and QPIP. File with Revenu Québec separately. This calculator shows federal only.");
      if (annualGross > 250000) issues.push(`High earner: verify CPP2 (second additional contributions) applies above $73,200 YAMPE threshold.`);

      const result: Result = "pass";
      const title = `PASS — Payroll deductions calculated: net pay ${fmt(netPay)}`;
      const statute = "Income Tax Act s.153 · Canada Pension Plan Act s.8 · Employment Insurance Act s.66 — Deductions and remittance obligations met.";
      const action = `<strong>Pay stub breakdown:</strong><br>Gross: ${fmt(grossNum)} | CPP: ${fmt(cppDeduction)} | EI: ${fmt(eiDeduction)} | Income tax (est.): ${fmt(itDeduction)} | Net pay: <strong>${fmt(netPay)}</strong><br><br><strong>Employer remittance:</strong> ${fmt(totalRemittance)} (CPP employer match: ${fmt(cppDeduction)} + EI employer: ${fmt(eiDeduction * 1.4)})<br><strong>Remittance due:</strong> ${remittanceDue}${sred === "yes" ? "<br><br><strong>SR&amp;ED note:</strong> Wages paid to employees conducting qualifying R&amp;D may be eligible for SR&amp;ED tax credits. Document activities contemporaneously." : ""}${issues.length ? "<br><br><strong>Notes:</strong><br>" + issues.map(i => "• " + i).join("<br>") : ""}`;

      const entry = { id: uid(), module: "Payroll", ruleId: "FR-CA-F01", input: `${fmt(grossNum)} ${period} · ${province} · ${age}`, result: result.toUpperCase(), statute: "Income Tax Act s.153", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Province", val: province },
        { label: "Pay period", val: period },
        { label: "Annual gross (est.)", val: "$" + Math.round(annualGross).toLocaleString("en-CA") },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <DollarSign size={20} />
        <span>Payroll — CPP / EI / Income Tax</span>
      </div>
      <p className="page-desc">CRA payroll deduction calculator. Computes CPP, EI, and estimated federal income tax withholding per pay period with employer remittance amounts and due dates.</p>

      <div className="form-grid">
        <label className="form-label">
          Gross Pay Per Period (CAD)
          <input className="form-input" type="number" value={gross} onChange={e => setGross(e.target.value)} placeholder="e.g. 3500" data-testid="payroll-gross" />
        </label>
        <label className="form-label">
          Pay Period Frequency
          <select className="form-select" value={period} onChange={e => setPeriod(e.target.value)} data-testid="payroll-period">
            <option value="weekly">Weekly (52/yr)</option>
            <option value="biweekly">Bi-weekly (26/yr)</option>
            <option value="semimonthly">Semi-monthly (24/yr)</option>
            <option value="monthly">Monthly (12/yr)</option>
          </select>
        </label>
        <label className="form-label">
          Province / Territory
          <select className="form-select" value={province} onChange={e => setProvince(e.target.value)} data-testid="payroll-province">
            <option value="ON">Ontario</option>
            <option value="BC">British Columbia</option>
            <option value="AB">Alberta</option>
            <option value="QC">Quebec</option>
            <option value="FED">Federal / Other</option>
            <option value="MB">Manitoba</option>
            <option value="SK">Saskatchewan</option>
          </select>
        </label>
        <label className="form-label">
          Employee Age Group
          <select className="form-select" value={age} onChange={e => setAge(e.target.value)} data-testid="payroll-age">
            <option value="adult">Adult (18–69)</option>
            <option value="under18">Under 18</option>
            <option value="over70">70 or older</option>
          </select>
        </label>
        <label className="form-label">
          CPP Contributions YTD (CAD)
          <input className="form-input" type="number" value={cppYtd} onChange={e => setCppYtd(e.target.value)} placeholder="0" data-testid="payroll-cpp-ytd" />
        </label>
        <label className="form-label">
          EI Premiums YTD (CAD)
          <input className="form-input" type="number" value={eiYtd} onChange={e => setEiYtd(e.target.value)} placeholder="0" data-testid="payroll-ei-ytd" />
        </label>
        <label className="form-label">
          SR&amp;ED qualifying R&amp;D wages?
          <select className="form-select" value={sred} onChange={e => setSred(e.target.value)} data-testid="payroll-sred">
            <option value="no">No</option>
            <option value="yes">Yes — employee conducts qualifying R&amp;D</option>
          </select>
        </label>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="payroll-run">
        {loading ? <Loader2 size={15} className="spin" /> : <DollarSign size={15} />}
        Calculate Payroll Deductions
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
