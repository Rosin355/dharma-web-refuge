import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// URL base del blog
const BASE_URL = 'https://www.bodhidharma.info/musangam';

// Interfaccia per gli articoli estratti
interface BlogPost {
  title: string;
  date: string;
  author: string;
  content: string;
  excerpt: string;
  url: string;
  tags?: string[];
  images?: string[];
}

// Funzione per fare sleep tra le richieste
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funzione per estrarre i dati di un singolo articolo
async function extractArticle(url: string): Promise<BlogPost | null> {
  try {
    console.log(`🔍 Estraendo articolo: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.log(`❌ Errore nel caricamento: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Estrazione titolo
    let title = $('h1').first().text().trim();
    if (!title) {
      title = $('title').text().replace(' — Bodhidharma', '').trim();
    }
    
    // Estrazione data
    let date = '';
    const dateText = $('.post-meta time, .date, [class*="date"]').first().text().trim();
    if (dateText) {
      date = dateText;
    } else {
      // Cerca pattern data nel testo
      const textContent = $.text();
      const dateMatch = textContent.match(/(\w+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        date = dateMatch[1];
      }
    }
    
    // Estrazione autore
    let author = $('.post-author, .author, [class*="author"]').first().text().trim();
    if (!author) {
      author = 'Comunità Bodhidharma';
    }
    
    // Estrazione contenuto principale
    let content = '';
    const contentSelectors = [
      '.post-content',
      '.entry-content', 
      '.content',
      'article .text',
      '.post-body',
      'main'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.html() || '';
        break;
      }
    }
    
    // Se non trova contenuto con i selettori, prende tutto il body escludendo header/footer
    if (!content) {
      $('header, nav, footer, .navigation, .sidebar').remove();
      content = $('body').html() || '';
    }
    
    // Pulizia del contenuto HTML
    content = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/g, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, '')
      .trim();
    
    // Estrazione excerpt (primi 200 caratteri del testo pulito)
    const textOnly = cheerio.load(content).text();
    const excerpt = textOnly.substring(0, 200).trim() + (textOnly.length > 200 ? '...' : '');
    
    // Estrazione immagini
    const images: string[] = [];
    $('img').each((_, img) => {
      const src = $(img).attr('src');
      if (src) {
        const fullUrl = src.startsWith('http') ? src : new URL(src, url).href;
        images.push(fullUrl);
      }
    });
    
    return {
      title,
      date,
      author,
      content,
      excerpt,
      url,
      images
    };
    
  } catch (error) {
    console.error(`❌ Errore nell'estrazione di ${url}:`, error);
    return null;
  }
}

// Funzione per trovare tutti i link degli articoli dalla pagina principale
async function findArticleLinks(): Promise<string[]> {
  const links: string[] = [];
  
  try {
    console.log('🔍 Cerco tutti i link degli articoli...');
    
    // Prova diverse pagine/offset per trovare tutti gli articoli
    const offsets = [
      '', 
      '?offset=1499888048593',
      '?offset=1517778179569', 
      '?offset=1573206604797'
    ];
    
    for (const offset of offsets) {
      const url = `${BASE_URL}${offset}`;
      console.log(`📄 Scansiono: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Cerca link agli articoli
        $('a[href*="/musangam/"]').each((_, link) => {
          const href = $(link).attr('href');
          if (href && !href.includes('?') && href !== '/musangam/' && href !== '/musangam') {
            const fullUrl = href.startsWith('http') ? href : `https://www.bodhidharma.info${href}`;
            if (!links.includes(fullUrl)) {
              links.push(fullUrl);
            }
          }
        });
        
        // Cerca anche i titoli degli articoli che potrebbero essere link
        $('h1, h2, h3').each((_, heading) => {
          const $heading = $(heading);
          const $parent = $heading.closest('article, .post, .entry');
          if ($parent.length > 0) {
            const link = $parent.find('a').first().attr('href');
            if (link && !links.includes(link)) {
              const fullUrl = link.startsWith('http') ? link : `https://www.bodhidharma.info${link}`;
              links.push(fullUrl);
            }
          }
        });
      }
      
      await sleep(1000); // Pausa tra le richieste
    }
    
  } catch (error) {
    console.error('❌ Errore nella ricerca dei link:', error);
  }
  
  // Rimuovi duplicati e filtra
  const uniqueLinks = Array.from(new Set(links));
  return uniqueLinks.filter(link => 
    link.includes('/musangam/') && 
    !link.includes('?') && 
    link !== `${BASE_URL}/` &&
    link !== BASE_URL
  );
}

// Funzione principale
async function scrapeFullBlog() {
  console.log('🚀 Inizio scraping completo del blog Bodhidharma');
  
  // Crea directory per i risultati
  const outputDir = 'scripts/scraped-content';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Trova tutti i link degli articoli
  const articleLinks = await findArticleLinks();
  console.log(`📋 Trovati ${articleLinks.length} articoli da estrarre`);
  
  if (articleLinks.length === 0) {
    console.log('⚠️  Nessun articolo trovato. Provo con URL statici...');
    
    // Lista statica di URL noti (backup)
    const staticUrls = [
      'https://www.bodhidharma.info/musangam/2019/10/15/approvazione-progetto-assistenza-culto-2019',
      'https://www.bodhidharma.info/musangam/2019/10/10/comunicazioni-per-le-prossime-domeniche',
      'https://www.bodhidharma.info/musangam/2019/9/29/approvazione-del-progetto-assistenza-clero-2019-fondi-ubi-8x1000',
      'https://www.bodhidharma.info/musangam/2017/12/14/cerimonia-i-voti-del-bodhisattva',
      'https://www.bodhidharma.info/musangam/2017/7/20/sacra-rappresentazione-foto-dellevento'
    ];
    
    articleLinks.push(...staticUrls);
  }
  
  const articles: BlogPost[] = [];
  let successCount = 0;
  let failCount = 0;
  
  // Estrai ogni articolo
  for (let i = 0; i < articleLinks.length; i++) {
    const link = articleLinks[i];
    console.log(`\n📝 [${i + 1}/${articleLinks.length}] Elaboro: ${link}`);
    
    const article = await extractArticle(link);
    
    if (article) {
      articles.push(article);
      successCount++;
      console.log(`✅ Successo: "${article.title}"`);
    } else {
      failCount++;
      console.log(`❌ Fallito: ${link}`);
    }
    
    // Pausa tra le richieste per essere rispettosi
    await sleep(2000);
  }
  
  // Salva i risultati
  const outputPath = path.join(outputDir, 'blog-articles.json');
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2), 'utf8');
  
  console.log(`\n🎉 Scraping completato!`);
  console.log(`✅ Successi: ${successCount}`);
  console.log(`❌ Fallimenti: ${failCount}`);
  console.log(`💾 Risultati salvati in: ${outputPath}`);
  
  // Crea anche un file di backup con timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(outputDir, `blog-backup-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(articles, null, 2), 'utf8');
  
  return articles;
}

// Esegui lo scraping se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeFullBlog().catch(console.error);
}

export { scrapeFullBlog, extractArticle, BlogPost }; 