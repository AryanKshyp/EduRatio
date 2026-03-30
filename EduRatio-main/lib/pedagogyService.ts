import { getQuestionById } from "@/lib/content";
import {
  classifyResponse,
  detectAffectiveTrigger,
  getZpdDifficulty,
  increaseDifficulty,
  inferMasteryFromHardCorrect,
  isUnlocked,
  nextHintLevel,
  remediationStage,
  reinforcementDifficulty,
  shouldSkipEasy,
  shouldTriggerRemediation,
} from "@/lib/pedagogyEngine";
import type { Difficulty, PedagogyDecision } from "@/lib/types";

export interface PedagogyInput {
  mastery: number;
  current_difficulty: Difficulty;
  question_id: string;
  is_correct: boolean;
  attempt_number: number;
  time_taken_seconds: number;
  failed_remedials: number;
  repeated_wrong_count: number;
  average_time_seconds: number;
  hint_count: number;
}

export function generatePedagogyDecision(input: PedagogyInput): PedagogyDecision {
  const responseCase = classifyResponse({
    isCorrect: input.is_correct,
    timeTakenSeconds: input.time_taken_seconds,
  });

  const zpdDifficulty = getZpdDifficulty(input.mastery);
  const skipEasy = shouldSkipEasy(input.mastery);
  const inferredMastery = inferMasteryFromHardCorrect(
    input.mastery,
    input.current_difficulty,
    input.is_correct,
  );

  let nextDifficulty: Difficulty = zpdDifficulty;
  let actionLabel: PedagogyDecision["action_label"] = "hint_progression";
  if (responseCase === "correct_fast") {
    nextDifficulty = increaseDifficulty(input.current_difficulty);
    actionLabel = "increase_difficulty";
  } else if (responseCase === "correct_slow") {
    nextDifficulty = reinforcementDifficulty(input.current_difficulty);
    actionLabel = "reinforcement";
  }

  const hintLevel = responseCase === "incorrect" ? nextHintLevel(input.attempt_number) : 0;
  const triggerRemediation = shouldTriggerRemediation(input.attempt_number, input.is_correct);
  const remediation = triggerRemediation
    ? remediationStage(inferredMastery, input.failed_remedials)
    : null;

  const question = getQuestionById(input.question_id);
  const hintText = hintLevel > 0 ? (question?.hints[hintLevel - 1] ?? null) : null;

  const affectiveTrigger = detectAffectiveTrigger({
    repeatedWrongCount: input.repeated_wrong_count,
    averageTimeSeconds: input.average_time_seconds,
    hintCount: input.hint_count,
  });

  return {
    response_case: responseCase,
    zpd_difficulty: zpdDifficulty,
    next_difficulty: skipEasy && nextDifficulty === "easy" ? "medium" : nextDifficulty,
    hint_level: hintLevel,
    hint_text: hintText,
    trigger_remediation: triggerRemediation,
    remediation_stage: remediation,
    skip_easy: skipEasy,
    inferred_mastery: inferredMastery,
    mastery_unlocked: isUnlocked(inferredMastery),
    affective_trigger: affectiveTrigger,
    action_label: actionLabel,
  };
}
