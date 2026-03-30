create table if not exists public.learner_model_states (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(session_id) on delete cascade,
  subtopic_id text not null,
  attempts integer[] not null default '{}',
  hint_usage integer[] not null default '{}',
  error_patterns text[] not null default '{}',
  time_on_task integer[] not null default '{}',
  remedial_done integer not null default 0 check (remedial_done in (0, 1, 2)),
  latest_attempt_efficiency numeric(5,4) not null default 1,
  latest_independence_score numeric(5,4) not null default 1,
  latest_error_component numeric(5,4) not null default 1,
  latest_time_engagement numeric(5,4) not null default 1,
  latest_remedial_multiplier numeric(5,4) not null default 1,
  latest_raw_score numeric(5,4) not null default 1,
  latest_mastery_score numeric(5,4) not null default 1 check (latest_mastery_score >= 0 and latest_mastery_score <= 1),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (session_id, subtopic_id)
);

create index if not exists idx_learner_model_states_session_subtopic
on public.learner_model_states(session_id, subtopic_id);

drop trigger if exists trg_learner_model_states_updated_at on public.learner_model_states;
create trigger trg_learner_model_states_updated_at
before update on public.learner_model_states
for each row execute function public.set_updated_at();
