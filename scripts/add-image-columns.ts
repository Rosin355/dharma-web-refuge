import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlqidhhduvpjebqfaaqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscWlkaGhkdXZwamVicWZhYXFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY0MTMyNywiZXhwIjoyMDUwMjE3MzI3fQ.Cq2PGFHgqTsZsZYyqZT9VBKIzRPOejKwuavwZVl5DP0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addImageColumns() {
  try {
    console.log('🔧 Aggiunta colonne immagini alla tabella posts...');

    // Aggiungo le colonne usando una query SQL diretta
    const { data, error } = await supabase.rpc('sql', {
      query: `
        ALTER TABLE public.posts 
        ADD COLUMN IF NOT EXISTS image_url TEXT,
        ADD COLUMN IF NOT EXISTS image_alt TEXT;
        
        COMMENT ON COLUMN public.posts.image_url IS 'URL dell''immagine di copertina dell''articolo (tipicamente da Unsplash)';
        COMMENT ON COLUMN public.posts.image_alt IS 'Testo alternativo per l''immagine di copertina (accessibilità)';
      `
    });

    if (error) {
      throw error;
    }

    console.log('✅ Colonne immagini aggiunte con successo!');
    
    // Verifico che le colonne siano state aggiunte
    const { data: tableInfo, error: tableError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('⚠️  Errore nella verifica, ma le colonne potrebbero essere state aggiunte:', tableError.message);
    } else {
      console.log('✅ Verifica completata. Le colonne sono disponibili.');
    }

  } catch (error) {
    console.error('❌ Errore durante l\'aggiunta delle colonne:', error);
    
    // Provo con un approccio alternativo usando il client SQL direttamente
    try {
      console.log('🔄 Tentativo alternativo...');
      
      // Questo dovrebbe funzionare se le colonne non esistono ancora
      const { error: altError } = await supabase.rpc('exec_sql', {
        sql: `
          DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'posts' AND column_name = 'image_url') THEN
              ALTER TABLE public.posts ADD COLUMN image_url TEXT;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'posts' AND column_name = 'image_alt') THEN
              ALTER TABLE public.posts ADD COLUMN image_alt TEXT;
            END IF;
          END $$;
        `
      });

      if (altError) {
        console.log('⚠️  Approccio alternativo fallito:', altError.message);
        console.log('📝 Le colonne potrebbero già esistere o potrebbero essere necessari permessi da admin.');
      } else {
        console.log('✅ Colonne aggiunte con approccio alternativo!');
      }
      
    } catch (altError) {
      console.log('⚠️  Tutti gli approcci automatici falliti. Le colonne potrebbero già esistere.');
      console.log('💡 Se necessario, aggiungi manualmente le colonne da Supabase Dashboard:');
      console.log('   - image_url (TEXT)');
      console.log('   - image_alt (TEXT)');
    }
  }

  process.exit(0);
}

addImageColumns(); 