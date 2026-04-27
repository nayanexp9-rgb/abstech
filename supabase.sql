-- ========================================================
-- ADVANCED SUPABASE SCHEMA WITH RLS FOR CMS
-- ========================================================

-- 1. Create Tables
-- --------------------------------------------------------

-- Table for generic CMS objects (Hero, Navbar, Contact)
CREATE TABLE IF NOT EXISTS public.cms_general (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Services
CREATE TABLE IF NOT EXISTS public.cms_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "iconName" TEXT,
  "desc" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Categories
CREATE TABLE IF NOT EXISTS public.cms_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT,
  "desc" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Products/Items
CREATE TABLE IF NOT EXISTS public.cms_products (
  id TEXT PRIMARY KEY,
  "categoryId" TEXT REFERENCES cms_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price TEXT,
  image TEXT,
  "desc" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Media Files
CREATE TABLE IF NOT EXISTS public.media_files (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service TEXT,
  address TEXT,
  date TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Clients/Partners
CREATE TABLE IF NOT EXISTS public.cms_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  works TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Initial Data seeding for cms_general
-- --------------------------------------------------------
-- Note: 'site_title' is inside the JSONB 'data' block.
INSERT INTO public.cms_general (id, data) VALUES 
('hero', '{"title": "Secure Your \\nInfrastructure.", "bgImage": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=2000&q=80", "btnLink": "/#services", "btnText": "Contact Sales", "subtitle": "High-standard tech maintenance, security systems, and infrastructure management across Bangladesh."}'),
('navbar', '{"siteName": "ABS Tech.", "logoImage": ""}'),
('contact', '{"email": "absultrabd@gmail.com", "phone": "+880 1718604464", "address": "Corporate: Banasree, Dhaka 1219\nHubs: Dhaka, Khulna, Chattogram", "footerText": "Technology Dependent Bangladesh is our vision. Excellence in maintenance and deployment."}')
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;


-- 3. Row Level Security (RLS) Policies
-- --------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.cms_general ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to fix "policy already exists" error)
DROP POLICY IF EXISTS "Public can read cms_general" ON public.cms_general;
DROP POLICY IF EXISTS "Authenticated can modify cms_general" ON public.cms_general;

DROP POLICY IF EXISTS "Public can read cms_services" ON public.cms_services;
DROP POLICY IF EXISTS "Authenticated can modify cms_services" ON public.cms_services;

DROP POLICY IF EXISTS "Public can read cms_categories" ON public.cms_categories;
DROP POLICY IF EXISTS "Authenticated can modify cms_categories" ON public.cms_categories;

DROP POLICY IF EXISTS "Public can read cms_products" ON public.cms_products;
DROP POLICY IF EXISTS "Authenticated can modify cms_products" ON public.cms_products;

DROP POLICY IF EXISTS "Public can insert quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated can manage quotes" ON public.quotes;

DROP POLICY IF EXISTS "Public can read media_files" ON public.media_files;
DROP POLICY IF EXISTS "Authenticated can modify media_files" ON public.media_files;

-- Create Policies

-- CMS General (Everyone reads, Admin writes)
CREATE POLICY "Public can read cms_general" 
  ON public.cms_general FOR SELECT USING (true);
CREATE POLICY "Authenticated can modify cms_general" 
  ON public.cms_general USING (auth.role() = 'authenticated');

-- Services
CREATE POLICY "Public can read cms_services" 
  ON public.cms_services FOR SELECT USING (true);
CREATE POLICY "Authenticated can modify cms_services" 
  ON public.cms_services USING (auth.role() = 'authenticated');

-- Categories
CREATE POLICY "Public can read cms_categories" 
  ON public.cms_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated can modify cms_categories" 
  ON public.cms_categories USING (auth.role() = 'authenticated');

-- Products
CREATE POLICY "Public can read cms_products" 
  ON public.cms_products FOR SELECT USING (true);
CREATE POLICY "Authenticated can modify cms_products" 
  ON public.cms_products USING (auth.role() = 'authenticated');

-- Media Files
CREATE POLICY "Public can read media_files" 
  ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Authenticated can modify media_files" 
  ON public.media_files USING (auth.role() = 'authenticated');

-- Quotes (Public can insert, Admin can read/manage)
CREATE POLICY "Public can insert quotes" 
  ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can manage quotes" 
  ON public.quotes USING (auth.role() = 'authenticated');

-- Clients
CREATE POLICY "Public can read cms_clients" 
  ON public.cms_clients FOR SELECT USING (true);
CREATE POLICY "Authenticated can modify cms_clients" 
  ON public.cms_clients USING (auth.role() = 'authenticated');

-- 4. Enable Realtime Replication
-- --------------------------------------------------------
-- You still need to go to Supabase Dashboard -> Database -> Replication 
-- and enable replication for these tables, but this triggers standard setup.
begin;
  -- remove the supabase_realtime publication if it already exists, to reset it
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.cms_general;
alter publication supabase_realtime add table public.cms_services;
alter publication supabase_realtime add table public.cms_categories;
alter publication supabase_realtime add table public.cms_products;
alter publication supabase_realtime add table public.quotes;
alter publication supabase_realtime add table public.cms_clients;