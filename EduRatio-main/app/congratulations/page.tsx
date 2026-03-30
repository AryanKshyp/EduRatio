"use client";

import Link from "next/link";

export default function CongratulationsPage() {
  return (
    <div className="ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-x-hidden">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1f3a56] via-[#2F4156] to-[#567C8D] px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[16%] h-20 w-20 rounded-full bg-[#7ecfdd]/30 blur-2xl" />
          <div className="absolute right-[12%] top-[22%] h-24 w-24 rounded-full bg-[#f5a623]/30 blur-2xl" />
          <div className="absolute left-[18%] bottom-[20%] h-16 w-16 rounded-full bg-[#c4b5fd]/30 blur-2xl" />
          <div className="absolute right-[20%] bottom-[16%] h-24 w-24 rounded-full bg-[#4caf7d]/30 blur-2xl" />
        </div>

        <p className="relative z-[1] text-6xl md:text-7xl" aria-hidden>
          🎉
        </p>
        <h1 className="relative z-[1] mt-4 font-[family-name:var(--font-baloo)] text-4xl font-extrabold text-white md:text-6xl">
          Congratulations!
        </h1>
        <p className="relative z-[1] mt-5 max-w-3xl text-lg font-semibold leading-relaxed text-[#d7edf8] md:text-2xl">
          You have now mastered Rational Numbers.
        </p>
        <p className="relative z-[1] mt-2 max-w-2xl text-sm font-bold text-[#bde6f5] md:text-base">
          All 6 topics completed with 80%+ accuracy. Amazing work!
        </p>

        <Link
          href="/dashboard#map"
          className="relative z-[1] mt-10 inline-flex rounded-2xl bg-[#7ecfdd] px-8 py-3 text-sm font-extrabold text-[#1c3447] shadow-lg transition hover:bg-[#9be0ea] md:text-base"
        >
          Back to learning journey
        </Link>
      </section>
    </div>
  );
}

