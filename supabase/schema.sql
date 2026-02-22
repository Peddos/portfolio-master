-- Portfolio Engine — Supabase Schema
-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  full_name     text not null,
  profession    text not null,   -- Fashion Designer | Developer | Freelancer | Other
  raw_bio       text,            -- original user input
  bio           text,            -- AI-polished version
  profile_img   text,            -- Cloudinary URL
  projects_json jsonb default '[]'::jsonb,  -- [{title, img_url}]
  subdomain     text unique not null,       -- slug derived from full_name
  created_at    timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Public can read all portfolios
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Allow server-side inserts (via service role key — bypasses RLS)
create policy "Service role can insert"
  on profiles for insert
  with check (true);

create policy "Service role can update"
  on profiles for update
  using (true);

-- Index for fast subdomain lookups
create index if not exists profiles_subdomain_idx on profiles (subdomain);
