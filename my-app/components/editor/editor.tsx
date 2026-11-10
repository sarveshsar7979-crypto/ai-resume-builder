"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { saveResume, useDemo } from "@/lib/store";
import type { Resume, ResumeContent } from "@/lib/types";
import { toast } from "@/lib/ui";
import { ArrowLeft, Check, Download, Eye, Target, X } from "../icons";
import { Button, ScoreBadge, Spinner } from "../primitives";
import { ResumeDocument, ScaledPage } from "../resume-page";
import { JobMatchPanel } from "./job-match-panel";
import { ResumeForm, SECTIONS, sectionDone } from "./resume-form";

type Status = "saved" | "pending" | "saving";
type Tab = "preview" | "match";

function SaveStatus({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted" aria-live="polite">
      {status === "saved" ? (
        <><Check className="size-3.5 text-leaf" /> Saved</>
      ) : status === "saving" ? (
        <><Spinner className="size-3" /> Saving…</>
      ) : (
        <><span className="size-1.5 rounded-full bg-[#d6a21e]" /> Edited</>
      )}
    </span>
  );
}

function Tabs({ tab, setTab, resume }: { tab: Tab; setTab: (t: Tab) => void; resume: Resume }) {
  const cls = (t: Tab) =>
    `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${tab === t ? "bg-white text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink"}`;
  return (
    <div className="inline-flex gap-1 rounded-full bg-black/[0.04] p-1">
      <button className={cls("preview")} onClick={() => setTab("preview")}><Eye className="size-4" /> Preview</button>
      <button className={cls("match")} onClick={() => setTab("match")}>
        <Target className="size-4" /> Job Match {resume.lastJobMatch && <ScoreBadge score={resume.lastJobMatch.score} />}
      </button>
    </div>
  );
}

function SidePanel({ tab, resume, content, onAddSkill }: { tab: Tab; resume: Resume; content: ResumeContent; onAddSkill: (s: string) => void }) {
  if (tab === "match") return <JobMatchPanel resume={resume} content={content} onAddSkill={onAddSkill} />;
  return (
    <div className="overflow-hidden rounded-xl shadow-[0_30px_60px_-30px_rgba(20,20,30,0.35)] ring-1 ring-line">
      <ScaledPage content={content} />
    </div>
  );
}

function EditorBody({ resume }: { resume: Resume }) {
  const [title, setTitle] = useState(resume.title);
  const [content, setContent] = useState<ResumeContent>(() => structuredClone(resume.content));
  const [status, setStatus] = useState<Status>("saved");
  const [tab, setTab] = useState<Tab>("preview");
  const [sheet, setSheet] = useState<Tab | null>(null);
  const latest = useRef({ title, content, status });
  useEffect(() => {
    latest.current = { title, content, status };
  });

  const update = useCallback((fn: (c: ResumeContent) => ResumeContent) => {
    setContent((c) => fn(c));
    setStatus("pending");
  }, []);

  // Autosave about 1s after typing stops.
  useEffect(() => {
    if (status !== "pending") return;
    let inner: ReturnType<typeof setTimeout> | undefined;
    const t = setTimeout(() => {
      setStatus("saving");
      inner = setTimeout(() => {
        saveResume(resume.id, { title: latest.current.title, content: latest.current.content });
        setStatus((s) => (s === "saving" ? "saved" : s));
      }, 450);
    }, 1000);
    return () => {
      clearTimeout(t);
      clearTimeout(inner);
    };
  }, [status, content, title, resume.id]);

  // Never lose edits: flush on leave and on tab close.
  useEffect(() => {
    const flush = () => {
      if (latest.current.status !== "saved") saveResume(resume.id, { title: latest.current.title, content: latest.current.content });
    };
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [resume.id]);

  const download = () => {
    const prev = document.title;
    document.title = (title || "Resume").replace(/[\\/:*?"<>|]/g, "");
    toast("Choose “Save as PDF” in the print dialog", "info");
    setTimeout(() => {
      window.print();
      document.title = prev;
    }, 300);
  };

  const addSkill = (s: string) => update((c) => (c.skills.some((x) => x.toLowerCase() === s.toLowerCase()) ? c : { ...c, skills: [...c.skills, s] }));
  const done = SECTIONS.filter((s) => sectionDone(content, s.id)).length;

  return (
    <div className="flex-1 pb-36 sm:pb-16">
      {/* toolbar */}
      <div className="sticky top-14 z-30 border-b border-line/80 bg-background/90 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-4 sm:gap-3 sm:px-6">
          <Link href="/dashboard" className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink" aria-label="Back to resumes">
            <ArrowLeft className="size-4" />
          </Link>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setStatus("pending");
            }}
            onBlur={() => !title.trim() && setTitle("Untitled resume")}
            maxLength={80}
            className="min-w-0 max-w-[340px] flex-1 truncate rounded-lg bg-transparent px-2 py-1 font-display text-[17px] font-medium text-ink outline-none transition hover:bg-black/[0.03] focus:bg-white focus:ring-1 focus:ring-line"
            aria-label="Resume title"
          />
          <SaveStatus status={status} />
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden lg:block">
              <Button size="sm" variant="secondary" onClick={() => setTab(tab === "match" ? "preview" : "match")}>
                <Target className="size-3.5" /> {tab === "match" ? "Show preview" : "Job Match"}
              </Button>
            </div>
            <Button size="sm" onClick={download}>
              <Download className="size-3.5" /> <span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)] gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] print:hidden">
        {/* form */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[12px] font-medium text-muted transition hover:text-ink"
                >
                  <span className={`size-1.5 rounded-full ${sectionDone(content, s.id) ? "bg-leaf" : "bg-line"}`} />
                  {s.label}
                </a>
              ))}
            </div>
            <span className="hidden shrink-0 text-[12px] text-muted sm:block">{done}/{SECTIONS.length} done</span>
          </div>
          <ResumeForm content={content} update={update} />
        </div>

        {/* preview / job match (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-[132px] max-h-[calc(100vh-148px)] overflow-y-auto pb-2 [scrollbar-width:thin]">
            <div className="mb-4 flex items-center justify-between">
              <Tabs tab={tab} setTab={setTab} resume={resume} />
              {tab === "preview" && <span className="text-[12px] text-muted">US Letter · ATS-friendly</span>}
            </div>
            <SidePanel tab={tab} resume={resume} content={content} onAddSkill={addSkill} />
          </div>
        </div>
      </div>

      {/* mobile: preview + job match buttons, full-screen sheet */}
      <div className="fixed inset-x-0 bottom-[60px] z-30 flex justify-center gap-2 px-4 lg:hidden print:hidden">
        <Button className="shadow-lg" onClick={() => setSheet("preview")}><Eye className="size-4" /> Preview</Button>
        <Button variant="secondary" className="shadow-lg" onClick={() => setSheet("match")}><Target className="size-4" /> Job Match</Button>
      </div>
      {sheet && (
        <div className="anim-fade fixed inset-0 z-[70] flex flex-col bg-background lg:hidden print:hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <Tabs tab={sheet} setTab={setSheet} resume={resume} />
            <button onClick={() => setSheet(null)} className="grid size-9 place-items-center rounded-full text-muted hover:bg-black/5" aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <SidePanel tab={sheet} resume={resume} content={content} onAddSkill={addSkill} />
          </div>
        </div>
      )}

      {/* print copy, unscaled (Download PDF uses the browser's Save as PDF) */}
      {createPortal(
        <div id="print-root">
          <ResumeDocument content={content} />
        </div>,
        document.body,
      )}
    </div>
  );
}

export function Editor() {
  const { id } = useParams<{ id: string }>();
  const { resumes } = useDemo();
  const resume = resumes.find((r) => r.id === id);

  if (!resume) {
    return (
      <main className="grid flex-1 place-items-center px-6 py-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">Resume not found</h1>
          <p className="mt-2 text-muted">It may have been deleted, or the link is wrong.</p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white">Back to resumes</Link>
        </div>
      </main>
    );
  }
  // key: remount with fresh draft state when switching resumes
  return <EditorBody key={resume.id} resume={resume} />;
}
