import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SITE } from "./site";
import { Typewriter } from "./typewriter";
import { ArrowRight, Check, Logo, ScoreRing, Sparkle } from "./ui";

const IMPROVED = [
  "Rebuilt the checkout flow in React, cutting cart drop-off by 18%.",
  "Led a 4-person team to ship the mobile app two weeks early.",
  "Automated weekly reports in SQL, saving the team 6 hours a week.",
];

// Rendered at the page root (not inside the hero), so it sits above every section.
export function Nav() {
  return (
    <header className="anim-drop fixed inset-x-0 top-4 z-50 flex justify-center px-4" style={{ animationDelay: "0.1s" }}>
      <nav className="flex w-full max-w-2xl items-center justify-between gap-4 rounded-full border border-white/70 bg-white/80 py-1.5 pl-4 pr-1.5 shadow-[0_8px_30px_-12px_rgba(30,30,40,0.25)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-1.5 font-display text-[15px] font-semibold text-ink">
          <Logo className="size-5" />
          {SITE.name}
        </Link>
        <ul className="hidden items-center gap-6 text-[13px] text-muted md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href={SITE.signInHref}
          className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:bg-black"
        >
          Log in
        </Link>
      </nav>
    </header>
  );
}

function ImproveCard() {
  return (
    <div className="anim-rise hidden w-[300px] lg:block" style={{ animationDelay: "1.3s" }}>
      <div className="anim-bob rounded-2xl border border-white bg-white/95 p-4 text-left shadow-[0_24px_60px_-24px_rgba(20,20,30,0.55)] backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-violet">
          <Sparkle className="size-3" /> AI Improve
        </div>
        <p className="mt-2 text-[13px] text-muted line-through decoration-muted/40">Worked on the checkout page.</p>
        <p className="mt-1.5 min-h-[40px] text-[13px] leading-snug text-ink">
          <Typewriter lines={IMPROVED} startDelay={2} />
        </p>
        <div className="mt-3 flex gap-2 text-[12px]">
          <span className="rounded-full bg-ink px-3 py-1 text-white">Accept</span>
          <span className="rounded-full border border-line px-3 py-1 text-muted">Discard</span>
        </div>
      </div>
    </div>
  );
}

function MatchCard() {
  return (
    <div className="anim-rise hidden w-[260px] lg:block" style={{ animationDelay: "1.5s" }}>
      <div className="anim-bob rounded-2xl border border-white bg-white/95 p-4 text-left shadow-[0_24px_60px_-24px_rgba(20,20,30,0.55)] backdrop-blur-md" style={{ animationDelay: "-3s" }}>
        <div className="flex items-center gap-3">
          <ScoreRing score={86} size={56} stroke={5} delay={1.8} />
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-leaf">Job Match</div>
            <div className="text-[13px] text-ink">Strong fit for this role</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-0.5 text-leaf">
            <Check className="size-3" /> React
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-0.5 text-leaf">
            <Check className="size-3" /> TypeScript
          </span>
          <span className="rounded-full bg-poppy-soft px-2 py-0.5 text-poppy">+ GraphQL</span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Background image with a slow, continuous drift. Swap the file via SITE.heroImage. */}
      <div className="anim-zoom absolute inset-0 -z-10">
        <Image
          src={SITE.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="anim-drift object-cover"
        />
        {/* soft light behind the headline + darker base for the cards */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_38%,rgba(255,250,244,0.55),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/25 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-5 pt-32 text-center sm:pt-40">
        {/* Only the headline block fades on scroll; the cards stay crisp. */}
        <div className="hero-scroll-out flex flex-col items-center">
        <a
          href="#features"
          className="anim-rise inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[12px] font-medium text-ink shadow-sm backdrop-blur"
          style={{ animationDelay: "0.25s" }}
        >
          <Sparkle className="size-3 text-poppy" />
          Now with AI Job Match
        </a>
        <h1
          className="anim-rise mt-6 font-display text-[44px] font-medium leading-[1.02] tracking-[-0.03em] text-ink sm:text-7xl md:text-[84px]"
          style={{ animationDelay: "0.4s" }}
        >
          Resumes, written
          <br />
          with ease.
        </h1>
        <p
          className="anim-rise mt-5 max-w-md text-[16px] leading-relaxed text-ink/80 sm:text-lg"
          style={{ animationDelay: "0.6s" }}
        >
          Build an ATS-friendly resume with a live preview, polish every line with AI, and match it to the job you want.
        </p>
        <div className="anim-rise mt-8 flex items-center gap-5" style={{ animationDelay: "0.8s" }}>
          <Link
            href={SITE.signInHref}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-ink shadow-[0_10px_30px_-10px_rgba(20,20,30,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-10px_rgba(20,20,30,0.5)]"
          >
            Build my resume
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href="#how" className="text-[14px] font-medium text-ink/85 underline-offset-4 hover:underline">
            See how it works
          </a>
        </div>
        <p className="anim-rise mt-4 text-[12px] text-ink/60" style={{ animationDelay: "0.95s" }}>
          Free to start · No card needed
        </p>
        </div>

        <div className="mt-auto flex w-full max-w-5xl items-end justify-between gap-6 pb-14 pt-10 lg:-mx-24 lg:w-[calc(100%+12rem)]">
          <ImproveCard />
          <MatchCard />
        </div>
      </div>
    </section>
  );
}
