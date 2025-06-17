
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const Eventi = () => {
  const [filter, setFilter] = useState('Tutti');

  const eventTypes = ['Tutti', 'Ritiri', 'Conferenze', 'Meditazione', 'Workshop'];

  const events = [
    {
      id: 1,
      title: "Ritiro di Meditazione Zen",
      description: "Un weekend intensivo di pratica meditativa zen nel silenzio e nella natura. Adatto a principianti e praticanti esperti.",
      date: "25-27 Giugno 2024",
      time: "Venerdì 18:00 - Domenica 17:00",
      location: "Centro Monastico Bodhidharma",
      type: "Ritiri",
      participants: "Max 20 partecipanti",
      price: "€150",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 2,
      title: "Conferenza: Il Dharma nella Vita Quotidiana",
      description: "Una serata di approfondimento su come integrare gli insegnamenti buddhisti nella vita moderna con il Maestro Chen.",
      date: "15 Luglio 2024",
      time: "20:00 - 22:00",
      location: "Sala conferenze del centro",
      type: "Conferenze",
      participants: "Max 50 partecipanti",
      price: "Offerta libera",
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 3,
      title: "Meditazione Camminata nel Bosco",
      description: "Pratica di meditazione camminata nella natura circostante il monastero. Un'esperienza di connessione profonda.",
      date: "Ogni Sabato",
      time: "9:00 - 11:00",
      location: "Sentieri del bosco",
      type: "Meditazione",
      participants: "Max 15 partecipanti",
      price: "€20",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 4,
      title: "Workshop: Calligrafia Zen",
      description: "Impara l'arte della calligrafia zen come pratica meditativa. Unisci arte e spiritualità in un'esperienza unica.",
      date: "30 Luglio 2024",
      time: "14:00 - 17:00",
      location: "Atelier del centro",
      type: "Workshop",
      participants: "Max 12 partecipanti",
      price: "€80",
      image: "https://images.unsplash.com/photo-1544373884-5d7f2017d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 5,
      title: "Sesshin di Primavera",
      description: "Sessione intensiva di meditazione zen di 7 giorni. Un'immersione profonda nella pratica tradizionale.",
      date: "5-12 Settembre 2024",
      time: "Arrivo Giovedì 16:00 - Partenza Giovedì 11:00",
      location: "Centro Monastico Bodhidharma",
      type: "Ritiri",
      participants: "Max 25 partecipanti",
      price: "€420",
      image: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 6,
      title: "Serata di Meditazione per Principianti",
      description: "Introduzione gentile alla pratica meditativa. Perfetto per chi si avvicina per la prima volta alla meditazione.",
      date: "Ogni Mercoledì",
      time: "19:30 - 21:00",
      location: "Sala meditazione",
      type: "Meditazione",
      participants: "Max 20 partecipanti",
      price: "€15",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    }
  ];

  const filteredEvents = filter === 'Tutti' 
    ? events 
    : events.filter(event => event.type === filter);

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            Eventi & <span className="text-saffron-600">Ritiri</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Partecipa ai nostri eventi per approfondire la pratica e crescere insieme alla comunità
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-zen-sage">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {eventTypes.map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                onClick={() => setFilter(type)}
                className={filter === type ? "bg-saffron-500 hover:bg-saffron-600" : ""}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className={`group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-zen-sage ${event.featured ? 'ring-2 ring-saffron-200' : ''}`}>
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="aspect-square md:aspect-auto md:h-full overflow-hidden relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {event.featured && (
                        <Badge className="absolute top-3 left-3 bg-saffron-500 text-white">
                          In Evidenza
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-saffron-100 text-saffron-700">
                        {event.type}
                      </Badge>
                      <span className="text-lg font-semibold text-saffron-600">{event.price}</span>
                    </div>
                    
                    <h3 className="font-serif text-2xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-saffron-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-saffron-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-saffron-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 text-saffron-500" />
                        <span>{event.participants}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="bg-saffron-500 hover:bg-saffron-600 text-white flex-1">
                        Prenota Posto
                      </Button>
                      <Button variant="outline" className="border-saffron-200 text-saffron-600 hover:bg-saffron-50">
                        Info
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nessun evento trovato per questa categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 saffron-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Non Trovare l'Evento che Cerchi?
          </h2>
          <p className="text-saffron-100 mb-6 max-w-2xl mx-auto">
            Contattaci per informazioni su eventi privati, ritiri personalizzati o sessioni individuali
          </p>
          <Button size="lg" variant="outline" className="bg-white text-saffron-600 border-white hover:bg-saffron-50">
            Contattaci
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Eventi;
