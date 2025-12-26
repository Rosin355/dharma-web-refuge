-- Fix PAGE_CONTENTS security - make admin-only
DROP POLICY IF EXISTS "page_contents_admin_policy" ON public.page_contents;
CREATE POLICY "Admins can manage page contents"
ON public.page_contents
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- EVENT_REGISTRATIONS: Keep anonymous INSERT but add rate limiting note
-- This is intentional for public event registration forms
-- The SELECT is already restricted to admins only

-- CEREMONY_REGISTRATIONS: Keep anonymous INSERT but add rate limiting note  
-- This is intentional for public ceremony registration forms
-- The SELECT is already restricted to admins only