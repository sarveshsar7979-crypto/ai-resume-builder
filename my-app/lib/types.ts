export type Plan = "free" | "pro";

export type Contact = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string; // "Present" when current
  bullets: string[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
  details: string;
};

export type ResumeContent = {
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
};

export type JobMatchResult = {
  jobDescription: string;
  score: number;
  missingKeywords: string[];
  tips: string[];
  createdAt: string;
};

export type Resume = {
  id: string;
  title: string;
  content: ResumeContent;
  lastJobMatch: JobMatchResult | null;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionStatus = "none" | "active" | "canceling";

export type Account = {
  name: string;
  email: string;
  plan: Plan;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodEnd: string | null;
  createdAt: string;
};

export type AiKind = "improve" | "job_match";

/** One row per successful AI call, like the planned `ai_usage` table. */
export type UsageEvent = { kind: AiKind; createdAt: string };

export type DemoState = {
  version: 1;
  signedIn: boolean;
  account: Account;
  resumes: Resume[];
  usage: UsageEvent[];
};
