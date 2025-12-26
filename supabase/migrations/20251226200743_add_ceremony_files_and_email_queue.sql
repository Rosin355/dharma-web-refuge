-- Aggiungi colonne per file audio e PDF nella tabella ceremonies
ALTER TABLE public.ceremonies
ADD COLUMN IF NOT EXISTS audio_file_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_file_url TEXT;

-- Crea tabella email_queue per gestire l'invio email
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abilita RLS
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- Policy per email_queue (solo admin possono vedere)
CREATE POLICY "Admins can view email queue"
ON public.email_queue
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

CREATE POLICY "Admins can update email queue"
ON public.email_queue
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Funzione per inviare notifica email (salva in coda)
CREATE OR REPLACE FUNCTION send_event_registration_email(
  p_to_email TEXT,
  p_participant_name TEXT,
  p_event_title TEXT,
  p_event_date TEXT DEFAULT NULL,
  p_event_location TEXT DEFAULT NULL,
  p_admin_email TEXT DEFAULT 'bodhidharmait@gmail.com'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Salva l'email per il partecipante nella coda
  INSERT INTO email_queue (
    to_email,
    subject,
    body_html,
    created_at
  ) VALUES (
    p_to_email,
    'Conferma Prenotazione: ' || p_event_title,
    '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Comunità Bodhidharma</h1>
    </div>
    <div class="content">
      <h2>Conferma Prenotazione Evento</h2>
      <p>Caro/a ' || p_participant_name || ',</p>
      <p>Ti confermiamo la ricezione della tua prenotazione per l''evento:</p>
      <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #F59E0B;">
        <h3 style="margin-top: 0;">' || p_event_title || '</h3>' ||
    COALESCE('<p><strong>Data:</strong> ' || p_event_date || '</p>', '') ||
    COALESCE('<p><strong>Luogo:</strong> ' || p_event_location || '</p>', '') || '
      </div>
      <p>Riceverai ulteriori informazioni a breve.</p>
      <p>Se hai domande, puoi rispondere a questa email.</p>
      <p>Con gratitudine,<br>Comunità Bodhidharma</p>
    </div>
    <div class="footer">
      <p>Questo è un messaggio automatico, per favore non rispondere direttamente a questa email.</p>
    </div>
  </div>
</body>
</html>',
    NOW()
  );
  
  -- Email per admin
  INSERT INTO email_queue (
    to_email,
    subject,
    body_html,
    created_at
  ) VALUES (
    p_admin_email,
    'Nuova Prenotazione: ' || p_event_title,
    '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nuova Prenotazione Evento</h1>
    </div>
    <div class="content">
      <h2>Nuova prenotazione ricevuta</h2>
      <p><strong>Evento:</strong> ' || p_event_title || '</p>
      <p><strong>Partecipante:</strong> ' || p_participant_name || '</p>
      <p><strong>Email:</strong> ' || p_to_email || '</p>' ||
    COALESCE('<p><strong>Data:</strong> ' || p_event_date || '</p>', '') ||
    COALESCE('<p><strong>Luogo:</strong> ' || p_event_location || '</p>', '') || '
    </div>
  </div>
</body>
</html>',
    NOW()
  );
  
  RETURN json_build_object(
    'success', true,
    'message', 'Email aggiunta alla coda'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Trigger function per eventi
CREATE OR REPLACE FUNCTION notify_event_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event RECORD;
  v_event_date TEXT;
  v_event_location TEXT;
BEGIN
  -- Recupera i dettagli dell'evento
  SELECT title, start_date, location INTO v_event
  FROM events
  WHERE id = NEW.event_id;
  
  -- Formatta la data
  IF v_event.start_date IS NOT NULL THEN
    v_event_date := to_char(v_event.start_date, 'DD/MM/YYYY HH24:MI');
  END IF;
  
  v_event_location := COALESCE(v_event.location, '');
  
  -- Chiama la funzione per inviare email
  PERFORM send_event_registration_email(
    NEW.email,
    NEW.full_name,
    v_event.title,
    v_event_date,
    v_event_location
  );
  
  RETURN NEW;
END;
$$;

-- Crea il trigger per eventi
DROP TRIGGER IF EXISTS on_event_registration_created ON event_registrations;
CREATE TRIGGER on_event_registration_created
  AFTER INSERT ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_event_registration();

-- Trigger function per cerimonie
CREATE OR REPLACE FUNCTION notify_ceremony_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ceremony RECORD;
  v_date_text TEXT;
BEGIN
  SELECT title, schedule, time, location INTO v_ceremony
  FROM ceremonies
  WHERE id = NEW.ceremony_id;
  
  -- Combina schedule e time per la data
  v_date_text := COALESCE(
    CASE 
      WHEN v_ceremony.schedule IS NOT NULL AND v_ceremony.time IS NOT NULL 
      THEN v_ceremony.schedule || ' - ' || v_ceremony.time
      WHEN v_ceremony.schedule IS NOT NULL 
      THEN v_ceremony.schedule
      WHEN v_ceremony.time IS NOT NULL 
      THEN v_ceremony.time
      ELSE NULL
    END,
    ''
  );
  
  PERFORM send_event_registration_email(
    NEW.email,
    NEW.full_name,
    v_ceremony.title,
    v_date_text,
    COALESCE(v_ceremony.location, '')
  );
  
  RETURN NEW;
END;
$$;

-- Crea il trigger per cerimonie
DROP TRIGGER IF EXISTS on_ceremony_registration_created ON ceremony_registrations;
CREATE TRIGGER on_ceremony_registration_created
  AFTER INSERT ON ceremony_registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_ceremony_registration();

