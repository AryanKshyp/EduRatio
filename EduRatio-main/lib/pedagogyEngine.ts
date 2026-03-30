import { masteryLevel } from "@/lib/learnerModel";
import type { Difficulty, PedagogyResponseCase } from "@/lib/types";

export function getZpdDifficulty(mastery: number): Difficulty {
  if (mastery < 0.4) return "easy";
  if (mastery < 0.65) return "medium";
  return "hard";
}

export function classifyResponse(params: {
  isCorrect: boolean;
  timeTakenSeconds: number;
  fastThresholdSeconds?: number;
}): PedagogyResponseCase {
  const fastThreshold = params.fastThresholdSeconds ?? 45;
  if (!params.isCorrect) return "incorrect";
  if (params.timeTakenSeconds <= fastThreshold) return "correct_fast";
  return "correct_slow";
}

export function nextHintLevel(attempt: number): 1 | 2 | 3 {
  if (attempt <= 1) return 1;
  if (attempt === 2) return 2;
  return 3;
}

export function shouldTriggerRemediation(attempt: number, isCorrect: boolean): boolean {
  return !isCorrect && attempt >= 3;
}

export function remediationStage(mastery: number, failedRemedials: number): "L1" | "L2" | "escalation" {
  if (failedRemedials >= 2) return "escalation";
  const level = masteryLevel(mastery);
  if (level === "L1" || failedRemedials === 0) return "L1";
  return "L2";
}

export function shouldSkipEasy(mastery: number): boolean {
  return mastery >= 0.65;
}

export function inferMasteryFromHardCorrect(
  currentMastery: number,
  difficulty: Difficulty,
  isCorrect: boolean,
): number {
  if (difficulty !== "hard" || !isCorrect) return currentMastery;
  return Math.max(currentMastery, 0.8);
}

export function isUnlocked(mastery: number): boolean {
  return mastery >= 0.8;
}

export function detectAffectiveTrigger(params: {
  repeatedWrongCount: number;
  averageTimeSeconds: number;
  hintCount: number;
}): boolean {
  return params.repeatedWrongCount >= 2 || params.averageTimeSeconds > 120 || params.hintCount >= 3;
}

export function increaseDifficulty(difficulty: Difficulty): Difficulty {
  if (difficulty === "easy") return "medium";
  if (difficulty === "medium") return "hard";
  return "hard";
}

export function reinforcementDifficulty(difficulty: Difficulty): Difficulty {
  return difficulty;
}
