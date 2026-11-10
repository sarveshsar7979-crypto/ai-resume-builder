import type { Metadata } from "next";
import { LegalPage } from "../_components/legal-page";
import { SITE } from "../_components/site";

export const metadata: Metadata = { title: `Terms of Service · ${SITE.name}` };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 10, 2026">
      <section>
        <h2>Using {SITE.name}</h2>
        <p>{SITE.name} helps you write a resume, improve it with AI and check it against job descriptions. You&apos;re responsible for the content of your resume and for making sure it&apos;s accurate.</p>
      </section>
      <section>
        <h2>Plans and billing</h2>
        <p>The Free plan includes 1 resume, 5 AI Improves and 1 Job Match. Pro costs ${SITE.proPrice} per month, billed through Stripe. You can cancel anytime; Pro stays active until the end of the period you paid for.</p>
      </section>
      <section>
        <h2>AI suggestions</h2>
        <p>AI suggestions can be wrong. Review every suggestion before you accept it, and only list skills and results that are true.</p>
      </section>
      <section>
        <h2>Ending your account</h2>
        <p>You can delete your account from Settings at any time. This permanently deletes your resumes and data.</p>
      </section>
    </LegalPage>
  );
}
