import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

type Result = "pass" | "fail" | "flag" | "block";

export default function CCPSA() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("general");
  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);
  const [f3, setF3] = useState(false);
  const [f4, setF4] = useState(false);
  const [f5, setF5] = useState(false);
  const [f6, setF6] = useState(false);
  const [f7, setF7] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const issues: string[] = [];
      const flags: string[] = [];

      if (f1) issues.push("FAIL: Product contains lead above permitted limits (CCPSA Schedule 1 / SOR/2010-273). Surface coatings must contain ≤90mg/kg total lead. Recall required if already on market.");
      if (f2) issues.push("FAIL: Phthalate content detected in children's toy or childcare article. CCPSA / Phthalates Regulations SOR/2016-188 prohibit DEHP, DBP, BBP above 1000mg/kg. Product must be recalled.");
      if (f3) issues.push("FAIL: Small parts present in toy intended for children under 3 years. CCPSA / Toys Regulations SOR/2011-17 s.16 — any detachable part that fits entirely in a small parts test cylinder is prohibited.");
      if (f4) issues.push("FAIL: No bilingual (EN/FR) required safety warning. CCPSA s.11 — safety warnings must appear in both official languages on product and packaging.");
      if (f5) issues.push("FAIL: Hazardous product regulated under CCPSA Schedule 2 — additional licensing or restricted sale obligations apply. Contact Health Canada before sale.");
      if (f6) flags.push("FLAG: Manufacturer/importer address not on packaging. CCPSA s.11 requires the name and address of the manufacturer, importer, or advertiser to appear on the product.");
      if (category === "children" && !f7) flags.push("FLAG: Ensure age grading is displayed for children's products. Toys Regulations SOR/2011-17 s.37 — age grading is required based on the intended age of the user.");

      const result: Result = issues.length > 0 ? "fail" : flags.length > 0 ? "flag" : "pass";
      const title = result === "fail"
        ? `FAIL — ${issues.length} CCPSA violation(s) detected — recall/stop-sale may be required`
        : result === "flag"
        ? `FLAG — ${flags.length} labelling gap(s) to address`
        : "PASS — No CCPSA violations detected for this product";

      const statute = "Canada Consumer Product Safety Act SC 2010 c.21 (CCPSA) · Toys Regulations SOR/2011-17 · Phthalates Regulations SOR/2016-188 · Surface Coating Materials Regulations SOR/2016-193";
      const action = result === "pass"
        ? `Product "${product || category}" passes current CCPSA screening. Maintain safety test reports for 6 years (CCPSA s.13). Subscribe to Health Canada recall alerts and re-evaluate with each design change.`
        : (issues.concat(flags)).map(i => "• " + i).join("<br>");

      const entry = { id: uid(), module: "CCPSA", ruleId: "FR-CA-A01", input: `${product || "—"} · ${category}`, result: result.toUpperCase(), statute: "CCPSA SC 2010 c.21", timestamp: ts() };
      logCheck(entry);

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Category", val: category },
        { label: "Issues", val: issues.length },
        { label: "Flags", val: flags.length },
      ]});
      setLoading(false);
    }, 600);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <ShieldCheck size={20} />
        <span>CCPSA — Product Safety</span>
      </div>
      <p className="page-desc">Canada Consumer Product Safety Act screening for physical products sold or imported into Canada. Checks chemical restrictions, labelling requirements, and children's product rules.</p>

      <div className="form-grid">
        <label className="form-label">
          Product Name / SKU
          <input className="form-input" value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Wooden toy set, electric kettle" data-testid="ccpsa-product" />
        </label>
        <label className="form-label">
          Product Category
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} data-testid="ccpsa-category">
            <option value="general">General consumer product</option>
            <option value="children">Children's toy / childcare article</option>
            <option value="electrical">Electrical / electronic</option>
            <option value="cosmetic">Cosmetic / personal care</option>
            <option value="food_contact">Food contact material</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 12 }}>SAFETY FLAGS — check all that apply:</div>
        <div className="checks-grid">
          {[
            [f1, setF1, "Contains lead or lead compounds in surface coating"],
            [f2, setF2, "Contains phthalates (in children's product or toy)"],
            [f3, setF3, "Contains small parts / detachable components (children's product)"],
            [f4, setF4, "Safety warning is English-only (not bilingual)"],
            [f5, setF5, "Product is a Schedule 2 hazardous product"],
            [f6, setF6, "Manufacturer/importer address not on packaging"],
            [f7, setF7, "Age-grading label is displayed (children's products)"],
          ].map(([val, setter, label], i) => (
            <label key={i} className="check-row">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as any)(e.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading} data-testid="ccpsa-run">
        {loading ? <Loader2 size={15} className="spin" /> : <ShieldCheck size={15} />}
        Run CCPSA Check
      </button>

      {res && <ResultCard {...res} />}
    </div>
  );
}
