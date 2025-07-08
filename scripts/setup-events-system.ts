import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwqnzwpqhxmfcjqrckpe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cW56d3BxaHhtZmNqcXJja3BlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDI4MDc1NCwiZXhwIjoyMDQ5ODU2NzU0fQ.wMsOV7QKpHfPzFJ9SzqXJvkH6gNnNHiWO_wRb6h8OVQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupEventsSystem() {
  console.log('🚀 Avvio setup sistema eventi...\n');

  try {
    // 1. Aggiungi colonne alla tabella events
    console.log('📝 Aggiornamento schema tabella events...');
    
    const alterTableQueries = [
      'ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price TEXT;',
      'ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;',
      'ALTER TABLE public.events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;',
      'ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT \'draft\' CHECK (status IN (\'draft\', \'published\', \'cancelled\'));'
    ];

    for (const query of alterTableQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error && !error.message.includes('column') && !error.message.includes('already exists')) {
        console.error(`❌ Errore nell'esecuzione query: ${query}`, error);
      }
    }

    // 2. Crea tabella event_bookings
    console.log('📋 Creazione tabella event_bookings...');
    
    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS public.event_bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
        user_name TEXT NOT NULL,
        user_email TEXT NOT NULL,
        user_phone TEXT,
        participants_count INTEGER DEFAULT 1,
        message TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'paid')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: createTableError } = await supabase.rpc('exec_sql', { sql: createBookingsTable });
    if (createTableError && !createTableError.message.includes('already exists')) {
      console.error('❌ Errore nella creazione tabella event_bookings:', createTableError);
    }

    // 3. Configura RLS per event_bookings
    console.log('🔒 Configurazione RLS per event_bookings...');
    
    const rlsQueries = [
      'ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;',
      `CREATE POLICY IF NOT EXISTS "Anyone can insert bookings" ON public.event_bookings
        FOR INSERT WITH CHECK (true);`,
      `CREATE POLICY IF NOT EXISTS "Admins can view all bookings" ON public.event_bookings
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
          )
        );`,
      `CREATE POLICY IF NOT EXISTS "Admins can update bookings" ON public.event_bookings
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
          )
        );`
    ];

    for (const query of rlsQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error && !error.message.includes('already exists')) {
        console.error(`❌ Errore RLS: ${query}`, error);
      }
    }

    // 4. Crea trigger per updated_at
    console.log('⚙️  Creazione trigger per event_bookings...');
    
    const triggerQueries = [
      `CREATE OR REPLACE FUNCTION update_event_bookings_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';`,
      `DROP TRIGGER IF EXISTS update_event_bookings_updated_at ON public.event_bookings;`,
      `CREATE TRIGGER update_event_bookings_updated_at 
          BEFORE UPDATE ON public.event_bookings
          FOR EACH ROW EXECUTE FUNCTION update_event_bookings_updated_at();`
    ];

    for (const query of triggerQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error(`❌ Errore trigger: ${query}`, error);
      }
    }

    // 5. Inserisci eventi di esempio
    console.log('📅 Inserimento eventi di esempio...');
    
    const sampleEvents = [
      {
        title: 'Ritiro di Meditazione Zen',
        description: 'Un weekend intensivo di pratica meditativa zen nel silenzio e nella natura. Adatto a principianti e praticanti esperti. Durante il ritiro praticheremo zazen, meditazione camminata e ascolteremo insegnamenti sui fondamenti della pratica zen.',
        start_date: '2025-02-15T18:00:00Z',
        end_date: '2025-02-16T17:00:00Z',
        location: 'Centro Monastico Bodhidharma',
        type: 'ritiro',
        max_participants: 20,
        price: '€150',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: true,
        status: 'published'
      },
      {
        title: 'Conferenza: Il Dharma nella Vita Quotidiana',
        description: 'Una serata di approfondimento su come integrare gli insegnamenti buddhisti nella vita moderna con il Maestro Chen. Esploreremo come applicare i principi di mindfulness, compassione e saggezza nelle sfide quotidiane.',
        start_date: '2025-02-22T20:00:00Z',
        end_date: '2025-02-22T22:00:00Z',
        location: 'Sala conferenze del centro',
        type: 'conferenza',
        max_participants: 50,
        price: 'Offerta libera',
        image_url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: false,
        status: 'published'
      },
      {
        title: 'Meditazione Camminata nel Bosco',
        description: 'Pratica di meditazione camminata nella natura circostante il monastero. Un\'esperienza di connessione profonda con la natura e con noi stessi, seguendo la tradizione della meditazione in movimento.',
        start_date: '2025-02-08T09:00:00Z',
        end_date: '2025-02-08T11:00:00Z',
        location: 'Sentieri del bosco',
        type: 'meditazione',
        max_participants: 15,
        price: '€20',
        image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: false,
        status: 'published'
      },
      {
        title: 'Workshop: Calligrafia Zen',
        description: 'Impara l\'arte della calligrafia zen come pratica meditativa. Unisci arte e spiritualità in un\'esperienza unica di concentrazione e bellezza. Materiali forniti.',
        start_date: '2025-03-01T14:00:00Z',
        end_date: '2025-03-01T17:00:00Z',
        location: 'Atelier del centro',
        type: 'conferenza',
        max_participants: 12,
        price: '€80',
        image_url: 'https://images.unsplash.com/photo-1544373884-5d7f2017d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: true,
        status: 'published'
      },
      {
        title: 'Sesshin di Primavera',
        description: 'Sessione intensiva di meditazione zen di 7 giorni. Un\'immersione profonda nella pratica tradizionale con periodo di silenzio, zazen, lavoro meditativo e insegnamenti del Dharma.',
        start_date: '2025-03-20T16:00:00Z',
        end_date: '2025-03-27T11:00:00Z',
        location: 'Centro Monastico Bodhidharma',
        type: 'ritiro',
        max_participants: 25,
        price: '€420',
        image_url: 'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: true,
        status: 'published'
      },
      {
        title: 'Serata di Meditazione per Principianti',
        description: 'Introduzione gentile alla pratica meditativa. Perfetto per chi si avvicina per la prima volta alla meditazione. Imparerai le basi della postura, della respirazione e dell\'osservazione mentale.',
        start_date: '2025-02-05T19:30:00Z',
        end_date: '2025-02-05T21:00:00Z',
        location: 'Sala meditazione',
        type: 'meditazione',
        max_participants: 20,
        price: '€15',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        featured: false,
        status: 'published'
      }
    ];

    // Controlla se esistono già eventi
    const { data: existingEvents, error: checkError } = await supabase
      .from('events')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Errore nel controllo eventi esistenti:', checkError);
      return;
    }

    if (existingEvents && existingEvents.length > 0) {
      console.log('ℹ️  Eventi già presenti nel database, salto l\'inserimento...');
    } else {
      const { data, error } = await supabase
        .from('events')
        .insert(sampleEvents)
        .select();

      if (error) {
        console.error('❌ Errore nell\'inserimento eventi:', error);
      } else {
        console.log(`✅ Inseriti ${data?.length || 0} eventi di esempio`);
      }
    }

    console.log('\n🎉 Setup sistema eventi completato con successo!');
    console.log('📋 Riepilogo:');
    console.log('   - Schema tabella events aggiornato');
    console.log('   - Tabella event_bookings creata');
    console.log('   - Policy RLS configurate');
    console.log('   - Trigger per updated_at configurato');
    console.log('   - Eventi di esempio inseriti');
    console.log('\n💡 Ora puoi:');
    console.log('   - Visitare /eventi per vedere gli eventi');
    console.log('   - Andare in /admin (tab Eventi) per gestire eventi e prenotazioni');
    console.log('   - Testare le prenotazioni dal frontend');

  } catch (error) {
    console.error('❌ Errore durante il setup:', error);
  }
}

// Esegui lo script
setupEventsSystem().then(() => {
  console.log('\n🏁 Script completato');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Errore fatale:', error);
  process.exit(1);
}); 