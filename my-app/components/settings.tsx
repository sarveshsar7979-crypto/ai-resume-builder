"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { PRO_PRICE, usageSummary } from "@/lib/entitlements";
import { formatDate, initials } from "@/lib/format";
import { cancelSubscription, deleteAccount, endBillingPeriod, renewSubscription, resetDemo, useDemo } from "@/lib/store";
import { openUpgrade, setNotice, toast } from "@/lib/ui";
import { Google, Sparkle } from "./icons";
import { Button, Input, Meter, Modal, PlanBadge } from "./primitives";

function Panel({ title, description, children, tone }: { title: string; description?: string; children: ReactNode; tone?: "danger" }) {
  return (
    <section className={`rounded-3xl border bg-white p-5 sm:p-6 ${tone === "danger" ? "border-[#f0c9c4]" : "border-line"}`}>
      <h2 className={`font-display text-lg font-medium ${tone === "danger" ? "text-[#c2352b]" : "text-ink"}`}>{title}</h2>
      {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Stand-in for the Stripe Customer Portal. */
function BillingPortal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { account } = useDemo();
  const canceling = account.subscriptionStatus === "canceling";
  const end = account.currentPeriodEnd ? formatDate(account.currentPeriodEnd) : "";
  const invoices = [0, 1].map((m) => {
    const d = new Date(account.currentPeriodEnd ?? account.createdAt);
    d.setMonth(d.getMonth() - 1 - m);
    return formatDate(d.toISOString());
  });
  return (
    <Modal open={open} onClose={onClose} title="Billing" width="max-w-lg">
      <div className="mt-1 text-[12px] text-muted">Managed by Stripe · test mode</div>
      <div className="mt-5 rounded-2xl bg-cream p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-ink">Meadow Pro</div>
            <div className="text-[13px] text-muted">${PRO_PRICE}.00 per month</div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${canceling ? "bg-[#fdf1d6] text-[#9a6a0a]" : "bg-leaf-soft text-leaf"}`}>
            {canceling ? `Cancels ${end}` : "Active"}
          </span>
        </div>
        <p className="mt-3 text-[13px] text-muted">
          {canceling ? `You'll keep Pro until ${end}, then move to Free. Your resumes stay.` : `Next payment of $${PRO_PRICE}.00 on ${end}.`}
        </p>
      </div>
      <div className="mt-5">
        <div className="text-[12px] font-medium uppercase tracking-wider text-muted">Invoices</div>
        <ul className="mt-2 divide-y divide-line text-[14px]">
          {invoices.map((d) => (
            <li key={d} className="flex items-center justify-between py-2.5">
              <span className="text-ink">{d}</span>
              <span className="text-muted">${PRO_PRICE}.00 · Paid</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        {canceling ? (
          <Button
            onClick={() => {
              renewSubscription();
              toast("Your Pro plan will renew as normal");
            }}
          >
            Keep my Pro plan
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => {
              cancelSubscription();
              toast(`Canceled. Pro stays active until ${end}.`, "info");
            }}
          >
            Cancel plan
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
}

export function Settings() {
  const state = useDemo();
  const { account } = state;
  const usage = usageSummary(state);
  const router = useRouter();
  const [portal, setPortal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const end = account.currentPeriodEnd ? formatDate(account.currentPeriodEnd) : null;

  const doDelete = async () => {
    setDeleting(true);
    // Real flow: cancel Stripe subscription → delete resumes, usage, account → delete auth user → sign out.
    await new Promise((r) => setTimeout(r, 1200));
    deleteAccount();
    setNotice("Your account and all your data were deleted.");
    router.replace("/sign-in");
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-8 sm:px-6 sm:pt-12">
      <h1 className="font-display text-4xl font-medium tracking-[-0.02em] text-ink">Settings</h1>

      <div className="mt-8 space-y-5">
        <Panel title="Profile" description="From your Google account.">
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full bg-violet text-[16px] font-semibold text-white">{initials(account.name)}</div>
            <div className="min-w-0">
              <div className="font-medium text-ink">{account.name}</div>
              <div className="truncate text-[14px] text-muted">{account.email}</div>
            </div>
            <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[12px] text-muted sm:inline-flex">
              <Google className="size-3.5" /> Google
            </span>
          </div>
        </Panel>

        <Panel title="Plan & billing">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{usage.pro ? "Pro" : "Free"}</span>
                <PlanBadge pro={usage.pro} />
              </div>
              <p className="mt-1 text-[14px] text-muted">
                {!usage.pro && "1 resume, 5 AI Improves and 1 Job Match. Downloads are always free."}
                {usage.pro && account.subscriptionStatus === "active" && `$${PRO_PRICE}/month · renews ${end}`}
                {usage.pro && account.subscriptionStatus === "canceling" && `Canceled · Pro until ${end}, then Free`}
              </p>
            </div>
            {usage.pro ? (
              <Button variant="secondary" onClick={() => setPortal(true)}>Manage billing</Button>
            ) : (
              <Button onClick={() => openUpgrade()}>
                <Sparkle className="size-3.5 text-poppy" /> Upgrade to Pro
              </Button>
            )}
          </div>
          <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <Meter label="Resumes" used={usage.resumes.used} limit={usage.resumes.limit} />
            <Meter label="AI Improve" used={usage.improve.used} limit={usage.improve.limit} />
            <Meter label="Job Match" used={usage.jobMatch.used} limit={usage.jobMatch.limit} />
          </div>
        </Panel>

        <Panel title="Demo controls" description="Only in this prototype. They stand in for things that happen over time or in Stripe.">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!usage.pro}
              onClick={() => {
                const wasCanceling = account.subscriptionStatus === "canceling";
                endBillingPeriod();
                toast(wasCanceling ? "Billing period ended. You're back on Free." : "Billing period ended. Pro renewed.", "info");
              }}
            >
              Skip to end of billing period
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                resetDemo();
                toast("Demo data reset");
              }}
            >
              Reset demo data
            </Button>
          </div>
        </Panel>

        <Panel title="Delete account" tone="danger" description="Cancels your subscription and permanently deletes your resumes, usage and account.">
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete my account</Button>
        </Panel>
      </div>

      <BillingPortal open={portal} onClose={() => setPortal(false)} />

      <Modal open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} title="Delete your account?" hideClose={deleting}>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">This will:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-ink">
          {usage.pro && <li>Cancel your Pro subscription right away</li>}
          <li>Delete {state.resumes.length} {state.resumes.length === 1 ? "resume" : "resumes"} and saved Job Matches</li>
          <li>Delete your usage history and account</li>
          <li>Sign you out</li>
        </ul>
        <p className="mt-4 text-[14px] text-muted">
          Type <span className="font-mono font-medium text-ink">DELETE</span> to confirm.
        </p>
        <Input className="mt-2" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-label="Type DELETE to confirm" autoComplete="off" />
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" disabled={deleting} onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" disabled={confirm !== "DELETE"} loading={deleting} onClick={doDelete}>
            {deleting ? "Deleting…" : "Delete forever"}
          </Button>
        </div>
      </Modal>
    </main>
  );
}
