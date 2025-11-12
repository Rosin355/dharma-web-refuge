
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
            <div 
              className="text-lg leading-relaxed text-muted-foreground space-y-4"
              dangerouslySetInnerHTML={{ 
                __html: getContent('intro-text', 'Benvenuti nella pagina dei contatti del nostro tempio. Siamo qui per guidarti nel tuo percorso spirituale.') 
              }}
            />
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
                <div 
                  className="text-muted-foreground space-y-2"
                  dangerouslySetInnerHTML={{ 
                    __html: getContent('info-telefono-content', '<p><strong>Enku:</strong> +39 334 871 3515</p><p><strong>Orari:</strong> 14:00-20:00</p>') 
                  }}
                />
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
                <div 
                  className="text-muted-foreground space-y-2"
                  dangerouslySetInnerHTML={{ 
                    __html: getContent('info-email-content', '<a href="mailto:info@bodhidharma.info" class="hover:text-saffron-600">info@bodhidharma.info</a>') 
                  }}
                />
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
                <div 
                  className="space-y-4 text-muted-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: getContent('orari-content', `
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong>Giovedì:</strong> 19:00-21:00 - Zazen e cerimonia</div>
                        <div><strong>Domenica:</strong> 9:30-12:00 - Zazen e cerimonia</div>
                        <div><strong>Altri giorni:</strong> Su appuntamento</div>
                        <div><strong>Ritiri:</strong> Consultare calendario eventi</div>
                      </div>
                    `) 
                  }}
                />
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

          {/* Form di Contatto */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-zen-sage bg-background">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-center text-saffron-600">
                  Invia un Messaggio
                </CardTitle>
                <p className="text-center text-muted-foreground text-sm mt-2">
                  Compila il form e ti risponderemo al più presto
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Nome" className="border-zen-sage" />
                  <Input placeholder="Cognome" className="border-zen-sage" />
                </div>
                <Input type="email" placeholder="Email" className="border-zen-sage" />
                <Input placeholder="Oggetto" className="border-zen-sage" />
                <Textarea 
                  placeholder="Il tuo messaggio..." 
                  className="min-h-[150px] border-zen-sage"
                />
                <Button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-medium">
                  Invia Messaggio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contatti;
