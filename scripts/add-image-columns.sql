-- =====================================================
-- AGGIUNTA COLONNE IMMAGINI ALLA TABELLA POSTS
-- =====================================================

-- Aggiungo le colonne per le immagini alla tabella posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Aggiungo commenti per documentare le nuove colonne
COMMENT ON COLUMN public.posts.image_url IS 'URL dell''immagine di copertina dell''articolo (tipicamente da Unsplash)';
COMMENT ON COLUMN public.posts.image_alt IS 'Testo alternativo per l''immagine di copertina (accessibilità)';

-- Conferma completamento
SELECT 'Colonne immagini aggiunte con successo alla tabella posts!' as status; 