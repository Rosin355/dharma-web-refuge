# Flusso delle Prenotazioni Eventi

## Panoramica
Quando un utente compila il form di prenotazione per un evento, ecco cosa succede:

## 1. Frontend - Form di Prenotazione
**File:** `src/components/EventRegistrationDialog.tsx`

Il form raccoglie:
- Nome Completo (obbligatorio)
- Email (obbligatorio)
- Telefono (opzionale)
- Note/Richieste Speciali (opzionale)
- Accettazione Privacy Policy (obbligatorio)

## 2. Invio Dati
**File:** `src/hooks/useEvents.tsx` - funzione `createRegistration`

Quando l'utente clicca "Conferma Prenotazione":
- I dati vengono validati (nome, email formato corretto, privacy accettata)
- Viene chiamata la funzione `createRegistration.mutateAsync()` che:
  - Inserisce i dati nella tabella `event_registrations` di Supabase
  - Collega la prenotazione all'evento tramite `event_id`

## 3. Database - Tabella `event_registrations`
**Migrazione:** `supabase/migrations/20251017195653_b60b01c2-40cd-4ef0-9d99-55144ff1bcf5.sql`

La tabella contiene:
- `id` (UUID, auto-generato)
- `event_id` (UUID, riferimento all'evento)
- `full_name` (TEXT, obbligatorio)
- `email` (TEXT, obbligatorio)
- `phone` (TEXT, opzionale)
- `notes` (TEXT, opzionale)
- `status` (TEXT, default: 'pending', valori: 'pending', 'confirmed', 'cancelled')
- `created_at` (TIMESTAMP, auto-generato)
- `updated_at` (TIMESTAMP, auto-aggiornato)

## 4. Trigger Email di Conferma
**Migrazione:** `supabase/migrations/20251226200743_add_ceremony_files_and_email_queue.sql`

Dopo l'inserimento nella tabella:
1. Si attiva il trigger `on_event_registration_created`
2. Il trigger chiama la funzione `notify_event_registration()`
3. Questa funzione chiama `send_event_registration_email()` che:
   - Invia una email di conferma all'utente
   - Include i dettagli dell'evento (titolo, data, luogo)

## 5. Row Level Security (RLS)
**Policy configurate:**

- **INSERT:** Chiunque può creare prenotazioni (anonimo o autenticato)
- **SELECT:** Solo admin e moderator possono vedere tutte le prenotazioni
- **UPDATE:** Solo admin e moderator possono aggiornare prenotazioni
- **DELETE:** Solo admin e moderator possono eliminare prenotazioni

## 6. Visualizzazione Prenotazioni
Gli admin possono visualizzare le prenotazioni tramite:
- Hook `useEventRegistrations(eventId)` per ottenere le prenotazioni di un evento specifico
- Query alla tabella `event_registrations` filtrata per `event_id`

## Note Importanti
- Le prenotazioni sono salvate immediatamente nel database
- L'email di conferma viene inviata automaticamente tramite trigger
- Gli utenti non autenticati possono prenotare (anonimi)
- Solo gli admin possono gestire (vedere/modificare/eliminare) le prenotazioni
