import type { CSSProperties } from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="12" cy="6.6" rx="3.6" ry="5" fill="#ef5a1c" transform={`rotate(${a} 12 12)`} opacity="0.92" />
      ))}
      <circle cx="12" cy="12" r="2.6" fill="#2b1a10" />
    </svg>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6z" />
    </svg>
  );
}

/** Circular score gauge that fills in on load. */
export function ScoreRing({ score, size = 64, stroke = 6, delay = 0 }: { score: number; size?: number; stroke?: number; delay?: number }) {
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  const style = {
    "--ring-len": `${len}`,
    "--ring-to": `${len * (1 - score / 100)}`,
    strokeDasharray: len,
    strokeDashoffset: len * (1 - score / 100),
    animation: `ring 1.6s cubic-bezier(0.2,0.7,0.2,1) ${delay}s both`,
  } as CSSProperties;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ece6dc" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#4f7a2e" strokeWidth={stroke} strokeLinecap="round" style={style} />
      </svg>
      <span className="absolute font-display text-lg font-semibold text-ink">{score}</span>
    </div>
  );
}
