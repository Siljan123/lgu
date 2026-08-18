-- Organization Structure Database Migration Schema
-- Supabase Postgres Best Practices Implementation

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(50),
    description TEXT NULL,
    parent_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Positions Table
CREATE TABLE IF NOT EXISTS public.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) DEFAULT '',
    last_name VARCHAR(255) NOT NULL,
    image_url TEXT,
    contact VARCHAR(255),
    position_id UUID REFERENCES public.positions(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign Key Performance Indexes (Query Optimization)
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON public.departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position_id ON public.employees(position_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Row Level Security (RLS) Policies
DROP POLICY IF EXISTS "Allow public read departments" ON public.departments;
DROP POLICY IF EXISTS "Allow public insert departments" ON public.departments;
DROP POLICY IF EXISTS "Allow public update departments" ON public.departments;
DROP POLICY IF EXISTS "Allow public delete departments" ON public.departments;

CREATE POLICY "Allow public read departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Allow public insert departments" ON public.departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update departments" ON public.departments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete departments" ON public.departments FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read positions" ON public.positions;
DROP POLICY IF EXISTS "Allow public insert positions" ON public.positions;
DROP POLICY IF EXISTS "Allow public update positions" ON public.positions;
DROP POLICY IF EXISTS "Allow public delete positions" ON public.positions;

CREATE POLICY "Allow public read positions" ON public.positions FOR SELECT USING (true);
CREATE POLICY "Allow public insert positions" ON public.positions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update positions" ON public.positions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete positions" ON public.positions FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public insert employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public update employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public delete employees" ON public.employees;

CREATE POLICY "Allow public read employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert employees" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update employees" ON public.employees FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete employees" ON public.employees FOR DELETE USING (true);

GRANT ALL ON TABLE public.departments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.positions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.employees TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

