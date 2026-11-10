"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeContent } from "@/lib/types";

export const PAGE_W = 816; // US Letter at 96dpi
export const PAGE_H = 1056;

/** The one ATS-friendly template: single column, real text, plain headings. */
export function ResumeDocument({ content }: { content: ResumeContent }) {
  const { contact, summary, experience, education, skills } = content;
  const contactLine = [contact.email, contact.phone, contact.location, contact.website].filter(Boolean);
  const exp = experience.filter((e) => e.role || e.company || e.bullets.some((b) => b.trim()));
  const edu = education.filter((e) => e.school || e.degree);
  const empty = !contact.fullName && !summary && !exp.length && !edu.length && !skills.length;

  return (
    <div className="resume-doc px-[64px] py-[56px] font-sans text-[11.5px] leading-[1.5] text-[#1d1f24]">
      <header>
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#111]">
          {contact.fullName || <span className="text-[#c9c4bb]">Your name</span>}
        </h1>
        {contact.title && <div className="mt-0.5 text-[13.5px] text-[#4a4e57]">{contact.title}</div>}
        {contactLine.length > 0 && <div className="mt-2 text-[11px] text-[#4a4e57]">{contactLine.join("  ·  ")}</div>}
      </header>

      {empty && <p className="mt-10 text-center text-[13px] text-[#a9a49b]">Start filling in the form. Your resume appears here as you type.</p>}

      {summary.trim() && (
        <Section title="Summary">
          <p>{summary}</p>
        </Section>
      )}

      {exp.length > 0 && (
        <Section title="Experience">
          <div className="space-y-3.5">
            {exp.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="font-semibold text-[#111]">{e.role || "Role"}</span>
                    {e.company && <span className="text-[#33363d]">, {e.company}</span>}
                  </div>
                  <div className="shrink-0 text-[10.5px] text-[#5a5e67]">{[e.start, e.end].filter(Boolean).join(" – ")}</div>
                </div>
                {e.location && <div className="text-[10.5px] text-[#5a5e67]">{e.location}</div>}
                <ul className="mt-1 list-disc space-y-0.5 pl-4 marker:text-[#8a8e97]">
                  {e.bullets.filter((b) => b.trim()).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {edu.length > 0 && (
        <Section title="Education">
          <div className="space-y-2.5">
            {edu.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="font-semibold text-[#111]">{e.degree || "Degree"}</span>
                    {e.school && <span className="text-[#33363d]">, {e.school}</span>}
                  </div>
                  <div className="shrink-0 text-[10.5px] text-[#5a5e67]">{[e.start, e.end].filter(Boolean).join(" – ")}</div>
                </div>
                {e.details && <div className="text-[#33363d]">{e.details}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p>{skills.join(", ")}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-[#d9d5ce] pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#33363d]">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/** A paper page scaled to fit its container's width. */
export function ScaledPage({ content, maxHeight, className = "" }: { content: ResumeContent; maxHeight?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [h, setH] = useState(PAGE_H);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(el.clientWidth / PAGE_W);
      setH(Math.max(PAGE_H, inner.current?.scrollHeight ?? PAGE_H));
    });
    ro.observe(el);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  const height = h * scale;
  return (
    <div ref={box} className={`relative w-full overflow-hidden bg-white ${className}`} style={{ height: maxHeight ? Math.min(height, maxHeight) : height }}>
      <div ref={inner} className="absolute left-0 top-0 origin-top-left" style={{ width: PAGE_W, minHeight: PAGE_H, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}>
        <ResumeDocument content={content} />
        {h > PAGE_H && (
          <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#e2ddd4]" style={{ top: PAGE_H }}>
            <span className="absolute right-3 top-1 text-[10px] text-[#b5b0a6]">Page 2</span>
          </div>
        )}
      </div>
    </div>
  );
}
