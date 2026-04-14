"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ChapterBundle, ChapterQuizItem } from "@/lib/chapterTypes";
import { QUIZ_COMPLETE_EVENT, UNLOCK_FLIGHT_STORAGE_KEY } from "@/lib/chapterTypes";
import { PenChapterBanner } from "@/components/subtopic/PenChapterBanner";
import { SolveFlashCard } from "@/components/subtopic/SolveFlashCard";
import { BlackboardPreQuizSummary } from "@/components/subtopic/BlackboardPreQuizSummary";
import {
  hasMasteredAllSubtopics,
  isSubtopicUnlocked,
  MASTERY_UPDATED_EVENT,
  mergeSubtopicMastery,
  UNLOCK_PREV_MASTERY_MIN,
} from "@/lib/journeyProgress";
import { SUBTOPICS } from "@/lib/content";
import { MERGE_SESSION_STORAGE_KEYS } from "@/lib/mergeSessionKeys";

type MergeRecommendation = {
  learning_state?: string;
  recommendation?: {
    reason?: string;
    next_steps?: string[];
    prerequisite_url?: string;
  };
};

type PendingCompletion = {
  session_id: string;
  status: "completed" | "exited_midway";
  token: string;
  queued_at: string;
};

const PENDING_COMPLETIONS_KEY = "merge_pending_completions";
const EXIT_CONFIRM_MESSAGE = "Your progress will be saved. Are you sure you want to leave?";

function readPendingCompletions(): PendingCompletion[] {
  try {
    const raw = localStorage.getItem(PENDING_COMPLETIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingCompletion[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePendingCompletions(items: PendingCompletion[]) {
  localStorage.setItem(PENDING_COMPLETIONS_KEY, JSON.stringify(items));
}

function queuePendingCompletion(item: PendingCompletion) {
  const existing = readPendingCompletions();
  if (existing.some((entry) => entry.session_id === item.session_id && entry.status === item.status)) {
    return;
  }
  writePendingCompletions([...existing, item]);
}

function normalizeInput(s: string) {
  return s.replace(/\s+/g, "").toLowerCase();
}

function parseFraction(s: string): number | null {
  const t = normalizeInput(s);
  const m = t.match(/^(-?\d+)\/(-?\d+)$/);
  if (!m) return null;
  const num = parseInt(m[1]!, 10);
  const den = parseInt(m[2]!, 10);
  if (den === 0) return null;
  return num / den;
}

function answerMatchesFraction(user: string, accepted: string[]): boolean {
  const u = user.trim();
  if (!u) return false;
  const nu = normalizeInput(u);
  for (const a of accepted) {
    if (normalizeInput(a) === nu) return true;
  }
  const uv = parseFraction(u);
  if (uv === null) {
    const dec = parseFloat(u.replace(/\s/g, ""));
    if (!Number.isFinite(dec)) return false;
    return accepted.some((a) => {
      const av = parseFraction(a);
      return av !== null && Math.abs(av - dec) < 1e-6;
    });
  }
  return accepted.some((a) => {
    const av = parseFraction(a);
    return av !== null && Math.abs(av - uv) < 1e-9;
  });
}

type QuizPhase = "idle" | "correct" | "wrong_pick" | "remedial";

const lessonBand: Record<
  ChapterBundle["lessons"][number]["accent"],
  { bar: string; glow: string }
> = {
  teal: { bar: "from-[#567C8D] to-[#7ecfdd]", glow: "shadow-[0_20px_60px_rgba(86,124,141,0.12)]" },
  coral: { bar: "from-[#e07a5f] to-[#ffb4a6]", glow: "shadow-[0_20px_60px_rgba(224,122,95,0.12)]" },
  violet: { bar: "from-[#6d5acd] to-[#c4b5fd]", glow: "shadow-[0_20px_60px_rgba(109,90,205,0.12)]" },
  sun: { bar: "from-[#f5a623] to-[#f5d547]", glow: "shadow-[0_20px_60px_rgba(245,166,35,0.15)]" },
};

export function ChapterFlowClient({ bundle }: { bundle: ChapterBundle }) {
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState<boolean | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [textAnswer, setTextAnswer] = useState("");
  const [mcqPick, setMcqPick] = useState<number | null>(null);
  const [phase, setPhase] = useState<QuizPhase>("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [quizSummary, setQuizSummary] = useState<{ correct: number; total: number } | null>(null);
  const [preQuizStarted, setPreQuizStarted] = useState(false);
  const [mergeRecommendation, setMergeRecommendation] = useState<MergeRecommendation | null>(null);
  const outcomesRef = useRef<boolean[]>([]);
  const attemptCountsRef = useRef<Record<string, number>>({});
  const remedialShownRef = useRef<Record<string, boolean>>({});
  const questionStartMsRef = useRef<number>(0);
  const hasCompletedSessionRef = useRef(false);
  const hasQueuedExitRef = useRef(false);

  async function submitCompletion(
    input: Pick<PendingCompletion, "session_id" | "status" | "token">,
  ): Promise<{ ok: boolean; recommendation?: MergeRecommendation }> {
    try {
      const response = await fetch("/api/session/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${input.token}`,
        },
        body: JSON.stringify({ session_id: input.session_id, status: input.status }),
      });

      if (!response.ok) {
        queuePendingCompletion({
          ...input,
          queued_at: new Date().toISOString(),
        });
        return { ok: false };
      }

      const result = (await response.json()) as { data?: { recommendation?: MergeRecommendation } };
      return { ok: true, recommendation: result?.data?.recommendation };
    } catch {
      queuePendingCompletion({
        ...input,
        queued_at: new Date().toISOString(),
      });
      return { ok: false };
    }
  }

  useLayoutEffect(() => {
    outcomesRef.current = new Array(bundle.quiz.length).fill(false);
  }, [bundle.quiz.length]);

  useEffect(() => {
    queueMicrotask(() => setAccessDenied(!isSubtopicUnlocked(bundle.id)));
  }, [bundle.id]);

  useEffect(() => {
    questionStartMsRef.current = Date.now();
  }, [qIndex]);

  useEffect(() => {
    const token = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.token);
    const studentId = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.studentId);
    const sessionId = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.sessionId);
    if (!token || !studentId || !sessionId) return;

    void fetch("/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: studentId,
        session_id: sessionId,
        total_questions: bundle.quiz.length,
        total_hints_embedded: bundle.quiz.length * 3,
      }),
    });
  }, [bundle.quiz.length]);

  useEffect(() => {
    let active = true;
    const flushPending = async () => {
      const pending = readPendingCompletions();
      if (!pending.length) return;

      const remaining: PendingCompletion[] = [];
      for (const entry of pending) {
        const result = await submitCompletion(entry);
        if (!result.ok) {
          remaining.push(entry);
        }
      }
      if (active) {
        writePendingCompletions(remaining);
      }
    };

    void flushPending();
    const onOnline = () => void flushPending();
    window.addEventListener("online", onOnline);
    return () => {
      active = false;
      window.removeEventListener("online", onOnline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasCompletedSessionRef.current) return;
      const token = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.token);
      const sessionId = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.sessionId);
      if (!token || !sessionId) return;
      hasQueuedExitRef.current = true;
      queuePendingCompletion({
        session_id: sessionId,
        status: "exited_midway",
        token,
        queued_at: new Date().toISOString(),
      });
      event.preventDefault();
      event.returnValue = EXIT_CONFIRM_MESSAGE;
    };

    const handleUnload = () => {
      if (!hasQueuedExitRef.current || hasCompletedSessionRef.current) return;
      const token = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.token);
      const sessionId = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.sessionId);
      if (!token || !sessionId) return;
      const payload = JSON.stringify({
        session_id: sessionId,
        status: "exited_midway",
        token,
      });
      navigator.sendBeacon(
        "/api/session/complete",
        new Blob([payload], { type: "application/json" }),
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const sync = () => setAccessDenied(!isSubtopicUnlocked(bundle.id));
    window.addEventListener(MASTERY_UPDATED_EVENT, sync);
    return () => window.removeEventListener(MASTERY_UPDATED_EVENT, sync);
  }, [bundle.id]);

  const question = bundle.quiz[qIndex];
  const progress = useMemo(
    () => ({ current: qIndex + 1, total: bundle.quiz.length }),
    [qIndex, bundle.quiz.length],
  );

  function resetQuestionState() {
    setTextAnswer("");
    setMcqPick(null);
    setPhase("idle");
    setHintsShown(0);
  }

  function ensureOutcomesLen() {
    if (outcomesRef.current.length !== bundle.quiz.length) {
      outcomesRef.current = new Array(bundle.quiz.length).fill(false);
    }
  }

  function syncMasteryFromOutcomes() {
    const total = bundle.quiz.length;
    if (total === 0) return;
    ensureOutcomesLen();
    const correct = outcomesRef.current.filter(Boolean).length;
    mergeSubtopicMastery(bundle.id, correct / total);
  }

  function advanceQuiz(wasCorrect: boolean) {
    if (qIndex >= bundle.quiz.length) return;
    ensureOutcomesLen();
    outcomesRef.current[qIndex] = wasCorrect;
    syncMasteryFromOutcomes();

    if (qIndex < bundle.quiz.length - 1) {
      setQIndex((i) => i + 1);
      resetQuestionState();
      return;
    }

    const correct = outcomesRef.current.filter(Boolean).length;
    setQuizSummary({ correct, total: bundle.quiz.length });
    if (typeof window !== "undefined") {
      const topicIdx = SUBTOPICS.findIndex((t) => t.id === bundle.id);
      if (
        (correct / bundle.quiz.length) >= UNLOCK_PREV_MASTERY_MIN &&
        topicIdx >= 0 &&
        topicIdx < SUBTOPICS.length - 1
      ) {
        try {
          sessionStorage.setItem(
            UNLOCK_FLIGHT_STORAGE_KEY,
            JSON.stringify({ fromIndex: topicIdx }),
          );
        } catch {
          /* ignore quota / private mode */
        }
      }
      window.dispatchEvent(
        new CustomEvent(QUIZ_COMPLETE_EVENT, {
          detail: { subtopicId: bundle.id, chapterLabel: bundle.hero.chapterLabel },
        }),
      );
      if (
        bundle.id === "numbers-between" &&
        (correct / bundle.quiz.length) >= UNLOCK_PREV_MASTERY_MIN &&
        hasMasteredAllSubtopics()
      ) {
        router.push("/congratulations");
        return;
      }
    }
    setQIndex(bundle.quiz.length);
    resetQuestionState();
  }

  function checkCorrect(item: ChapterQuizItem): boolean {
    if (item.kind === "mcq") return mcqPick === item.correctIndex;
    return answerMatchesFraction(textAnswer, [...item.accepted]);
  }

  function onSubmit() {
    if (phase === "remedial" || !question) return;
    const isCorrect = checkCorrect(question);
    const nextAttempt = (attemptCountsRef.current[question.id] ?? 0) + 1;
    attemptCountsRef.current[question.id] = nextAttempt;
    const token = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.token);
    const sessionId = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.sessionId);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - questionStartMsRef.current) / 1000));
    if (token && sessionId) {
      void fetch("/api/session/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          event: "question_attempt",
          data: {
            subtopic_id: bundle.id,
            question_id: question.id,
            correct: isCorrect,
            attempt: nextAttempt,
            hint_level: hintsShown as 0 | 1 | 2 | 3,
            time_taken: elapsedSeconds,
            current_difficulty: "medium",
            remedial_done: remedialShownRef.current[question.id] ? 1 : 0,
            is_first_attempt: nextAttempt === 1,
          },
        }),
      });
    }

    if (isCorrect) {
      setPhase("correct");
      return;
    }
    if (hintsShown >= 3) {
      remedialShownRef.current[question.id] = true;
      setPhase("remedial");
      return;
    }
    setPhase("wrong_pick");
  }

  function onChooseHint() {
    if (hintsShown >= 3) {
      if (question) remedialShownRef.current[question.id] = true;
      setPhase("remedial");
      return;
    }
    setHintsShown((h) => Math.min(3, h + 1));
    setPhase("idle");
  }

  function onRetry() {
    setPhase("idle");
    if (question.kind === "fraction") setTextAnswer("");
    else setMcqPick(null);
  }

  const finishedAll = qIndex >= bundle.quiz.length;

  useEffect(() => {
    if (!finishedAll || hasCompletedSessionRef.current) return;
    const token = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.token);
    const sessionId = sessionStorage.getItem(MERGE_SESSION_STORAGE_KEYS.sessionId);
    if (!token || !sessionId) return;

    hasCompletedSessionRef.current = true;
    void submitCompletion({
      session_id: sessionId,
      status: "completed",
      token,
    }).then((result) => {
      if (result.recommendation) {
        setMergeRecommendation(result.recommendation);
      }
    });
  }, [finishedAll]);

  const prevTopicLabel = useMemo(() => {
    const idx = SUBTOPICS.findIndex((t) => t.id === bundle.id);
    if (idx <= 0) return null;
    return SUBTOPICS[idx - 1]!.title;
  }, [bundle.id]);

  if (accessDenied === null) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center bg-[#F5EFEB]/80 text-[#567C8D]">
        <p className="text-sm font-bold">Loading your journey…</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-x-hidden">
        <PenChapterBanner hero={bundle.hero} />
        <div className="relative bg-[#F5EFEB]/80 px-5 py-16 md:px-10">
          <div className="mx-auto max-w-lg rounded-3xl border-2 border-[#c0cdd8] bg-white p-8 text-center shadow-lg">
            <p className="text-3xl" aria-hidden>
              🔒
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-baloo)] text-2xl font-extrabold text-[#2F4156]">
              Chapter locked
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-700">
              Finish the previous topic and score at least {Math.round(UNLOCK_PREV_MASTERY_MIN * 100)}% on its quiz to
              unlock this one{prevTopicLabel ? ` (after ${prevTopicLabel})` : ""}.
            </p>
            <Link
              href="/dashboard#map"
              className="mt-6 inline-flex rounded-2xl bg-[#567C8D] px-8 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[#456d7e]"
            >
              Back to learning journey
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-x-hidden">
      <PenChapterBanner hero={bundle.hero} />

      <div className="relative bg-[#F5EFEB]/80">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#C8D9E6]/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-[min(96rem,100%)] space-y-12 px-5 py-10 md:px-10 md:py-14 lg:px-16">
          <section
            className="op-reveal relative overflow-hidden rounded-3xl border border-[#C8D9E6] bg-white p-6 shadow-[0_16px_50px_rgba(47,65,86,0.08)] md:p-10"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100%] bg-[#C8D9E6]/35" />
            <h2 className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold text-[#2F4156] md:text-3xl">
              {bundle.domainIntro.heading}
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-slate-800 md:text-lg">{bundle.domainIntro.definition}</p>
            <p className="mt-3 text-sm font-semibold text-[#567C8D] md:text-base">{bundle.domainIntro.bridge}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {bundle.domainIntro.objectives.map((o) => (
                <li
                  key={o}
                  className="flex gap-2 rounded-xl bg-[#F5EFEB] px-4 py-3 text-sm font-semibold text-[#2F4156] shadow-sm"
                >
                  <span className="text-[#567C8D]" aria-hidden>
                    ✓
                  </span>
                  {o}
                </li>
              ))}
            </ul>
            {bundle.id === "number-line" ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white p-4">
                <svg viewBox="0 0 760 180" className="h-auto w-full" aria-label="number line">
                  <line x1="30" y1="70" x2="730" y2="70" stroke="#111827" strokeWidth="4" />
                  <path d="M30 70 L52 50 M30 70 L52 90" stroke="#111827" strokeWidth="4" fill="none" />
                  <path d="M730 70 L708 50 M730 70 L708 90" stroke="#111827" strokeWidth="4" fill="none" />
                  {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((n, i) => {
                    const x = 90 + i * 72;
                    const color = n < 0 ? "#dc2626" : n > 0 ? "#1d4ed8" : "#111827";
                    return (
                      <g key={n}>
                        <line x1={x} y1="48" x2={x} y2="92" stroke="#111827" strokeWidth="4" />
                        <text x={x} y="120" textAnchor="middle" fill={color} fontSize="36" fontWeight="700">
                          {n}
                        </text>
                      </g>
                    );
                  })}
                  <text x="190" y="165" textAnchor="middle" fill="#dc2626" fontSize="28" fontWeight="700">
                    Negative Integers
                  </text>
                  <text x="560" y="165" textAnchor="middle" fill="#1d4ed8" fontSize="28" fontWeight="700">
                    Positive Integers
                  </text>
                </svg>
              </div>
            ) : null}
            {bundle.domainIntro.prerequisite ? (
              <p className="mt-5 rounded-xl bg-[#2F4156]/5 px-4 py-2 text-sm font-bold text-[#2F4156]">
                {bundle.domainIntro.prerequisite}
              </p>
            ) : null}
          </section>

          {bundle.lessons.map((lesson, idx) => {
            const band = lessonBand[lesson.accent];
            const reverse = idx % 2 === 1;
            return (
              <section
                key={lesson.id}
                className={`op-reveal relative overflow-hidden rounded-3xl border border-[#C8D9E6]/60 bg-white p-6 md:p-10 ${band.glow}`}
                style={{ animationDelay: `${0.12 + idx * 0.06}s` }}
              >
                <div className={`mb-6 h-1.5 w-full rounded-full bg-gradient-to-r ${band.bar}`} />
                <div className={`flex flex-col gap-10 lg:items-stretch ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
                  <div className="flex-1 space-y-4">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#567C8D]">{lesson.sectionKey}</p>
                    <h3 className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold text-[#2F4156] md:text-3xl">
                      {lesson.teachTitle}
                    </h3>
                    {lesson.teachBlocks.map((p) => (
                      <p key={p} className="text-base leading-relaxed text-slate-800 md:text-[1.05rem]">
                        {p}
                      </p>
                    ))}
                    {lesson.formulaLines?.map((f) => (
                      <p
                        key={f}
                        className="rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] px-4 py-3 font-mono text-base font-bold text-[#2F4156]"
                      >
                        {f}
                      </p>
                    ))}
                    {lesson.signRules ? (
                      <div className="overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white">
                        <table className="w-full text-sm md:text-base">
                          <thead className="bg-[#2F4156] text-white">
                            <tr>
                              <th className="px-4 py-2 text-left font-extrabold">Combination</th>
                              <th className="px-4 py-2 text-left font-extrabold">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lesson.signRules.map((r) => (
                              <tr key={r.combo} className="border-t border-[#C8D9E6]">
                                <td className="px-4 py-2 font-semibold text-[#2F4156]">{r.combo}</td>
                                <td className="px-4 py-2 text-slate-700">{r.result}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    {lesson.warning ? (
                      <p className="rounded-xl border-2 border-[#f5a623]/50 bg-[#fff8e6] px-4 py-3 text-sm font-bold text-[#8a5a00]">
                        {lesson.warning}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-1 items-center justify-center lg:min-h-[16rem]">
                    <SolveFlashCard lesson={lesson} />
                  </div>
                </div>
              </section>
            );
          })}

          <section
            className="op-reveal relative overflow-hidden rounded-3xl border-2 border-[#567C8D]/30 bg-gradient-to-br from-[#C8D9E6]/30 via-white to-[#F5EFEB]/90 p-6 md:p-10"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#7ecfdd]/25 blur-3xl" />
            <h2 className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold text-[#2F4156] md:text-3xl">
              Check your understanding
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-700 md:text-base">
              Questions match the ideas in this chapter. Wrong answer? Choose a hint (up to three) or try again. After three
              hints, the next miss shows short remedial help.
            </p>

            {bundle.preQuizSummary ? (
              <BlackboardPreQuizSummary summary={bundle.preQuizSummary} />
            ) : null}

            {!finishedAll && qIndex === 0 && !preQuizStarted && bundle.preQuizSummary ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setPreQuizStarted(true)}
                  className="rounded-2xl bg-[#567C8D] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#456d7e]"
                >
                  Start quiz
                </button>
              </div>
            ) : finishedAll ? (
              <div className="mt-8 rounded-2xl bg-white/90 p-8 text-center shadow-inner backdrop-blur-sm">
                <p className="text-xl font-extrabold text-[#2F4156]">Quiz block complete — amazing work!</p>
                {quizSummary ? (
                  <p className="mt-3 text-base font-bold text-[#567C8D]">
                    Your score: {quizSummary.correct} / {quizSummary.total} (
                    {Math.round((quizSummary.correct / quizSummary.total) * 100)}%)
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-slate-600">Head back to your journey map whenever you&apos;re ready.</p>
                {mergeRecommendation?.recommendation?.reason ? (
                  <div className="mt-4 rounded-2xl border border-[#C8D9E6] bg-[#F5EFEB] p-4 text-left">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#567C8D]">Personalized recommendation</p>
                    <p className="mt-2 text-sm font-semibold text-[#2F4156]">
                      {mergeRecommendation.recommendation.reason}
                    </p>
                    {mergeRecommendation.recommendation.next_steps?.length ? (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {mergeRecommendation.recommendation.next_steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    ) : null}
                    {mergeRecommendation.recommendation.prerequisite_url ? (
                      <a
                        href={mergeRecommendation.recommendation.prerequisite_url}
                        className="mt-3 inline-flex text-sm font-bold text-[#567C8D] underline"
                      >
                        Open prerequisite chapter
                      </a>
                    ) : null}
                  </div>
                ) : null}
                <Link
                  href="/dashboard#map"
                  className="mt-6 inline-flex rounded-2xl bg-[#567C8D] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#456d7e]"
                >
                  Return to learning journey
                </Link>
              </div>
            ) : (preQuizStarted || !bundle.preQuizSummary) && question ? (
              <div className="relative mt-8 space-y-5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#567C8D]">
                  Question {progress.current} / {progress.total}
                </p>
                <p className="text-lg font-semibold text-[#2F4156] md:text-xl">{question.prompt}</p>

                {question.kind === "fraction" ? (
                  <label className="block max-w-xl">
                    <span className="text-sm font-semibold text-slate-700">Your answer</span>
                    <input
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      disabled={phase === "correct" || phase === "remedial"}
                      className="mt-2 w-full rounded-2xl border-2 border-[#C8D9E6] bg-white px-4 py-3 text-[#2F4156] shadow-inner outline-none transition focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/30"
                      placeholder="e.g. -1/5 or 83/28"
                    />
                  </label>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-4">
                    {question.options.map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={phase === "correct" || phase === "remedial"}
                        onClick={() => setMcqPick(i)}
                        className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition ${
                          mcqPick === i
                            ? "border-[#567C8D] bg-[#567C8D] text-white shadow-md"
                            : "border-[#C8D9E6] bg-white text-[#2F4156] hover:border-[#567C8D]/50"
                        }`}
                      >
                        ({String.fromCharCode(97 + i)}) {opt}
                      </button>
                    ))}
                  </div>
                )}

                {hintsShown > 0 && phase !== "correct" && phase !== "remedial" ? (
                  <div className="rounded-2xl border border-[#567C8D]/35 bg-white/90 p-4 shadow-inner">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#567C8D]">Your hints</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-800 md:text-base">
                      {question.hints.slice(0, hintsShown).map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {phase === "correct" ? (
                  <div className="flex items-center gap-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-950">
                    <span className="text-2xl" aria-hidden>
                      ✓
                    </span>
                    <span className="text-base font-extrabold">Correct answer</span>
                  </div>
                ) : null}

                {phase === "wrong_pick" ? (
                  <div className="rounded-2xl border-2 border-amber-300/80 bg-gradient-to-r from-amber-50 to-white p-4 text-amber-950 shadow-sm">
                    <p className="font-extrabold">Not quite — what would you like to do?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={onChooseHint}
                        disabled={hintsShown >= 3}
                        className="rounded-xl bg-[#567C8D] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#456d7e] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {hintsShown >= 3 ? "All hints used" : `Get hint ${hintsShown + 1}`}
                      </button>
                      <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-xl border-2 border-[#567C8D] bg-white px-4 py-2 text-xs font-extrabold text-[#567C8D] hover:bg-[#F5EFEB]"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : null}

                {phase === "remedial" ? (
                  <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 text-rose-950">
                    <p className="font-extrabold">Let&apos;s revisit the idea</p>
                    <p className="mt-2 whitespace-pre-line leading-relaxed">{question.remedial}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPhase("idle");
                        setHintsShown(0);
                        if (question.kind === "fraction") setTextAnswer("");
                        else setMcqPick(null);
                      }}
                      className="mt-4 rounded-xl bg-[#567C8D] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#456d7e]"
                    >
                      Try this question again
                    </button>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  {phase === "correct" ? (
                    <button
                      type="button"
                      onClick={() => advanceQuiz(true)}
                      className="rounded-2xl bg-[#567C8D] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#456d7e] hover:shadow-xl"
                    >
                      {qIndex < bundle.quiz.length - 1 ? "Next question" : "Finish quiz"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={
                        phase === "remedial" ||
                        (question.kind === "fraction" ? !textAnswer.trim() : mcqPick === null)
                      }
                      className="rounded-2xl bg-[#567C8D] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#456d7e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit answer
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
