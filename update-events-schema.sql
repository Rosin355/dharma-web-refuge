-- =====================================================
-- ESTENSIONE TABELLA EVENTI E PRENOTAZIONI
-- =====================================================

-- Aggiungi campi mancanti alla tabella events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled'));

-- Tabella per le prenotazioni eventi
CREATE TABLE IF NOT EXISTS public.event_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  participants_count INTEGER DEFAULT 1,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS per event_bookings
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Chiunque può inserire prenotazioni
CREATE POLICY IF NOT EXISTS "Anyone can insert bookings" ON public.event_bookings
  FOR INSERT WITH CHECK (true);

-- Policy: Solo admin possono vedere tutte le prenotazioni
CREATE POLICY IF NOT EXISTS "Admins can view all bookings" ON public.event_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Policy: Solo admin possono aggiornare prenotazioni
CREATE POLICY IF NOT EXISTS "Admins can update bookings" ON public.event_bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Trigger per aggiornare updated_at su event_bookings
CREATE OR REPLACE FUNCTION update_event_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_event_bookings_updated_at ON public.event_bookings;
CREATE TRIGGER update_event_bookings_updated_at 
    BEFORE UPDATE ON public.event_bookings
    FOR EACH ROW EXECUTE FUNCTION update_event_bookings_updated_at();

-- Messaggio di completamento
SELECT 'Schema eventi aggiornato con successo!' as status; 