-- =====================================================
-- SETUP DATABASE SUPABASE - COMUNITÀ BODHIDHARMA
-- =====================================================

-- 1. CREAZIONE TABELLE
-- =====================================================

-- Tabella profili utenti (estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella posts/blog
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella eventi
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  type TEXT CHECK (type IN ('ritiro', 'cerimonia', 'conferenza', 'meditazione')),
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella insegnamenti
CREATE TABLE IF NOT EXISTS public.teachings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  teacher TEXT,
  category TEXT CHECK (category IN ('dharma', 'meditazione', 'filosofia', 'pratica')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CONFIGURAZIONE RLS (Row Level Security)
-- =====================================================

-- Abilita RLS su tutte le tabelle
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachings ENABLE ROW LEVEL SECURITY;

-- 3. TRIGGER PER AGGIORNAMENTO TIMESTAMP
-- =====================================================

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per tutte le tabelle
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teachings_updated_at ON public.teachings;
CREATE TRIGGER update_teachings_updated_at BEFORE UPDATE ON public.teachings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. FUNZIONE PER CREARE PROFILO AUTOMATICAMENTE
-- =====================================================

-- Funzione che crea automaticamente un profilo quando un utente si registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger che esegue la funzione quando viene creato un nuovo utente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. CONTENUTO INIZIALE (OPZIONALE)
-- =====================================================

-- Inserimento di alcuni insegnamenti iniziali
INSERT INTO public.teachings (title, content, teacher, category) VALUES
('Il Primo Insegnamento del Buddha', 
 'Il primo insegnamento del Buddha dopo la sua illuminazione fu dato nel Parco dei Cervi a Sarnath. In questo discorso, noto come Dhammacakkappavattana Sutta, il Buddha espose per la prima volta le Quattro Nobili Verità e il Nobile Ottuplice Sentiero.',
 'Buddha Shakyamuni',
 'dharma'),

('La Pratica della Meditazione Seduta', 
 'La meditazione seduta (zazen) è il cuore della pratica zen. Siediti in posizione eretta, con la schiena dritta ma rilassata, le mani in mudra, e semplicemente osserva il respiro senza giudicare.',
 'Maestro Zen',
 'meditazione'),

('I Tre Gioielli del Buddhismo', 
 'I Tre Gioielli sono Buddha (il risvegliato), Dharma (l''insegnamento) e Sangha (la comunità). Prendere rifugio nei Tre Gioielli è il primo passo nel sentiero buddhista.',
 'Tradizione Buddhista',
 'filosofia')

ON CONFLICT DO NOTHING;

-- =====================================================
-- MESSAGGIO FINALE
-- =====================================================

SELECT 'Tabelle create con successo! Ora esegui il secondo script per le policy.' as status; 