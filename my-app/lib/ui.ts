// App-wide UI state: toasts, the upgrade modal and simulated checkout.
import { useSyncExternalStore } from "react";

export type Toast = { id: number; message: string; tone: "success" | "error" | "info" };
type UiState = {
  toasts: Toast[];
  upgrade: { open: boolean; reason: string | null };
  checkoutOpen: boolean;
  activatingPro: boolean;
  notice: string | null; // one-off message for the sign-in page
};

let ui: UiState = {
  toasts: [],
  upgrade: { open: false, reason: null },
  checkoutOpen: false,
  activatingPro: false,
  notice: null,
};
const SERVER: UiState = ui;
const listeners = new Set<() => void>();
const set = (patch: Partial<UiState>) => {
  ui = { ...ui, ...patch };
  listeners.forEach((l) => l());
};

export function useUi() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => ui,
    () => SERVER,
  );
}

let nextId = 1;
export function toast(message: string, tone: Toast["tone"] = "success") {
  const id = nextId++;
  set({ toasts: [...ui.toasts, { id, message, tone }] });
  setTimeout(() => dismissToast(id), 4200);
}
export function dismissToast(id: number) {
  set({ toasts: ui.toasts.filter((t) => t.id !== id) });
}

export const openUpgrade = (reason: string | null = null) => set({ upgrade: { open: true, reason } });
export const closeUpgrade = () => set({ upgrade: { open: false, reason: null } });
export const openCheckout = () => set({ upgrade: { open: false, reason: null }, checkoutOpen: true });
export const closeCheckout = () => set({ checkoutOpen: false });
export const setActivatingPro = (v: boolean) => set({ activatingPro: v });
export const setNotice = (notice: string | null) => set({ notice });
