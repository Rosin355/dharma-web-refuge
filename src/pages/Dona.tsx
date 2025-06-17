
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Gift, Users, BookOpen } from 'lucide-react';

const Dona = () => {
  const modalitaDonazione = [
    {
      icon: Heart,
      title: "Donazione Libera",
      description: "Sostieni la comunità con un'offerta del cuore",
      importi: ["€10", "€25", "€50", "€100"]
    },
    {
      icon: Users,
      title: "Sostegno Mensile",
      description: "Diventa sostenitore regolare della nostra missione",
      importi: ["€15/mese", "€30/mese", "€50/mese", "€100/mese"]
    },
    {
      icon: BookOpen,
      title: "Progetti Speciali",
      description: "Contribuisci a progetti specifici della comunità",
      importi: ["Biblioteca", "Sala Meditazione", "Giardino Zen", "Ritiri"]
    }
  ];

  const utilizzi = [
    {
      icon: "🏛️",
      title: "Mantenimento del Centro",
      percentage: "40%",
      description: "Utenze, manutenzione e gestione degli spazi comuni"
    },
    {
      icon: "📚",
      title: "Attività Spirituali",
      percentage: "35%",
      description: "Organizzazione di eventi, ritiri e cerimonie"
    },
    {
      icon: "🌱",
      title: "Crescita della Comunità",
      percentage: "25%",
      description: "Sviluppo di nuovi progetti e attività educative"
    }
  ];

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            <span className="text-saffron-600">Sostieni</span> la Comunità
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            La tua generosità aiuta a mantenere viva la tradizione del Dharma 
            e a offrire insegnamenti gratuiti a tutti coloro che cercano la via spirituale
          </p>
        </div>
      </section>

      {/* Introduzione */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-saffron-100 rounded-full flex items-center justify-center">
              <Gift className="h-8 w-8 text-saffron-600" />
            </div>
            <h2 className="font-serif text-3xl font-light mb-4">
              Il Valore della <span className="text-saffron-500">Generosità</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nel buddhismo, la pratica del <em>dana</em> (generosità) è una delle virtù fondamentali. 
              Donare non è solo un atto di sostegno materiale, ma una pratica spirituale che 
              purifica il cuore e crea meriti per tutti gli esseri. La vostra generosità 
              permette alla nostra comunità di continuare a offrire insegnamenti, 
              meditazioni e supporto spirituale gratuiti.
            </p>
          </div>
        </div>
      </section>

      {/* Modalità di Donazione */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light mb-4">
              Modalità di <span className="text-saffron-500">Donazione</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Scegli la modalità che preferisci per sostenere la nostra missione
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {modalitaDonazione.map((modalita, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-zen-sage">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                    <modalita.icon className="h-8 w-8 text-saffron-600" />
                  </div>
                  <CardTitle className="font-serif text-xl">{modalita.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{modalita.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {modalita.importi.map((importo, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="border-saffron-200 hover:bg-saffron-50 hover:border-saffron-300"
                      >
                        {importo}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white">
                    Dona Ora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Come Utilizziamo le Donazioni */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light mb-4">
              Come Utilizziamo le <span className="text-saffron-500">Donazioni</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trasparenza e responsabilità nell'uso dei fondi ricevuti dalla comunità
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {utilizzi.map((utilizzo, index) => (
              <Card key={index} className="text-center border-zen-sage">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{utilizzo.icon}</div>
                  <div className="text-3xl font-bold text-saffron-600 mb-2">{utilizzo.percentage}</div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{utilizzo.title}</h3>
                  <p className="text-muted-foreground text-sm">{utilizzo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Altre Modalità di Sostegno */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-light text-center mb-8">
              Altri Modi per <span className="text-saffron-500">Aiutarci</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-zen-sage">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Volontariato</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Offri il tuo tempo e le tue competenze per supportare le attività 
                    della comunità: manutenzione, organizzazione eventi, cucina.
                  </p>
                  <Button variant="outline" className="border-saffron-200 hover:bg-saffron-50">
                    Scopri di più
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-zen-sage">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Condivisione</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Aiutaci a diffondere il Dharma condividendo i nostri contenuti 
                    e invitando amici interessati alla crescita spirituale.
                  </p>
                  <Button variant="outline" className="border-saffron-200 hover:bg-saffron-50">
                    Condividi ora
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 saffron-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Grazie per il Tuo Sostegno
          </h2>
          <p className="text-xl text-saffron-100 mb-8 max-w-2xl mx-auto">
            Ogni donazione, grande o piccola, è un seme di compassione che fiorirà 
            per il beneficio di tutti gli esseri
          </p>
          <Button size="lg" className="bg-white text-saffron-600 hover:bg-saffron-50">
            <Heart className="mr-2 h-5 w-5" />
            Fai una Donazione
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Dona;
