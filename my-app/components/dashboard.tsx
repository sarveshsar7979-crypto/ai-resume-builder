"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/app/_components/ui";
import { canCreateResume, usageSummary } from "@/lib/entitlements";
import { formatDate, timeAgo } from "@/lib/format";
import { createResume, deleteResume, duplicateResume, renameResume, useDemo } from "@/lib/store";
import type { Resume } from "@/lib/types";
import { openUpgrade, toast } from "@/lib/ui";
import { Copy, More, Pencil, Plus, Sparkle, Trash } from "./icons";
import { Button, Input, Meter, Modal, ScoreBadge } from "./primitives";
import { ScaledPage } from "./resume-page";

function useNewResume() {
  const state = useDemo();
  const router = useRouter();
  return () => {
    const check = canCreateResume(state);
    if (!check.ok) return openUpgrade(check.message);
    const id = createResume();
    router.push(`/resumes/${id}`);
  };
}

function CardMenu({ resume, onRename, onDelete }: { resume: Resume; onRename: () => void; onDelete: () => void }) {
  const state = useDemo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  const item = "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] hover:bg-cream";
  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink"
        aria-label={`Options for ${resume.title}`}
      >
        <More className="size-4" />
      </button>
      {open && (
        <div className="anim-pop absolute bottom-10 right-0 z-20 w-44 rounded-2xl border border-line bg-white p-1.5 shadow-xl">
          <button className={item} onClick={() => { setOpen(false); onRename(); }}>
            <Pencil className="size-4 text-muted" /> Rename
          </button>
          <button
            className={item}
            onClick={() => {
              setOpen(false);
              const check = canCreateResume(state);
              if (!check.ok) return openUpgrade(check.message);
              duplicateResume(resume.id);
              toast("Resume duplicated");
            }}
          >
            <Copy className="size-4 text-muted" /> Duplicate
          </button>
          <button className={`${item} text-[#c2352b]`} onClick={() => { setOpen(false); onDelete(); }}>
            <Trash className="size-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ResumeCard({ resume, onRename, onDelete }: { resume: Resume; onRename: () => void; onDelete: () => void }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-28px_rgba(20,20,30,0.4)]">
      <Link href={`/resumes/${resume.id}`} className="block bg-cream px-6 pt-6" aria-label={`Open ${resume.title}`}>
        <div className="overflow-hidden rounded-t-lg shadow-[0_6px_24px_-10px_rgba(20,20,30,0.25)] ring-1 ring-line">
          <ScaledPage content={resume.content} maxHeight={230} />
        </div>
      </Link>
      <div className="flex items-center gap-3 border-t border-line px-5 py-4">
        <Link href={`/resumes/${resume.id}`} className="min-w-0 flex-1">
          <div className="truncate font-medium text-ink">{resume.title}</div>
          <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted">
            Edited {timeAgo(resume.updatedAt)}
            {resume.lastJobMatch && <ScoreBadge score={resume.lastJobMatch.score} />}
          </div>
        </Link>
        <CardMenu resume={resume} onRename={onRename} onDelete={onDelete} />
      </div>
    </div>
  );
}

export function Dashboard() {
  const state = useDemo();
  const newResume = useNewResume();
  const usage = usageSummary(state);
  const [renaming, setRenaming] = useState<Resume | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleting, setDeleting] = useState<Resume | null>(null);
  const firstName = state.account.name.split(" ")[0];
  const resumes = [...state.resumes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-28 pt-8 sm:px-6 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[14px] text-muted">Welcome back, {firstName}</p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-[-0.02em] text-ink">Your resumes</h1>
        </div>
        {resumes.length > 0 && (
          <Button onClick={newResume}>
            <Plus className="size-4" /> New resume
          </Button>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* resumes */}
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white px-6 py-20 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-poppy-soft">
              <Logo className="size-9" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-medium text-ink">Create your first resume</h2>
            <p className="mt-2 max-w-sm text-[15px] text-muted">
              Fill in a simple form and watch your resume take shape beside it. It takes about ten minutes.
            </p>
            <Button className="mt-6" onClick={newResume}>
              <Plus className="size-4" /> Create your first resume
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {resumes.map((r) => (
              <ResumeCard
                key={r.id}
                resume={r}
                onRename={() => {
                  setRenaming(r);
                  setRenameValue(r.title);
                }}
                onDelete={() => setDeleting(r)}
              />
            ))}
            <button
              onClick={newResume}
              className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-ink/15 text-muted transition hover:border-ink/30 hover:bg-white hover:text-ink"
            >
              <span className="grid size-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-line">
                <Plus className="size-5" />
              </span>
              <span className="text-[14px] font-medium">New resume</span>
            </button>
          </div>
        )}

        {/* plan + usage */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg font-medium text-ink">{usage.pro ? "Pro plan" : "Free plan"}</div>
              {usage.pro && state.account.currentPeriodEnd && (
                <span className="text-[12px] text-muted">
                  {state.account.subscriptionStatus === "canceling" ? "Ends" : "Renews"} {formatDate(state.account.currentPeriodEnd)}
                </span>
              )}
            </div>
            <div className="mt-4 space-y-4">
              <Meter label="Resumes" used={usage.resumes.used} limit={usage.resumes.limit} />
              <Meter label="AI Improve" used={usage.improve.used} limit={usage.improve.limit} />
              <Meter label="Job Match" used={usage.jobMatch.used} limit={usage.jobMatch.limit} />
            </div>
            <p className="mt-4 text-[12px] text-muted">PDF downloads are always free and unlimited.</p>
          </div>
          {!usage.pro && (
            <div className="relative overflow-hidden rounded-3xl bg-ink p-5 text-white">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-poppy/40 blur-2xl" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-white/70">
                  <Sparkle className="size-3 text-poppy" /> Meadow Pro
                </div>
                <div className="mt-2 font-display text-xl font-medium">Apply everywhere, tailored every time.</div>
                <p className="mt-1.5 text-[13px] text-white/65">Unlimited resumes, AI Improve and Job Match for $12/month.</p>
                <Button variant="secondary" className="mt-4 w-full border-0" onClick={() => openUpgrade()}>
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>

      <Modal open={!!renaming} onClose={() => setRenaming(null)} title="Rename resume">
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (renaming) renameResume(renaming.id, renameValue);
            setRenaming(null);
            toast("Renamed");
          }}
        >
          <Input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} maxLength={80} aria-label="Resume name" />
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setRenaming(null)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete this resume?">
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          “{deleting?.title}” and its saved Job Match will be permanently deleted. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleting) deleteResume(deleting.id);
              setDeleting(null);
              toast("Resume deleted");
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </main>
  );
}
