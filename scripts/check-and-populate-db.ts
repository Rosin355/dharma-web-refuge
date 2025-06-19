#!/usr/bin/env bun
/**
 * Script per verificare il database Supabase e popolare con dati iniziali
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/integrations/supabase/types'

// Configurazione Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configurare VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Funzione per verificare la connessione
async function checkConnection(): Promise<boolean> {
  try {
    console.log('🔍 Verifica connessione Supabase...')
    const { data, error } = await supabase.from('posts').select('count')
    
    if (error) {
      console.error('❌ Errore connessione:', error.message)
      return false
    }
    
    console.log('✅ Connessione Supabase riuscita!')
    return true
  } catch (error) {
    console.error('❌ Errore connessione:', error)
    return false
  }
}

// Funzione per verificare le tabelle esistenti
async function checkTables(): Promise<void> {
  console.log('\n📊 Verifica struttura database...')
  
  const tables = ['posts', 'profiles', 'events', 'teachings']
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table as any)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ Tabella '${table}': ${error.message}`)
      } else {
        console.log(`✅ Tabella '${table}': ${count || 0} record`)
      }
    } catch (error) {
      console.log(`❌ Tabella '${table}': Errore verifica`)
    }
  }
}

// Funzione per creare un autore di default
async function createDefaultAuthor(): Promise<string | null> {
  try {
    // Verifica se esiste già
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', 'Comunità Bodhidharma')
      .single()
    
    if (existing) {
      console.log('✅ Autore di default già esistente')
      return existing.id
    }
    
    // Crea nuovo profilo
    const authorId = crypto.randomUUID()
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: authorId,
        email: 'comunita@bodhidharma.info',
        full_name: 'Comunità Bodhidharma',
        role: 'admin'
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('❌ Errore creazione autore:', error.message)
      return null
    }
    
    console.log('✅ Autore di default creato')
    return authorId
  } catch (error) {
    console.error('❌ Errore gestione autore:', error)
    return null
  }
}

// Funzione per popolare con dati di esempio
async function populateWithSampleData(): Promise<void> {
  console.log('\n📝 Popolamento con dati di esempio...')
  
  const authorId = await createDefaultAuthor()
  if (!authorId) {
    console.error('❌ Impossibile creare autore, salto il popolamento')
    return
  }
  
  // Dati di esempio basati sui contenuti del sito reale
  const samplePosts = [
    {
      title: "Aggiornamento attività estive a Musangam e in esterno",
      content: `Il Tempio Buddhista Musangam della Comunità Bodhidharma presenta il programma delle attività estive per il 2025. 

Durante i mesi estivi, il centro monastico situato sui Monti San Lorenzo offrirà un ricco calendario di attività sia all'interno del tempio che in luoghi esterni.

**Attività al Tempio Musangam:**
- Meditazioni mattutine quotidiane alle ore 6:00
- Insegnamenti settimanali ogni giovedì sera
- Cerimonie di luna piena mensili
- Ritiri di fine settimana

**Attività in esterno:**
- Meditazioni camminate nei boschi circostanti
- Pellegrinaggi ai luoghi sacri della Liguria  
- Incontri di dharma al mare per le comunità costiere
- Collaborazioni con altri centri buddhisti italiani

Tutte le attività sono aperte a praticanti di ogni livello di esperienza. Per informazioni e iscrizioni contattare il centro.`,
      excerpt: "Il programma completo delle attività estive 2025 del Tempio Buddhista Musangam, con eventi sia interni che esterni al centro monastico.",
      author_id: authorId,
      status: 'published',
      published_at: '2025-06-18T10:00:00Z'
    },
    {
      title: "Ritiri estivi programmi e destinazioni - Giugno e Luglio",
      content: `La Comunità Bodhidharma organizza una serie di ritiri estivi nei mesi di giugno e luglio 2025, offrendo opportunità di approfondimento della pratica in contesti naturali suggestivi.

**Programma Ritiri Giugno:**

*Ritiro di Vipassana (7-10 Giugno)*
- Luogo: Monastero di Musangam  
- Maestro: Ven. Dharmakirti
- Focus: Meditazione di consapevolezza e visione profonda

*Ritiro Zen al Mare (14-17 Giugno)*
- Luogo: Eremo costiero, Cinque Terre
- Maestro: Roshi Eizen
- Focus: Zazen e contemplazione della natura

*Ritiro Famiglie (21-24 Giugno)*  
- Luogo: Centro Dharma in montagna
- Focus: Pratica adatta a bambini e genitori

**Programma Ritiri Luglio:**

*Ritiro di Dharma Intensivo (5-12 Luglio)*
- Luogo: Monastero di Musangam
- Durata: 7 giorni di silenzio
- Focus: Studio approfondito dei Sutra

*Ritiro Giovani (19-22 Luglio)*
- Luogo: Rifugio alpino
- Focus: Buddhismo e vita contemporanea

Ogni ritiro include alloggio, pasti vegetariani e tutti gli insegnamenti. Le iscrizioni sono aperte con posti limitati.`,
      excerpt: "I ritiri estivi 2025 della Comunità Bodhidharma: programmi intensivi di pratica buddhista in giugno e luglio.",
      author_id: authorId,
      status: 'published',
      published_at: '2025-06-06T15:00:00Z'
    },
    {
      title: "Vesak 2025 - Unione Buddhista Italiana alla Fabbrica del Vapore di Milano",
      content: `L'Unione Buddhista Italiana celebra il Vesak 2025 con un evento speciale di tre giorni presso la Fabbrica del Vapore di Milano, dal 23 al 25 maggio.

Il Vesak, la festa più importante del calendario buddhista, commemora la nascita, l'illuminazione e il Parinirvana del Buddha. Quest'anno l'evento milanese vedrà la partecipazione di tutte le principali tradizioni buddhiste presenti in Italia.

**Programma dell'evento:**

*Venerdì 23 Maggio - Apertura*
- Cerimonia di inaugurazione con rappresentanti di tutte le scuole
- Conferenza "Il Buddhismo in Italia oggi"  
- Meditazione comunitaria serale

*Sabato 24 Maggio - Insegnamenti*
- Mattina: Tavola rotonda "Le Quattro Nobili Verità nell'era moderna"
- Pomeriggio: Workshop pratici divisi per tradizione
- Sera: Cerimonia di offerta della luce

*Domenica 25 Maggio - Celebrazione*
- Recitazione collettiva dei Paritta
- Cerimonia di consacrazione dell'acqua benedetta
- Pranzo comunitario e chiusura

La Comunità Bodhidharma parteciperà con una delegazione guidata dal Maestro del tempio Musangam. L'evento è aperto al pubblico e rappresenta un'occasione unica di incontro tra le diverse tradizioni buddhiste italiane.

Per partecipare è consigliata la registrazione sul sito dell'Unione Buddhista Italiana.`,
      excerpt: "La celebrazione del Vesak 2025 a Milano unisce tutte le tradizioni buddhiste italiane in tre giorni di insegnamenti e cerimonie.",
      author_id: authorId,
      status: 'published',
      published_at: '2025-05-26T09:00:00Z'
    },
    {
      title: "Gli Insegnamenti del Maestro Zen Man Gong",
      content: `"Il sole della saggezza rende rosso il cielo. La luna della mente è sempre bianca. Rosso e bianco non finiscono mai. Tutto - grande pace a primavera."

Queste parole del Maestro Zen Man Gong catturano l'essenza della pratica zen e della visione buddhista della realtà. Il Maestro Man Gong (1871-1946) fu uno dei più grandi maestri zen coreani del XX secolo, la cui influenza si estende ancora oggi attraverso i suoi insegnamenti profondi e poetici.

**Il significato della poesia:**

Il "sole della saggezza" rappresenta la saggezza illuminata (prajna) che sorge quando la mente si libera dalle illusioni. Il rosso del cielo simboleggia la vitalità e l'energia che questa saggezza porta nella vita quotidiana.

La "luna della mente sempre bianca" indica la purezza naturale della mente originale, che rimane immacolata indipendentemente dalle circostanze esterne. Come la luna mantiene la sua luminosità sia che sia visibile o nascosta dalle nuvole, così la natura di Buddha rimane pura in ogni essere.

"Rosso e bianco non finiscono mai" esprime l'unità dinamica di saggezza e compassione, di energia e pace, che caratterizza la realizzazione zen. Non c'è separazione tra questi aspetti - sono facce diverse della stessa realtà.

"Tutto - grande pace a primavera" conclude con l'immagine della primavera come risveglio universale. Quando realizziamo la nostra natura originale, tutto diventa espressione di pace e rinnovamento.

**L'eredità del Maestro Man Gong:**

Gli insegnamenti del Maestro Man Gong continuano a ispirare praticanti in tutto il mondo. La sua capacità di esprimere le verità più profonde del Dharma attraverso immagini poetiche semplici ma potenti rimane un modello per l'insegnamento zen contemporaneo.

Nel nostro tempio Musangam, questi insegnamenti vivono attraverso la pratica quotidiana della meditazione seduta, della recitazione e dell'applicazione mindful della saggezza zen nella vita di ogni giorno.`,
      excerpt: "Riflessioni sui profondi insegnamenti poetici del Maestro Zen Man Gong e il loro significato per la pratica contemporanea.",
      author_id: authorId,
      status: 'published',
      published_at: '2025-03-15T11:00:00Z'
    },
    {
      title: "La Pratica della Meditazione Seduta (Zazen)",
      content: `La meditazione seduta, chiamata zazen nella tradizione zen, è il cuore della pratica buddhista. Nel nostro tempio Musangam, ogni giorno inizia e finisce con periodi di zazen comunitario.

**Preparazione per la pratica:**

Prima di sedersi, è importante creare le condizioni giuste:
- Scegliere un luogo tranquillo e pulito
- Utilizzare un cuscino da meditazione (zabuton e zafu)
- Indossare vestiti comodi che non limitino la respirazione
- Stabilire un tempo fisso per la pratica quotidiana

**La postura corretta:**

La postura nello zazen è fondamentale:
- Sedersi a gambe incrociate in posizione stabile
- La schiena deve essere dritta ma non rigida
- Le spalle rilassate e leggermente aperte
- Il mento leggermente abbassato
- Gli occhi semi-chiusi con lo sguardo rivolto verso il basso
- Le mani nella posizione del mudra cosmico

**La tecnica della respirazione:**

- Respirare naturalmente attraverso il naso
- L'attenzione si concentra sul respiro che entra ed esce
- Contare i respiri da 1 a 10, poi ricominciare
- Quando la mente si distrae, tornare gentilmente al conteggio
- Non forzare né manipolare il respiro

**Gestire i pensieri:**

Durante zazen, i pensieri sono naturali e inevitabili:
- Non combattere i pensieri né seguirli
- Riconoscerli con gentilezza e lasciarli andare
- Ritornare sempre all'ancoraggio del respiro
- Coltivare un atteggiamento di "mente del principiante"

**I benefici della pratica regolare:**

- Maggiore chiarezza mentale e concentrazione
- Riduzione dello stress e dell'ansia
- Sviluppo di equanimità e compassione
- Comprensione più profonda della natura della mente
- Integrazione della consapevolezza nella vita quotidiana

**La pratica comunitaria:**

Nel nostro tempio, lo zazen è praticato in comunità ogni mattina alle 6:00 e ogni sera alle 19:00. La pratica di gruppo crea un'energia speciale che supporta e approfondisce la meditazione individuale.

I principianti sono sempre benvenuti e ricevono istruzioni dettagliate prima di unirsi alla pratica comunitaria.`,
      excerpt: "Guida completa alla pratica dello zazen: postura, respirazione, gestione dei pensieri e benefici della meditazione seduta.",
      author_id: authorId,
      status: 'published',
      published_at: '2025-02-20T14:00:00Z'
    },
    {
      title: "Recitazioni e Mantra nella Pratica Quotidiana",
      content: `Le recitazioni (sutra chanting) e i mantra sono elementi essenziali della pratica buddhista che integrano corpo, parola e mente in un'unica espressione devozionale.

**Il potere della voce nella pratica:**

La recitazione non è semplicemente la ripetizione di parole, ma una forma di meditazione attiva che:
- Calma la mente discorsiva
- Crea vibrazioni benefiche nel corpo
- Connette con la saggezza dei Buddha e Bodhisattva
- Purifica il karma della parola
- Genera merit per tutti gli esseri senzienti

**Recitazioni principali nel nostro tempio:**

*Sutra del Cuore (Hannya Shingyo)*
Recitato ogni mattina, questo breve ma profondo sutra esprime l'essenza della saggezza della Perfezione della Saggezza (Prajnaparamita).

*Sutra del Loto (estratti)*
Recitazioni serali che celebrano la natura di Buddha universale e l'infinita compassione del Buddha.

*Dediche del merito*
Preghiere che dedicano i benefici della pratica a tutti gli esseri senzienti.

**Mantra fondamentali:**

*Om Mani Padme Hum*
Il mantra della compassione di Avalokiteshvara, che purifica i sei regni dell'esistenza e sviluppa amore universale.

*Gate Gate Paragate Parasamgate Bodhi Svaha*
Il mantra che conclude il Sutra del Cuore, esprimendo il cammino verso l'illuminazione.

*Namo Amitabha Buddha*
Invocazione al Buddha Amitabha, praticata per sviluppare fede e aspirazione alla Terra Pura.

**Come praticare le recitazioni:**

- Iniziare con il rifugio nei Tre Gioielli
- Mantenere una postura dignitosa e rilassata
- Recitare con voce chiara ma non forzata
- Sincronizzare il ritmo con il respiro naturale
- Mantenere la mente concentrata sul significato
- Concludere dedicando il merito a tutti gli esseri

**I benefici della pratica:**

- Purificazione delle energie negative
- Sviluppo di concentrazione e presenza mentale
- Connessione con la tradizione millenaria
- Guarigione emotiva e spirituale
- Protezione e benedizioni
- Preparazione della mente per la meditazione profonda

**La dimensione comunitaria:**

Nel nostro tempio, le recitazioni comunitarie creano un campo di energia condivisa che amplifica i benefici individuali. Il suono armonioso delle voci unite in preghiera è esso stesso una forma di insegnamento del Dharma.

Ogni domenica organizziamo sessioni speciali di recitazione aperte al pubblico, dove spieghiamo il significato dei testi e insegniamo la pronuncia corretta.`,
      excerpt: "L'importanza delle recitazioni e dei mantra nella pratica buddhista: tecniche, benefici e dimensione comunitaria.",
      author_id: authorId,
      status: 'published',
      published_at: '2025-01-10T16:00:00Z'
    }
  ]
  
  let imported = 0
  let errors = 0
  
  for (const post of samplePosts) {
    try {
      // Verifica se esiste già
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('title', post.title)
        .single()
      
      if (existing) {
        console.log(`⏭️ Già esistente: ${post.title}`)
        continue
      }
      
      const { error } = await supabase
        .from('posts')
        .insert(post)
      
      if (error) {
        console.error(`❌ Errore inserimento "${post.title}":`, error.message)
        errors++
      } else {
        console.log(`✅ Inserito: ${post.title}`)
        imported++
      }
      
    } catch (error) {
      console.error(`❌ Errore processamento "${post.title}":`, error)
      errors++
    }
  }
  
  console.log(`\n📊 Risultati popolamento:`)
  console.log(`   ✅ Inseriti: ${imported}`)
  console.log(`   ❌ Errori: ${errors}`)
}

// Funzione principale
async function main() {
  console.log('🔍 VERIFICA E POPOLAMENTO DATABASE SUPABASE')
  console.log('=' .repeat(50))
  
  // Verifica connessione
  const connected = await checkConnection()
  if (!connected) {
    console.error('❌ Impossibile connettersi al database')
    process.exit(1)
  }
  
  // Verifica tabelle
  await checkTables()
  
  // Popola con dati di esempio
  await populateWithSampleData()
  
  // Verifica finale
  console.log('\n📊 VERIFICA FINALE:')
  await checkTables()
  
  console.log('\n🎉 Processo completato!')
}

main().catch(console.error) 