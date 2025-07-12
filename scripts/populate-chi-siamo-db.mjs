import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = 'https://zklgrmeiemzsusmoegby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Contenuti per la pagina Chi Siamo
const contents = [
  // Taehye sunim - Cronologia dettagliata
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-1978',
    section_title: 'Taehye 1978',
    content_type: 'text',
    content: 'Laureatosi in lettere ha svolto in seguito lavori e ricerca all\'università di Helsinki. Ha tradotto testi buddhisti e scritto articoli di vario genere su riviste specialistiche. Sono più di dieci i suoi libri pubblicati in Finlandia.',
    editor_instructions: 'Cronologia Taehye sunim - 1978',
    display_order: 11
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-1982',
    section_title: 'Taehye 1982',
    content_type: 'text',
    content: 'Viene ordinato monaco novizio in Thailandia dal Maestro Phra Krusangvorn Samadhivat presso il monastero Wat Paknam di Bangkok.',
    editor_instructions: 'Cronologia Taehye sunim - 1982',
    display_order: 12
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-1983',
    section_title: 'Taehye 1983',
    content_type: 'text',
    content: 'Riceve l\'ordinazione piena dal Maestro Phra Krusangvorn Samadhivat. Inizia lo studio della medicina tradizionale thailandese.',
    editor_instructions: 'Cronologia Taehye sunim - 1983',
    display_order: 13
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-1984',
    section_title: 'Taehye 1984',
    content_type: 'text',
    content: 'Prosegue la pratica monastica e lo studio della medicina tradizionale presso vari monasteri della Thailandia.',
    editor_instructions: 'Cronologia Taehye sunim - 1984',
    display_order: 14
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-1985',
    section_title: 'Taehye 1985',
    content_type: 'text',
    content: 'Conclude i suoi studi di medicina tradizionale thailandese e riceve il diploma dall\'Ospedale Buddhista di Bangkok.',
    editor_instructions: 'Cronologia Taehye sunim - 1985',
    display_order: 15
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-1986',
    section_title: 'Taehye 1986',
    content_type: 'text',
    content: 'Ritorna in Finlandia e fonda il primo centro di Dharma buddhista del paese.',
    editor_instructions: 'Cronologia Taehye sunim - 1986',
    display_order: 16
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-1995',
    section_title: 'Taehye 1995',
    content_type: 'text',
    content: 'Arriva per la prima volta in Italia e inizia a insegnare meditazione buddhista.',
    editor_instructions: 'Cronologia Taehye sunim - 1995',
    display_order: 17
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-cronologia-2000',
    section_title: 'Taehye 2000',
    content_type: 'text',
    content: 'Fonda il primo centro di Dharma buddhista in Italia, stabilendo una presenza permanente nel paese.',
    editor_instructions: 'Cronologia Taehye sunim - 2000',
    display_order: 18
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taehye-oggi',
    section_title: 'Taehye Oggi',
    content_type: 'text',
    content: 'Continua la sua opera di insegnamento e divulgazione del Dharma, guidando ritiri di meditazione e conducendo cerimonie buddhiste. È autore di numerosi testi sulla pratica buddhista e la medicina tradizionale.',
    editor_instructions: 'Sezione "Oggi" per Taehye sunim',
    display_order: 19
  },

  // Taeri sunim - Cronologia dettagliata  
  {
    page_name: 'chi-siamo',
    section_key: 'taeri-cronologia-1995',
    section_title: 'Taeri 1995',
    content_type: 'text',
    content: 'Inizia il suo percorso spirituale avvicinandosi al buddhismo e alla meditazione.',
    editor_instructions: 'Cronologia Taeri sunim - 1995',
    display_order: 21
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taeri-cronologia-2000',
    section_title: 'Taeri 2000',
    content_type: 'text',
    content: 'Incontra il Maestro Taehye sunim e inizia la pratica formale sotto la sua guida.',
    editor_instructions: 'Cronologia Taeri sunim - 2000',
    display_order: 22
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taeri-cronologia-2005',
    section_title: 'Taeri 2005',
    content_type: 'text',
    content: 'Riceve l\'ordinazione come monaco novizio, iniziando ufficialmente la vita monastica.',
    editor_instructions: 'Cronologia Taeri sunim - 2005',
    display_order: 23
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taeri-cronologia-2010',
    section_title: 'Taeri 2010',
    content_type: 'text',
    content: 'Riceve l\'ordinazione piena come monaco (bhikkhu) e inizia a insegnare meditazione.',
    editor_instructions: 'Cronologia Taeri sunim - 2010',
    display_order: 24
  },
  {
    page_name: 'chi-siamo',
    section_key: 'taeri-oggi',
    section_title: 'Taeri Oggi',
    content_type: 'text',
    content: 'È insegnante di meditazione e conduce ritiri spirituali. Si occupa della gestione quotidiana del monastero e dell\'accoglienza dei visitatori.',
    editor_instructions: 'Sezione "Oggi" per Taeri sunim',
    display_order: 25
  },

  // Ven. Kusalananda - Cronologia dettagliata
  {
    page_name: 'chi-siamo',
    section_key: 'kusalananda-cronologia-inizio',
    section_title: 'Kusalananda - Inizi',
    content_type: 'text',
    content: 'Musicista professionista prima di avvicinarsi al buddhismo, ha una formazione classica in musica e composizione.',
    editor_instructions: 'Cronologia Ven. Kusalananda - Inizi',
    display_order: 31
  },
  {
    page_name: 'chi-siamo',
    section_key: 'kusalananda-cronologia-conversione',
    section_title: 'Kusalananda - Conversione',
    content_type: 'text',
    content: 'Abbandona la carriera musicale per dedicarsi completamente alla pratica buddhista e alla vita monastica.',
    editor_instructions: 'Cronologia Ven. Kusalananda - Conversione',
    display_order: 32
  },
  {
    page_name: 'chi-siamo',
    section_key: 'kusalananda-cronologia-ordinazione',
    section_title: 'Kusalananda - Ordinazione',
    content_type: 'text',
    content: 'Riceve l\'ordinazione monastica e integra la sua esperienza musicale con la pratica del Dharma.',
    editor_instructions: 'Cronologia Ven. Kusalananda - Ordinazione',
    display_order: 33
  },
  {
    page_name: 'chi-siamo',
    section_key: 'kusalananda-oggi',
    section_title: 'Kusalananda Oggi',
    content_type: 'text',
    content: 'Unisce la sua esperienza musicale alla pratica buddhista, creando momenti di meditazione attraverso la musica. Conduce sessioni di meditazione accompagnate da strumenti tradizionali.',
    editor_instructions: 'Sezione "Oggi" per Ven. Kusalananda',
    display_order: 34
  },

  // Sezione generale "Oggi"
  {
    page_name: 'chi-siamo',
    section_key: 'monastero-oggi',
    section_title: 'Il Monastero Oggi',
    content_type: 'text',
    content: 'Il monastero offre un rifugio spirituale dove la comunità monastica e i laici possono praticare insieme il Dharma del Buddha. Organizziamo ritiri di meditazione, cerimonie buddhiste e insegnamenti aperti a tutti coloro che cercano pace interiore e saggezza.',
    editor_instructions: 'Sezione generale "Oggi" per il monastero',
    display_order: 40
  },
  {
    page_name: 'chi-siamo',
    section_key: 'attivita-oggi',
    section_title: 'Le Nostre Attività',
    content_type: 'text',
    content: 'Ogni giorno inizia con la meditazione mattutina seguita dal canto dei sutra. Offriamo insegnamenti settimanali, ritiri mensili e cerimonie speciali durante le festività buddhiste. La nostra porta è sempre aperta a chi desidera approfondire la pratica del Dharma.',
    editor_instructions: 'Descrizione delle attività attuali',
    display_order: 41
  }
];

async function populateChiSiamoContents() {
  console.log('🔄 Popolamento contenuti pagina Chi Siamo...');
  
  try {
    // Elimina contenuti esistenti per evitare duplicati
    console.log('🗑️  Eliminazione contenuti esistenti...');
    const { error: deleteError } = await supabase
      .from('page_contents')
      .delete()
      .eq('page_name', 'chi-siamo');
    
    if (deleteError) {
      console.warn('⚠️  Errore eliminazione contenuti esistenti:', deleteError.message);
    }

    // Inserisci nuovi contenuti
    console.log('📝 Inserimento nuovi contenuti...');
    const { data, error } = await supabase
      .from('page_contents')
      .insert(contents.map(content => ({
        ...content,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));

    if (error) {
      throw error;
    }

    console.log('✅ Contenuti inseriti con successo!');
    console.log(`📊 ${contents.length} contenuti aggiunti per la pagina Chi Siamo`);
    
    // Verifica inserimento
    const { data: verification, error: verifyError } = await supabase
      .from('page_contents')
      .select('*')
      .eq('page_name', 'chi-siamo')
      .order('display_order');

    if (verifyError) {
      throw verifyError;
    }

    console.log('🔍 Verifica:', verification?.length || 0, 'contenuti trovati nel database');
    
  } catch (error) {
    console.error('❌ Errore durante il popolamento:', error);
    process.exit(1);
  }
}

// Esegui lo script
populateChiSiamoContents().then(() => {
  console.log('🎉 Script completato con successo!');
  process.exit(0);
}); 