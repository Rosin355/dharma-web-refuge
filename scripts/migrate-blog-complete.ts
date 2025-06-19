#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { scrapeFullBlog } from './scrape-bodhidharma-blog';
import { importArticlesToDatabase, testDatabaseConnection } from './import-to-database';

// Ottieni le credenziali Supabase dal file SETUP.md o variabili d'ambiente
function getSupabaseCredentials() {
  try {
    // Prova a leggere da SETUP.md
    const setupPath = path.join(process.cwd(), 'SETUP.md');
    if (fs.existsSync(setupPath)) {
      const setupContent = fs.readFileSync(setupPath, 'utf8');
      
      const urlMatch = setupContent.match(/VITE_SUPABASE_URL=([^\s]+)/);
      const keyMatch = setupContent.match(/VITE_SUPABASE_ANON_KEY=([^\s]+)/);
      
      if (urlMatch && keyMatch) {
        return {
          url: urlMatch[1],
          key: keyMatch[1]
        };
      }
    }
    
    // Fallback: variabili d'ambiente
    return {
      url: process.env.VITE_SUPABASE_URL || '',
      key: process.env.VITE_SUPABASE_ANON_KEY || ''
    };
    
  } catch (error) {
    console.error('❌ Errore lettura credenziali:', error);
    return { url: '', key: '' };
  }
}

// Aggiorna le credenziali nell'import script
function updateDatabaseCredentials() {
  const credentials = getSupabaseCredentials();
  
  if (!credentials.url || !credentials.key) {
    console.error('❌ Credenziali Supabase non trovate!');
    console.log('Assicurati di avere VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY in SETUP.md');
    return false;
  }
  
  const importScriptPath = path.join(process.cwd(), 'scripts', 'import-to-database.ts');
  let importScript = fs.readFileSync(importScriptPath, 'utf8');
  
  // Sostituisci i placeholder con le credenziali reali
  importScript = importScript
    .replace('https://your-project.supabase.co', credentials.url)
    .replace('your-anon-key', credentials.key);
  
  fs.writeFileSync(importScriptPath, importScript, 'utf8');
  console.log('✅ Credenziali Supabase aggiornate');
  return true;
}

// Funzione principale per eseguire l'intera migrazione
async function completeBlogMigration() {
  console.log('🚀 INIZIO MIGRAZIONE COMPLETA DEL BLOG BODHIDHARMA');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  
  try {
    // Step 1: Aggiorna credenziali database
    console.log('\n📋 STEP 1: Configurazione Database');
    const credentialsOk = updateDatabaseCredentials();
    if (!credentialsOk) {
      throw new Error('Impossibile configurare credenziali database');
    }
    
    // Step 2: Scraping degli articoli
    console.log('\n🌍 STEP 2: Scraping Articoli dal Sito Originale');
    console.log('Estraendo contenuti da https://www.bodhidharma.info/musangam...');
    
    const articles = await scrapeFullBlog();
    
    if (!articles || articles.length === 0) {
      throw new Error('Nessun articolo estratto dal sito');
    }
    
    console.log(`✅ Estratti ${articles.length} articoli con successo`);
    
    // Step 3: Verifica connessione database
    console.log('\n🔍 STEP 3: Test Connessione Database');
    
    // Ricarica il modulo import con le nuove credenziali
    const { importArticlesToDatabase: importFunc, testDatabaseConnection: testFunc } = await import('./import-to-database.js');
    
    const isConnected = await testFunc();
    if (!isConnected) {
      throw new Error('Impossibile connettersi al database Supabase');
    }
    
    // Step 4: Backup del database esistente
    console.log('\n💾 STEP 4: Backup Dati Esistenti');
    const credentials = getSupabaseCredentials();
    const supabase = createClient(credentials.url, credentials.key);
    
    const { data: existingPosts } = await supabase
      .from('posts')
      .select('*');
    
    if (existingPosts && existingPosts.length > 0) {
      const backupPath = path.join('scripts/scraped-content', `backup-existing-posts-${Date.now()}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(existingPosts, null, 2), 'utf8');
      console.log(`✅ Backup di ${existingPosts.length} post esistenti salvato in: ${backupPath}`);
    }
    
    // Step 5: Importazione nel database
    console.log('\n📥 STEP 5: Importazione nel Database');
    await importFunc();
    
    // Step 6: Verifica finale
    console.log('\n✅ STEP 6: Verifica Finale');
    const { data: finalPosts, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' });
    
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n🎉 MIGRAZIONE COMPLETATA CON SUCCESSO!');
    console.log('=' .repeat(60));
    console.log(`⏱️  Tempo totale: ${totalTime} secondi`);
    console.log(`📊 Articoli nel database: ${count || finalPosts?.length || 'Sconosciuto'}`);
    console.log(`📁 File salvati in: scripts/scraped-content/`);
    
    console.log('\n📝 Prossimi passi:');
    console.log('1. Verifica gli articoli nel pannello admin del sito');
    console.log('2. Controlla le immagini e aggiusta eventuali link rotti');
    console.log('3. Ottimizza i metadati SEO se necessario');
    console.log('4. Testa la visualizzazione degli articoli nel frontend');
    
  } catch (error) {
    console.error('\n❌ ERRORE DURANTE LA MIGRAZIONE:', error);
    console.log('\n🔧 Suggerimenti per il debug:');
    console.log('1. Verifica la connessione internet');
    console.log('2. Controlla le credenziali Supabase in SETUP.md');
    console.log('3. Assicurati che il database sia configurato correttamente');
    console.log('4. Verifica i permessi RLS se abilitati');
    
    process.exit(1);
  }
}

// Menu interattivo per scegliere cosa fare
async function interactiveMenu() {
  console.log('\n🎯 MIGRAZIONE BLOG COMUNITÀ BODHIDHARMA');
  console.log('=' .repeat(50));
  console.log('Scegli un\'opzione:');
  console.log('A) 🧪 Solo test connessione database');
  console.log('B) 🌍 Solo scraping articoli (senza importazione)');
  console.log('C) 📥 Solo importazione (da file esistente)');
  console.log('D) 🚀 Migrazione completa (scraping + importazione)');
  console.log('E) ❌ Esci');
  
  // In un ambiente non interattivo, esegui la migrazione completa
  console.log('\n⚡ Eseguendo migrazione completa automaticamente...');
  await completeBlogMigration();
}

// Esegui il menu se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  interactiveMenu().catch(console.error);
}

export { completeBlogMigration, updateDatabaseCredentials }; 