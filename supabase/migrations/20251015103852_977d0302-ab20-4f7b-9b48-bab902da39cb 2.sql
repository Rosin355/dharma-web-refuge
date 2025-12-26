-- Pulizia duplicati: mantieni solo i post con immagine o il più recente
WITH ranked_posts AS (
  SELECT 
    id,
    title,
    image_url,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY title 
      ORDER BY 
        CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 0 ELSE 1 END,
        created_at DESC
    ) as rn
  FROM posts
)
DELETE FROM posts
WHERE id IN (
  SELECT id 
  FROM ranked_posts 
  WHERE rn > 1
);

-- Aggiungi commento per conferma
SELECT 'Post duplicati eliminati con successo! Mantenuti solo i post con immagine.' as status;