-- Create ceremonies table
CREATE TABLE IF NOT EXISTS public.ceremonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  schedule TEXT, -- "Ogni prima domenica del mese", "Tutti i giorni", etc.
  time TEXT, -- "15:00 - 17:00"
  location TEXT,
  attendance_type TEXT DEFAULT 'in_person',
  meeting_url TEXT,
  price TEXT,
  max_participants INTEGER,
  type TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT ceremonies_attendance_type_check CHECK (attendance_type IN ('in_person', 'online', 'hybrid')),
  CONSTRAINT ceremonies_status_check CHECK (status IN ('draft', 'published'))
);

-- Create ceremony_registrations table
CREATE TABLE IF NOT EXISTS public.ceremony_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ceremony_id UUID NOT NULL REFERENCES public.ceremonies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ceremonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceremony_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ceremonies
CREATE POLICY "Ceremonies are viewable by everyone"
  ON public.ceremonies
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage ceremonies"
  ON public.ceremonies
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for ceremony_registrations
CREATE POLICY "Anyone can create registrations"
  ON public.ceremony_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all registrations"
  ON public.ceremony_registrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can update registrations"
  ON public.ceremony_registrations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can delete registrations"
  ON public.ceremony_registrations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'moderator')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_ceremonies_updated_at
  BEFORE UPDATE ON public.ceremonies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ceremony_registrations_updated_at
  BEFORE UPDATE ON public.ceremony_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();