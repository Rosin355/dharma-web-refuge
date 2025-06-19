# 🌍 Migrazione Blog Comunità Bodhidharma

Questa guida ti aiuta a migrare tutti gli articoli dal vecchio sito **bodhidharma.info** al nuovo database del sito.

## 📋 Prerequisiti

1. **Connessione Internet** stabile
2. **Credenziali Supabase** configurate in `SETUP.md`
3. **Database** correttamente configurato con tabelle posts/profiles
4. **Node.js** e dipendenze installate

## 🚀 Migrazione Automatica Completa

Per eseguire l'intera migrazione in un solo comando:

```bash
npm run tsx scripts/migrate-blog-complete.ts
```

Questo script eseguirà automaticamente:
1. ✅ Configurazione credenziali database
2. 🌍 Scraping di tutti gli articoli dal sito originale
3. 🔍 Test connessione database
4. 💾 Backup dati esistenti
5. 📥 Importazione nel database
6. ✅ Verifica finale

## 🔧 Migrazione Manuale (Passo-Passo)

Se preferisci eseguire ogni fase manualmente:

### Step 1: Scraping Articoli

```bash
npm run tsx scripts/scrape-bodhidharma-blog.ts
```

Questo estrarrà tutti gli articoli e li salverà in:
- `scripts/scraped-content/blog-articles.json`
- `scripts/scraped-content/blog-backup-[timestamp].json`

### Step 2: Importazione Database

```bash
npm run tsx scripts/import-to-database.ts
```

Questo leggerà il file JSON e importerà tutti gli articoli nel database Supabase.

## 📊 Risultati Attesi

### Dati Estratti
- **Titolo** di ogni articolo
- **Data** di pubblicazione
- **Autore** (default: Comunità Bodhidharma)
- **Contenuto** completo HTML
- **Estratto** (primi 200 caratteri)
- **URL** originale
- **Immagini** collegate

### Database Popolato
- Tabella `posts` con tutti gli articoli importati
- Slug generati automaticamente
- Metadati SEO configurati
- Link al sito originale mantenuti

## 🔍 Verifica Risultati

1. **Controlla il database:**
   ```sql
   SELECT COUNT(*) FROM posts;
   SELECT title, published_at FROM posts ORDER BY published_at DESC;
   ```

2. **Verifica il frontend:**
   - Vai alla pagina Blog del sito
   - Controlla che gli articoli siano visibili
   - Testa la navigazione e la ricerca

3. **Controlla i file salvati:**
   ```bash
   ls -la scripts/scraped-content/
   cat scripts/scraped-content/import-report.json
   ```

## 🛠️ Risoluzione Problemi

### ❌ Errore: "Credenziali Supabase non trovate"

**Soluzione:**
1. Verifica che `SETUP.md` contenga:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   ```
2. Oppure imposta le variabili d'ambiente:
   ```bash
   export VITE_SUPABASE_URL="https://xxx.supabase.co"
   export VITE_SUPABASE_ANON_KEY="eyJxxx..."
   ```

### ❌ Errore: "new row violates row-level security"

**Soluzione:** Disabilita temporaneamente RLS o applica policy permissive:
```bash
npm run tsx scripts/migrate-with-policies.ts
```

### ❌ Errore: "Nessun articolo estratto dal sito"

**Possibili cause:**
1. Il sito è temporaneamente non raggiungibile
2. La struttura HTML è cambiata
3. Problema di connessione internet

**Soluzione:**
1. Riprova dopo qualche minuto
2. Controlla la connessione internet
3. Verifica che il sito sia online: https://www.bodhidharma.info/musangam

### ❌ Articoli duplicati

Il sistema evita automaticamente duplicati basandosi sullo slug, ma se necessario:

```sql
-- Rimuovi duplicati manualmente
DELETE FROM posts 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM posts 
  GROUP BY slug
);
```

## 📁 File e Directory

```
scripts/
├── scrape-bodhidharma-blog.ts    # Script scraping principale
├── import-to-database.ts         # Script importazione database
├── migrate-blog-complete.ts      # Script combinato automatico
├── migrate-with-policies.ts      # Gestione policy RLS
├── MIGRAZIONE-BLOG.md           # Questa guida
└── scraped-content/             # Directory risultati
    ├── blog-articles.json       # Articoli estratti
    ├── blog-backup-*.json       # Backup timestampati
    ├── import-report.json       # Report importazione
    └── backup-existing-posts-*.json # Backup dati esistenti
```

## 🎯 Funzionalità Avanzate

### Backup Automatico
Prima dell'importazione viene creato automaticamente un backup di tutti i post esistenti.

### Gestione Errori
- Retry automatico per errori di rete temporanei
- Logging dettagliato di ogni operazione
- Report finale con statistiche complete

### Pulizia Contenuti
- Rimozione script e stili dal HTML
- Normalizzazione degli spazi
- Generazione automatica di excerpt

### SEO Ottimizzato
- Slug generati da URL o titolo
- Meta description automatica
- Mantenimento link originali

## ✅ Checklist Post-Migrazione

- [ ] Verifica articoli visibili nel frontend
- [ ] Controlla immagini e media
- [ ] Testa funzionalità ricerca
- [ ] Verifica link interni/esterni
- [ ] Ottimizza SEO se necessario
- [ ] Aggiorna sitemap
- [ ] Test responsive su mobile
- [ ] Backup finale del database

## 📞 Supporto

In caso di problemi:
1. Controlla i log di errore dettagliati
2. Verifica i file di report generati
3. Consulta la documentazione Supabase
4. Prova la migrazione manuale passo-passo

---

**Buona migrazione! 🎉** 