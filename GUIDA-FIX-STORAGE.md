# 🔧 Guida Fix: Errore RLS Upload Immagini

## Problema
Errore "new row violates row-level security policy" quando si caricano immagini dal computer negli admin (articoli, eventi, cerimonie).

## Soluzione

### Passo 1: Verifica Bucket Storage

1. Vai su https://supabase.com/dashboard
2. Seleziona il progetto: `zklgrmeiemzsusmoegby`
3. Vai su **Storage** nel menu laterale
4. Verifica che il bucket **`images`** esista
5. Se non esiste, crealo:
   - Clicca su "New bucket"
   - Nome: `images`
   - **IMPORTANTE**: Seleziona **"Public bucket"** (deve essere pubblico!)
   - Clicca su "Create bucket"

### Passo 2: Applica le Policy Storage

1. Vai su **SQL Editor** nel dashboard Supabase
2. Clicca su "New query"
3. Copia e incolla questo SQL:

```sql
-- Rimuovi tutte le policy esistenti per evitare conflitti
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete images" ON storage.objects;

-- Policy 1: SELECT pubblica (tutti possono vedere le immagini)
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: INSERT per utenti autenticati (upload immagini)
-- Questa è la policy critica che risolve l'errore RLS
CREATE POLICY "Authenticated can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy 3: UPDATE per utenti autenticati
CREATE POLICY "Authenticated can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy 4: DELETE per utenti autenticati
CREATE POLICY "Authenticated can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

4. Clicca su **"Run"** per eseguire

### Passo 3: Verifica

1. Vai su **Storage** > **Policies**
2. Verifica che ci siano 4 policy per `storage.objects`:
   - ✅ Public can view images (SELECT)
   - ✅ Authenticated can upload images (INSERT)
   - ✅ Authenticated can update images (UPDATE)
   - ✅ Authenticated can delete images (DELETE)

### Passo 4: Test

1. Vai nell'area admin del sito
2. Assicurati di essere loggato
3. Prova a caricare un'immagine da computer in:
   - Gestione Articoli (PostsManager)
   - Gestione Eventi (EventsManager)
   - Gestione Cerimonie (CeremoniesManager)

## ⚠️ Importante

- Il bucket **DEVE** essere pubblico
- L'utente **DEVE** essere autenticato (loggato nell'area admin)
- Le policy devono essere applicate esattamente come sopra

## 🔍 Troubleshooting

### Errore persiste dopo aver applicato le policy

1. Verifica che il bucket sia pubblico:
   - Storage > Buckets > `images` > Settings
   - Deve essere selezionato "Public bucket"

2. Verifica che l'utente sia autenticato:
   - Controlla la console del browser (F12)
   - Cerca errori di autenticazione

3. Verifica le policy:
   - Storage > Policies
   - Dovrebbero esserci 4 policy per `storage.objects`

### Bucket non esiste

Crea il bucket manualmente:
1. Storage > New bucket
2. Nome: `images`
3. **Public bucket**: ✅ (deve essere selezionato!)
4. Create bucket

