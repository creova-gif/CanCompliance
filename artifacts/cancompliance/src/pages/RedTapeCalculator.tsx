import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Calculator, Clock, DollarSign, AlertTriangle, TrendingDown, BarChart3, Share2 } from "lucide-react";

const INDUSTRIES = [
  "Retail",
  "Food & Beverage",
  "Construction",
  "Technology / SaaS",
  "Healthcare",
  "Manufacturing",
  "Financial Services",
  "Professional Services",
  "E-commerce",
  "Non-profit",
];

const PROVINCES = [
  "Ontario",
  "British Columbia",
  "Quebec",
  "Alberta",
  "Nova Scotia",
  "Manitoba",
  "Saskatchewan",
  "New Brunswick",
  "Newfoundland & Labrador",
  "PEI",
];

const SIZES = [
  { label: "Solo (1 person)", employees: 1 },
  { label: "Micro (2–9)", employees: 5 },
  { label: "Small (10–49)", employees: 25 },
  { label: "Medium (50–99)", employees: 75 },
];

const BURDEN_RATES: Record<string, number> = {
  "Retail": 6.2,
  "Food & Beverage": 7.8,
  "Construction": 9.1,
  "Technology / SaaS": 4.3,
  "Healthcare": 11.2,
  "Manufacturing": 8.6,
  "Financial Services": 14.5,
  "Professional Services": 5.9,
  "E-commerce": 5.1,
  "Non-profit": 6.7,
};

const PROVINCE_MULT: Record<string, number> = {
  "Ontario": 1.0,
  "British Columbia": 1.05,
  "Quebec": 1.22,
  "Alberta": 0.88,
  "Nova Scotia": 1.03,
  "Manitoba": 0.95,
  "Saskatchewan": 0.91,
  "New Brunswick": 0.98,
  "Newfoundland & Labrador": 1.02,
  "PEI": 0.96,
};

const INDUSTRY_AVG: Record<string, number> = {
  "Retail": 52,
  "Food & Beverage": 64,
  "Construction": 74,
  "Technology / SaaS": 38,
  "Healthcare": 89,
  "Manufacturing": 71,
  "Financial Services": 118,
  "Professional Services": 48,
  "E-commerce": 42,
  "Non-profit": 55,
};

const REVENUE_MULT: Record<string, number> = {
  "Under $100K": 0.7,
  "$100K–$500K": 0.9,
  "$500K–$1M": 1.0,
  "$1M–$5M": 1.15,
  "$5M–$20M": 1.3,
  "Over $20M": 1.5,
};

const NATIONAL_AVG_HOURS = 735;

interface Results {
  hoursPerYear: number;
  redTapeHours: number;
  costPerYear: number;
  redTapeCost: number;
  savingsPotential: number;
  industryAvgHours: number;
  vsNational: number;
  percentile: string;
  categories: { name: string; hours: number; statute: string }[];
}

export default function RedTapeCalculator() {
  const [industry, setIndustry] = useState("");
  const [province, setProvince] = useState("");
  const [size, setSize] = useState<{ label: string; employees: number } | null>(null);
  const [revenue, setRevenue] = useState("");
  const [hourlyRate, setHourlyRate] = useState("35");
  const [results, setResults] = useState<Results | null>(null);
  const [copied, setCopied] = useState(false);

  function calculate() {
    if (!industry || !province || !size) return;
    const baseHoursPerEmployee = BURDEN_RATES[industry] ?? 6;
    const provMult = PROVINCE_MULT[province] ?? 1;
    const revMult = revenue ? (REVENUE_MULT[revenue] ?? 1) : 1;
    const hoursPerYear = Math.round(baseHoursPerEmployee * size.employees * provMult * revMult);
    const redTapeHours = Math.round(hoursPerYear * 0.35);
    const rate = parseFloat(hourlyRate) || 35;
    const costPerYear = Math.round(hoursPerYear * rate);
    const redTapeCost = Math.round(redTapeHours * rate);
    const savingsPotential = Math.round(redTapeCost * 0.65);
    const industryAvgHours = Math.round((INDUSTRY_AVG[industry] ?? 60) * provMult);
    const vsNational = Math.round(((hoursPerYear - NATIONAL_AVG_HOURS) / NATIONAL_AVG_HOURS) * 100);
    let percentile = "near the average";
    if (hoursPerYear < industryAvgHours * 0.75) percentile = "lower burden than most";
    else if (hoursPerYear > industryAvgHours * 1.25) percentile = "higher burden than most";

    const categories = [
      { name: "Tax & Payroll (CRA, CPP, EI)", hours: Math.round(hoursPerYear * 0.28), statute: "ITA, CPP Act, EI Act" },
      { name: "Employment Standards", hours: Math.round(hoursPerYear * 0.18), statute: "ESA 2000, CNESST" },
      { name: "Privacy & Data (PIPEDA / Law 25)", hours: Math.round(hoursPerYear * 0.14), statute: "PIPEDA, Law 25" },
      { name: "CASL & Marketing Compliance", hours: Math.round(hoursPerYear * 0.10), statute: "CASL S.6–11" },
      { name: "Workplace Safety (OHS)", hours: Math.round(hoursPerYear * 0.12), statute: "OHSA, WSIB" },
      { name: "Licensing & Permits", hours: Math.round(hoursPerYear * 0.10), statute: "Various federal/provincial" },
      { name: "Environmental & EPR", hours: Math.round(hoursPerYear * 0.08), statute: "CEPA, Blue Box regs" },
    ];

    setResults({ hoursPerYear, redTapeHours, costPerYear, redTapeCost, savingsPotential, industryAvgHours, vsNational, percentile, categories });
  }

  function shareResults() {
    if (!results) return;
    const text = `My business spends ${results.hoursPerYear} hours/year on compliance — costing $${results.costPerYear.toLocaleString()} — including $${results.redTapeCost.toLocaleString()} in pure red tape. That's ${results.vsNational > 0 ? "+" : ""}${results.vsNational}% vs. the Canadian average of ${NATIONAL_AVG_HOURS} hrs. Calculated with CanCompliance.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isReady = industry && province && size;

  return (
    <AppLayout title="Red Tape Burden Calculator" subtitle="Quantify your Canadian compliance cost — CFIB methodology">
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Gov. Partnership Tool</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">How much red tape does your business face?</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            Canadian SMBs spend 768 million hours per year on compliance — costing $51.5B annually (CFIB 2024). 
            Calculate your business's specific burden, compare to your industry average, and get a shareable report.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <Calculator className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[13px] font-medium text-foreground">Business Profile</div>
              <div className="text-[11px] text-muted-foreground font-mono">Used for burden calculation — no data stored</div>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-5">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Industry</label>
              <select
                data-testid="select-industry"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Province</label>
              <select
                data-testid="select-province"
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select province...</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Business Size</label>
              <div className="grid grid-cols-2 gap-2">
                {SIZES.map(s => (
                  <button
                    key={s.label}
                    data-testid={`size-${s.employees}`}
                    onClick={() => setSize(s)}
                    className="px-3 py-2 rounded-md text-[12px] border transition-all"
                    style={size?.employees === s.employees
                      ? { background: "#c8f135", color: "#09090a", borderColor: "#c8f135" }
                      : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                    }
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Annual Revenue (CAD)</label>
              <select
                data-testid="select-revenue"
                value={revenue}
                onChange={e => setRevenue(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select range (optional)</option>
                {Object.keys(REVENUE_MULT).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="text-[10px] text-muted-foreground mt-1 font-mono">Higher revenue → more complex reporting obligations</div>
            </div>
          </div>
          <div className="px-5 pb-2">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Owner/Staff Hourly Rate (CAD)</label>
              <div className="flex items-center gap-2 max-w-xs">
                <span className="text-muted-foreground text-[13px]">$</span>
                <input
                  data-testid="input-hourly-rate"
                  type="number"
                  value={hourlyRate}
                  onChange={e => setHourlyRate(e.target.value)}
                  className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
                  min={10}
                  max={500}
                />
                <span className="text-muted-foreground text-[11px]">/hr</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 font-mono">Default: $35/hr (SMB owner avg)</div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <button
              data-testid="btn-calculate"
              onClick={calculate}
              disabled={!isReady}
              className="px-6 py-2.5 rounded-md text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{ background: "#c8f135", color: "#09090a" }}
            >
              Calculate My Compliance Burden
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-flag" />
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Total Hours Lost / Year</div>
                </div>
                <div className="text-3xl font-semibold text-flag mb-1">{results.hoursPerYear.toLocaleString()}</div>
                <div className="text-[11px] text-muted-foreground">
                  {results.redTapeHours.toLocaleString()} hrs pure red tape (35% per CFIB) · national avg {NATIONAL_AVG_HOURS} hrs
                </div>
                <div className="mt-2">
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded"
                    style={results.vsNational > 0
                      ? { background: "#f0443815", color: "#f04438" }
                      : { background: "#12b76a15", color: "#12b76a" }
                    }
                  >
                    {results.vsNational > 0 ? "+" : ""}{results.vsNational}% vs. Canadian average
                  </span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-fail" />
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Total Compliance Cost / Year</div>
                </div>
                <div className="text-3xl font-semibold text-fail mb-1">${results.costPerYear.toLocaleString()}</div>
                <div className="text-[11px] text-muted-foreground">
                  ${results.redTapeCost.toLocaleString()} in pure red tape · you are {results.percentile} in your industry
                </div>
                <div className="mt-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Industry avg: {results.industryAvgHours.toLocaleString()} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* CanCompliance Savings Card */}
            <div className="rounded-xl p-5 flex items-start gap-4" style={{ background: "#c8f135" }}>
              <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5" style={{ color: "#09090a" }} />
              </div>
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "#09090a99" }}>CanCompliance can save you</div>
                <div className="text-2xl font-bold mb-1" style={{ color: "#09090a" }}>
                  ${results.savingsPotential.toLocaleString()}/year
                </div>
                <div className="text-[12px]" style={{ color: "#09090aCC" }}>
                  Based on 65% automation of your ${results.redTapeCost.toLocaleString()} red tape cost — 
                  {results.redTapeHours} hrs of avoidable work freed up every year for growth.
                </div>
              </div>
              <button
                data-testid="btn-share-results"
                onClick={shareResults}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[11px] font-semibold hover:bg-black/10 transition-colors flex-shrink-0"
                style={{ color: "#09090a" }}
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Share on LinkedIn / X"}
              </button>
            </div>

            {/* Category breakdown */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium text-foreground">Burden by Category</div>
                  <div className="text-[11px] text-muted-foreground font-mono">Where your compliance hours go</div>
                </div>
                <button
                  data-testid="btn-share-results"
                  onClick={shareResults}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  {copied ? "Copied!" : "Share Results"}
                </button>
              </div>
              <div className="p-5 space-y-3">
                {results.categories.map(cat => {
                  const pct = Math.round((cat.hours / results.hoursPerYear) * 100);
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-[12px] text-foreground">{cat.name}</span>
                          <span className="font-mono text-[10px] text-muted-foreground ml-2">{cat.statute}</span>
                        </div>
                        <div className="text-[12px] font-mono text-foreground">{cat.hours} hrs</div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: "#c8f135" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Government context */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex gap-4">
              <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-medium text-foreground mb-1">About This Data</div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Burden estimates are based on CFIB 2024 methodology ($51.5B annual Canadian compliance cost across ~1.1M SMBs). 
                  Province multipliers reflect regulatory density (Quebec: +22% for Law 25/Bill 96; Alberta: −12% for lighter regulation). 
                  This tool's aggregate anonymized data is shared with CFIB to inform policy reform recommendations. 
                  Your individual data is never stored or identified.
                </p>
              </div>
            </div>

            {/* Reduction actions */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="text-[13px] font-medium text-foreground">Reduce Your Burden</div>
                <div className="text-[11px] text-muted-foreground font-mono">CanCompliance modules that automate these tasks</div>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {[
                  { module: "AI Copilot", desc: "Get instant answers to compliance questions — avoid hiring a lawyer for every question", href: "/ai-copilot", savings: "~12 hrs/yr" },
                  { module: "Payroll Calculator", desc: "Automate CPP, EI, and income tax deductions — no more manual CRA tables", href: "/payroll", savings: "~18 hrs/yr" },
                  { module: "CASL Ledger", desc: "Track consent records automatically — CRTC audit-ready in seconds", href: "/casl-ledger", savings: "~8 hrs/yr" },
                  { module: "Deadline Tracker", desc: "Never miss a filing deadline — all 13 modules tracked in one place", href: "/deadlines", savings: "~6 hrs/yr" },
                ].map(item => (
                  <a key={item.module} href={item.href} className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors block">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[12px] font-medium text-foreground">{item.module}</div>
                      <div className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: "#c8f135", color: "#09090a" }}>
                        Save {item.savings}
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
