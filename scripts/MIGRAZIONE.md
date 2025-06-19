# 🔄 Guida Migrazione Blog Comunità Bodhidharma

## Panoramica
Questa guida ti accompagna nel processo di migrazione del blog dal vecchio sito al nuovo sistema basato su Supabase.

## ⚠️ Importante: Policy RLS
Il problema principale è che le **Row Level Security (RLS) policies** del database bloccano l'inserimento di dati anonimi. Dobbiamo temporaneamente rendere permissive le policy per la migrazione.

## 🚀 Procedura Passo-Passo

### Step 1: Attivazione Policy Temporanee

1. **Vai al Dashboard Supabase**
   - Apri [supabase.com](https://supabase.com)
   - Accedi al progetto `zklgrmeiemzsusmoegby`

2. **Esegui lo script delle policy temporanee**
   - Vai in **SQL Editor**
   - Copia e incolla il contenuto di `scripts/setup-migration-policies.sql`
   - Clicca **Run**

   ```sql
   -- Il contenuto sarà simile a questo:
   DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
   CREATE POLICY "Migration: Allow anonymous insert posts" ON public.posts
     FOR INSERT WITH CHECK (true);
   ```

3. **Verifica che le policy siano attive**
   - Dovresti vedere il messaggio: "ATTENZIONE: Policy temporanee attive per migrazione!"

### Step 2: Esecuzione Migrazione

1. **Esegui lo script di migrazione**
   ```bash
   VITE_SUPABASE_URL=https://zklgrmeiemzsusmoegby.supabase.co \
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... \
   npx tsx scripts/migrate-with-policies.ts
   ```

2. **Monitora l'output**
   - Lo script inserirà 6 articoli di esempio
   - Verifica che non ci siano errori RLS

### Step 3: Ripristino Policy di Sicurezza

1. **Dopo la migrazione riuscita**
   - Torna al **SQL Editor** di Supabase
   - Copia e incolla il contenuto di `scripts/restore-security-policies.sql`
   - Clicca **Run**

2. **Verifica ripristino**
   - Dovresti vedere: "Policy di sicurezza ripristinate con successo!"

### Step 4: Test dell'Applicazione

1. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

2. **Naviga al blog**
   - Vai su `http://localhost:5173/blog`
   - Dovresti vedere i 6 articoli migrati
   - Verifica che il caricamento dal database funzioni

## 📊 Cosa Viene Migrato

### Articoli Inclusi:
1. **Aggiornamento attività estive a Musangam e in esterno**
2. **Ritiri estivi programmi e destinazioni - Giugno e Luglio**
3. **Vesak 2025 - Unione Buddhista Italiana**
4. **Gli Insegnamenti del Maestro Zen Man Gong**
5. **La Pratica della Meditazione Seduta (Zazen)**
6. **Recitazioni e Mantra nella Pratica Quotidiana**

### Struttura Dati:
- `title`: Titolo dell'articolo
- `content`: Contenuto completo in Markdown
- `excerpt`: Riassunto breve
- `status`: 'published'
- `published_at`: Data di pubblicazione
- `author_id`: NULL (per ora)

## 🔧 Risoluzione Problemi

### Errore "Row-level security policy violation"
- **Causa**: Policy RLS troppo restrittive
- **Soluzione**: Assicurati di aver eseguito `setup-migration-policies.sql`

### Errore "Connection refused" 
- **Causa**: Credenziali Supabase non configurate
- **Soluzione**: Verifica le variabili d'ambiente

### Database vuoto dopo migrazione
- **Causa**: Policy non configurate correttamente
- **Soluzione**: Ripeti Step 1 e Step 2

## 🔒 Sicurezza

### Policy Temporanee (SOLO durante migrazione):
```sql
-- ATTENZIONE: Queste policy sono TEMPORANEE e INSICURE
CREATE POLICY "Migration: Allow anonymous insert posts" ON public.posts
  FOR INSERT WITH CHECK (true);
```

### Policy Finali (ripristinate automaticamente):
```sql
-- Policy di sicurezza normali
CREATE POLICY "Admins can insert posts" ON public.posts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );
```

## 📈 Monitoraggio

### Verifiche Post-Migrazione:
1. **Conteggio articoli**: Dovrebbero essere 6
2. **Contenuti leggibili**: Testo formattato correttamente
3. **Date**: Ordinate cronologicamente
4. **Policy**: Ripristinate alla configurazione sicura

## 🎯 Prossimi Passi

Dopo la migrazione riuscita:

1. **Crea utente admin**
   - Registrati su `/admin`
   - Aggiorna ruolo nel database

2. **Test funzionalità complete**
   - Creazione nuovi articoli
   - Modifica esistenti
   - Eliminazione (se necessario)

3. **Scraping sito reale**
   - Una volta testato il sistema
   - Implementa scraping di https://www.bodhidharma.info

## 📞 Supporto

In caso di problemi:
1. Controlla i log della console
2. Verifica le policy nel dashboard Supabase
3. Testa la connessione database
4. Ripeti la procedura dall'inizio se necessario 