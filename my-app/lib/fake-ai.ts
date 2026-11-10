// Simulated AI. Stands in for the server action that calls Claude Haiku.
// Deterministic so the demo behaves the same every time.
import type { JobMatchResult, ResumeContent } from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------- AI Improve ---------- */
const PREPARED: Record<string, string> = {
  "worked on the checkout page.": "Rebuilt the checkout flow in React and TypeScript, cutting cart drop-off by 18%.",
  "helped with the design system.": "Co-built a design system of 60+ components, adopted by 4 product teams.",
  "responsible for performance improvements.": "Cut page load time by 40% by code-splitting routes and lazy-loading images.",
};

const WEAK_OPENERS: [RegExp, string][] = [
  [/^(i\s+)?(worked on|was working on)\s+/i, "Built "],
  [/^(i\s+)?helped (with |to )?/i, "Supported "],
  [/^(i\s+)?(was\s+)?responsible for\s+/i, "Owned "],
  [/^(i\s+)?(was\s+)?in charge of\s+/i, "Led "],
  [/^(i\s+)?did\s+/i, "Delivered "],
  [/^(i\s+)?made\s+/i, "Created "],
  [/^(i\s+)?tasked with\s+/i, "Drove "],
  [/^(i\s+)?participated in\s+/i, "Contributed to "],
];
const FILLER = /\b(various|a lot of|lots of|very|really|basically|successfully|several different)\s+/gi;

function polishBullet(text: string) {
  let t = text.trim().replace(/\s+/g, " ");
  const prepared = PREPARED[t.toLowerCase()];
  if (prepared) return prepared;
  for (const [re, rep] of WEAK_OPENERS) {
    if (re.test(t)) {
      t = t.replace(re, rep);
      break;
    }
  }
  t = t.replace(FILLER, "");
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.!?]$/.test(t)) t += ".";
  if (t === text.trim() && !/\d/.test(t)) {
    t = t.replace(/\.$/, "") + ", improving delivery speed and quality for the team.";
  }
  return t;
}

function writeSummary(content: ResumeContent) {
  const title = content.contact.title || content.experience[0]?.role || "Professional";
  const years = (() => {
    const starts = content.experience.map((e) => parseInt(e.start.match(/\d{4}/)?.[0] ?? "", 10)).filter(Boolean);
    return starts.length ? new Date().getFullYear() - Math.min(...starts) : 0;
  })();
  const skills = content.skills.slice(0, 3);
  const skillText = skills.length > 1 ? `${skills.slice(0, -1).join(", ")} and ${skills.at(-1)}` : skills[0] ?? "modern tools";
  const company = content.experience.find((e) => e.company)?.company;
  return [
    `${title} with ${years > 0 ? `${years}+ years` : "hands-on experience"} building products people rely on, specializing in ${skillText}.`,
    company ? `Most recently at ${company}, shipping work that measurably improved the product and the team around it.` : "Known for clear communication, ownership and shipping work that moves metrics.",
  ].join(" ");
}

export async function improveText(text: string, kind: "bullet" | "summary", content: ResumeContent) {
  await wait(900 + Math.random() * 600);
  if (kind === "summary") return writeSummary(content);
  return polishBullet(text);
}

/* ---------- Job Match ---------- */
const KEYWORDS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Python", "Go", "Java", "Kotlin",
  "Swift", "Ruby", "Rails", "PHP", "C#", ".NET", "Rust", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL",
  "REST", "APIs", "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "Git", "Linux", "HTML", "CSS",
  "Tailwind", "Sass", "Redux", "Jest", "Playwright", "Cypress", "Testing", "Unit tests", "Accessibility", "Performance",
  "Design system", "Figma", "UX", "UI", "Mobile", "iOS", "Android", "React Native", "Microservices", "Kafka",
  "Machine learning", "Data analysis", "Analytics", "A/B testing", "Excel", "Tableau", "Power BI", "Looker", "Salesforce",
  "HubSpot", "SEO", "Content", "Marketing", "Product management", "Roadmap", "Agile", "Scrum", "Jira", "Stakeholder",
  "Leadership", "Mentoring", "Communication", "Collaboration", "Customer success", "Sales", "Budget", "Security",
  "Observability", "Monitoring", "Startup", "B2B", "SaaS", "E-commerce", "Payments", "Stripe",
];
const STOP = new Set(
  "about above after again their there these those which while would could should with from into over under your you our we they this that have has had will been being were what when where who whom whose more most other some such only than then also very just work team role years experience strong ability skills including across using within".split(" "),
);

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const countIn = (hay: string, k: string) => (hay.match(new RegExp(`(^|[^a-z0-9])${esc(k.toLowerCase())}s?(?![a-z0-9])`, "g")) ?? []).length;

export function resumeText(c: ResumeContent) {
  return [
    c.contact.title, c.summary,
    ...c.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...c.education.flatMap((e) => [e.degree, e.school, e.details]),
    ...c.skills,
  ].join(" \n ").toLowerCase();
}

export async function runJobMatch(jobDescription: string, content: ResumeContent): Promise<JobMatchResult> {
  await wait(1400 + Math.random() * 600);
  const jd = jobDescription.toLowerCase();
  const cv = resumeText(content);

  let wanted = KEYWORDS.map((k) => ({ k, n: countIn(jd, k) })).filter((x) => x.n > 0);
  if (wanted.length < 4) {
    // Unknown field: fall back to the job description's most repeated words.
    const freq = new Map<string, number>();
    for (const w of jd.match(/[a-z][a-z+#.-]{4,}/g) ?? []) if (!STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
    const extra = [...freq].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, n]) => ({ k: k[0].toUpperCase() + k.slice(1), n }));
    wanted = [...wanted, ...extra.filter((e) => !wanted.some((w) => w.k.toLowerCase() === e.k.toLowerCase()))];
  }
  wanted.sort((a, b) => b.n - a.n);

  const missing = wanted.filter((w) => countIn(cv, w.k) === 0);
  const matched = wanted.length - missing.length;
  const bullets = content.experience.flatMap((e) => e.bullets).filter((b) => b.trim());
  const withNumbers = bullets.filter((b) => /\d/.test(b)).length;

  const coverage = wanted.length ? matched / wanted.length : 0.5;
  const evidence = bullets.length ? withNumbers / bullets.length : 0;
  const score = Math.round(Math.min(98, Math.max(12, 30 + coverage * 55 + evidence * 10 + (content.summary.trim() ? 3 : 0))));

  const tips: string[] = [];
  if (missing.length >= 2) tips.push(`Add ${missing[0].k} and ${missing[1].k} where you've genuinely used them. The role mentions them directly.`);
  else if (missing.length === 1) tips.push(`Add ${missing[0].k} if you've used it. It's the one key term your resume doesn't mention.`);
  const noNumbers = bullets.length - withNumbers;
  if (noNumbers > 0) tips.push(`${noNumbers} of your bullets ${noNumbers === 1 ? "has" : "have"} no numbers. Add a result (time saved, %, users) to the strongest ones.`);
  const titleWord = content.contact.title.toLowerCase().split(/\s+/).find((w) => w.length > 3);
  if (titleWord && !jd.includes(titleWord)) tips.push("Mirror the job's title in your summary so recruiters see the fit right away.");
  if (!content.summary.trim()) tips.push("Add a 2–3 line summary that names the role and your strongest skills.");
  const fallbacks = [
    "Put your most relevant bullet first under each role. Recruiters skim the top lines.",
    "Keep it to one page: trim bullets older than 8–10 years unless they're highly relevant.",
    "Use the same wording as the job description for skills you already have.",
  ];
  for (const f of fallbacks) if (tips.length < 3) tips.push(f);

  return {
    jobDescription,
    score,
    missingKeywords: missing.slice(0, 8).map((m) => m.k),
    tips: tips.slice(0, 3),
    createdAt: new Date().toISOString(),
  };
}
