
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, Users, HandHeart, CreditCard } from 'lucide-react';

const Dona = () => {
  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4 text-saffron-600">
            Sostieni il Tempio
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Aiutaci a completare i lavori di ristrutturazione e rendere il tempio più accogliente per tutti i praticanti
          </p>
        </div>
      </section>

      {/* Lavori di Ristrutturazione */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-6 bg-saffron-100 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-saffron-600" />
              </div>
              <h2 className="font-serif text-3xl font-light mb-6">
                Lavori di <span className="text-saffron-500">Ristrutturazione</span> del Tempio
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Il primo impegno della comunità è quello di sviluppare la struttura del tempio di Lerici, per renderlo più confortevole e dare la possibilità a più persone di visitarlo contemporaneamente.
              </p>
              
              <div className="p-6 bg-zen-sage/20 border border-zen-sage rounded-lg">
                <h3 className="font-serif font-semibold text-xl mb-4 text-foreground">Lavori Completati</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-saffron-600 mr-2">✓</span>
                    <span>Ristrutturazione completa delle facciate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-saffron-600 mr-2">✓</span>
                    <span>Completamento e sistemazione del tetto antistante la sala del Dharma</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-saffron-600 mr-2">✓</span>
                    <span>Interventi di coibentazione delle stanze interne</span>
                  </li>
                </ul>
              </div>

              <p className="text-center font-medium text-foreground pt-4">
                È possibile contribuire ed aiutare a portare avanti i lavori e la manutenzione del tempio con delle offerte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modalità di Donazione */}
      <section className="py-16 bg-zen-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light mb-4">
              Come <span className="text-saffron-500">Donare</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Scegli la modalità che preferisci per sostenere il tempio
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Bonifico Bancario */}
            <Card className="border-zen-sage bg-background">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-saffron-600" />
                  </div>
                  <CardTitle className="font-serif text-2xl">Bonifico Bancario</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-zen-cream rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Intestatario</p>
                    <p className="font-medium text-foreground">Comunità Bodhidharma</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Banca</p>
                    <p className="font-medium text-foreground">BANCO BPM - Filiale di Lerici (Dip. 0644)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IBAN</p>
                    <p className="font-mono font-semibold text-saffron-600 text-lg">IT09 X050 3449 7700 0000 0000 493</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Codice SWIFT/BIC</p>
                    <p className="font-mono font-medium text-foreground">BAPPIT21644</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PostPay */}
            <Card className="border-zen-sage bg-background">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-saffron-600" />
                  </div>
                  <CardTitle className="font-serif text-2xl">Ricarica PostPay</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-zen-cream rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Numero Carta</p>
                    <p className="font-mono font-semibold text-saffron-600 text-lg">5333 1712 3667 7759</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Intestatario</p>
                    <p className="font-medium text-foreground">Alberto Alcozer</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Codice Fiscale</p>
                    <p className="font-mono font-medium text-foreground">LCZLRT64M09D969U</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Il Valore della Generosità */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-saffron-100 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-saffron-600" />
              </div>
              <h2 className="font-serif text-3xl font-light mb-4">
                Il Valore della <span className="text-saffron-500">Generosità</span>
              </h2>
            </div>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>
                Nel buddhismo, la pratica del <em>dana</em> (generosità) è una delle virtù fondamentali. 
                Donare non è solo un atto di sostegno materiale, ma una pratica spirituale che 
                purifica il cuore e crea meriti per tutti gli esseri.
              </p>
              <p>
                La vostra generosità permette alla nostra comunità di continuare a offrire insegnamenti, 
                meditazioni e supporto spirituale gratuiti, oltre a mantenere e migliorare la struttura 
                del tempio per accogliere sempre più praticanti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Altre Modalità di Sostegno */}
      <section className="py-16 bg-zen-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-light text-center mb-8">
              Altri Modi per <span className="text-saffron-500">Aiutarci</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-zen-sage bg-background">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-saffron-600" />
                    </div>
                    <CardTitle className="font-serif text-xl">Volontariato</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Offri il tuo tempo e le tue competenze per supportare le attività 
                    della comunità: manutenzione, organizzazione eventi, cucina e molto altro.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zen-sage bg-background">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                      <HandHeart className="h-6 w-6 text-saffron-600" />
                    </div>
                    <CardTitle className="font-serif text-xl">Condivisione</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Aiutaci a diffondere il Dharma condividendo i nostri contenuti 
                    e invitando amici interessati alla crescita spirituale.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-zen-stone to-zen-sage">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-saffron-600 mb-4">
            Grazie per il Tuo Sostegno
          </h2>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Ogni donazione, grande o piccola, è un seme di compassione che fiorirà 
            per il beneficio di tutti gli esseri
          </p>
          <p className="text-muted-foreground italic">
            La comunità Bodhidharma ringrazia di cuore tutti i sostenitori per il loro prezioso contributo
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dona;
