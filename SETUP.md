# 🚀 Setup Progetto Comunità Bodhidharma

## 📋 Prerequisiti

- Node.js 18+ 
- npm o yarn
- Account Supabase

## 🔧 Configurazione Environment Variables

### 1. Creare file `.env.local`

Crea un file `.env.local` nella root del progetto con le seguenti variabili:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://zklgrmeiemzsusmoegby.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA

# Admin Configuration
VITE_ADMIN_EMAIL=admin@bodhidharma.info
VITE_APP_NAME=Comunità Bodhidharma
VITE_APP_URL=https://bodhidharma.info
```

### 2. Installare dipendenze

```bash
npm install
# oppure
yarn install
```

### 3. Avviare il server di sviluppo

```bash
npm run dev
# oppure
yarn dev
```

## 🗄️ Configurazione Database Supabase

### 1. Creare Tabelle

Esegui questi comandi SQL nel dashboard Supabase:

```sql
-- Tabella profili utenti (estende auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella posts/blog
CREATE TABLE public.posts (
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
CREATE TABLE public.events (
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
CREATE TABLE public.teachings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  teacher TEXT,
  category TEXT CHECK (category IN ('dharma', 'meditazione', 'filosofia', 'pratica')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Configurare RLS (Row Level Security)

```sql
-- Abilita RLS su tutte le tabelle
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachings ENABLE ROW LEVEL SECURITY;

-- Policy per profili (utenti possono vedere solo il proprio profilo)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy per posts (pubblici per tutti, admin possono modificare)
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert posts" ON public.posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy per eventi (pubblici per tutti, admin possono modificare)
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Creare Trigger per Aggiornamento Timestamp

```sql
-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per tutte le tabelle
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachings_updated_at BEFORE UPDATE ON public.teachings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 👤 Creazione Utente Admin

### 1. Registrare utente admin

1. Vai su `/admin` nel tuo sito
2. Clicca su "Registrati" (se disponibile)
3. Usa l'email: `admin@bodhidharma.info`
4. Imposta una password sicura

### 2. Assegnare ruolo admin

Nel dashboard Supabase, esegui:

```sql
-- Aggiorna il ruolo dell'utente a admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@bodhidharma.info';
```

## 🔒 Sicurezza

### Checklist Sicurezza

- [x] Credenziali in environment variables
- [x] RLS abilitato su tutte le tabelle
- [x] Policy di sicurezza configurate
- [x] Autenticazione implementata
- [x] Validazione input lato client
- [ ] Rate limiting (da implementare)
- [ ] HTTPS enforcement (in produzione)
- [ ] CSP headers (da implementare)

## 🚀 Deploy

### Build per Produzione

```bash
npm run build
# oppure
yarn build
```

### Variabili d'Ambiente Produzione

Assicurati di configurare le stesse variabili d'ambiente nel tuo hosting provider.

## 📞 Supporto

Per problemi o domande:
- Controlla i log della console del browser
- Verifica la connessione Supabase in `/admin`
- Controlla le policy RLS nel dashboard Supabase 