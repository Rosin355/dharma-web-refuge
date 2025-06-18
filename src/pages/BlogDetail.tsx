import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();

  // Gli stessi dati del blog - in una vera app sarebbero in un context o API
  const allBlogPosts = [
    {
      id: 1,
      title: "Italia Buddhista - Tavole Rotonde Online",
      excerpt: "Una serie di incontri via Zoom con religiosi di diverse tradizioni buddhiste italiane per approfondire temi fondamentali: la sofferenza, il karma, la natura di Buddha e l'interdipendenza.",
      content: `Il nostro centro, in collaborazione con i Religiosi di Italia Buddhista, organizza una serie di tavole rotonde online da marzo a giugno 2021. Ogni incontro viene trasmesso via Zoom con la partecipazione di massimo 100 persone.

I temi affrontati includono:

**La sofferenza e la prima nobile verità**
Il Buddha identificò la sofferenza (dukkha) come la prima delle Quattro Nobili Verità. Non si tratta solo del dolore fisico, ma di una condizione esistenziale più profonda che caratterizza l'esperienza umana.

**Il karma e la legge di causa-effetto**
Ogni azione genera conseguenze, creando una catena di cause ed effetti che si estende oltre questa vita. Comprendere il karma significa assumersi la responsabilità delle nostre azioni.

**La natura di Buddha e il risveglio**
Tutti gli esseri posseggono la natura di Buddha, la capacità innata di raggiungere l'illuminazione. Questa non è una conquista da ottenere, ma una realtà da riscoprire.

**L'interdipendenza e la visione buddhista del mondo**
Nulla esiste in modo indipendente. Tutto è interconnesso in una rete di relazioni che il buddhismo chiama "originazione dipendente" (pratityasamutpada).

Gli incontri sono aperti a tutti e rappresentano un'opportunità unica di dialogo interreligioso nel panorama buddhista italiano.`,
      author: "Kusalananda",
      date: "Febbraio 2021",
      category: "Eventi",
      image: "https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Lokanatha: Il Primo Monaco Buddhista Italiano",
      excerpt: "La straordinaria storia di Salvatore Cioffi (1897-1966), nato a Napoli e diventato il Venerabile Lokanatha, primo monaco buddhista italiano ordinato in Sri Lanka.",
      content: `Salvatore Cioffi nacque a Napoli nel 1897 da una numerosa famiglia che emigrò negli Stati Uniti quando lui aveva solo tre anni. La sua vita cambiò radicalmente quando, da giovane adulto, si trasferì in Sri Lanka dove venne ordinato monaco buddhista con il nome di Lokanatha.

**I primi anni in America**
Cresciuto in una famiglia italiana emigrata, Salvatore fu esposto fin da giovane alle difficoltà dell'integrazione culturale. Questa esperienza lo portò a questionare le certezze tradizionali e a cercare una comprensione più profonda della vita.

**L'incontro con il Buddhismo**
Il suo interesse per il Buddhismo nacque attraverso la lettura di testi orientali e l'incontro con studiosi che avevano viaggiato in Asia. Affascinato dalla logica e dalla profondità degli insegnamenti buddhisti, decise di intraprendere un viaggio che lo avrebbe portato in Sri Lanka.

**L'ordinazione monastica**
Nel 1925, all'età di 28 anni, Salvatore ricevette l'ordinazione completa (upasampada) nel monastero di Vajirarama a Colombo, diventando il Venerabile Lokanatha. Fu il primo italiano a ricevere l'ordinazione completa nella tradizione Theravada.

**Il ritorno e l'insegnamento**
Dopo anni di studio e pratica in Sri Lanka, Lokanatha fece ritorno in Occidente con la missione di diffondere gli autentici insegnamenti del Buddha. La sua opera rappresenta un ponte importante tra l'Oriente e l'Occidente nel cammino di diffusione del Buddhismo.

**L'eredità spirituale**
La figura di Lokanatha ispira ancora oggi coloro che cercano di vivere il Dharma in un contesto occidentale, mostrando che è possibile abbracciare pienamente la via buddhista pur mantenendo le proprie radici culturali.`,
      author: "Comunità Bodhidharma",
      date: "Maggio 2017",
      category: "Storia",
      image: "https://images.unsplash.com/photo-1544373884-5d7f2017d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "12 min"
    },
    {
      id: 3,
      title: "Progetto Scuole: Mindfulness ed Educazione",
      excerpt: "Il nostro impegno nell'introduzione della mindfulness nelle scuole italiane per supportare studenti e insegnanti nel percorso educativo.",
      content: `Da diversi anni la nostra comunità porta la pratica della mindfulness nelle scuole primarie e secondarie. Il progetto mira a insegnare ai giovani tecniche di concentrazione, gestione dello stress e sviluppo dell'intelligenza emotiva.

**Obiettivi del progetto**
Il nostro programma nelle scuole si focalizza su:
- Sviluppo della concentrazione e dell'attenzione
- Gestione dello stress e dell'ansia scolastica  
- Miglioramento delle relazioni interpersonali
- Coltivazione della compassione e dell'empatia

**Metodologia**
Utilizziamo tecniche adattate all'età degli studenti:
- Meditazione del respiro semplificata
- Esercizi di consapevolezza corporea
- Pratiche di gentilezza amorevole
- Tecniche di rilassamento guidato

**Risultati osservati**
Insegnanti e studenti riportano miglioramenti significativi in:
- Capacità di concentrazione durante le lezioni
- Gestione delle emozioni difficili
- Qualità delle relazioni in classe
- Benessere generale degli studenti

**Collaborazione con gli insegnanti**
Lavoriamo a stretto contatto con il corpo docente per:
- Formare gli insegnanti alle tecniche di base
- Integrare la mindfulness nel curriculum
- Creare un ambiente scolastico più sereno
- Supportare il benessere degli educatori

Il progetto continua a espandersi, coinvolgendo sempre più istituti scolastici che riconoscono il valore di questi insegnamenti per la formazione integrale dei giovani.`,
      author: "Team Educativo",
      date: "Settembre 2020",
      category: "Progetti Sociali",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "7 min"
    },
    {
      id: 4,
      title: "Ritiro di Vesak 2021",
      excerpt: "Celebrazione della nascita, illuminazione e parinirvana del Buddha con un ritiro speciale di tre giorni nel nostro centro.",
      content: `Il Vesak è la festa più importante del calendario buddhista, celebrando tre eventi fondamentali nella vita del Buddha: la nascita, l'illuminazione e il parinirvana (morte fisica). Quest'anno abbiamo organizzato un ritiro speciale di tre giorni.

**Programma del ritiro**
Il ritiro si è articolato su tre giorni intensivi:

**Primo giorno - La Nascita**
Meditazioni sulla purezza originaria e sul potenziale di risveglio presente in ogni essere. Abbiamo riflettuto sulla nascita del principe Siddhartha e sul significato simbolico di questo evento.

**Secondo giorno - L'Illuminazione**
Studio approfondito dell'illuminazione del Buddha sotto l'albero della Bodhi. Meditazioni guidate sui momenti cruciali del risveglio e pratica intensiva di vipassana.

**Terzo giorno - Il Parinirvana**
Riflessioni sull'impermanenza e sulla natura della morte dal punto di vista buddhista. Meditazioni sulla pace finale e cerimonie di ricordo.

**Attività speciali**
Durante il ritiro abbiamo incluso:
- Insegnamenti sui Jataka (vite precedenti del Buddha)
- Cerimonie tradizionali di offerta
- Recitazione dei Paritta (versi di protezione)
- Meditazione camminata nei giardini del centro

**La cerimonia di chiusura**
Il ritiro si è concluso con una solenne cerimonia di offerta della luce, dove ogni partecipante ha acceso una candela come simbolo della propria aspirazione al risveglio.

L'evento ha visto la partecipazione di oltre 50 praticanti, creando un'atmosfera di profonda condivisione spirituale e crescita collettiva.`,
      author: "Sangha Bodhidharma",
      date: "Maggio 2021",
      category: "Cerimonie",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "6 min"
    },
    {
      id: 5,
      title: "I Quattro Fondamenti della Consapevolezza",
      excerpt: "Approfondimento sui Satipatthana, la pratica fondamentale per lo sviluppo della mindfulness secondo gli insegnamenti del Buddha.",
      content: `I Satipatthana rappresentano il cuore della pratica meditativa buddhista. Questo insegnamento esplora i quattro ambiti della consapevolezza: il corpo, le sensazioni, la mente e gli oggetti mentali.

**Il primo fondamento: Kayanupassana (Consapevolezza del corpo)**
La pratica inizia con l'osservazione diretta del corpo:
- Consapevolezza del respiro (anapanasati)
- Osservazione delle posture corporee
- Attenzione ai movimenti e alle attività quotidiane
- Riflessione sulle parti del corpo e sulla loro natura

**Il secondo fondamento: Vedananupassana (Consapevolezza delle sensazioni)**
Sviluppiamo la capacità di osservare:
- Sensazioni piacevoli, spiacevoli e neutre
- La natura impermanente di tutte le sensazioni
- La tendenza della mente a attaccarsi al piacere e respingere il dolore
- L'equanimità verso tutte le esperienze sensoriali

**Il terzo fondamento: Cittanupassana (Consapevolezza della mente)**
Osserviamo gli stati mentali:
- Mente concentrata o dispersa
- Stati di avidità, avversione e ignoranza
- Presenza o assenza di saggezza
- La natura mutevole di tutti gli stati mentali

**Il quarto fondamento: Dhammanupassana (Consapevolezza degli oggetti mentali)**
Il livello più sottile include:
- I cinque ostacoli alla meditazione
- I cinque aggregati dell'esistenza
- Le dodici basi sensoriali
- I sette fattori di illuminazione

**La pratica integrata**
Attraverso la pratica costante di questi quattro fondamenti, il praticante sviluppa:
- Una comprensione profonda della natura impermanente di tutti i fenomeni
- La capacità di osservare senza giudicare
- L'equanimità verso tutte le esperienze
- La saggezza che porta alla liberazione dalla sofferenza

Questa pratica, se coltivata con costanza e sincerità, conduce naturalmente al risveglio e alla pace interiore.`,
      author: "Ven. Nyanavira",
      date: "Marzo 2021",
      category: "Insegnamenti",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "15 min"
    },
    {
      id: 6,
      title: "Meditazione Camminata nel Parco",
      excerpt: "Ogni domenica mattina organizziamo sessioni di meditazione camminata nel parco locale, aperte a tutti i livelli di esperienza.",
      content: `La meditazione camminata è una pratica che combina movimento e consapevolezza. Ogni domenica alle 9:00 ci ritroviamo nel parco per una sessione di un'ora che include istruzioni per principianti e pratica guidata.

**Cos'è la meditazione camminata**
La meditazione camminata (cankama in pali) è una delle quattro posture meditative riconosciute dal Buddha, insieme al sedersi, stare in piedi e sdraiarsi. È particolarmente utile per:
- Integrare la consapevolezza nel movimento
- Bilanciare la pratica seduta
- Sviluppare presenza mentale nelle attività quotidiane
- Coltivare energia quando la mente è sopita

**La tecnica di base**
La nostra pratica segue questi passi fondamentali:
1. **Preparazione**: Scelta del percorso (10-20 passi) e stabilimento dell'intenzione
2. **Camminata lenta**: Movimenti deliberati e consapevoli
3. **Attenzione ai piedi**: Osservazione delle sensazioni di sollevamento, movimento e appoggio
4. **Integrazione**: Connessione tra respiro, movimento e consapevolezza

**Benefici osservati**
I partecipanti regolari riportano:
- Maggiore presenza nelle attività quotidiane
- Riduzione dello stress e dell'ansia
- Miglioramento dell'equilibrio fisico e mentale
- Deepening della pratica meditativa generale

**Adattamenti per tutti**
La pratica viene adattata per:
- **Principianti**: Istruzioni dettagliate e ritmo molto lento
- **Praticanti esperti**: Tecniche avanzate di consapevolezza
- **Persone con limitazioni fisiche**: Versioni sedute o modificate
- **Bambini**: Elementi ludici e storie educative

**L'ambiente naturale**
Il parco offre un setting ideale perché:
- Connette con la natura e i suoi ritmi
- Fornisce aria fresca e spazio aperto
- Riduce le distrazioni urbane
- Crea un senso di comunità tra i praticanti

L'attività è completamente gratuita e aperta a tutti, indipendentemente dall'esperienza meditativa precedente. È sufficiente presentarsi con abbigliamento comodo e scarpe adatte al terreno.

**Come partecipare**
- **Quando**: Ogni domenica alle 9:00
- **Dove**: Ingresso principale del Parco Cittadino
- **Durata**: 60 minuti (incluse istruzioni)
- **Cosa portare**: Solo te stesso e un atteggiamento aperto`,
      author: "Gruppo Pratica",
      date: "Gennaio 2021",
      category: "Eventi",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "4 min"
    }
  ];

  const post = allBlogPosts.find(p => p.id === parseInt(id || '0'));

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Converte i ritorni a capo e i markdown di base in HTML
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Gestisce i titoli con **
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          const title = paragraph.slice(2, -2);
          return <h3 key={index} className="font-serif text-xl font-semibold mt-6 mb-3 text-zen-stone">{title}</h3>;
        }
        
        // Gestisce i paragrafi normali con grassetto inline
        const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return (
          <p 
            key={index} 
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedParagraph }}
          />
        );
      });
  };

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header con breadcrumb */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-8">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className="text-white hover:text-saffron-300 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al Blog
            </Button>
          </Link>
          <Badge className="bg-saffron-600 hover:bg-saffron-700 mb-4">
            {post.category}
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-white font-medium">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 bg-saffron-600 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Immagine principale */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <div className="aspect-video md:aspect-[21/9] overflow-hidden rounded-lg shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contenuto dell'articolo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Excerpt */}
              <p className="text-xl text-saffron-600 font-light leading-relaxed mb-8 border-l-4 border-saffron-200 pl-6">
                {post.excerpt}
              </p>
              
              {/* Contenuto principale */}
              <div className="prose prose-lg max-w-none">
                {formatContent(post.content)}
              </div>

              {/* Condivisione e navigazione */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link to="/blog">
                    <Button variant="outline" className="border-saffron-600 text-saffron-600 hover:bg-saffron-600 hover:text-white">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Tutti gli articoli
                    </Button>
                  </Link>
                  <div className="text-sm text-gray-500">
                    Condividi questo articolo con la tua comunità
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
