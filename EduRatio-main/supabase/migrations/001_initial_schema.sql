create extension if not exists "pgcrypto";

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  student_id text not null,
  chapter_id text not null default 'grade8_rational_numbers',
  session_status text not null default 'active' check (session_status in ('active', 'completed', 'exited')),
  correct_answers integer not null default 0,
  wrong_answers integer not null default 0,
  questions_attempted integer not null default 0,
  total_questions integer not null default 20,
  retry_count integer not null default 0,
  hints_used integer not null default 0,
  total_hints_embedded integer not null default 0,
  time_spent_seconds integer not null default 0,
  topic_completion_ratio numeric(5,4) not null default 0,
  merge_dispatched boolean not null default false,
  merge_dispatch_attempts integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(session_id) on delete cascade,
  subtopic_id text not null,
  concept_id text,
  question_id text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  is_correct boolean not null,
  attempt_number integer not null,
  hint_level integer not null default 0 check (hint_level in (0, 1, 2, 3)),
  time_taken_seconds integer not null default 0,
  error_tags text[] not null default '{}',
  answer_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.mastery_scores (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(session_id) on delete cascade,
  subtopic_id text not null,
  attempt_efficiency numeric(5,4) not null,
  independence_score numeric(5,4) not null,
  error_component numeric(5,4) not null,
  time_engagement numeric(5,4) not null,
  remedial_multiplier numeric(5,4) not null,
  raw_score numeric(5,4) not null,
  mastery_score numeric(5,4) not null check (mastery_score >= 0 and mastery_score <= 1),
  mastery_level text not null check (mastery_level in ('L1', 'L2', 'L3', 'L4', 'L5')),
  created_at timestamptz not null default now()
);

create table if not exists public.error_patterns (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(session_id) on delete cascade,
  subtopic_id text not null,
  question_id text not null,
  error_tag text not null,
  occurrences integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, question_id, error_tag)
);

create table if not exists public.pen_usage (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(session_id) on delete cascade,
  subtopic_id text not null,
  question_id text,
  interaction_type text not null check (interaction_type in ('open', 'explanation', 'hint', 'remediation', 'motivation')),
  hint_level integer check (hint_level in (1, 2, 3)),
  prompt_content text not null,
  response_content text not null,
  response_source text not null check (response_source in ('gemini', 'fallback')),
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_student_id on public.sessions(student_id);
create index if not exists idx_question_attempts_session_id on public.question_attempts(session_id);
create index if not exists idx_mastery_scores_session_subtopic on public.mastery_scores(session_id, subtopic_id);
create index if not exists idx_pen_usage_session_id on public.pen_usage(session_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_sessions_updated_at on public.sessions;
create trigger trg_sessions_updated_at
before update on public.sessions
for each row execute function public.set_updated_at();

drop trigger if exists trg_error_patterns_updated_at on public.error_patterns;
create trigger trg_error_patterns_updated_at
before update on public.error_patterns
for each row execute function public.set_updated_at();
