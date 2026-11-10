import type { Metadata } from "next";
import { Suspense } from "react";
import { Editor } from "@/components/editor/editor";
import { SignedIn } from "@/components/signed-in";

export const metadata: Metadata = { title: "Editor · Meadow" };

// The id is only known at request time, so param access sits inside Suspense
// (required with Cache Components).
export default function ResumePage() {
  return (
    <Suspense fallback={null}>
      <SignedIn>
        <Editor />
      </SignedIn>
    </Suspense>
  );
}
