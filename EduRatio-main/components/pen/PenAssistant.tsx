"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { PenAnimatedAvatar } from "@/components/pen/PenAnimatedAvatar";
import { QUESTIONS, SUBTOPICS } from "@/lib/content";
import {
  chapterLetsBeginBubble,
  COURSE_WELCOME_BUBBLE,
  defaultPenWelcome,
  quizCompleteBubble,
} from "@/lib/penWelcome";
import { QUIZ_COMPLETE_EVENT, type QuizCompleteDetail } from "@/lib/chapterTypes";
import type { PenIntent } from "@/lib/penEngine";

function normalizePathname(raw: string | null): string {
  const s = (raw ?? "").trim();
  if (!s) return "/";
  const noTrail = s.replace(/\/+$/, "");
  return noTrail || "/";
}

export function PenAssistant() {
  const pathname = normalizePathname(usePathname());
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  /** Corner bubble after layout — reliable first paint on the client (avoids SSR/hydration quirks). */
  const [cornerBubbleMounted, setCornerBubbleMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [message, setMessage] = useState(() => defaultPenWelcome("operations"));
  const [bubbleTextOverride, setBubbleTextOverride] = useState<string | null>(null);
  const [firstWelcomeSeen, setFirstWelcomeSeen] = useState(false);

  const activeSubtopicId = useMemo(() => {
    const parts = pathname.split("/");
    return parts[1] === "subtopic" && parts[2] ? parts[2] : "operations";
  }, [pathname]);

  const chapterIdFromPath = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "subtopic" && parts[1]) return parts[1];
    return null;
  }, [pathname]);

  const question = useMemo(
    () => QUESTIONS.find((item) => item.subtopicId === activeSubtopicId),
    [activeSubtopicId],
  );
  const subtopic = useMemo(
    () => SUBTOPICS.find((item) => item.id === activeSubtopicId),
    [activeSubtopicId],
  );

  const cornerBubbleText = useMemo(() => {
    if (bubbleTextOverride) return bubbleTextOverride;
    if (pathname === "/congratulations") return "Congratulations! You have mastered rational numbers.";

    if (pathname === "/dashboard" || pathname === "/") {
      if (!firstWelcomeSeen) return COURSE_WELCOME_BUBBLE;
      return "";
    }

    if (chapterIdFromPath) {
      return chapterLetsBeginBubble(chapterIdFromPath);
    }

    return COURSE_WELCOME_BUBBLE;
  }, [bubbleTextOverride, pathname, chapterIdFromPath, firstWelcomeSeen]);

  useEffect(() => {
    setBubbleTextOverride(null);
  }, [pathname]);

  useEffect(() => {
    if (!cornerBubbleText.trim()) {
      setBubbleVisible(false);
      return;
    }
    setBubbleVisible(true);
    if ((pathname === "/dashboard" || pathname === "/") && !firstWelcomeSeen) {
      setFirstWelcomeSeen(true);
    }
    const ms = pathname === "/dashboard" || pathname === "/" ? 5000 : 4000;
    const timer = window.setTimeout(() => {
      setBubbleVisible(false);
      setBubbleTextOverride(null);
    }, ms);
    return () => window.clearTimeout(timer);
  }, [cornerBubbleText, pathname, firstWelcomeSeen]);

  useLayoutEffect(() => {
    setCornerBubbleMounted(false);
    let alive = true;
    const a = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (alive) setCornerBubbleMounted(true);
      });
    });
    const t = window.setTimeout(() => {
      if (alive) setCornerBubbleMounted(true);
    }, 150);
    return () => {
      alive = false;
      cancelAnimationFrame(a);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    function onQuizComplete(e: Event) {
      const ce = e as CustomEvent<QuizCompleteDetail>;
      const label = ce.detail?.chapterLabel;
      if (label) {
        setBubbleTextOverride(quizCompleteBubble(label));
        setBubbleVisible(true);
      }
    }
    window.addEventListener(QUIZ_COMPLETE_EVENT, onQuizComplete);
    return () => window.removeEventListener(QUIZ_COMPLETE_EVENT, onQuizComplete);
  }, []);

  useEffect(() => {
    setMessage(defaultPenWelcome(activeSubtopicId));
  }, [activeSubtopicId]);

  async function sendPenRequest(intent: PenIntent, interactionType?: "open") {
    setLoading(true);
    try {
      const hintText = question?.hints[hintLevel - 1] ?? "Break the question into smaller steps.";
      const explanationText = subtopic?.concepts[0]?.explanation ?? "Review signs, denominator steps, and simplification.";
      const remediationText =
        "Let us fix this with L1 explanation first, then L2 guided practice, then escalation practice set if needed.";

      const structuredContent =
        intent === "hint" ? hintText : intent === "remediation" ? remediationText : explanationText;

      const sessionId = typeof window !== "undefined" ? localStorage.getItem("active_session_id") : null;
      const response = await fetch("/api/pen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          interactionType: interactionType ?? intent,
          structuredContent,
          context: {
            sessionId: sessionId ?? undefined,
            subtopicId: activeSubtopicId,
            questionId: question?.id,
            hintLevel: intent === "hint" ? hintLevel : undefined,
          },
        }),
      });
      const data = (await response.json()) as { text?: string; error?: string };
      setMessage(data.text ?? data.error ?? "Pen is ready.");
    } finally {
      setLoading(false);
    }
  }

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      setBubbleVisible(false);
      void sendPenRequest("motivation", "open");
    } else {
      setBubbleVisible(true);
    }
  }

  const showCornerBubble = cornerBubbleMounted && bubbleVisible && !open && cornerBubbleText.trim().length > 0;

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex w-[min(340px,calc(100vw-1.5rem))] flex-col items-end gap-3 pb-[max(0.25rem,env(safe-area-inset-bottom))] md:bottom-8 md:right-8"
    >
      {showCornerBubble ? (
        <div className="relative w-full max-w-[300px] rounded-[18px] rounded-br-sm bg-[#243647] px-4 py-3 text-left shadow-[0_8px_28px_rgba(0,0,0,0.35)] md:max-w-[320px]">
          <p className="text-sm font-bold leading-snug text-white md:text-[0.95rem]">{cornerBubbleText}</p>
          <span
            className="absolute -bottom-2 right-10 h-0 w-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#243647]"
            aria-hidden
          />
        </div>
      ) : null}

      <button
        type="button"
        className="group relative flex h-[118px] w-[104px] shrink-0 cursor-pointer items-end justify-center bg-transparent p-0 pb-0.5 outline-none transition hover:scale-[1.04] focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-[#7ecfdd] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fafc] md:h-[128px] md:w-[112px]"
        onClick={handleToggle}
        aria-label="Open Pen assistant"
      >
        <PenAnimatedAvatar className="h-[118px] w-[96px] shrink-0 drop-shadow-[0_14px_28px_rgba(47,65,86,0.4)] transition group-hover:drop-shadow-[0_18px_34px_rgba(47,65,86,0.5)] md:h-[128px] md:w-[104px]" />
      </button>

      {open ? (
        <div className="w-full max-w-sm rounded-2xl border border-[#C8D9E6] bg-white p-4 shadow-2xl md:p-5">
          <p className="text-sm font-semibold text-[#2F4156]">Pen</p>
          <p className="mt-2 text-sm text-slate-700">{loading ? "Thinking..." : message}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              className="rounded-lg bg-[#567C8D] px-2 py-2.5 text-xs font-semibold text-white"
              onClick={() => void sendPenRequest("explanation")}
            >
              Explain
            </button>
            <button
              className="rounded-lg border border-[#567C8D] px-2 py-2.5 text-xs font-semibold text-[#567C8D]"
              onClick={() => void sendPenRequest("hint")}
            >
              Hint H{hintLevel}
            </button>
            <button
              className="rounded-lg bg-[#F5EFEB] px-2 py-2.5 text-xs font-semibold text-[#2F4156]"
              onClick={() => void sendPenRequest("remediation")}
            >
              Remedial
            </button>
          </div>
          <button
            className="mt-2 w-full rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-600"
            onClick={() => setHintLevel((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)))}
          >
            Next Hint Level (1 to 3)
          </button>
        </div>
      ) : null}
    </div>
  );
}
