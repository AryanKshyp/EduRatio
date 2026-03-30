/**
 * ET605 — Chapter 1: Arithmetic Operations on Rational Numbers
 * Source content: `Arithmetic Ops.pdf`
 */

import type { ChapterLesson, ChapterQuizItem, ChapterBundle } from "@/lib/chapterTypes";

export const OPERATIONS_HERO = {
  title: "Arithmetic Operations",
  chapterLabel: "Chapter 1 · Arithmetic Operations",
} as const;

/** Domain (PDF) */
export const DOMAIN_INTRO = {
  heading: "Introduction to Rational Numbers",
  definition:
    "A rational number is any number that can be written in the form p/q, where p and q are integers and q != 0 (the denominator cannot be zero).",
  bridge:
    "Arithmetic operations on rational numbers follow the same rules as fractions, with careful attention to signs.",
  objectives: [
    "Identify and define rational numbers (p/q form).",
    "Represent rational numbers (positive, negative, and zero).",
    "Perform addition, subtraction, multiplication, and division of rational numbers.",
    "Solve word problems using these operations.",
  ],
  prerequisite: "",
} as const;

/** @deprecated use ChapterLesson from @/lib/chapterTypes */
export type OperationsLesson = ChapterLesson;

export const OPERATIONS_LESSONS: ChapterLesson[] = [
  {
    id: "quick-fact-check",
    accent: "teal",
    sectionKey: "1 Quick Fact Check",
    teachTitle: "Is it a Rational Number?",
    teachBlocks: [
      "A rational number can be written as p/q where p and q are integers and q != 0.",
      "So fractions, integers, whole numbers, and zero are all rational.",
    ],
    flash: {
      label: "Quick Fact Check — examples",
      problem: "Classify each type as Rational or not (q != 0).",
      tableHeader: { step: "Type of number", working: "Is it rational? Example" },
      rows: [
        { step: "Positive fraction", working: "Yes · 3/5" },
        { step: "Negative fraction", working: "Yes · -7/4" },
        { step: "Zero", working: "Yes · 0 = 0/1" },
        { step: "Whole number", working: "Yes · 8 = 8/1" },
        { step: "Integer", working: "Yes · -3 = -3/1" },
      ],
      answerLine: "Key idea: any p/q with q != 0 is rational.",
    },
  },
  {
    id: "addition-same-denom",
    accent: "teal",
    sectionKey: "2.1 Addition",
    teachTitle: "Addition (Same Denominator)",
    teachBlocks: [
      "Same denominator: a/q + b/q = (a + b)/q.",
      "Add the numerators carefully, including the sign. Keep the denominator the same.",
    ],
    flash: {
      label: "Solved Example — Same Denominator",
      problem: "Find: (-3/5) + (2/5)",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Both fractions have the same denominator (5)." },
        { step: "Step 2", working: "Add the numerators: -3 + 2 = -1." },
        { step: "Step 3", working: "Keep the denominator: -1/5." },
      ],
      answerLine: "Answer: -1/5 (still negative).",
    },
  },
  {
    id: "addition-different-denom",
    accent: "teal",
    sectionKey: "2.1 Addition",
    teachTitle: "Addition (Different Denominators)",
    teachBlocks: [
      "Different denominators: find the LCM of denominators, convert to that common denominator, then add numerators.",
      "LCM makes the fractions comparable so you can add safely.",
    ],
    flash: {
      label: "Solved Example — Different Denominators",
      problem: "Find: (-3/4) + (1/6)",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "LCM of 4 and 6 = 12." },
        { step: "Step 2", working: "Convert: -3/4 = -9/12 and 1/6 = 2/12." },
        { step: "Step 3", working: "Add numerators: -9 + 2 = -7." },
      ],
      answerLine: "Answer: -7/12.",
    },
  },
  {
    id: "subtraction-same-denom",
    accent: "coral",
    sectionKey: "2.2 Subtraction",
    teachTitle: "Subtraction (Add the Opposite)",
    teachBlocks: [
      "Subtraction of rational numbers is done by adding the additive inverse (opposite):",
    ],
    formulaLines: ["a/q - b/q = a/q + (-b/q) = (a - b)/q"],
    flash: {
      label: "Solved Example — Subtraction",
      problem: "Find: 7/3 - (-4/3)",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Rewrite as addition: 7/3 + 4/3." },
        { step: "Step 2", working: "Same denominator — add numerators: 7 + 4 = 11." },
        { step: "Step 3", working: "Denominator stays 3: 11/3." },
      ],
      answerLine: "Answer: 11/3 (or 3 and 2/3 as a mixed number).",
    },
  },
  {
    id: "subtraction-different-denom",
    accent: "coral",
    sectionKey: "2.2 Subtraction",
    teachTitle: "Subtraction (Different Denominators)",
    teachBlocks: [
      "Subtraction also needs a common denominator.",
      "LCM -> convert -> subtract numerators.",
    ],
    flash: {
      label: "Solved Example — Different Denominators",
      problem: "Find: (5/6) - (3/4)",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "LCM of 6 and 4 = 12." },
        { step: "Step 2", working: "Convert: 5/6 = 10/12 and 3/4 = 9/12." },
        { step: "Step 3", working: "Subtract numerators: 10 - 9 = 1." },
      ],
      answerLine: "Answer: 1/12.",
    },
  },
  {
    id: "multiplication",
    accent: "violet",
    sectionKey: "2.3 Multiplication",
    teachTitle: "Multiplying Rational Numbers",
    teachBlocks: [
      "To multiply two rational numbers: multiply numerators together and denominators together, then simplify.",
      "Sign rules for multiplication:",
    ],
    signRules: [
      { combo: "(+) x (+)", result: "Positive (+)" },
      { combo: "(-) x (-)", result: "Positive (+)" },
      { combo: "(+) x (-)", result: "Negative (-)" },
      { combo: "(-) x (+)", result: "Negative (-)" },
    ],
    flash: {
      label: "Solved Example — Multiplication",
      problem: "Find: (-4/5) x (-5/12)",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Multiply numerators: (-4) x (-5) = 20." },
        { step: "Step 2", working: "Multiply denominators: 5 x 12 = 60." },
        { step: "Step 3", working: "Form fraction: 20/60." },
        { step: "Step 4", working: "Simplify (HCF = 20): 20/60 = 1/3." },
      ],
      answerLine: "Answer: 1/3 (negative x negative = positive).",
    },
  },
  {
    id: "division",
    accent: "sun",
    sectionKey: "2.4 Division",
    teachTitle: "Dividing Rational Numbers",
    teachBlocks: [
      "To divide: flip the second fraction (reciprocal), then multiply.",
      "p/q ÷ r/s = p/q x s/r = (p*s)/(q*r).",
    ],
    warning: "Warning: Division by zero is not defined (zero has no reciprocal).",
    flash: {
      label: "Solved Example — Division",
      problem: "Find: (-7/8) ÷ (7/16)",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Flip the second fraction: 7/16 -> 16/7." },
        { step: "Step 2", working: "Multiply: (-7/8) x (16/7)." },
        { step: "Step 3", working: "Numerator: -7 x 16 = -112; Denominator: 8 x 7 = 56." },
        { step: "Step 4", working: "Simplify: -112/56 = -2." },
      ],
      answerLine: "Answer: -2 (negative ÷ positive = negative).",
    },
  },
];

/** @deprecated use OPERATIONS_LESSONS[].flash */
export const OPERATIONS_SOLVED = OPERATIONS_LESSONS.map((L) => ({
  id: L.id,
  title: L.flash.label,
  problem: L.flash.problem,
  steps: L.flash.rows.map((r) => `${r.step}: ${r.working}`).concat([L.flash.answerLine]),
}));

/** @deprecated use ChapterQuizItem from @/lib/chapterTypes */
export type OperationsQuizItem = ChapterQuizItem;

export const OPERATIONS_QUIZ: ChapterQuizItem[] = [
  {
    id: "q1",
    kind: "fraction",
    prompt: "Find: (-2/3) + (1/3)",
    accepted: ["-1/3"],
    hints: [
      "Both fractions have the same denominator. What do you do with the numerators?",
      "Add the numerators only while the denominator stays as it is. What is -2 + 1?",
      "You have the numerator now. Write it over the denominator and check if the fraction can be simplified further.",
    ],
    remedial:
      "Understanding the concept\nWhen two fractions have the same denominator, only the numerators are added. The denominator stays exactly as it is.\nThink of it like pizza slices, if each slice is 1/3 of a pizza, taking away 2 slices and getting 1 back still gives you slices of the same size (thirds).\nWorked Example: (-4/7) + (2/7)\n1. Same denominator? Yes — both are /7. Keep 7 as denominator.\n2. Add numerators: -4 + 2 = -2.\n3. Write result: -2/7.\n4. Simplify check: already simplest.\nKey Rule: Same denominator -> add numerators only, keep denominator unchanged.",
  },
  {
    id: "q2",
    kind: "fraction",
    prompt: "Find: (3/5) + (-7/5)",
    accepted: ["-4/5"],
    hints: [
      "The denominators are the same. Focus only on the numerators. What does adding a negative number actually mean?",
      "3 + (-7) is the same as 3 - 7. Work that out and place it over the denominator.",
      "You have your numerator and denominator. Is the result positive or negative? Can the fraction be reduced?",
    ],
    remedial:
      "Understanding the concept\nAdding a negative number is exactly the same as subtracting. So 3 + (-7) is really 3 - 7.\nWith same denominators, keep denominator and work only with numerators.\nWorked Example: (5/9) + (-8/9)\n1. Same denominator -> keep 9.\n2. Add numerators: 5 + (-8) = -3.\n3. Write result: -3/9.\n4. Simplify: -1/3.\nKey Rule: a + (-b) = a - b.",
  },
  {
    id: "q3",
    kind: "fraction",
    prompt: "Find: (-3/4) + (1/6)",
    accepted: ["-7/12"],
    hints: [
      "The denominators are different, so you cannot add yet. What is the LCM of 4 and 6?",
      "LCM = 12. Convert each fraction to have denominator 12 by multiplying top and bottom by the right number. What do you get for each?",
      "Now add the two numerators and keep the denominator as 12. Check if the result can be simplified.",
    ],
    remedial:
      "Understanding the concept\nFractions can only be added when they share the same denominator. Use LCM to create a common denominator.\nThen convert both fractions and add only numerators.\nWorked Example: (-1/3) + (1/4)\n1. LCM(3,4) = 12.\n2. Convert: -1/3 = -4/12, 1/4 = 3/12.\n3. Add numerators: -4 + 3 = -1.\n4. Result: -1/12.\nKey Rule: Different denominators -> LCM -> convert -> add numerators.",
  },
  {
    id: "q4",
    kind: "fraction",
    prompt: "Find: (5/6) - (3/4)",
    accepted: ["1/12"],
    hints: [
      "Rewrite the subtraction as adding the opposite. What is the LCM of 6 and 4?",
      "LCM = 12. Convert 5/6 and 3/4 to equivalent fractions with denominator 12. What are the new numerators?",
      "Subtract the numerators now that the denominators match.",
    ],
    remedial:
      "Understanding the concept\nSubtraction of fractions works like addition after converting to adding the opposite.\nYou still need a common denominator.\nWorked Example: (7/8) - (1/6)\n1. Rewrite: 7/8 + (-1/6).\n2. LCM(8,6)=24.\n3. Convert: 7/8=21/24, -1/6=-4/24.\n4. Add numerators: 21 + (-4) = 17.\n5. Result: 17/24.\nKey Rule: Subtraction = adding opposite, then apply LCM process.",
  },
  {
    id: "q5",
    kind: "fraction",
    prompt: "Find: (-3/5) x (-10/9)",
    accepted: ["2/3"],
    hints: [
      "Multiply the numerators together and the denominators together. Before you calculate, what sign will the result have when you multiply two negatives?",
      "Work out (-3) x (-10) and 5 x 9 separately. You now have an unsimplified fraction, what is the HCF of those two numbers?",
      "Divide both the numerator and denominator by the HCF to get the simplest form. Double-check your sign.",
    ],
    remedial:
      "Understanding the concept\nMultiply numerators together and denominators together. Apply sign rules first.\nSame signs give positive result; different signs give negative.\nWorked Example: (-4/5) x (-15/8)\n1. Sign: negative x negative = positive.\n2. Numerator: 4 x 15 = 60.\n3. Denominator: 5 x 8 = 40.\n4. Fraction: 60/40.\n5. Simplify: 3/2.\nKey Rule: Multiply tops and bottoms, then simplify using HCF.",
  },
  {
    id: "q6",
    kind: "fraction",
    prompt: "Find: (-7/8) ÷ (7/16)",
    accepted: ["-2/1"],
    hints: [
      "Division means multiply by the reciprocal. What is the reciprocal of 7/16?",
      "Rewrite the problem as a multiplication using the flipped fraction. What sign will the answer have if negative divided by positive?",
      "Multiply the numerators and denominators. You will get a fraction that simplifies cleanly then find the HCF and reduce it.",
    ],
    remedial:
      "Understanding the concept\nDivision of fractions follows KEEP-CHANGE-FLIP.\nKeep first fraction, change division to multiplication, flip second fraction.\nWorked Example: (-5/6) ÷ (5/12)\n1. KEEP: -5/6.\n2. CHANGE: ÷ to x.\n3. FLIP: 5/12 -> 12/5.\n4. Multiply: (-5/6) x (12/5).\n5. Simplify to final value.\nKey Rule: KEEP -> CHANGE -> FLIP, then multiply and simplify.",
  },
  {
    id: "q7",
    kind: "fraction",
    prompt: "A diver descends at -3/4 m per second. What is the diver's depth after 8 seconds?",
    accepted: ["-6/1"],
    hints: [
      "What formula connects rate, time, and distance? Set it up using the numbers given.",
      "Write 8 as a fraction (8/1) and multiply it by -3/4. Work out the numerator and denominator separately.",
      "Simplify your fraction. Think about what the negative sign tells you in the context of depth, is the diver above or below the surface?",
    ],
    remedial:
      "Understanding the concept\nUse Distance = Rate x Time. Write whole numbers as fraction over 1.\nA negative result represents below the reference level (here, below surface).\nWorked Example: rate = -2/3 m/s, time = 9 s\n1. Set up: (-2/3) x (9/1).\n2. Multiply: -18/3.\n3. Simplify: -6.\n4. Interpretation: 6 m below surface.\nKey Rule: Whole numbers can be written as /1 before multiplying.",
  },
];

/** Legacy intro export for backwards compatibility */
export const OPERATIONS_INTRO = {
  title: "Arithmetic Operations",
  subtitle: OPERATIONS_HERO.chapterLabel,
  lead: DOMAIN_INTRO.definition + " " + DOMAIN_INTRO.bridge,
  bullets: DOMAIN_INTRO.objectives,
} as const;

export const OPERATIONS_BUNDLE: ChapterBundle = {
  id: "operations",
  hero: { title: OPERATIONS_HERO.title, chapterLabel: OPERATIONS_HERO.chapterLabel },
  domainIntro: DOMAIN_INTRO,
  lessons: OPERATIONS_LESSONS,
  quiz: OPERATIONS_QUIZ,
  preQuizSummary: {
    heading: "SUMMARY",
    lines: [
      "A rational number is any number of the form p/q where q != 0. This includes fractions, integers, whole numbers, and zero.",
      "Adding/Subtracting: make the denominators the same using LCM, then work with the numerators only. Subtraction is just adding the negative.",
      "Multiplying: tops x tops, bottoms x bottoms, then simplify. Same signs give a positive result, different signs give a negative.",
      "Dividing: flip the second fraction and multiply. Same rules apply.",
    ],
  },
};
