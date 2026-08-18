-- 0. Schema
CREATE SCHEMA IF NOT EXISTS governance;
GRANT USAGE ON SCHEMA governance TO anon, authenticated, service_role;

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Positions Table
CREATE TABLE IF NOT EXISTS governance.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    rank_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ensure rank_order exists even if an earlier migration created positions
ALTER TABLE governance.positions 
ADD COLUMN IF NOT EXISTS rank_order INT DEFAULT 0 NOT NULL;

-- 3. Officials Table
CREATE TABLE IF NOT EXISTS governance.officials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) DEFAULT '',
    last_name VARCHAR(255) NOT NULL,
    image_url TEXT,
    contact VARCHAR(255),
    position_id UUID REFERENCES governance.positions(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES governance.officials(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ensure parent_id exists even if officials was created prior
ALTER TABLE governance.officials 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES governance.officials(id) ON DELETE SET NULL;

-- 4. Foreign Key and Query Indexes
CREATE INDEX IF NOT EXISTS idx_positions_rank_order ON governance.positions (rank_order);
CREATE INDEX IF NOT EXISTS idx_officials_position_id ON governance.officials (position_id);
CREATE INDEX IF NOT EXISTS idx_officials_parent_id ON governance.officials (parent_id);

-- 5. Auto-Update Timestamp Function and Triggers
CREATE OR REPLACE FUNCTION governance.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_positions_updated_at ON governance.positions;
CREATE TRIGGER set_positions_updated_at
    BEFORE UPDATE ON governance.positions
    FOR EACH ROW
    EXECUTE FUNCTION governance.handle_updated_at();

DROP TRIGGER IF EXISTS set_officials_updated_at ON governance.officials;
CREATE TRIGGER set_officials_updated_at
    BEFORE UPDATE ON governance.officials
    FOR EACH ROW
    EXECUTE FUNCTION governance.handle_updated_at();

-- 6. Row Level Security (RLS)
ALTER TABLE governance.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance.officials ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'governance' AND policyname = 'Allow public read-only access on positions') THEN
        CREATE POLICY "Allow public read-only access on positions" ON governance.positions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'governance' AND policyname = 'Allow public read-only access on officials') THEN
        CREATE POLICY "Allow public read-only access on officials" ON governance.officials FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'governance' AND policyname = 'Allow authenticated users full access on positions') THEN
        CREATE POLICY "Allow authenticated users full access on positions" ON governance.positions FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'governance' AND policyname = 'Allow authenticated users full access on officials') THEN
        CREATE POLICY "Allow authenticated users full access on officials" ON governance.officials FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 7. SQL View Formatted for OrgChart-Vue
CREATE OR REPLACE VIEW governance.v_orgchart_officials AS
SELECT 
    o.id,
    o.parent_id,
    TRIM(
      o.first_name || ' ' || 
      CASE WHEN o.middle_name IS NOT NULL AND o.middle_name <> '' THEN o.middle_name || ' ' ELSE '' END || 
      o.last_name
    ) AS name,
    p.title AS title,
    o.image_url,
    o.contact,
    COALESCE(p.rank_order, 999) AS rank_order
FROM governance.officials o
LEFT JOIN governance.positions p ON o.position_id = p.id
ORDER BY rank_order ASC, o.last_name ASC;

GRANT ALL ON TABLE governance.officials TO anon, authenticated, service_role;
GRANT ALL ON TABLE governance.positions TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA governance TO anon, authenticated, service_role;
GRANT SELECT ON governance.v_orgchart_officials TO anon, authenticated, service_role;

-- Create a public bucket for officials' image profiles or avatar
INSERT INTO storage.buckets (id, name, public)
VALUES ('officials', 'officials', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public access policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'officials');

DROP POLICY IF EXISTS "Service Role Upload Access" ON storage.objects;
CREATE POLICY "Service Role Upload Access" 
ON storage.objects FOR ALL 
TO service_role 
USING (bucket_id = 'officials') 
WITH CHECK (bucket_id = 'officials');