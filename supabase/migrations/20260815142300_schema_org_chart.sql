-- Organization Structure Database Migration Schema
-- Supabase Postgres Best Practices Implementation

-- 0. Schema
CREATE SCHEMA IF NOT EXISTS governance;
GRANT USAGE ON SCHEMA governance TO anon, authenticated, service_role;

-- 1. Departments Table
-- A department row is one NODE of the organizational chart.
-- is_label = FALSE (default) -> a real office / department (person card rendered from governance.employees)
-- is_label = TRUE            -> a position / section LABEL only (e.g. "Division Chief"), grouping the
--                               offices beneath it. Label nodes carry no employee row; the children
--                               placed directly under them inherit the label's title.
CREATE TABLE IF NOT EXISTS governance.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(50),
    description TEXT NULL,
    parent_id UUID REFERENCES governance.departments(id) ON DELETE CASCADE,
    is_label BOOLEAN DEFAULT FALSE NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure is_label exists even if departments was created by an earlier migration run
ALTER TABLE governance.departments
ADD COLUMN IF NOT EXISTS is_label BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. Positions Table
CREATE TABLE IF NOT EXISTS governance.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Employees Table
-- NOTE: node kind (label vs office) lives on governance.departments.is_label — NOT here.
-- Employees are only the card contents of a non-label department node.
CREATE TABLE IF NOT EXISTS governance.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) DEFAULT '',
    last_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    contact VARCHAR(255),
    position_id UUID REFERENCES governance.positions(id) ON DELETE SET NULL,
    department_id UUID REFERENCES governance.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop the short-lived employees.is_label column: node kind is a property of the
-- department node, so keeping a copy here would create two sources of truth.
ALTER TABLE governance.employees
DROP COLUMN IF EXISTS is_label;

-- Foreign Key Performance Indexes (Query Optimization)
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON governance.departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_departments_is_label ON governance.departments(is_label);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON governance.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position_id ON governance.employees(position_id);

-- Enable Row Level Security (RLS)
ALTER TABLE governance.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance.employees ENABLE ROW LEVEL SECURITY;

-- Row Level Security (RLS) Policies — Departments
DROP POLICY IF EXISTS "Allow public read departments" ON governance.departments;
DROP POLICY IF EXISTS "Allow public insert departments" ON governance.departments;
DROP POLICY IF EXISTS "Allow public update departments" ON governance.departments;
DROP POLICY IF EXISTS "Allow public delete departments" ON governance.departments;

CREATE POLICY "Allow public read departments" ON governance.departments FOR SELECT USING (true);
CREATE POLICY "Allow public insert departments" ON governance.departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update departments" ON governance.departments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete departments" ON governance.departments FOR DELETE USING (true);

-- Row Level Security (RLS) Policies — Positions
DROP POLICY IF EXISTS "Allow public read positions" ON governance.positions;
DROP POLICY IF EXISTS "Allow public insert positions" ON governance.positions;
DROP POLICY IF EXISTS "Allow public update positions" ON governance.positions;
DROP POLICY IF EXISTS "Allow public delete positions" ON governance.positions;

CREATE POLICY "Allow public read positions" ON governance.positions FOR SELECT USING (true);
CREATE POLICY "Allow public insert positions" ON governance.positions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update positions" ON governance.positions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete positions" ON governance.positions FOR DELETE USING (true);

-- Row Level Security (RLS) Policies — Employees
DROP POLICY IF EXISTS "Allow public read employees" ON governance.employees;
DROP POLICY IF EXISTS "Allow public insert employees" ON governance.employees;
DROP POLICY IF EXISTS "Allow public update employees" ON governance.employees;
DROP POLICY IF EXISTS "Allow public delete employees" ON governance.employees;

CREATE POLICY "Allow public read employees" ON governance.employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert employees" ON governance.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update employees" ON governance.employees FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete employees" ON governance.employees FOR DELETE USING (true);

-- Table & sequence grants
GRANT ALL ON TABLE governance.departments TO anon, authenticated, service_role;
GRANT ALL ON TABLE governance.positions TO anon, authenticated, service_role;
GRANT ALL ON TABLE governance.employees TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA governance TO anon, authenticated, service_role;