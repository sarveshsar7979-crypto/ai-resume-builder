// Plan rules: the single source of truth for limits (see plan.md).
import type { AiKind, DemoState } from "./types";

export const PRO_PRICE = 12;

export const LIMITS = {
  free: { resumes: 1, improve: 5, job_match: 1 },
  pro: { monthlyAi: 300 }, // hidden cap, shared by AI Improve and Job Match
  aiPerMinute: 10,
} as const;

export type Denied = { ok: false; reason: "free_limit" | "pro_cap" | "rate_limit"; message: string };
export type Check = { ok: true } | Denied;

const isPro = (s: DemoState) => s.account.plan === "pro";

export function countUsage(s: DemoState, kind?: AiKind, since?: Date) {
  return s.usage.filter((u) => (!kind || u.kind === kind) && (!since || new Date(u.createdAt) >= since)).length;
}

export function canCreateResume(s: DemoState): Check {
  if (isPro(s) || s.resumes.length < LIMITS.free.resumes) return { ok: true };
  return {
    ok: false,
    reason: "free_limit",
    message: "The Free plan includes 1 resume. Upgrade to Pro to create as many as you need.",
  };
}

export function canUseAi(s: DemoState, kind: AiKind, now = new Date()): Check {
  const minuteAgo = new Date(now.getTime() - 60_000);
  if (countUsage(s, undefined, minuteAgo) >= LIMITS.aiPerMinute) {
    return { ok: false, reason: "rate_limit", message: "That's a lot of requests at once. Try again in a minute." };
  }
  if (isPro(s)) {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    if (countUsage(s, undefined, monthStart) >= LIMITS.pro.monthlyAi) {
      return { ok: false, reason: "pro_cap", message: "You've reached this month's fair-use limit. It resets on the 1st." };
    }
    return { ok: true };
  }
  const limit = LIMITS.free[kind];
  if (countUsage(s, kind) >= limit) {
    return {
      ok: false,
      reason: "free_limit",
      message:
        kind === "improve"
          ? "You've used all 5 free AI Improves. Upgrade to Pro for unlimited rewrites."
          : "You've used your free Job Match. Upgrade to Pro to match against every job you apply to.",
    };
  }
  return { ok: true };
}

export function usageSummary(s: DemoState) {
  return {
    pro: isPro(s),
    resumes: { used: s.resumes.length, limit: isPro(s) ? null : LIMITS.free.resumes },
    improve: { used: countUsage(s, "improve"), limit: isPro(s) ? null : LIMITS.free.improve },
    jobMatch: { used: countUsage(s, "job_match"), limit: isPro(s) ? null : LIMITS.free.job_match },
  };
}

/** Credits left for a kind on Free, or null when unlimited. */
export function remaining(s: DemoState, kind: AiKind) {
  if (isPro(s)) return null;
  return Math.max(0, LIMITS.free[kind] - countUsage(s, kind));
}
