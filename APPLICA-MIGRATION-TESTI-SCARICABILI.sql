-- ============================================
-- MIGRATION: Crea Tabella downloadable_texts
-- ============================================
-- ISTRUZIONI:
-- 1. Vai su https://supabase.com/dashboard
-- 2. Seleziona il progetto
-- 3. Vai su SQL Editor
-- 4. Copia e incolla TUTTO questo file
-- 5. Clicca "Run" o premi Cmd/Ctrl+Enter
-- ============================================

-- Create downloadable_texts table
CREATE TABLE IF NOT EXISTS public.downloadable_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  category TEXT,
  language TEXT DEFAULT 'it',
  tags TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  file_url TEXT NOT NULL,
  file_format TEXT NOT NULL CHECK (file_format IN ('pdf', 'epub', 'mobi', 'zip')),
  file_size BIGINT,
  file_hash TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.downloadable_texts ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_downloadable_texts_slug ON public.downloadable_texts(slug);
CREATE INDEX IF NOT EXISTS idx_downloadable_texts_published ON public.downloadable_texts(published, published_at);
CREATE INDEX IF NOT EXISTS idx_downloadable_texts_category ON public.downloadable_texts(category);
CREATE INDEX IF NOT EXISTS idx_downloadable_texts_language ON public.downloadable_texts(language);
CREATE INDEX IF NOT EXISTS idx_downloadable_texts_tags ON public.downloadable_texts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_downloadable_texts_sort_order ON public.downloadable_texts(sort_order, created_at);

-- Policies for downloadable_texts
-- Public can view only published texts
CREATE POLICY "Public can view published texts"
ON public.downloadable_texts
FOR SELECT
TO public
USING (published = true);

-- Authenticated users (admins) can view all
CREATE POLICY "Admins can view all texts"
ON public.downloadable_texts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Only admins can insert
CREATE POLICY "Admins can insert texts"
ON public.downloadable_texts
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Only admins can update
CREATE POLICY "Admins can update texts"
ON public.downloadable_texts
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Only admins can delete
CREATE POLICY "Admins can delete texts"
ON public.downloadable_texts
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Trigger for updated_at (verifica che la funzione esista)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

CREATE TRIGGER update_downloadable_texts_updated_at
BEFORE UPDATE ON public.downloadable_texts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[àáâãäå]', 'a', 'gi'),
        '[èéêë]', 'e', 'gi'
      ),
      '[^a-z0-9]+', '-', 'gi'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica che la tabella sia stata creata
SELECT 
  '✅ Tabella downloadable_texts creata con successo!' as risultato,
  COUNT(*) as numero_righe
FROM public.downloadable_texts;
