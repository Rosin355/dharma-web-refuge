#!/usr/bin/env node

/**
 * Script per rimuovere tutti gli articoli dal database Supabase
 * 
 * Uso: npm run tsx scripts/delete-all-posts.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
    const { count: currentCount, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    console.log(`📋 Trovati ${currentCount} articoli nel database`);

    if (currentCount === 0) {
      console.log('✅ Il database è già vuoto!');
      return;
    }

    // Conferma dall'utente (simulata - in produzione potresti voler aggiungere una vera conferma)
    console.log(`⚠️  ATTENZIONE: Stai per eliminare ${currentCount} articoli dal database!`);
    console.log('🔄 Procedendo con l\'eliminazione...');

    // Elimina tutti gli articoli
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Elimina tutti tranne un ID impossibile

    if (deleteError) {
      throw deleteError;
    }

    // Verifica che siano stati eliminati
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
if (import.meta.url === `file://${process.argv[1]}`) {
  deleteAllPosts()
    .then(() => {
      console.log('🏁 Script completato con successo');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script fallito:', error.message);
      process.exit(1);
    });
}

export { deleteAllPosts }; 