-- Policies per la tabella temple_images

-- Rimuovi eventuali policies esistenti
DROP POLICY IF EXISTS "Enable read access for all users" ON temple_images;
DROP POLICY IF EXISTS "Enable insert for all users" ON temple_images;

-- Policy per lettura pubblica
CREATE POLICY "Enable read access for all users" ON temple_images
    FOR SELECT USING (true);

-- Policy per inserimento (permette a tutti di inserire)
CREATE POLICY "Enable insert for all users" ON temple_images
    FOR INSERT WITH CHECK (true);

-- Abilita RLS sulla tabella
ALTER TABLE temple_images ENABLE ROW LEVEL SECURITY; 