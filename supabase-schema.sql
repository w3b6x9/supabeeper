create table profiles (
  id uuid references auth.users not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  username text unique,
  description text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 1 and char_length(username) <= 15)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

create extension if not exists moddatetime schema extensions;
create trigger handle_profile_updated_at before update on profiles 
  for each row execute procedure moddatetime (updated_at);

create extension if not exists pg_trgm schema extensions;
create index concurrently index_profiles_on_username_trigram on profiles using gin (username gin_trgm_ops);

create function fuzzy_search(search text, threshold real default 0.3)
returns table(id uuid, username text)
as 'SELECT id, username
  FROM profiles
  WHERE similarity(username, search) > threshold
  ORDER BY similarity(username, search) DESC, username;'
language sql
stable
parallel safe;
