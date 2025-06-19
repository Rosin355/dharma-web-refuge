-- =====================================================
-- POLICY TEMPORANEE PER MIGRAZIONE DATI
-- =====================================================

-- Rimuovi policy esistenti temporaneamente
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Policy temporanee permissive per la migrazione

-- POSTS - Permettere lettura a tutti e inserimento anonimo temporaneo
CREATE POLICY "Migration: Posts viewable by all" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Migration: Allow anonymous insert posts" ON public.posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Migration: Allow anonymous update posts" ON public.posts
  FOR UPDATE USING (true);

-- PROFILES - Permettere inserimento anonimo temporaneo
CREATE POLICY "Migration: Profiles viewable by all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Migration: Allow anonymous insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Migration: Allow anonymous update profiles" ON public.profiles
  FOR UPDATE USING (true);

-- Messaggio di avviso
SELECT 'ATTENZIONE: Policy temporanee attive per migrazione!' as warning,
       'Ripristinare policy di sicurezza dopo la migrazione!' as action_required; 