-- =====================================================
-- RIPRISTINO POLICY DI SICUREZZA DOPO MIGRAZIONE
-- =====================================================

-- Rimuovi policy temporanee di migrazione
DROP POLICY IF EXISTS "Migration: Posts viewable by all" ON public.posts;
DROP POLICY IF EXISTS "Migration: Allow anonymous insert posts" ON public.posts;
DROP POLICY IF EXISTS "Migration: Allow anonymous update posts" ON public.posts;
DROP POLICY IF EXISTS "Migration: Profiles viewable by all" ON public.profiles;
DROP POLICY IF EXISTS "Migration: Allow anonymous insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Migration: Allow anonymous update profiles" ON public.profiles;

-- Ripristina policy di sicurezza originali

-- Policy per profili
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy per posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (status = 'published' OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ));

CREATE POLICY "Admins can insert posts" ON public.posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can update posts" ON public.posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Messaggio di conferma
SELECT 'Policy di sicurezza ripristinate con successo!' as status; 