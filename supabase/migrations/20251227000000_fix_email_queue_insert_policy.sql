-- Fix: Aggiungi policy INSERT per email_queue
-- Questo risolve l'errore "new row violates row-level security policy"
-- quando la funzione send_event_registration_email cerca di inserire nella coda

-- Rimuovi la policy se esiste già (per idempotenza)
DROP POLICY IF EXISTS "Functions can insert email queue" ON public.email_queue;

-- Policy per permettere INSERT nella tabella email_queue
-- Questa policy permette alle funzioni SECURITY DEFINER di inserire record
CREATE POLICY "Functions can insert email queue"
ON public.email_queue
FOR INSERT
WITH CHECK (true);
