# Supabase Setup Guide & Database Schema

## Overview
This platform includes a dual-mode authentication architecture:
1. **Smart Demo Mode (Default)**: Fully functional mock authentication and prefilled roles (`Student`, `Faculty`, `Admin`) designed for hackathon demonstrations without any setup hurdles.
2. **Cloud Supabase Mode**: Production-grade authentication connecting directly to your Supabase PostgreSQL instance.

---

## 1. Supabase SQL Schema (Run in Supabase SQL Editor)

Copy and execute the following SQL script in your Supabase Dashboard (**SQL Editor** -> **New Query**):

```sql
-- Create student_profiles table linked to auth.users
create table public.student_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null unique,
  college_name text not null,
  department text not null check (department in ('CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil', 'Other')),
  study_year text not null check (study_year in ('1st Year', '2nd Year', '3rd Year', '4th Year')),
  student_id text not null unique,
  cgpa numeric(3, 2) default 7.50,
  attendance_pct numeric(4, 1) default 85.0,
  success_score integer default 80,
  placement_readiness_pct numeric(4, 1) default 75.0,
  risk_classification text default 'Safe' check (risk_classification in ('Safe', 'Academic Risk', 'Placement Risk', 'Critical')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.student_profiles enable row level security;

-- Policy 1: Students can read their own profile
create policy "Students can view own profile"
  on public.student_profiles for select
  using (auth.uid() = id);

-- Policy 2: Students can update their own profile
create policy "Students can update own profile"
  on public.student_profiles for update
  using (auth.uid() = id);

-- Policy 3: Allow authenticated service or users to insert their profile upon registration
create policy "Users can insert own profile"
  on public.student_profiles for insert
  with check (auth.uid() = id);

-- Trigger to automatically create student_profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.student_profiles (
    id,
    full_name,
    email,
    college_name,
    department,
    study_year,
    student_id
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'college_name', 'Campus Institute'),
    coalesce(new.raw_user_meta_data->>'department', 'CSE'),
    coalesce(new.raw_user_meta_data->>'study_year', '4th Year'),
    coalesce(new.raw_user_meta_data->>'student_id', 'ID-' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 2. Connecting Supabase in the Frontend

1. In the web interface, click the **Auth Config** button in the top navbar.
2. Enter:
   - **Project URL**: e.g., `https://your-project.supabase.co`
   - **Public Anon Key**: Found in **Supabase Dashboard** -> **Project Settings** -> **API** -> `anon` public key.
3. Click **Save & Connect Supabase**.
4. All future sign-ups and sign-ins will now execute against your live cloud database!

> [!NOTE]
> Never expose your `service_role` secret key on the frontend. Only use the public `anon` key.
