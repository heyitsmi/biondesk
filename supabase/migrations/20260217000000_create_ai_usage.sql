-- Create a table for AI Usage Tracking
create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  feature text not null, -- e.g. 'proposal-generator', 'taptone', 'estimator'
  model text not null, -- e.g. 'gpt-4o'
  input_tokens integer default 0,
  output_tokens integer default 0,
  total_tokens integer default 0,
  estimated_cost numeric(10, 6) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.ai_usage enable row level security;

-- Allow users to view their own usage
create policy "Users can view their own AI usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);

-- Allow admins/service role to insert usage (or users if called from client, but we will likely call from server actions/API)
-- For now, we'll allow authenticated users to insert their *own* usage if we were doing client-side, 
-- but since we are doing server-side logging, we might need a service role key or just rely on the server action context.
-- Let's allow insert for authenticated users for now, matching their ID.
create policy "Users can insert their own AI usage"
  on public.ai_usage for insert
  with check (auth.uid() = user_id);

-- If we need an admin view, we'd add a policy for that role. 
-- For now we assume the dashboard user is the "admin" or self-view.
