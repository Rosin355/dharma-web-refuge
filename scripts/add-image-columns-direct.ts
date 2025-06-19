import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlqidhhduvpjebqfaaqh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscWlkaGhkdXZwamVicWZhYXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NDEzMjcsImV4cCI6MjA1MDIxNzMyN30.y5t2FDAgEUjc6yqShbCNhDFNpWK7Vj1sVPO4kRLbmHE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addImageColumns() {
  try {
    console.log('🔧 Verifica e aggiunta colonne immagini...');

    // Prima verifichiamo se le colonne esistono già
    const { data: existingPost, error: checkError } = await supabase
      .from('posts')
      .select('id, image_url, image_alt')
      .limit(1);

    if (checkError) {
      if (checkError.message.includes('column') && checkError.message.includes('does not exist')) {
        console.log('❌ Le colonne image_url e image_alt non esistono. Dobbiamo aggiungerle manualmente.');
        console.log('');
        console.log('📝 ISTRUZIONI PER AGGIUNGERE LE COLONNE:');
        console.log('');
        console.log('1. Vai su https://supabase.com/dashboard');
        console.log('2. Seleziona il tuo progetto');
        console.log('3. Vai su "Table Editor" nella sidebar');
        console.log('4. Seleziona la tabella "posts"');
        console.log('5. Clicca su "Add column" (+ in alto a destra)');
        console.log('6. Aggiungi questi due campi:');
        console.log('   - Nome: image_url, Tipo: text, Nullable: true');
        console.log('   - Nome: image_alt, Tipo: text, Nullable: true');
        console.log('7. Salva le modifiche');
        console.log('');
        console.log('🔄 Poi riavvia il server con: npm run dev');
      } else {
        console.error('❌ Errore durante la verifica:', checkError);
      }
    } else {
      console.log('✅ Le colonne image_url e image_alt esistono già!');
      console.log('📊 Trovati', existingPost?.length || 0, 'articoli nel database');
      
      // Mostriamo un esempio di articolo
      if (existingPost && existingPost.length > 0) {
        console.log('📄 Esempio articolo:');
        console.log('   - ID:', existingPost[0].id);
        console.log('   - image_url:', existingPost[0].image_url || 'null');
        console.log('   - image_alt:', existingPost[0].image_alt || 'null');
      }
    }

  } catch (error) {
    console.error('❌ Errore generale:', error);
    console.log('');
    console.log('💡 SOLUZIONE ALTERNATIVA:');
    console.log('Se continui ad avere problemi, aggiungi le colonne manualmente:');
    console.log('');
    console.log('1. Dashboard Supabase → Table Editor → posts');
    console.log('2. Add Column → image_url (text, nullable)');
    console.log('3. Add Column → image_alt (text, nullable)');
  }

  process.exit(0);
}

addImageColumns(); 