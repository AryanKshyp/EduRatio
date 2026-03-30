import type { ChapterBundle } from "@/lib/chapterTypes";
import {
  NUMBER_LINE_BUNDLE,
  PROPERTIES_BUNDLE,
  IDENTITIES_BUNDLE,
  INVERSES_BUNDLE,
  NUMBERS_BETWEEN_BUNDLE,
} from "@/lib/additionalChapterBundles";
import { OPERATIONS_BUNDLE } from "@/lib/operationsChapter";

const REGISTRY: Record<string, ChapterBundle> = {
  operations: OPERATIONS_BUNDLE,
  "number-line": NUMBER_LINE_BUNDLE,
  properties: PROPERTIES_BUNDLE,
  identities: IDENTITIES_BUNDLE,
  inverses: INVERSES_BUNDLE,
  "numbers-between": NUMBERS_BETWEEN_BUNDLE,
};

export function getChapterBundle(id: string): ChapterBundle | undefined {
  return REGISTRY[id];
}
