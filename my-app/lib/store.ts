// Demo data store: plain module state, saved to localStorage, read with
// useSyncExternalStore. Stands in for the database and server actions.
import { useSyncExternalStore } from "react";
import { blankContent, emptyState, seedState, uid } from "./seed";
import type { AiKind, DemoState, JobMatchResult, Resume, ResumeContent } from "./types";

const KEY = "meadow-demo-v1";
const SERVER_STATE = seedState(false);

let state: DemoState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as DemoState) : null;
    if (parsed?.version === 1) state = parsed;
  } catch {
    // storage blocked or corrupt: keep the seed
  }
  // Other tabs: last write wins.
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      state = JSON.parse(e.newValue);
      listeners.forEach((l) => l());
    } catch {}
  });
}

function set(next: DemoState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  load();
  return state;
}

export function useDemo() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);
}

export function getDemo() {
  return getSnapshot();
}

const noop = () => () => {};
/** False during server render and hydration, true after. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

const now = () => new Date().toISOString();
const patchResume = (id: string, fn: (r: Resume) => Resume) =>
  set({ ...state, resumes: state.resumes.map((r) => (r.id === id ? fn(r) : r)) });

/* ---------- session ---------- */
export function signIn() {
  load();
  set({ ...state, signedIn: true });
}
export function signOut() {
  set({ ...state, signedIn: false });
}

/* ---------- resumes ---------- */
export function createResume(): string {
  const id = uid();
  const t = now();
  const resume: Resume = {
    id,
    title: "Untitled resume",
    content: blankContent(state.account.name, state.account.email),
    lastJobMatch: null,
    createdAt: t,
    updatedAt: t,
  };
  set({ ...state, resumes: [resume, ...state.resumes] });
  return id;
}

export function saveResume(id: string, data: { title?: string; content?: ResumeContent }) {
  patchResume(id, (r) => ({ ...r, ...data, updatedAt: now() }));
}

export function saveJobMatch(id: string, result: JobMatchResult) {
  patchResume(id, (r) => ({ ...r, lastJobMatch: result }));
}

export function renameResume(id: string, title: string) {
  patchResume(id, (r) => ({ ...r, title: title.trim() || "Untitled resume", updatedAt: now() }));
}

export function duplicateResume(id: string): string | null {
  const src = state.resumes.find((r) => r.id === id);
  if (!src) return null;
  const copy: Resume = { ...structuredClone(src), id: uid(), title: `${src.title} (copy)`, createdAt: now(), updatedAt: now() };
  set({ ...state, resumes: [copy, ...state.resumes] });
  return copy.id;
}

export function deleteResume(id: string) {
  set({ ...state, resumes: state.resumes.filter((r) => r.id !== id) });
}

/* ---------- usage ---------- */
export function recordUsage(kind: AiKind) {
  set({ ...state, usage: [...state.usage, { kind, createdAt: now() }] });
}

/* ---------- billing (simulated Stripe) ---------- */
export function upgradeToPro() {
  const end = new Date(Date.now() + 30 * 86_400_000).toISOString();
  set({ ...state, account: { ...state.account, plan: "pro", subscriptionStatus: "active", currentPeriodEnd: end } });
}
export function cancelSubscription() {
  set({ ...state, account: { ...state.account, subscriptionStatus: "canceling" } });
}
export function renewSubscription() {
  set({ ...state, account: { ...state.account, subscriptionStatus: "active" } });
}
/** Demo control: jump to the end of the paid period. Canceled plans drop to Free, active ones renew. */
export function endBillingPeriod() {
  const a = state.account;
  if (a.subscriptionStatus === "canceling") {
    set({ ...state, account: { ...a, plan: "free", subscriptionStatus: "none", currentPeriodEnd: null } });
  } else if (a.subscriptionStatus === "active") {
    const end = new Date(Date.now() + 30 * 86_400_000).toISOString();
    set({ ...state, account: { ...a, currentPeriodEnd: end } });
  }
}

/* ---------- account ---------- */
export function deleteAccount() {
  set({ ...emptyState(), signedIn: false });
}
export function resetDemo() {
  set(seedState(true));
}
