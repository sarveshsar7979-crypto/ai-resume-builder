"use client";

import type { ReactNode } from "react";
import { useDemo, useHydrated } from "@/lib/store";
import { Spinner } from "./primitives";

/**
 * Renders its children once the demo data has loaded in the browser and the
 * user is signed in. Lives inside each page (not the layout) so the layout
 * always renders its children, which Next 16's instant navigation checks expect.
 */
export function SignedIn({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const { signedIn } = useDemo();
  if (!hydrated || !signedIn) {
    return (
      <div className="grid min-h-[60vh] flex-1 place-items-center">
        <Spinner className="size-6 text-muted" />
      </div>
    );
  }
  return <>{children}</>;
}
