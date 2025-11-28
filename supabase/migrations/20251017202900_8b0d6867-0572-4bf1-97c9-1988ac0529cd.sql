-- Fix POSTS table security: Remove anonymous access
DROP POLICY IF EXISTS "Migration: Allow anonymous insert posts" ON public.posts;
DROP POLICY IF EXISTS "Migration: Allow anonymous update posts" ON public.posts;

-- Only admins can insert posts
CREATE POLICY "Admins can insert posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Only admins can update posts
CREATE POLICY "Admins can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Only admins can delete posts
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));