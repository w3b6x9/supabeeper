-- profiles table

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

-- trigger to update profiles updated_at

create extension if not exists moddatetime schema extensions;
create trigger handle_profile_updated_at before update on profiles 
  for each row execute procedure moddatetime (updated_at);

-- add pg_trgm fuzzy search

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

-- requests table

create extension if not exists "uuid-ossp" schema extensions;

create table requests (
  id uuid default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  requestor_id uuid references auth.users,
  requestee_id uuid references auth.users,

  primary key (id)
);
create index requests_requestor_id_idx on requests(requestor_id);
create index requests_requestee_id_idx on requests(requestee_id);

alter table requests enable row level security;

create policy "Users can view their own requests."
  on requests for select
  using ( auth.uid() = requestor_id or auth.uid() = requestee_id );

create policy "Users can insert requests."
  on requests for insert
  with check ( auth.uid() = requestor_id );

-- add fetch_requests function

create function fetch_requests(requestee_id requests.requestee_id%type)
returns table(request_id requests.id%type, requestor_id requests.requestor_id%type, username profiles.username%type, object_id storage.objects.id%type)
as 'SELECT r.id AS request_id, r.requestor_id, p.username, rm.object_id
  FROM profiles AS p
  JOIN requests AS r
  ON p.id = r.requestor_id
  LEFT JOIN requests_media AS rm
  ON r.id = rm.request_id
  WHERE r.requestee_id = requestee_id
  ORDER BY r.created_at DESC;'
language sql
stable
parallel safe;

-- add fetch_requests_fulfilled function

create function fetch_requests_fulfilled(requestor_id requests.requestor_id%type)
returns table(request_id requests.id%type, requestee_id requests.requestee_id%type, username profiles.username%type, object_id storage.objects.id%type, object_name storage.objects.name%type, viewed_at requests_media.viewed_at%type)
as 'SELECT r.id AS request_id, r.requestee_id, p.username, so.id AS object_id, so.name AS object_name, rm.viewed_at
FROM profiles AS p
JOIN requests AS r
ON p.id = r.requestee_id
JOIN requests_media AS rm
ON r.id = rm.request_id
JOIN storage.objects AS so
ON so.id = rm.object_id
WHERE r.requestor_id = requestor_id
ORDER BY r.created_at DESC;
'
language sql
stable
parallel safe;

-- requests_media table

create table requests_media (
  request_id uuid references requests,
  object_id uuid references storage.objects,
  viewed_at timestamp with time zone
);
create unique index requests_media_request_id_idx on requests_media(request_id);
create unique index requests_media_object_id_idx on requests_media(object_id);

create index storage_objects_owner_idx on storage.objects(owner);

alter table requests_media enable row level security;

create function is_requestor_medium_permitted(object_id storage.objects.id%type)
returns boolean
as $$
SELECT EXISTS (
  SELECT 1
  FROM requests_media AS rm
  JOIN requests AS r
  ON rm.request_id = r.id
  JOIN storage.objects AS so
  ON rm.object_id = so.id
  WHERE so.id = object_id
  AND r.requestee_id = so.owner
  AND r.requestor_id = auth.uid()
  AND rm.viewed_at = NULL
  AND now() - so.created_at <= '1 days'
);
$$
language sql
stable
security definer
parallel safe;

create function is_requestee_medium_permitted(request_id requests.id%type, object_id storage.objects.id%type)
returns boolean
as $$
DECLARE
  requestee_id uuid;
  owner uuid;
BEGIN
  SELECT requestee_id INTO requestee_id
  FROM requests
  WHERE id = request_id;

  SELECT owner INTO owner
  FROM storage.objects
  WHERE id = object_id;

  IF requestee_id = auth.uid() AND owner = auth.uid() THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$
language plpgsql
stable
security definer
parallel safe;

create policy "Users can view disappearing media sent to them within 24 hours."
  on requests_media for select
  using ( is_requestor_medium_permitted(object_id) );

create policy "Users can insert their request and media."
  on requests_media for insert
  with check ( is_requestee_medium_permitted(request_id, object_id) );

create policy "Users can update media viewed."
  on requests_media for update
  using ( is_requestor_medium_permitted(object_id) );

-- create media bucket

-- WARNING: remember to create a 'media' bucket that is not public via storage dashboard

create policy "Users can access media."
on storage.objects for select
using (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
);

create policy "Users can view disappearing media sent to them within 24 hours."
on storage.objects for select
using (
  bucket_id = 'media'
  and is_requestor_medium_permitted(id)
);

create policy "Users can insert media."
on storage.objects for insert
with check ( auth.uid() = owner );

-- requestor inserts into requests_media function

create function insert_request_medium(request_id requests.id%type, object_key text)
returns requests_media
as $$
DECLARE
  request_medium record;
  object_id uuid;
  object_path text[] := STRING_TO_ARRAY(object_key, '/');
BEGIN
  SELECT id INTO object_id
  FROM storage.objects
  WHERE bucket_id = object_path[1]
  AND path_tokens = object_path[2:];

  INSERT INTO requests_media (request_id, object_id)
    VALUES (request_id, object_id)
    RETURNING *
    INTO request_medium;

  RETURN request_medium;
END;
$$
language plpgsql
security definer;

-- update viewed_at function

create function update_viewed_at(request_id requests.id%type, object_id storage.objects.id%type)
returns requests_media
as $$
UPDATE requests_media
SET viewed_at = NOW()
WHERE request_id = request_id AND object_id = object_id
RETURNING *;
$$
language sql;
