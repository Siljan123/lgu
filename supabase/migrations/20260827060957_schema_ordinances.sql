-- 1. Create Enums (Idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
        CREATE TYPE document_type AS ENUM ('ordinance', 'executive_order', 'resolution');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
        CREATE TYPE document_status AS ENUM ('active', 'repealed', 'amended', 'draft');
    END IF;
END $$;

-- 2. Create Legal Documents Table
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type document_type NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL,
    date_issued DATE NOT NULL,      
    status document_status DEFAULT 'active',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Indexes for Filtering and Performance
CREATE INDEX IF NOT EXISTS idx_legal_documents_type ON public.legal_documents (type);
CREATE INDEX IF NOT EXISTS idx_legal_documents_status ON public.legal_documents (status);
CREATE INDEX IF NOT EXISTS idx_legal_documents_date_issued ON public.legal_documents (date_issued DESC);
CREATE INDEX IF NOT EXISTS idx_legal_documents_doc_number ON public.legal_documents (document_number);
CREATE INDEX IF NOT EXISTS idx_legal_documents_tags ON public.legal_documents USING GIN (tags);

-- 4. Auto-Update Timestamp Function and Trigger
CREATE OR REPLACE FUNCTION public.handle_legal_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_legal_documents_updated_at ON public.legal_documents;
CREATE TRIGGER set_legal_documents_updated_at
    BEFORE UPDATE ON public.legal_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_legal_documents_updated_at();

-- 5. Row Level Security (RLS)
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'legal_documents' AND policyname = 'Allow public read access to legal documents') THEN
        CREATE POLICY "Allow public read access to legal documents" 
        ON public.legal_documents FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'legal_documents' AND policyname = 'Allow authenticated users full access to legal documents') THEN
        CREATE POLICY "Allow authenticated users full access to legal documents" 
        ON public.legal_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

GRANT ALL ON TABLE public.legal_documents TO anon, authenticated, service_role;

-- 6. Storage Bucket for Legal Document PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('legal-documents', 'legal-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access on legal-documents bucket
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access Legal Documents') THEN
        CREATE POLICY "Public Access Legal Documents" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'legal-documents');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Service Role Upload Legal Documents') THEN
        CREATE POLICY "Service Role Upload Legal Documents" 
        ON storage.objects FOR ALL 
        TO service_role 
        USING (bucket_id = 'legal-documents') 
        WITH CHECK (bucket_id = 'legal-documents');
    END IF;
END $$;

