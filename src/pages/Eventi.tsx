
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { EventInfoDialog } from '@/components/EventInfoDialog';
import { EventRegistrationDialog } from '@/components/EventRegistrationDialog';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

const Eventi = () => {
  const [filter, setFilter] = useState('Tutti');
  const [selectedEventForInfo, setSelectedEventForInfo] = useState<Event | null>(null);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<Event | null>(null);
  
  const { events, isLoading } = useEvents('published');

  const eventTypes = ['Tutti', 'Ritiri', 'Conferenze', 'Meditazione', 'Workshop'];

  const filteredEvents = filter === 'Tutti' 
    ? events 
    : events.filter(event => event.type === filter);

  const isEventPast = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
      </div>
    );
  }

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
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-saffron-400" />
                        </div>
                      )}
                      {event.featured && (
                        <Badge className="absolute top-3 left-3 bg-saffron-500 text-white">
                          In Evidenza
                        </Badge>
                      )}
                      {event.end_date && isEventPast(event.end_date) && (
                        <Badge className="absolute top-3 right-3 bg-gray-500 text-white">
                          Passato
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-3">
                      {event.type && (
                        <Badge variant="secondary" className="bg-saffron-100 text-saffron-700">
                          {event.type}
                        </Badge>
                      )}
                      {event.price && (
                        <span className="text-lg font-semibold text-saffron-600">{event.price}</span>
                      )}
                    </div>
                    
                    <h3 className="font-serif text-2xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-saffron-500" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-saffron-500" />
                        <span>{formatTime(event.start_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-saffron-500" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.max_participants && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 text-saffron-500" />
                          <span>Max {event.max_participants} partecipanti</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        className="bg-saffron-500 hover:bg-saffron-600 text-white flex-1"
                        onClick={() => setSelectedEventForBooking(event)}
                        disabled={event.end_date ? isEventPast(event.end_date) : false}
                      >
                        {event.end_date && isEventPast(event.end_date) ? 'Evento Passato' : 'Prenota Posto'}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-saffron-200 text-saffron-600 hover:bg-saffron-50"
                        onClick={() => setSelectedEventForInfo(event)}
                      >
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

      {/* Dialogs */}
      <EventInfoDialog
        event={selectedEventForInfo}
        open={!!selectedEventForInfo}
        onOpenChange={(open) => !open && setSelectedEventForInfo(null)}
      />
      <EventRegistrationDialog
        event={selectedEventForBooking}
        open={!!selectedEventForBooking}
        onOpenChange={(open) => !open && setSelectedEventForBooking(null)}
      />
    </div>
  );
};

export default Eventi;
