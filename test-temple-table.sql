-- Test per verificare la tabella temple_images
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'temple_images';

-- Test inserimento manuale
INSERT INTO temple_images (
  filename, 
  original_url, 
  storage_url, 
  alt_text, 
  category, 
  page_section
) VALUES (
  'test.jpg', 
  'https://example.com/test.jpg', 
  'https://example.com/storage/test.jpg', 
  'Test image', 
  'tempio', 
  'chi-siamo'
); 