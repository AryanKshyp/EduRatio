"use client";

import { useState } from "react";
import type { ChapterLesson } from "@/lib/chapterTypes";

const accentStyles: Record<
  ChapterLesson["accent"],
  { border: string; front: string; back: string; glow: string; chip: string }
> = {
  teal: {
    border: "border-[#7ecfdd]/60",
    front: "from-[#567C8D] to-[#3d5f72]",
    back: "from-[#2F4156] to-[#1f3244]",
    glow: "shadow-[0_20px_50px_rgba(86,124,141,0.35)]",
    chip: "bg-[#7ecfdd]/25 text-[#e8f8fc]",
  },
  coral: {
    border: "border-[#ffb4a6]/70",
    front: "from-[#e07a5f] to-[#c45c42]",
    back: "from-[#5c2e26] to-[#3d1f1b]",
    glow: "shadow-[0_20px_50px_rgba(224,122,95,0.35)]",
    chip: "bg-white/20 text-white",
  },
  violet: {
    border: "border-[#c4b5fd]/70",
    front: "from-[#6d5acd] to-[#5542a8]",
    back: "from-[#2d2654] to-[#1e1a38]",
    glow: "shadow-[0_20px_50px_rgba(109,90,205,0.35)]",
    chip: "bg-white/20 text-white",
  },
  sun: {
    border: "border-[#f5d547]/80",
    front: "from-[#f5a623] to-[#d9870e]",
    back: "from-[#4a3408] to-[#2f2105]",
    glow: "shadow-[0_20px_50px_rgba(245,166,35,0.4)]",
    chip: "bg-black/20 text-white",
  },
};

export function SolveFlashCard({ lesson }: { lesson: ChapterLesson }) {
  const [flipped, setFlipped] = useState(false);
  const a = accentStyles[lesson.accent];
  const { flash } = lesson;

  return (
    <div
      className={`mx-auto w-full max-w-xl ${a.glow} perspective-[1400px]`}
      style={{ perspective: "1400px" }}
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={`relative h-[min(22rem,58vw)] w-full cursor-pointer rounded-2xl border-2 ${a.border} text-left outline-none transition-transform duration-500 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-[#7ecfdd] focus-visible:ring-offset-2`}
        aria-expanded={flipped}
        aria-label={flipped ? "Hide worked solution" : "Show worked solution"}
      >
        <div
          className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${a.front} p-5 text-white backface-hidden md:p-6`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${a.chip}`}>
                Solved example · tap to flip
              </span>
              <p className="mt-3 font-[family-name:var(--font-baloo)] text-xl font-extrabold md:text-2xl">{flash.label}</p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/95 md:text-base">{flash.problem}</p>
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${a.back} p-5 text-white md:p-6`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7ecfdd]">Solution</p>
            <div className="mt-3 overflow-y-auto pr-1">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/25">
                    <th className="pb-2 pr-3 font-extrabold text-[#7ecfdd]">{flash.tableHeader.step}</th>
                    <th className="pb-2 font-extrabold text-[#7ecfdd]">{flash.tableHeader.working}</th>
                  </tr>
                </thead>
                <tbody>
                  {flash.rows.map((row) => (
                    <tr key={row.step} className="border-b border-white/10 align-top">
                      <td className="py-2 pr-3 font-semibold text-white/90">{row.step}</td>
                      <td className="py-2 text-white/85">{row.working}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold leading-snug">{flash.answerLine}</p>
            </div>
            <p className="mt-auto pt-2 text-center text-xs font-semibold text-white/70">Click to flip back</p>
          </div>
        </div>
      </button>
    </div>
  );
}
