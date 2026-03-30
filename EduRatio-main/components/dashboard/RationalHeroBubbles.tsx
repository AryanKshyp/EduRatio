"use client";

import type { CSSProperties, ReactNode } from "react";

type Accent = "cyan" | "teal" | "lavender" | "mint" | "coral";

const ACCENT: Record<
  Accent,
  {
    panel: string;
    symbolGlow: string;
    symbolClass: string;
  }
> = {
  cyan: {
    panel:
      "border-[#7ecfdd]/25 bg-gradient-to-br from-[#7ecfdd]/[0.22] via-white/[0.14] to-[#3d5a74]/[0.18] shadow-[0_4px_28px_rgba(126,207,221,0.12)]",
    symbolGlow: "drop-shadow(0 0 20px rgba(126,207,221,0.35))",
    symbolClass: "text-[#b8f0f8]",
  },
  teal: {
    panel:
      "border-[#5ec4d4]/25 bg-gradient-to-br from-[#5ec4d4]/[0.2] via-white/[0.12] to-[#2F4156]/[0.16] shadow-[0_4px_26px_rgba(94,196,212,0.1)]",
    symbolGlow: "drop-shadow(0 0 18px rgba(94,196,212,0.32))",
    symbolClass: "text-[#a8e8ef]",
  },
  lavender: {
    panel:
      "border-[#c4b5fd]/28 bg-gradient-to-br from-[#c4b5fd]/[0.2] via-white/[0.12] to-[#4a5d78]/[0.15] shadow-[0_4px_26px_rgba(196,181,253,0.11)]",
    symbolGlow: "drop-shadow(0 0 20px rgba(196,181,253,0.32))",
    symbolClass: "text-[#ddd6fe]",
  },
  mint: {
    panel:
      "border-[#9dd6b8]/28 bg-gradient-to-br from-[#9dd6b8]/[0.22] via-white/[0.12] to-[#3d5a74]/[0.14] shadow-[0_4px_26px_rgba(157,214,184,0.11)]",
    symbolGlow: "drop-shadow(0 0 18px rgba(157,214,184,0.28))",
    symbolClass: "text-[#c4efd6]",
  },
  coral: {
    panel:
      "border-[#e8a598]/30 bg-gradient-to-br from-[#ffb4a6]/[0.2] via-white/[0.1] to-[#3d5a74]/[0.14] shadow-[0_4px_26px_rgba(232,165,152,0.1)]",
    symbolGlow: "drop-shadow(0 0 16px rgba(255,180,166,0.28))",
    symbolClass: "text-[#ffd0c8]",
  },
};

function SymbolBlock({
  symbol,
  caption,
  position,
  animationClass,
  style,
  accent,
  symbolSizeClass,
  bubbleSizeClass,
}: {
  symbol: ReactNode;
  caption: ReactNode;
  position: string;
  animationClass: string;
  style?: CSSProperties;
  accent: Accent;
  symbolSizeClass?: string;
  bubbleSizeClass: string;
}) {
  const a = ACCENT[accent];
  return (
    <div className={`absolute ${position}`}>
      <div style={style} className={`flex select-none flex-col items-center ${animationClass}`}>
        <div
          className={`relative overflow-hidden rounded-full border border-white/20 bg-white/[0.18] backdrop-blur-xl ${bubbleSizeClass} shadow-[0_18px_50px_rgba(47,65,86,0.10)] ${a.panel}`}
        >
          {/* Light reflections */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_55%)] opacity-70"
          />
          <div
            aria-hidden
            className="absolute -left-6 -top-6 h-28 w-28 rotate-12 rounded-full bg-white/20 blur-md opacity-60"
          />
          <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center px-4 text-center">
            <div
              className={`hero-math-symbol-inner text-[clamp(2.4rem,9vw,5.2rem)] font-extralight leading-none tracking-tight ${a.symbolClass} ${symbolSizeClass ?? ""}`}
              style={{ filter: a.symbolGlow }}
            >
              {symbol}
            </div>
            <div className="hero-math-caption mt-2 px-1 text-center font-mono text-[0.6rem] font-semibold tabular-nums leading-snug">
              {caption}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RationalHeroBubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Cluster A: (+) and fractions */}
      <SymbolBlock
        accent="cyan"
        position="left-[7%] top-[24%] md:left-[10%] md:top-[26%]"
        animationClass="animate-hero-math-drift"
        style={{ animationDelay: "-2s" }}
        bubbleSizeClass="h-[9rem] w-[9rem] md:h-[10.5rem] md:w-[10.5rem]"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold translate-y-[-0.1em]">+</span>}
        caption={
          <>
            <span className="text-[#dff8fc]/95">3/4</span>
            <span className="text-white/40"> + </span>
            <span className="text-[#dff8fc]/95">1/4</span>
            <span className="text-white/40"> = </span>
            <span className="text-[#7ecfdd]/95">1</span>
          </>
        }
      />
      <SymbolBlock
        accent="lavender"
        position="left-[3%] top-[40%] md:left-[6%] md:top-[44%]"
        animationClass="animate-hero-math-drift-slow"
        style={{ animationDelay: "-4.6s" }}
        bubbleSizeClass="h-16 w-16 md:h-20 md:w-20"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold text-[1.05rem]">1/2</span>}
        caption={<span className="text-white/60 text-[0.58rem]">1/2</span>}
      />
      <SymbolBlock
        accent="teal"
        position="left-[6%] top-[52%] md:left-[9%] md:top-[56%]"
        animationClass="animate-hero-math-drift-reverse"
        style={{ animationDelay: "-6.3s" }}
        bubbleSizeClass="h-14 w-14 md:h-18 md:w-18"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold text-[0.98rem]">3/4</span>}
        caption={<span className="text-white/60 text-[0.56rem]">3/4</span>}
      />

      {/* Cluster B: (−) and negatives */}
      <SymbolBlock
        accent="coral"
        position="right-[7%] top-[26%] md:right-[10%] md:top-[28%]"
        animationClass="animate-hero-math-drift-slow"
        style={{ animationDelay: "-3.3s" }}
        bubbleSizeClass="h-[8.2rem] w-[8.2rem] md:h-[9.8rem] md:w-[9.8rem]"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold translate-y-[-0.08em]">−</span>}
        caption={
          <>
            <span className="text-[#ffd0c8]/95">−3</span>
            <span className="text-white/45">/</span>
            <span className="text-[#ffe8e3]/90">4</span>
          </>
        }
      />
      <SymbolBlock
        accent="lavender"
        position="right-[4%] top-[42%] md:right-[6%] md:top-[46%]"
        animationClass="animate-hero-math-drift"
        style={{ animationDelay: "-5.2s" }}
        bubbleSizeClass="h-14 w-14 md:h-18 md:w-18"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold text-[0.92rem]">−3/4</span>}
        caption={<span className="text-white/60 text-[0.56rem]">−3/4</span>}
      />
      <SymbolBlock
        accent="mint"
        position="right-[8%] top-[55%] md:right-[11%] md:top-[58%]"
        animationClass="animate-hero-math-drift-reverse"
        style={{ animationDelay: "-7.1s" }}
        bubbleSizeClass="h-16 w-16 md:h-20 md:w-20"
        symbol={
          <svg viewBox="0 0 40 40" className="h-[2.1rem] w-[2.1rem]" aria-hidden>
            <path
              d="M20 4 L36 34 L4 34 Z"
              fill="rgba(126,207,221,0.18)"
              stroke="rgba(156,214,184,0.55)"
              strokeWidth="1.6"
            />
            <circle cx="20" cy="20" r="6" fill="rgba(196,181,253,0.2)" />
          </svg>
        }
        caption={<span className="text-white/60 text-[0.56rem]">shape</span>}
      />

      {/* Cluster C: (÷) and number-line snippet */}
      <SymbolBlock
        accent="teal"
        position="left-1/2 bottom-[7%] -translate-x-1/2 md:bottom-[10%]"
        animationClass="animate-hero-math-parallax"
        style={{ animationDelay: "-3s" }}
        bubbleSizeClass="h-[9.3rem] w-[9.3rem] md:h-[11.2rem] md:w-[11.2rem]"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold translate-y-[-0.06em]">÷</span>}
        caption={
          <>
            <span className="text-[#d4f4f8]/95">1</span>
            <span className="text-white/45"> ÷ </span>
            <span className="text-[#d4f4f8]/95">1/2</span>
            <span className="text-white/45"> = </span>
            <span className="text-[#7ecfdd]/95">2</span>
          </>
        }
        symbolSizeClass="!text-[clamp(2.3rem,8vw,5.1rem)]"
      />
      <SymbolBlock
        accent="mint"
        position="left-[16%] bottom-[18%] md:left-[18%] md:bottom-[20%]"
        animationClass="animate-hero-math-drift"
        style={{ animationDelay: "-6.6s" }}
        bubbleSizeClass="h-16 w-16 md:h-20 md:w-20"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold text-[1.1rem]">0.25</span>}
        caption={<span className="text-white/60 text-[0.58rem]">0.25</span>}
      />
      <SymbolBlock
        accent="mint"
        position="left-[22%] bottom-[28%] md:left-[24%] md:bottom-[31%]"
        animationClass="animate-hero-math-drift-slow"
        style={{ animationDelay: "-8.4s" }}
        bubbleSizeClass="h-14 w-14 md:h-18 md:w-18"
        symbol={<span className="font-[family-name:var(--font-baloo)] font-semibold text-[1.0rem]">0.75</span>}
        caption={<span className="text-white/60 text-[0.56rem]">0.75</span>}
      />
      <SymbolBlock
        accent="lavender"
        position="left-[40%] bottom-[22%] md:left-[44%] md:bottom-[25%]"
        animationClass="animate-hero-math-drift-reverse"
        style={{ animationDelay: "-7.8s" }}
        bubbleSizeClass="h-14 w-14 md:h-18 md:w-18"
        symbol={
          <svg viewBox="0 0 60 28" className="h-[2rem] w-auto" aria-hidden>
            <line x1="6" y1="14" x2="54" y2="14" stroke="rgba(211,244,248,0.55)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="14" r="4" fill="rgba(126,207,221,0.22)" stroke="rgba(126,207,221,0.7)" strokeWidth="1" />
            <circle cx="38" cy="14" r="4" fill="rgba(196,181,253,0.22)" stroke="rgba(196,181,253,0.7)" strokeWidth="1" />
            <path d="M22 4 L22 24" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <path d="M38 4 L38 24" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </svg>
        }
        caption={<span className="text-white/60 text-[0.56rem]">−3/4 & 1/2</span>}
      />

      {/* Small graph bars */}
      <SymbolBlock
        accent="cyan"
        position="right-[12%] bottom-[26%] md:right-[16%] md:bottom-[30%]"
        animationClass="animate-hero-math-drift-slow"
        style={{ animationDelay: "-9.0s" }}
        bubbleSizeClass="h-14 w-14 md:h-18 md:w-18"
        symbol={
          <svg viewBox="0 0 60 60" className="h-[2.1rem] w-[2.1rem]" aria-hidden>
            <rect x="12" y="32" width="8" height="16" rx="3" fill="rgba(126,207,221,0.26)" />
            <rect x="24" y="24" width="8" height="24" rx="3" fill="rgba(200,244,252,0.22)" />
            <rect x="36" y="18" width="8" height="30" rx="3" fill="rgba(196,181,253,0.22)" />
            <path d="M10 50 H50" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        }
        caption={<span className="text-white/60 text-[0.56rem]">graph</span>}
      />
    </div>
  );
}
