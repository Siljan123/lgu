-- 0. Schema Setup & Permissions
CREATE SCHEMA IF NOT EXISTS barangay_directory;
GRANT USAGE ON SCHEMA barangay_directory TO anon, authenticated, service_role;

-- 1. Classification Enum
DO $$ BEGIN
    CREATE TYPE barangay_directory.classification AS ENUM ('Poblacion', 'Urban', 'Rural');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Position Table
CREATE TABLE IF NOT EXISTS barangay_directory.position (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    rank_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Barangay Table (UUID PK)
CREATE TABLE IF NOT EXISTS barangay_directory.barangay (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    classification barangay_directory.classification NOT NULL,
    postal_code TEXT NOT NULL,
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

-- 4. Elected Officials Table (with parent_id hierarchy)
CREATE TABLE IF NOT EXISTS barangay_directory.elected_officials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barangay_id UUID NOT NULL REFERENCES barangay_directory.barangay(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES barangay_directory.elected_officials(id) ON DELETE SET NULL,
    position_id UUID REFERENCES barangay_directory.position(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    committee TEXT,
    avatar_url TEXT,
    contact TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Barangay Landmark Table
CREATE TABLE IF NOT EXISTS barangay_directory.barangay_landmark (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barangay_id UUID NOT NULL REFERENCES barangay_directory.barangay(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_barangay_classification ON barangay_directory.barangay(classification);
CREATE INDEX IF NOT EXISTS idx_elected_officials_barangay_id ON barangay_directory.elected_officials(barangay_id);
CREATE INDEX IF NOT EXISTS idx_elected_officials_parent_id ON barangay_directory.elected_officials(parent_id);
CREATE INDEX IF NOT EXISTS idx_elected_officials_position_id ON barangay_directory.elected_officials(position_id);
CREATE INDEX IF NOT EXISTS idx_barangay_landmark_barangay_id ON barangay_directory.barangay_landmark(barangay_id);
CREATE INDEX IF NOT EXISTS idx_barangay_landmark_category ON barangay_directory.barangay_landmark(category);

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

DROP TRIGGER IF EXISTS set_elected_officials_updated_at ON barangay_directory.elected_officials;
CREATE TRIGGER set_elected_officials_updated_at
    BEFORE UPDATE ON barangay_directory.elected_officials
    FOR EACH ROW EXECUTE FUNCTION barangay_directory.handle_updated_at();

DROP TRIGGER IF EXISTS set_barangay_landmark_updated_at ON barangay_directory.barangay_landmark;
CREATE TRIGGER set_barangay_landmark_updated_at
    BEFORE UPDATE ON barangay_directory.barangay_landmark
    FOR EACH ROW EXECUTE FUNCTION barangay_directory.handle_updated_at();

-- 8. Row Level Security (RLS)
ALTER TABLE barangay_directory.position ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangay_directory.barangay ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangay_directory.elected_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangay_directory.barangay_landmark ENABLE ROW LEVEL SECURITY;

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

    -- elected_officials
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'elected_officials' AND policyname = 'Allow public read-only access on elected_officials') THEN
        CREATE POLICY "Allow public read-only access on elected_officials" ON barangay_directory.elected_officials FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'elected_officials' AND policyname = 'Allow authenticated users full access on elected_officials') THEN
        CREATE POLICY "Allow authenticated users full access on elected_officials" ON barangay_directory.elected_officials FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    -- barangay_landmark
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'barangay_landmark' AND policyname = 'Allow public read-only access on barangay_landmark') THEN
        CREATE POLICY "Allow public read-only access on barangay_landmark" ON barangay_directory.barangay_landmark FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'barangay_directory' AND tablename = 'barangay_landmark' AND policyname = 'Allow authenticated users full access on barangay_landmark') THEN
        CREATE POLICY "Allow authenticated users full access on barangay_landmark" ON barangay_directory.barangay_landmark FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 9. Convenience View (with security_invoker to respect RLS)
CREATE OR REPLACE VIEW barangay_directory.v_elected_officials 
WITH (security_invoker = true) AS
SELECT
    eo.id,
    eo.barangay_id,
    b.name AS barangay_name,
    eo.parent_id,
    eo.name,
    p.title,
    eo.committee,
    eo.avatar_url AS avatar,
    eo.contact,
    eo.order_index
FROM barangay_directory.elected_officials eo
JOIN barangay_directory.barangay b ON eo.barangay_id = b.id
LEFT JOIN barangay_directory.position p ON eo.position_id = p.id
ORDER BY b.name ASC, eo.order_index ASC;

-- 10. Table & View Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA barangay_directory TO authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA barangay_directory TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA barangay_directory TO anon, authenticated, service_role;

GRANT ALL ON TABLE barangay_directory.elected_officials TO anon, authenticated, service_role;
GRANT ALL ON TABLE barangay_directory.position TO anon, authenticated, service_role;
GRANT ALL ON TABLE barangay_directory.barangay TO anon, authenticated, service_role;
GRANT ALL ON TABLE barangay_directory.barangay_landmark TO anon, authenticated, service_role;
GRANT SELECT ON barangay_directory.v_elected_officials TO anon, authenticated, service_role;