-- ============================================================================
-- FIX POLICY DELETE PER TEMPLE_IMAGES
-- ============================================================================
-- Problema: Manca la policy DELETE, quindi le rimozioni falliscono silenziosamente
-- Soluzione: Aggiungere policy per DELETE e UPDATE

-- 1. Aggiungi policy per DELETE (permette a tutti di eliminare)
CREATE POLICY "Enable delete for all users" ON temple_images
    FOR DELETE USING (true);

-- 2. Aggiungi policy per UPDATE (utile per future funzionalità)
CREATE POLICY "Enable update for all users" ON temple_images
    FOR UPDATE USING (true);

-- 3. Verifica che le policy siano state create
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'temple_images'
ORDER BY cmd;

-- 4. Test: Rimuovi l'immagine 52 problematica
DELETE FROM temple_images 
WHERE alt_text = 'Immagine 52' 
AND id = '3ac60786-2b30-45c9-bf19-4d165f6719e3';

-- 5. Verifica che sia stata rimossa
SELECT COUNT(*) as "Immagini con alt_text 'Immagine 52'" 
FROM temple_images 
WHERE alt_text = 'Immagine 52';

-- 6. Mostra il conteggio totale per categoria
SELECT 
    category, 
    COUNT(*) as total_images 
FROM temple_images 
GROUP BY category 
ORDER BY category;

-- ============================================================================
-- RISULTATO ATTESO:
-- - Policy CREATE: SUCCESS
-- - Policy UPDATE: SUCCESS  
-- - DELETE Immagine 52: SUCCESS (1 row affected)
-- - Conteggio finale: 0 immagini con alt_text 'Immagine 52'
-- ============================================================================ 