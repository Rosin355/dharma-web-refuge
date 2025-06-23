import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configurazione Supabase (dalle credenziali del progetto)
const SUPABASE_URL = 'https://zklgrmeiemzsusmoegby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function extractImagesFromChiSiamo() {
  console.log('🔍 Estraendo immagini da bodhidharma.info/chi-siamo...');
  
  try {
    const response = await fetch('https://www.bodhidharma.info/chi-siamo');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const images = [];
    
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
        if (alt.toLowerCase().includes('maestro') || alt.toLowerCase().includes('monaco') || alt.toLowerCase().includes('taehye') || alt.toLowerCase().includes('taeri') || alt.toLowerCase().includes('kusalananda')) {
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

async function downloadAndUploadImage(image) {
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
      .from('images')
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

async function saveImageToDatabase(image, storageUrl) {
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
  console.log('🚀 STEP 1: Estrazione immagini del tempio dal vecchio sito...\n');
  
  console.log('✅ Configurazione Supabase trovata');
  
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
  
  console.log(`\n✅ STEP 1 COMPLETATO!`);
  console.log(`📊 ${successCount}/${images.length} immagini caricate con successo`);
  
  if (successCount > 0) {
    console.log('\n🎉 Le immagini reali del tempio sostituiranno automaticamente quelle di Unsplash nella pagina Chi Siamo!');
  }
}

// Esegui lo script
main().catch(console.error); 