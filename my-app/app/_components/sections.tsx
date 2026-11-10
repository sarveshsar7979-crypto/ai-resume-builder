import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { SITE } from "./site";
import { Typewriter } from "./typewriter";
import { ArrowRight, Check, Logo, ScoreRing, Sparkle } from "./ui";

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-poppy">{children}</div>;
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-ink sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-relaxed text-muted">{sub}</p>}
    </Reveal>
  );
}

function Card({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={`rounded-3xl border border-line bg-cream p-6 sm:p-7 ${className}`}>
      {children}
    </Reveal>
  );
}

function CardText({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-xl font-medium tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

/* ---------- features ---------- */
function EditorMock() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-white p-3">
      <div className="space-y-2.5 p-1">
        {["Full name", "Job title", "Summary"].map((l, i) => (
          <div key={l}>
            <div className="text-[10px] font-medium text-muted">{l}</div>
            <div className={`mt-1 rounded-md border border-line bg-cream px-2 ${i === 2 ? "h-12" : "h-6"}`}>
              <div className="mt-2 h-1.5 rounded-full bg-ink/15" style={{ width: `${[60, 75, 85][i]}%` }} />
              {i === 2 && <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-ink/10" />}
            </div>
          </div>
        ))}
        <div className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-0.5 text-[10px] text-leaf">
          <Check className="size-2.5" /> Saved
        </div>
      </div>
      <div className="rounded-lg bg-cream p-3 shadow-inner">
        <div className="h-2.5 w-2/3 rounded-full bg-ink/70" />
        <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-ink/25" />
        <div className="mt-3 h-1 w-1/3 rounded-full bg-poppy/70" />
        {[90, 80, 85, 60].map((w, i) => (
          <div key={i} className="mt-1.5 h-1 rounded-full bg-ink/15" style={{ width: `${w}%` }} />
        ))}
        <div className="mt-3 h-1 w-1/3 rounded-full bg-poppy/70" />
        {[75, 88, 50].map((w, i) => (
          <div key={i} className="mt-1.5 h-1 rounded-full bg-ink/15" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-5 py-24 sm:py-32">
      <SectionTitle
        eyebrow="Features"
        title={<>One great resume.<br />Nothing in the way.</>}
        sub="Everything you need to go from blank page to a polished PDF, and nothing you don't."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardText title="Form on the left, resume on the right" body="Fill in Contact, Summary, Experience, Education and Skills. The preview updates as you type and autosaves a second after you stop." />
          <div className="mt-6"><EditorMock /></div>
        </Card>
        <Card className="flex flex-col md:col-span-2" delay={80}>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-violet">
                <Sparkle className="size-3" /> AI Improve
              </div>
              <span className="text-[11px] text-muted">Experience · bullet 2</span>
            </div>
            <div className="mt-4 text-[11px] font-medium text-muted">Before</div>
            <p className="mt-1 text-[14px] text-muted line-through decoration-muted/40">Helped customers with issues.</p>
            <div className="mt-3 text-[11px] font-medium text-violet">Suggestion</div>
            <p className="mt-1 min-h-[66px] rounded-xl bg-violet-soft p-3 text-[14px] leading-snug text-ink">
              <Typewriter
                lines={[
                  "Resolved 40+ support tickets a week with a 97% satisfaction score.",
                  "Cut average reply time from 6 hours to 90 minutes.",
                ]}
              />
            </p>
            <div className="mt-4 flex items-center gap-2 text-[12px]">
              <span className="rounded-full bg-ink px-3 py-1 text-white">Accept</span>
              <span className="rounded-full border border-line px-3 py-1 text-muted">Discard</span>
              <span className="ml-auto text-[11px] text-muted">Uses 1 credit</span>
            </div>
          </div>
          <div className="mt-auto pt-6">
            <CardText title="Better bullets in one click" body="Get a stronger rewrite of any bullet or summary. Accept it or discard it." />
          </div>
        </Card>
        <Card className="md:col-span-2">
          <div className="flex items-center gap-4">
            <ScoreRing score={86} size={72} />
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="rounded-full bg-poppy-soft px-2 py-0.5 text-poppy">+ Kubernetes</span>
              <span className="rounded-full bg-poppy-soft px-2 py-0.5 text-poppy">+ CI/CD</span>
            </div>
          </div>
          <div className="mt-6">
            <CardText title="Job Match" body="Paste a job description to get a score out of 100, the keywords you're missing and 3 tips." />
          </div>
        </Card>
        <Card className="md:col-span-2" delay={80}>
          <div className="flex h-[72px] items-center gap-3">
            <div className="grid h-16 w-12 place-items-center rounded-md border border-line bg-white text-[10px] font-semibold text-poppy shadow-sm">PDF</div>
            <div className="text-[13px] text-muted">Selectable text<br />One clean layout</div>
          </div>
          <div className="mt-6">
            <CardText title="ATS-friendly PDF" body="Download a clean, single-template PDF that applicant tracking systems can read. Always free." />
          </div>
        </Card>
        <Card className="md:col-span-2" delay={160}>
          <div className="flex h-[72px] items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink shadow-sm">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
                <path fill="#34A853" d="M12 23c3 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.2a11 11 0 0 0 0 9.9z" />
                <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
              </svg>
              Continue with Google
            </span>
          </div>
          <div className="mt-6">
            <CardText title="Sign in, start writing" body="One click with Google. Your resumes are saved to your dashboard." />
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ---------- how it works ---------- */
const STEPS = [
  { n: "01", title: "Sign in with Google", body: "No forms and no passwords. You land on your dashboard, ready to create your first resume." },
  { n: "02", title: "Write and polish", body: "Fill in each section with the live preview beside you. Use AI Improve on any line that feels weak." },
  { n: "03", title: "Match and download", body: "Paste the job description, close the keyword gaps, then download your PDF." },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 border-y border-line bg-cream px-5 py-24 sm:py-32">
      <SectionTitle eyebrow="How it works" title="From blank page to PDF in three steps" />
      <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 100}>
            <div className="font-display text-5xl font-light text-poppy/80">{s.n}</div>
            <div className="mt-4 h-px w-full bg-line" />
            <h3 className="mt-5 font-display text-xl font-medium text-ink">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- job match spotlight ---------- */
function JobMatch() {
  return (
    <section className="px-5 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal>
          <Eyebrow>Job Match</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-ink sm:text-5xl">
            Know where you stand before you apply.
          </h2>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
            Paste any job description. You get a score, the keywords the role asks for that your resume doesn&apos;t mention, and three specific tips. Your latest result stays saved with the resume.
          </p>
          <Link href={SITE.signInHref} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-black">
            Try Job Match free
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_30px_60px_-30px_rgba(20,20,30,0.3)] sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-muted">Frontend Engineer · Job description</div>
                <div className="mt-1 font-display text-2xl font-medium text-ink">Match score</div>
              </div>
              <ScoreRing score={78} size={84} stroke={7} />
            </div>
            <div className="mt-6 text-[12px] font-medium uppercase tracking-wider text-muted">Missing keywords</div>
            <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
              {["GraphQL", "Accessibility", "Design systems", "Playwright"].map((k) => (
                <span key={k} className="rounded-full bg-poppy-soft px-3 py-1 text-poppy">+ {k}</span>
              ))}
            </div>
            <div className="mt-6 text-[12px] font-medium uppercase tracking-wider text-muted">Tips</div>
            <ol className="mt-2 space-y-2.5 text-[14px] leading-snug text-ink">
              {[
                "Mention the design system you maintained at your last role.",
                "Add a bullet about accessibility work, with a result if you have one.",
                "Move your testing experience into your most recent job.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf-soft text-[11px] font-semibold text-leaf">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- pricing ---------- */
const FREE = ["1 resume", "5 AI Improves", "1 Job Match", "Unlimited PDF downloads"];
const PRO = ["Unlimited resumes", "Unlimited AI Improve", "Unlimited Job Match", "Unlimited PDF downloads", "Cancel anytime"];

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line bg-cream px-5 py-24 sm:py-32">
      <SectionTitle eyebrow="Pricing" title="Simple, and cheaper than coffee runs" sub="Start free. Upgrade when you're applying in earnest." />
      <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
        <Reveal className="flex flex-col rounded-3xl border border-line bg-white p-7 sm:p-8">
          <div className="font-display text-xl font-medium text-ink">Free</div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-display text-5xl font-medium tracking-tight text-ink">$0</span>
          </div>
          <p className="mt-2 text-[14px] text-muted">Everything you need for one solid resume.</p>
          <ul className="mt-6 space-y-3 text-[15px] text-ink">
            {FREE.map((f) => (
              <li key={f} className="flex items-center gap-2.5"><Check className="size-4 text-leaf" />{f}</li>
            ))}
          </ul>
          <Link href={SITE.signInHref} className="mt-auto pt-8">
            <span className="block rounded-full border border-line py-3 text-center text-[14px] font-medium text-ink transition hover:bg-cream">Start free</span>
          </Link>
        </Reveal>
        <Reveal delay={100} className="relative flex flex-col overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-8">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-poppy/30 blur-3xl" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <div className="font-display text-xl font-medium">Pro</div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium">Most popular</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-display text-5xl font-medium tracking-tight">${SITE.proPrice}</span>
            <span className="text-white/60">/month</span>
          </div>
          <p className="mt-2 text-[14px] text-white/60">For an active job search, with every role you apply to.</p>
          <ul className="mt-6 space-y-3 text-[15px]">
            {PRO.map((f) => (
              <li key={f} className="flex items-center gap-2.5"><Check className="size-4 text-poppy" />{f}</li>
            ))}
          </ul>
          <Link href={SITE.signInHref} className="mt-auto pt-8">
            <span className="block rounded-full bg-white py-3 text-center text-[14px] font-medium text-ink transition hover:bg-white/90">Get Pro</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- faq ---------- */
const FAQS = [
  { q: "Will my resume get through applicant tracking systems?", a: "The PDF uses one clean, single-column layout with real, selectable text, which is what ATS software reads best." },
  { q: "Do I need a credit card to start?", a: "No. Sign in with Google and use the Free plan for as long as you like." },
  { q: "What happens if I cancel Pro?", a: "You keep Pro until the end of the period you paid for. After that you're on Free, and all your resumes stay. You can still edit and download them." },
  { q: "Can I upload my existing resume?", a: "Not yet. For now you fill in the form, which usually takes a few minutes and gives the cleanest result." },
  { q: "Is the PDF download really free?", a: "Yes. Downloads are unlimited on every plan, with no watermark." },
];

function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 px-5 py-24 sm:py-32">
      <SectionTitle eyebrow="FAQ" title="Questions, answered" />
      <Reveal className="mx-auto mt-12 max-w-2xl divide-y divide-line border-y border-line">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-ink">
              {f.q}
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 pr-10 text-[15px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}

/* ---------- final cta + footer ---------- */
function FinalCta() {
  return (
    <section className="px-5 pb-10">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-24 text-center sm:py-32">
        <Image src={SITE.heroImage} alt="" fill sizes="(min-width: 1200px) 1152px, 100vw" className="object-cover object-[center_70%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_45%,rgba(255,250,244,0.75),rgba(255,250,244,0.2))]" aria-hidden="true" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-ink sm:text-6xl">
            Your next job starts with one good page.
          </h2>
          <Link href={SITE.signInHref} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black">
            Build my resume
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

function Footer() {
  return (
    <footer className="px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-[13px] text-muted sm:flex-row">
        <div className="flex items-center gap-1.5 font-display text-[15px] font-semibold text-ink">
          <Logo className="size-5" /> {SITE.name}
        </div>
        <nav className="flex gap-6">
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
        </nav>
        <div>© <Year /> {SITE.name}</div>
      </div>
    </footer>
  );
}

export function LandingSections() {
  return (
    <>
      <Features />
      <HowItWorks />
      <JobMatch />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
