import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "./site";
import { Logo } from "./ui";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="flex-1">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-5">
          <Link href="/" className="flex items-center gap-1.5 font-display text-[16px] font-semibold text-ink">
            <Logo className="size-5" /> {SITE.name}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="font-display text-4xl font-medium tracking-[-0.02em] text-ink">{title}</h1>
        <p className="mt-2 text-[14px] text-muted">Last updated {updated}</p>
        <p className="mt-6 rounded-xl bg-[#fdf1d6] px-4 py-3 text-[13px] text-[#7a560c]">
          Placeholder text. Replace it with your real {title.toLowerCase()} before launch.
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/85 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-ink">
          {children}
        </div>
      </main>
    </div>
  );
}
