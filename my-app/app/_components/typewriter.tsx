"use client";

import { useEffect, useState } from "react";

/** Types each line in turn, holds, then moves to the next. Loops. */
export function Typewriter({ lines, startDelay = 0 }: { lines: string[]; startDelay?: number }) {
  const [line, setLine] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => setCount(lines[0].length), 0);
      return () => clearTimeout(timer);
    }
    let l = 0;
    let c = 0;
    const tick = () => {
      if (c < lines[l].length) {
        c += 1;
        setCount(c);
        timer = setTimeout(tick, 28 + Math.random() * 30);
      } else {
        timer = setTimeout(() => {
          l = (l + 1) % lines.length;
          c = 0;
          setLine(l);
          setCount(0);
          tick();
        }, 3200);
      }
    };
    timer = setTimeout(tick, startDelay * 1000);
    return () => clearTimeout(timer);
  }, [lines, startDelay]);

  return (
    <span>
      {lines[line].slice(0, count)}
      <span className="caret ml-px inline-block h-[1em] w-px translate-y-[2px] bg-violet" />
    </span>
  );
}
