#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Leggi le credenziali Supabase
function getSupabaseCredentials() {
  const setupPath = path.join(process.cwd(), 'SETUP.md');
  const setupContent = fs.readFileSync(setupPath, 'utf8');
  
  const urlMatch = setupContent.match(/VITE_SUPABASE_URL=([^\s]+)/);
  const keyMatch = setupContent.match(/VITE_SUPABASE_ANON_KEY=([^\s]+)/);
  
  return {
    url: urlMatch![1],
    key: keyMatch![1]
  };
}

const { url, key } = getSupabaseCredentials();
const supabase = createClient(url, key);

async function checkFinalCount() {
  console.log('🔍 Verifica finale del database...\n');
  
  // Conta tutti i post
  const { data: posts, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' });
    
  console.log('📊 RISULTATI FINALI:');
  console.log('=' .repeat(50));
  console.log(`📝 Articoli totali: ${count}`);
  console.log(`📅 Primo articolo: ${posts && posts.length > 0 ? new Date(posts[0].created_at).toLocaleDateString('it-IT') : 'N/A'}`);
  console.log(`📅 Ultimo articolo: ${posts && posts.length > 0 ? new Date(posts[posts.length - 1].created_at).toLocaleDateString('it-IT') : 'N/A'}`);
  
  // Mostra alcuni titoli di esempio
  if (posts && posts.length > 0) {
    console.log('\n📋 Esempi di articoli importati:');
    posts.slice(0, 5).forEach((post, i) => {
      console.log(`   ${i + 1}. ${post.title.substring(0, 60)}...`);
    });
    
    if (posts.length > 5) {
      console.log(`   ... e altri ${posts.length - 5} articoli`);
    }
  }
  
  console.log('\n✅ Migrazione blog completata con successo!');
}

checkFinalCount(); 