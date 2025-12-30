-- Fix: Aggiungi policy per il bucket storage 'images'
-- Questo risolve l'errore RLS quando si caricano immagini dal computer

-- Assicurati che il bucket 'images' esista e sia pubblico
-- (Questo va fatto manualmente nel dashboard Storage se non esiste)

-- Rimuovi tutte le policy esistenti per il bucket images (per evitare conflitti)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete images" ON storage.objects;

-- Policy per permettere SELECT (lettura) pubblica delle immagini
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Policy per permettere INSERT (upload) agli utenti autenticati
-- Questa è la policy critica che risolve l'errore RLS
CREATE POLICY "Authenticated can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy per permettere UPDATE agli utenti autenticati
CREATE POLICY "Authenticated can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy per permettere DELETE agli utenti autenticati
CREATE POLICY "Authenticated can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');

