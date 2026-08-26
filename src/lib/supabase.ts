import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('[Supabase] Initialized Supabase PostgreSQL client at:', supabaseUrl);
    } catch (err) {
      console.error('[Supabase] Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- VELORA LABS SUPABASE POSTGRESQL SCHEMA & TABLES
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  client_name TEXT,
  client_logo TEXT,
  category TEXT NOT NULL DEFAULT 'website',
  sub_category TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  cover_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  challenge TEXT,
  solution TEXT,
  results JSONB DEFAULT '[]'::jsonb,
  external_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  seo_title TEXT,
  seo_description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  testimonial JSONB DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Clients & Partners Table
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  description TEXT,
  category TEXT DEFAULT 'client',
  relationship_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  seo_title TEXT,
  seo_description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  testimonial JSONB DEFAULT '{}'::jsonb,
  linked_project_slugs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Team Members Table
CREATE TABLE IF NOT EXISTS public.team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialty TEXT,
  bio TEXT,
  avatar TEXT,
  experience TEXT,
  display_order INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT true,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_github TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inquiries & Client RFPs Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site Configuration Table
CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Idempotent Security Policies
DROP POLICY IF EXISTS "Public projects read access" ON public.projects;
CREATE POLICY "Public projects read access" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public clients read access" ON public.clients;
CREATE POLICY "Public clients read access" ON public.clients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public team read access" ON public.team;
CREATE POLICY "Public team read access" ON public.team FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on projects" ON public.projects;
CREATE POLICY "Full access for service role on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on clients" ON public.clients;
CREATE POLICY "Full access for service role on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on team" ON public.team;
CREATE POLICY "Full access for service role on team" ON public.team FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on inquiries" ON public.inquiries;
CREATE POLICY "Full access for service role on inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
`;
