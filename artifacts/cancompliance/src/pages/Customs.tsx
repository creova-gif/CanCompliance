import { useState } from "react";
import { Package, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

const BASE_RATES: Record<string, number> = { US: 0, MX: 0, CN: 0.065, EU: 0.035, UK: 0.03, IN: 0.05, OTHER: 0.05 };

export default function Customs() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [activity, setActivity] = useState("import");
  const [origin, setOrigin] = useState("US");
  const [hsCode, setHsCode] = useState("");
  const [value, setValue] = useState("");
  const [carm, setCarm] = useState("yes");
  const [cusma, setCusma] = useState("no");
  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);
  const [f3, setF3] = useState(false);
  const [f4, setF4] = useState(false);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const val = parseFloat(value) || 0;
      const issues: string[] = [];

      if (carm === "no" || carm === "unsure") {
        issues.push("FAIL: CARM (CBSA Assessment and Revenue Management) registration is MANDATORY for all importers as of October 2024. You must register at carm.cbsa-asfc.gc.ca to post security, file B3 accounting documents, and receive duty statements electronically.");
      }

      let dutyRate = BASE_RATES[origin] || 0.05;
      let dutyAmount = val * dutyRate;

      if (f1) {
        issues.push("FLAG: Steel/aluminum surtax — Canada imposed retaliatory surtaxes on US steel (25%) and aluminum (25%) effective 2025. Verify whether your products are subject to Canadian countermeasure tariffs. Origin marking and mill certificates required.");
        if (origin === "US") dutyRate += 0.25;
      }
      if (f2 && origin === "CN") {
        issues.push("FAIL: Chinese EVs and EV components are subject to a 100% surtax effective October 2024 (plus the existing 6.1% MFN tariff). If your goods fall under HS chapters 87, 85, or 8507, total duty = 106.1% of customs value.");
        dutyRate += 1.0;
      }

      if (origin === "US" && cusma === "yes") {
        dutyRate = 0;
        dutyAmount = 0;
      } else {
        dutyAmount = val * dutyRate;
      }

      const gstOnImport = (val + dutyAmount) * 0.05;
      const totalLandedCost = val + dutyAmount + gstOnImport;

      if (f3 && val > 3300) issues.push(`FLAG: Formal customs entry required for shipments over CAD $3,300. Ensure B3 accounting documents are filed via CARM or your customs broker. Non-compliance results in delays and penalty interest.`);
      if (f4) issues.push("FLAG: SIMA (Special Import Measures Act) — anti-dumping and countervailing duties may apply. Check CBSA SIMA findings at cbsa-asfc.gc.ca for your HS code before importing.");

      const hasFail = issues.some(i => i.startsWith("FAIL"));
      const result: Result = hasFail ? "fail" : issues.length > 0 ? "flag" : "pass";

      const title = result === "fail" ? `FAIL — CARM registration / duty violation(s) detected`
        : result === "flag" ? `FLAG — ${issues.length} customs risk(s) require attention`
        : `PASS — Customs cleared: estimated landed cost ${fmt(totalLandedCost)}`;

      const statute = "Customs Act RSC 1985 c.1 (5th Supp.) · Customs Tariff SC 1997 c.36 · Special Import Measures Act RSC 1985 c.S-15 (SIMA) · CARM (mandatory Oct 2024)";
      const action = result === "pass"
        ? `<strong>Customs calculation:</strong><br>Customs value: ${fmt(val)}<br>Duty rate: ${(dutyRate * 100).toFixed(1)}% ${origin === "US" && cusma === "yes" ? "(CUSMA/USMCA: 0%)" : `(${origin} MFN rate)`}<br>Duty: ${fmt(dutyAmount)}<br>GST on import (5%): ${fmt(gstOnImport)}<br><strong>Total landed cost: ${fmt(totalLandedCost)}</strong><br><br>HS code: ${hsCode || "not provided — consult Canadian Customs Tariff"}`
        : issues.map(i => "• " + i).join("<br>") + (issues.length < 4 ? `<br><br><strong>Duty estimate (if resolved):</strong> ${fmt(dutyAmount)} + GST ${fmt(gstOnImport)} = ${fmt(totalLandedCost)} landed` : "");

      const entry = { id: uid(), module: "Customs", ruleId: "FR-CA-K01", input: `${activity} · ${origin} · ${fmt(val)} · HS:${hsCode || "—"}`, result: result.toUpperCase(), statute: "Customs Act RSC 1985", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Origin", val: origin },
        { label: "Duty rate", val: (dutyRate * 100).toFixed(1) + "%" },
        { label: "Landed cost", val: fmt(totalLandedCost) },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Package size={20} />
        <span>Customs / CBSA</span>
      </div>
      <p className="page-desc">CBSA import compliance check — CARM registration, duty rates, CUSMA/USMCA origin, retaliatory tariffs, SIMA anti-dumping, and landed cost calculation.</p>

      <div className="form-grid">
        <label className="form-label">
          Trade Activity
          <select className="form-select" value={activity} onChange={e => setActivity(e.target.value)} data-testid="cus-activity">
            <option value="import">Import into Canada</option>
            <option value="export">Export from Canada</option>
            <option value="transit">In-transit / transshipment</option>
          </select>
        </label>
        <label className="form-label">
          Country of Origin
          <select className="form-select" value={origin} onChange={e => setOrigin(e.target.value)} data-testid="cus-origin">
            <option value="US">United States</option>
            <option value="MX">Mexico</option>
            <option value="CN">China</option>
            <option value="EU">European Union</option>
            <option value="UK">United Kingdom</option>
            <option value="IN">India</option>
            <option value="OTHER">Other / MFN</option>
          </select>
        </label>
        <label className="form-label">
          HS Code (6-digit)
          <input className="form-input" value={hsCode} onChange={e => setHsCode(e.target.value)} placeholder="e.g. 8471.30" data-testid="cus-hs" />
        </label>
        <label className="form-label">
          Customs Value (CAD)
          <input className="form-input" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. 50000" data-testid="cus-value" />
        </label>
        <label className="form-label">
          CARM Registration Status
          <select className="form-select" value={carm} onChange={e => setCarm(e.target.value)} data-testid="cus-carm">
            <option value="yes">Registered and active</option>
            <option value="no">Not registered</option>
            <option value="unsure">Unsure</option>
          </select>
        </label>
        <label className="form-label">
          CUSMA/USMCA Origin Certificate?
          <select className="form-select" value={cusma} onChange={e => setCusma(e.target.value)} data-testid="cus-cusma">
            <option value="no">No</option>
            <option value="yes">Yes — qualifies for CUSMA preferential treatment</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>ADDITIONAL FLAGS:</div>
        <div className="checks-grid">
          {[
            [f1, setF1, "Goods are steel, aluminum, or related products"],
            [f2, setF2, "Goods are EVs, EV components, or batteries (from China)"],
            [f3, setF3, "Shipment value exceeds CAD $3,300 (formal entry threshold)"],
            [f4, setF4, "Potential SIMA anti-dumping / countervailing duty exposure"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="cus-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Package size={15} />}
        Run Customs Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
