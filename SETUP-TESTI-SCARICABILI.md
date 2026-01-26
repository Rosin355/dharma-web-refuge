# Setup Testi Scaricabili - Istruzioni

## 📋 Riepilogo Stack

**Stack tecnologico rilevato:**
- React + TypeScript + Vite
- Supabase (PostgreSQL + Storage)
- React Router per routing
- TanStack Query per data fetching
- shadcn/ui per componenti UI
- Storage bucket "images" su Supabase per file upload

**Pattern architetturali:**
- Componenti admin in `src/components/admin/`
- Pagine frontend in `src/pages/`
- Hooks custom in `src/hooks/`
- Migrations in `supabase/migrations/`
- Upload file su bucket "images" con path strutturato

---

## 📁 File Creati/Modificati

### Database
- ✅ `supabase/migrations/20260126000000_create_downloadable_texts.sql` - Migration per tabella e policies

### Hooks
- ✅ `src/hooks/useDownloadableTexts.tsx` - Hook per CRUD e query

### Componenti Admin
- ✅ `src/components/admin/DownloadableTextsManager.tsx` - Gestione completa CRUD

### Pagine Frontend
- ✅ `src/pages/TestiScaricabili.tsx` - Lista pubblica testi
- ✅ `src/pages/TestoScaricabileDetail.tsx` - Dettaglio singolo testo

### Routing e Navigazione
- ✅ `src/App.tsx` - Aggiunte routes `/testi-scaricabili` e `/testi-scaricabili/:slug`
- ✅ `src/components/Navigation.tsx` - Aggiunta voce "Testi Scaricabili"
- ✅ `src/pages/Admin.tsx` - Aggiunto tab "Testi Scaricabili"

---

## 🚀 Istruzioni Step-by-Step

### 1. Migrare il Database

Esegui la migration per creare la tabella `downloadable_texts`:

```bash
# Se usi Supabase CLI
supabase migration up

# Oppure esegui manualmente la migration SQL:
# supabase/migrations/20260126000000_create_downloadable_texts.sql
```

**Verifica:**
```sql
-- Controlla che la tabella esista
SELECT * FROM public.downloadable_texts LIMIT 1;

-- Verifica le policies RLS
SELECT * FROM pg_policies WHERE tablename = 'downloadable_texts';
```

### 2. Configurare Storage

I file vengono salvati nel bucket `images` esistente. Verifica che le policy del storage permettano:

**Policy necessarie per il bucket "images":**

```sql
-- Policy per upload file (solo admin)
CREATE POLICY "Admins can upload downloadable texts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'downloadable-texts' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Policy per lettura pubblica dei file
CREATE POLICY "Public can read downloadable texts"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'downloadable-texts'
);
```

**Struttura cartelle nel bucket:**
- `downloadable-texts/` - File PDF/EPUB/MOBI/ZIP
- `downloadable-texts/covers/` - Immagini di copertina

### 3. Aggiornare i Tipi TypeScript (Opzionale)

Se usi Supabase CLI, rigenera i tipi:

```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

Oppure aggiungi manualmente i tipi per `downloadable_texts` in `types.ts` (verranno generati automaticamente al prossimo sync).

### 4. Testare il Sistema

#### A. Creare un Testo da Admin

1. Accedi al pannello admin: `/admin`
2. Vai al tab "Testi Scaricabili"
3. Clicca "Nuovo Testo"
4. Compila i campi:
   - **Titolo**: "Testo di Prova"
   - **Slug**: verrà generato automaticamente (modificabile)
   - **Descrizione**: "Descrizione del testo"
   - **File**: carica un PDF/EPUB/MOBI/ZIP (max 50MB)
   - **Immagine di copertina**: opzionale
   - **Categoria**: opzionale
   - **Lingua**: seleziona (default: it)
   - **Tag**: aggiungi tag separati
   - **Pubblicato**: spunta per pubblicare
5. Clicca "Salva"

#### B. Verificare nel Frontend

1. Vai a `/testi-scaricabili`
2. Dovresti vedere il testo creato (se `published = true`)
3. Clicca su "Dettagli" per vedere la pagina di dettaglio
4. Clicca "Scarica" per scaricare il file

### 5. Configurazione Variabili Ambiente (Opzionale)

Se vuoi modificare i limiti di upload, aggiungi in `.env`:

```env
# Limite dimensione file (default: 50MB)
VITE_MAX_FILE_SIZE=52428800

# Formati file consentiti (già configurati nel codice)
# PDF, EPUB, MOBI, ZIP
```

---

## 🔒 Sicurezza e Validazione

**Validazioni implementate:**
- ✅ Controllo formato file (estensione + MIME type)
- ✅ Limite dimensione file (50MB)
- ✅ Sanitizzazione nome file
- ✅ RLS policies per accesso solo pubblicato nel frontend
- ✅ Solo admin possono creare/modificare/eliminare

**File supportati:**
- PDF: `application/pdf`
- EPUB: `application/epub+zip`, `application/epub`
- MOBI: `application/x-mobipocket-ebook`, `application/vnd.amazon.mobi8-ebook`
- ZIP: `application/zip`, `application/x-zip-compressed`

---

## 📝 Note Aggiuntive

### SEO
- Title e meta description vengono aggiornati dinamicamente
- Canonical URL configurato
- Open Graph tags per condivisione social

### Funzionalità
- **Slug auto-generato** da titolo (modificabile)
- **Filtri** nella lista: ricerca, categoria, lingua
- **Tag** multipli per ogni testo
- **Ordinamento** tramite `sort_order` e `created_at`
- **Stato pubblicazione** con `published` e `published_at`

### Prossimi Passi (Opzionali)
- Aggiungere signed URLs per download sicuri
- Implementare contatore download
- Aggiungere preview file (per PDF)
- Implementare sistema di versioning
- Aggiungere analytics per download

---

## ✅ Checklist Pre-Produzione

- [ ] Migration eseguita con successo
- [ ] Storage policies configurate
- [ ] Test creazione testo da admin
- [ ] Test visualizzazione nel frontend
- [ ] Test download file
- [ ] Verifica RLS policies (solo pubblicati visibili)
- [ ] Test filtri e ricerca
- [ ] Verifica SEO (title, meta tags)
- [ ] Test su mobile/responsive

---

## 🐛 Troubleshooting

**Errore "Permission denied" su upload:**
- Verifica che l'utente sia autenticato come admin
- Controlla le storage policies per il bucket "images"

**File non visibili nel frontend:**
- Verifica che `published = true`
- Controlla le RLS policies sulla tabella

**Errore "File format not supported":**
- Verifica che il file sia uno dei formati supportati
- Controlla MIME type del file

---

**Data creazione:** 26 Gennaio 2026  
**Versione:** 1.0.0
