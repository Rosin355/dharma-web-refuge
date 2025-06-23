-- Verifica immagini del tempio caricate nel database
SELECT 
  id,
  filename,
  category,
  alt_text,
  page_section,
  created_at
FROM temple_images
ORDER BY category, created_at; 