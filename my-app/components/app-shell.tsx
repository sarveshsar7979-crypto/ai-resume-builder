"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/app/_components/ui";
import { SITE } from "@/app/_components/site";
import { initials } from "@/lib/format";
import { signOut, useDemo, useHydrated } from "@/lib/store";
import { dismissToast, openUpgrade, useUi } from "@/lib/ui";
import { CheckoutModal, UpgradeModal } from "./billing";
import { Alert, Check, Gear, Grid, LogOut, Sparkle, X } from "./icons";
import { PlanBadge, Spinner } from "./primitives";

const LINKS = [
  { href: "/dashboard", label: "Resumes", icon: Grid },
  { href: "/settings", label: "Settings", icon: Gear },
];

function NavLinks({ pathname, variant }: { pathname: string; variant: "top" | "bottom" }) {
  return LINKS.map((l) => {
    const active = pathname.startsWith(l.href) || (l.href === "/dashboard" && pathname.startsWith("/resumes"));
    return variant === "top" ? (
      <Link
        key={l.href}
        href={l.href}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${active ? "bg-white text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink"}`}
      >
        <l.icon className="size-4" /> {l.label}
      </Link>
    ) : (
      <Link key={l.href} href={l.href} className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${active ? "text-ink" : "text-muted"}`}>
        <l.icon className="size-5" /> {l.label}
      </Link>
    );
  });
}

// usePathname suspends on routes with unknown params (/resumes/[id]), so it sits in its own Suspense.
function ActiveNavLinks({ variant }: { variant: "top" | "bottom" }) {
  return <NavLinks pathname={usePathname()} variant={variant} />;
}

function UserMenu() {
  const { account } = useDemo();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-full bg-violet text-[13px] font-semibold text-white ring-2 ring-white transition hover:opacity-90"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {initials(account.name)}
      </button>
      {open && (
        <div className="anim-pop absolute right-0 top-11 z-50 w-60 rounded-2xl border border-line bg-white p-1.5 shadow-xl">
          <div className="px-3 py-2">
            <div className="text-[14px] font-medium text-ink">{account.name}</div>
            <div className="truncate text-[12px] text-muted">{account.email}</div>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] text-ink hover:bg-cream">
            <Gear className="size-4 text-muted" /> Settings
          </Link>
          <button
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] text-ink hover:bg-cream"
          >
            <LogOut className="size-4 text-muted" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function Toasts() {
  const { toasts } = useUi();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="anim-pop pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2 pl-3 pr-2 text-[14px] text-white shadow-xl">
          <span className={`grid size-5 place-items-center rounded-full ${t.tone === "error" ? "bg-poppy" : t.tone === "info" ? "bg-white/20" : "bg-leaf"}`}>
            {t.tone === "error" ? <Alert className="size-3" /> : <Check className="size-3" />}
          </span>
          {t.message}
          <button onClick={() => dismissToast(t.id)} className="grid size-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white" aria-label="Dismiss">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const { signedIn, account } = useDemo();
  const { activatingPro } = useUi();
  const router = useRouter();

  // Stand-in for the auth check in proxy + server actions.
  useEffect(() => {
    if (hydrated && !signedIn) router.replace("/sign-in");
  }, [hydrated, signedIn, router]);

  const pro = account.plan === "pro";
  const ready = hydrated && signedIn;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-1.5 font-display text-[16px] font-semibold text-ink">
            <Logo className="size-5" /> {SITE.name}
          </Link>
          <nav className="ml-2 hidden items-center gap-1 sm:flex">
            <Suspense fallback={<NavLinks pathname="" variant="top" />}>
              <ActiveNavLinks variant="top" />
            </Suspense>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {ready && <PlanBadge pro={pro} />}
            {ready && !pro && (
              <button
                onClick={() => openUpgrade()}
                className="hidden items-center gap-1.5 rounded-full bg-poppy px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-[#d94d13] sm:inline-flex"
              >
                <Sparkle className="size-3" /> Upgrade
              </button>
            )}
            {ready && <UserMenu />}
          </div>
        </div>
      </header>

      {activatingPro && (
        <div className="anim-fade border-b border-line bg-violet-soft">
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-2.5 text-[13px] text-violet">
            <Spinner /> Payment received. Activating Pro…
          </div>
        </div>
      )}

      {/* Always render the page; each page waits for sign-in via <SignedIn>. */}
      {children}

      {/* mobile tab bar */}
      {ready && (
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white/95 backdrop-blur sm:hidden print:hidden">
          <Suspense fallback={<NavLinks pathname="" variant="bottom" />}>
            <ActiveNavLinks variant="bottom" />
          </Suspense>
        </nav>
      )}

      <UpgradeModal />
      <CheckoutModal />
      <Toasts />
    </div>
  );
}
