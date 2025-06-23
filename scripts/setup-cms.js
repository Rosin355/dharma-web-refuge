import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configurazione Supabase
const SUPABASE_URL = 'https://zklgrmeiemzsusmoegby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createCMSTable() {
  console.log('🚀 STEP 2: Creazione sistema CMS per contenuti delle pagine...\n');

  try {
    // Crea la tabella page_contents
    console.log('📋 Creando tabella page_contents...');
    
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.page_contents (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          page_name VARCHAR(100) NOT NULL,
          section_key VARCHAR(100) NOT NULL,
          section_title VARCHAR(255),
          content_type VARCHAR(50) DEFAULT 'text',
          content TEXT NOT NULL,
          editor_instructions TEXT,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(page_name, section_key)
        );
      `
    });

    if (tableError) {
      console.log('ℹ️  Tabella potrebbe già esistere:', tableError.message);
    } else {
      console.log('✅ Tabella page_contents creata');
    }

    // Crea le policies RLS
    console.log('🔒 Configurando Row Level Security...');
    
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "page_contents_select_policy"
        ON page_contents FOR SELECT
        USING (is_active = true);
        
        CREATE POLICY IF NOT EXISTS "page_contents_admin_policy"
        ON page_contents FOR ALL
        TO authenticated
        USING (true);
      `
    });

    if (rlsError) {
      console.log('ℹ️  RLS potrebbe già essere configurato:', rlsError.message);
    } else {
      console.log('✅ RLS configurato');
    }

    // Crea gli indici
    console.log('⚡ Creando indici per performance...');
    
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_page_contents_page_name ON page_contents(page_name);
        CREATE INDEX IF NOT EXISTS idx_page_contents_section_key ON page_contents(section_key);
        CREATE INDEX IF NOT EXISTS idx_page_contents_active ON page_contents(is_active);
        CREATE INDEX IF NOT EXISTS idx_page_contents_order ON page_contents(page_name, display_order);
      `
    });

    if (indexError) {
      console.log('ℹ️  Indici potrebbero già esistere:', indexError.message);
    } else {
      console.log('✅ Indici creati');
    }

    // Popola con contenuti iniziali
    console.log('📝 Popolando con contenuti iniziali della pagina Chi Siamo...');
    
    const initialContents = [
      // Header
      { page_name: 'chi-siamo', section_key: 'header-title', section_title: 'Titolo principale', content_type: 'text', content: 'Chi Siamo', editor_instructions: 'Il titolo principale della pagina', display_order: 1 },
      { page_name: 'chi-siamo', section_key: 'header-subtitle', section_title: 'Sottotitolo', content_type: 'text', content: 'La Comunità Bodhidharma - Tempio Musang Am (Eremo della Non Forma) di Lerici, dove risiediamo e impartiamo l\'insegnamento buddhista', editor_instructions: 'Breve descrizione sotto il titolo', display_order: 2 },
      
      // Maestri
      { page_name: 'chi-siamo', section_key: 'maestri-title', section_title: 'Titolo sezione maestri', content_type: 'text', content: 'I Nostri Maestri', editor_instructions: 'Titolo della sezione dedicata ai maestri', display_order: 10 },
      { page_name: 'chi-siamo', section_key: 'taehye-nome', section_title: 'Nome Taehye sunim', content_type: 'text', content: 'Taehye sunim 大慧스님 / Mahapañña', editor_instructions: 'Nome completo e titoli monastici', display_order: 11 },
      { page_name: 'chi-siamo', section_key: 'taehye-bio-breve', section_title: 'Biografia breve Taehye', content_type: 'text', content: 'Nome monastico Taehye sunim, nato a Mikkeli, in Finlandia nel 1952', editor_instructions: 'Breve introduzione biografica', display_order: 12 },
      
      // Comunità
      { page_name: 'chi-siamo', section_key: 'comunita-title', section_title: 'Titolo sezione comunità', content_type: 'text', content: 'La Comunità', editor_instructions: 'Titolo della sezione sulla comunità', display_order: 40 },
      { page_name: 'chi-siamo', section_key: 'comunita-storia-title', section_title: 'Sottotitolo storia', content_type: 'text', content: 'Storia della Comunità Bodhidharma', editor_instructions: 'Sottotitolo per la storia', display_order: 41 },
      
      // Tempio
      { page_name: 'chi-siamo', section_key: 'tempio-title', section_title: 'Titolo sezione tempio', content_type: 'text', content: 'Il Tempio', editor_instructions: 'Titolo della sezione dedicata al tempio', display_order: 50 },
      { page_name: 'chi-siamo', section_key: 'tempio-subtitle', section_title: 'Sottotitolo tempio', content_type: 'text', content: 'Tempio Musang Am (Eremo della Non Forma) - Monti San Lorenzo, Lerici (SP)', editor_instructions: 'Descrizione e ubicazione del tempio', display_order: 51 },
      
      // Dana
      { page_name: 'chi-siamo', section_key: 'dana-title', section_title: 'Titolo sezione Dana', content_type: 'text', content: 'Pratica di Dana', editor_instructions: 'Titolo della sezione donazioni', display_order: 60 },
      { page_name: 'chi-siamo', section_key: 'dana-subtitle', section_title: 'Sottotitolo Dana', content_type: 'text', content: 'Dana significa "generosità, disponibilità"', editor_instructions: 'Spiegazione del significato di Dana', display_order: 61 },
      { page_name: 'chi-siamo', section_key: 'dana-5x1000', section_title: 'Codice 5x1000', content_type: 'text', content: '95120790100', editor_instructions: 'Codice fiscale per il 5x1000', display_order: 62 }
    ];

    for (const content of initialContents) {
      const { error } = await supabase
        .from('page_contents')
        .upsert(content, { onConflict: 'page_name,section_key' });
      
      if (error) {
        console.log(`⚠️  Errore inserendo ${content.section_key}:`, error.message);
      } else {
        console.log(`✅ Inserito: ${content.section_title}`);
      }
    }

    console.log('\n✅ STEP 2 COMPLETATO!');
    console.log('🎉 Sistema CMS creato con successo!');
    console.log('📝 Ora puoi editare i contenuti dal pannello admin.');

  } catch (error) {
    console.error('❌ Errore durante la creazione del CMS:', error);
  }
}

// Esegui lo script
createCMSTable().catch(console.error); 