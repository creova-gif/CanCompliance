import { useState } from "react";
import { Recycle, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

export default function EPR() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [province, setProvince] = useState("ON");
  const [role, setRole] = useState("brand_owner");
  const [category, setCategory] = useState("packaging");
  const [revenue, setRevenue] = useState("");
  const [e1, setE1] = useState(false);
  const [e2, setE2] = useState(false);
  const [e3, setE3] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const rev = parseFloat(revenue) || 0;
      const issues: string[] = [], flags: string[] = [];

      if (province === "ON") {
        if (category === "packaging" && !e1) issues.push("FAIL: Ontario Blue Box Program — brand owners, first importers, and franchisors of packaged goods must register with Circular Materials Ontario and pay PRF (Producer Responsibility Fees). Annual tonnage report due March 31. Non-registration: penalty up to $100,000/day.");
        if (category === "electronics" && !e2) issues.push("FAIL: Ontario EPRA — Producers of electronics must register with Ontario Electronics Stewardship and meet collection targets. Penalty: up to $50,000 for first offence.");
        if (category === "batteries" && !e3) flags.push("FLAG: Battery regulations under Canada's Canadian Environmental Protection Act (CEPA) — domestic regulations for battery stewardship are being finalized. Monitor Environment and Climate Change Canada for registration obligations in 2025-2026.");
      }

      if (province === "BC") {
        if (category === "packaging" && !e1) flags.push("FLAG: BC Packaging and Printed Paper (PPP) Stewardship Program — brand owners supplying packaging to BC must register with Recycle BC and contribute to the PPP plan. Confirm your registration status.");
        if (category === "electronics" && !e2) issues.push("FAIL: BC Electronics Stewardship (EPRA BC) — producers of electronics covered under the BC Recycling Regulation must register with EPRA BC and meet annual collection targets.");
      }

      if (province === "QC") {
        if (category === "packaging" && !e1) issues.push("FAIL: Quebec Regulation 2011-1 — Producers, importers, and brand owners must register with ÉEQ (Éco Entreprises Québec) and compensate municipalities for recycling costs. Annual declaration due February 28. Non-compliance: up to $1,000,000 fine.");
      }

      if (rev > 2000000 && !e3) flags.push("FLAG: CEPA s.66 — Large producers may be subject to federal waste reduction obligations under CEPA. The proposed Canada Plastics Registry requires manufacturers/importers of plastic products to report annually to Environment Canada. Deadline: June 30 each year.");

      const hasFail = issues.some(i => i.startsWith("FAIL"));
      const result: Result = hasFail ? "fail" : issues.length > 0 || flags.length > 0 ? "flag" : "pass";

      const title = result === "fail" ? `FAIL — ${issues.filter(i => i.startsWith("FAIL")).length} EPR registration violation(s)`
        : result === "flag" ? `FLAG — ${issues.length + flags.length} EPR / stewardship obligation(s) to review`
        : `PASS — No EPR violations detected for ${province}`;

      const statute = province === "ON"
        ? "Resource Recovery and Circular Economy Act SO 2016 c.12 (RRCEA) · Blue Box Regulation O.Reg 391/21"
        : province === "BC"
        ? "Environmental Management Act SBC 2003 c.53 · Recycling Regulation BC Reg 449/2004"
        : province === "QC"
        ? "Environment Quality Act CQLR c.Q-2 · Regulation respecting compensation for municipal services provided to recover and reclaim residual materials (Reg 2011-1)"
        : "Canadian Environmental Protection Act SC 1999 c.33 (CEPA) · Canada Plastics Registry";

      const action = result === "pass"
        ? `No EPR violations detected for a ${role} in ${province} (${category}). Re-assess annually — EPR regulations are expanding. Monitor Environment Canada and provincial registries for new obligations.`
        : (issues.concat(flags)).map(i => "• " + i).join("<br>");

      const entry = { id: uid(), module: "EPR/Env.", ruleId: "FR-CA-M01", input: `${province} · ${role} · ${category}`, result: result.toUpperCase(), statute: "RRCEA / CEPA", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Province", val: province },
        { label: "Category", val: category },
        { label: "Issues", val: issues.length },
      ]});
      setLoading(false);
    }, 700);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Recycle size={20} />
        <span>EPR / Environmental</span>
      </div>
      <p className="page-desc">Extended Producer Responsibility compliance — Blue Box (Ontario), BC Recycling Regulation, Quebec ÉEQ, CEPA Canada Plastics Registry, electronics and battery stewardship obligations.</p>

      <div className="form-grid">
        <label className="form-label">
          Province
          <select className="form-select" value={province} onChange={e => setProvince(e.target.value)} data-testid="epr-province">
            <option value="ON">Ontario (Blue Box / RRCEA)</option>
            <option value="BC">British Columbia (Recycling Regulation)</option>
            <option value="QC">Quebec (ÉEQ / Reg 2011-1)</option>
            <option value="AB">Alberta (AMA)</option>
            <option value="FED">Federal (CEPA)</option>
          </select>
        </label>
        <label className="form-label">
          Your Role in Supply Chain
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)} data-testid="epr-role">
            <option value="brand_owner">Brand owner / licensor</option>
            <option value="first_importer">First importer into Canada</option>
            <option value="franchisor">Franchisor</option>
            <option value="retailer">Retailer only</option>
            <option value="manufacturer">Manufacturer</option>
          </select>
        </label>
        <label className="form-label">
          Product / Material Category
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} data-testid="epr-category">
            <option value="packaging">Packaging / printed paper</option>
            <option value="electronics">Electronics / E-waste</option>
            <option value="batteries">Batteries</option>
            <option value="tires">Tires</option>
            <option value="haz_materials">Hazardous materials</option>
          </select>
        </label>
        <label className="form-label">
          Annual Revenue (CAD)
          <input className="form-input" type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="e.g. 5000000" data-testid="epr-revenue" />
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>EPR REGISTRATIONS IN PLACE — check all that apply:</div>
        <div className="checks-grid">
          {[
            [e1, setE1, "Registered with packaging stewardship program (Blue Box / Recycle BC / ÉEQ)"],
            [e2, setE2, "Registered with electronics stewardship (EPRA / ARPE-Québec)"],
            [e3, setE3, "Registered with federal Canada Plastics Registry (CEPA s.66)"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="epr-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Recycle size={15} />}
        Run EPR Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
