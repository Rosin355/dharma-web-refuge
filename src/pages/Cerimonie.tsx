
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Cerimonie = () => {
  const cerimonie = [
    {
      title: "Cerimonia del Tè Zen",
      description: "Una pratica meditativa attraverso l'arte del tè, dove ogni gesto diventa contemplazione.",
      schedule: "Ogni prima domenica del mese",
      time: "15:00 - 17:00",
      location: "Sala del tè",
      image: "https://images.unsplash.com/photo-1544373884-5d7f2017d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Zazen - Meditazione Seduta",
      description: "La pratica fondamentale dello zen: meditazione seduta in silenzio e consapevolezza.",
      schedule: "Tutti i giorni",
      time: "6:00 - 7:00 e 19:00 - 20:00",
      location: "Sala meditazione principale",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Cerimonia della Luna Piena",
      description: "Rituale mensile di purificazione e rinnovamento spirituale alla luce della luna piena.",
      schedule: "Ogni luna piena",
      time: "20:00 - 22:00",
      location: "Giardino zen",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            Cerimonie & <span className="text-saffron-600">Rituali</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Partecipa alle nostre cerimonie tradizionali e rituali di crescita spirituale
          </p>
        </div>
      </section>

      {/* Cerimonie */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cerimonie.map((cerimonia, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-zen-sage">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={cerimonia.image} 
                    alt={cerimonia.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors">
                    {cerimonia.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {cerimonia.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-saffron-500" />
                      <span>{cerimonia.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-saffron-500" />
                      <span>{cerimonia.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-saffron-500" />
                      <span>{cerimonia.location}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white">
                    Partecipa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cerimonie;
