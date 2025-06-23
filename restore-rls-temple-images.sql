-- Riabilita RLS con policies corrette per il frontend
ALTER TABLE temple_images ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica (necessaria per il frontend)
DROP POLICY IF EXISTS "Enable read access for all users" ON temple_images;
CREATE POLICY "Enable read access for all users" ON temple_images
    FOR SELECT USING (true);

-- Policy per inserimento da parte degli admin (opzionale)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON temple_images;
CREATE POLICY "Enable insert for authenticated users" ON temple_images
    FOR INSERT WITH CHECK (true); 