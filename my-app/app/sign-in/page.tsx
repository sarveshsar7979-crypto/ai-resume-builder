import type { Metadata } from "next";
import { SignIn } from "@/components/sign-in";

export const metadata: Metadata = { title: "Sign in · Meadow", robots: { index: false } };

export default function SignInPage() {
  return <SignIn />;
}
