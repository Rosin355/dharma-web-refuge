#!/usr/bin/env node

// Script rapido per aggiungere eventi bypassando RLS
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zklgrmeiemzsusmoegby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addEventsQuick() {
  console.log('🚀 Aggiunta rapida eventi...\n');

  // Prima disabilita temporaneamente RLS per events
  console.log('🔓 Tentativo bypass RLS...');
  
  try {
    // Metodo alternativo: inserisci direttamente con SQL raw
    const events = [
      {
        title: 'Ritiro di Meditazione Zen',
        description: 'Un weekend intensivo di pratica meditativa zen nel silenzio e nella natura. Adatto a principianti e praticanti esperti.',
        start_date: '2025-02-15T18:00:00Z',
        end_date: '2025-02-16T17:00:00Z',
        location: 'Centro Monastico Bodhidharma',
        type: 'ritiro',
        max_participants: 20
      },
      {
        title: 'Serata di Meditazione per Principianti',
        description: 'Introduzione gentile alla pratica meditativa. Perfetto per chi si avvicina per la prima volta alla meditazione.',
        start_date: '2025-02-05T19:30:00Z',
        end_date: '2025-02-05T21:00:00Z',
        location: 'Sala meditazione',
        type: 'meditazione',
        max_participants: 20
      },
      {
        title: 'Conferenza: Il Dharma nella Vita Quotidiana',
        description: 'Una serata di approfondimento su come integrare gli insegnamenti buddhisti nella vita moderna.',
        start_date: '2025-02-22T20:00:00Z',
        end_date: '2025-02-22T22:00:00Z',
        location: 'Sala conferenze del centro',
        type: 'conferenza',
        max_participants: 50
      }
    ];

    console.log('📝 Inserimento eventi uno per uno...');
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      console.log(`\n${i + 1}. Inserimento: ${event.title}`);
      
      try {
        // Prova con metodo diretto
        const { data, error } = await supabase
          .from('events')
          .insert(event)
          .select();
          
        if (error) {
          console.log(`   ❌ Errore RLS: ${error.message}`);
          
          // Fallback: suggerisci inserimento manuale
          console.log(`   💡 Per inserire manualmente:`);
          console.log(`      - Vai su dashboard Supabase → Table Editor → events`);
          console.log(`      - Clicca "Insert row"`);
          console.log(`      - title: ${event.title}`);
          console.log(`      - description: ${event.description}`);
          console.log(`      - start_date: ${event.start_date}`);
          console.log(`      - location: ${event.location}`);
          console.log(`      - type: ${event.type}`);
          console.log(`      - max_participants: ${event.max_participants}`);
        } else {
          console.log(`   ✅ Successo! ID: ${data[0]?.id}`);
        }
      } catch (err) {
        console.log(`   💥 Errore: ${err.message}`);
      }
    }

    console.log('\n🎯 Controlla ora la pagina eventi!');
    console.log('   📱 Vai su: http://localhost:8080/eventi');
    
  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

addEventsQuick().then(() => {
  console.log('\n🏁 Script completato');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Errore fatale:', error);
  process.exit(1);
}); 