-- Script per normalizzare i tipi di evento esistenti nel database
-- Questo script mappa i valori esistenti ai valori standard: Ritiri, Conferenze, Meditazione, Workshop

-- Normalizza i tipi esistenti
UPDATE public.events
SET type = CASE
  -- Mappa varianti di "Ritiri"
  WHEN LOWER(TRIM(type)) IN ('ritiro', 'ritiri', 'ritiro spirituale', 'ritiro di meditazione') THEN 'Ritiri'
  
  -- Mappa varianti di "Conferenze"
  WHEN LOWER(TRIM(type)) IN ('conferenza', 'conferenze', 'conferenza dharma', 'talk', 'sermone') THEN 'Conferenze'
  
  -- Mappa varianti di "Meditazione"
  WHEN LOWER(TRIM(type)) IN ('meditazione', 'meditazione guidata', 'sessione di meditazione', 'pratica') THEN 'Meditazione'
  
  -- Mappa varianti di "Workshop"
  WHEN LOWER(TRIM(type)) IN ('workshop', 'seminario', 'corso', 'laboratorio') THEN 'Workshop'
  
  -- Se il tipo è già corretto, mantienilo
  WHEN type IN ('Ritiri', 'Conferenze', 'Meditazione', 'Workshop') THEN type
  
  -- Se il tipo è NULL o vuoto, lascialo NULL
  WHEN type IS NULL OR TRIM(type) = '' THEN NULL
  
  -- Per valori non riconosciuti, imposta NULL (puoi modificarli manualmente dopo)
  ELSE NULL
END
WHERE type IS NOT NULL;

-- Mostra un riepilogo dei tipi dopo la normalizzazione
SELECT 
  type,
  COUNT(*) as count
FROM public.events
GROUP BY type
ORDER BY count DESC;

-- Messaggio di conferma
SELECT 'Tipi di evento normalizzati con successo!' as result;
