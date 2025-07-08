import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zklgrmeiemzsusmoegby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSampleEvents() {
  console.log('🚀 Aggiunta eventi di esempio...\n');

  try {
    // Controlla se esistono già eventi
    const { data: existingEvents, error: checkError } = await supabase
      .from('events')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Errore nel controllo eventi esistenti:', checkError);
      console.log('\n💡 Suggerimenti:');
      console.log('1. Verifica che il database Supabase sia attivo');
      console.log('2. Controlla le credenziali di accesso');
      console.log('3. Assicurati che la tabella events esista');
      return;
    }

    if (existingEvents && existingEvents.length > 0) {
      console.log('ℹ️  Eventi già presenti nel database');
      console.log('🔄 Vuoi aggiungere comunque gli eventi di esempio? Continuo...\n');
    }

    const sampleEvents = [
      {
        title: 'Ritiro di Meditazione Zen',
        description: 'Un weekend intensivo di pratica meditativa zen nel silenzio e nella natura. Adatto a principianti e praticanti esperti. Durante il ritiro praticheremo zazen, meditazione camminata e ascolteremo insegnamenti sui fondamenti della pratica zen.',
        start_date: '2025-02-15T18:00:00Z',
        end_date: '2025-02-16T17:00:00Z',
        location: 'Centro Monastico Bodhidharma',
        type: 'ritiro',
        max_participants: 20
      },
      {
        title: 'Conferenza: Il Dharma nella Vita Quotidiana',
        description: 'Una serata di approfondimento su come integrare gli insegnamenti buddhisti nella vita moderna con il Maestro Chen. Esploreremo come applicare i principi di mindfulness, compassione e saggezza nelle sfide quotidiane.',
        start_date: '2025-02-22T20:00:00Z',
        end_date: '2025-02-22T22:00:00Z',
        location: 'Sala conferenze del centro',
        type: 'conferenza',
        max_participants: 50
      },
      {
        title: 'Meditazione Camminata nel Bosco',
        description: 'Pratica di meditazione camminata nella natura circostante il monastero. Un\'esperienza di connessione profonda con la natura e con noi stessi, seguendo la tradizione della meditazione in movimento.',
        start_date: '2025-02-08T09:00:00Z',
        end_date: '2025-02-08T11:00:00Z',
        location: 'Sentieri del bosco',
        type: 'meditazione',
        max_participants: 15
      },
      {
        title: 'Workshop: Calligrafia Zen',
        description: 'Impara l\'arte della calligrafia zen come pratica meditativa. Unisci arte e spiritualità in un\'esperienza unica di concentrazione e bellezza. Materiali forniti.',
        start_date: '2025-03-01T14:00:00Z',
        end_date: '2025-03-01T17:00:00Z',
        location: 'Atelier del centro',
        type: 'conferenza',
        max_participants: 12
      },
      {
        title: 'Sesshin di Primavera',
        description: 'Sessione intensiva di meditazione zen di 7 giorni. Un\'immersione profonda nella pratica tradizionale con periodo di silenzio, zazen, lavoro meditativo e insegnamenti del Dharma.',
        start_date: '2025-03-20T16:00:00Z',
        end_date: '2025-03-27T11:00:00Z',
        location: 'Centro Monastico Bodhidharma',
        type: 'ritiro',
        max_participants: 25
      },
      {
        title: 'Serata di Meditazione per Principianti',
        description: 'Introduzione gentile alla pratica meditativa. Perfetto per chi si avvicina per la prima volta alla meditazione. Imparerai le basi della postura, della respirazione e dell\'osservazione mentale.',
        start_date: '2025-02-05T19:30:00Z',
        end_date: '2025-02-05T21:00:00Z',
        location: 'Sala meditazione',
        type: 'meditazione',
        max_participants: 20
      }
    ];

    console.log(`📥 Inserimento di ${sampleEvents.length} eventi...`);

    const { data, error } = await supabase
      .from('events')
      .insert(sampleEvents)
      .select();

    if (error) {
      console.error('❌ Errore nell\'inserimento eventi:', error);
      console.log('\n💡 Possibili soluzioni:');
      console.log('1. Verifica che la tabella events abbia tutti i campi necessari');
      console.log('2. Controlla i permessi RLS per la tabella events');
      console.log('3. Assicurati che il tipo di evento sia uno di quelli consentiti');
      return;
    }

    console.log(`✅ Inseriti con successo ${data?.length || 0} eventi!`);
    console.log('\n📋 Eventi aggiunti:');
    data?.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.type})`);
    });

    console.log('\n🎉 Operazione completata!');
    console.log('\n💡 Prossimi passi:');
    console.log('1. Visita http://localhost:8080/eventi per vedere gli eventi');
    console.log('2. Vai in /admin per gestire gli eventi');
    console.log('3. Se non vedi i campi price, image_url, featured, status negli eventi,');
    console.log('   dovrai aggiungere queste colonne manualmente dal dashboard Supabase');

  } catch (error) {
    console.error('❌ Errore durante l\'operazione:', error);
  }
}

// Esegui lo script
addSampleEvents().then(() => {
  console.log('\n🏁 Script completato');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Errore fatale:', error);
  process.exit(1);
}); 