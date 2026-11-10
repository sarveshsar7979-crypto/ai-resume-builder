import type { Metadata } from "next";
import { LegalPage } from "../_components/legal-page";
import { SITE } from "../_components/site";

export const metadata: Metadata = { title: `Privacy Policy · ${SITE.name}` };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 10, 2026">
      <section>
        <h2>What we collect</h2>
        <p>Your name and email from Google sign-in, the resumes you write, the job descriptions you paste into Job Match, and a count of the AI features you use.</p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>To run the product: saving your resumes, generating AI suggestions and enforcing plan limits. Resume text and job descriptions are sent to our AI provider only to produce the result you asked for.</p>
      </section>
      <section>
        <h2>Payments</h2>
        <p>Payments are handled by Stripe. We never see or store your full card number.</p>
      </section>
      <section>
        <h2>Deleting your data</h2>
        <p>Deleting your account in Settings permanently removes your resumes, usage history and account.</p>
      </section>
    </LegalPage>
  );
}
