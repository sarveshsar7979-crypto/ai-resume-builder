"use client";

import { useState } from "react";
import { canUseAi, remaining } from "@/lib/entitlements";
import { improveText } from "@/lib/fake-ai";
import { getDemo, recordUsage, useDemo } from "@/lib/store";
import type { ResumeContent } from "@/lib/types";
import { openUpgrade, toast } from "@/lib/ui";
import { Sparkle } from "../icons";
import { Button, Spinner, Textarea } from "../primitives";

/** A textarea with an AI Improve button and an Accept / Discard suggestion. */
export function AiTextarea({
  id,
  value,
  onChange,
  kind,
  content,
  placeholder,
  minRows = 2,
  label,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  kind: "bullet" | "summary";
  content: ResumeContent;
  placeholder?: string;
  minRows?: number;
  label: string;
}) {
  const state = useDemo();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const left = remaining(state, "improve");

  const improve = async () => {
    if (kind === "bullet" && !value.trim()) {
      toast("Write a rough version first, then AI Improve can polish it.", "info");
      return;
    }
    const check = canUseAi(getDemo(), "improve");
    if (!check.ok) {
      if (check.reason === "free_limit") openUpgrade(check.message);
      else toast(check.message, "error");
      return;
    }
    setLoading(true);
    setSuggestion(null);
    try {
      const text = await improveText(value, kind, content);
      recordUsage("improve"); // only after a successful response
      setSuggestion(text);
    } catch {
      toast("AI Improve is unavailable right now. No credit was used.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          minRows={minRows}
          className="pr-[108px]"
          aria-label={label}
        />
        <button
          type="button"
          onClick={improve}
          disabled={loading}
          className="absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-full bg-violet-soft px-2.5 text-[12px] font-medium text-violet transition hover:bg-[#e2d9f9] disabled:opacity-70"
          aria-label={`AI Improve ${label}`}
        >
          {loading ? <Spinner className="size-3" /> : <Sparkle className="size-3" />}
          {loading ? "Thinking" : "Improve"}
        </button>
      </div>

      {loading && (
        <div className="mt-2 space-y-1.5 rounded-xl border border-violet/15 bg-violet-soft/50 p-3" aria-live="polite">
          <div className="h-2.5 w-11/12 animate-pulse rounded-full bg-violet/15" />
          <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-violet/15" />
        </div>
      )}

      {suggestion && (
        <div className="anim-pop mt-2 rounded-xl border border-violet/20 bg-violet-soft/70 p-3" aria-live="polite">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-violet">
            <Sparkle className="size-3" /> Suggestion
          </div>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{suggestion}</p>
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                onChange(suggestion);
                setSuggestion(null);
              }}
            >
              Accept
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setSuggestion(null)}>
              Discard
            </Button>
            <span className="ml-auto text-[11px] text-muted">
              {left === null ? "Used 1 credit" : `Used 1 credit · ${left} left on Free`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
