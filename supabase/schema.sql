-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. User Profiles (Extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  username text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Couples (Links two users)
create table public.couples (
  id uuid default uuid_generate_v4() primary key,
  user1_id uuid references public.profiles(id) not null,
  user2_id uuid references public.profiles(id), 
  d_day date,
  notion_api_key text, 
  notion_db_map jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Connection Codes
create table public.connection_codes (
  code text primary key,
  creator_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '1 hour') not null
);

-- 4. Messages (Chat)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_room_id uuid, -- couple_id
  user_id uuid references public.profiles(id) not null,
  content text,
  type text default 'text', 
  reactions jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Push Subscriptions (For Notification Settings)
create table public.push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  token text not null, -- FCM Token or Web Push Endpoint
  device_type text, -- 'web', 'ios', 'android'
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, token)
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.messages enable row level security;
alter table public.push_subscriptions enable row level security;

-- Profiles: Public read, Self update
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Couples: Viewable by members
create policy "Couples viewable by members" on public.couples for select 
  using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Couples updateable by members" on public.couples for update
  using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Couples insertable by authenticated" on public.couples for insert with check (auth.role() = 'authenticated');

-- Messages: Viewable/Insertable by couple members (simplified logic for prototype)
-- In prod, join with couples table to verify membership
create policy "Messages viewable by everyone (prototype)" on public.messages for select using (true);
create policy "Users can insert messages" on public.messages for insert with check (auth.uid() = user_id);

-- Push Subscriptions: Self manage
create policy "Users manage own subscriptions" on public.push_subscriptions
  for all using (auth.uid() = user_id);

