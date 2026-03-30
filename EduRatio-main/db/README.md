# Supabase Setup (Step 3)

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill values.
3. Run SQL from `supabase/migrations/001_initial_schema.sql` in Supabase SQL editor.
4. Verify required tables exist:
   - `sessions`
   - `question_attempts`
   - `mastery_scores`
   - `error_patterns`
   - `pen_usage`
   - `learner_model_states`

The repository functions in `db/repositories.ts` are the app-facing persistence layer for these tables.
