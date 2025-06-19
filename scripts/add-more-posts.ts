#!/usr/bin/env npx tsx
/**
 * Script per aggiungere articoli aggiuntivi dal vecchio sito
 * Aggiunge solo articoli che non esistono già
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

// Articoli aggiuntivi dal vecchio sito
const additionalPosts = [
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

Tutte le attività sono aperte a praticanti di ogni livello di esperienza. Per informazioni e iscrizioni contattare il centro.

## Programma Dettagliato

### Attività Mattutine (6:00-8:00)
- Zazen (meditazione seduta)
- Recitazione del Sutra del Cuore
- Colazione in silenzio

### Attività Serali (19:00-21:00)
- Dharma talk settimanali
- Pratica della compassione
- Cerimonie stagionali

Per maggiori informazioni visitare il nostro sito o contattare direttamente il tempio.`,
    excerpt: "Il programma completo delle attività estive 2025 del Tempio Buddhista Musangam, con eventi sia interni che esterni al centro monastico.",
    status: 'published',
    published_at: '2024-06-18T10:00:00Z'
  },
  {
    title: "Ritiri estivi programmi e destinazioni - Giugno e Luglio",
    content: `La Comunità Bodhidharma organizza una serie di ritiri estivi nei mesi di giugno e luglio 2024, offrendo opportunità di approfondimento della pratica in contesti naturali suggestivi.

**Programma Ritiri Giugno:**

### Ritiro di Vipassana (7-10 Giugno)
- **Luogo:** Monastero di Musangam  
- **Maestro:** Ven. Dharmakirti
- **Focus:** Meditazione di consapevolezza e visione profonda
- **Costo:** €150 pensione completa

### Ritiro Zen al Mare (14-17 Giugno)
- **Luogo:** Eremo costiero, Cinque Terre
- **Maestro:** Roshi Eizen
- **Focus:** Zazen e contemplazione della natura
- **Costo:** €180 pensione completa

### Ritiro Famiglie (21-24 Giugno)  
- **Luogo:** Centro Dharma in montagna
- **Focus:** Pratica adatta a bambini e genitori
- **Costo:** €120 adulti, €60 bambini

**Programma Ritiri Luglio:**

### Ritiro di Dharma Intensivo (5-12 Luglio)
- **Luogo:** Monastero di Musangam
- **Durata:** 7 giorni di silenzio
- **Focus:** Studio approfondito dei Sutra
- **Costo:** €200 pensione completa

### Ritiro Giovani (19-22 Luglio)
- **Luogo:** Rifugio alpino
- **Focus:** Buddhismo e vita contemporanea
- **Costo:** €100 pensione completa

## Cosa è Incluso

Ogni ritiro include:
- Alloggio in camera condivisa
- Tre pasti vegetariani al giorno
- Tutti gli insegnamenti e sessioni di meditazione
- Materiali di studio
- Certificato di partecipazione

## Come Iscriversi

Per iscrizioni e informazioni:
- Email: info@bodhidharma.info
- Telefono: +39 0185 123456
- Online: www.bodhidharma.info/ritiri

Le iscrizioni sono aperte con posti limitati. Si consiglia la prenotazione anticipata.`,
    excerpt: "I ritiri estivi 2024 della Comunità Bodhidharma: programmi intensivi di pratica buddhista in giugno e luglio.",
    status: 'published',
    published_at: '2024-06-06T15:00:00Z'
  },
  {
    title: "Vesak 2024 - Unione Buddhista Italiana alla Fabbrica del Vapore di Milano",
    content: `L'Unione Buddhista Italiana celebra il Vesak 2024 con un evento speciale di tre giorni presso la Fabbrica del Vapore di Milano, dal 23 al 25 maggio.

Il Vesak, la festa più importante del calendario buddhista, commemora la nascita, l'illuminazione e il Parinirvana del Buddha. Quest'anno l'evento milanese vedrà la partecipazione di tutte le principali tradizioni buddhiste presenti in Italia.

## Programma dell'Evento

### Venerdì 23 Maggio - Apertura
- **Ore 18:00** - Cerimonia di inaugurazione con rappresentanti di tutte le scuole
- **Ore 19:30** - Conferenza "Il Buddhismo in Italia oggi"  
- **Ore 21:00** - Meditazione comunitaria serale

### Sabato 24 Maggio - Insegnamenti
- **Ore 9:00** - Tavola rotonda "Le Quattro Nobili Verità nell'era moderna"
- **Ore 14:00** - Workshop pratici divisi per tradizione:
  - Zen: Pratica di zazen
  - Theravada: Meditazione vipassana
  - Tibetano: Mantra e visualizzazioni
  - Nichiren: Recitazione del Daimoku
- **Ore 18:00** - Cerimonia di offerta della luce

### Domenica 25 Maggio - Celebrazione
- **Ore 10:00** - Recitazione collettiva dei Paritta
- **Ore 12:00** - Cerimonia di consacrazione dell'acqua benedetta
- **Ore 13:00** - Pranzo comunitario e chiusura

## Partecipazione della Comunità Bodhidharma

La Comunità Bodhidharma parteciperà con una delegazione guidata dal Maestro del tempio Musangam. Saremo presenti con:

- Stand informativo sulle nostre attività
- Dimostrazione di cerimonie zen
- Distribuzione di materiali didattici
- Incontri individuali con il Maestro

## Informazioni Pratiche

- **Ingresso:** Gratuito
- **Luogo:** Fabbrica del Vapore, Via Procaccini 4, Milano
- **Registrazione:** Consigliata su www.buddhismo.it
- **Trasporti:** Metro M5 Istria, autobus 57, 78

L'evento rappresenta un'occasione unica di incontro tra le diverse tradizioni buddhiste italiane e di dialogo con il pubblico interessato al Dharma.

Per maggiori informazioni: info@unionebuddhistaitaliana.it`,
    excerpt: "La celebrazione del Vesak 2024 a Milano unisce tutte le tradizioni buddhiste italiane in tre giorni di insegnamenti e cerimonie.",
    status: 'published',
    published_at: '2024-05-26T09:00:00Z'
  },
  {
    title: "Gli Insegnamenti del Maestro Zen Man Gong",
    content: `"Il sole della saggezza rende rosso il cielo. La luna della mente è sempre bianca. Rosso e bianco non finiscono mai. Tutto - grande pace a primavera."

Queste parole del Maestro Zen Man Gong catturano l'essenza della pratica zen e della visione buddhista della realtà. Il Maestro Man Gong (1871-1946) fu uno dei più grandi maestri zen coreani del XX secolo, la cui influenza si estende ancora oggi attraverso i suoi insegnamenti profondi e poetici.

## Il Significato della Poesia

### Il Sole della Saggezza
Il "sole della saggezza" rappresenta la saggezza illuminata (prajna) che sorge quando la mente si libera dalle illusioni. Il rosso del cielo simboleggia la vitalità e l'energia che questa saggezza porta nella vita quotidiana.

Quando pratichiamo con sincerità, la nostra comprensione si illumina come il sole all'alba, dissipando le tenebre dell'ignoranza e rivelando la vera natura di tutte le cose.

### La Luna della Mente
La "luna della mente sempre bianca" indica la purezza naturale della mente originale, che rimane immacolata indipendentemente dalle circostanze esterne. Come la luna mantiene la sua luminosità sia che sia visibile o nascosta dalle nuvole, così la natura di Buddha rimane pura in ogni essere.

### L'Unità di Saggezza e Compassione
"Rosso e bianco non finiscono mai" esprime l'unità dinamica di saggezza e compassione, di energia e pace, che caratterizza la realizzazione zen. Non c'è separazione tra questi aspetti - sono facce diverse della stessa realtà.

### La Grande Pace
"Tutto - grande pace a primavera" conclude con l'immagine della primavera come risveglio universale. Quando realizziamo la nostra natura originale, tutto diventa espressione di pace e rinnovamento.

## L'Eredità del Maestro Man Gong

Gli insegnamenti del Maestro Man Gong continuano a ispirare praticanti in tutto il mondo. La sua capacità di esprimere le verità più profonde del Dharma attraverso immagini poetiche semplici ma potenti rimane un modello per l'insegnamento zen contemporaneo.

### Nella Nostra Pratica

Nel nostro tempio Musangam, questi insegnamenti vivono attraverso:
- La pratica quotidiana della meditazione seduta
- La recitazione di poesie zen durante le cerimonie
- L'applicazione mindful della saggezza zen nella vita quotidiana
- Lo studio approfondito dei koan tradizionali

## Come Applicare Questi Insegnamenti

1. **Nella meditazione:** Lascia che sole e luna della tua mente brillino naturalmente
2. **Nella vita quotidiana:** Mantieni la consapevolezza della grande pace in ogni momento
3. **Nelle relazioni:** Esprimi saggezza e compassione in armonia
4. **Nei momenti difficili:** Ricorda che la natura di Buddha rimane sempre pura

Questi insegnamenti ci invitano a riconoscere la bellezza e la sacralità in ogni momento della nostra esistenza.`,
    excerpt: "Riflessioni sui profondi insegnamenti poetici del Maestro Zen Man Gong e il loro significato per la pratica contemporanea.",
    status: 'published',
    published_at: '2024-03-15T11:00:00Z'
  }
]

async function addMorePosts(): Promise<void> {
  console.log('📝 AGGIUNTA ARTICOLI AGGIUNTIVI')
  console.log('=' .repeat(50))
  
  try {
    // Verifica stato attuale
    const { count: currentCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Articoli attuali nel database: ${currentCount}`)
    
    let imported = 0
    let skipped = 0
    let errors = 0
    
    for (const post of additionalPosts) {
      try {
        // Verifica se esiste già
        const { data: existing } = await supabase
          .from('posts')
          .select('id')
          .eq('title', post.title)
          .single()
        
        if (existing) {
          console.log(`⏭️ Già esistente: ${post.title}`)
          skipped++
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
    
    // Verifica finale
    const { count: finalCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
    
    console.log(`\n📊 Risultati:`)
    console.log(`   ✅ Articoli inseriti: ${imported}`)
    console.log(`   ⏭️ Già esistenti: ${skipped}`)
    console.log(`   ❌ Errori: ${errors}`)
    console.log(`   📄 Totale finale: ${finalCount}`)
    
    if (imported > 0) {
      console.log('\n🎉 Nuovi articoli aggiunti con successo!')
      console.log('👉 Ricarica la pagina del blog per vedere i nuovi contenuti')
    }
    
  } catch (error) {
    console.error('❌ Errore durante l\'aggiunta:', error)
    process.exit(1)
  }
}

// Esegui script
addMorePosts().catch(console.error) 