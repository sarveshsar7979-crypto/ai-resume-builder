"use client";

import { useState, type ReactNode } from "react";
import { uid } from "@/lib/seed";
import type { Education, Experience, ResumeContent } from "@/lib/types";
import { Check, ChevronDown, ChevronUp, Plus, Trash, X } from "../icons";
import { Button, Field, Input, Textarea } from "../primitives";
import { AiTextarea } from "./ai-textarea";

type Update = (fn: (c: ResumeContent) => ResumeContent) => void;

export const SECTIONS = [
  { id: "contact", label: "Contact" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
] as const;

export function sectionDone(c: ResumeContent, id: (typeof SECTIONS)[number]["id"]) {
  switch (id) {
    case "contact": return !!(c.contact.fullName && c.contact.email);
    case "summary": return c.summary.trim().length > 20;
    case "experience": return c.experience.some((e) => e.role && e.company && e.bullets.some((b) => b.trim()));
    case "education": return c.education.some((e) => e.school && e.degree);
    case "skills": return c.skills.length >= 3;
  }
}

function Section({ id, title, description, done, children, action }: { id: string; title: string; description: string; done: boolean; children: ReactNode; action?: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36 rounded-3xl border border-line bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-medium text-ink">
            {title}
            {done && (
              <span className="grid size-4 place-items-center rounded-full bg-leaf text-white" title="Looks complete">
                <Check className="size-2.5" strokeWidth={2.4} />
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-[13px] text-muted">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EntryCard({
  title,
  subtitle,
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  title: string;
  subtitle: string;
  index: number;
  count: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const iconBtn = "grid size-8 place-items-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className="rounded-2xl border border-line bg-cream/60">
      <div className="flex items-center gap-1 py-2 pl-4 pr-2">
        <button type="button" onClick={() => setOpen((o) => !o)} className="min-w-0 flex-1 py-1 text-left" aria-expanded={open}>
          <div className="truncate text-[14px] font-medium text-ink">{title}</div>
          <div className="truncate text-[12px] text-muted">{subtitle}</div>
        </button>
        <button type="button" className={iconBtn} onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up"><ChevronUp className="size-4" /></button>
        <button type="button" className={iconBtn} onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Move down"><ChevronDown className="size-4" /></button>
        <button type="button" className={`${iconBtn} hover:text-[#c2352b]`} onClick={onRemove} aria-label="Remove entry"><Trash className="size-4" /></button>
      </div>
      {open && <div className="border-t border-line p-4">{children}</div>}
    </div>
  );
}

const move = <T,>(arr: T[], i: number, dir: -1 | 1) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [text, setText] = useState("");
  const add = (raw: string) => {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const next = [...skills];
    for (const p of parts) if (!next.some((s) => s.toLowerCase() === p.toLowerCase())) next.push(p);
    onChange(next);
    setText("");
  };
  return (
    <div className="rounded-xl border border-line bg-white p-2 transition focus-within:border-ink/30 focus-within:ring-4 focus-within:ring-ink/5">
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 rounded-full bg-cream py-1 pl-3 pr-1 text-[13px] text-ink ring-1 ring-line">
            {s}
            <button type="button" onClick={() => onChange(skills.filter((x) => x !== s))} className="grid size-5 place-items-center rounded-full text-muted hover:bg-black/5 hover:text-ink" aria-label={`Remove ${s}`}>
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setText(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (text.trim()) add(text);
            } else if (e.key === "Backspace" && !text && skills.length) {
              onChange(skills.slice(0, -1));
            }
          }}
          onBlur={() => text.trim() && add(text)}
          placeholder={skills.length ? "Add another" : "e.g. React, SQL, Figma"}
          className="h-8 min-w-[140px] flex-1 bg-transparent px-2 text-[14px] text-ink outline-none placeholder:text-muted/60"
          aria-label="Add a skill"
        />
      </div>
    </div>
  );
}

export function ResumeForm({ content, update }: { content: ResumeContent; update: Update }) {
  const c = content;
  const setContact = (k: keyof ResumeContent["contact"], v: string) => update((d) => ({ ...d, contact: { ...d.contact, [k]: v } }));
  const setExp = (id: string, patch: Partial<Experience>) =>
    update((d) => ({ ...d, experience: d.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const setEdu = (id: string, patch: Partial<Education>) =>
    update((d) => ({ ...d, education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));

  return (
    <div className="space-y-5">
      <Section id="contact" title="Contact" description="How recruiters reach you." done={sectionDone(c, "contact")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">{(id) => <Input id={id} value={c.contact.fullName} onChange={(e) => setContact("fullName", e.target.value)} placeholder="Alex Rivera" />}</Field>
          <Field label="Job title">{(id) => <Input id={id} value={c.contact.title} onChange={(e) => setContact("title", e.target.value)} placeholder="Frontend Engineer" />}</Field>
          <Field label="Email">{(id) => <Input id={id} type="email" value={c.contact.email} onChange={(e) => setContact("email", e.target.value)} placeholder="you@example.com" />}</Field>
          <Field label="Phone">{(id) => <Input id={id} value={c.contact.phone} onChange={(e) => setContact("phone", e.target.value)} placeholder="(555) 555-0100" />}</Field>
          <Field label="Location">{(id) => <Input id={id} value={c.contact.location} onChange={(e) => setContact("location", e.target.value)} placeholder="City, State" />}</Field>
          <Field label="Website or LinkedIn" hint="Optional">{(id) => <Input id={id} value={c.contact.website} onChange={(e) => setContact("website", e.target.value)} placeholder="linkedin.com/in/you" />}</Field>
        </div>
      </Section>

      <Section id="summary" title="Summary" description="Two or three lines on who you are and what you're great at." done={sectionDone(c, "summary")}>
        <AiTextarea
          kind="summary"
          label="Summary"
          value={c.summary}
          onChange={(v) => update((d) => ({ ...d, summary: v }))}
          content={c}
          minRows={3}
          placeholder="Frontend engineer with 5 years of experience…"
        />
        <p className="mt-2 text-[12px] text-muted">Tip: leave it empty and press Improve to draft one from the rest of your resume.</p>
      </Section>

      <Section
        id="experience"
        title="Experience"
        description="Most recent first. Lead with results."
        done={sectionDone(c, "experience")}
        action={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => update((d) => ({ ...d, experience: [...d.experience, { id: uid(), role: "", company: "", location: "", start: "", end: "", bullets: [""] }] }))}
          >
            <Plus className="size-3.5" /> Add role
          </Button>
        }
      >
        <div className="space-y-3">
          {c.experience.length === 0 && <p className="text-[14px] text-muted">No roles yet. Add your most recent job.</p>}
          {c.experience.map((e, i) => (
            <EntryCard
              key={e.id}
              title={e.role || "New role"}
              subtitle={[e.company, [e.start, e.end].filter(Boolean).join(" – ")].filter(Boolean).join(" · ") || "Company · Dates"}
              index={i}
              count={c.experience.length}
              onMove={(dir) => update((d) => ({ ...d, experience: move(d.experience, i, dir) }))}
              onRemove={() => update((d) => ({ ...d, experience: d.experience.filter((x) => x.id !== e.id) }))}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Role">{(id) => <Input id={id} value={e.role} onChange={(ev) => setExp(e.id, { role: ev.target.value })} placeholder="Senior Frontend Engineer" />}</Field>
                <Field label="Company">{(id) => <Input id={id} value={e.company} onChange={(ev) => setExp(e.id, { company: ev.target.value })} placeholder="Company name" />}</Field>
                <Field label="Location" className="sm:col-span-2">{(id) => <Input id={id} value={e.location} onChange={(ev) => setExp(e.id, { location: ev.target.value })} placeholder="City or Remote" />}</Field>
                <Field label="Start">{(id) => <Input id={id} value={e.start} onChange={(ev) => setExp(e.id, { start: ev.target.value })} placeholder="Mar 2022" />}</Field>
                <Field
                  label="End"
                  hint={
                    <label className="inline-flex cursor-pointer items-center gap-1.5">
                      <input type="checkbox" className="accent-ink" checked={e.end === "Present"} onChange={(ev) => setExp(e.id, { end: ev.target.checked ? "Present" : "" })} />
                      I work here now
                    </label>
                  }
                >
                  {(id) => <Input id={id} value={e.end} disabled={e.end === "Present"} onChange={(ev) => setExp(e.id, { end: ev.target.value })} placeholder="Present" className="disabled:bg-cream disabled:text-muted" />}
                </Field>
              </div>
              <div className="mt-5">
                <div className="mb-2 text-[12px] font-medium text-ink/80">Bullet points</div>
                <div className="space-y-2.5">
                  {e.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-2">
                      <span className="mt-[18px] size-1.5 shrink-0 rounded-full bg-ink/40" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <AiTextarea
                          kind="bullet"
                          label={`Bullet ${bi + 1} for ${e.role || "this role"}`}
                          value={b}
                          onChange={(v) => setExp(e.id, { bullets: e.bullets.map((x, xi) => (xi === bi ? v : x)) })}
                          content={c}
                          minRows={1}
                          placeholder="What did you do, and what changed because of it?"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setExp(e.id, { bullets: e.bullets.filter((_, xi) => xi !== bi) })}
                        className="mt-1.5 grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-black/5 hover:text-[#c2352b]"
                        aria-label="Remove bullet"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setExp(e.id, { bullets: [...e.bullets, ""] })}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"
                >
                  <Plus className="size-3.5" /> Add bullet
                </button>
              </div>
            </EntryCard>
          ))}
        </div>
      </Section>

      <Section
        id="education"
        title="Education"
        description="Degrees, bootcamps or certificates."
        done={sectionDone(c, "education")}
        action={
          <Button size="sm" variant="secondary" onClick={() => update((d) => ({ ...d, education: [...d.education, { id: uid(), school: "", degree: "", start: "", end: "", details: "" }] }))}>
            <Plus className="size-3.5" /> Add
          </Button>
        }
      >
        <div className="space-y-3">
          {c.education.length === 0 && <p className="text-[14px] text-muted">Nothing here yet.</p>}
          {c.education.map((e, i) => (
            <EntryCard
              key={e.id}
              title={e.degree || "New entry"}
              subtitle={e.school || "School"}
              index={i}
              count={c.education.length}
              onMove={(dir) => update((d) => ({ ...d, education: move(d.education, i, dir) }))}
              onRemove={() => update((d) => ({ ...d, education: d.education.filter((x) => x.id !== e.id) }))}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="School">{(id) => <Input id={id} value={e.school} onChange={(ev) => setEdu(e.id, { school: ev.target.value })} placeholder="University name" />}</Field>
                <Field label="Degree">{(id) => <Input id={id} value={e.degree} onChange={(ev) => setEdu(e.id, { degree: ev.target.value })} placeholder="B.S. Computer Science" />}</Field>
                <Field label="Start">{(id) => <Input id={id} value={e.start} onChange={(ev) => setEdu(e.id, { start: ev.target.value })} placeholder="2015" />}</Field>
                <Field label="End">{(id) => <Input id={id} value={e.end} onChange={(ev) => setEdu(e.id, { end: ev.target.value })} placeholder="2019" />}</Field>
                <Field label="Details" hint="Optional" className="sm:col-span-2">
                  {(id) => <Textarea id={id} minRows={1} value={e.details} onChange={(ev) => setEdu(e.id, { details: ev.target.value })} placeholder="Honors, GPA, activities" />}
                </Field>
              </div>
            </EntryCard>
          ))}
        </div>
      </Section>

      <Section id="skills" title="Skills" description="Press Enter or comma to add. Match the words used in job posts." done={sectionDone(c, "skills")}>
        <SkillsInput skills={c.skills} onChange={(skills) => update((d) => ({ ...d, skills }))} />
      </Section>
    </div>
  );
}
