"use client";

import type { ChapterBundle } from "@/lib/chapterTypes";

export function BlackboardPreQuizSummary({
  summary,
}: {
  summary: NonNullable<ChapterBundle["preQuizSummary"]>;
}) {
  return (
    <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 shadow-[0_18px_70px_rgba(47,65,86,0.14)]">
      <div
        className="relative min-h-[18rem] w-full"
        style={{
          backgroundColor: "#0e3f2f",
          backgroundImage: [
            // surface texture + subtle chalk dust
            "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 44%)",
            "radial-gradient(circle at 78% 58%, rgba(255,255,255,0.07), transparent 48%)",
            "repeating-linear-gradient(95deg, rgba(255,255,255,0.032) 0, rgba(255,255,255,0.032) 2px, transparent 2px, transparent 8px)",
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.18) 100%)",
          ].join(","),
        }}
      >
        {/* Lighting variations */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 5%, rgba(255,255,255,0.08), transparent 55%)",
            opacity: 0.75,
          }}
        />

        {/* Chalk smudges (not a card/overlay) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(circle at 22% 28%, rgba(255,255,255,0.09), transparent 38%)",
              "radial-gradient(circle at 68% 22%, rgba(255,255,255,0.06), transparent 44%)",
              "radial-gradient(circle at 55% 70%, rgba(255,255,255,0.08), transparent 45%)",
            ].join(","),
            filter: "blur(12px) saturate(1.05)",
            opacity: 0.46,
          }}
        />

        {/* Minimal classroom props (very subtle) */}
        <div aria-hidden className="pointer-events-none absolute left-4 bottom-14 opacity-20">
          <svg viewBox="0 0 80 48" className="h-10 w-auto">
            <path
              d="M10 18 C18 12, 28 12, 36 18 L36 40 C28 34, 18 34, 10 40 Z"
              fill="rgba(255,255,255,0.15)"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
            />
            <path
              d="M40 18 C48 12, 58 12, 66 18 L66 40 C58 34, 48 34, 40 40 Z"
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1"
            />
            <path d="M40 18 L40 40" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          </svg>
        </div>
        <div aria-hidden className="pointer-events-none absolute right-4 bottom-14 opacity-18">
          <svg viewBox="0 0 60 60" className="h-10 w-auto">
            <rect
              x="14"
              y="12"
              width="32"
              height="40"
              rx="8"
              fill="rgba(255,255,255,0.10)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
            />
            <path d="M22 26 L26 50" stroke="rgba(126,207,221,0.35)" strokeWidth="2" />
            <path d="M30 22 L30 50" stroke="rgba(196,181,253,0.35)" strokeWidth="2" />
            <path d="M38 26 L34 50" stroke="rgba(255,180,166,0.35)" strokeWidth="2" />
          </svg>
        </div>

        {/* Wooden ledge */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.18) 100%) , linear-gradient(90deg, #6b4a31 0%, #3c2517 50%, #5a3b25 100%)",
          }}
        />

        {/* Chalk text directly on the board (no overlay card) */}
        <div className="relative z-[1] flex h-full w-full flex-col px-6 pb-24 pt-10 md:px-10 md:pt-12">
          <h3
            className="chalk-title mb-2 text-left text-2xl font-extrabold tracking-tight md:text-3xl"
          >
            {summary.heading}
          </h3>

          <ul className="chalk-list space-y-2">
            {summary.lines.map((line) => (
              <li
                key={line}
                className="chalk-line text-[0.98rem] leading-relaxed"
              >
                <span className="chalk-dash" aria-hidden>
                  —
                </span>{" "}
                {line}
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}

