#!/usr/bin/env node

/**
 * Script per rimuovere tutti gli articoli dal database Supabase
 * 
 * Uso: node scripts/delete-all-posts.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funzione per leggere le credenziali da SETUP.md
function readSupabaseCredentials() {
  const setupPath = path.join(__dirname, '..', 'SETUP.md');
  
  if (!fs.existsSync(setupPath)) {
    throw new Error('File SETUP.md non trovato. Assicurati che esista nella root del progetto.');
  }

  const setupContent = fs.readFileSync(setupPath, 'utf-8');
  
  // Estrai URL e KEY dai commenti nel file
  const urlMatch = setupContent.match(/VITE_SUPABASE_URL=([^\s]+)/);
  const keyMatch = setupContent.match(/VITE_SUPABASE_ANON_KEY=([^\s]+)/);
  
  if (!urlMatch || !keyMatch) {
    throw new Error('Credenziali Supabase non trovate in SETUP.md');
  }

  return {
    url: urlMatch[1],
    key: keyMatch[1]
  };
}

async function deleteAllPosts() {
  try {
    console.log('🔑 Lettura credenziali Supabase...');
    const { url, key } = readSupabaseCredentials();
    
    console.log('🔗 Connessione al database...');
    const supabase = createClient(url, key);

    // Prima conta quanti articoli ci sono
    console.log('📊 Controllo articoli esistenti...');
    const { data: allPosts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📋 Trovati ${allPosts.length} articoli nel database`);

    if (allPosts.length === 0) {
      console.log('✅ Il database è già vuoto!');
      return;
    }

    // Mostra alcuni esempi
    console.log('📄 Alcuni articoli che verranno eliminati:');
    allPosts.slice(0, 5).forEach((post, i) => {
      console.log(`   ${i + 1}. ${post.title.substring(0, 50)}...`);
    });
    if (allPosts.length > 5) {
      console.log(`   ... e altri ${allPosts.length - 5} articoli`);
    }

    console.log(`⚠️  ATTENZIONE: Stai per eliminare ${allPosts.length} articoli dal database!`);
    console.log('🔄 Procedendo con l\'eliminazione...');

    // Elimina gli articoli in batch di 50
    let deletedCount = 0;
    const batchSize = 50;
    
    for (let i = 0; i < allPosts.length; i += batchSize) {
      const batch = allPosts.slice(i, i + batchSize);
      const batchIds = batch.map(post => post.id);
      
      console.log(`🗑️  Eliminando batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allPosts.length / batchSize)} (${batch.length} articoli)...`);
      
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .in('id', batchIds);

      if (deleteError) {
        console.error(`❌ Errore eliminazione batch:`, deleteError);
        throw deleteError;
      }
      
      deletedCount += batch.length;
      console.log(`   ✅ Eliminati ${deletedCount}/${allPosts.length} articoli`);
    }

    // Verifica finale
    const { count: finalCount, error: finalCountError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (finalCountError) {
      throw finalCountError;
    }

    console.log('✅ Eliminazione completata!');
    console.log(`📊 Articoli rimasti: ${finalCount}`);
    
    if (finalCount === 0) {
      console.log('🎉 Database completamente pulito!');
    } else {
      console.log(`⚠️  Attenzione: ${finalCount} articoli non sono stati eliminati`);
    }

  } catch (error) {
    console.error('❌ Errore durante l\'eliminazione:', error);
    throw error;
  }
}

// Esegui se chiamato direttamente
deleteAllPosts()
  .then(() => {
    console.log('🏁 Script completato con successo');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script fallito:', error.message);
    process.exit(1);
  }); 