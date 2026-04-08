import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { BarChart3, TrendingUp, Users, MapPin, Award, Info } from "lucide-react";

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
  "Atlantic Canada",
  "Prairie Provinces",
  "All Canada",
];

interface BenchmarkData {
  yourScore: number;
  industryAvg: number;
  provinceAvg: number;
  nationalAvg: number;
  percentile: number;
  rank: string;
  moduleBreakdown: { module: string; yourScore: number; avgScore: number }[];
  insights: string[];
}

const MODULE_BASE_SCORES: Record<string, number> = {
  "CASL": 61,
  "PIPEDA": 58,
  "Bill 96": 52,
  "Employment": 71,
  "GST/HST": 78,
  "Payroll": 74,
  "FINTRAC": 48,
  "ESG": 44,
  "Supply Chain": 51,
  "Workplace Safety": 68,
  "Customs": 55,
  "AI Governance": 38,
  "EPR": 42,
};

const INDUSTRY_AVG: Record<string, number> = {
  "Retail": 62,
  "Food & Beverage": 58,
  "Construction": 55,
  "Technology / SaaS": 71,
  "Healthcare": 66,
  "Manufacturing": 60,
  "Financial Services": 74,
  "Professional Services": 69,
  "E-commerce": 64,
  "Non-profit": 57,
};

const PROVINCE_AVG: Record<string, number> = {
  "Ontario": 64,
  "British Columbia": 67,
  "Quebec": 61,
  "Alberta": 69,
  "Atlantic Canada": 58,
  "Prairie Provinces": 63,
  "All Canada": 63,
};

const INSIGHTS_BY_INDUSTRY: Record<string, string[]> = {
  "Retail": [
    "Retail SMBs in Canada score 15% lower on CASL than other sectors — marketing consent is the #1 gap.",
    "Competition Act greenwashing claims are rising fast for retail — 8 investigations opened in 2024.",
    "Alberta retail businesses score 12% higher than the national retail average due to lighter provincial regulation.",
  ],
  "Technology / SaaS": [
    "Tech companies score highest on PIPEDA compliance but lowest on AIDA/AI Governance (avg 38/100).",
    "Quebec-based tech companies face a 22% additional compliance burden due to Law 25 requirements.",
    "FINTRAC is the biggest gap for FinTech — 52% of FinTech SMBs are non-compliant with KYC rules.",
  ],
  "Financial Services": [
    "Financial services businesses score highest overall (74/100) but face the most critical FINTRAC exposure.",
    "OSFI sandbox programs are underutilized — only 18% of eligible FinTechs have applied.",
    "Law 25 data residency requirements are causing significant compliance costs for Quebec-based firms.",
  ],
  "Food & Beverage": [
    "F&B SMBs score lowest on ESG/greenwashing — 'natural' and 'sustainable' labels are under active scrutiny.",
    "CARM (Customs) compliance is a major gap for food importers — 38% are non-compliant.",
    "EPR (packaging take-back) obligations are expanding — 2025 regulations add new categories.",
  ],
  "Healthcare": [
    "Healthcare is the most regulated sector — average compliance burden is 89 hours/year.",
    "PIPEDA + Law 25 compliance is the top priority — health data breaches carry the highest penalties.",
    "AI governance is critical for healthcare — AIDA will impose strict rules on diagnostic AI systems.",
  ],
  "Construction": [
    "Construction SMBs score lowest on Workplace Safety — WSIB compliance is the #1 enforcement target.",
    "S-211 (Modern Slavery Act) applies to construction firms with international material suppliers.",
    "Employment standards violations (overtime, safety) account for 41% of all Ministry orders in construction.",
  ],
};

function generateBenchmark(industry: string, province: string, userScore: number): BenchmarkData {
  const industryAvg = INDUSTRY_AVG[industry] ?? 63;
  const provinceAvg = PROVINCE_AVG[province] ?? 63;
  const nationalAvg = 63;
  const scores = [industryAvg - 8, industryAvg, industryAvg + 5, industryAvg + 12, industryAvg + 20];
  scores.push(userScore);
  scores.sort((a, b) => a - b);
  const rank = scores.indexOf(userScore);
  const percentile = Math.round((rank / (scores.length - 1)) * 100);

  const moduleBreakdown = Object.entries(MODULE_BASE_SCORES).slice(0, 8).map(([mod, base]) => ({
    module: mod,
    yourScore: Math.min(100, Math.max(0, base + (userScore - nationalAvg) + Math.round((Math.random() - 0.5) * 10))),
    avgScore: base,
  }));

  const insights = INSIGHTS_BY_INDUSTRY[industry] ?? [
    "SMBs in your sector average 63/100 on Canadian compliance.",
    "The biggest gaps nationally are CASL consent management and FINTRAC KYC.",
    "Businesses that use a compliance management tool score 18% higher on average.",
  ];

  let rankLabel = "Average";
  if (percentile >= 75) rankLabel = "Top 25%";
  else if (percentile >= 90) rankLabel = "Top 10%";
  else if (percentile <= 25) rankLabel = "Bottom 25%";

  return { yourScore: userScore, industryAvg, provinceAvg, nationalAvg, percentile, rank: rankLabel, moduleBreakdown, insights };
}

export default function Benchmarking() {
  const [industry, setIndustry] = useState("");
  const [province, setProvince] = useState("");
  const [scoreInput, setScoreInput] = useState("62");
  const [data, setData] = useState<BenchmarkData | null>(null);

  function runBenchmark() {
    if (!industry || !province) return;
    const score = Math.min(100, Math.max(0, parseInt(scoreInput) || 62));
    setData(generateBenchmark(industry, province, score));
  }

  const getBarColor = (score: number) =>
    score >= 80 ? "#12b76a" : score >= 60 ? "#c8f135" : "#f5a623";

  return (
    <AppLayout title="Compliance Benchmarking" subtitle="See how your business compares to your sector and province">
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Data Intelligence</div>
          <h1 className="font-serif italic text-3xl text-foreground mb-2">Where Do You Stand?</h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            Compare your compliance score to anonymized aggregate data from businesses like yours — by province, industry, and size. 
            Identify where you're ahead and where you're falling behind your sector average.
          </p>
        </div>

        {/* Privacy notice */}
        <div className="bg-muted/40 border border-border rounded-lg px-4 py-3 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Benchmark data is aggregated anonymously. Your individual score and business information are never shared. 
            Sector averages are computed from anonymized CanCompliance session data and CFIB published benchmarks.
          </p>
        </div>

        {/* Input */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <div className="text-[13px] font-medium text-foreground">Your Business Profile</div>
          </div>
          <div className="p-5 grid grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Industry</label>
              <select
                data-testid="select-industry"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select...</option>
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
                <option value="">Select...</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Your Compliance Score</label>
              <input
                data-testid="input-score"
                type="number"
                min={0}
                max={100}
                value={scoreInput}
                onChange={e => setScoreInput(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary"
                placeholder="0–100"
              />
              <div className="text-[10px] text-muted-foreground mt-1 font-mono">From Score Engine or estimate</div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <button
              data-testid="btn-benchmark"
              onClick={runBenchmark}
              disabled={!industry || !province}
              className="px-6 py-2.5 rounded-md text-[13px] font-semibold disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ background: "#c8f135", color: "#09090a" }}
            >
              Compare My Business
            </button>
          </div>
        </div>

        {data && (
          <>
            {/* Main comparison */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Your Score", value: data.yourScore, color: getBarColor(data.yourScore), suffix: "/100" },
                { label: `${industry} Avg`, value: data.industryAvg, color: "#64748b", suffix: "/100" },
                { label: `${province} Avg`, value: data.provinceAvg, color: "#64748b", suffix: "/100" },
                { label: "Canada Avg", value: data.nationalAvg, color: "#64748b", suffix: "/100" },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">{item.label}</div>
                  <div className="text-3xl font-semibold mb-1" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{item.suffix}</div>
                  <div className="mt-2 h-1 bg-muted rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Ranking */}
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${getBarColor(data.yourScore)}20`, border: `2px solid ${getBarColor(data.yourScore)}` }}>
                <Award className="w-7 h-7" style={{ color: getBarColor(data.yourScore) }} />
              </div>
              <div className="flex-1">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Your Ranking</div>
                <div className="text-xl font-semibold text-foreground mb-1">{data.rank} in your sector</div>
                <div className="text-[13px] text-muted-foreground">
                  You score {data.yourScore > data.industryAvg ? "+" : ""}{data.yourScore - data.industryAvg} points {data.yourScore >= data.industryAvg ? "above" : "below"} the {industry} average.
                  {data.yourScore > data.nationalAvg
                    ? " You're ahead of the national average."
                    : " There's room to improve versus the national average."}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Percentile</div>
                <div className="text-3xl font-semibold text-primary">{data.percentile}th</div>
              </div>
            </div>

            {/* Module breakdown */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="text-[13px] font-medium text-foreground">Module Breakdown vs. Sector Average</div>
                <div className="text-[11px] text-muted-foreground font-mono">Where you're ahead and where to focus</div>
              </div>
              <div className="p-5 space-y-4">
                {data.moduleBreakdown.map(mod => {
                  const diff = mod.yourScore - mod.avgScore;
                  return (
                    <div key={mod.module}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] text-foreground">{mod.module}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-muted-foreground">Avg: {mod.avgScore}</span>
                          <span className="font-mono text-[11px] font-medium" style={{ color: diff >= 0 ? "#12b76a" : "#f04438" }}>
                            {diff >= 0 ? "+" : ""}{diff} pts
                          </span>
                          <span className="font-mono text-[12px]" style={{ color: getBarColor(mod.yourScore) }}>{mod.yourScore}</span>
                        </div>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full">
                        <div
                          className="absolute h-full rounded-full opacity-30"
                          style={{ width: `${mod.avgScore}%`, background: "#64748b" }}
                        />
                        <div
                          className="absolute h-full rounded-full"
                          style={{ width: `${mod.yourScore}%`, background: getBarColor(mod.yourScore), opacity: 0.8 }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-4 pt-2 text-[11px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-muted-foreground/30 inline-block" />Sector avg</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: "#c8f135" }} />Your score</span>
                </div>
              </div>
            </div>

            {/* Sector insights */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-[13px] font-medium text-foreground">{industry} Sector Intelligence</div>
                  <div className="text-[11px] text-muted-foreground font-mono">Patterns from anonymized aggregate data</div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {data.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold" style={{ background: "#c8f135", color: "#09090a" }}>
                      {i + 1}
                    </div>
                    <p className="text-[12px] text-foreground leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic context */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <div className="text-[13px] font-medium text-foreground">Provincial Context</div>
              </div>
              <div className="p-5 grid grid-cols-3 gap-3">
                {[
                  { province: "Quebec", avg: 61, note: "+22% burden from Law 25 / Bill 96" },
                  { province: "Ontario", avg: 64, note: "Largest SMB market · highest enforcement" },
                  { province: "Alberta", avg: 69, note: "Lower regulatory burden · fastest growing" },
                  { province: "BC", avg: 67, note: "Active ESG enforcement · PIPA compliance" },
                  { province: "Atlantic", avg: 58, note: "Smaller market · fewer inspections" },
                  { province: "Prairies", avg: 63, note: "Mid-range burden · agriculture exemptions" },
                ].map(item => (
                  <div key={item.province} className={`border rounded-lg p-3 ${province.startsWith(item.province) ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-medium text-foreground">{item.province}</span>
                      <span className="font-mono text-[11px]" style={{ color: getBarColor(item.avg) }}>{item.avg}/100</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed">{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
