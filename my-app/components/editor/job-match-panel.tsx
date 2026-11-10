"use client";

import { useEffect, useState } from "react";
import { ScoreRing } from "@/app/_components/ui";
import { canUseAi, remaining } from "@/lib/entitlements";
import { runJobMatch } from "@/lib/fake-ai";
import { timeAgo } from "@/lib/format";
import { getDemo, recordUsage, saveJobMatch, useDemo } from "@/lib/store";
import type { Resume, ResumeContent } from "@/lib/types";
import { openUpgrade, toast } from "@/lib/ui";
import { Plus, Refresh, Target } from "../icons";
import { Button, Textarea } from "../primitives";

const MAX_JD = 10_000;

const SAMPLE_JD = `Senior Frontend Engineer — Remote (US)

We're looking for a Senior Frontend Engineer to lead the web experience for our B2B SaaS platform.

What you'll do
- Build and maintain features in React, TypeScript and Next.js
- Own accessibility and performance across the product
- Work with design to grow our design system in Figma
- Write tests with Playwright and Jest, and improve our CI/CD pipeline
- Consume GraphQL APIs and partner with backend engineers
- Mentor other engineers and lead code reviews

You have
- 5+ years of frontend experience
- Strong communication and collaboration skills
- Experience with analytics and A/B testing is a plus`;

const STEPS = ["Reading the job description…", "Comparing it with your resume…", "Writing tips…"];

function fitLabel(score: number) {
  if (score >= 80) return { text: "Strong fit", cls: "text-leaf" };
  if (score >= 60) return { text: "Good fit, with gaps", cls: "text-[#9a6a0a]" };
  return { text: "Needs work for this role", cls: "text-poppy" };
}

export function JobMatchPanel({ resume, content, onAddSkill }: { resume: Resume; content: ResumeContent; onAddSkill: (s: string) => void }) {
  const state = useDemo();
  const result = resume.lastJobMatch;
  const [editing, setEditing] = useState(!result);
  const [jd, setJd] = useState(result?.jobDescription ?? "");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const left = remaining(state, "job_match");

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 600);
    return () => clearInterval(t);
  }, [running]);

  const run = async (text: string) => {
    if (text.trim().length < 80) {
      toast("Paste the full job description (at least a few sentences).", "info");
      return;
    }
    const check = canUseAi(getDemo(), "job_match");
    if (!check.ok) {
      if (check.reason === "free_limit") openUpgrade(check.message);
      else toast(check.message, "error");
      return;
    }
    setStep(0);
    setRunning(true);
    try {
      const r = await runJobMatch(text, content);
      recordUsage("job_match");
      saveJobMatch(resume.id, r);
      setEditing(false);
    } catch {
      toast("Job Match is unavailable right now. No credit was used.", "error");
    } finally {
      setRunning(false);
    }
  };

  if (running) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-line bg-white p-8 text-center">
        <div className="relative grid size-20 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-leaf/15" />
          <span className="grid size-14 place-items-center rounded-full bg-leaf-soft text-leaf">
            <Target className="size-7" />
          </span>
        </div>
        <p className="mt-6 font-medium text-ink" aria-live="polite">{STEPS[step]}</p>
        <p className="mt-1 text-[13px] text-muted">This takes a few seconds.</p>
      </div>
    );
  }

  if (editing || !result) {
    return (
      <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-leaf">
          <Target className="size-4" /> Job Match
        </div>
        <h3 className="mt-2 font-display text-xl font-medium text-ink">How well does this resume fit the job?</h3>
        <p className="mt-1 text-[14px] text-muted">Paste a job description to get a score, missing keywords and 3 tips.</p>
        <Textarea
          className="mt-4"
          minRows={9}
          value={jd}
          maxLength={MAX_JD}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description here…"
          aria-label="Job description"
        />
        <div className="mt-2 flex items-center justify-between text-[12px] text-muted">
          <button type="button" className="font-medium hover:text-ink" onClick={() => setJd(SAMPLE_JD)}>
            Use a sample job description
          </button>
          <span>{jd.length.toLocaleString()} / {MAX_JD.toLocaleString()}</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={() => run(jd)} disabled={!jd.trim()}>
            <Target className="size-4" /> Run Job Match
          </Button>
          {result && <Button variant="ghost" onClick={() => setEditing(false)}>Back to last result</Button>}
          <span className="ml-auto text-[12px] text-muted">{left === null ? "Unlimited on Pro" : `${left} free ${left === 1 ? "match" : "matches"} left`}</span>
        </div>
      </div>
    );
  }

  const fit = fitLabel(result.score);
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
        <div className="flex items-center gap-5">
          <ScoreRing key={result.createdAt} score={result.score} size={92} stroke={8} />
          <div className="min-w-0">
            <div className="text-[12px] font-medium uppercase tracking-wider text-muted">Match score</div>
            <div className={`mt-1 font-display text-xl font-medium ${fit.cls}`}>{fit.text}</div>
            <div className="mt-1 text-[12px] text-muted">Checked {timeAgo(result.createdAt)} · saved with this resume</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted">Missing keywords</div>
          {result.missingKeywords.length ? (
            <>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.missingKeywords.map((k) => {
                  const added = content.skills.some((s) => s.toLowerCase() === k.toLowerCase());
                  return (
                    <button
                      key={k}
                      type="button"
                      disabled={added}
                      onClick={() => {
                        onAddSkill(k);
                        toast(`Added ${k} to Skills`);
                      }}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] transition ${added ? "bg-leaf-soft text-leaf" : "bg-poppy-soft text-poppy hover:bg-[#fbd7c3]"}`}
                      title={added ? "In your skills" : "Add to Skills, if you have it"}
                    >
                      {added ? "✓" : <Plus className="size-3" />} {k}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[12px] text-muted">Click a keyword to add it to Skills. Only add what you&apos;ve really used.</p>
            </>
          ) : (
            <p className="mt-2 text-[14px] text-leaf">Your resume covers every key term in this job description.</p>
          )}
        </div>

        <div className="mt-6">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted">Tips</div>
          <ol className="mt-2 space-y-2.5">
            {result.tips.map((t, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-snug text-ink">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf-soft text-[11px] font-semibold text-leaf">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
          <Button size="sm" onClick={() => run(result.jobDescription)}>
            <Refresh className="size-3.5" /> Re-check with my edits
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setJd("");
              setEditing(true);
            }}
          >
            New job description
          </Button>
        </div>
      </div>

      <details className="group rounded-3xl border border-line bg-white p-5 text-[14px]">
        <summary className="cursor-pointer list-none font-medium text-ink">
          Job description used <span className="text-muted group-open:hidden">· show</span>
        </summary>
        <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-muted">{result.jobDescription}</p>
      </details>
    </div>
  );
}
