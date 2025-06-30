
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
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            <span className="text-saffron-600">{getContent('header-title', 'Contatti')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {getContent('header-subtitle', 'Entra in contatto con la nostra comunità. Siamo qui per guidarti nel tuo percorso spirituale')}
          </p>
        </div>
      </section>

      {/* Informazioni di Contatto */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-zen-sage">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-saffron-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  {getContent('info-indirizzo-title', 'Indirizzo')}
                </h3>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: getContent('info-indirizzo-content', 'Via del Dharma, 108<br />00100 Roma, Italia') 
                  }}
                />
              </CardContent>
            </Card>

            <Card className="text-center border-zen-sage">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                  <Phone className="h-8 w-8 text-saffron-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  {getContent('info-telefono-title', 'Telefono')}
                </h3>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: getContent('info-telefono-content', '+39 123 456 789<br />Lun-Ven: 9:00-18:00') 
                  }}
                />
              </CardContent>
            </Card>

            <Card className="text-center border-zen-sage">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-saffron-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  {getContent('info-email-title', 'Email')}
                </h3>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: getContent('info-email-content', 'info@bodhidharma.info<br />eventi@bodhidharma.info') 
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form di Contatto */}
            <Card className="border-zen-sage">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  {getContent('form-title', 'Invia un Messaggio')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Nome" />
                  <Input placeholder="Cognome" />
                </div>
                <Input type="email" placeholder="Email" />
                <Input placeholder="Oggetto" />
                <Textarea 
                  placeholder="Il tuo messaggio..." 
                  className="min-h-[120px]"
                />
                <Button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white">
                  Invia Messaggio
                </Button>
              </CardContent>
            </Card>

            {/* Orari e Informazioni */}
            <div className="space-y-6">
              <Card className="border-zen-sage">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-saffron-500" />
                    {getContent('orari-title', 'Orari delle Attività')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Zazen Mattutino</span>
                    <span className="text-muted-foreground">6:00 - 7:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Studio del Dharma</span>
                    <span className="text-muted-foreground">10:00 - 11:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Zazen Serale</span>
                    <span className="text-muted-foreground">19:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Cerimonia del Tè</span>
                    <span className="text-muted-foreground">Prima domenica del mese</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zen-sage">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Come Raggiungerci</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Metro:</strong> Linea A - Fermata Ottaviano</p>
                    <p><strong>Bus:</strong> Linee 40, 64, 916</p>
                    <p><strong>Auto:</strong> Parcheggio disponibile in Via del Dharma</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contatti;
