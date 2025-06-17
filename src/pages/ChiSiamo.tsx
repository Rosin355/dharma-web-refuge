
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Heart, Book } from 'lucide-react';

const ChiSiamo = () => {
  const valori = [
    {
      icon: Heart,
      title: "Compassione",
      description: "Coltiviamo amore universale e comprensione verso tutti gli esseri"
    },
    {
      icon: Book,
      title: "Saggezza",
      description: "Studiamo e pratichiamo gli insegnamenti autentici del Buddha"
    },
    {
      icon: Users,
      title: "Comunità",
      description: "Creiamo un ambiente di sostegno reciproco per la crescita spirituale"
    },
    {
      icon: Target,
      title: "Presenza",
      description: "Viviamo nel momento presente con consapevolezza e mindfulness"
    }
  ];

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            Chi <span className="text-saffron-600">Siamo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            La Comunità Bodhidharma è un centro monastico dedicato alla pratica 
            e alla diffusione del Dharma nella tradizione zen
          </p>
        </div>
      </section>

      {/* La Nostra Storia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-light mb-6">
                La Nostra <span className="text-saffron-500">Storia</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  La Comunità Bodhidharma nasce dall'aspirazione di creare uno spazio 
                  dedicato alla pratica autentica del buddhismo zen in Italia. Fondata 
                  nel rispetto della tradizione millenaria trasmessa dal primo patriarca 
                  Bodhidharma, la nostra comunità si impegna a preservare e diffondere 
                  gli insegnamenti originali del Buddha.
                </p>
                <p>
                  Il nostro centro monastico rappresenta un rifugio di pace dove 
                  praticanti di ogni livello possono approfondire la loro comprensione 
                  del Dharma attraverso la meditazione, lo studio e la vita comunitaria.
                </p>
                <p>
                  Seguiamo la via tracciata dai grandi maestri zen, mantenendo viva 
                  la trasmissione diretta da mente a mente che caratterizza questa 
                  tradizione spirituale.
                </p>
              </div>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Statua del Buddha"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* La Nostra Missione */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light mb-4">
              La Nostra <span className="text-saffron-500">Missione</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Siamo dedicati alla preservazione e alla diffusione degli insegnamenti 
              buddhisti autentici, offrendo un percorso di crescita spirituale 
              accessibile a tutti coloro che cercano la via del risveglio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valori.map((valore, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-zen-sage">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                    <valore.icon className="h-8 w-8 text-saffron-600" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{valore.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {valore.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tradizione e Lignaggio */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1602192509154-0b900ee1f851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Tempio zen"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-light mb-6">
                Tradizione e <span className="text-saffron-500">Lignaggio</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Il nostro lignaggio spirituale affonda le radici nella tradizione 
                  zen che Bodhidharma portò dall'India alla Cina nel VI secolo. 
                  Questa trasmissione ininterrotta di saggezza e compassione è 
                  giunta fino a noi attraverso generazioni di maestri illuminati.
                </p>
                <p>
                  Ci impegniamo a mantenere viva questa tradizione millenaria, 
                  adattandola con rispetto alle esigenze del mondo contemporaneo, 
                  senza mai perdere di vista l'essenza degli insegnamenti originali.
                </p>
                <p>
                  La nostra pratica si basa sui principi fondamentali dello zen: 
                  meditazione seduta (zazen), studio del Dharma, lavoro come pratica 
                  spirituale e vita comunitaria consapevole.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;
