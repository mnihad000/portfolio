"use client";

import { useEffect, useRef } from "react";

const STATUS_TEXT = "open_to: summer 2027 internships";
const HIGHLIGHT = "summer 2027";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\";
const FRAME_MS = 35;
const REPEAT_DELAY_MS = 6000;

const [beforeHighlight, afterHighlight] = STATUS_TEXT.split(HIGHLIGHT);

function scramble(revealed: number) {
  let output = "";

  for (let index = 0; index < STATUS_TEXT.length; index += 1) {
    const char = STATUS_TEXT[index];
    output +=
      index < revealed || char === " "
        ? char
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  return output;
}

export default function InternshipStatus() {
  const scrambleRef = useRef<HTMLSpanElement>(null);
  const finalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const scrambleText = scrambleRef.current;
    const finalText = finalRef.current;

    if (!scrambleText || !finalText) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let interval = 0;
    let timeout = 0;

    const showFinal = (visible: boolean) => {
      finalText.hidden = !visible;
      scrambleText.hidden = visible;
    };

    // Scramble every character, then lock them in left to right; repeat after a pause.
    const decode = () => {
      let frame = 0;
      showFinal(false);

      interval = window.setInterval(() => {
        const revealed = Math.max(0, Math.floor((frame - 6) / 2));

        if (revealed >= STATUS_TEXT.length) {
          window.clearInterval(interval);
          showFinal(true);
          timeout = window.setTimeout(decode, REPEAT_DELAY_MS);
          return;
        }

        scrambleText.textContent = scramble(revealed);
        frame += 1;
      }, FRAME_MS);
    };

    decode();

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      showFinal(true);
    };
  }, []);

  return (
    <p
      className="internship-status mt-5 inline-flex max-w-full items-center gap-2 self-start rounded-md border border-zinc-300 bg-white px-2.5 py-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.05em] text-zinc-900 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-[0.16em]"
      aria-label="Open to Summer 2027 internships"
    >
      <span className="internship-status__led" aria-hidden="true" />
      <span className="font-semibold text-[#d65a12]" aria-hidden="true">
        &gt;
      </span>
      <span aria-hidden="true" className="whitespace-nowrap">
        <span ref={scrambleRef} hidden />
        <span ref={finalRef}>
          {beforeHighlight}
          <span className="text-green-600 [text-shadow:0_0_8px_rgba(22,163,74,0.25)]">
            {HIGHLIGHT}
          </span>
          {afterHighlight}
        </span>
      </span>
      <span className="internship-status__caret hidden min-[380px]:block" aria-hidden="true" />
    </p>
  );
}
