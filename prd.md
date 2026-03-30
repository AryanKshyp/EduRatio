Below is your PRD v3 (fully expanded, system-complete, implementation-grade).
This version is written so that a developer / evaluator / LLM can reconstruct the entire system from it without ambiguity.

📘 PRODUCT REQUIREMENTS DOCUMENT (PRD v3)
Intelligent Tutoring System — Grade 8 Rational Numbers

1. Product Overview
1.1 Product Name
RationalTutor
1.2 Platform
Web Application (Modular Monolith)
1.3 Scope
One chapter: Grade 8 – Rational Numbers
Integrated as a module into a larger system
Sends standardized session data to Merge System

1.4 Objective
Build an Intelligent Tutoring System (ITS) that:
Teaches rational numbers using structured content
Adapts dynamically using a multi-parameter learner model
Implements pedagogically grounded decision logic
Uses a smart assistant (Pen 🐧) to deliver all explanations
Tracks all interactions and outputs a single standardized session payload

1.5 Key Innovation
A hybrid system combining:
Weighted behavioral mastery modeling
Rule-based pedagogical decision engine
LLM-assisted conversational delivery (Pen)

2. System Scope & Constraints
2.1 Responsibilities
Deliver full instructional flow
Track all student interactions
Maintain learner model state
Send final session payload
2.2 Constraints (Merge System)
Only one payload per session
No scoring/recommendation logic
Strict schema adherence
Handle exit cases

3. System Architecture
3.1 High-Level Architecture
UI Layer (Dashboard + Subtopics)
        ↓
Pedagogical Engine
        ↓
Learner Model Engine
        ↓
API Layer (/api)
        ↓
Supabase (Database)
        ↓
Merge API

3.2 Code Architecture
/app
  /dashboard
  /subtopic/{id}

/api
  /session
  /pen
  /learner

/lib
  learnerModel.ts
  pedagogyEngine.ts
  penEngine.ts

/db
  supabaseClient.ts

3.3 Design Philosophy
Single app (no separate backend)
Logical separation via modules
Page-wise encapsulation + shared logic

4. UI / UX Design System

4.1 Color Scheme
Role
Color
Primary
Navy #2F4156
Accent
Teal #567C8D
Secondary
Sky Blue #C8D9E6, Beige #F5EFEB
Background
White #FFFFFF


4.2 Usage Guidelines
Navbar/Header → Navy
Buttons/CTAs → Teal
Cards/Sections → Sky Blue / Beige
Background → White

4.3 UI Principles
Minimal, clean
Grade 8 friendly
High readability
Clear hierarchy

4.4 Key UI Components
Progress bar
Subtopic nodes
Question card
Hint panel
Pen assistant widget (floating)

5. Page Architecture

5.1 Dashboard (/dashboard)
Features:
Subtopic nodes (locked/unlocked)
Mastery per subtopic
Overall progress %
Pen onboarding

Node Behavior
Condition
State
M(t) < 0.8
Locked
M(t) ≥ 0.8
Unlocked


5.2 Subtopic Pages (/subtopic/{id})
Each page contains:
Flow
Concept Block
↓
Practice Questions
↓
Concept Block
↓
Practice Questions
↓
Interactive Assessment (optional)
↓
Final Assessment

5.3 Internal Page Logic
Each page:
Loads subtopic content
Tracks learner signals
Runs pedagogical engine
Displays Pen interactions

6. Domain Model

6.1 Subtopics
Operations
Number Line
Properties
Identities
Inverses
Numbers Between

6.2 Concept Units
Each subtopic has:
2–4 concepts
Each concept includes:
explanation
examples
misconceptions

6.3 Skill Mapping
{
  "operations": ["lcm_handling", "sign_rules", "simplification"]
}

6.4 Question Structure
Each question includes:
{
  "id": "q1",
  "difficulty": "medium",
  "skills": ["sign_rules"],
  "hints": ["h1", "h2", "h3"],
  "error_tags": ["ERR_SIGN"]
}

7. Learner Model (FULL IMPLEMENTATION)

7.1 Overview
The learner model tracks:
attempts
hint_usage
time_on_task
error_patterns
remedial_done

7.2 Mastery Calculation

Stage 1: Raw Score
[
Raw(t) = 0.30A + 0.35I + 0.20E + 0.15T
]
Where:
A = Attempt Efficiency
I = Independence Score
E = Error Component
T = Time Engagement

Stage 2: Final Mastery
[
M(t) = Raw(t) × RemedialMultiplier
]

7.3 Component Definitions

Attempt Efficiency
Attempt
Score
1st
1.0
2nd
0.6
3rd
0.2
Fail
0


Independence Score
Hint
Score
None
1.0
H1
0.7
H2
0.4
H3
0.1


Error Component
[
E = 1 - penalty
]

Time Engagement
Based on avg time per question

7.4 Mastery Levels
Level
Range
L1
0–0.39
L2
0.4–0.59
L3
0.6–0.79
L4
0.8–0.94
L5
0.95–1.0


7.5 Overall Progress
[
overall = \frac{1}{6} \sum M(t)
]

8. Pedagogical Engine (FULL LOGIC)

8.1 Question Selection (ZPD)
if M(t) < 0.40 → Easy
elif < 0.65 → Medium
else → Hard

8.2 Response Handling
Case
Action
Correct + Fast
increase difficulty
Correct + Slow
reinforcement
Incorrect
hint system


8.3 Hint System
H1 → nudge
H2 → partial
H3 → solution + remedial

8.4 Remedial System
L1:
explanation + example
L2:
deeper breakdown + practice
Escalation:
practice set + flag

8.5 Skip Logic
mastery ≥ 0.65 → skip easy
hard correct → infer mastery

8.6 Mastery Unlock
[
M(t) ≥ 0.80
]

8.7 Affective Detection
Triggers:
repeated wrong
slow time
high hints

9. 🐧 Pen — Smart Assistant

9.1 Role
Pen is the communication layer of pedagogy

9.2 Responsibilities
explain concepts
give hints
deliver remediation
motivate

9.3 System Integration
Pedagogical Decision → Pen → UI

9.4 LLM Usage
Gemini API
Converts structured content → conversational

9.5 Interaction
Click-based
No free chat

9.6 Triggers
hint click
wrong answer
idle
remediation

9.7 Behavior
playful
encouraging

9.8 Tracking
opens
hints requested
remediation triggered

10. Engagement System
idle detection
fast guessing detection
encouragement loop

11. Data Storage (Supabase)

Tables
sessions
question_attempts
mastery_scores
error_patterns
pen_usage

12. API Design

Internal
session/start
session/update
session/complete
pen

External (Merge)
Strict schema

13. Metrics
correct
wrong
attempts
hints
time
completion ratio

14. Learning Flow
Dashboard
↓
Subtopic
↓
Concept → Question loop
↓
Adaptive interventions
↓
Final assessment
↓
Next subtopic
↓
Submit

15. What Needs to be Built

Frontend
dashboard
subtopics
pen UI

Backend
learner model
pedagogy engine

DB
supabase

16. Evaluation Alignment
Criteria
Coverage
Domain model
structured
Personalization
multi-factor
Pedagogy
rule-based
Innovation
Pen
Architecture
modular


🚀 Final Positioning
This system operationalizes learning science through a weighted learner model, rule-driven pedagogy, and AI-mediated instruction, enabling adaptive learning beyond traditional ITS implementations.



🧱 1. SYSTEM ARCHITECTURE DIAGRAM
                ┌──────────────────────────────┐
                │        FRONTEND (Next.js)    │
                │                              │
                │  Dashboard                   │
                │  Subtopic Pages (6)          │
                │  Pen UI (Floating Widget)    │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │     PEDAGOGICAL ENGINE       │
                │                              │
                │  - ZPD Logic                 │
                │  - Hint Flow                 │
                │  - Remediation Logic         │
                │  - Skip Logic                │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │        LEARNER MODEL         │
                │                              │
                │  - attempts                 │
                │  - hint_usage              │
                │  - error_patterns          │
                │  - time_on_task            │
                │  - remedial_done           │
                │  - mastery calculation     │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │         API LAYER            │
                │                              │
                │  /session/start              │
                │  /session/update             │
                │  /session/complete           │
                │  /pen                        │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │         SUPABASE DB          │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │         MERGE SYSTEM         │
                │     (FINAL PAYLOAD ONLY)     │
                └──────────────────────────────┘

🔁 2. PEDAGOGICAL FLOW DIAGRAM (EXACT LOGIC)
START
 ↓
Load Learner Model
 ↓
Select Subtopic (lowest mastery OR user click)
 ↓
Determine Difficulty (ZPD)
 ↓
Deliver Question
 ↓
Evaluate Response
 ├── Correct + Fast → Increase difficulty → Next Q
 ├── Correct + Slow → Reinforcement Q → Next
 └── Incorrect → Hint System
         ↓
     Attempt Count
     ├── Attempt 1 → Hint 1
     ├── Attempt 2 → Hint 2
     └── Attempt 3 → Hint 3 + Trigger Remedial
                      ↓
                 L1 Remedial
                      ↓
          Pass? → Yes → Resume
                 No → L2 Remedial
                      ↓
          Pass? → Yes → Resume
                 No → Escalation
 ↓
Update Mastery
 ↓
Check M(t) ≥ 0.80
 ├── Yes → Unlock Next Subtopic
 └── No → Continue Practice
 ↓
END

🖥️ 3. UI WIREFRAMES (IMPLEMENTATION-READY)

🏠 Dashboard
--------------------------------------------------
| NAVBAR (Navy #2F4156)                          |
| RationalTutor                                  |
--------------------------------------------------

| Progress: ███████░░ 70%                        |

| Subtopics                                      |
| [Operations ✅] [Number Line 🔒]               |
| [Properties 🔒] [Identities 🔒]               |

| Pen 🐧 (bottom right floating)                 |
--------------------------------------------------

📘 Subtopic Page
--------------------------------------------------
| Navbar                                         |
--------------------------------------------------

| Concept Card (Sky Blue #C8D9E6)               |
| Explanation text                              |

| [Continue]                                    |

---------------- QUESTION -----------------------
| Question text                                 |
| Input                                         |

| [Submit] (Teal #567C8D)                        |
| [Hint]                                        |

| Pen 🐧 (floating)                             |
--------------------------------------------------

💡 Hint UI (via Pen)
Pen 🐧 says:
"Try finding the LCM first!"

[Next Hint] [Close]

🛠️ Remediation UI
Pen 🐧:
"Looks like you're struggling with signs. Let’s fix it!"

→ Explanation  
→ Guided Q1  
→ Guided Q2  
→ Guided Q3  

🔌 4. API CONTRACTS (STRICT)

4.1 /api/session/start
Request
{
  "student_id": "student_123"
}
Response
{
  "session_id": "s_123_g8rn_001",
  "start_time": "timestamp"
}

4.2 /api/session/update
{
  "session_id": "...",
  "event": "question_attempt",
  "data": {
    "question_id": "q1",
    "correct": true,
    "attempt": 1,
    "hint_level": 0,
    "time_taken": 45
  }
}

4.3 /api/session/complete
{
  "session_id": "...",
  "status": "completed"
}

4.4 MERGE API PAYLOAD (FINAL)
{
  "student_id": "...",
  "session_id": "...",
  "chapter_id": "grade8_rational_numbers",
  "timestamp": "...",
  "session_status": "completed",
  "correct_answers": 12,
  "wrong_answers": 5,
  "questions_attempted": 17,
  "total_questions": 20,
  "retry_count": 3,
  "hints_used": 6,
  "total_hints_embedded": 18,
  "time_spent_seconds": 1100,
  "topic_completion_ratio": 0.83
}

💻 5. CODE STUBS (READY TO USE)

5.1 Mastery Calculation
function computeMastery(data) {
  const {
    attempts,
    hintUsage,
    errorCount,
    avgTime,
    remedialLevel
  } = data;

  const attemptScore = attempts.reduce((sum, a) => sum + a, 0) / attempts.length;
  const hintScore = hintUsage.reduce((sum, h) => sum + h, 0) / hintUsage.length;

  const errorPenalty = Math.min(0.15, errorCount * 0.05);
  const errorComponent = 1 - errorPenalty;

  let timeScore = 1;
  if (avgTime < 30 || avgTime > 180) timeScore = 0.4;
  else if (avgTime > 90) timeScore = 0.7;

  const raw =
    0.3 * attemptScore +
    0.35 * hintScore +
    0.2 * errorComponent +
    0.15 * timeScore;

  const multiplier =
    remedialLevel === 2 ? 0.8 :
    remedialLevel === 1 ? 0.9 : 1;

  return raw * multiplier;
}

5.2 Pedagogy Engine
function getNextDifficulty(mastery) {
  if (mastery < 0.4) return "easy";
  if (mastery < 0.65) return "medium";
  return "hard";
}

5.3 Hint Flow
function getHint(attempt) {
  if (attempt === 1) return "hint1";
  if (attempt === 2) return "hint2";
  return "hint3";
}

5.4 Pen Integration
function generatePenResponse(content, context) {
  return callGeminiAPI({
    prompt: `Explain simply: ${content}`,
    context
  });
}

🎯 FINAL CONSISTENCY CHECK
Everything now aligns:
Component
Status
Learner model
exact formula
Pedagogy
rule-based
UI
mapped
APIs
defined
Pen
integrated
Merge
compliant


🚀 FINAL POSITIONING
This system operationalizes learning science through a quantitative mastery model, rule-based pedagogy, and AI-mediated instruction, creating a deeply personalized and engaging tutoring experience.

