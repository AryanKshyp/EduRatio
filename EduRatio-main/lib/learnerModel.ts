import type { LearnerSignals, MasteryComponents } from "@/lib/types";

function mapAttemptToScore(attempt: number): number {
  if (attempt <= 1) return 1.0;
  if (attempt === 2) return 0.6;
  if (attempt === 3) return 0.2;
  return 0;
}

function mapHintToIndependenceScore(hintLevel: number): number {
  if (hintLevel <= 0) return 1.0;
  if (hintLevel === 1) return 0.7;
  if (hintLevel === 2) return 0.4;
  return 0.1;
}

function mapAvgTimeToEngagement(avgTimeSeconds: number): number {
  if (avgTimeSeconds < 30 || avgTimeSeconds > 180) return 0.4;
  if (avgTimeSeconds > 90) return 0.7;
  return 1.0;
}

function remedialMultiplier(remedialDone: 0 | 1 | 2): number {
  if (remedialDone === 2) return 0.8;
  if (remedialDone === 1) return 0.9;
  return 1.0;
}

function safeAverage(values: number[], fallback = 1): number {
  if (values.length === 0) return fallback;
  return values.reduce((sum, item) => sum + item, 0) / values.length;
}

export function computeMastery(signals: LearnerSignals): MasteryComponents {
  const attemptEfficiency = safeAverage(signals.attempts.map(mapAttemptToScore));
  const independenceScore = safeAverage(signals.hint_usage.map(mapHintToIndependenceScore));
  const penalty = Math.min(0.15, signals.error_patterns.length * 0.05);
  const errorComponent = 1 - penalty;
  const averageTime = safeAverage(signals.time_on_task, 60);
  const timeEngagement = mapAvgTimeToEngagement(averageTime);
  const multiplier = remedialMultiplier(signals.remedial_done);

  const raw =
    0.3 * attemptEfficiency +
    0.35 * independenceScore +
    0.2 * errorComponent +
    0.15 * timeEngagement;

  const mastery = Math.max(0, Math.min(1, raw * multiplier));

  return {
    attemptEfficiency,
    independenceScore,
    errorComponent,
    timeEngagement,
    remedialMultiplier: multiplier,
    raw,
    mastery,
  };
}

export function masteryLevel(mastery: number): "L1" | "L2" | "L3" | "L4" | "L5" {
  if (mastery < 0.4) return "L1";
  if (mastery < 0.6) return "L2";
  if (mastery < 0.8) return "L3";
  if (mastery < 0.95) return "L4";
  return "L5";
}

export function computeOverallProgress(masteries: number[]): number {
  if (masteries.length === 0) return 0;
  const sum = masteries.reduce((acc, value) => acc + value, 0);
  return sum / 6;
}
