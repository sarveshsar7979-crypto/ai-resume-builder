"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRO_PRICE } from "@/lib/entitlements";
import { useDemo, upgradeToPro } from "@/lib/store";
import { closeCheckout, closeUpgrade, openCheckout, setActivatingPro, toast, useUi } from "@/lib/ui";
import { Card, Check, Sparkle } from "./icons";
import { Button, Input, Modal } from "./primitives";

const PRO_PERKS = ["Unlimited resumes", "Unlimited AI Improve", "Unlimited Job Match", "Cancel anytime"];

export function UpgradeModal() {
  const { upgrade } = useUi();
  return (
    <Modal open={upgrade.open} onClose={closeUpgrade} width="max-w-md">
      <div className="-mx-6 -mt-6 mb-5 rounded-t-3xl bg-[url(/hero/hero-poster.jpg)] bg-cover bg-[center_65%] px-6 pb-6 pt-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur">
          <Sparkle className="size-3 text-poppy" /> Meadow Pro
        </span>
      </div>
      <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
        {upgrade.reason ? "You've hit a Free limit" : "Upgrade to Pro"}
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">
        {upgrade.reason ?? "Everything you need for an active job search, for less than a lunch out."}
      </p>
      <ul className="mt-5 space-y-2.5 text-[14px] text-ink">
        {PRO_PERKS.map((p) => (
          <li key={p} className="flex items-center gap-2.5">
            <Check className="size-4 text-leaf" /> {p}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <span className="font-display text-3xl font-medium text-ink">${PRO_PRICE}</span>
          <span className="text-[13px] text-muted">/month</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={closeUpgrade}>Not now</Button>
          <Button onClick={openCheckout}>Upgrade</Button>
        </div>
      </div>
    </Modal>
  );
}

/** Stand-in for Stripe Checkout. After paying, the "webhook" activates Pro a moment later. */
export function CheckoutModal() {
  const { checkoutOpen } = useUi();
  const { account } = useDemo();
  const router = useRouter();
  const [paying, setPaying] = useState(false);

  const pay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1400));
    setPaying(false);
    closeCheckout();
    setActivatingPro(true);
    router.push("/dashboard");
    setTimeout(() => {
      upgradeToPro();
      setActivatingPro(false);
      toast("You're on Pro. Unlimited resumes and AI are unlocked.");
    }, 1800);
  };

  return (
    <Modal open={checkoutOpen} onClose={() => !paying && closeCheckout()} width="max-w-lg" hideClose={paying}>
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-medium text-muted">Checkout</div>
        <span className="mr-8 rounded-md bg-[#fdf1d6] px-2 py-0.5 text-[11px] font-medium text-[#9a6a0a]">Test mode · no real charge</span>
      </div>
      <div className="mt-4 rounded-2xl bg-cream p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="font-medium text-ink">Meadow Pro</div>
            <div className="text-[13px] text-muted">Billed monthly</div>
          </div>
          <div className="font-display text-2xl font-medium text-ink">${PRO_PRICE}.00</div>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div>
          <div className="mb-1.5 text-[12px] font-medium text-ink/80">Email</div>
          <Input value={account.email} readOnly />
        </div>
        <div>
          <div className="mb-1.5 text-[12px] font-medium text-ink/80">Card</div>
          <div className="relative">
            <Card className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input defaultValue="4242 4242 4242 4242" className="pl-9" aria-label="Card number" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input defaultValue="12 / 29" aria-label="Expiry" />
            <Input defaultValue="123" aria-label="CVC" />
          </div>
        </div>
      </div>
      <Button className="mt-6 w-full" onClick={pay} loading={paying}>
        {paying ? "Processing…" : `Subscribe · $${PRO_PRICE}/month`}
      </Button>
      <p className="mt-3 text-center text-[12px] text-muted">Cancel anytime from Settings. Pro lasts until the end of the paid month.</p>
    </Modal>
  );
}
