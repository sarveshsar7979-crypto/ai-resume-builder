import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";
import { SignedIn } from "@/components/signed-in";

export const metadata: Metadata = { title: "Your resumes · Meadow" };

export default function DashboardPage() {
  return (
    <SignedIn>
      <Dashboard />
    </SignedIn>
  );
}
