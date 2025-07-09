import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { BlogPost } from './scrape-bodhidharma-blog';

// Configurazione Supabase
const supabaseUrl = 'https://zklgrmeiemzsusmoegby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

// Inizializza client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Funzione per convertire data in formato ISO
function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  try {
    // Prova diversi formati di data
    const formats = [
      // "March 11, 2017"
      /(\w+)\s+(\d{1,2}),\s+(\d{4})/,
      // "11/03/2017"
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      // "2017-03-11"
      /(\d{4})-(\d{2})-(\d{2})/
    ];
    
    const months: { [key: string]: number } = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3,
      'May': 4, 'June': 5, 'July': 6, 'August': 7,
      'September': 8, 'October': 9, 'November': 10, 'December': 11,
      'gennaio': 0, 'febbraio': 1, 'marzo': 2, 'aprile': 3,
      'maggio': 4, 'giugno': 5, 'luglio': 6, 'agosto': 7,
      'settembre': 8, 'ottobre': 9, 'novembre': 10, 'dicembre': 11
    };
    
    // Formato "March 11, 2017"
    const match1 = dateStr.match(formats[0]);
    if (match1) {
      const monthName = match1[1];
      const day = parseInt(match1[2]);
      const year = parseInt(match1[3]);
      const monthIndex = months[monthName];
      if (monthIndex !== undefined) {
        return new Date(year, monthIndex, day).toISOString();
      }
    }
    
    // Formato "11/03/2017" o "2017-03-11"
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    // Fallback: data corrente
    return new Date().toISOString();
    
  } catch (error) {
    console.log(`⚠️  Errore nel parsing della data "${dateStr}", uso data corrente`);
    return new Date().toISOString();
  }
}

// Funzione per pulire e preparare il contenuto per il database
function cleanContent(content: string): string {
  if (!content) return '';
  
  return content
    // Rimuovi tag script e style residui
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
    // Rimuovi commenti HTML
    .replace(/<!--[\s\S]*?-->/g, '')
    // Rimuovi attributi non necessari dai tag
    .replace(/\s(class|id|style)="[^"]*"/g, '')
    // Pulisci spazi multipli
    .replace(/\s+/g, ' ')
    .trim();
}

// Funzione per generare slug dall'URL o titolo
function generateSlug(title: string, url?: string): string {
  if (url) {
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== '') {
      return lastPart.toLowerCase();
    }
  }
  
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Rimuovi accenti
    .replace(/[^a-z0-9\s-]/g, '') // Solo lettere, numeri, spazi e trattini
    .replace(/\s+/g, '-') // Sostituisci spazi con trattini
    .replace(/-+/g, '-') // Evita trattini multipli
    .replace(/^-|-$/g, ''); // Rimuovi trattini all'inizio e fine
}

// Funzione principale per importare tutti gli articoli
async function importArticlesToDatabase() {
  console.log('🚀 Inizio importazione articoli nel database');
  
  // Leggi il file JSON con gli articoli estratti
  const articlesPath = path.join('scripts/scraped-content', 'blog-articles.json');
  
  if (!fs.existsSync(articlesPath)) {
    console.error('❌ File degli articoli non trovato. Esegui prima lo scraping.');
    return;
  }
  
  const articlesData = fs.readFileSync(articlesPath, 'utf8');
  const articles: BlogPost[] = JSON.parse(articlesData);
  
  console.log(`📋 Trovati ${articles.length} articoli da importare`);
  
  if (articles.length === 0) {
    console.log('⚠️  Nessun articolo da importare');
    return;
  }
  
  let successCount = 0;
  let failCount = 0;
  const importedSlugs: string[] = [];
  
  // Importa ogni articolo
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`\n📝 [${i + 1}/${articles.length}] Importo: "${article.title}"`);
    
    try {
      // Prepara i dati per l'inserimento
      const slug = generateSlug(article.title, article.url);
      const publishedAt = parseDate(article.date);
      const cleanedContent = cleanContent(article.content);
      
      // Evita duplicati
      if (importedSlugs.includes(slug)) {
        console.log(`⚠️  Slug duplicato, salto: ${slug}`);
        continue;
      }
      
      const postData = {
        title: article.title.substring(0, 255), // Limita lunghezza titolo
        content: cleanedContent,
        excerpt: article.excerpt ? article.excerpt.substring(0, 500) : null, // Limita lunghezza excerpt
        status: 'published',
        published_at: publishedAt,
        author_id: null, // Nessun autore specificato per ora
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Inserisci nel database
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select();
      
      if (error) {
        console.error(`❌ Errore inserimento: ${error.message}`);
        failCount++;
      } else {
        console.log(`✅ Successo: ${data?.[0]?.id || 'ID sconosciuto'}`);
        importedSlugs.push(slug);
        successCount++;
      }
      
    } catch (error) {
      console.error(`❌ Errore generico per "${article.title}":`, error);
      failCount++;
    }
    
    // Piccola pausa per non sovraccaricare il database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n🎉 Importazione completata!`);
  console.log(`✅ Successi: ${successCount}`);
  console.log(`❌ Fallimenti: ${failCount}`);
  
  // Salva report dell'importazione
  const reportPath = path.join('scripts/scraped-content', 'import-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    total_articles: articles.length,
    successful_imports: successCount,
    failed_imports: failCount,
    imported_slugs: importedSlugs
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`📊 Report salvato in: ${reportPath}`);
}

// Funzione per testare la connessione al database
async function testDatabaseConnection() {
  console.log('🔍 Testo connessione database...');
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Errore connessione database:', error.message);
      return false;
    }
    
    console.log('✅ Connessione database OK');
    return true;
    
  } catch (error) {
    console.error('❌ Errore di rete:', error);
    return false;
  }
}

// Esegui importazione se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const main = async () => {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
      await importArticlesToDatabase();
    } else {
      console.error('❌ Impossibile connettersi al database. Verifica le credenziali.');
    }
  };
  
  main().catch(console.error);
}

export { importArticlesToDatabase, testDatabaseConnection }; 