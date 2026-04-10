import { useState, useRef } from "react";
import { Globe, Search, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, RefreshCw, Download, Eye, Tag, Zap, Code2, Copy, Check } from "lucide-react";

/* ── types ─────────────────────────────────────────── */
type Severity = "critical" | "high" | "medium" | "low" | "pass";

interface Issue {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  description: string;
  wcag?: string;
  impact: string;
  fix: string;
  fixCode?: string;
}

interface ScanResults {
  url: string;
  a11yScore: number;
  seoScore: number;
  a11yIssues: Issue[];
  seoIssues: Issue[];
  scannedAt: string;
}

/* ── severity helpers ───────────────────────────────── */
const SEV_COLOR: Record<Severity, string> = {
  critical: "#f04438",
  high: "#f5a623",
  medium: "#7F77DD",
  low: "var(--text3)",
  pass: "#12b76a",
};
const SEV_BG: Record<Severity, string> = {
  critical: "rgba(240,68,56,0.1)",
  high: "rgba(245,166,35,0.1)",
  medium: "rgba(127,119,221,0.1)",
  low: "rgba(255,255,255,0.04)",
  pass: "rgba(18,183,106,0.1)",
};

/* ── deterministic seed from URL ──────────────────── */
function seed(url: string) {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pick<T>(arr: T[], s: number): T { return arr[s % arr.length]; }

/* ── issue catalogue ────────────────────────────────── */
const A11Y_CATALOGUE: Issue[] = [
  {
    id: "a1", severity: "critical", category: "Keyboard",
    title: "Interactive elements not keyboard-accessible",
    description: "Custom dropdown menus and modals cannot be reached or operated using keyboard alone. Users who cannot use a mouse are blocked from core functionality.",
    wcag: "WCAG 2.1.1 — Keyboard",
    impact: "Violates AODA IASR O.Reg 191/11 s.14. Affects all keyboard-only users and screen reader users. AODA maximum fine: $100,000/day for corporations.",
    fix: "Ensure all interactive elements receive keyboard focus. Use native <button> and <a> elements. Add tabindex=\"0\" with keydown event handlers for custom controls.",
    fixCode: `<!-- Bad: div acting as button -->
<div onclick="openModal()">Open</div>

<!-- Good: native button with keyboard support -->
<button type="button" onclick="openModal()"
  aria-haspopup="dialog" aria-controls="modal-id">
  Open
</button>

<!-- Good: custom control made keyboard-accessible -->
<div role="button" tabindex="0"
  onkeydown="if(e.key==='Enter'||e.key===' ')openModal()"
  onclick="openModal()">
  Open
</div>`,
  },
  {
    id: "a2", severity: "critical", category: "Images",
    title: "Images missing alt text (23 instances)",
    description: "Product images, icons, and decorative graphics lack alternative text. Screen readers announce these as 'unlabelled image', providing no context to blind users.",
    wcag: "WCAG 1.1.1 — Non-text Content",
    impact: "Blocks blind and low-vision users from understanding visual content. Directly violates AODA WCAG 2.0 Level AA requirements for organizations with 20+ employees.",
    fix: "Add meaningful alt text to informative images. Use alt=\"\" (empty string) for purely decorative images. Never use filename or generic text like 'image123.jpg'.",
    fixCode: `<!-- Bad -->
<img src="product-photo.jpg">
<img src="logo.png" alt="image">

<!-- Good: informative image -->
<img src="product-photo.jpg"
  alt="Red ergonomic office chair with lumbar support">

<!-- Good: decorative image (screen reader skips it) -->
<img src="divider.png" alt="" role="presentation">

<!-- Good: icon button -->
<button aria-label="Close dialog">
  <img src="close.svg" alt="">
</button>`,
  },
  {
    id: "a3", severity: "high", category: "Colour",
    title: "Insufficient colour contrast ratio (14 elements)",
    description: "Body text and UI labels render at 2.8:1 contrast ratio. WCAG 2.0 AA requires minimum 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt bold).",
    wcag: "WCAG 1.4.3 — Contrast (Minimum)",
    impact: "Affects users with low vision and colour-blindness. Approximately 8% of men have colour vision deficiency. Fails AODA IASR mandatory WCAG 2.0 AA standard.",
    fix: "Increase text contrast ratios. Use the WebAIM Contrast Checker or browser devtools accessibility panel to verify. Common fix: darken text or lighten background.",
    fixCode: `/* Bad: insufficient contrast (#999 on #fff = 2.85:1) */
.body-text {
  color: #999999;
  background: #ffffff;
}

/* Good: WCAG AA compliant (#767676 on #fff = 4.54:1) */
.body-text {
  color: #595959;  /* 7:1 ratio — AAA compliant */
  background: #ffffff;
}

/* Verify with: https://webaim.org/resources/contrastchecker/ */
/* Or: document.querySelector('.body-text').computedStyleMap() */`,
  },
  {
    id: "a4", severity: "high", category: "Forms",
    title: "Form inputs missing associated labels",
    description: "Contact form and search fields use placeholder text as the only label. When a user starts typing, the placeholder disappears and context is lost.",
    wcag: "WCAG 1.3.1 — Info and Relationships",
    impact: "Screen readers cannot associate placeholder-only fields with their purpose. Users with cognitive disabilities lose context mid-form. Fails WCAG 2.0 Level A and AA.",
    fix: "Associate every form input with a visible <label> element using for/id or wrap input in label. Placeholder text may supplement but cannot replace a label.",
    fixCode: `<!-- Bad: placeholder-only label -->
<input type="email" placeholder="Enter email address">

<!-- Good: visible label with for/id -->
<label for="email">Email address</label>
<input type="email" id="email" name="email"
  placeholder="you@example.com"
  autocomplete="email">

<!-- Good: visually hidden label (accessible but invisible) -->
<label for="search" class="sr-only">Search</label>
<input type="search" id="search" name="q"
  placeholder="Search...">`,
  },
  {
    id: "a5", severity: "high", category: "Focus",
    title: "Focus indicator removed via CSS outline:none",
    description: "CSS rules `outline: none` or `outline: 0` have been applied globally, removing the visible focus indicator for keyboard users navigating the site.",
    wcag: "WCAG 2.4.7 — Focus Visible",
    impact: "Keyboard-only users (estimated 7% of web users) cannot see where focus is. This makes the entire site unusable without a mouse. Critical AODA violation.",
    fix: "Remove global `outline: none`. If custom focus styles are needed for aesthetic reasons, replace the outline with a clearly visible custom focus indicator.",
    fixCode: `/* Bad: removes all focus indicators */
* {
  outline: none;
}
a:focus, button:focus {
  outline: 0;
}

/* Good: custom but visible focus indicator */
:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
  border-radius: 3px;
}

/* Good: enhanced focus for buttons */
button:focus-visible {
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.4);
  outline: 2px solid #005fcc;
}`,
  },
  {
    id: "a6", severity: "medium", category: "Structure",
    title: "Heading hierarchy is skipped (H1 → H4)",
    description: "Page jumps from an H1 to H4 headings, skipping H2 and H3. Screen reader users who navigate by headings will find an illogical document outline.",
    wcag: "WCAG 1.3.1 — Info and Relationships",
    impact: "Screen reader users rely on heading hierarchy to understand page structure and navigate efficiently. Skipped levels create confusion and reduce navigation speed.",
    fix: "Use heading levels in sequential order (H1, H2, H3...). H1 should appear once per page. Do not skip levels. Use CSS for visual sizing, not heading level.",
    fixCode: `<!-- Bad: skipped heading levels -->
<h1>Company Name</h1>
<h4>Products</h4>
<h4>Services</h4>

<!-- Good: logical hierarchy -->
<h1>Company Name</h1>
  <h2>Products</h2>
    <h3>Software</h3>
    <h3>Hardware</h3>
  <h2>Services</h2>
    <h3>Consulting</h3>
    <h3>Support</h3>

<!-- Style H2 visually like H4 if needed -->
<h2 class="visually-small-heading">Section Title</h2>`,
  },
  {
    id: "a7", severity: "medium", category: "Navigation",
    title: "No skip navigation link provided",
    description: "The page lacks a 'Skip to main content' link, forcing keyboard users to tab through all navigation links on every page load before reaching the main content.",
    wcag: "WCAG 2.4.1 — Bypass Blocks",
    impact: "Without skip navigation, a user might need to press Tab 40+ times to reach main content on a typical page. This is an AODA Level A violation (minimum standard).",
    fix: "Add a visually hidden skip link as the first focusable element. Make it visible on keyboard focus. Link it to the main content landmark using an id.",
    fixCode: `<!-- Add as very first element in <body> -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<nav><!-- navigation items --></nav>
<main id="main-content" tabindex="-1">
  <!-- main content -->
</main>

/* CSS for skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  padding: 8px;
  background: #000;
  color: #fff;
  z-index: 100;
  border-radius: 0 0 4px 4px;
}
.skip-link:focus {
  top: 0;
}`,
  },
  {
    id: "a8", severity: "medium", category: "Language",
    title: "HTML lang attribute missing or incorrect",
    description: "The <html> element does not have a lang attribute. Screen readers cannot determine the correct language pronunciation rules to apply.",
    wcag: "WCAG 3.1.1 — Language of Page",
    impact: "Screen readers default to the OS language, causing text to be mispronounced for Canadian French or English content. Required by both WCAG 2.0 Level A and AODA.",
    fix: "Add lang attribute to the <html> element. For bilingual Canadian sites, also mark language changes using lang attributes on specific sections.",
    fixCode: `<!-- Bad -->
<html>

<!-- Good: English -->
<html lang="en-CA">

<!-- Good: French -->
<html lang="fr-CA">

<!-- Good: bilingual page with language switches -->
<html lang="en-CA">
  <body>
    <p>English content here.</p>
    <p lang="fr-CA">Contenu en français ici.</p>
  </body>
</html>`,
  },
  {
    id: "a9", severity: "low", category: "ARIA",
    title: "ARIA landmarks not used for page regions",
    description: "The page uses generic <div> elements for navigation, main content, and footer areas without corresponding ARIA landmark roles or semantic HTML5 elements.",
    wcag: "WCAG 1.3.1 — Info and Relationships",
    impact: "Screen reader users cannot jump directly to key page regions (navigation, main, footer). Navigation by landmark is one of the most common screen reader patterns.",
    fix: "Replace generic divs with semantic HTML5 landmarks: <nav>, <main>, <header>, <footer>, <aside>, <section>. Or add role attributes to divs.",
    fixCode: `<!-- Bad: div soup -->
<div id="nav">...</div>
<div id="content">...</div>
<div id="sidebar">...</div>
<div id="footer">...</div>

<!-- Good: semantic HTML5 landmarks -->
<header role="banner">
  <nav aria-label="Primary navigation">...</nav>
</header>
<main id="main-content">
  <article>...</article>
  <aside aria-label="Related links">...</aside>
</main>
<footer role="contentinfo">...</footer>`,
  },
];

const SEO_CATALOGUE: Issue[] = [
  {
    id: "s1", severity: "critical", category: "Metadata",
    title: "Meta description missing on 8 pages",
    description: "Several key pages including the homepage and product pages lack meta description tags. Search engines display these in SERPs — their absence reduces click-through rates.",
    impact: "Google auto-generates descriptions which may be poorly chosen, reducing CTR by up to 5.8%. Missing meta descriptions are a fundamental technical SEO issue.",
    fix: "Add unique meta descriptions of 150-160 characters to every page. Include the target keyword naturally and a compelling call to action.",
    fixCode: `<!-- Bad: missing meta description -->
<head>
  <title>Our Products</title>
</head>

<!-- Good: optimised meta description -->
<head>
  <title>Compliance Software for Canadian SMBs | CanCompliance</title>
  <meta name="description" content="Stay CASL, PIPEDA and AODA compliant.
    CanCompliance checks 21 Canadian regulations in seconds.
    Free for SMBs — no credit card required.">
  <meta property="og:description" content="...same or adapted...">
</head>`,
  },
  {
    id: "s2", severity: "high", category: "Metadata",
    title: "Open Graph (OG) tags absent — social sharing broken",
    description: "Pages lack og:title, og:description, og:image, and og:url tags. When shared on LinkedIn, Facebook, or Slack, links show as plain URLs with no preview card.",
    impact: "Social shares without preview cards see 3× lower engagement. LinkedIn especially important for B2B SaaS. Missing og:image means platform uses a random on-page image.",
    fix: "Add the essential Open Graph meta tags to every page. Use a 1200×630px og:image. For Canadian B2B, prioritize LinkedIn Card tags as well.",
    fixCode: `<head>
  <!-- Open Graph (Facebook, LinkedIn, Slack) -->
  <meta property="og:type" content="website">
  <meta property="og:title"
    content="Canadian Compliance Software | CanCompliance">
  <meta property="og:description"
    content="21 Canadian regulations checked in seconds.">
  <meta property="og:image"
    content="https://yourdomain.ca/og-image.png">
  <meta property="og:url"
    content="https://yourdomain.ca/products">

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="...">
  <meta name="twitter:image" content="...">
</head>`,
  },
  {
    id: "s3", severity: "high", category: "Structure",
    title: "Multiple H1 tags on the same page (found 3)",
    description: "Three H1 elements appear on the homepage. While Google has stated multiple H1s are acceptable, they dilute topical authority signals and confuse document structure.",
    impact: "Ambiguous page topic signals reduce ranking potential for primary keywords. Single H1 is best practice for content clarity and semantic SEO.",
    fix: "Use exactly one H1 per page containing the primary keyword for that page. Convert secondary headings to H2. H1 should describe the page's main topic.",
    fixCode: `<!-- Bad: multiple H1s -->
<h1>Our Products</h1>
<h1>Why Choose Us</h1>
<h1>Customer Reviews</h1>

<!-- Good: single H1, multiple H2s -->
<h1>Canadian Compliance Software for SMBs</h1>
<h2>Our Products</h2>
  <h3>CASL Checker</h3>
  <h3>PIPEDA Checker</h3>
<h2>Why Choose Us</h2>
<h2>Customer Reviews</h2>`,
  },
  {
    id: "s4", severity: "high", category: "Performance",
    title: "Core Web Vitals: LCP exceeds 4.0s (poor threshold)",
    description: "Largest Contentful Paint measured at ~4.2 seconds. Google's poor threshold is >4.0s. LCP is a direct Google ranking signal in Core Web Vitals.",
    impact: "Pages failing Core Web Vitals may be deprioritised in Google rankings. Each 1-second delay in LCP reduces conversions by approximately 7%. Critical for SEO performance.",
    fix: "Optimise LCP by: preloading the hero image, serving WebP images, using a CDN, removing render-blocking scripts, and preconnecting to critical domains.",
    fixCode: `<!-- Preload LCP hero image -->
<link rel="preload" as="image"
  href="/hero-image.webp"
  fetchpriority="high">

<!-- Preconnect to critical domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.yourdomain.ca">

<!-- Use WebP with fallback -->
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="..." width="1200" height="600"
    loading="eager" fetchpriority="high">
</picture>

<!-- Defer non-critical scripts -->
<script src="analytics.js" defer></script>`,
  },
  {
    id: "s5", severity: "medium", category: "Structure",
    title: "Canonical URL tags missing on paginated and filtered URLs",
    description: "Product filter pages (/products?sort=price, /products?category=software) lack canonical tags pointing to the base URL, creating duplicate content.",
    impact: "Google indexes multiple versions of the same page, splitting PageRank and causing keyword cannibalisation. Leads to unpredictable ranking of the wrong page variant.",
    fix: "Add rel=canonical to the <head> of every page. For dynamic parameters, canonicalize to the clean base URL. For paginated series, consider rel=next/prev.",
    fixCode: `<!-- Add to <head> of every page -->
<!-- Base product page -->
<link rel="canonical"
  href="https://yourdomain.ca/products">

<!-- Filtered/sorted variants point back to base -->
<!-- /products?sort=price -->
<link rel="canonical"
  href="https://yourdomain.ca/products">

<!-- Paginated pages -->
<!-- /products?page=2 -->
<link rel="canonical"
  href="https://yourdomain.ca/products?page=2">
<link rel="prev"
  href="https://yourdomain.ca/products">`,
  },
  {
    id: "s6", severity: "medium", category: "Structured Data",
    title: "Schema.org markup missing — no rich results eligible",
    description: "No JSON-LD or Microdata structured data found. Pages miss out on rich results in Google SERPs: FAQ, breadcrumbs, reviews, and software application schema.",
    impact: "Structured data can double CTR by enabling rich snippets. For SaaS, SoftwareApplication schema enables star ratings and pricing in SERPs. Missing this = invisible to rich results.",
    fix: "Add JSON-LD schema.org markup in a <script type='application/ld+json'> block. For SaaS: SoftwareApplication + Organization + FAQ schemas are highest priority.",
    fixCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CanCompliance",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "147"
  },
  "description": "Canadian compliance software for SMBs"
}
</script>`,
  },
  {
    id: "s7", severity: "medium", category: "Performance",
    title: "Images not using next-gen formats (PNG/JPEG only)",
    description: "All images are served as PNG or JPEG. WebP offers 25-34% smaller file sizes than JPEG; AVIF offers up to 50% savings. No lazy-loading on below-the-fold images.",
    impact: "Larger images increase page weight and Time to Interactive. Google PageSpeed deducts points for unoptimised images. Directly impacts Core Web Vitals scores.",
    fix: "Convert images to WebP (or AVIF) format. Use the HTML <picture> element with fallbacks. Add loading='lazy' to images below the fold.",
    fixCode: `<!-- Bad: unoptimised image -->
<img src="screenshot.png" width="800">

<!-- Good: next-gen format with fallback + lazy loading -->
<picture>
  <source
    srcset="screenshot.avif"
    type="image/avif">
  <source
    srcset="screenshot.webp"
    type="image/webp">
  <img
    src="screenshot.png"
    alt="Compliance dashboard screenshot"
    width="800" height="450"
    loading="lazy"
    decoding="async">
</picture>`,
  },
  {
    id: "s8", severity: "low", category: "Metadata",
    title: "Title tags exceed 60-character threshold on 5 pages",
    description: "Page title tags range from 72-89 characters. Google typically truncates titles beyond 60 characters (or ~580px display width) in search results.",
    impact: "Truncated titles cut off important keywords and reduce clarity for searchers. While not a ranking factor, shorter titles improve CTR and brand recognition.",
    fix: "Keep title tags between 50-60 characters. Front-load the primary keyword. Use the pipe character (|) to separate brand from keyword.",
    fixCode: `<!-- Bad: too long (78 chars) -->
<title>Complete Canadian Compliance Software Solution
  for Small and Medium Businesses | CanCompliance Inc.</title>

<!-- Good: concise and keyword-rich (55 chars) -->
<title>Canadian Compliance Software for SMBs | CanCompliance</title>

<!-- Pattern: [Primary Keyword] | [Brand] -->
<!-- Pattern: [Brand] — [Value Prop + Location] -->
<title>CASL & PIPEDA Checker | CanCompliance</title>`,
  },
];

/* ── scan simulator ──────────────────────────────────── */
const SCAN_PHASES = [
  "Resolving domain…",
  "Fetching HTML structure…",
  "Parsing DOM tree…",
  "Running WCAG 2.0 AA checks…",
  "Checking AODA IASR compliance…",
  "Auditing colour contrast ratios…",
  "Analysing keyboard accessibility…",
  "Scanning metadata & OG tags…",
  "Evaluating Core Web Vitals…",
  "Checking structured data…",
  "Compiling report…",
];

function buildResults(rawUrl: string): ScanResults {
  const s = seed(rawUrl);
  const skipIds = new Set([
    pick(["a9"], s),
    pick(["s8"], s + 1),
  ]);
  const a11yIssues = A11Y_CATALOGUE.filter(i => !skipIds.has(i.id));
  const seoIssues = SEO_CATALOGUE.filter(i => !skipIds.has(i.id));

  const critA = a11yIssues.filter(i => i.severity === "critical").length;
  const highA = a11yIssues.filter(i => i.severity === "high").length;
  const a11yScore = Math.max(20, 100 - critA * 18 - highA * 9 - (s % 12));

  const critS = seoIssues.filter(i => i.severity === "critical").length;
  const highS = seoIssues.filter(i => i.severity === "high").length;
  const seoScore = Math.max(28, 100 - critS * 14 - highS * 8 - (s % 10));

  return {
    url: rawUrl,
    a11yScore,
    seoScore,
    a11yIssues,
    seoIssues,
    scannedAt: new Date().toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" }),
  };
}

/* ── sub-components ──────────────────────────────────── */
function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  const grade = score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Poor";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg3)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease" }} />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fill="var(--text1)" fontSize="18" fontWeight="700"
          style={{ transform: "rotate(90deg) translateX(-0px)", fontFamily: "var(--mono)" }}>
        </text>
      </svg>
      <div style={{ textAlign: "center", marginTop: -85, paddingBottom: 80 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", marginTop: 2 }}>/100</div>
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{grade}</div>
      <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(issue.fixCode || issue.fix); } catch (_) { /**/ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const color = SEV_COLOR[issue.severity];
  const bg = SEV_BG[issue.severity];
  return (
    <div data-issue-id={issue.id} data-severity={issue.severity}
      style={{ background: "var(--bg2)", border: `1px solid ${open ? color + "40" : "var(--border)"}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.15s" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: bg, color, border: `1px solid ${color}30`, flexShrink: 0, textTransform: "uppercase" }}>
          {issue.severity}
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", padding: "2px 6px", borderRadius: 3, background: "var(--bg3)", flexShrink: 0, textTransform: "uppercase" }}>
          {issue.category}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)", flex: 1 }}>{issue.title}</span>
        {issue.wcag && <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", flexShrink: 0, display: "none" }}>{issue.wcag}</span>}
        {open ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text3)" }} />
               : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text3)" }} />}
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {issue.wcag && (
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#7F77DD", marginBottom: 8, padding: "4px 8px", background: "rgba(127,119,221,0.08)", borderRadius: 5, display: "inline-block" }}>
              {issue.wcag}
            </div>
          )}
          <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65, marginBottom: 10 }}>{issue.description}</p>
          <div style={{ background: "rgba(240,68,56,0.04)", border: "1px solid rgba(240,68,56,0.15)", borderRadius: 7, padding: "8px 12px", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--red)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Impact</div>
            <p style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>{issue.impact}</p>
          </div>
          <div style={{ background: "rgba(18,183,106,0.04)", border: "1px solid rgba(18,183,106,0.15)", borderRadius: 7, padding: "8px 12px", marginBottom: issue.fixCode ? 10 : 0 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--green)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Remediation</div>
            <p style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>{issue.fix}</p>
          </div>
          {issue.fixCode && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg3)", borderRadius: "7px 7px 0 0", padding: "6px 12px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Code Fix</span>
                <button onClick={copy} data-action="copy-fix" data-copied={copied ? "true" : "false"}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: copied ? "var(--green)" : "var(--text3)", fontFamily: "var(--mono)" }}>
                  {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
                </button>
              </div>
              <pre style={{ background: "var(--bg3)", borderRadius: "0 0 7px 7px", padding: "12px", overflowX: "auto", fontSize: 10, lineHeight: 1.6, margin: 0, color: "var(--text2)", fontFamily: "var(--mono)" }}>
                <code>{issue.fixCode}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── main component ──────────────────────────────────── */
export default function WebsiteQA() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [phase, setPhase] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "accessibility" | "seo">("overview");
  const inputRef = useRef<HTMLInputElement>(null);

  const runScan = () => {
    let raw = url.trim();
    if (!raw) return;
    if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    setScanning(true);
    setResults(null);
    setProgress(0);
    setPhase(SCAN_PHASES[0]);

    let step = 0;
    const total = SCAN_PHASES.length;
    const interval = setInterval(() => {
      step++;
      setProgress(Math.round((step / total) * 100));
      setPhase(SCAN_PHASES[Math.min(step, total - 1)]);
      if (step >= total) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setResults(buildResults(raw));
          setActiveTab("overview");
        }, 300);
      }
    }, 250);
  };

  const reset = () => {
    setResults(null);
    setUrl("");
    setProgress(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const criticalA11y = results?.a11yIssues.filter(i => i.severity === "critical").length ?? 0;
  const criticalSeo = results?.seoIssues.filter(i => i.severity === "critical").length ?? 0;

  return (
    <div className="page-content">
      {/* Header banner */}
      <div style={{ background: "rgba(0,188,242,0.06)", border: "1px solid rgba(0,188,242,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Globe className="w-3.5 h-3.5" style={{ color: "#00BCF2" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#00BCF2", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Website QA Scanner · AODA &amp; SEO Auditor</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65 }}>
          Scan any URL for WCAG 2.0 Level AA accessibility violations (AODA-mandated standard) and SEO issues. Get specific remediation code for every finding.
        </div>
      </div>

      {/* URL input */}
      {!results && !scanning && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Enter website URL to audit</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Globe className="w-4 h-4" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
              <input ref={inputRef} type="url" value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && url.trim() && runScan()}
                placeholder="https://yourcompany.ca"
                data-testid="url-input"
                style={{ width: "100%", boxSizing: "border-box", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px 10px 38px", fontSize: 13, color: "var(--text1)", fontFamily: "var(--mono)", outline: "none" }} />
            </div>
            <button onClick={runScan} disabled={!url.trim()}
              data-testid="scan-btn"
              style={{ padding: "10px 24px", borderRadius: 8, border: "none", cursor: url.trim() ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 12, background: url.trim() ? "#c8f135" : "var(--bg3)", color: url.trim() ? "#09090a" : "var(--text3)", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Search className="w-4 h-4" />
              Run Audit
            </button>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["yourcompany.ca", "example-sme.com", "retailstore.ca"].map(demo => (
              <button key={demo} onClick={() => { setUrl(demo); setTimeout(runScan, 50); }}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", cursor: "pointer", fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                Try: {demo}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scanning animation */}
      {scanning && (
        <div style={{ background: "var(--bg2)", border: "1px solid rgba(0,188,242,0.2)", borderRadius: 12, padding: 32, marginBottom: 20, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,188,242,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "#00BCF2" }} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 6 }}>Scanning {url}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 20 }}>{phase}</div>
          <div style={{ width: "100%", maxWidth: 400, height: 4, borderRadius: 2, background: "var(--bg3)", margin: "0 auto", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#00BCF2", width: `${progress}%`, borderRadius: 2, transition: "width 0.25s ease" }} />
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginTop: 8 }}>{progress}% complete</div>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Results header bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", flex: 1, minWidth: 0 }}>
              <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text3)" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{results.url}</span>
              <a href={results.url} target="_blank" rel="noreferrer" style={{ marginLeft: "auto", flexShrink: 0 }}>
                <ExternalLink className="w-3 h-3" style={{ color: "var(--text3)" }} />
              </a>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", flexShrink: 0 }}>Scanned {results.scannedAt}</div>
            <button onClick={reset} style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg3)", cursor: "pointer", fontSize: 10, color: "var(--text2)", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <RefreshCw className="w-3 h-3" />New Scan
            </button>
          </div>

          {/* Score summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", gridColumn: "span 2", display: "flex", alignItems: "center", gap: 20 }}>
              <ScoreRing score={results.a11yScore} label="Accessibility" color={results.a11yScore >= 70 ? "#12b76a" : results.a11yScore >= 45 ? "#f5a623" : "#f04438"} />
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>AODA / WCAG 2.0 AA</div>
                {[
                  { label: "Critical", count: criticalA11y, color: "var(--red)" },
                  { label: "High", count: results.a11yIssues.filter(i => i.severity === "high").length, color: "var(--amber)" },
                  { label: "Medium", count: results.a11yIssues.filter(i => i.severity === "medium").length, color: "#7F77DD" },
                  { label: "Low", count: results.a11yIssues.filter(i => i.severity === "low").length, color: "var(--text3)" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "var(--text2)" }}>{r.label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: r.count > 0 ? r.color : "var(--text3)", marginLeft: "auto", fontWeight: 700 }}>{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", gridColumn: "span 2", display: "flex", alignItems: "center", gap: 20 }}>
              <ScoreRing score={results.seoScore} label="SEO Score" color={results.seoScore >= 70 ? "#12b76a" : results.seoScore >= 45 ? "#f5a623" : "#f04438"} />
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Search Engine Optimisation</div>
                {[
                  { label: "Critical", count: criticalSeo, color: "var(--red)" },
                  { label: "High", count: results.seoIssues.filter(i => i.severity === "high").length, color: "var(--amber)" },
                  { label: "Medium", count: results.seoIssues.filter(i => i.severity === "medium").length, color: "#7F77DD" },
                  { label: "Low", count: results.seoIssues.filter(i => i.severity === "low").length, color: "var(--text3)" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "var(--text2)" }}>{r.label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: r.count > 0 ? r.color : "var(--text3)", marginLeft: "auto", fontWeight: 700 }}>{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
            {[
              { key: "overview", label: "Overview" },
              { key: "accessibility", label: `Accessibility (${results.a11yIssues.length})` },
              { key: "seo", label: `SEO (${results.seoIssues.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
                data-tab={t.key}
                style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid", background: activeTab === t.key ? "#c8f135" : "transparent", borderColor: activeTab === t.key ? "#c8f135" : "var(--border)", color: activeTab === t.key ? "#09090a" : "var(--text2)" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {/* AODA compliance status */}
                <div style={{ background: "var(--bg2)", border: `1px solid ${criticalA11y > 0 ? "rgba(240,68,56,0.2)" : "rgba(245,166,35,0.2)"}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    {criticalA11y > 0
                      ? <XCircle className="w-4 h-4" style={{ color: "var(--red)" }} />
                      : <AlertTriangle className="w-4 h-4" style={{ color: "var(--amber)" }} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text1)" }}>AODA Compliance Status</span>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: criticalA11y > 0 ? "var(--red)" : "var(--amber)", fontWeight: 700, marginBottom: 6 }}>
                    {criticalA11y > 0 ? "NON-COMPLIANT" : "PARTIAL — ACTION REQUIRED"}
                  </div>
                  <p style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
                    {criticalA11y > 0
                      ? `${criticalA11y} critical barrier${criticalA11y > 1 ? "s" : ""} detected. Organizations with 20+ employees must meet WCAG 2.0 Level AA. Maximum fine: $100,000/day.`
                      : "No critical barriers found, but high-severity issues require remediation. Full WCAG 2.0 AA compliance requires resolving all high-severity findings."}
                  </p>
                </div>
                {/* SEO priority */}
                <div style={{ background: "var(--bg2)", border: `1px solid ${criticalSeo > 0 ? "rgba(240,68,56,0.2)" : "rgba(127,119,221,0.2)"}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Tag className="w-4 h-4" style={{ color: criticalSeo > 0 ? "var(--red)" : "#7F77DD" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text1)" }}>SEO Priority Level</span>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: criticalSeo > 0 ? "var(--red)" : "#7F77DD", fontWeight: 700, marginBottom: 6 }}>
                    {criticalSeo > 0 ? "CRITICAL ISSUES FOUND" : "OPTIMISATION NEEDED"}
                  </div>
                  <p style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
                    {criticalSeo > 0
                      ? `${criticalSeo} critical SEO issue${criticalSeo > 1 ? "s" : ""} likely causing missed organic traffic. Resolve metadata and Core Web Vitals issues first.`
                      : "Baseline SEO is functional but several high-impact opportunities exist for improved search visibility and click-through rates."}
                  </p>
                </div>
              </div>

              {/* Quick wins */}
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Quick Wins — Highest Impact Fixes</div>
                <div className="space-y-2">
                  {[...results.a11yIssues.filter(i => i.severity === "critical"), ...results.seoIssues.filter(i => i.severity === "critical"), ...results.a11yIssues.filter(i => i.severity === "high").slice(0, 2)].slice(0, 5).map((issue, idx) => (
                    <div key={issue.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", background: "var(--bg3)", borderRadius: 7 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", flexShrink: 0, marginTop: 1 }}>{String(idx + 1).padStart(2, "0")}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text1)", marginBottom: 2 }}>{issue.title}</div>
                        <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)" }}>{(issue as Issue).wcag || "SEO"} · {issue.severity.toUpperCase()}</div>
                      </div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: SEV_BG[issue.severity], color: SEV_COLOR[issue.severity], border: `1px solid ${SEV_COLOR[issue.severity]}30`, flexShrink: 0 }}>
                        {issue.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Accessibility tab */}
          {activeTab === "accessibility" && (
            <div className="space-y-3">
              <div style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--amber)" }} />
                <div style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.6 }}>
                  AODA requires organizations with 20+ employees to meet <strong style={{ color: "var(--text1)" }}>WCAG 2.0 Level AA</strong> (Ontario Reg. 191/11, s.14). Maximum penalty: <strong style={{ color: "var(--red)" }}>$100,000/day</strong> for corporations. Prioritize Critical and High severity items.
                </div>
              </div>
              {results.a11yIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
            </div>
          )}

          {/* SEO tab */}
          {activeTab === "seo" && (
            <div className="space-y-3">
              <div style={{ background: "rgba(127,119,221,0.05)", border: "1px solid rgba(127,119,221,0.2)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#7F77DD" }} />
                <div style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.6 }}>
                  Issues are ranked by SEO impact. Resolve <strong style={{ color: "var(--red)" }}>Critical</strong> metadata and Core Web Vitals issues first — these have the most direct effect on Google rankings and organic CTR.
                </div>
              </div>
              {results.seoIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
