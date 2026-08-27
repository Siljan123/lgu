-- =====================================================================
-- Barangay Directory: Full Schema (combined)
-- ---------------------------------------------------------------------
-- Combines what were previously three separate migrations:
--   1) schema_barangay_directory  (schema, position, barangay, elected_officials)
--   2) schema_org_chart / term    (shared elected-official terms)
--   3) position_category          (structured position role classification)
-- Safe to run on a fresh `supabase db reset` -- replaces those three
-- migration files. Delete the old ones once this is in place.
-- =====================================================================

-- 0. Schema Setup & Permissions
CREATE SCHEMA IF NOT EXISTS barangay_directory;
GRANT USAGE ON SCHEMA barangay_directory TO anon, authenticated, service_role;

-- 1. Enums
DO $$ BEGIN
    CREATE TYPE barangay_directory.classification AS ENUM ('Urban', 'Rural');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE barangay_directory.position_category AS ENUM (
        'captain', 'secretary', 'treasurer', 'sk_chairperson', 'kagawad', 'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Position Table
CREATE TABLE IF NOT EXISTS barangay_directory.position (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    rank_order INT DEFAULT 0 NOT NULL,
    position_category barangay_directory.position_category NOT NULL DEFAULT 'other',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Barangay Table
CREATE TABLE IF NOT EXISTS barangay_directory.barangay (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    classification barangay_directory.classification NOT NULL,
    postal_code TEXT DEFAULT '8506',
    population INT NOT NULL,
    census_year TEXT NOT NULL,
    elevation_asl TEXT NOT NULL,
    elevation_meters NUMERIC NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    coordinates_display TEXT NOT NULL,
    land_area_sq_km NUMERIC NOT NULL,
    hall_address TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    map_embed_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Term Table (shared across all barangays)
CREATE TABLE IF NOT EXISTS barangay_directory.term (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL UNIQUE,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_term_single_current
    ON barangay_directory.term (is_current)
    WHERE is_current;

CREATE INDEX IF NOT EXISTS idx_term_ordering
    ON barangay_directory.term (is_current DESC, start_date DESC);

-- 5. Elected Officials Table (parent_id hierarchy + position + term)
CREATE TABLE IF NOT EXISTS barangay_directory.elected_officials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barangay_id UUID NOT NULL REFERENCES barangay_directory.barangay(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES barangay_directory.elected_officials(id) ON DELETE SET NULL,
    position_id UUID REFERENCES barangay_directory.position(id) ON DELETE SET NULL,
    term_id UUID REFERENCES barangay_directory.term(id) ON DELETE CASCADE,
    is_label BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    name TEXT NOT NULL,
    committee TEXT,
    avatar_url TEXT,
    contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Drop legacy table if it previously existed
DROP TABLE IF EXISTS barangay_directory.barangay_landmark CASCADE;

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_barangay_classification ON barangay_directory.barangay(classification);
CREATE INDEX IF NOT EXISTS idx_position_category ON barangay_directory.position(position_category);
CREATE INDEX IF NOT EXISTS idx_elected_officials_barangay_id ON barangay_directory.elected_officials(barangay_id);
CREATE INDEX IF NOT EXISTS idx_elected_officials_parent_id ON barangay_directory.elected_officials(parent_id);
CREATE INDEX IF NOT EXISTS idx_elected_officials_sibling_order ON barangay_directory.elected_officials(parent_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_elected_officials_position_id ON barangay_directory.elected_officials(position_id);
CREATE INDEX IF NOT EXISTS idx_elected_officials_term_id ON barangay_directory.elected_officials(term_id);
CREATE INDEX IF NOT EXISTS idx_elected_officials_barangay_term ON barangay_directory.elected_officials(barangay_id, term_id);

-- 7. Auto-Update Timestamp Function and Triggers
CREATE OR REPLACE FUNCTION barangay_directory.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_position_updated_at ON barangay_directory.position;
CREATE TRIGGER set_position_updated_at
    BEFORE UPDATE ON barangay_directory.position
    FOR EACH ROW EXECUTE FUNCTION barangay_directory.handle_updated_at();

DROP TRIGGER IF EXISTS set_barangay_updated_at ON barangay_directory.barangay;
CREATE TRIGGER set_barangay_updated_at
    BEFORE UPDATE ON barangay_directory.barangay
    FOR EACH ROW EXECUTE FUNCTION barangay_directory.handle_updated_at();

DROP TRIGGER IF EXISTS set_term_updated_at ON barangay_directory.term;
CREATE TRIGGER set_term_updated_at
    BEFORE UPDATE ON barangay_directory.term
    FOR EACH ROW EXECUTE FUNCTION barangay_directory.handle_updated_at();

DROP TRIGGER IF EXISTS set_elected_officials_updated_at ON barangay_directory.elected_officials;
CREATE TRIGGER set_elected_officials_updated_at
    BEFORE UPDATE ON barangay_directory.elected_officials
    FOR EACH ROW EXECUTE FUNCTION barangay_directory.handle_updated_at();

-- 8. Row Level Security (RLS)
ALTER TABLE barangay_directory.position ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangay_directory.barangay ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangay_directory.term ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangay_directory.elected_officials ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- position
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'position' AND policyname = 'Allow public read-only access on position') THEN
        CREATE POLICY "Allow public read-only access on position" ON barangay_directory.position FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'position' AND policyname = 'Allow authenticated users full access on position') THEN
        CREATE POLICY "Allow authenticated users full access on position" ON barangay_directory.position FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    -- barangay
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'barangay' AND policyname = 'Allow public read-only access on barangay') THEN
        CREATE POLICY "Allow public read-only access on barangay" ON barangay_directory.barangay FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'barangay' AND policyname = 'Allow authenticated users full access on barangay') THEN
        CREATE POLICY "Allow authenticated users full access on barangay" ON barangay_directory.barangay FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    -- term
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'term' AND policyname = 'Allow public read-only access on term') THEN
        CREATE POLICY "Allow public read-only access on term" ON barangay_directory.term FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'term' AND policyname = 'Allow authenticated users full access on term') THEN
        CREATE POLICY "Allow authenticated users full access on term" ON barangay_directory.term FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    -- elected_officials
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'elected_officials' AND policyname = 'Allow public read-only access on elected_officials') THEN
        CREATE POLICY "Allow public read-only access on elected_officials" ON barangay_directory.elected_officials FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'elected_officials' AND policyname = 'Allow authenticated users full access on elected_officials') THEN
        CREATE POLICY "Allow authenticated users full access on elected_officials" ON barangay_directory.elected_officials FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 9. Convenience View (single definition, all columns, respects RLS)
CREATE OR REPLACE VIEW barangay_directory.v_elected_officials
WITH (security_invoker = true) AS
SELECT
    eo.id,
    eo.barangay_id,
    b.name AS barangay_name,
    eo.parent_id,
    eo.name,
    p.title,
    p.position_category,
    eo.committee,
    eo.avatar_url AS _url,
    eo.contact,
    eo.is_label,
    eo.sort_order,
    eo.term_id,
    t.label AS term_label,
    t.is_current AS term_is_current
FROM barangay_directory.elected_officials eo
JOIN barangay_directory.barangay b ON eo.barangay_id = b.id
LEFT JOIN barangay_directory.position p ON eo.position_id = p.id
LEFT JOIN barangay_directory.term t ON eo.term_id = t.id
ORDER BY b.name ASC, eo.sort_order ASC, eo.name ASC;

-- 10. Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA barangay_directory TO authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA barangay_directory TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA barangay_directory TO anon, authenticated, service_role;

GRANT ALL ON TABLE barangay_directory.position TO anon, authenticated, service_role;
GRANT ALL ON TABLE barangay_directory.barangay TO anon, authenticated, service_role;
GRANT ALL ON TABLE barangay_directory.term TO anon, authenticated, service_role;
GRANT ALL ON TABLE barangay_directory.elected_officials TO anon, authenticated, service_role;
GRANT SELECT ON barangay_directory.v_elected_officials TO anon, authenticated, service_role;