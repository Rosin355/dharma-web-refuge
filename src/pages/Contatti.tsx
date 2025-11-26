
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { usePageContent } from '@/hooks/usePageContent';

const Contatti = () => {
  const { getContent, loading: contentLoading } = usePageContent('contatti');

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

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header Pulito */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4 text-saffron-600">
            Contatti
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto font-light">
            Entra in contatto con la nostra comunità
          </p>
        </div>
      </section>

      {/* Testo Introduttivo */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
          <div className="text-lg leading-relaxed text-muted-foreground space-y-4">
              <p>
                Entra in contatto con la nostra comunità. Siamo qui per guidarti nel tuo percorso spirituale.
              </p>
              <p>
                Per informazioni sulla comunità Bodhidharma, gruppi di pratica o suggerimenti per il sito, non esitare a contattarci.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Informazioni di Contatto */}
      <section className="py-16 bg-zen-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-light text-center mb-12 text-saffron-600">
            Come Raggiungerci
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card Indirizzo */}
            <Card className="border-zen-sage bg-background hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-saffron-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                  Indirizzo
                </h3>
                <div 
                  className="text-muted-foreground mb-4 space-y-1"
                  dangerouslySetInnerHTML={{ 
                    __html: getContent('info-indirizzo-content', 'Monti San Lorenzo, 26<br />19032 Lerici (SP), Italia') 
                  }}
                />
                <a 
                  href="https://maps.google.com/?q=Monti+San+Lorenzo+26+Lerici+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-saffron-600 hover:text-saffron-700 font-medium text-sm"
                >
                  Apri in Google Maps →
                </a>
              </CardContent>
            </Card>

            {/* Card Telefono */}
            <Card className="border-zen-sage bg-background hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                  <Phone className="h-8 w-8 text-saffron-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                  Telefono
                </h3>
                <div className="text-left space-y-3">
                  <div>
                    <p className="font-medium text-foreground">Tel. Tempio</p>
                    <a href="tel:+390187988611" className="text-saffron-600 hover:text-saffron-700 transition-colors">
                      0187 988611
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ven. Tae Hye Sunim (Mahapanna)</p>
                    <a href="tel:+393397262753" className="text-saffron-600 hover:text-saffron-700 transition-colors">
                      339 72 62 753
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Monaco Kusalananda (Bhante)</p>
                    <a href="tel:+393927498954" className="text-saffron-600 hover:text-saffron-700 transition-colors">
                      392 7498954
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Disponibile anche via WhatsApp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Email */}
            <Card className="border-zen-sage bg-background hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-saffron-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                  Email
                </h3>
                <div className="text-left space-y-3">
                  <div>
                    <p className="font-medium text-foreground">Email Principale</p>
                    <a href="mailto:bodhidharmait@gmail.com" className="text-saffron-600 hover:text-saffron-700 transition-colors break-all text-sm">
                      bodhidharmait@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ven. Tae Hye Sunim</p>
                    <a href="mailto:taehyesunim@gmail.com" className="text-saffron-600 hover:text-saffron-700 transition-colors break-all text-sm">
                      taehyesunim@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Monaco Kusalananda</p>
                    <a href="mailto:alberto.alcozer@gmail.com" className="text-saffron-600 hover:text-saffron-700 transition-colors break-all text-sm">
                      alberto.alcozer@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orari delle Pratiche */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="border-zen-sage bg-background">
              <CardHeader>
                <CardTitle className="font-serif text-2xl flex items-center justify-center text-saffron-600">
                  <Clock className="mr-3 h-6 w-6" />
                  Orari delle Pratiche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-zen-cream rounded-lg">
                    <h4 className="font-serif font-semibold text-lg mb-2 flex items-center gap-2">
                      📅 Giovedì
                    </h4>
                    <p className="text-muted-foreground font-medium">17:00 - 18:30</p>
                    <p className="text-sm mt-1 text-muted-foreground">Zazen e cerimonia</p>
                  </div>

                  <div className="p-4 bg-zen-cream rounded-lg">
                    <h4 className="font-serif font-semibold text-lg mb-2 flex items-center gap-2">
                      📅 Domenica
                    </h4>
                    <p className="text-muted-foreground font-medium">16:00 - 17:30</p>
                    <p className="text-sm mt-1 text-muted-foreground">Zazen e cerimonia</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Durante i week-end di ritiro: 15:00 - 16:30
                    </p>
                  </div>

                  <div className="p-4 bg-zen-cream rounded-lg">
                    <h4 className="font-serif font-semibold text-lg mb-2 flex items-center gap-2">
                      📅 Altri giorni
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Mattino:</span> ore 7:00
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Sera:</span> ore 18:30
                      </p>
                      <p className="text-xs text-amber-700 font-medium mt-3 p-2 bg-amber-50 rounded">
                        ⚠️ Chiamare o messaggiare prima per confermare
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-saffron-50 border border-saffron-200 rounded-lg">
                    <h5 className="font-medium mb-3 text-saffron-900">Contatti per confermare:</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📞 339 7262753 (Ven. Tae Hye Sunim)</p>
                      <p>📞 392 7498954 (Monaco Kusalananda, anche WhatsApp)</p>
                    </div>
                  </div>

                  <div className="p-4 bg-zen-sage/20 border border-zen-sage rounded-lg">
                    <p className="text-sm font-medium text-zen-stone mb-2">
                      Durante le sessioni sono disponibili:
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Insegnamenti personalizzati</li>
                      <li>• Supporto per principianti</li>
                      <li>• Letture e discussioni</li>
                      <li>• Domande e risposte</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mappa Google Maps */}
          <div className="max-w-6xl mx-auto mb-16">
            <Card className="border-zen-sage bg-background overflow-hidden">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-center text-saffron-600">
                  Dove Siamo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[450px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2876.4444!2d9.9107!3d44.0753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d4f3c5e7a6a6a1%3A0x1234567890abcdef!2sMonti%20San%20Lorenzo%2C%2026%2C%2019032%20Lerici%20SP!5e0!3m2!1sit!2sit!4v1234567890123"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mappa Tempio Bodhidharma"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contattaci via Email */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-zen-sage bg-background">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-center text-saffron-600">
                  Scrivici un'Email
                </CardTitle>
                <p className="text-center text-muted-foreground text-sm mt-2">
                  Clicca il bottone per aprire il tuo client email con i dati già precompilati
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <a 
                    href="mailto:bodhidharmait@gmail.com?subject=Richiesta%20informazioni%20-%20Tempio%20Bodhidharma&body=Gentili%20monaci%2C%0A%0AScrivo%20per%20richiedere%20informazioni%20riguardo...%0A%0ACordiali%20saluti"
                    className="inline-flex items-center justify-center bg-saffron-500 hover:bg-saffron-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Scrivi un'Email
                  </a>
                </div>
                <div className="text-center text-sm text-muted-foreground border-t border-zen-sage/30 pt-4">
                  <p>Oppure copia l'indirizzo email principale:</p>
                  <a 
                    href="mailto:bodhidharmait@gmail.com" 
                    className="text-saffron-600 hover:text-saffron-700 font-medium"
                  >
                    bodhidharmait@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contatti;
