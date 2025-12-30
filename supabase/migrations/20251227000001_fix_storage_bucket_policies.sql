-- Fix: Aggiungi policy per il bucket storage 'images'
-- Questo risolve l'errore RLS quando si caricano immagini dal computer

-- Policy per permettere SELECT (lettura) pubblica delle immagini
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Policy per permettere INSERT (upload) agli utenti autenticati
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Policy per permettere UPDATE agli utenti autenticati (per modificare le proprie immagini)
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Policy per permettere DELETE agli utenti autenticati (per eliminare le proprie immagini)
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

