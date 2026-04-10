import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { useAudit, uid, ts } from "../context/AuditContext";

export default function DigitalPlatform() {
  const { logCheck } = useAudit();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const [platformType, setPlatformType] = useState("marketplace");
  const [sellers, setSellers] = useState("50");
  const [revenue, setRevenue] = useState("500000");
  const [collectsSIN, setCollectsSIN] = useState("no");
  const [filesT4A, setFilesT4A] = useState("no");
  const [hasContract, setHasContract] = useState("no");
  const [collects1099, setCollects1099] = useState("no");

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const sellerCount = parseInt(sellers) || 0;
      const rev = parseFloat(revenue) || 0;
      const issues: string[] = [];
      let result: "pass" | "fail" | "flag" = "pass";

      const isReportingPlatform = ["marketplace", "gig", "rental", "ecommerce"].includes(platformType);
      const thresholdMet = sellerCount >= 1 || rev >= 30000;

      if (isReportingPlatform) {
        if (filesT4A === "no") issues.push("Not filing T4A slips for seller income — DAC-7 / CRA platform economy rules require annual T4A filing for all seller payments over $500");
        if (collectsSIN === "no") issues.push("Not collecting SIN / Business Numbers from sellers — required to file T4A information returns with CRA");
        if (hasContract === "no") issues.push("No seller agreement requiring tax information disclosure — exposes platform to CRA information penalties");
        if (collects1099 === "no" && thresholdMet) issues.push("No data collection for seller income reporting — CRA expects platforms to report cumulative annual payments");
      }

      if (issues.length >= 2) result = "fail";
      else if (issues.length >= 1) result = "flag";

      const entry = {
        id: uid(), module: "Digital Platform Reporting", ruleId: "DAC7-CRA-C01",
        input: `${platformType} · ${sellerCount} sellers · $${rev.toLocaleString()} revenue`,
        result: result.toUpperCase(), statute: "CRA DAC-7 · ITA s.221(1) · T4A reporting",
        timestamp: ts(),
      };
      logCheck(entry);

      const title = result === "pass"
        ? "PASS — Digital platform reporting obligations appear met"
        : result === "fail"
        ? `FAIL — ${issues.length} CRA digital platform reporting violations — T4A non-filing risk`
        : `FLAG — ${issues.length} platform economy reporting gap(s) detected`;

      const statute = "CRA Digital Economy Platform Reporting (DAC-7 / OECD Model Rules) — Effective January 1, 2024. Digital platforms (marketplaces, gig apps, rental platforms, e-commerce) must collect seller tax info (SIN/BN) and file T4A slips for all seller payments. Penalties up to $100 per slip per day for late filing, plus $2,500 for failure to obtain SIN.";

      const action = issues.length === 0
        ? "Your platform appears compliant with CRA digital economy reporting. File T4A slips by the last day of February each year. Keep seller SIN/BN records for 6 years."
        : `CRA digital platform gaps:\n${issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}\n\nImmediate action: Update seller onboarding to collect SIN/BN. File T4A slips by February 28 each year via CRA My Business Account.`;

      setRes({ result, title, statute, action, meta: [
        { label: "Check ID", val: entry.id },
        { label: "Platform type", val: platformType },
        { label: "Sellers", val: sellerCount },
        { label: "Annual revenue", val: `$${rev.toLocaleString()}` },
      ]});
      setLoading(false);
    }, 700);
  };

  const sel = "w-full px-3 py-2 rounded-lg border text-[12px] appearance-none cursor-pointer focus:outline-none";
  const selStyle = { background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text1)" };
  const lbl = "block text-[11px] font-medium mb-1.5 uppercase tracking-widest";
  const lblStyle = { color: "var(--text3)", fontFamily: "var(--mono)" };

  return (
    <div className="page-content">
      <div style={{ background: "rgba(245,166,35,0.10)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, letterSpacing: "2px", color: "var(--amber)", background: "rgba(245,166,35,0.2)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>CRA DAC-7 · IN FORCE SINCE JAN 1, 2024 · PLATFORM ECONOMY</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)", marginBottom: 4 }}>Digital Platform Reporting — New CRA rules require platforms to report all seller income</div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Since January 2024, digital platforms (Shopify stores, marketplaces, gig apps, rental platforms like Airbnb-style businesses) must collect seller SIN/Business Numbers and file <strong>T4A information returns</strong> with CRA for all sellers. Missing this means late-filing penalties of $100/slip/day.
        </div>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Digital Platform Reporting Check</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={lblStyle} className={lbl}>Platform type</label>
            <select value={platformType} onChange={e => setPlatformType(e.target.value)} style={selStyle} className={sel}>
              <option value="marketplace">Online marketplace (products)</option>
              <option value="gig">Gig / service platform</option>
              <option value="rental">Rental / accommodation platform</option>
              <option value="ecommerce">E-commerce (own products)</option>
              <option value="saas">SaaS / software only</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Number of active sellers</label>
            <input type="number" min="0" value={sellers} onChange={e => setSellers(e.target.value)}
              style={{ ...selStyle, padding: "8px 12px", borderRadius: 8, fontSize: 12, width: "100%", outline: "none" }} />
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Annual seller payment volume ($)</label>
            <input type="number" min="0" value={revenue} onChange={e => setRevenue(e.target.value)}
              style={{ ...selStyle, padding: "8px 12px", borderRadius: 8, fontSize: 12, width: "100%", outline: "none" }} />
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Collecting SIN / Business Numbers?</label>
            <select value={collectsSIN} onChange={e => setCollectsSIN(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — mandatory field at onboarding</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Filing T4A slips annually?</label>
            <select value={filesT4A} onChange={e => setFilesT4A(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No — not aware of requirement</option>
              <option value="yes">Yes — filed by Feb 28 each year</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Seller agreement requires tax info?</label>
            <select value={hasContract} onChange={e => setHasContract(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No</option><option value="yes">Yes — in terms of service</option>
            </select>
          </div>
          <div>
            <label style={lblStyle} className={lbl}>Collecting cumulative income data?</label>
            <select value={collects1099} onChange={e => setCollects1099(e.target.value)} style={selStyle} className={sel}>
              <option value="no">No — not tracked per seller</option>
              <option value="yes">Yes — tracked per seller per year</option>
            </select>
          </div>
        </div>
        <button onClick={run} disabled={loading}
          className="mt-5 w-full py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#c8f135", color: "#09090a" }}>
          {loading ? "Checking platform obligations…" : "Run Digital Platform Check →"}
        </button>
      </div>

      {res && <ResultCard result={res.result} title={res.title} statute={res.statute} action={res.action} meta={res.meta} />}

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Who must report?</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Online Marketplaces", "eBay-style, Etsy-style, Amazon Seller", "IN SCOPE"],
            ["Gig Platforms", "TaskRabbit, Upwork, Rover-style apps", "IN SCOPE"],
            ["Rental Platforms", "Airbnb-style, storage rental", "IN SCOPE"],
            ["Freelance Platforms", "Fiverr, 99designs style", "IN SCOPE"],
            ["Pure SaaS", "Software subscriptions — no 3rd party sellers", "OUT OF SCOPE"],
            ["Retail / Own Products", "D2C e-commerce, own inventory only", "OUT OF SCOPE"],
          ].map(([type, ex, scope], i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text1)", marginBottom: 2 }}>{type}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{ex}</div>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: scope === "IN SCOPE" ? "var(--red)" : "var(--green)", background: scope === "IN SCOPE" ? "rgba(240,68,56,0.15)" : "rgba(18,183,106,0.15)", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>{scope}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
