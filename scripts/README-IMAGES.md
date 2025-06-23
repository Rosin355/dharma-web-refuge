# 🖼️ Sistema di Estrazione Immagini del Tempio

## 📋 Panoramica

Questo sistema estrae automaticamente le immagini dalla pagina "Chi siamo" del sito originale bodhidharma.info e le carica nel database Supabase per l'utilizzo nel nuovo sito.

## 🛠️ Setup Iniziale

### 1. Database Setup

Prima di tutto, esegui lo script SQL per creare la tabella:

```bash
# Esegui il contenuto di setup-temple-images.sql nel tuo database Supabase
# Vai su: dashboard.supabase.com -> Il tuo progetto -> SQL Editor
# Copia e incolla il contenuto del file setup-temple-images.sql
```

### 2. Storage Setup

Nella console Supabase:
1. Vai su **Storage**
2. Crea un bucket chiamato **"images"** (se non esiste)
3. Impostalo come **pubblico**

### 3. Variabili d'Ambiente

Assicurati di avere queste variabili nel tuo `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Estrazione Immagini

### Esegui lo Script

```bash
cd scripts
npx tsx extract-temple-images.ts
```

### Cosa Fa lo Script

1. **Estrae** le immagini dalla pagina bodhidharma.info/chi-siamo
2. **Categorizza** automaticamente le immagini:
   - `maestri`: Foto dei maestri e monaci
   - `sale`: Sale di meditazione e dharma
   - `esterni`: Giardini e viste esterne
   - `tempio`: Altre immagini del tempio

3. **Scarica** ogni immagine dal sito originale
4. **Carica** su Supabase Storage (bucket `images`)
5. **Salva** i metadati nella tabella `temple_images`

## 📁 Struttura Database

### Tabella `temple_images`

```sql
- id: UUID (primary key)
- filename: nome file originale
- original_url: URL dal sito bodhidharma.info
- storage_url: URL pubblico Supabase Storage
- alt_text: testo alternativo
- category: categoria (maestri, sale, esterni, tempio)
- page_section: sezione del sito (chi-siamo)
- created_at/updated_at: timestamp
```

## 🎨 Utilizzo nelle Pagine

### Hook Personalizzati

Il sistema include hook React per gestire le immagini:

```tsx
import { useTempleCarouselImages, useMasterImages } from '@/hooks/useTempleImages';

// Per il carosello del tempio
const { carouselImages, loading } = useTempleCarouselImages();

// Per le immagini dei maestri
const { masterImages, loading } = useMasterImages();
```

### Esempio d'Uso

```tsx
// Carica immagini per categoria
const { getImagesByCategory } = useTempleImages('chi-siamo');
const saleImages = getImagesByCategory('sale');

// Rendering con fallback
{loading ? (
  <div>Caricamento...</div>
) : (
  carouselImages.map(image => (
    <img 
      key={image.id}
      src={image.storage_url} 
      alt={image.alt_text} 
    />
  ))
)}
```

## 🔧 Personalizzazione

### Aggiungere Nuove Categorie

Nel file `extract-temple-images.ts`, modifica la logica di categorizzazione:

```typescript
// Categorizza le immagini basandosi su alt text o nome file
if (alt.toLowerCase().includes('nuova_categoria')) {
  category = 'nuova_categoria';
}
```

### Estrarre da Altre Pagine

Crea una copia dello script e modifica:

```typescript
// Cambia l'URL di destinazione
const response = await fetch('https://www.bodhidharma.info/altra-pagina');

// Cambia la page_section
page_section: 'altra-pagina'
```

## 📊 Monitoraggio

### Log dello Script

Lo script fornisce log dettagliati:
- ✅ Immagini trovate ed estratte
- 📥 Progresso del download
- 💾 Salvataggio nel database
- 📊 Report finale con statistiche

### Verifica nel Database

```sql
-- Controlla le immagini caricate
SELECT category, COUNT(*) as count 
FROM temple_images 
WHERE page_section = 'chi-siamo' 
GROUP BY category;

-- Visualizza tutte le immagini
SELECT filename, category, alt_text, created_at 
FROM temple_images 
ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### Errori Comuni

1. **"Tabella temple_images non esiste"**
   - Esegui `setup-temple-images.sql` nel database

2. **"Bucket 'images' non trovato"**
   - Crea il bucket nella console Supabase Storage

3. **"Errore di permessi"**
   - Verifica le policies RLS nel database
   - Controlla che l'utente sia autenticato

4. **"Immagini non visualizzate"**
   - Verifica che il bucket sia pubblico
   - Controlla gli URL di storage_url

### Reset Sistema

Per ricominciare da capo:

```sql
-- Elimina tutte le immagini dalla tabella
DELETE FROM temple_images WHERE page_section = 'chi-siamo';

-- Elimina le immagini dallo storage (tramite console web)
```

## 📱 Responsive Design

Le immagini caricate sono ottimizzate per:
- ✅ Design responsive
- ✅ Lazy loading
- ✅ Effetti hover
- ✅ Fallback alle immagini Unsplash

## 🚀 Funzionalità Future

- [ ] Compressione automatica delle immagini
- [ ] WebP conversion
- [ ] Cache intelligente
- [ ] Admin panel per gestione immagini
- [ ] Bulk upload via interfaccia web 