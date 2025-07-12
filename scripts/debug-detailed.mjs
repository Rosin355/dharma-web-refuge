import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zklgrmeiemzsusmoegby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 DEBUG DETTAGLIATO SISTEMA STORAGE\n');

// Verifica tutti i record in temple_images
console.log('1️⃣ Tutti i record in temple_images:');
try {
  const { data: allRecords, error } = await supabase
    .from('temple_images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Errore query:', error);
  } else {
    console.log(`✅ Trovati ${allRecords.length} record totali:\n`);
    
    allRecords.forEach((record, index) => {
      console.log(`📄 Record ${index + 1}:`);
      console.log(`   ID: ${record.id}`);
      console.log(`   Filename: ${record.filename}`);
      console.log(`   Category: ${record.category}`);
      console.log(`   Page Section: ${record.page_section}`);
      console.log(`   Alt Text: ${record.alt_text}`);
      console.log(`   Storage URL: ${record.storage_url}`);
      console.log(`   Created: ${record.created_at}`);
      console.log(`   Updated: ${record.updated_at}\n`);
    });
  }
} catch (err) {
  console.error('❌ Errore durante query:', err);
}

// Verifica tutti i file nel bucket
console.log('2️⃣ Tutti i file nel bucket temple-images:');
try {
  const { data: files, error } = await supabase.storage
    .from('temple-images')
    .list('', { limit: 100 });

  if (error) {
    console.error('❌ Errore lista files:', error);
  } else {
    console.log(`✅ Trovati ${files.length} file totali:\n`);
    
    files.forEach((file, index) => {
      console.log(`📁 File ${index + 1}:`);
      console.log(`   Nome: ${file.name}`);
      console.log(`   Size: ${file.size} bytes`);
      console.log(`   Last Modified: ${file.updated_at}`);
      console.log(`   Metadata: ${JSON.stringify(file.metadata)}\n`);
    });
  }
} catch (err) {
  console.error('❌ Errore durante lista files:', err);
}

console.log('🏁 DEBUG DETTAGLIATO COMPLETATO'); 