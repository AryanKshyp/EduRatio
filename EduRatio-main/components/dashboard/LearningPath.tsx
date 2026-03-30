"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SUBTOPICS } from "@/lib/content";
import { UNLOCK_FLIGHT_STORAGE_KEY } from "@/lib/chapterTypes";
import {
  getJourneyMastery,
  isSubtopicUnlocked,
  JOURNEY_STORAGE_KEY,
  MASTERY_UPDATED_EVENT,
  UNLOCK_PREV_MASTERY_MIN,
} from "@/lib/journeyProgress";

const EMOJI = ["➕", "📏", "⚖️", "🪪", "🔄", "🔍"];

type Pt = { x: number; y: number };

function cubicPoint(S: Pt, C1: Pt, C2: Pt, E: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * S.x + 3 * u * u * t * C1.x + 3 * u * t * t * C2.x + t * t * t * E.x,
    y: u * u * u * S.y + 3 * u * u * t * C1.y + 3 * u * t * t * C2.y + t * t * t * E.y,
  };
}

function cubicTangent(S: Pt, C1: Pt, C2: Pt, E: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x:
      3 * u * u * (C1.x - S.x) +
      6 * u * t * (C2.x - C1.x) +
      3 * t * t * (E.x - C2.x),
    y:
      3 * u * u * (C1.y - S.y) +
      6 * u * t * (C2.y - C1.y) +
      3 * t * t * (E.y - C2.y),
  };
}

function angleFromTangent(tx: number, ty: number) {
  return (Math.atan2(ty, tx) * 180) / Math.PI + 90;
}

type MasteryMap = Record<string, number>;

function isUnlocked(index: number): boolean {
  if (index === 0) return true;
  return isSubtopicUnlocked(SUBTOPICS[index]!.id);
}

function activeIndex(mastery: MasteryMap): number {
  const idx = SUBTOPICS.findIndex((t, i) => {
    if (!isUnlocked(i)) return false;
    return (mastery[t.id] ?? 0) < UNLOCK_PREV_MASTERY_MIN;
  });
  return idx === -1 ? SUBTOPICS.length - 1 : idx;
}

function topicVisualState(
  index: number,
  mastery: MasteryMap,
  active: number,
): "locked" | "active" | "completed" | "unlocked" {
  if (!isUnlocked(index)) return "locked";
  const id = SUBTOPICS[index]!.id;
  const pct = mastery[id] ?? 0;
  if (pct >= UNLOCK_PREV_MASTERY_MIN) return "completed";
  if (index === active) return "active";
  return "unlocked";
}

function RingProgress({ pct, state }: { pct: number; state: "locked" | "active" | "completed" | "unlocked" }) {
  const r = 57;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(100, Math.max(0, pct))) / 100;

  const stroke =
    state === "locked"
      ? "transparent"
      : state === "active"
        ? "#f5a623"
        : state === "completed"
          ? "#4caf7d"
          : "#567C8D";

  return (
    <svg className="absolute left-0 top-0 h-full w-full -rotate-90" viewBox="0 0 128 128" aria-hidden>
      <circle className="fill-none stroke-[#2F4156]/13" strokeWidth={7} cx={64} cy={64} r={r} />
      <circle
        className="fill-none transition-[stroke-dashoffset] duration-700 ease-out"
        strokeWidth={7}
        strokeLinecap="round"
        cx={64}
        cy={64}
        r={r}
        stroke={stroke}
        style={{
          strokeDasharray: circ,
          strokeDashoffset: state === "locked" ? circ : offset,
        }}
      />
    </svg>
  );
}

function RocketGlyph({ moving }: { moving: boolean }) {
  return (
    <svg
      width="48"
      height="56"
      viewBox="0 0 48 56"
      className="relative z-[1] drop-shadow-[0_6px_14px_rgba(47,65,86,0.28)] md:h-[3.25rem] md:w-14"
      aria-hidden
    >
      <defs>
        <linearGradient id="rocketHull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#eef7ff" />
          <stop offset="100%" stopColor="#d6e8f8" />
        </linearGradient>
        <linearGradient id="rocketAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8ed1f5" />
          <stop offset="100%" stopColor="#5aa7d8" />
        </linearGradient>
        <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,236,165,0.95)" />
          <stop offset="55%" stopColor="rgba(255,166,90,0.72)" />
          <stop offset="100%" stopColor="rgba(255,104,104,0)" />
        </radialGradient>
        <linearGradient id="flameCore" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe59a" />
          <stop offset="58%" stopColor="#ffab5c" />
          <stop offset="100%" stopColor="#ff6f6f" />
        </linearGradient>
      </defs>
      {moving ? (
        <g className="animate-rocket-flame" style={{ transformOrigin: "24px 43px" }}>
          <ellipse cx="24" cy="45" rx="12" ry="8" fill="url(#flameGlow)" style={{ filter: "blur(3px)" }} />
          <path d="M24 40 C20 46, 18 50, 15 54 C19 53, 22 51, 24 49 C26 51, 29 53, 33 54 C30 50, 28 46, 24 40 Z" fill="url(#flameCore)" opacity="0.9" />
          <circle cx="18.5" cy="49" r="1.1" fill="rgba(255,224,150,0.82)" className="animate-rocket-spark" />
          <circle cx="24" cy="48" r="0.9" fill="rgba(173,226,255,0.72)" className="animate-rocket-spark" style={{ animationDelay: "0.08s" }} />
          <circle cx="29.5" cy="49" r="1.1" fill="rgba(255,170,130,0.72)" className="animate-rocket-spark" style={{ animationDelay: "0.14s" }} />
        </g>
      ) : null}
      <path d="M24 6 C30 11, 33 18, 33 27 L33 40 C33 42, 31.5 43, 30 43 L18 43 C16.5 43, 15 42, 15 40 L15 27 C15 18, 18 11, 24 6 Z" fill="url(#rocketHull)" stroke="#7aa8c4" strokeWidth="1.15" />
      <path d="M15 30 L10 34 L15 36 Z" fill="url(#rocketAccent)" opacity="0.92" />
      <path d="M33 30 L38 34 L33 36 Z" fill="#ffb26f" opacity="0.9" />
      <ellipse cx="24" cy="22.5" rx="4.4" ry="4.2" fill="#f6fcff" stroke="#8eb7d2" strokeWidth="1.1" />
      <ellipse cx="22.9" cy="21.8" rx="1.1" ry="1.1" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}

type Flight = { fromIndex: number; key: number };

export function LearningPath() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rocketWrapRef = useRef<HTMLDivElement>(null);
  const rocketRotRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [mastery, setMastery] = useState<MasteryMap>({});
  const [flight, setFlight] = useState<Flight | null>(null);
  const [maskUnlockToIndex, setMaskUnlockToIndex] = useState<number | null>(null);
  const [rocketMoving, setRocketMoving] = useState(false);
  const [landingBounce, setLandingBounce] = useState(false);

  const readCenter = useCallback((index: number): Pt | null => {
    const wrapper = wrapperRef.current;
    const row = rowRefs.current[index];
    if (!wrapper || !row) return null;
    const wRect = wrapper.getBoundingClientRect();
    const c = row.querySelector("[data-island-circle]");
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - wRect.left,
      y: r.top + r.height / 2 - wRect.top,
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(UNLOCK_FLIGHT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { fromIndex?: number };
      const fromIndex = parsed.fromIndex;
      sessionStorage.removeItem(UNLOCK_FLIGHT_STORAGE_KEY);
      if (typeof fromIndex === "number" && fromIndex >= 0 && fromIndex < SUBTOPICS.length - 1) {
        queueMicrotask(() => {
          setFlight({ fromIndex, key: Date.now() });
          setMaskUnlockToIndex(fromIndex + 1);
        });
      }
    } catch {
      sessionStorage.removeItem(UNLOCK_FLIGHT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const refresh = () => setMastery(getJourneyMastery());
    refresh();
    const onUpdate = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === JOURNEY_STORAGE_KEY) refresh();
    };
    window.addEventListener(MASTERY_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(MASTERY_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const active = activeIndex(mastery);

  const drawPath = useCallback(() => {
    const wrapper = wrapperRef.current;
    const svg = svgRef.current;
    if (!wrapper || !svg) return;

    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    if (rows.length < 2) {
      svg.innerHTML = "";
      return;
    }

    const wRect = wrapper.getBoundingClientRect();
    const pts = rows.map((row) => {
      const c = row.querySelector("[data-island-circle]");
      if (!c) return { x: 0, y: 0 };
      const r = c.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - wRect.left,
        y: r.top + r.height / 2 - wRect.top,
      };
    });

    const w = wrapper.offsetWidth;
    const h = wrapper.offsetHeight;

    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = `${w}px`;
    svg.style.height = `${h}px`;
    svg.style.overflow = "visible";
    svg.style.pointerEvents = "none";
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.innerHTML = "";

    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]!;
      const b = pts[i + 1]!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const tx = dx / dist;
      const ty = dy / dist;
      const px = -ty;
      const py = tx;
      const sign = i % 2 === 0 ? 1 : -1;
      const along = 0.38 * dist;
      const lateral = Math.min(0.52 * dist, 240);
      const cp1x = a.x + tx * along + px * lateral * sign;
      const cp1y = a.y + ty * along + py * lateral * sign;
      const cp2x = b.x - tx * along - px * lateral * sign;
      const cp2y = b.y - ty * along - py * lateral * sign;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${a.x} ${a.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${b.x} ${b.y}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#f5a623");
      path.setAttribute("stroke-width", "5");
      path.setAttribute("stroke-dasharray", "14 9");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
    }
  }, []);

  useLayoutEffect(() => {
    drawPath();
    const ro = new ResizeObserver(() => drawPath());
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", drawPath);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", drawPath);
    };
  }, [drawPath]);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => drawPath());
    return () => cancelAnimationFrame(id);
  }, [mastery, drawPath, maskUnlockToIndex]);

  // Rocket is only visible during the unlock animation (no idle “sitting”).

  useEffect(() => {
    if (!flight) return;
    const fromIndex = flight.fromIndex;
    const toIndex = fromIndex + 1;
    let cancelled = false;
    let raf = 0;
    let rafChain = 0;
    let attempts = 0;

    function finishCleanup() {
      setRocketMoving(false);
      setLandingBounce(false);
      const wrapEl = rocketWrapRef.current;
      if (wrapEl) wrapEl.style.opacity = "0";
      setFlight(null);
      setMaskUnlockToIndex(null);
    }

    function tryLaunch() {
      if (cancelled) return;
      const S = readCenter(fromIndex);
      const E = readCenter(toIndex);
      if (!S || !E) {
        attempts += 1;
        if (attempts > 160) {
          finishCleanup();
          return;
        }
        raf = requestAnimationFrame(tryLaunch);
        return;
      }

      const start: Pt = S;
      const end: Pt = E;

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy) || 1;
      const tx = dx / dist;
      const ty = dy / dist;
      const px = -ty;
      const py = tx;
      const sign = fromIndex % 2 === 0 ? 1 : -1;
      const along = 0.38 * dist;
      const lateral = Math.min(0.52 * dist, 240);
      const C1: Pt = {
        x: start.x + tx * along + px * lateral * sign,
        y: start.y + ty * along + py * lateral * sign,
      };
      const C2: Pt = {
        x: end.x - tx * along - px * lateral * sign,
        y: end.y - ty * along - py * lateral * sign,
      };
      const dur = 1250; // ~1–1.5s as requested
      const t0 = performance.now();

      const wrapEl = rocketWrapRef.current;
      if (wrapEl) {
        wrapEl.style.left = `${start.x}px`;
        wrapEl.style.top = `${start.y}px`;
        wrapEl.style.opacity = "1";
      }

      setRocketMoving(true);

      // Create a faint glowing trail along the arc.
      const trailPath = (() => {
        const svg = svgRef.current;
        const wrap = rocketWrapRef.current;
        if (!svg || !wrap) return null;
        const d = `M ${start.x} ${start.y} C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, ${end.x} ${end.y}`;
        const pEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pEl.setAttribute("d", d);
        pEl.setAttribute("fill", "none");
        pEl.setAttribute("stroke", "rgba(126,207,221,0.55)");
        pEl.setAttribute("stroke-width", "4");
        pEl.setAttribute("stroke-linecap", "round");
        pEl.setAttribute("stroke-dasharray", "1 1");
        // We'll set dasharray/offset after it's in the DOM.
        pEl.style.filter = "drop-shadow(0 0 10px rgba(126,207,221,0.35))";
        svg.appendChild(pEl);
        return pEl;
      })();

      let trailLen = 1;
      if (trailPath) {
        trailLen = Math.max(2, trailPath.getTotalLength());
        trailPath.setAttribute("stroke-dasharray", String(trailLen));
        trailPath.setAttribute("stroke-dashoffset", String(trailLen));
      }

      function tick(now: number) {
        if (cancelled) return;
        const wrap = rocketWrapRef.current;
        const rot = rocketRotRef.current;
        const t = Math.min(1, (now - t0) / dur);
        const te = 1 - Math.pow(1 - t, 2.4);
        const P = cubicPoint(start, C1, C2, end, te);
        const Tan = cubicTangent(start, C1, C2, end, Math.min(1, te + 0.02));
        const ang = angleFromTangent(Tan.x, Tan.y);

        if (wrap) {
          wrap.style.left = `${P.x}px`;
          wrap.style.top = `${P.y}px`;
          wrap.style.filter = `blur(${Math.max(0, (1 - Math.abs(0.5 - t) * 2) * 0.45)}px)`;
        }
        if (rot) rot.style.transform = `rotate(${ang}deg)`;

        if (trailPath) {
          const dash = (1 - te) * trailLen;
          trailPath.setAttribute("stroke-dashoffset", String(dash));
          // fade a bit as it completes
          trailPath.style.opacity = String(0.9 - te * 0.55);
        }

        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setRocketMoving(false);
          if (wrap) {
            wrap.style.left = `${end.x}px`;
            wrap.style.top = `${end.y}px`;
            wrap.style.filter = "blur(0px)";
          }
          if (rot) {
            const endTan = cubicTangent(start, C1, C2, end, 1);
            rot.style.transform = `rotate(${angleFromTangent(endTan.x, endTan.y)}deg)`;
          }
          setLandingBounce(true);
          window.setTimeout(() => {
            if (cancelled) return;
            setLandingBounce(false);
            const wrapEl = rocketWrapRef.current;
            if (wrapEl) wrapEl.style.opacity = "0";
            if (trailPath) trailPath.remove();
            setFlight(null);
            setMaskUnlockToIndex(null);
          }, 560);
        }
      }

      raf = requestAnimationFrame((now) => tick(now));
    }

    const wrapInit = rocketWrapRef.current;
    if (wrapInit) wrapInit.style.opacity = "0";
    rafChain = requestAnimationFrame(() => {
      rafChain = requestAnimationFrame(tryLaunch);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafChain);
    };
  }, [flight, readCenter]);

  return (
    <section
      id="map"
      className="ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-[#F5EFEB] px-4 py-14 md:px-8 md:py-20 lg:px-12"
    >
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h2 className="font-[family-name:var(--font-baloo)] text-3xl font-extrabold text-[#2F4156] md:text-5xl">
          Your Learning Journey 🗺️
        </h2>
        <p className="mt-3 text-base font-semibold text-[#567C8D] md:text-lg lg:text-xl">
          Move through each checkpoint at your own pace.
          Achieve 80% or higher to unlock the next topic and continue your journey.
        </p>
      </div>

      <div ref={wrapperRef} className="relative mx-auto w-full max-w-[min(1400px,100%)] pb-10">
        <svg
          ref={svgRef}
          className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
          aria-hidden
        />

        <div
          ref={rocketWrapRef}
          className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-opacity duration-200 ease-out will-change-[left,top]"
          style={{ transform: "translate(-50%, -50%)" }}
          aria-hidden
        >
          <div ref={rocketRotRef} className="flex flex-col items-center will-change-transform" style={{ transform: "rotate(-38deg)" }}>
            <div
              className={[
                landingBounce ? "animate-rocket-land" : "",
                rocketMoving ? "animate-rocket-enter" : "",
              ].join(" ")}
            >
              <RocketGlyph moving={rocketMoving} />
            </div>
          </div>
        </div>

        {SUBTOPICS.map((topic, index) => {
          const pct = Math.round((mastery[topic.id] ?? 0) * 100);
          const baseUnlocked = isUnlocked(index);
          const holdUnlockVisual = maskUnlockToIndex === index;
          const unlocked = baseUnlocked && !holdUnlockVisual;
          const state = holdUnlockVisual ? "locked" : topicVisualState(index, mastery, active);
          const href = unlocked ? `/subtopic/${topic.id}` : "#";

          const circleClass =
            state === "active"
              ? "animate-pulse-ring border-[#ffd27d] bg-gradient-to-br from-[#f5a623] to-[#e8891a]"
              : state === "completed"
                ? "border-[#a8e6c8] bg-gradient-to-br from-[#4caf7d] to-[#38916a]"
                : state === "unlocked"
                  ? "border-[#7ecfdd] bg-gradient-to-br from-[#567C8D] to-[#3e6577]"
                  : "border-[#c0cdd8] bg-[#dce5ed] saturate-[0.4]";

          return (
            <div
              key={topic.id}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              className={`relative z-[2] flex ${index === SUBTOPICS.length - 1 ? "mb-0" : "mb-14 md:mb-16"} ${index % 2 === 0 ? "justify-start pl-2 md:pl-[8%] lg:pl-[14%]" : "justify-end pr-2 md:pr-[8%] lg:pr-[14%]"}`}
            >
              <Link
                href={href}
                scroll={false}
                onClick={(e) => {
                  if (!unlocked) e.preventDefault();
                }}
                className={`group flex flex-col items-center ${!unlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="relative transition-transform duration-200 group-hover:scale-[1.05]">
                  <div className="relative h-40 w-40 md:h-44 md:w-44">
                    <RingProgress pct={unlocked ? pct : 0} state={state} />
                    <div
                      data-island-circle
                      className={`absolute left-2 top-2 flex h-36 w-36 flex-col items-center justify-center rounded-full border-[3px] shadow-[0_8px_28px_rgba(47,65,86,0.18)] md:h-40 md:w-40 ${circleClass}`}
                    >
                      <span className="text-[2.5rem] leading-none md:text-[2.75rem]">{EMOJI[index] ?? "📘"}</span>
                      <span className="font-[family-name:var(--font-baloo)] text-[0.72rem] font-extrabold tracking-wide text-white/80 md:text-[0.78rem]">
                        TOPIC {index + 1}
                      </span>
                      {index === 0 && state !== "locked" ? (
                        <span className="absolute -right-2 -top-1 whitespace-nowrap rounded-full border-2 border-white bg-[#f5a623] px-2 py-0.5 text-[0.67rem] font-black text-white">
                          ▶ START
                        </span>
                      ) : null}
                      {!unlocked ? (
                        <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-[0.72rem]">
                          {holdUnlockVisual ? "🚀" : "🔒"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-3 max-w-[12rem] text-center md:max-w-none">
                  <p
                    className={`text-base font-extrabold md:text-lg ${state === "locked" ? "text-[#8fa5b5]" : "text-[#2F4156]"}`}
                  >
                    {topic.title}
                  </p>
                  <p
                    className={`mt-1 text-sm font-bold md:text-base ${state === "locked" ? "text-[#aac0ce]" : "text-[#567C8D]"}`}
                  >
                    {holdUnlockVisual
                      ? "Rocket incoming…"
                      : state === "locked"
                        ? "Locked"
                        : `${pct}% mastery`}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
