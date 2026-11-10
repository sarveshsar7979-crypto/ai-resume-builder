import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Everything in the app is per-user demo data, so pages render on the client.
// The shell always renders its children; each page waits for sign-in itself.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
