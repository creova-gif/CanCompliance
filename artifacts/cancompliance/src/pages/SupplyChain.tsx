import { useState } from "react";
import { Network, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

export default function SupplyChain() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [revenue, setRevenue] = useState("");
  const [assets, setAssets] = useState("");
  const [employees, setEmployees] = useState("");
  const [entity, setEntity] = useState("cbca");
  const [listed, setListed] = useState("no");
  const [iscPct, setIscPct] = useState("");
  const [iscFiled, setIscFiled] = useState("yes");

  const fmt = (n: number) => "$" + n.toLocaleString("en-CA");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const rev = parseFloat(revenue) || 0;
      const ast = parseFloat(assets) || 0;
      const emp = parseInt(employees) || 0;
      const isc = parseFloat(iscPct) || 0;

      const T20M = 20000000;
      const T250 = 250;

      const conds = [rev >= T20M ? 1 : 0, ast >= T20M ? 1 : 0, emp >= T250 ? 1 : 0];
      const condsMet = conds.reduce((a, b) => a + b, 0);
      const isCovered = listed === "yes" || condsMet >= 2 || entity === "government";

      const issues: string[] = [];

      if (entity === "cbca" && isc >= 25 && iscFiled === "no") {
        issues.push(`CBCA ISC FAIL: Shareholder at ${isc}% control exceeds 25% threshold — ISC data must be filed with Corporations Canada. Deadline: within 30 days of incorporation, within 15 days of any change, at each annual return. Penalty: up to $200,000.`);
      }

      let result: Result, title: string, statute: string, action: string;
      const condList = [`Revenue ≥ $20M: ${rev >= T20M ? "✓" : "✗"}`, `Assets ≥ $20M: ${ast >= T20M ? "✓" : "✗"}`, `Employees ≥ 250: ${emp >= T250 ? "✓" : "✗"}`];

      if (isCovered && issues.length > 0) {
        result = "fail";
        title = `FAIL — S-211 covered entity + ${issues.length} CBCA ISC filing violation(s)`;
        statute = "Fighting Against Forced Labour and Child Labour in Supply Chains Act (S-211) s.3 — Covered entities must file annual report by May 31. CBCA s.21.1 — ISC register filing required.";
        action = `<strong>S-211:</strong> Your entity meets ${condsMet}/3 size conditions${listed === "yes" ? " (exchange-listed)" : ""}. Annual report must be filed with Minister of Public Safety by May 31. Board approval required.<br><br><strong>CBCA ISC:</strong><br>` + issues.map(i => "• " + i).join("<br>");
      } else if (!isCovered && issues.length > 0) {
        result = "fail";
        title = "FAIL — S-211 exempt, but CBCA ISC filing violation detected";
        statute = "CBCA s.21.1 — Individuals with Significant Control register. Filing required with Corporations Canada effective January 22, 2024.";
        action = `Entity does not meet S-211 coverage threshold (only ${condsMet}/2 conditions met). However:<br><br>` + issues.map(i => "• " + i).join("<br>");
      } else if (isCovered) {
        result = "flag";
        title = `FLAG — S-211 covered entity: annual report required by May 31`;
        statute = "Fighting Against Forced Labour and Child Labour in Supply Chains Act SC 2023 c.9 (Bill S-211). Annual report required by May 31 each year. Penalty for non-filing: up to $250,000.";
        action = `<strong>Coverage status: COVERED</strong> (${condsMet}/3 conditions met${listed === "yes" ? " + exchange-listed" : ""})<br><br>Conditions: ${condList.join(" · ")}<br><br>Required actions:<br>• File annual report with Minister of Public Safety by May 31<br>• Report requires board approval and must be published on your website<br>• Cover: policies, due diligence, training, supply chain steps, effectiveness measures<br>• Penalty for non-filing: up to $250,000`;
      } else {
        result = "pass";
        title = "PASS — Entity not covered by S-211; CBCA ISC compliant";
        statute = "Fighting Against Forced Labour and Child Labour in Supply Chains Act SC 2023 c.9 — Entity does not meet coverage threshold. CBCA s.21.1 — ISC compliant.";
        action = `S-211: Entity meets only ${condsMet}/3 size conditions (${condList.join(" · ")}). Not exchange-listed. Exemption confirmed — no annual report required this cycle. Re-assess annually as revenue and assets change.<br><br>CBCA: ${isc < 25 ? "No individual exceeds 25% control threshold. No ISC filing required." : `ISC filed: ${iscFiled}. Verify next filing date.`}`;
      }

      const entry = { id: uid(), module: "S-211", ruleId: "FR-CA-E01", input: `Rev: ${fmt(rev)} · Assets: ${fmt(ast)} · Emp: ${emp}`, result: result.toUpperCase(), statute: "S-211 SC 2023 c.9", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Conditions met", val: `${condsMet}/3` },
        { label: "S-211 covered", val: isCovered ? "Yes" : "No" },
        { label: "ISC threshold", val: isc >= 25 ? "Triggered" : "Not triggered" },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Network size={20} />
        <span>S-211 — Supply Chain &amp; CBCA ISC</span>
      </div>
      <p className="page-desc">Fighting Against Forced Labour and Child Labour in Supply Chains Act (S-211) coverage assessment + CBCA Individuals with Significant Control (ISC) filing obligation check.</p>

      <div className="form-grid">
        <label className="form-label">
          Annual Revenue (CAD)
          <input className="form-input" type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="e.g. 25000000" data-testid="s211-revenue" />
        </label>
        <label className="form-label">
          Total Assets (CAD)
          <input className="form-input" type="number" value={assets} onChange={e => setAssets(e.target.value)} placeholder="e.g. 18000000" data-testid="s211-assets" />
        </label>
        <label className="form-label">
          Number of Employees
          <input className="form-input" type="number" value={employees} onChange={e => setEmployees(e.target.value)} placeholder="e.g. 310" data-testid="s211-employees" />
        </label>
        <label className="form-label">
          Entity Type
          <select className="form-select" value={entity} onChange={e => setEntity(e.target.value)} data-testid="s211-entity">
            <option value="cbca">CBCA corporation</option>
            <option value="provincial">Provincial corporation</option>
            <option value="government">Government institution</option>
            <option value="trust">Trust / partnership</option>
          </select>
        </label>
        <label className="form-label">
          Exchange-listed?
          <select className="form-select" value={listed} onChange={e => setListed(e.target.value)} data-testid="s211-listed">
            <option value="no">No</option>
            <option value="yes">Yes — TSX, TSXV, CSE or other</option>
          </select>
        </label>
        <label className="form-label">
          Largest shareholder control %
          <input className="form-input" type="number" value={iscPct} onChange={e => setIscPct(e.target.value)} placeholder="0–100" data-testid="s211-isc" />
        </label>
        <label className="form-label">
          ISC data filed with Corporations Canada?
          <select className="form-select" value={iscFiled} onChange={e => setIscFiled(e.target.value)} data-testid="s211-iscfiled">
            <option value="yes">Yes — filed and current</option>
            <option value="no">No</option>
            <option value="unsure">Unsure</option>
          </select>
        </label>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="s211-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Network size={15} />}
        Run S-211 / ISC Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
