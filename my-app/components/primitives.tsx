"use client";

import { useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { X } from "./icons";

/* ---------- button ---------- */
type Variant = "primary" | "secondary" | "ghost" | "danger" | "violet";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black",
  secondary: "border border-line bg-white text-ink hover:bg-cream",
  ghost: "text-muted hover:bg-black/5 hover:text-ink",
  danger: "bg-[#c2352b] text-white hover:bg-[#a82c23]",
  violet: "bg-violet-soft text-violet hover:bg-[#e2d9f9]",
};
export function Button({
  variant = "primary",
  size = "md",
  loading,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md"; loading?: boolean }) {
  const sz = size === "sm" ? "h-8 px-3 text-[13px] gap-1.5" : "h-10 px-4 text-[14px] gap-2";
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-55 ${sz} ${VARIANTS[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Spinner({ className = "size-3.5" }: { className?: string }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} aria-hidden="true" />;
}

/* ---------- form fields ---------- */
export function Field({ label, hint, children, className = "" }: { label: string; hint?: ReactNode; children: (id: string) => ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[12px] font-medium text-ink/80">{label}</label>
        {hint && <span className="text-[11px] text-muted">{hint}</span>}
      </div>
      {children(id)}
    </div>
  );
}

const fieldCls =
  "w-full rounded-xl border border-line bg-white px-3 text-[14px] text-ink placeholder:text-muted/60 outline-none transition focus:border-ink/30 focus:ring-4 focus:ring-ink/5";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldCls} h-10 ${props.className ?? ""}`} />;
}

/** Textarea that grows with its content. */
export function Textarea({ minRows = 2, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { minRows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [props.value]);
  return <textarea ref={ref} rows={minRows} {...props} className={`${fieldCls} resize-none py-2.5 leading-relaxed ${props.className ?? ""}`} />;
}

/* ---------- modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-md",
  hideClose,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  width?: string;
  hideClose?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="anim-fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        className={`anim-pop relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl outline-none sm:rounded-3xl ${width}`}
      >
        {!hideClose && (
          <button onClick={onClose} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted hover:bg-black/5 hover:text-ink" aria-label="Close">
            <X className="size-4" />
          </button>
        )}
        {title && <h2 className="pr-8 font-display text-xl font-medium tracking-tight text-ink">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

/* ---------- misc ---------- */
export function Meter({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
  const full = limit !== null && used >= limit;
  return (
    <div>
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="text-ink/80">{label}</span>
        <span className={full ? "font-medium text-poppy" : "text-muted"}>{limit === null ? "Unlimited" : `${used} / ${limit}`}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/70">
        <div className={`h-full rounded-full transition-all ${full ? "bg-poppy" : limit === null ? "bg-leaf" : "bg-ink"}`} style={{ width: limit === null ? "100%" : `${pct}%` }} />
      </div>
    </div>
  );
}

export function PlanBadge({ pro }: { pro: boolean }) {
  return pro ? (
    <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-white">Pro</span>
  ) : (
    <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[11px] font-medium text-muted">Free</span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 80 ? "bg-leaf-soft text-leaf" : score >= 60 ? "bg-[#fdf1d6] text-[#9a6a0a]" : "bg-poppy-soft text-poppy";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}>Match {score}</span>;
}
