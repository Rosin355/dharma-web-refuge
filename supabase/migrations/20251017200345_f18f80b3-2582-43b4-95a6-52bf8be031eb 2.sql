-- Add attendance_type column to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS attendance_type TEXT DEFAULT 'in_person' 
CHECK (attendance_type IN ('in_person', 'online', 'hybrid'));

-- Add comment to explain the column
COMMENT ON COLUMN public.events.attendance_type IS 'Type of attendance: in_person (solo presenza), online (solo online), hybrid (entrambi)';
