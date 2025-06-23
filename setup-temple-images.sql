-- Script per creare la tabella temple_images e le policies necessarie
-- Eseguire questo script nel database Supabase prima di utilizzare lo script di estrazione

-- Crea la tabella temple_images
CREATE TABLE IF NOT EXISTS temple_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_url TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  alt_text TEXT,
  category VARCHAR(100),
  page_section VARCHAR(100) DEFAULT 'chi-siamo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commenti per documentare la tabella
COMMENT ON TABLE temple_images IS 'Tabella per memorizzare le immagini del tempio estratte dal sito originale';
COMMENT ON COLUMN temple_images.filename IS 'Nome del file originale';
COMMENT ON COLUMN temple_images.original_url IS 'URL originale dal sito bodhidharma.info';
COMMENT ON COLUMN temple_images.storage_url IS 'URL pubblico nel Supabase Storage';
COMMENT ON COLUMN temple_images.alt_text IS 'Testo alternativo per l\'immagine';
COMMENT ON COLUMN temple_images.category IS 'Categoria: maestri, tempio, sale, esterni, etc.';
COMMENT ON COLUMN temple_images.page_section IS 'Sezione del sito: chi-siamo, home, blog, etc.';

-- Abilita Row Level Security
ALTER TABLE temple_images ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica (tutti possono leggere le immagini)
CREATE POLICY IF NOT EXISTS "temple_images_select_policy" 
ON temple_images FOR SELECT 
USING (true);

-- Policy per inserimento (solo utenti autenticati possono inserire)
CREATE POLICY IF NOT EXISTS "temple_images_insert_policy" 
ON temple_images FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy per aggiornamento (solo utenti autenticati possono aggiornare)
CREATE POLICY IF NOT EXISTS "temple_images_update_policy" 
ON temple_images FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy per eliminazione (solo utenti autenticati possono eliminare)
CREATE POLICY IF NOT EXISTS "temple_images_delete_policy" 
ON temple_images FOR DELETE 
USING (auth.role() = 'authenticated');

-- Funzione per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION update_temple_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per aggiornare updated_at su UPDATE
DROP TRIGGER IF EXISTS temple_images_updated_at_trigger ON temple_images;
CREATE TRIGGER temple_images_updated_at_trigger
  BEFORE UPDATE ON temple_images
  FOR EACH ROW
  EXECUTE FUNCTION update_temple_images_updated_at();

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_temple_images_category ON temple_images(category);
CREATE INDEX IF NOT EXISTS idx_temple_images_page_section ON temple_images(page_section);
CREATE INDEX IF NOT EXISTS idx_temple_images_created_at ON temple_images(created_at);

-- Creare il bucket 'images' nel Storage (se non esiste già)
-- Questo comando deve essere eseguito manualmente nella console Supabase Storage
-- oppure tramite l'API di gestione

-- Grant per permettere l'accesso al bucket storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT DO NOTHING;

-- Policy per il bucket images (lettura pubblica)
-- CREATE POLICY "Give users access to own folder" ON storage.objects FOR SELECT USING (bucket_id = 'images');
-- CREATE POLICY "Give users access to insert in own folder" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

COMMIT; 