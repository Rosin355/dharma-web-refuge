import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configurazione Supabase (sostituire con le proprie credenziali)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ExtractedImage {
  url: string;
  alt: string;
  filename: string;
  category: string;
}

async function extractImagesFromChiSiamo(): Promise<ExtractedImage[]> {
  console.log('🔍 Estraendo immagini da bodhidharma.info/chi-siamo...');
  
  try {
    const response = await fetch('https://www.bodhidharma.info/chi-siamo');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const images: ExtractedImage[] = [];
    
    // Estraggo tutte le immagini dalla pagina
    $('img').each((index, element) => {
      const $img = $(element);
      let src = $img.attr('src') || '';
      const alt = $img.attr('alt') || $img.attr('title') || `Immagine ${index + 1}`;
      
      // Converti URL relativi in assoluti
      if (src.startsWith('/')) {
        src = 'https://www.bodhidharma.info' + src;
      } else if (src.startsWith('./') || !src.startsWith('http')) {
        src = 'https://www.bodhidharma.info/' + src.replace('./', '');
      }
      
      // Filtra solo immagini valide
      if (src && (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp'))) {
        const filename = path.basename(new URL(src).pathname);
        let category = 'tempio';
        
        // Categorizza le immagini basandosi su alt text o nome file
        if (alt.toLowerCase().includes('maestro') || alt.toLowerCase().includes('monaco')) {
          category = 'maestri';
        } else if (alt.toLowerCase().includes('sala') || alt.toLowerCase().includes('dharma')) {
          category = 'sale';
        } else if (alt.toLowerCase().includes('giardino') || alt.toLowerCase().includes('esterno')) {
          category = 'esterni';
        }
        
        images.push({
          url: src,
          alt: alt,
          filename: filename,
          category: category
        });
      }
    });
    
    console.log(`✅ Trovate ${images.length} immagini`);
    return images;
    
  } catch (error) {
    console.error('❌ Errore nell\'estrazione delle immagini:', error);
    return [];
  }
}

async function downloadAndUploadImage(image: ExtractedImage): Promise<string | null> {
  try {
    console.log(`📥 Scaricando ${image.filename}...`);
    
    // Scarica l'immagine
    const response = await fetch(image.url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Upload su Supabase Storage
    const filePath = `temple-images/${image.category}/${image.filename}`;
    
    const { data, error } = await supabase.storage
      .from('images') // Nome del bucket (da creare se non esiste)
      .upload(filePath, uint8Array, {
        contentType: response.headers.get('content-type') || 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error(`❌ Errore upload ${image.filename}:`, error);
      return null;
    }
    
    // Ottieni URL pubblico
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    console.log(`✅ Upload completato: ${image.filename}`);
    return urlData.publicUrl;
    
  } catch (error) {
    console.error(`❌ Errore con ${image.filename}:`, error);
    return null;
  }
}

async function createImagesTable() {
  console.log('🔧 Creando tabella temple_images...');
  
  // SQL per creare la tabella se non esiste
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS temple_images (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_url TEXT NOT NULL,
      storage_url TEXT NOT NULL,
      alt_text TEXT,
      category VARCHAR(100),
      page_section VARCHAR(100) DEFAULT 'chi-siamo',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- RLS (Row Level Security)
    ALTER TABLE temple_images ENABLE ROW LEVEL SECURITY;
    
    -- Policy per lettura pubblica
    CREATE POLICY IF NOT EXISTS "temple_images_select_policy" ON temple_images
      FOR SELECT USING (true);
    
    -- Policy per inserimento (solo admin)
    CREATE POLICY IF NOT EXISTS "temple_images_insert_policy" ON temple_images
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
    -- Trigger per updated_at
    CREATE OR REPLACE FUNCTION update_temple_images_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    DROP TRIGGER IF EXISTS temple_images_updated_at_trigger ON temple_images;
    CREATE TRIGGER temple_images_updated_at_trigger
      BEFORE UPDATE ON temple_images
      FOR EACH ROW
      EXECUTE FUNCTION update_temple_images_updated_at();
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (error) {
      console.log('ℹ️  Tabella potrebbe già esistere o essere stata creata manualmente');
    } else {
      console.log('✅ Tabella temple_images creata con successo');
    }
  } catch (error) {
    console.log('ℹ️  Procedo senza creare la tabella (potrebbe già esistere)');
  }
}

async function saveImageToDatabase(image: ExtractedImage, storageUrl: string) {
  try {
    const { error } = await supabase
      .from('temple_images')
      .insert({
        filename: image.filename,
        original_url: image.url,
        storage_url: storageUrl,
        alt_text: image.alt,
        category: image.category,
        page_section: 'chi-siamo'
      });
    
    if (error) {
      console.error(`❌ Errore salvando ${image.filename} nel database:`, error);
    } else {
      console.log(`💾 ${image.filename} salvato nel database`);
    }
  } catch (error) {
    console.error(`❌ Errore database per ${image.filename}:`, error);
  }
}

async function main() {
  console.log('🚀 Avvio estrazione immagini del tempio...\n');
  
  // Verifica configurazione Supabase
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Configurare VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nelle variabili d\'ambiente');
    process.exit(1);
  }
  
  // Crea la tabella se necessario
  await createImagesTable();
  
  // Estrai immagini dal sito
  const images = await extractImagesFromChiSiamo();
  
  if (images.length === 0) {
    console.log('❌ Nessuna immagine trovata');
    return;
  }
  
  console.log('\n📋 Immagini trovate:');
  images.forEach((img, index) => {
    console.log(`${index + 1}. ${img.filename} (${img.category}) - ${img.alt}`);
  });
  
  console.log('\n📤 Avvio upload...\n');
  
  let successCount = 0;
  
  for (const image of images) {
    const storageUrl = await downloadAndUploadImage(image);
    
    if (storageUrl) {
      await saveImageToDatabase(image, storageUrl);
      successCount++;
    }
    
    // Pausa per evitare rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ Processo completato!`);
  console.log(`📊 ${successCount}/${images.length} immagini caricate con successo`);
  
  // Genera il report
  console.log('\n📝 Per usare le immagini nella pagina ChiSiamo.tsx:');
  console.log('1. Importa: import { supabase } from "@/integrations/supabase/client"');
  console.log('2. Carica le immagini con: supabase.from("temple_images").select("*").eq("category", "categoria")');
  console.log('3. Usa storage_url per il src delle immagini');
}

// Esegui solo se chiamato direttamente
if (require.main === module) {
  main().catch(console.error);
}

export { extractImagesFromChiSiamo, downloadAndUploadImage, createImagesTable }; 