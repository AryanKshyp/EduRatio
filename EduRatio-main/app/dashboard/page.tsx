import { GetStartedLink } from "@/components/dashboard/GetStartedLink";
import { LearningPath } from "@/components/dashboard/LearningPath";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-0">
      <section className="relative ml-[calc(50%-50vw)] flex min-h-[calc(100vh-3.5rem)] w-screen max-w-[100vw] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#2F4156] from-0% via-[#3d5a74] via-[55%] to-[#567C8D] to-100% px-6 pb-20 pt-12 text-center md:min-h-[calc(100vh-4rem)] md:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="animate-hero-math-drift absolute left-[4%] top-[16%] text-left text-[#d9f5fb] drop-shadow-[0_8px_20px_rgba(15,40,55,0.45)]">
            <p className="text-5xl md:text-6xl">✚</p>
          </div>
          <div className="animate-hero-math-drift-slow absolute right-[4%] top-[16%] text-left text-[#ffe2db] drop-shadow-[0_8px_20px_rgba(15,40,55,0.45)]">
            <p className="text-5xl md:text-6xl">✕</p>
          </div>
          <div className="animate-hero-math-drift-reverse absolute left-[9%] bottom-[20%] text-[#c9eef6] drop-shadow-[0_10px_22px_rgba(15,40,55,0.45)]">
            <svg viewBox="0 0 120 36" className="h-16 w-40">
              <line x1="8" y1="18" x2="112" y2="18" stroke="currentColor" strokeWidth="2" />
              <line x1="32" y1="10" x2="32" y2="26" stroke="currentColor" strokeWidth="2" />
              <line x1="72" y1="10" x2="72" y2="26" stroke="currentColor" strokeWidth="2" />
              <circle cx="32" cy="18" r="4" fill="#7ecfdd" />
              <circle cx="72" cy="18" r="4" fill="#c4b5fd" />
            </svg>
          </div>
          <div className="animate-hero-math-parallax absolute right-[12%] bottom-[17%] drop-shadow-[0_10px_22px_rgba(15,40,55,0.45)]">
            <svg viewBox="0 0 80 60" className="h-20 w-24">
              <rect x="10" y="35" width="12" height="15" rx="3" fill="#7ecfdd" />
              <rect x="30" y="24" width="12" height="26" rx="3" fill="#f5a623" />
              <rect x="50" y="15" width="12" height="35" rx="3" fill="#c4b5fd" />
            </svg>
          </div>
          <div className="animate-hero-math-drift absolute left-[20%] top-[30%] text-[#9dd6b8] drop-shadow-[0_8px_20px_rgba(15,40,55,0.45)]">
            <p className="text-5xl md:text-6xl">⚖️</p>
          </div>
          <div className="animate-hero-math-drift-slow absolute right-[20%] top-[40%] text-[#c4b5fd] drop-shadow-[0_8px_20px_rgba(15,40,55,0.45)]">
            <p className="text-5xl font-black">△</p>
          </div>
          <div className="animate-hero-math-drift-reverse absolute left-[34%] bottom-[12%] text-[#f5d547] drop-shadow-[0_8px_20px_rgba(15,40,55,0.45)]">
            <p className="text-5xl md:text-6xl">🧭</p>
          </div>
          <div className="animate-hero-math-parallax absolute right-[34%] bottom-[12%] text-[#ffb4a6] drop-shadow-[0_8px_20px_rgba(15,40,55,0.45)]">
            <p className="text-4xl font-black">✎</p>
          </div>
          <div className="animate-hero-math-drift absolute right-[12%] top-[56%] text-[#7ecfdd] drop-shadow-[0_8px_20px_rgba(15,40,55,0.45)]">
            <p className="text-5xl md:text-6xl">✏️</p>
          </div>
        </div>

        <h1 className="animate-fade-down relative z-[1] max-w-[95vw] font-[family-name:var(--font-baloo)] text-[clamp(3rem,10vw,6.5rem)] font-extrabold leading-[1.02] text-white [animation-delay:0.1s]">
          Rational <span className="text-[#7ecfdd]">Numbers</span>
        </h1>

        <p className="animate-fade-down relative z-[1] mx-auto mt-10 max-w-3xl px-2 text-lg leading-relaxed text-[#C8D9E6] [animation-delay:0.2s] md:text-xl md:leading-relaxed lg:text-2xl">
          Understand fractions, decimals, and number lines with clarity. Build strong concepts step by step and gain confidence
          in problem-solving.
        </p>

        <GetStartedLink className="animate-fade-down group relative z-[1] mt-12 inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-br from-[#6a9eb5] via-[#567C8D] to-[#3d5f75] px-12 py-4 text-xl font-extrabold text-white shadow-[0_8px_28px_rgba(86,124,141,0.5)] ring-1 ring-white/15 transition-all duration-300 ease-out [animation-delay:0.3s] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-tr before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:scale-[1.045] hover:shadow-[0_0_32px_rgba(126,207,221,0.5),0_14px_40px_rgba(86,124,141,0.55)] hover:before:opacity-100 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7ecfdd] md:px-14 md:py-5 md:text-2xl">
          Get Started
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            aria-hidden
            className="md:h-7 md:w-7"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </GetStartedLink>
      </section>

      <LearningPath />
      <div className="h-8 md:h-10" />
    </div>
  );
}
