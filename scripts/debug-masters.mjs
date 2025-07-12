import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zklgrmeiemzsusmoegby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 DEBUG IMMAGINI MAESTRI\n');

// Verifica immagini maestri
console.log('1️⃣ Tutte le immagini categoria "maestri":');
try {
  const { data: masterImages, error } = await supabase
    .from('temple_images')
    .select('*')
    .eq('category', 'maestri')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Errore query maestri:', error);
  } else {
    console.log(`✅ Trovate ${masterImages.length} immagini maestri:\n`);
    
    masterImages.forEach((img, index) => {
      console.log(`📄 Immagine ${index + 1}:`);
      console.log(`   ID: ${img.id}`);
      console.log(`   Filename: ${img.filename}`);
      console.log(`   Alt Text: ${img.alt_text}`);
      console.log(`   Storage URL: ${img.storage_url}`);
      console.log(`   Page Section: ${img.page_section}`);
      console.log(`   Created: ${img.created_at}`);
      console.log(`   Updated: ${img.updated_at}\n`);
    });
  }
} catch (err) {
  console.error('❌ Errore durante query maestri:', err);
}

// Test URL delle immagini
console.log('2️⃣ Test accessibilità URL delle immagini:');
try {
  const { data: recentMasters, error } = await supabase
    .from('temple_images')
    .select('*')
    .eq('category', 'maestri')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('❌ Errore query recenti:', error);
  } else {
    for (const img of recentMasters) {
      console.log(`\n🔗 Test URL: ${img.alt_text}`);
      console.log(`   URL: ${img.storage_url}`);
      
      try {
        const response = await fetch(img.storage_url, { method: 'HEAD' });
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        console.log(`   Content-Length: ${response.headers.get('content-length')}`);
      } catch (fetchErr) {
        console.error(`   ❌ Errore fetch: ${fetchErr.message}`);
      }
    }
  }
} catch (err) {
  console.error('❌ Errore durante test URL:', err);
}

// Verifica conteggio per categoria
console.log('\n3️⃣ Conteggio finale per categoria:');
try {
  const { data: counts, error } = await supabase
    .from('temple_images')
    .select('category')
    .not('category', 'in', '("test", "test-rls")'); // Escludi record di test

  if (error) {
    console.error('❌ Errore conteggio:', error);
  } else {
    const breakdown = counts.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Breakdown categorie:');
    Object.entries(breakdown).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} immagini`);
    });
  }
} catch (err) {
  console.error('❌ Errore durante conteggio:', err);
}

console.log('\n🏁 DEBUG MAESTRI COMPLETATO!'); 