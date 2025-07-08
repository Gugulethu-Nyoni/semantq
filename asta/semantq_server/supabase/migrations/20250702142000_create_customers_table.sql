
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  phone_number text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Optional index on email for faster lookups
create index if not exists idx_customers_email on public.customers(email);
