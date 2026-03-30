import {
  incrementErrorPattern,
  getLearnerModelState,
  insertMasteryScore,
  upsertLearnerModelState,
} from "@/db/repositories";
import { computeMastery, masteryLevel } from "@/lib/learnerModel";
import type { LearnerSignals } from "@/lib/types";

export interface LearnerUpdateInput {
  session_id: string;
  subtopic_id: string;
  question_id: string;
  attempt: number;
  hint_level: 0 | 1 | 2 | 3;
  time_taken_seconds: number;
  remedial_done: 0 | 1 | 2;
  error_tags: string[];
}

export async function updateLearnerStateAndMastery(input: LearnerUpdateInput) {
  const existing = await getLearnerModelState(input.session_id, input.subtopic_id);
  if (existing.error) throw existing.error;

  const prev = existing.data;
  const signals: LearnerSignals = {
    attempts: [...(prev?.attempts ?? []), input.attempt],
    hint_usage: [...(prev?.hint_usage ?? []), input.hint_level],
    error_patterns: [...(prev?.error_patterns ?? []), ...input.error_tags],
    time_on_task: [...(prev?.time_on_task ?? []), input.time_taken_seconds],
    remedial_done: input.remedial_done,
  };

  const computed = computeMastery(signals);
  const level = masteryLevel(computed.mastery);

  const stateUpsert = await upsertLearnerModelState({
    session_id: input.session_id,
    subtopic_id: input.subtopic_id,
    attempts: signals.attempts,
    hint_usage: signals.hint_usage,
    error_patterns: signals.error_patterns,
    time_on_task: signals.time_on_task,
    remedial_done: signals.remedial_done,
    latest_attempt_efficiency: computed.attemptEfficiency,
    latest_independence_score: computed.independenceScore,
    latest_error_component: computed.errorComponent,
    latest_time_engagement: computed.timeEngagement,
    latest_remedial_multiplier: computed.remedialMultiplier,
    latest_raw_score: computed.raw,
    latest_mastery_score: computed.mastery,
  });
  if (stateUpsert.error) throw stateUpsert.error;

  const masteryInsert = await insertMasteryScore({
    session_id: input.session_id,
    subtopic_id: input.subtopic_id,
    attempt_efficiency: computed.attemptEfficiency,
    independence_score: computed.independenceScore,
    error_component: computed.errorComponent,
    time_engagement: computed.timeEngagement,
    remedial_multiplier: computed.remedialMultiplier,
    raw_score: computed.raw,
    mastery_score: computed.mastery,
    mastery_level: level,
  });
  if (masteryInsert.error) throw masteryInsert.error;

  for (const errorTag of input.error_tags) {
    const patternUpsert = await incrementErrorPattern({
      session_id: input.session_id,
      subtopic_id: input.subtopic_id,
      question_id: input.question_id,
      error_tag: errorTag,
    });
    if (patternUpsert.error) throw patternUpsert.error;
  }

  return {
    signals,
    components: computed,
    mastery_level: level,
  };
}
