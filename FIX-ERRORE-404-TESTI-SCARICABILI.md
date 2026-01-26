# 🔧 Fix Errore 404 - Testi Scaricabili

## ❌ Problema
Errore `404 Not Found` quando si cerca di salvare o visualizzare testi scaricabili. L'errore indica che la tabella `downloadable_texts` non esiste nel database.

## ✅ Soluzione: Eseguire la Migration

### Metodo 1: Dashboard Supabase (Consigliato)

1. **Vai al Dashboard Supabase**
   - Apri https://supabase.com/dashboard
   - Accedi e seleziona il tuo progetto

2. **Apri SQL Editor**
   - Nel menu laterale, clicca su **"SQL Editor"**
   - Clicca su **"New query"**

3. **Esegui la Migration**
   - Apri il file `APPLICA-MIGRATION-TESTI-SCARICABILI.sql` in questo progetto
   - **Copia TUTTO il contenuto** del file
   - **Incolla** nel SQL Editor di Supabase
   - Clicca **"Run"** (o premi Cmd/Ctrl+Enter)

4. **Verifica**
   - Dovresti vedere il messaggio: `✅ Tabella downloadable_texts creata con successo!`
   - Se vedi errori, controlla che:
     - La funzione `update_updated_at_column()` esista (viene creata automaticamente se non esiste)
     - Non ci siano conflitti con policies esistenti

### Metodo 2: Supabase CLI (Se installato)

```bash
# Se hai Supabase CLI configurato
supabase migration up

# Oppure esegui direttamente il file SQL
supabase db execute -f supabase/migrations/20260126000000_create_downloadable_texts.sql
```

## 🔍 Verifica che la Migration sia Applicata

Dopo aver eseguito la migration, verifica nel SQL Editor:

```sql
-- Verifica che la tabella esista
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'downloadable_texts';

-- Verifica le policies RLS
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'downloadable_texts';
```

Dovresti vedere:
- ✅ Tabella `downloadable_texts` presente
- ✅ 5 policies RLS (Public view, Admins view, Admins insert, Admins update, Admins delete)

## 🚨 Se Continui ad Avere Errori

### Controlla le RLS Policies

Se la tabella esiste ma ottieni ancora 404, potrebbe essere un problema di RLS. Verifica:

```sql
-- Controlla se sei autenticato come admin
SELECT id, email, role 
FROM public.profiles 
WHERE id = auth.uid();

-- Se non vedi il tuo utente o il ruolo non è 'admin'/'moderator', 
-- aggiorna il tuo profilo:
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = auth.uid();
```

### Verifica Storage Policies

Assicurati che le storage policies per il bucket `images` permettano l'upload:

```sql
-- Verifica le storage policies esistenti
SELECT * FROM storage.policies 
WHERE bucket_id = 'images';
```

Se mancano, aggiungi le policies come descritto in `SETUP-TESTI-SCARICABILI.md` sezione 2.

## 📝 Dopo la Migration

1. **Ricarica la pagina** del form nel browser
2. **Prova a creare** un nuovo testo scaricabile
3. L'errore 404 dovrebbe essere risolto

---

**File da usare:** `APPLICA-MIGRATION-TESTI-SCARICABILI.sql`
