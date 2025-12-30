-- Setup completo per il bucket storage 'images'
-- Questo script risolve completamente l'errore RLS per l'upload immagini

-- IMPORTANTE: Prima di eseguire questo script, verifica nel dashboard Supabase:
-- 1. Vai su Storage > Buckets
-- 2. Assicurati che il bucket 'images' esista
-- 3. Se non esiste, crealo e impostalo come PUBLIC
-- 4. Se esiste ma non è pubblico, rendilo pubblico

-- Rimuovi tutte le policy esistenti per evitare conflitti
DO $$ 
BEGIN
  -- Rimuovi tutte le policy esistenti per il bucket images
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
  DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated can update images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated can delete images" ON storage.objects;
  DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
  DROP POLICY IF EXISTS "Give users access to insert in own folder" ON storage.objects;
END $$;

-- Policy 1: SELECT pubblica (tutti possono vedere le immagini)
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: INSERT per utenti autenticati (upload immagini)
-- Questa è la policy critica che risolve l'errore RLS
CREATE POLICY "Authenticated can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy 3: UPDATE per utenti autenticati (modificare immagini)
CREATE POLICY "Authenticated can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy 4: DELETE per utenti autenticati (eliminare immagini)
CREATE POLICY "Authenticated can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Verifica che le policy siano state create
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname LIKE '%images%';
  
  RAISE NOTICE 'Policy create per bucket images: %', policy_count;
END $$;

