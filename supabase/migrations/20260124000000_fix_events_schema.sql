-- SCRIPT DI RIPRISTINO E SINCRONIZZAZIONE TABELLA EVENTS
-- Eseguire questo script nel SQL Editor di Supabase per risolvere l'errore 400

-- 1. Aggiungi colonne se mancano
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS attendance_type TEXT DEFAULT 'in_person';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS meeting_url TEXT;

-- 2. Aggiorna vincoli CHECK per assicurare coerenza con il frontend
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE public.events ADD CONSTRAINT events_status_check CHECK (status IN ('draft', 'published', 'cancelled'));

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_attendance_type_check;
ALTER TABLE public.events ADD CONSTRAINT events_attendance_type_check CHECK (attendance_type IN ('in_person', 'online', 'hybrid'));

-- 3. Assicurati che i permessi RLS siano corretti
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Messaggio di conferma
SELECT 'Database sincronizzato con successo!' as result;
