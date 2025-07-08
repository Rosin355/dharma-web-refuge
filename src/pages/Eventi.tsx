import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useEvents, Event } from '@/hooks/useEvents';

const Eventi = () => {
  const navigate = useNavigate();
  const { events, loading, error, loadPublishedEvents } = useEvents();
  const [filter, setFilter] = useState('Tutti');

  const eventTypes = ['Tutti', 'ritiro', 'cerimonia', 'conferenza', 'meditazione'];

  useEffect(() => {
    loadPublishedEvents();
  }, []);

  const filteredEvents = filter === 'Tutti' 
    ? events 
    : events.filter(event => event.type === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'ritiro': return 'bg-blue-100 text-blue-800';
      case 'cerimonia': return 'bg-purple-100 text-purple-800';
      case 'conferenza': return 'bg-green-100 text-green-800';
      case 'meditazione': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'ritiro': return 'Ritiri';
      case 'cerimonia': return 'Cerimonie';
      case 'conferenza': return 'Conferenze';
      case 'meditazione': return 'Meditazione';
      default: return type;
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/eventi/${eventId}`);
  };

  const handleInfoClick = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/eventi/${eventId}`);
  };

  const handleBookingClick = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/eventi/${eventId}?booking=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento eventi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4 text-white">
            Eventi & <span className="text-saffron-300">Ritiri</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
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
                {type === 'Tutti' ? type : getEventTypeLabel(type)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800">{error}</p>
              <Button 
                onClick={() => loadPublishedEvents()}
                variant="outline"
                className="mt-4"
              >
                Riprova
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className={`group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-zen-sage cursor-pointer ${event.featured ? 'ring-2 ring-saffron-200' : ''}`}
                onClick={() => handleEventClick(event.id)}
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="aspect-square md:aspect-auto md:h-full overflow-hidden relative">
                      <img 
                        src={event.image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
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
                      <Badge className={getEventTypeColor(event.type || 'meditazione')}>
                        {getEventTypeLabel(event.type || 'meditazione')}
                      </Badge>
                      <span className="text-lg font-semibold text-saffron-600">
                        {event.price || 'Gratis'}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-2xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {event.description || 'Descrizione non disponibile'}
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
                        onClick={(e) => handleBookingClick(event.id, e)}
                      >
                        Prenota Posto
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-saffron-200 text-saffron-600 hover:bg-saffron-50"
                        onClick={(e) => handleInfoClick(event.id, e)}
                      >
                        Info
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {filter === 'Tutti' 
                  ? 'Nessun evento disponibile al momento.' 
                  : `Nessun evento di tipo "${getEventTypeLabel(filter)}" trovato.`}
              </p>
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
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-saffron-600 border-white hover:bg-saffron-50"
            onClick={() => navigate('/contatti')}
          >
            Contattaci
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Eventi;
