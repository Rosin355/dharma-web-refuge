import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Euro, 
  ArrowLeft, 
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Link,
  Share2
} from 'lucide-react';
import { useEvents, Event, EventBookingInsert } from '@/hooks/useEvents';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadEvent, createBooking } = useEvents();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingFormData, setBookingFormData] = useState<EventBookingInsert>({
    event_id: id || '',
    user_name: '',
    user_email: '',
    user_phone: '',
    participants_count: 1,
    message: '',
    status: 'pending'
  });

  useEffect(() => {
    const loadEventData = async () => {
      if (!id) {
        setError('ID evento non valido');
        setLoading(false);
        return;
      }

      const result = await loadEvent(id);
      if (result.success) {
        setEvent(result.data);
      } else {
        setError(result.error || 'Evento non trovato');
      }
      setLoading(false);
    };

    loadEventData();
  }, [id, loadEvent]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createBooking(bookingFormData);
    if (result.success) {
      setBookingSuccess(true);
      setIsBookingModalOpen(false);
      // Reset form
      setBookingFormData({
        event_id: id || '',
        user_name: '',
        user_email: '',
        user_phone: '',
        participants_count: 1,
        message: '',
        status: 'pending'
      });
    } else {
      setError(result.error || 'Errore nella prenotazione');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Evento non trovato</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/eventi')} className="bg-saffron-600 hover:bg-saffron-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna agli Eventi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate('/eventi')}
            variant="outline"
            className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna agli Eventi
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getEventTypeColor(event.type || 'meditazione')}>
                {event.type || 'meditazione'}
              </Badge>
              {event.featured && (
                <Badge className="bg-saffron-100 text-saffron-800">
                  In Evidenza
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-4xl font-light mb-4 text-white">
              {event.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{formatTime(event.start_date)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.max_participants && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Max {event.max_participants} partecipanti</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Success Alert */}
      {bookingSuccess && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="border-green-200 bg-green-50 max-w-4xl mx-auto">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Prenotazione inviata con successo!</strong>
              <br />
              Riceverai una conferma via email entro 24 ore. Il pagamento verrà richiesto solo dopo la conferma.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Image */}
                {event.image_url && (
                  <Card className="overflow-hidden border-zen-sage">
                    <div className="aspect-video">
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                )}

                {/* Description */}
                <Card className="border-zen-sage">
                  <CardContent className="p-6">
                    <h2 className="font-serif text-2xl font-semibold mb-4">Descrizione</h2>
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {event.description || 'Nessuna descrizione disponibile per questo evento.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Details */}
                <Card className="border-zen-sage">
                  <CardContent className="p-6">
                    <h2 className="font-serif text-2xl font-semibold mb-4">Dettagli dell'Evento</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Data e Ora</h3>
                        <div className="space-y-1 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Inizio: {formatDate(event.start_date)} alle {formatTime(event.start_date)}</span>
                          </div>
                          {event.end_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Fine: {formatDate(event.end_date)} alle {formatTime(event.end_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {event.location && (
                        <div>
                          <h3 className="font-semibold mb-2">Luogo</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      )}
                      
                      {event.max_participants && (
                        <div>
                          <h3 className="font-semibold mb-2">Partecipanti</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Massimo {event.max_participants} persone</span>
                          </div>
                        </div>
                      )}
                      
                      {event.price && (
                        <div>
                          <h3 className="font-semibold mb-2">Prezzo</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Euro className="h-4 w-4" />
                            <span>{event.price}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Link */}
                {(event as any).meeting_url && (
                  <Card className="border-zen-sage">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Link className="h-5 w-5 text-saffron-600" />
                        Partecipa Online
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {event.location ? 
                          'Evento ibrido: puoi partecipare di persona o online' : 
                          'Evento online'
                        }
                      </p>
                      <Button 
                        onClick={() => window.open((event as any).meeting_url, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                      >
                        🎥 Accedi all'Evento Online
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Sharing */}
                <Card className="border-zen-sage">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-saffron-600" />
                      Condividi Evento
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                          window.open(url, '_blank');
                        }}
                        className="flex items-center gap-2"
                      >
                        📘 Facebook
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const text = `Partecipa a: ${event.title}`;
                          const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
                          window.open(url, '_blank');
                        }}
                        className="flex items-center gap-2"
                      >
                        🐦 Twitter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const text = `Ciao! Ti segnalo questo evento: ${event.title} - ${window.location.href}`;
                          const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                          window.open(url, '_blank');
                        }}
                        className="flex items-center gap-2"
                      >
                        💬 WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copiato!');
                        }}
                        className="flex items-center gap-2"
                      >
                        📋 Copia Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Booking Card */}
                <Card className="border-zen-sage sticky top-4">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      {event.price && (
                        <div className="text-2xl font-bold text-saffron-600 mb-2">
                          {event.price}
                        </div>
                      )}
                      <p className="text-muted-foreground text-sm">
                        Prenotazione richiesta
                      </p>
                    </div>
                    
                    <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-saffron-600 hover:bg-saffron-700 text-white">
                          Prenota Posto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Prenota per: {event.title}</DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="user_name">Nome Completo *</Label>
                            <Input
                              id="user_name"
                              value={bookingFormData.user_name || ''}
                              onChange={(e) => setBookingFormData(prev => ({ ...prev, user_name: e.target.value }))}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="user_email">Email *</Label>
                            <Input
                              id="user_email"
                              type="email"
                              value={bookingFormData.user_email || ''}
                              onChange={(e) => setBookingFormData(prev => ({ ...prev, user_email: e.target.value }))}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="user_phone">Telefono</Label>
                            <Input
                              id="user_phone"
                              type="tel"
                              value={bookingFormData.user_phone || ''}
                              onChange={(e) => setBookingFormData(prev => ({ ...prev, user_phone: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="participants_count">Numero Partecipanti</Label>
                            <Input
                              id="participants_count"
                              type="number"
                              min="1"
                              max={event.max_participants || 50}
                              value={bookingFormData.participants_count || 1}
                              onChange={(e) => setBookingFormData(prev => ({ ...prev, participants_count: parseInt(e.target.value) }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="message">Messaggio (opzionale)</Label>
                            <Textarea
                              id="message"
                              value={bookingFormData.message || ''}
                              onChange={(e) => setBookingFormData(prev => ({ ...prev, message: e.target.value }))}
                              placeholder="Eventuali note o richieste speciali..."
                              rows={3}
                            />
                          </div>
                          
                          <div className="bg-saffron-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Procedura di Prenotazione:</h4>
                            <ol className="text-sm space-y-1 text-muted-foreground">
                              <li>1. Invia la richiesta di prenotazione</li>
                              <li>2. Riceverai conferma via email entro 24 ore</li>
                              <li>3. Dopo la conferma, ti verranno inviati i dettagli per il pagamento via bonifico</li>
                              <li>4. Il posto sarà riservato solo dopo il pagamento</li>
                            </ol>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsBookingModalOpen(false)}
                            >
                              Annulla
                            </Button>
                            <Button 
                              type="submit" 
                              className="bg-saffron-600 hover:bg-saffron-700"
                            >
                              Invia Prenotazione
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>Conferma via email</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Euro className="h-4 w-4" />
                        <span>Pagamento via bonifico</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="border-zen-sage">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Informazioni</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-saffron-500" />
                        <span>+39 123 456 789</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-saffron-500" />
                        <span>eventi@bodhidharma.info</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-saffron-500" />
                        <span>Rispondiamo entro 24 ore</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail; 