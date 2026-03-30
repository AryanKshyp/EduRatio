/**
 * Chapters 2–6 — NCERT Class 8 Rational Numbers (representation, structure, and density).
 * Lesson order and ideas aligned with standard rational-number progression after arithmetic.
 */

import type { ChapterBundle, ChapterLesson, ChapterQuizItem } from "@/lib/chapterTypes";

const nlLessons: ChapterLesson[] = [
  {
    id: "plot-basic",
    accent: "teal",
    sectionKey: "3.1",
    teachTitle: "Rationals on the number line",
    teachBlocks: [
      "Every rational p/q corresponds to a point on the line: divide the unit segment into |q| equal parts from 0, then step |p| parts from 0 according to the sign.",
      "Same number can use different labels (e.g. 1/2 = 2/4) but marks the same point — equivalent fractions share one position.",
    ],
    flash: {
      label: "Worked example — Plot −3/4",
      problem: "Mark −3/4 on a number line from −1 to 1.",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Split [0,1]", working: "Divide the segment from 0 to 1 into 4 equal parts." },
        { step: "Count left from 0", working: "Move 3 fourths to the left of 0." },
        { step: "Point", working: "You land on −3/4, three-fourths of a unit below zero." },
      ],
      answerLine: "Answer: The point is left of 0 at distance 3/4 from the origin.",
    },
  },
  {
    id: "compare-line",
    accent: "coral",
    sectionKey: "3.2",
    teachTitle: "Comparing using the line",
    teachBlocks: [
      "On a horizontal number line with positives to the right, the number farther right is greater.",
      "To compare a/b and c/d, you can plot both, or rewrite both with a common denominator and compare numerators.",
    ],
    flash: {
      label: "Worked example — Which is greater?",
      problem: "Compare −2/3 and −5/6 using a common denominator.",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "LCM of denominators", working: "LCM(3, 6) = 6." },
        { step: "Rewrite", working: "−2/3 = −4/6 and −5/6 stays −5/6." },
        { step: "Compare", working: "On the line, −4/6 is to the right of −5/6." },
      ],
      answerLine: "Answer: −2/3 > −5/6 (less negative is greater).",
    },
  },
  {
    id: "midpoint",
    accent: "violet",
    sectionKey: "3.3",
    teachTitle: "Between two rationals (preview)",
    teachBlocks: [
      "If two rationals are different, you can always find another rational strictly between them (a fuller toolkit comes in the Numbers Between chapter).",
      "One simple construction: average the two numbers: (a + b)/2 lies between a and b when a ≠ b.",
    ],
    flash: {
      label: "Worked example — A number between",
      problem: "Find one rational strictly between 1/4 and 1/2.",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Average", working: "(1/4 + 1/2) / 2 = (1/4 + 2/4) / 2" },
        { step: "Add inside", working: "(3/4) / 2 = 3/8" },
      ],
      answerLine: "Answer: 3/8 lies strictly between 1/4 (2/8) and 1/2 (4/8).",
    },
  },
  {
    id: "distance",
    accent: "sun",
    sectionKey: "3.4",
    teachTitle: "Distance and segments",
    teachBlocks: [
      "The distance between points x and y on the line is |x − y| — same idea as integers, with rationals allowed.",
      "Use subtraction, then take absolute value so distance is never negative.",
    ],
    flash: {
      label: "Worked example — Distance",
      problem: "Distance between −1/5 and 3/5 on the number line?",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Subtract", working: "3/5 − (−1/5) = 4/5" },
        { step: "Already positive", working: "|4/5| = 4/5" },
      ],
      answerLine: "Answer: The segment length is 4/5 of a unit.",
    },
  },
];

const nlQuiz: ChapterQuizItem[] = [
  {
    id: "nl-q1",
    kind: "mcq",
    prompt: "Which is smaller: (-2/3) or (-1/3)?",
    options: ["-2/3", "-1/3", "Both equal", "Cannot compare"],
    correctIndex: 0,
    hints: [
      "Draw a rough number line with 0 in the middle. Where would each fraction sit, left or right of 0?",
      "Both are negative, so both are to the left of 0. -2/3 is 2 steps left and -1/3 is 1 step left (in thirds). Which is further from 0?",
      "Remember on the number line, further left always means a smaller value. Apply that rule to decide which fraction is smaller.",
    ],
    remedial:
      "Understanding the concept\nOn the number line, any number to the left is always smaller than a number to the right.\nWith negative fractions, moving further left means the value is smaller.\nWorked Example: Which is smaller: -3/5 or -1/5?\n1. Both are negative, both lie left of 0.\n2. -3/5 is further left than -1/5.\n3. Therefore -3/5 is smaller.\nKey Rule: For negatives, further left means smaller.",
  },
  {
    id: "nl-q2",
    kind: "mcq",
    prompt: "Between which two consecutive integers does 3/4 lie?",
    options: ["0 and 1", "1 and 2", "-1 and 0", "3 and 4"],
    correctIndex: 0,
    hints: [
      "Convert 3/4 into a decimal by dividing the numerator by the denominator. What do you get?",
      "Your decimal is between 0 and 1. Can you confirm it is greater than 0 and less than 1?",
      "Now match that decimal to the correct pair of consecutive integers from the options. Which pair does your decimal fall between?",
    ],
    remedial:
      "Understanding the concept\nTo find where a fraction lies on a number line, convert it to decimal.\nThen identify the two consecutive integers it falls between.\nWorked Example: 5/8\n1. Convert: 5 ÷ 8 = 0.625.\n2. 0.625 is greater than 0 and less than 1.\n3. So 5/8 lies between 0 and 1.\nKey Rule: Convert to decimal first for quick location.",
  },
  {
    id: "nl-q3",
    kind: "mcq",
    prompt: "Arrange in ascending order (smallest to largest): -1/2, 1/3, -2/3, 0",
    options: [
      "-2/3, -1/2, 0, 1/3",
      "-1/2, -2/3, 0, 1/3",
      "0, -2/3, -1/2, 1/3",
      "-2/3, 0, -1/2, 1/3",
    ],
    correctIndex: 0,
    hints: [
      "Convert each fraction to have a common denominator. What is the LCM of 2, 3, and 3?",
      "Using denominator 6, rewrite each number as sixths. You now have four numerators — which is the smallest numerator?",
      "Order the numerators from smallest to largest. Remember the most negative numerator represents the smallest number overall.",
    ],
    remedial:
      "Understanding the concept\nTo compare fractions accurately, rewrite them with a common denominator.\nThen compare numerators and order from smallest to largest.\nWorked Example: -1/4, 1/2, -3/4, 0\n1. Common denominator 4.\n2. Values: -1/4, 2/4, -3/4, 0/4.\n3. Order numerators: -3, -1, 0, 2.\n4. Ascending: -3/4 < -1/4 < 0 < 1/2.\nKey Rule: LCM/common denominator makes ordering easier.",
  },
  {
    id: "nl-q5",
    kind: "fraction",
    prompt: "What rational number is exactly halfway between (-3/4) and (1/4)?",
    accepted: ["-1/4"],
    hints: [
      "What formula gives you the exact middle point between two numbers on the number line?",
      "Add the two fractions together first, they have the same denominator, so this is straightforward. What do you get?",
      "You now have the sum. Divide it by 2 to find the midpoint. Writing ÷ 2 as × 1/2 might make it easier.",
    ],
    remedial:
      "Understanding the concept\nThe midpoint between two numbers is their average: (a + b) ÷ 2.\nThis works for positive and negative rationals.\nWorked Example: midpoint between -1/2 and 3/2\n1. Add: -1/2 + 3/2 = 1.\n2. Divide by 2: 1 ÷ 2 = 1/2.\n3. So midpoint is 1/2.\nKey Rule: Midpoint = sum ÷ 2.",
  },
];

const propLessons: ChapterLesson[] = [
  {
    id: "comm-add",
    accent: "teal",
    sectionKey: "4.1",
    teachTitle: "Commutativity (addition)",
    teachBlocks: ["For any rationals a and b: a + b = b + a.", "Order of summands does not change the sum — same as with integers and fractions."],
    flash: {
      label: "Example — Swap addends",
      problem: "Show −2/7 + 5/7 equals 5/7 + (−2/7).",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "First sum", working: "−2/7 + 5/7 = 3/7" },
        { step: "Second sum", working: "5/7 + (−2/7) = 3/7" },
      ],
      answerLine: "Answer: Both equal 3/7 — addition is commutative.",
    },
  },
  {
    id: "assoc-add",
    accent: "coral",
    sectionKey: "4.2",
    teachTitle: "Associativity (addition)",
    teachBlocks: ["(a + b) + c = a + (b + c) for rationals a, b, c.", "Parentheses only group steps; the final total is unchanged."],
    flash: {
      label: "Example — Regroup",
      problem: "Verify (1/2 + 1/3) + 1/6 = 1/2 + (1/3 + 1/6).",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Left grouping", working: "1/2 + 1/3 = 5/6; then 5/6 + 1/6 = 1" },
        { step: "Right grouping", working: "1/3 + 1/6 = 1/2; then 1/2 + 1/2 = 1" },
      ],
      answerLine: "Answer: Both groupings yield 1.",
    },
  },
  {
    id: "comm-mult",
    accent: "violet",
    sectionKey: "4.3",
    teachTitle: "Commutativity & associativity (multiplication)",
    teachBlocks: ["a × b = b × a and (a × b) × c = a × (b × c) for rationals (where defined).", "Lets you reorder and regroup products for cleaner arithmetic."],
    flash: {
      label: "Example — Product order",
      problem: "Compute (−3/4) × (8/9) and (8/9) × (−3/4).",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "First product", working: "−24/36 = −2/3 after simplifying" },
        { step: "Second product", working: "Same factors swapped → same value −2/3" },
      ],
      answerLine: "Answer: Both equal −2/3.",
    },
  },
  {
    id: "distribute",
    accent: "sun",
    sectionKey: "4.4",
    teachTitle: "Distributivity",
    teachBlocks: ["a × (b + c) = a × b + a × c for rationals.", "Multiplication distributes over addition — essential for expanding and collecting terms."],
    flash: {
      label: "Example — Expand",
      problem: "Expand: 1/2 × (4/5 + 6/5).",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Add inside first", working: "4/5 + 6/5 = 10/5 = 2" },
        { step: "Multiply", working: "1/2 × 2 = 1" },
        { step: "Check distribute", working: "1/2×4/5 + 1/2×6/5 = 2/5 + 3/5 = 1" },
      ],
      answerLine: "Answer: Both routes give 1 — distributivity holds.",
    },
  },
];

const propQuiz: ChapterQuizItem[] = [
  {
    id: "pr-q1",
    kind: "mcq",
    prompt: "Which property does this show? 1/3 + 2/5 = 2/5 + 1/3",
    options: ["Associativity", "Commutativity", "Distributivity", "Closure"],
    correctIndex: 1,
    hints: [
      "Look carefully at what changed between the left side and the right side. Did the numbers change, or did something else change?",
      "The two numbers swapped positions. Think about which property deals specifically with the order of numbers; commutativity or associativity?",
      "Commutativity is about order, associativity is about brackets. No brackets are involved here so apply that distinction to pick the right property.",
    ],
    remedial:
      "Understanding the concept\nCommutative property says changing order does not change result (for + and x).\nWorked Example: 3/7 x 2/5 = 2/5 x 3/7\n1. The two factors are swapped.\n2. No brackets changed.\n3. Product stays same.\nKey Rule: Order swap -> commutativity.",
  },
  {
    id: "pr-q2",
    kind: "mcq",
    prompt: "Which property does this show? (2/3 + 1/4) + 1/6 = 2/3 + (1/4 + 1/6)",
    options: ["Commutativity", "Distributivity", "Associativity", "Closure"],
    correctIndex: 2,
    hints: [
      "Check the order of the numbers on both sides; did they stay the same or change?",
      "The numbers are in the same order on both sides. What did change? Look closely at where the brackets are placed.",
      "Now decide, is this about the order of numbers or about which numbers are grouped together? Use that to name the correct property.",
    ],
    remedial:
      "Understanding the concept\nAssociative property says regrouping terms does not change result.\nOrder stays same; only brackets move.\nWorked Example: (1/2 x 1/3) x 1/5 and 1/2 x (1/3 x 1/5)\n1. Same factors, same order.\n2. Grouping changes.\n3. Result remains same.\nKey Rule: Brackets shift with same order -> associativity.",
  },
  {
    id: "pr-q3",
    kind: "mcq",
    prompt:
      "Rahul says (3/4 - 1/2) gives the same result as (1/2 - 3/4). Without fully calculating, which property would need to be true for Rahul to be correct, and is it actually true for subtraction?",
    options: [
      "Closure, and yes, it holds",
      "Commutativity, and yes, it holds",
      "Commutativity, and no, it does not hold",
      "Associativity and no it does not hold",
    ],
    correctIndex: 2,
    hints: [
      "Rahul is claiming that swapping the order of two numbers in a subtraction does not change the result. Which property makes exactly that claim — commutativity, associativity, or closure?",
      "Now think about whether that property actually holds for subtraction. Try a simple whole number example does 5 - 3 give the same result as 3 - 5? What does that tell you?",
      "You have identified the property and tested whether it holds. Now apply both conclusions together, is Rahul naming the right property, and is his overall claim correct or incorrect?",
    ],
    remedial:
      "Understanding the concept\nRahul is using commutativity (order swap gives same result).\nBut subtraction is not commutative.\nWorked Example: 5/6 - 1/3 vs 1/3 - 5/6\n1. 5/6 - 1/3 = 1/2.\n2. 1/3 - 5/6 = -1/2.\n3. Not equal.\nKey Rule: Subtraction and division are not commutative.",
  },
  {
    id: "pr-q4",
    kind: "fraction",
    prompt: "Use the distributive property to find: (2/5) x (3/4 - 1/4)",
    accepted: ["1/5"],
    hints: [
      "Look inside the bracket first — can you simplify 3/4 - 1/4 before multiplying?",
      "You should have a simple fraction after simplifying the bracket. Now set up the multiplication with 2/5.",
      "Multiply the numerators and denominators. Check if your resulting fraction simplifies further using HCF.",
    ],
    remedial:
      "Understanding the concept\nDistributive property allows two correct methods.\nMethod 1: simplify bracket first, then multiply.\nMethod 2: distribute, then add/subtract.\nWorked Example: (3/7) x (5/6 - 2/6)\n1. Inside bracket: 3/6 = 1/2.\n2. Multiply: (3/7) x (1/2) = 3/14.\n3. Distribution check gives same answer.\nKey Rule: both methods should match.",
  },
  {
    id: "pr-q5",
    kind: "fraction",
    prompt: "Simplify without computing each product separately: (7/5) x (3/11) + (7/5) x (8/11)",
    accepted: ["7/5"],
    hints: [
      "Before calculating anything, look at both terms. What number appears in both of them?",
      "There is a common factor in both terms. Think about how the distributive property can be used in reverse; can you write this as one single multiplication?",
      "Once you have factored out the common term, look at what remains inside the bracket. Add those two fractions and see what you get before multiplying.",
    ],
    remedial:
      "Understanding the concept\nReverse distributive property: a x b + a x c = a x (b + c).\nIf a common factor appears in both terms, factor it out first.\nWorked Example: (3/8) x (4/9) + (3/8) x (5/9)\n1. Common factor = 3/8.\n2. Rewrite: (3/8) x (4/9 + 5/9).\n3. Inside bracket = 1.\n4. Result = 3/8.\nKey Rule: factor common term to simplify quickly.",
  },
];

const idLessons: ChapterLesson[] = [
  {
    id: "identity-meaning",
    accent: "teal",
    sectionKey: "5.1",
    teachTitle: "Identities",
    teachBlocks: [
      "An identity is a special number that, when combined with any rational number under a given operation, leaves that rational number unchanged.",
      "Additive Identity: p/q + 0 = p/q.",
      "Multiplicative Identity: p/q x 1 = p/q.",
    ],
    flash: {
      label: "Identity Table",
      problem: "Identity | Rule | Special Number | Example",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Additive Identity", working: "p/q + 0 = p/q | 0 (zero) | 3/5 + 0 = 3/5" },
        { step: "Multiplicative Identity", working: "p/q x 1 = p/q | 1 (one) | 7/8 x 1 = 7/8" },
      ],
      answerLine: "Additive Identity = 0. Multiplicative Identity = 1.",
    },
  },
  {
    id: "identity-importance",
    accent: "coral",
    sectionKey: "5.2",
    teachTitle: "Why Do Identities Matter?",
    teachBlocks: [
      "0 and 1 are neutral, they do not change any value.",
      "They help us simplify expressions. If you see a + 0 or a x 1, you can simplify immediately.",
      "They are used to prove other properties like inverse relationships.",
    ],
    flash: {
      label: "Rule Recall",
      problem: "Additive Identity = 0 and Multiplicative Identity = 1",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Addition", working: "Zero added to any rational number gives the same rational number back." },
        { step: "Multiplication", working: "One multiplied by any rational number gives the same rational number back." },
      ],
      answerLine: "These are the two identity rules used throughout rational arithmetic.",
    },
  },
  {
    id: "identity-example-1",
    accent: "violet",
    sectionKey: "5.3",
    teachTitle: "Example 1",
    teachBlocks: ["Verify: 0 is the additive identity for -4/11."],
    flash: {
      label: "Worked Check",
      problem: "Verify additive identity for -4/11",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Check 1", working: "-4/11 + 0 = -4/11 (unchanged)" },
        { step: "Check 2", working: "0 + (-4/11) = -4/11 (unchanged)" },
      ],
      answerLine: "Result: Both directions confirmed. 0 is the additive identity.",
    },
  },
  {
    id: "identity-example-2",
    accent: "sun",
    sectionKey: "5.4",
    teachTitle: "Example 2",
    teachBlocks: ["Verify: 1 is the multiplicative identity for 9/15."],
    flash: {
      label: "Worked Check",
      problem: "Verify multiplicative identity for 9/15",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Check 1", working: "9/15 x 1 = 9/15 (unchanged)" },
        { step: "Check 2", working: "1 x (9/15) = 9/15 (unchanged)" },
      ],
      answerLine: "Result: Both directions confirmed. 1 is the multiplicative identity.",
    },
  },
];

const idQuiz: ChapterQuizItem[] = [
  {
    id: "id-q1",
    kind: "mcq",
    prompt: "(5/7) + 0 = ?",
    options: ["0", "5/7", "1", "7/5"],
    correctIndex: 1,
    hints: [
      "Think about what adding zero physically means — if you have 5/7 of something and add nothing to it, what do you have?",
      "Zero is a neutral number under addition. It contributes nothing to the sum — so what does the result have to be?",
      "Look at the answer choices. Which one means the value stayed completely unchanged from what you started with?",
    ],
    remedial:
      "Understanding the concept\nZero is additive identity: adding zero keeps value unchanged.\nWorked Example: (-9/11) + 0\n1. Add zero -> value stays -9/11.\n2. Reverse check: 0 + (-9/11) = -9/11.\nKey Rule: any rational + 0 gives same rational.",
  },
  {
    id: "id-q2",
    kind: "fraction",
    prompt: "(-3/8) x 1 = ?",
    accepted: ["-3/8", "−3/8"],
    hints: [
      "Think about what multiplying by 1 means, if you have one group of -3/8, how much do you have in total?",
      "One is a neutral number under multiplication. It scales nothing up or down — so what must the result equal?",
      "Look at the options idea mentally: which answer means the fraction came out exactly as it went in, with no change at all?",
    ],
    remedial:
      "Understanding the concept\nOne is multiplicative identity: multiplying by 1 leaves value unchanged.\nWorked Example: (7/12) x 1\n1. One copy of 7/12 is 7/12.\n2. Reverse check: 1 x (7/12) = 7/12.\nKey Rule: any rational x 1 gives same rational.",
  },
  {
    id: "id-q3",
    kind: "mcq",
    prompt: "Find x: x + (3/5) = (3/5)",
    options: ["3/5", "6/5", "0", "1"],
    correctIndex: 2,
    hints: [
      "The right side equals exactly 3/5, the same as the fraction already being added. What does that tell you about the contribution x is making to the sum?",
      "If x were any non-zero number, the sum would shift away from 3/5. Which special number makes an addition have absolutely no effect?",
      "Think about which identity this equation is demonstrating. What is the identity element for addition, and which answer choice matches it?",
    ],
    remedial:
      "Understanding the concept\nIf x + p/q = p/q, x contributes nothing.\nOnly 0 contributes nothing in addition.\nWorked Example: x + (-4/9) = -4/9\n1. Right side unchanged.\n2. So x must be 0.\nKey Rule: p/q + x = p/q implies x = 0.",
  },
  {
    id: "id-q4",
    kind: "mcq",
    prompt: "If (-7/9) x x = -7/9, what can you say about x?",
    options: [
      "x = 0, additive identity",
      "x = 1, multiplicative identity",
      "x = 9/7, reciprocal",
      "x = -7/9, same number",
    ],
    correctIndex: 1,
    hints: [
      "Look at both sides of the equation. The result is exactly the same as the number you started with : (-7/9). What does that tell you about what x contributed to the multiplication?",
      "If multiplying by x changed nothing, x must be a very special number. Which number, when multiplied with anything, always gives that same thing back?",
      "Now look at the options, two of them get the value of x right but name the wrong identity, and one gets both right. Make sure you are matching the correct value of x to the correct identity name.",
    ],
    remedial:
      "Understanding the concept\nIf p/q x x = p/q, multiplying by x changed nothing.\nOnly 1 leaves multiplication unchanged.\nWorked Example: (5/12) x x = 5/12\n1. Unchanged product means x=1.\n2. Check: (5/12) x 1 = 5/12.\nKey Rule: p/q x x = p/q implies x = 1.",
  },
];

const invLessons: ChapterLesson[] = [
  {
    id: "inverse-types",
    accent: "teal",
    sectionKey: "6.1",
    teachTitle: "Inverses",
    teachBlocks: [
      "Additive Inverse gives 0 when added: -(p/q).",
      "Multiplicative Inverse (Reciprocal) gives 1 when multiplied: q/p (flip the fraction).",
      "Important: 0 has NO multiplicative inverse (reciprocal).",
    ],
    flash: {
      label: "Type Table",
      problem: "Type | What It Does | Formula | Example",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Additive Inverse", working: "Gives 0 when added | -(p/q) | additive inverse of 3/5 is -3/5" },
        { step: "Multiplicative Inverse", working: "Gives 1 when multiplied | q/p | reciprocal of 3/5 is 5/3" },
      ],
      answerLine: "3/5 + (-3/5) = 0 and 3/5 x 5/3 = 1.",
    },
  },
  {
    id: "inverse-mistake",
    accent: "coral",
    sectionKey: "6.2",
    teachTitle: "Common Student Mistake — Be Careful!",
    teachBlocks: [
      "Confusing additive inverse with reciprocal for 3/5.",
      "Additive inverse = -3/5 (flip the sign). Reciprocal = 5/3 (flip the fraction).",
    ],
    flash: {
      label: "Mistake Check",
      problem: "Do not mix the two inverse operations.",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Wrong idea", working: "Thinking inverse is 5/3 for addition." },
        { step: "Correct idea", working: "For addition use -3/5; for multiplication use 5/3." },
      ],
      answerLine: "Additive inverse flips sign; reciprocal flips fraction.",
    },
  },
  {
    id: "inverse-example-1",
    accent: "violet",
    sectionKey: "6.3",
    teachTitle: "Example 1 — Additive Inverse",
    teachBlocks: ["Find the additive inverse of -5/4."],
    flash: {
      label: "Worked Example",
      problem: "Find additive inverse of -5/4",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Additive inverse of -5/4 means: what + (-5/4) = 0?" },
        { step: "Step 2", working: "Additive inverse of -5/4 = +5/4" },
        { step: "Verify", working: "-5/4 + 5/4 = 0" },
      ],
      answerLine: "Answer: 5/4.",
    },
  },
  {
    id: "inverse-example-2",
    accent: "sun",
    sectionKey: "6.4",
    teachTitle: "Example 2 — Multiplicative Inverse (Reciprocal)",
    teachBlocks: ["Find the reciprocal of 1/2."],
    warning: "0 has no multiplicative inverse because dividing by 0 is undefined.",
    flash: {
      label: "Worked Example",
      problem: "Find reciprocal of 1/2",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Flip the fraction: 1/2 becomes 2/1 = 2" },
        { step: "Verify", working: "1/2 x 2 = 1" },
      ],
      answerLine: "Answer: The reciprocal of 1/2 is 2.",
    },
  },
];

const invQuiz: ChapterQuizItem[] = [
  {
    id: "in-q1",
    kind: "mcq",
    prompt: "What is the additive inverse of (-3/7)?",
    options: ["7/3", "3/7", "-7/3", "0"],
    correctIndex: 1,
    hints: [
      "The additive inverse always gives 0 when added to the original number. Think about what operation on -3/7 would bring it back to 0. Do you need to flip the sign or flip the fraction?",
      "Write it as an equation: -3/7 + ? = 0. What must ? be to make both sides balance?",
      "Look at the options carefully. One flips the sign, one flips the fraction, one flips both. The additive inverse only ever involves one of those operations.",
    ],
    remedial:
      "Understanding the concept\nAdditive inverse is the number that sums to 0 with the original.\nFor p/q, additive inverse is -p/q (flip sign only).\nWorked Example: additive inverse of -5/11\n1. Flip sign only -> +5/11.\n2. Verify: -5/11 + 5/11 = 0.\nKey Rule: additive inverse changes sign, not fraction structure.",
  },
  {
    id: "in-q2",
    kind: "mcq",
    prompt: "What is the reciprocal of (5/8)?",
    options: ["-5/8", "8/5", "5/8", "1"],
    correctIndex: 1,
    hints: [
      "The reciprocal gives 1 when multiplied with the original. To find it, what do you do to the numerator and denominator of 5/8?",
      "Write the fraction as p/q and apply the reciprocal formula q/p. What are p and q here, and what do you get when you swap them?",
      "Check your answer by multiplying it with 5/8. If the result is 1, you have the correct reciprocal. Which option gives you 1 when multiplied with 5/8?",
    ],
    remedial:
      "Understanding the concept\nMultiplicative inverse (reciprocal) gives product 1 with original.\nFor p/q (p,q nonzero), reciprocal is q/p.\nWorked Example: reciprocal of -4/9\n1. Swap numerator and denominator -> -9/4.\n2. Verify: (-4/9) x (-9/4) = 1.\nKey Rule: reciprocal flips fraction; sign stays with number.",
  },
  {
    id: "in-q3",
    kind: "fraction",
    prompt: "Find x: (2/9) x (x) = 1",
    accepted: ["9/2"],
    hints: [
      "The product equals 1. What type of inverse always gives 1 as a product? What is that inverse called?",
      "Apply the inverse formula to 2/9. What do you get when you swap the numerator and denominator?",
      "Verify your answer by substituting it back into the equation. Does (2/9) x your answer actually equal 1?",
    ],
    remedial:
      "Understanding the concept\nIf p/q x x = 1, then x must be reciprocal of p/q.\nWorked Example: (7/11) x x = 1\n1. Reciprocal of 7/11 is 11/7.\n2. So x=11/7.\n3. Verify: (7/11) x (11/7) = 1.\nKey Rule: product 1 indicates reciprocal pair.",
  },
  {
    id: "in-q4",
    kind: "mcq",
    prompt: "Which rational number has NO multiplicative inverse?",
    options: ["1/100", "-1", "0", "-99/100"],
    correctIndex: 2,
    hints: [
      "To find the multiplicative inverse of any number, you flip it. Try writing each option as a fraction and attempt to flip it. Does anything go wrong with any of them?",
      "Think specifically about what happens when the numerator becomes the denominator after flipping. Is there any value that cannot legally appear in a denominator?",
      "One of the options, when flipped, produces a denominator of 0. What rule about denominators makes this impossible, and which option is it?",
    ],
    remedial:
      "Understanding the concept\nZero has no reciprocal.\n0/1 flipped becomes 1/0, which is undefined.\nAlso 0 multiplied by any number is always 0, never 1.\nWorked check: test all choices and only 0 fails reciprocal rule.\nKey Rule: 0 has no multiplicative inverse.",
  },
  {
    id: "in-q5",
    kind: "fraction",
    prompt: "The reciprocal of a number x is (-7/3). Find x.",
    accepted: ["-3/7", "−3/7"],
    hints: [
      "You are given the reciprocal of x, not x itself. What operation would reverse a reciprocal and get you back to the original number?",
      "Think about what happens when you take the reciprocal of a reciprocal. If flipping once gives you -7/3, what does flipping once more give you?",
      "Be careful with the sign it belongs to the numerator, not just the number. When you flip -7/3, where does the negative sign end up?",
    ],
    remedial:
      "Understanding the concept\nReciprocal of a reciprocal returns original value.\nIf reciprocal of x is known, flip that fraction to recover x.\nWorked Example: reciprocal of x = -4/5\n1. Flip -4/5 -> -5/4.\n2. So x = -5/4.\n3. Verify: (-5/4) x (-4/5) = 1.\nKey Rule: flip again to return to original.",
  },
];

const nbLessons: ChapterLesson[] = [
  {
    id: "density-property",
    accent: "teal",
    sectionKey: "6.1",
    teachTitle: "Density Property",
    teachBlocks: [
      "Between any two distinct rational numbers, there are infinitely many other rational numbers.",
      "This process never ends — you can always find more.",
    ],
    flash: {
      label: "Method 1 — The Mean Method",
      problem: "Find a rational number between 1/4 and 1/2",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Apply mean formula: (1/4 + 1/2) / 2" },
        { step: "Step 2", working: "Common denominator: 1/4 + 2/4 = 3/4" },
        { step: "Step 3", working: "Divide by 2: (3/4) / 2 = 3/8" },
        { step: "Verify", working: "1/4 = 2/8 < 3/8 < 4/8 = 1/2" },
      ],
      answerLine: "Answer: 3/8 lies between 1/4 and 1/2.",
    },
  },
  {
    id: "equivalent-fractions-method",
    accent: "coral",
    sectionKey: "6.2",
    teachTitle: "Method 2 — Equivalent Fractions Method",
    teachBlocks: [
      "To find multiple rational numbers between two values, convert them to equivalent fractions with a large denominator.",
      "Common Mistake: some students think there is a fixed, finite number of rationals between two numbers. This is wrong.",
    ],
    flash: {
      label: "Worked Example",
      problem: "Find 5 rational numbers between 1/4 and 1/2",
      tableHeader: { step: "Step", working: "Working" },
      rows: [
        { step: "Step 1", working: "Scale up to denominator 20: 1/4 = 5/20 and 1/2 = 10/20" },
        { step: "Step 2", working: "List integers between 5 and 10: 6, 7, 8, 9" },
        { step: "Step 3", working: "Write as fractions: 6/20, 7/20, 8/20, 9/20" },
        { step: "Step 4", working: "Simplify: 3/10, 7/20, 2/5, 9/20" },
      ],
      answerLine: "Answer: any of these values lie between 1/4 and 1/2.",
    },
  },
];

const nbQuiz: ChapterQuizItem[] = [
  {
    id: "nb-q1",
    kind: "mcq",
    prompt: "Find one rational number between (1/3) and (1/2).",
    options: ["5/12", "1/6", "2/3", "1/12"],
    correctIndex: 0,
    hints: [
      "The mean method always works here; the average of two numbers always falls between them. Set up the formula: (1/3 + 1/2) / 2.",
      "Before you can add 1/3 and 1/2, you need a common denominator. What is the LCM of 3 and 2, and what do the fractions become?",
      "Once you have the sum, dividing a fraction by 2 is the same as multiplying by 1/2. Carry out that step and check whether your answer falls between 1/3 and 1/2.",
    ],
    remedial:
      "Understanding the concept\nMean method always gives a value between two numbers: (a+b)/2.\nWorked Example: one rational between 1/5 and 1/3\n1. Set mean: (1/5 + 1/3)/2.\n2. LCM(5,3)=15 -> 3/15 + 5/15 = 8/15.\n3. Divide by 2: (8/15)/2 = 4/15.\n4. Verify: 1/5 < 4/15 < 1/3.\nKey Rule: Mean = (a+b)/2.",
  },
  {
    id: "nb-q2",
    kind: "mcq",
    prompt: "How many rational numbers exist between 0 and 1?",
    options: ["10", "99", "999", "Infinitely many"],
    correctIndex: 3,
    hints: [
      "Start simple name just one rational number that sits between 0 and 1. Can you always find at least one?",
      "Now take the number you found and try to find another rational number between 0 and that number. Does anything stop you from doing this?",
      "Think about whether this process of finding numbers between numbers ever reaches a dead end. What does that tell you about the total count?",
    ],
    remedial:
      "Understanding the concept\nRational numbers are dense: between any two rationals, another exists.\nWorked Example: three rationals between 0 and 1\n1. Average of 0 and 1 = 1/2.\n2. Average of 0 and 1/2 = 1/4.\n3. Average of 0 and 1/4 = 1/8.\nThis process can continue forever.\nKey Rule: no finite limit; infinitely many exist.",
  },
  {
    id: "nb-q3",
    kind: "mcq",
    prompt: "Find a rational number between (-2/3) and (-1/2).",
    options: ["-7/12", "-1", "-5/6", "0"],
    correctIndex: 0,
    hints: [
      "The mean method works just as well for negative numbers. Set up the average formula using -2/3 and -1/2. What common denominator do you need to add to them?",
      "Convert both fractions to sixths and add them. Remember, adding two negative numbers gives a negative result. What do you get before dividing by 2?",
      "Divide your sum by 2 and check whether the result sits between -2/3 and -1/2 on the number line. With negatives, the number closer to 0 is always the larger one.",
    ],
    remedial:
      "Understanding the concept\nMean method works for negative numbers too; handle signs carefully.\nWorked Example: between -3/4 and -1/2\n1. Mean: (-3/4 + -1/2)/2.\n2. Common denominator: -3/4 + -2/4 = -5/4.\n3. Divide by 2: (-5/4)/2 = -5/8.\n4. Verify: -3/4 < -5/8 < -1/2.\nKey Rule: average still lies between values, even negatives.",
  },
  {
    id: "nb-q4",
    kind: "mcq",
    prompt: "A water tank was 1/4 full on Monday and 3/4 full on Wednesday. Which pair could be Tuesday levels?",
    options: ["1/8 and 7/8", "3/8 and 1/2", "1/6 and 5/6", "0 and 1"],
    correctIndex: 1,
    hints: [
      "Tuesday's level must be strictly greater than 1/4 and strictly less than 3/4. Convert both fractions to a common denominator to see the range more clearly.",
      "Using eighths, what does 1/4 become, and what does 3/4 become? List all the simple fractions in eighths that sit strictly between those two values.",
      "Pick any two values from your list, but make sure each one is genuinely greater than 1/4 and less than 3/4. Can you verify this with a quick number line check?",
    ],
    remedial:
      "Understanding the concept\nAny value strictly between endpoints is valid in density problems.\nWorked Example: Day1=1/3, Day3=2/3\n1. Convert to sixths: 1/3=2/6, 2/3=4/6 -> one middle value is 3/6=1/2.\n2. For another value, use twelfths: 1/3=4/12, 2/3=8/12 -> choose 5/12.\n3. Both are strictly between limits.\nKey Rule: use equivalent fractions to generate valid in-range values.",
  },
];

export const NUMBER_LINE_BUNDLE: ChapterBundle = {
  id: "number-line",
  hero: {
    chapterLabel: "Chapter 2 · Number line",
    title: "Representing rationals on the number line",
  },
  domainIntro: {
    heading: "From symbols to positions",
    definition:
      "A rational number can be located on the number line by measuring signed distance from zero using the unit length scaled by the denominator.",
    bridge: "Plotting and comparing on the line turns abstract fractions into geometric order — the backbone for inequalities and distance.",
    objectives: [
      "Plot positive and negative rationals on a standard number line.",
      "Compare rationals using order on the line and common denominators.",
      "Compute simple distances as absolute differences.",
    ],
    prerequisite: "",
  },
  lessons: nlLessons,
  quiz: nlQuiz,
  preQuizSummary: {
    heading: "SUMMARY",
    lines: [
      "Every rational number has exactly one point on the number line. Numbers to the right of 0 are positive; to the left are negative.",
      "To plot p/q: divide each unit into q equal parts, then count p parts from 0 — left if p is negative, right if p is positive.",
      "Comparing: the number further to the right is always greater. So between two negative numbers, the one closer to 0 is the larger one (e.g. −1/4 > −3/4).",
      "Between any two rational numbers, there are infinitely many more rational numbers.",
    ],
  },
};

export const PROPERTIES_BUNDLE: ChapterBundle = {
  id: "properties",
  hero: {
    chapterLabel: "Chapter 3 · Algebraic Properties",
    title: "Algebraic Properties",
  },
  domainIntro: {
    heading: "Algebric Properties of Rational Numbers",
    definition:
      "Rationals inherit commutative, associative, and distributive laws from integers — they justify every algebraic shuffle you perform.",
    bridge: "Recognizing the law you use prevents sign errors and speeds mental calculation.",
    objectives: [
      "State and apply commutativity and associativity for + and × on rationals.",
      "Expand and factor miniature expressions using distributivity.",
    ],
    prerequisite: "",
  },
  lessons: propLessons,
  quiz: propQuiz,
};

export const IDENTITIES_BUNDLE: ChapterBundle = {
  id: "identities",
  hero: {
    chapterLabel: "Chapter 4 · Identities",
    title: "Identities",
  },
  domainIntro: {
    heading: "Identities",
    definition:
      "An identity is a special number that, when combined with any rational number under a given operation, leaves that rational number unchanged.",
    bridge:
      "Additive Identity = 0 and Multiplicative Identity = 1.",
    objectives: [
      "Use additive identity: p/q + 0 = p/q.",
      "Use multiplicative identity: p/q x 1 = p/q.",
      "Simplify expressions immediately when + 0 or x 1 appears.",
    ],
    prerequisite: "",
  },
  lessons: idLessons,
  quiz: idQuiz,
  preQuizSummary: {
    heading: "SUMMARY",
    lines: [
      "An identity is a special number that leaves any rational number unchanged under a given operation.",
      "Additive Identity = 0. Adding zero to any rational number gives the same number back: p/q + 0 = p/q. This works in both directions: 0 + p/q gives the same result.",
      "Multiplicative Identity = 1. Multiplying any rational number by 1 gives the same number back: p/q x 1 = p/q. Again, works in both directions.",
      "Identities are useful because whenever you spot + 0 or x 1 in an expression, you can simplify immediately without any calculation.",
    ],
  },
};

export const INVERSES_BUNDLE: ChapterBundle = {
  id: "inverses",
  hero: {
    chapterLabel: "Chapter 5 · Inverses",
    title: "Inverses",
  },
  domainIntro: {
    heading: "Inverses",
    definition:
      "Every rational number has two types of inverses.",
    bridge:
      "Additive inverse flips the sign. Multiplicative inverse (reciprocal) flips the fraction.",
    objectives: [
      "Use additive inverse: -(p/q) to get 0 when added.",
      "Use multiplicative inverse: q/p to get 1 when multiplied.",
      "Remember that 0 has NO multiplicative inverse.",
    ],
    prerequisite: "",
  },
  lessons: invLessons,
  quiz: invQuiz,
  preQuizSummary: {
    heading: "SUMMARY",
    lines: [
      "Every rational number has two types of inverses.",
      "Additive Inverse — the number you add to get 0. Simply flip the sign: the additive inverse of p/q is -p/q. A number and its additive inverse always cancel each other out completely.",
      "Multiplicative Inverse (Reciprocal) — the number you multiply by to get 1. Simply flip the fraction: the reciprocal of p/q is q/p. A number and its reciprocal always multiply to exactly 1.",
      "The most important exception: 0 has no multiplicative inverse. Flipping 0/1 gives 1/0, which is undefined. You can never multiply 0 by anything to get 1.",
      "The key distinction to remember — additive inverse flips the sign, reciprocal flips the fraction. These are completely different operations.",
    ],
  },
};

export const NUMBERS_BETWEEN_BUNDLE: ChapterBundle = {
  id: "numbers-between",
  hero: {
    chapterLabel: "Chapter 6 · Numbers between two rational numbers",
    title: "Numbers between two rational numbers",
  },
  domainIntro: {
    heading: "Numbers Between Two Rational Numbers",
    definition:
      "Density Property: Between any two distinct rational numbers, there are infinitely many other rational numbers.",
    bridge: "This process never ends — you can always find more.",
    objectives: [
      "Use the Mean Method: (a + b) / 2.",
      "Use the Equivalent Fractions Method to find multiple values.",
      "Avoid the common mistake that the count is finite.",
    ],
    prerequisite: "",
  },
  lessons: nbLessons,
  quiz: nbQuiz,
  preQuizSummary: {
    heading: "SUMMARY",
    lines: [
      "The Density Property states that between any two distinct rational numbers, there are infinitely many rational numbers. This never ends — you can always find more.",
      "Method 1 — Mean Method: Find one number between a and b by calculating (a + b) / 2. The average always lies exactly between the two numbers.",
      "Method 2 — Equivalent Fractions Method: To find multiple numbers, scale both fractions up to a larger common denominator, then list all integers between the new numerators.",
      "There is no such thing as a next rational number after any given one — the gap between any two rationals always contains infinitely many more.",
    ],
  },
};
