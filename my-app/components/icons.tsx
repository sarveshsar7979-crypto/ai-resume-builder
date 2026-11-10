import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const Plus = (p: P) => <svg {...base(p)}><path d="M10 4v12M4 10h12" /></svg>;
export const X = (p: P) => <svg {...base(p)}><path d="M5 5l10 10M15 5L5 15" /></svg>;
export const Check = (p: P) => <svg {...base(p)}><path d="M4.5 10.5l3.5 3.5 7.5-8.5" /></svg>;
export const More = (p: P) => <svg {...base(p)}><circle cx="4.5" cy="10" r="1" fill="currentColor" /><circle cx="10" cy="10" r="1" fill="currentColor" /><circle cx="15.5" cy="10" r="1" fill="currentColor" /></svg>;
export const Trash = (p: P) => <svg {...base(p)}><path d="M4 6h12M8 6V4.5h4V6M6 6l.7 10h6.6L14 6" /></svg>;
export const Copy = (p: P) => <svg {...base(p)}><rect x="7" y="7" width="9" height="9" rx="2" /><path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7" /></svg>;
export const Pencil = (p: P) => <svg {...base(p)}><path d="M12.5 4.5l3 3L7 16H4v-3z" /></svg>;
export const Download = (p: P) => <svg {...base(p)}><path d="M10 3.5v9M6 9l4 4 4-4M4 16h12" /></svg>;
export const Target = (p: P) => <svg {...base(p)}><circle cx="10" cy="10" r="6.5" /><circle cx="10" cy="10" r="3" /><circle cx="10" cy="10" r=".6" fill="currentColor" /></svg>;
export const Eye = (p: P) => <svg {...base(p)}><path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z" /><circle cx="10" cy="10" r="2.2" /></svg>;
export const ChevronUp = (p: P) => <svg {...base(p)}><path d="M5.5 12.5L10 8l4.5 4.5" /></svg>;
export const ChevronDown = (p: P) => <svg {...base(p)}><path d="M5.5 8L10 12.5 14.5 8" /></svg>;
export const ArrowLeft = (p: P) => <svg {...base(p)}><path d="M16 10H4M8.5 5.5L4 10l4.5 4.5" /></svg>;
export const ArrowRight = (p: P) => <svg {...base(p)}><path d="M4 10h12M11.5 5.5L16 10l-4.5 4.5" /></svg>;
export const LogOut = (p: P) => <svg {...base(p)}><path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M12 6.5L15.5 10 12 13.5M15.5 10H8" /></svg>;
export const Gear = (p: P) => <svg {...base(p)}><circle cx="10" cy="10" r="2.5" /><path d="M10 2.8v2M10 15.2v2M2.8 10h2M15.2 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" /></svg>;
export const Grid = (p: P) => <svg {...base(p)}><rect x="3.5" y="3.5" width="5.5" height="5.5" rx="1.2" /><rect x="11" y="3.5" width="5.5" height="5.5" rx="1.2" /><rect x="3.5" y="11" width="5.5" height="5.5" rx="1.2" /><rect x="11" y="11" width="5.5" height="5.5" rx="1.2" /></svg>;
export const FileText = (p: P) => <svg {...base(p)}><path d="M11.5 3H6a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 6 17h8a1.5 1.5 0 0 0 1.5-1.5V7z" /><path d="M11.5 3v4h4M7.5 11h5M7.5 14h3.5" /></svg>;
export const Card = (p: P) => <svg {...base(p)}><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="M2.5 8h15M5.5 12.5h3" /></svg>;
export const Alert = (p: P) => <svg {...base(p)}><path d="M10 3l7.5 13h-15z" /><path d="M10 8v3.5M10 14v.01" /></svg>;
export const Refresh = (p: P) => <svg {...base(p)}><path d="M15.5 8A6 6 0 0 0 4.6 6.5M4.5 12a6 6 0 0 0 10.9 1.5" /><path d="M4.5 3.5v3h3M15.5 16.5v-3h-3" /></svg>;
export const Sparkle = (p: P) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6z" />
  </svg>
);
export const Google = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
    <path fill="#34A853" d="M12 23c3 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.2a11 11 0 0 0 0 9.9z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
  </svg>
);
