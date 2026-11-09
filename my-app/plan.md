# AI Resume Builder — V1 Spec (pre-implementation)

## Context
A simplified, cheaper Rezi.ai clone. Users build one clean resume with a form and a live preview, polish it with AI, check it against a job description, and download a PDF. Money comes from a $12/month Pro plan. Target: launch in about 2 weeks. This document records the decisions from the interview and comes before the implementation plan.

## Product & scope
- **Users:** job seekers writing or refreshing a resume, mostly on a laptop.
- **Main job:** produce a strong, ATS-friendly PDF resume fast.
- **V1 features (only these):**
  1. Google login, plus a dashboard of saved resumes
  2. Resume form (Contact, Summary, Experience, Education, Skills) with a live preview and autosave
  3. AI Improve on any bullet or summary: suggests a rewrite with Accept / Discard
  4. Job Match: paste a job description to get a score (0–100), missing keywords and 3 tips. The last result is saved on the resume
  5. PDF download (one ATS-friendly template)
  6. Pro plan at $12/month through Stripe
- **Out of scope:** resume upload/import, cover letters, DOCX, multiple templates, score breakdown, font/spacing controls, annual plan or trial, file storage, admin panel, teams, interview practice, job tracker.

## Core flows
- **New visitor:** Landing page (headline, features, pricing table) → "Sign in with Google" → Neon Auth → `/dashboard` (empty state with "Create your first resume").
- **Create:** Clicking "New resume" creates a row and opens `/resumes/[id]`. Free users with 1 resume see an upgrade modal instead.
- **Edit:** The form is on the left and the React-PDF preview on the right (desktop). On phones the form is full screen with a "Preview" button. Autosave runs about 1s after typing stops and shows "Saving… / Saved".
- **AI Improve:** Click the button → the server checks limits and calls Claude → the suggestion appears under the field → Accept replaces the text, Discard drops it. Each click uses 1 credit.
- **Job Match:** A panel in the editor. Paste a job description and run it → the result card is saved to `resumes.last_job_match` and reappears on return.
- **Download:** Generated in the browser with React-PDF and downloaded right away. Always free.
- **Upgrade:** Upgrade button or limit modal → Stripe Checkout → webhook sets the user to Pro → back to the dashboard with a success toast.
- **Manage / cancel:** `/settings` → "Manage billing" (Stripe Customer Portal). Pro lasts until the end of the paid period, then the user drops back to Free.
- **Delete account:** `/settings` → confirm → cancel the Stripe subscription → delete resumes, usage and account data → delete the Neon Auth user → sign out.

## Pages & routing
| Route | Access | Notes |
|---|---|---|
| `/` | public, SEO | Landing + pricing |
| `/terms`, `/privacy` | public, SEO | Required by Stripe and Google OAuth |
| `/sign-in` | public | Neon Auth Google button |
| `/dashboard` | auth | List of resumes, plan badge, upgrade CTA |
| `/resumes/[id]` | auth + owner | Editor, preview, AI Improve, Job Match |
| `/settings` | auth | Plan, billing portal, delete account |
| `/api/auth/[...path]` | — | Neon Auth handler |
| `/api/stripe/webhook` | Stripe signature | Subscription sync |

Protected routes are enforced in Next.js proxy/middleware **and** again in every server action and query (owner check on `user_id`).

## Data model (Postgres on Neon, Drizzle ORM)
Users live in the Neon Auth schema (`neon_auth.user`), and our tables reference that user id.

- **`accounts`**: `user_id` (PK, the auth user id), `plan` ('free'|'pro'), `stripe_customer_id` (unique, nullable), `stripe_subscription_id`, `subscription_status`, `current_period_end`, `created_at`. Created lazily on first login.
- **`resumes`**: `id` (uuid PK), `user_id` (indexed, FK to accounts, on delete cascade), `title`, `content` (JSONB: `{contact, summary, experience[], education[], skills[]}` validated by one Zod schema), `last_job_match` (JSONB, nullable: `{jobDescription, score, missingKeywords[], tips[], createdAt}`), `created_at`, `updated_at`.
- **`ai_usage`**: `id`, `user_id` (indexed), `kind` ('improve'|'job_match'), `created_at`. One row per successful AI call. Counting rows gives the free lifetime limits, the Pro monthly cap and the per-minute rate limit, so no counters need resetting.
- **`stripe_events`**: `event_id` (PK). Used to process each webhook event only once.

## Plan rules (single source: `lib/entitlements.ts`)
| | Free | Pro ($12/mo) |
|---|---|---|
| Resumes | 1 | Unlimited |
| AI Improve | 5 lifetime | "Unlimited" (hidden cap of 300 AI calls a month, shared with Job Match) |
| Job Match | 1 lifetime | "Unlimited" (same shared cap) |
| PDF download | Unlimited | Unlimited |
| Rate limit | 10 AI calls per minute for everyone | same |

On downgrade, all existing resumes remain and can be edited and downloaded. Creating new ones is blocked while the user has 1 or more resumes.

## Architecture
- **Next.js 16.4.5 App Router** in `my-app/`, with React 19, Tailwind 4 and TypeScript. Before writing code, read the docs bundled in `node_modules/next/dist/docs/`, as [my-app/AGENTS.md](my-app/AGENTS.md) requires.
- **Server Components** for the dashboard and for loading the editor's data.
- **Server Actions** for createResume, saveResume (autosave), deleteResume, aiImprove, runJobMatch, startCheckout, openBillingPortal and deleteAccount. Every action does: get the session → check ownership → check entitlements → do the work.
- **Route handlers** only for Neon Auth and the Stripe webhook.
- **Client state:** the editor form state lives in the browser (React state, with React Hook Form + Zod if useful). A debounced autosave calls a server action. The preview renders from the same state. React-PDF is loaded client-only with `dynamic(..., { ssr: false })`, and preview renders are debounced.
- **AI:** Anthropic SDK, server-only, model `claude-haiku-5-5`. Job Match uses structured output (a tool or JSON schema) and the result is checked with Zod. A usage row is written only after a successful response.
- **No background jobs.** AI calls are synchronous (a few seconds, with a loading spinner). The webhook is idempotent through `stripe_events`.

## External services
| Service | Owns |
|---|---|
| Neon Postgres | All app data |
| Neon Auth (Better Auth, Google OAuth) | Identity, sessions |
| Stripe | Checkout, subscriptions, Customer Portal, invoices, refunds (handled manually in the dashboard) |
| Anthropic (Claude Haiku) | AI Improve, Job Match |
| Vercel | Hosting, preview deploys, Vercel Analytics |
| Sentry (free tier) | Error tracking on server and client |
| Neon Object Storage | **Not used in v1** |

## SEO, security, edge cases
- **SEO:** metadata, Open Graph image, `sitemap.xml` and `robots.txt` for `/`, `/terms` and `/privacy`. App routes are `noindex`.
- **Security:** Anthropic, Stripe and DB keys are server-only (never `NEXT_PUBLIC_`). The Stripe webhook checks its signature. Every query is filtered by `user_id`. Job description and input lengths are capped (job description at about 10k characters) to limit token spend.
- **Edge cases:** if the AI or Stripe is down, show a friendly error toast and don't use up a credit. Double-clicking AI or checkout disables the button while the request is in flight. If the session expires mid-edit, autosave fails, a "Session expired, sign in again" message appears, and the local form state is kept. If autosave conflicts across two tabs, the last write wins (acceptable for v1).

## Environments & deployment
- **Local:** `next dev` against a Neon dev branch, with the Stripe CLI forwarding webhooks.
- **Preview:** Vercel preview deploys, each on its own Neon branch (Neon–Vercel integration), using Stripe test mode.
- **Production:** Vercel Pro (Hobby doesn't allow commercial use), with the Neon main branch and live Stripe keys.
- **Env vars:** `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`, `NEXT_PUBLIC_APP_URL`, `SENTRY_DSN`.

## Testing / definition of done
- **Automated (Vitest):** entitlement rules, usage counting and caps, webhook handling (activate, cancel, payment failed, duplicate event), and parsing AI responses.
- **Manual checklist:** sign in → create → edit → autosave → AI Improve accept/discard → Job Match saved → PDF opens with selectable text → hit the free limit → upgrade in Stripe test mode → Pro unlocks → cancel in the portal → downgrade at period end → delete account.
- **Done when** the checklist passes in production with Stripe test mode, then again with live mode.

## ASSUMPTIONS (decided without a firm answer from you)
1. No file storage in v1, so Neon Object Storage isn't used.
2. Hidden Pro cap: 300 AI calls a month, shared by AI Improve and Job Match. Rate limit: 10 calls a minute for everyone.
3. Downgraded users can still **edit** existing resumes. Only creating new ones and AI beyond the free limits are blocked.
4. PDF download is unlimited and free (no watermark).
5. Accounts and billing rows are created lazily on first login.
6. Refunds are handled by hand in the Stripe dashboard, with no in-app refund flow.
7. If the same resume is open in two tabs, the last save wins.
8. Sentry free tier and Vercel Analytics are enough. No product funnel analytics in v1.
9. No email sending in v1 (Stripe sends receipts).
10. English only, and US Letter page size (A4 later).

## OPEN RISKS
1. **Neon Auth is still changing:** docs mention both `@neon/auth` and `@neondatabase/auth`. Confirm the current package and API in the official quickstart before building login. We also need to check that an API exists for deleting a user.
2. **Google consent screen:** it shows Neon's hostname unless branding or a custom domain is set up, and it must be published or verified before real users can sign in.
3. **React-PDF with Next 16 / React 19:** check compatibility of the current `@react-pdf/renderer` version first. Re-rendering the live preview on every keystroke may feel slow and needs debouncing.
4. **Next.js 16 breaking changes:** conventions such as middleware/proxy and caching may differ from older versions, so follow the bundled docs.
5. **AI output quality and consistency:** Job Match scores can vary between runs on the same input. Set temperature low and anchor the prompt with a rubric.
6. **Two-week deadline:** any added scope (more templates, import) threatens it.
7. **Webhook timing:** right after checkout, the user may land back before the webhook arrives. Show a "Activating Pro…" state that refreshes until the plan updates.
