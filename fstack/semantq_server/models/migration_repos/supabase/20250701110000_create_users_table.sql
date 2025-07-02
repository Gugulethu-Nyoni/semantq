create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
