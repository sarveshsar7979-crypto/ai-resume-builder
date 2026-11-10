import type { Metadata } from "next";
import { Settings } from "@/components/settings";
import { SignedIn } from "@/components/signed-in";

export const metadata: Metadata = { title: "Settings · Meadow" };

export default function SettingsPage() {
  return (
    <SignedIn>
      <Settings />
    </SignedIn>
  );
}
