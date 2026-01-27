-- =====================================================
-- FIX PERMESSI EVENTI - ERRORE 403
-- =====================================================
-- Questo script risolve l'errore 403 quando un admin cerca di inserire eventi
-- Eseguire questo script nel SQL Editor di Supabase

-- 1. Verifica se l'utente esiste e mostra il suo ruolo
SELECT 
  u.id,
  u.email,
  p.role as profile_role,
  ur.role as user_role_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id AND ur.role = 'admin'
WHERE u.email = 'bodhidharmait@gmail.com';

-- 2. Crea o aggiorna il profilo per l'utente (se non esiste)
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
  u.id,
  u.email,
  'admin',
  COALESCE(u.raw_user_meta_data->>'full_name', 'Admin Bodhidharma')
FROM auth.users u
WHERE u.email = 'bodhidharmait@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = EXCLUDED.email,
  updated_at = NOW();

-- 3. Assicura che l'utente abbia il ruolo admin in profiles
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'bodhidharmait@gmail.com'
)
AND (role IS NULL OR role != 'admin');

-- 4. Assicura che l'utente abbia il ruolo admin in user_roles (se usa questo sistema)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'bodhidharmait@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Verifica che l'utente abbia tutti i privilegi (mostra il risultato)
SELECT 
  'Utente configurato come admin' as status,
  u.id,
  u.email,
  p.role as profile_role,
  p.full_name,
  array_agg(ur.role) as user_roles
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'bodhidharmait@gmail.com'
GROUP BY u.id, u.email, p.role, p.full_name;

-- 6. Verifica e aggiorna le policy RLS per gli eventi
-- Rimuovi le policy esistenti
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

-- Policy per SELECT: tutti possono vedere gli eventi pubblicati
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT 
  USING (true);

-- Policy per INSERT: admin e moderator possono inserire
CREATE POLICY "Admins can insert events" ON public.events
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Policy per UPDATE: admin e moderator possono aggiornare
CREATE POLICY "Admins can update events" ON public.events
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Policy per DELETE: admin e moderator possono eliminare
CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 7. Verifica finale: mostra le policy create
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'events'
ORDER BY policyname;

-- Messaggio di conferma
SELECT 'Permessi eventi aggiornati con successo!' as result;
