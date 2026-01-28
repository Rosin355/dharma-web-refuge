
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { EventRegistrationDialog } from '@/components/EventRegistrationDialog';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

const Eventi = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tutti');
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<Event | null>(null);
  
  const { events, isLoading } = useEvents('published');

  const eventTypes = ['Tutti', 'Ritiri', 'Conferenze', 'Meditazione', 'Workshop'];

  const filteredEvents = filter === 'Tutti' 
    ? events 
    : events.filter(event => event.type === filter);

  const isEventPast = (endDate: string | null | undefined) => {
    if (!endDate) return false;
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className={`group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-zen-sage ${event.featured ? 'ring-2 ring-saffron-200' : ''}`}>
                {/* Horizontal Image Full Width */}
                <div className="relative w-full h-32 overflow-hidden">
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
                  <div className="absolute top-3 left-3 flex gap-2">
                    {event.featured && (
                      <Badge className="bg-saffron-500 text-white text-xs">
                        In Evidenza
                      </Badge>
                    )}
                    {event.end_date && isEventPast(event.end_date) && (
                      <Badge className="bg-gray-500 text-white text-xs">
                        Passato
                      </Badge>
                    )}
                  </div>
                  {event.price && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-saffron-600 shadow-lg">
                        {event.price}
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    {event.type && (
                      <Badge variant="secondary" className="bg-saffron-100 text-saffron-700 text-xs">
                        {event.type}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-lg font-semibold mb-1.5 group-hover:text-saffron-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-700 text-xs leading-relaxed mb-2 line-clamp-2">
                    {event.description 
                      ? event.description.replace(/<[^>]*>/g, '').substring(0, 120) + (event.description.replace(/<[^>]*>/g, '').length > 120 ? '...' : '')
                      : 'Nessuna descrizione disponibile.'}
                  </p>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center space-x-2 text-xs text-gray-700">
                      <Calendar className="h-3 w-3 text-saffron-500" />
                      <span className="truncate">{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-700">
                      <Clock className="h-3 w-3 text-saffron-500" />
                      <span>{formatTime(event.start_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2 text-xs text-gray-700">
                        <MapPin className="h-3 w-3 text-saffron-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center space-x-2 text-xs text-gray-700">
                        <Users className="h-3 w-3 text-saffron-500" />
                        <span>Max {event.max_participants} partecipanti</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="border-saffron-200 text-saffron-600 hover:bg-saffron-50 flex-[2] text-sm py-1.5"
                      onClick={() => navigate(`/eventi/${event.id}`)}
                    >
                      Info
                    </Button>
                    <Button 
                      className="bg-saffron-500 hover:bg-saffron-600 text-white flex-1 text-sm py-1.5"
                      onClick={() => setSelectedEventForBooking(event)}
                      disabled={event.end_date ? isEventPast(event.end_date) : false}
                    >
                      {event.end_date && isEventPast(event.end_date) ? 'Passato' : 'Prenota'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-700">Nessun evento trovato per questa categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 saffron-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Non Trovi l'Evento che Cerchi?
          </h2>
          <p className="text-saffron-100 mb-6 max-w-2xl mx-auto">
            Contattaci per informazioni su eventi, ritiri o sessioni individuali
          </p>
          <Link to="/contatti">
            <Button size="lg" variant="outline" className="bg-white text-saffron-600 border-white hover:bg-saffron-50">
              Contattaci
            </Button>
          </Link>
        </div>
      </section>

      {/* Dialogs */}
      <EventRegistrationDialog
        event={selectedEventForBooking}
        open={!!selectedEventForBooking}
        onOpenChange={(open) => !open && setSelectedEventForBooking(null)}
      />
    </div>
  );
};

export default Eventi;
