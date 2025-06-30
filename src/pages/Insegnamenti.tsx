
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Flower2, Sun } from 'lucide-react';
import { usePageContent } from '@/hooks/usePageContent';

const Insegnamenti = () => {
  const { getContent, loading: contentLoading } = usePageContent('insegnamenti');

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento contenuti...</p>
        </div>
      </div>
    );
  }

  const pilastri = [
    {
      icon: Flower2,
      title: "Meditazione Zen",
      description: "La pratica fondamentale dello zazen (meditazione seduta) per sviluppare consapevolezza e presenza mentale.",
      content: "Lo zazen è il cuore della pratica zen. Attraverso la postura corretta, la respirazione naturale e l'osservazione senza giudizio dei pensieri, coltiviamo uno stato di presenza pura."
    },
    {
      icon: Heart,
      title: "Compassione Universale",
      description: "Sviluppare amore incondizionato e compassione verso tutti gli esseri senzienti.",
      content: "La compassione nasce dalla comprensione dell'interconnessione di tutti gli esseri. Attraverso la pratica, impariamo a vedere oltre le differenze superficiali."
    },
    {
      icon: BookOpen,
      title: "Studio del Dharma",
      description: "Approfondimento degli insegnamenti del Buddha e dei maestri zen attraverso i sutra e i koan.",
      content: "Lo studio del Dharma illumina il sentiero spirituale, fornendo saggezza e guida per la pratica quotidiana e la comprensione della natura della realtà."
    },
    {
      icon: Sun,
      title: "Risveglio Interiore",
      description: "Il cammino verso l'illuminazione attraverso la realizzazione della natura di Buddha.",
      content: "Il risveglio è la realizzazione diretta della nostra vera natura. Non è qualcosa da acquisire, ma da riscoprire attraverso la pratica costante."
    }
  ];

  const insegnamenti = [
    {
      title: "La Via del Risveglio",
      maestro: "Bodhidharma",
      descrizione: "Il primo patriarca zen ci insegna che il vero Dharma non dipende da parole o lettere, ma dalla trasmissione diretta da mente a mente.",
      citazione: "Non cercare la verità all'esterno. La natura di Buddha risiede nella tua mente originale."
    },
    {
      title: "L'Arte della Presenza",
      maestro: "Dogen Zenji",
      descrizione: "La pratica dello 'shikantaza' - solo sedere - come espressione della perfetta illuminazione già presente in noi.",
      citazione: "Praticare è illuminazione; illuminazione è pratica. Non sono due cose separate."
    },
    {
      title: "La Mente del Principiante",
      maestro: "Suzuki Roshi",
      descrizione: "Mantenere sempre la freschezza e l'apertura della mente del principiante in ogni momento della pratica.",
      citazione: "Nella mente del principiante ci sono molte possibilità, in quella dell'esperto poche."
    }
  ];

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            <span className="text-saffron-600">{getContent('header-title', 'Insegnamenti')}</span> {getContent('header-subtitle', 'del Dharma')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {getContent('header-description', 'Scopri la saggezza millenaria del buddhismo zen attraverso gli insegnamenti dei maestri e la pratica quotidiana del risveglio')}
          </p>
        </div>
      </section>

      {/* I Quattro Pilastri */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light mb-4">
              {getContent('pilastri-title', 'I Quattro')} <span className="text-saffron-500">{getContent('pilastri-subtitle', 'Pilastri')}</span> della Pratica
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Le fondamenta su cui costruire il proprio percorso spirituale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pilastri.map((pilastro, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white border-zen-sage">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center group-hover:bg-saffron-200 transition-colors">
                      <pilastro.icon className="h-6 w-6 text-saffron-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-semibold mb-2">{pilastro.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{pilastro.description}</p>
                      <p className="text-sm leading-relaxed">{pilastro.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insegnamenti dei Maestri */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light mb-4">
              {getContent('maestri-title', 'Insegnamenti dei')} <span className="text-saffron-500">Maestri</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              La saggezza tramandata attraverso le generazioni di praticanti zen
            </p>
          </div>

          <div className="space-y-8">
            {insegnamenti.map((insegnamento, index) => (
              <Card key={index} className="overflow-hidden border-zen-sage">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="font-serif text-2xl font-semibold mb-2">{insegnamento.title}</h3>
                      <p className="text-saffron-600 font-medium mb-4">Maestro {insegnamento.maestro}</p>
                      <p className="text-muted-foreground leading-relaxed">{insegnamento.descrizione}</p>
                    </div>
                    <div className="bg-zen-cream p-6 rounded-lg">
                      <blockquote className="text-center">
                        <p className="font-serif text-lg italic text-muted-foreground mb-4">
                          "{insegnamento.citazione}"
                        </p>
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 saffron-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            {getContent('cta-title', 'Approfondisci la Tua Pratica')}
          </h2>
          <p className="text-xl text-saffron-100 mb-8 max-w-2xl mx-auto">
            Unisciti a noi per esplorare più profondamente gli insegnamenti del Dharma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-saffron-600 border-white hover:bg-saffron-50">
              Partecipa agli Eventi
            </Button>
            <Button size="lg" className="bg-burgundy-500 hover:bg-burgundy-600 text-white">
              Leggi il Blog
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insegnamenti;
