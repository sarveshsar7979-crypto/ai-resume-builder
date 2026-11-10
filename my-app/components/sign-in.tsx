"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/app/_components/ui";
import { SITE } from "@/app/_components/site";
import { signIn, useDemo, useHydrated } from "@/lib/store";
import { setNotice, useUi } from "@/lib/ui";
import { Google } from "./icons";
import { Spinner } from "./primitives";

export function SignIn() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { signedIn } = useDemo();
  const { notice } = useUi();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && signedIn && !loading) router.replace("/dashboard");
  }, [hydrated, signedIn, loading, router]);

  const go = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // the Google OAuth round trip
    signIn();
    setNotice(null);
    router.push("/dashboard");
  };

  return (
    <main className="relative grid min-h-[100svh] flex-1 place-items-center overflow-hidden px-4 py-10">
      <Image src={SITE.heroImage} alt="" fill priority sizes="100vw" className="anim-drift object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(255,250,244,0.55),rgba(255,250,244,0.15))]" />

      <div className="anim-rise relative w-full max-w-sm rounded-3xl border border-white bg-white/95 p-8 text-center shadow-[0_40px_80px_-30px_rgba(20,20,30,0.5)] backdrop-blur">
        <Link href="/" className="inline-flex items-center gap-1.5 font-display text-[17px] font-semibold text-ink">
          <Logo className="size-6" /> {SITE.name}
        </Link>
        <h1 className="mt-6 font-display text-3xl font-medium tracking-[-0.02em] text-ink">Welcome</h1>
        <p className="mt-2 text-[15px] text-muted">Sign in to build, polish and save your resumes.</p>

        {notice && <p className="mt-5 rounded-xl bg-cream px-3 py-2 text-[13px] text-ink">{notice}</p>}

        <button
          onClick={go}
          disabled={loading}
          className="mt-7 flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-white text-[15px] font-medium text-ink shadow-sm transition hover:bg-cream disabled:opacity-70"
        >
          {loading ? <Spinner className="size-4" /> : <Google className="size-[18px]" />}
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        <p className="mt-6 text-[12px] leading-relaxed text-muted">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-ink">Terms</Link> and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy Policy</Link>.
        </p>
        <p className="mt-4 rounded-xl bg-[#fdf1d6] px-3 py-2 text-[12px] text-[#7a560c]">Demo: no real Google account is used. Data stays in this browser.</p>
      </div>
    </main>
  );
}
