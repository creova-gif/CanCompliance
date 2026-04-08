import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag";

export default function CPLA() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [product, setProduct] = useState("");
  const [province, setProvince] = useState("ON");
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(false);
  const [c4, setC4] = useState(false);
  const [c5, setC5] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const issues: string[] = [];
      const flags: string[] = [];
      const isQC = province === "QC";

      if (!c1) issues.push("FAIL: Net quantity declaration missing or not in metric units. CPLA s.4 requires the net quantity of the product be shown in metric units on the principal display panel.");
      if (!c2) issues.push("FAIL: Product identity (common name) not declared on principal display panel in both English and French. CPLA s.6 — bilingual product name declaration is mandatory for all consumer prepackaged products sold nationally.");
      if (!c3) issues.push("FAIL: Dealer name and address not shown. CPLA s.11 — the name and address of the dealer responsible for the product must appear on the label.");
      if (isQC && !c4) issues.push("FAIL: Quebec (Bill 96) — French must be at least as prominent as any other language on all product labels, signs, and menus sold in Quebec (Charter of the French Language as amended by Bill 96, in force June 1 2025). Penalties up to $30,000.");
      if (isQC && !c5) flags.push("FLAG: Quebec — Ensure all markings, instructions, and warranty information are available in French. Under Bill 96, French must appear on all writings accompanying consumer goods sold in Quebec.");

      const result: Result = issues.length > 0 ? "fail" : flags.length > 0 ? "flag" : "pass";
      const title = result === "fail"
        ? `FAIL — ${issues.length} CPLA/Bill 96 labelling violation(s)`
        : result === "flag"
        ? `FLAG — ${flags.length} Quebec Bill 96 item(s) to verify`
        : `PASS — Labelling appears compliant for ${province}`;

      const statute = "Consumer Packaging and Labelling Act RSC 1985 c.C-38 (CPLA) · Consumer Packaging and Labelling Regulations CRC c.417" + (isQC ? " · Charter of the French Language (Bill 96) CQLR c.C-11 — in force June 1 2025" : "");
      const action = result === "pass"
        ? `Labelling for "${product || "product"}" passes CPLA requirements for ${province}. Ensure labels are reviewed with each product change. Net quantity must appear on the principal display panel in metric units.`
        : (issues.concat(flags)).map(i => "• " + i).join("<br>");

      const entry = { id: uid(), module: "CPLA", ruleId: "FR-CA-B01", input: `${product || "—"} · ${province}`, result: result.toUpperCase(), statute: "CPLA RSC 1985 c.C-38", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Province", val: province },
        { label: "Issues", val: issues.length },
        { label: "Bill 96 (QC)", val: isQC ? "Applicable" : "N/A" },
      ]});
      setLoading(false);
    }, 600);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Globe size={20} />
        <span>CPLA — Packaging &amp; Bilingualism</span>
      </div>
      <p className="page-desc">Consumer Packaging and Labelling Act compliance check — net quantity, bilingual product identity, dealer info, and Quebec Bill 96 French-language requirements.</p>

      <div className="form-grid">
        <label className="form-label">
          Product Name / Description
          <input className="form-input" value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Organic granola bar, 200g" data-testid="cpla-product" />
        </label>
        <label className="form-label">
          Primary Market Province
          <select className="form-select" value={province} onChange={e => setProvince(e.target.value)} data-testid="cpla-province">
            <option value="ON">Ontario</option>
            <option value="QC">Quebec</option>
            <option value="BC">British Columbia</option>
            <option value="AB">Alberta</option>
            <option value="FED">Federal / National</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>LABEL CHECKLIST — confirm all that are present:</div>
        <div className="checks-grid">
          {[
            [c1, setC1, "Net quantity declared in metric units on principal display panel"],
            [c2, setC2, "Product identity (common name) in both English and French"],
            [c3, setC3, "Dealer name and Canadian address on label"],
            [c4, setC4, "French text at least as prominent as English (Quebec)"],
            [c5, setC5, "All instructions, warnings, and warranty in French (Quebec)"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="cpla-run">
        {loading ? <Loader2 size={15} className="spin" /> : <Globe size={15} />}
        Run CPLA Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
