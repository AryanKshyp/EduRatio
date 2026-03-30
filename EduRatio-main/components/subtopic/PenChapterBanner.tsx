"use client";

import Link from "next/link";
import type { ChapterHero } from "@/lib/chapterTypes";

export function PenChapterBanner({ hero }: { hero: ChapterHero }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#2F4156] via-[#3d5a74] to-[#567C8D] px-6 py-10 text-white md:px-14 md:py-14">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#7ecfdd]/15 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#f5a623]/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />

      <div className="relative mx-auto w-full max-w-[min(96rem,100%)] space-y-4 text-center lg:text-left">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7ecfdd]">{hero.chapterLabel}</p>
        <h1 className="font-[family-name:var(--font-baloo)] text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
          {hero.title}
        </h1>
        <p className="mx-auto max-w-3xl text-sm font-semibold text-[#C8D9E6]/95 md:text-base lg:mx-0">
          In this chapter, you will learn the core ideas step by step and build confidence through practice.
        </p>
        <Link
          href="/dashboard#map"
          className="inline-flex rounded-full border-2 border-white/40 bg-white/10 px-5 py-2.5 text-sm font-extrabold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          ← Back to learning journey
        </Link>
      </div>
    </div>
  );
}
