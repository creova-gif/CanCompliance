import { useState } from "react";
import { Receipt, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail";

const RATES: Record<string, number> = { ON: 0.13, QC: 0.05, BC: 0.05, AB: 0.05, NS: 0.15, NB: 0.15, NL: 0.15, PE: 0.15, MB: 0.05, SK: 0.05 };
const RATE_LABELS: Record<string, string> = { ON: "HST 13%", QC: "GST 5% + QST 9.975%", BC: "GST 5% + PST 7%", AB: "GST 5%", NS: "HST 15%", NB: "HST 15%", NL: "HST 15%", PE: "HST 15%", MB: "GST 5% + PST 7%", SK: "GST 5% + PST 6%" };
const DEADLINES: Record<string, string> = { annual: "June 15 (self-employed) / 3 months after fiscal year-end", quarterly: "1 month after each quarter-end", monthly: "1 month after each reporting period" };

export default function GstHst() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [revenue, setRevenue] = useState("");
  const [registered, setRegistered] = useState("no");
  const [type, setType] = useState("taxable");
  const [province, setProvince] = useState("ON");
  const [freq, setFreq] = useState("annual");
  const [itc, setItc] = useState("");

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const rev = parseFloat(revenue) || 0;
      const itcAmt = parseFloat(itc) || 0;
      let result: Result, title: string, statute: string, action: string;

      if (type === "exempt") {
        result = "pass";
        title = "PASS — Exempt supplies: no GST/HST collectible";
        statute = "Excise Tax Act Schedule V — Exempt supplies include residential rent, most health services, most educational services, and financial services.";
        action = "Your supply is exempt — you do not charge GST/HST and cannot claim Input Tax Credits on related expenses. Confirm your supply falls within Schedule V. If you have both taxable and exempt supplies, you must prorate ITCs.";
      } else if (type === "zero") {
        result = "pass";
        title = "PASS — Zero-rated supply: GST/HST at 0%, ITCs fully claimable";
        statute = "Excise Tax Act Schedule VI — Zero-rated supplies include basic groceries, exports, and certain medical devices.";
        action = `Zero-rated supplies are technically taxable at 0%. You collect no GST/HST from customers but can claim full ITCs on your inputs. ITC available this period: ${fmt(itcAmt * RATES[province])}. File ${freq} with CRA.`;
      } else if (rev < 30000 && registered === "no") {
        result = "pass";
        title = `PASS — Small supplier: ${fmt(rev)} annual revenue is below $30,000 GST/HST threshold`;
        statute = "Excise Tax Act s.148 — Small Supplier. A person whose taxable supplies in any rolling 4 consecutive quarters do not exceed $30,000 is a small supplier and not required to register.";
        action = `You are not required to register for GST/HST. Monitor revenue — if you exceed $30,000 in any rolling 12-month period, you must register within 29 days and begin charging. You may voluntarily register to claim ITCs.`;
      } else if (rev >= 30000 && registered === "no") {
        result = "fail";
        title = `FAIL — Revenue ${fmt(rev)} exceeds $30,000 threshold: GST/HST registration required`;
        statute = "Excise Tax Act s.148, s.240 — Mandatory registration when taxable supplies exceed $30,000 in 4 consecutive quarters. Penalty: 5% of net tax owed plus 1% per month for late filing.";
        action = `You must register for GST/HST immediately. Register online at canada.ca/cra-forms. Once registered, charge ${RATE_LABELS[province]} on all taxable supplies. You are liable for tax from the date registration was required, even if not collected from customers.`;
      } else {
        const taxCollected = rev * RATES[province];
        const itcAmount = itcAmt * RATES[province];
        const netTax = Math.max(0, taxCollected - itcAmount);
        result = "pass";
        title = `PASS — Registered. Net ${RATE_LABELS[province]} owing: ${fmt(netTax)}`;
        statute = `Excise Tax Act s.225 — Net tax calculation. File ${freq} returns. Deadline: ${DEADLINES[freq]}.`;
        action = `<strong>GST/HST calculation:</strong><br>Tax collected on sales: ${fmt(taxCollected)}<br>Less ITCs (purchases): ${fmt(itcAmount)}<br><strong>Net remittance: ${fmt(netTax)}</strong><br><br><strong>Filing deadline:</strong> ${DEADLINES[freq]}<br><strong>Rate applied:</strong> ${RATE_LABELS[province]}${province === "QC" ? "<br><br><strong>Quebec note:</strong> File QST separately with Revenu Québec (rate 9.975%). This calculator shows GST only for QC." : ""}`;
      }

      const entry = { id: uid(), module: "GST/HST", ruleId: "FR-CA-G01", input: `${fmt(rev)} · ${province} · ${registered === "yes" ? "registered" : "not registered"}`, result: result.toUpperCase(), statute: "Excise Tax Act s.148, s.240", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Province rate", val: RATE_LABELS[province] },
        { label: "Threshold", val: "$30,000" },
        { label: "Filing", val: freq },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Receipt size={20} />
        <span>GST / HST</span>
      </div>
      <p className="page-desc">GST/HST registration threshold check and net tax calculation for registered businesses. Includes province-specific HST/PST rates, ITC calculations, and filing deadlines.</p>

      <div className="form-grid">
        <label className="form-label">
          Annual Taxable Revenue (CAD)
          <input className="form-input" type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="e.g. 95000" data-testid="gst-revenue" />
        </label>
        <label className="form-label">
          GST/HST Registered?
          <select className="form-select" value={registered} onChange={e => setRegistered(e.target.value)} data-testid="gst-registered">
            <option value="no">No</option>
            <option value="yes">Yes — have a GST/HST number</option>
          </select>
        </label>
        <label className="form-label">
          Supply Type
          <select className="form-select" value={type} onChange={e => setType(e.target.value)} data-testid="gst-type">
            <option value="taxable">Taxable supply</option>
            <option value="zero">Zero-rated supply (0%)</option>
            <option value="exempt">Exempt supply</option>
          </select>
        </label>
        <label className="form-label">
          Province
          <select className="form-select" value={province} onChange={e => setProvince(e.target.value)} data-testid="gst-province">
            {Object.keys(RATES).map(p => <option key={p} value={p}>{p} — {RATE_LABELS[p]}</option>)}
          </select>
        </label>
        <label className="form-label">
          Filing Frequency
          <select className="form-select" value={freq} onChange={e => setFreq(e.target.value)} data-testid="gst-freq">
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label className="form-label">
          Eligible Purchases for ITC (CAD, period total)
          <input className="form-input" type="number" value={itc} onChange={e => setItc(e.target.value)} placeholder="0" data-testid="gst-itc" />
        </label>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="gst-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Receipt size={15} />}
        Run GST/HST Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
