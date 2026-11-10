// Hard-coded demo data. Replaced by Neon + Drizzle later.
import type { Account, DemoState, Resume, ResumeContent } from "./types";

const daysAgo = (d: number, h = 0) => new Date(Date.now() - d * 86_400_000 - h * 3_600_000).toISOString();

export const uid = () => Math.random().toString(36).slice(2, 10);

export const DEMO_USER = { name: "Alex Rivera", email: "alex.rivera@gmail.com" };

export function freshAccount(): Account {
  return {
    ...DEMO_USER,
    plan: "free",
    subscriptionStatus: "none",
    currentPeriodEnd: null,
    createdAt: new Date().toISOString(),
  };
}

export function blankContent(name = "", email = ""): ResumeContent {
  return {
    contact: { fullName: name, title: "", email, phone: "", location: "", website: "" },
    summary: "",
    experience: [{ id: uid(), role: "", company: "", location: "", start: "", end: "", bullets: [""] }],
    education: [{ id: uid(), school: "", degree: "", start: "", end: "", details: "" }],
    skills: [],
  };
}

const frontend: Resume = {
  id: "r-frontend",
  title: "Frontend Engineer",
  createdAt: daysAgo(12),
  updatedAt: daysAgo(0, 2),
  content: {
    contact: {
      fullName: "Alex Rivera",
      title: "Frontend Engineer",
      email: "alex.rivera@gmail.com",
      phone: "(415) 555-0142",
      location: "San Francisco, CA",
      website: "alexrivera.dev",
    },
    summary:
      "Frontend engineer with 5 years of experience building fast, accessible web apps in React and TypeScript. I like turning messy product ideas into clean interfaces.",
    experience: [
      {
        id: "e1",
        role: "Senior Frontend Engineer",
        company: "Brightcart",
        location: "San Francisco, CA",
        start: "Mar 2022",
        end: "Present",
        bullets: [
          "Worked on the checkout page.",
          "Led the move from JavaScript to TypeScript across 40+ components, cutting production bugs by 30%.",
          "Mentored 3 junior engineers through weekly code reviews and pairing.",
        ],
      },
      {
        id: "e2",
        role: "Frontend Engineer",
        company: "Northwind Labs",
        location: "Remote",
        start: "Jun 2019",
        end: "Feb 2022",
        bullets: [
          "Helped with the design system.",
          "Built a dashboard used by 12,000 customers to track shipments in real time.",
          "Responsible for performance improvements.",
        ],
      },
    ],
    education: [
      {
        id: "ed1",
        school: "University of California, Davis",
        degree: "B.S. Computer Science",
        start: "2015",
        end: "2019",
        details: "Dean's List, Web Development Club lead",
      },
    ],
    skills: ["React", "TypeScript", "Next.js", "CSS", "Tailwind", "Jest", "Figma", "REST APIs", "Git"],
  },
  lastJobMatch: {
    jobDescription:
      "We're hiring a Senior Frontend Engineer to build our customer-facing web app with React, TypeScript and GraphQL. You'll own accessibility, work closely with design on our design system, write tests with Playwright, and help improve performance across the product.",
    score: 72,
    missingKeywords: ["GraphQL", "Playwright", "Accessibility"],
    tips: [
      "Add GraphQL and Playwright where you've genuinely used them. The role mentions them directly.",
      "2 of your bullets have no numbers. Add a result (time saved, %, users) to the strongest ones.",
      "Mention accessibility work in your Brightcart role, with an outcome if you have one.",
    ],
    createdAt: daysAgo(3),
  },
};

export function seedState(signedIn = false): DemoState {
  return {
    version: 1,
    signedIn,
    account: { ...freshAccount(), createdAt: daysAgo(12) },
    resumes: [frontend],
    usage: [
      { kind: "improve", createdAt: daysAgo(10) },
      { kind: "improve", createdAt: daysAgo(4) },
      // The saved Job Match above is sample data; the free Job Match is left unused so it can be tried.
    ],
  };
}

/** What a brand-new Google sign-in looks like: no resumes, no usage. */
export function emptyState(): DemoState {
  return { version: 1, signedIn: true, account: freshAccount(), resumes: [], usage: [] };
}
