import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = 'https://zklgrmeiemzsusmoegby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugStorage() {
  console.log('🔍 DEBUG SISTEMA STORAGE SUPABASE\n');

  try {
    // 1. Verifica connessione generale
    console.log('1️⃣ Verifica connessione Supabase...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log('⚠️  Non autenticato:', authError.message);
    } else {
      console.log('✅ Connessione OK, utente:', user?.email || 'Anonimo');
    }

    // 2. Lista tutti i buckets disponibili
    console.log('\n2️⃣ Lista buckets disponibili...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Errore lista buckets:', bucketsError);
    } else {
      console.log('📁 Buckets trovati:');
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'pubblico' : 'privato'})`);
      });
    }

    // 3. Testa il bucket 'images'
    console.log('\n3️⃣ Test bucket "images"...');
    const { data: imagesBucketFiles, error: imagesError } = await supabase.storage
      .from('images')
      .list('', { limit: 5 });

    if (imagesError) {
      console.error('❌ Errore accesso bucket "images":', imagesError);
      
      // Tenta di creare il bucket se non esiste
      console.log('🔧 Tentativo creazione bucket "images"...');
      const { data: createData, error: createError } = await supabase.storage
        .createBucket('images', { public: true });
        
      if (createError) {
        console.error('❌ Impossibile creare bucket:', createError);
      } else {
        console.log('✅ Bucket "images" creato con successo!');
      }
    } else {
      console.log(`✅ Bucket "images" accessibile, ${imagesBucketFiles?.length || 0} file trovati`);
    }

    // 4. Testa il bucket 'temple-images' 
    console.log('\n4️⃣ Test bucket "temple-images"...');
    const { data: templeFiles, error: templeError } = await supabase.storage
      .from('temple-images')
      .list('', { limit: 5 });

    if (templeError) {
      console.error('❌ Errore accesso bucket "temple-images":', templeError);
    } else {
      console.log(`✅ Bucket "temple-images" accessibile, ${templeFiles?.length || 0} file trovati`);
    }

    // 5. Verifica tabella temple_images
    console.log('\n5️⃣ Verifica tabella "temple_images"...');
    const { data: tableData, error: tableError } = await supabase
      .from('temple_images')
      .select('*')
      .limit(3);

    if (tableError) {
      console.error('❌ Errore accesso tabella:', tableError);
    } else {
      console.log(`✅ Tabella "temple_images" accessibile, ${tableData?.length || 0} record trovati`);
      if (tableData && tableData.length > 0) {
        console.log('📝 Esempio record:');
        console.log(JSON.stringify(tableData[0], null, 2));
      }
    }

    // 6. Test upload simulato (senza file reale)
    console.log('\n6️⃣ Test policy inserimento...');
    const testData = {
      filename: 'test-debug.jpg',
      storage_url: 'https://example.com/test.jpg',
      original_url: 'https://example.com/test.jpg',
      alt_text: 'Test debug',
      category: 'test',
      page_section: 'debug'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('temple_images')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('❌ Errore test inserimento:', insertError);
      if (insertError.message.includes('row-level security')) {
        console.log('💡 Problema: Policy RLS bloccano l\'inserimento');
        console.log('💡 Soluzione: Aggiungere policy o disabilitare RLS temporaneamente');
      }
    } else {
      console.log('✅ Test inserimento riuscito, record creato:', insertData[0]?.id);
      
      // Pulisci il record di test
      await supabase
        .from('temple_images')
        .delete()
        .eq('id', insertData[0].id);
      console.log('🧹 Record di test eliminato');
    }

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }

  console.log('\n🏁 DEBUG COMPLETATO\n');
  console.log('📝 RACCOMANDAZIONI:');
  console.log('1. Assicurati che il bucket "images" esista e sia pubblico');
  console.log('2. Verifica le policy RLS sulla tabella temple_images');
  console.log('3. Controlla i permessi di autenticazione');
  console.log('4. Se serve, disabilita temporaneamente RLS per test');
}

// Esegui il debug
debugStorage().then(() => {
  console.log('✅ Script completato');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script fallito:', error);
  process.exit(1);
}); 