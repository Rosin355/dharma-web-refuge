-- Fix POSTS table security
DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;

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

-- Fix TEMPLE_IMAGES table security
-- Remove overly permissive policies
DROP POLICY IF EXISTS "temple_images_select_policy" ON public.temple_images;
DROP POLICY IF EXISTS "temple_images_insert_policy" ON public.temple_images;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.temple_images;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.temple_images;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.temple_images;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.temple_images;
DROP POLICY IF EXISTS "Enable update for all users" ON public.temple_images;

-- Public can view temple images
CREATE POLICY "Anyone can view temple images"
ON public.temple_images
FOR SELECT
USING (true);

-- Only admins can insert temple images
CREATE POLICY "Admins can insert temple images"
ON public.temple_images
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Only admins can update temple images
CREATE POLICY "Admins can update temple images"
ON public.temple_images
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Only admins can delete temple images
CREATE POLICY "Admins can delete temple images"
ON public.temple_images
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));