-- Add role column to public.users table
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'role') then
    alter table public.users add column role text default 'user' check (role in ('user', 'admin'));
  end if;
end $$;
