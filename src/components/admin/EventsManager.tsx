import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Euro,
  Edit,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image,
  Upload,
  Search,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useEvents, Event, EventInsert, EventUpdate } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';

// Interfaccia per immagini Unsplash
interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

const EventsManager = () => {
  const { 
    events, 
    loading, 
    error, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    loadAllBookings,
    bookings,
    updateBooking,
    clearError
  } = useEvents();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventInsert>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    type: 'meditazione',
    max_participants: 20,
    price: '',
    image_url: '',
    meeting_url: '',
    featured: false,
    status: 'draft'
  });

  // Stati per gestione immagini
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showUnsplashSearch, setShowUnsplashSearch] = useState(false);
  const [unsplashSearchTerm, setUnsplashSearchTerm] = useState('');
  const [unsplashResults, setUnsplashResults] = useState<UnsplashImage[]>([]);
  const [searchingUnsplash, setSearchingUnsplash] = useState(false);
  const [unsplashKey, setUnsplashKey] = useState('');

  const [showBookings, setShowBookings] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const eventTypes = ['ritiro', 'cerimonia', 'conferenza', 'meditazione'];
  const statusOptions = ['draft', 'published', 'cancelled'];
  const bookingStatusOptions = ['pending', 'confirmed', 'cancelled', 'paid'];

  useEffect(() => {
    if (showBookings) {
      loadAllBookings();
    }
    // Carica chiave Unsplash salvata
    const savedKey = localStorage.getItem('unsplash_access_key');
    if (savedKey) setUnsplashKey(savedKey);
  }, [showBookings, loadAllBookings]);

  // Funzione per upload file
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validazione file
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Seleziona solo file immagine (JPG, PNG, WebP)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        variant: "destructive",
        title: "Errore",
        description: "L'immagine deve essere inferiore a 5MB",
      });
      return;
    }

    try {
      setUploadingFile(true);
      
      // Genera nome file unico
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      // Upload su Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Ottieni URL pubblico
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Aggiorna form con l'URL
      setFormData(prev => ({ ...prev, image_url: urlData.publicUrl }));
      setShowImageOptions(false);

      toast({
        title: "Upload completato!",
        description: "Immagine caricata con successo",
      });

    } catch (error) {
      console.error('Errore upload:', error);
      toast({
        variant: "destructive",
        title: "Errore upload",
        description: "Impossibile caricare l'immagine. Riprova.",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  // Funzione per ricerca Unsplash
  const searchUnsplashImages = async (query: string) => {
    if (!unsplashKey || !query.trim()) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Configura prima la chiave Unsplash nelle impostazioni",
      });
      return;
    }

    try {
      setSearchingUnsplash(true);

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${unsplashKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Errore nella ricerca immagini Unsplash');
      }

      const data = await response.json();
      setUnsplashResults(data.results || []);

      if (data.results.length === 0) {
        toast({
          title: "Nessun risultato",
          description: "Prova con parole chiave diverse",
        });
      }
    } catch (error) {
      console.error('Errore ricerca Unsplash:', error);
      toast({
        variant: "destructive",
        title: "Errore ricerca",
        description: "Impossibile cercare immagini. Verifica la chiave API.",
      });
    } finally {
      setSearchingUnsplash(false);
    }
  };

  // Funzione per selezionare immagine Unsplash
  const selectUnsplashImage = async (image: UnsplashImage) => {
    try {
      // Traccia utilizzo senza bloccare CORS (usa una nuova finestra nascosta)
      try {
        const trackingWindow = window.open(
          image.links.html + '?utm_source=dharma-web-refuge&utm_medium=referral',
          '_blank',
          'width=1,height=1,left=-1000'
        );
        if (trackingWindow) {
          setTimeout(() => trackingWindow.close(), 1000);
        }
      } catch (trackingError) {
        // Ignora errori di tracking, non devono bloccare la selezione
        console.log('Info: Tracking Unsplash saltato');
      }
      
      setFormData(prev => ({ 
        ...prev, 
        image_url: image.urls.regular 
      }));
      setShowUnsplashSearch(false);
      setUnsplashResults([]);
      setShowImageOptions(false);

      toast({
        title: "Immagine selezionata!",
        description: `Immagine di ${image.user.name} aggiunta all'evento`,
      });
    } catch (error) {
      console.error('Errore selezione immagine:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Problema nella selezione dell'immagine. Riprova.",
      });
    }
  };

  // Funzione per rimuovere immagine
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      if (editingEvent) {
        result = await updateEvent(editingEvent.id, formData);
      } else {
        result = await createEvent(formData);
      }

      if (result.success) {
        toast({
          title: editingEvent ? "Evento aggiornato!" : "Evento creato!",
          description: editingEvent 
            ? "L'evento è stato aggiornato con successo." 
            : "Il nuovo evento è stato creato con successo.",
        });
        setIsEditModalOpen(false);
        setEditingEvent(null);
        resetForm();
      } else {
        toast({
          variant: "destructive",
          title: "Errore",
          description: result.error || "Si è verificato un errore durante l'operazione.",
        });
      }
    } catch (error) {
      console.error('Errore handleSubmit:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore imprevisto. Controlla la console per i dettagli.",
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start_date: event.start_date,
      end_date: event.end_date || '',
      location: event.location || '',
      type: event.type || 'meditazione',
      max_participants: event.max_participants || 20,
      price: event.price || '',
      image_url: event.image_url || '',
      meeting_url: (event as any).meeting_url || '',
      featured: event.featured || false,
      status: event.status || 'draft'
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      const result = await deleteEvent(eventId);
      if (result.success) {
        toast({
          title: "Evento eliminato!",
          description: "L'evento è stato eliminato con successo.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Errore durante l'eliminazione dell'evento.",
        });
      }
    }
  };

  const handleBookingStatusChange = async (bookingId: string, newStatus: string) => {
    const result = await updateBooking(bookingId, { status: newStatus });
    if (result.success) {
      toast({
        title: "Stato aggiornato!",
        description: `Lo stato della prenotazione è stato cambiato in: ${newStatus}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore durante l'aggiornamento dello stato.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      type: 'meditazione',
      max_participants: 20,
      price: '',
      image_url: '',
      meeting_url: '',
      featured: false,
      status: 'draft'
    });
  };

  const openNewEventModal = () => {
    setEditingEvent(null);
    resetForm();
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const eventBookings = bookings.filter(booking => booking.event_id === selectedEventId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestione Eventi</h2>
          <p className="text-muted-foreground">Crea e gestisci eventi e prenotazioni</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowBookings(!showBookings)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showBookings ? 'Nascondi Prenotazioni' : 'Mostra Prenotazioni'}
          </Button>
          <Button onClick={openNewEventModal} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuovo Evento
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearError}
              className="ml-2 text-red-600 hover:text-red-700"
            >
              Chiudi
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="border-zen-sage">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge className={getStatusBadgeColor(event.status || 'draft')}>
                      {event.status || 'draft'}
                    </Badge>
                    {event.featured && (
                      <Badge className="bg-saffron-100 text-saffron-800">
                        In Evidenza
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-saffron-500" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-saffron-500" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-saffron-500" />
                        <span>Max {event.max_participants} partecipanti</span>
                      </div>
                    )}
                    {event.price && (
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-saffron-500" />
                        <span>{event.price}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setShowBookings(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Panel */}
      {showBookings && (
        <Card className="border-zen-sage">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Prenotazioni {selectedEventId ? `per l'evento selezionato` : 'di tutti gli eventi'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(selectedEventId ? eventBookings : bookings).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{booking.user_name}</h4>
                      <Badge className={getBookingStatusBadgeColor(booking.status || 'pending')}>
                        {booking.status || 'pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{booking.user_email}</p>
                    {booking.user_phone && (
                      <p className="text-sm text-muted-foreground mb-1">{booking.user_phone}</p>
                    )}
                    <p className="text-sm">
                      Partecipanti: {booking.participants_count || 1}
                    </p>
                    {booking.message && (
                      <p className="text-sm text-muted-foreground mt-2">
                        "{booking.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={booking.status || 'pending'}
                      onValueChange={(value) => handleBookingStatusChange(booking.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              {(selectedEventId ? eventBookings : bookings).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nessuna prenotazione trovata
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit/Create Event Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Modifica Evento' : 'Nuovo Evento'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type || 'meditazione'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Data e Ora Inizio *</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="end_date">Data e Ora Fine</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Luogo</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="max_participants">Max Partecipanti</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prezzo</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="es. €50, Offerta libera"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Stato</Label>
                <Select
                  value={formData.status || 'draft'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gestione Immagine */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Immagine Evento</Label>
              
              {formData.image_url ? (
                <div className="space-y-2">
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Anteprima immagine evento"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      ✕
                    </Button>
                  </div>
                  <Input
                    placeholder="URL immagine diretto (opzionale)"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={uploadingFile}
                    className="h-20 flex-col"
                  >
                    {uploadingFile ? (
                      <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    ) : (
                      <Upload className="h-6 w-6 mb-2" />
                    )}
                    {uploadingFile ? 'Caricamento...' : 'Carica File'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowImageOptions(true)}
                    disabled={!unsplashKey}
                    className="h-20 flex-col"
                  >
                    <Search className="h-6 w-6 mb-2" />
                    {unsplashKey ? 'Cerca Unsplash' : 'Configura API'}
                  </Button>
                  
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                </div>
              )}

              {!unsplashKey && (
                <p className="text-xs text-muted-foreground">
                  💡 Per usare Unsplash, configura la chiave API nel tab "Immagini" dell'admin
                </p>
              )}
            </div>

            {/* Opzioni Immagine Modal */}
            <Dialog open={showImageOptions} onOpenChange={setShowImageOptions}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Cerca Immagine per Evento</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cerca immagini (es: meditation, zen, temple, yoga)"
                      value={unsplashSearchTerm}
                      onChange={(e) => setUnsplashSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchUnsplashImages(unsplashSearchTerm)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => searchUnsplashImages(unsplashSearchTerm)}
                      disabled={searchingUnsplash || !unsplashSearchTerm.trim()}
                      className="bg-saffron-600 hover:bg-saffron-700"
                    >
                      {searchingUnsplash ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {unsplashResults.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {unsplashResults.map((image) => (
                        <div key={image.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                          <img
                            src={image.urls.small}
                            alt={image.alt_description || 'Immagine Unsplash'}
                            className="w-full h-32 object-cover cursor-pointer"
                            onClick={() => selectUnsplashImage(image)}
                          />
                          <div className="p-2">
                            <p className="text-xs text-gray-600 truncate">
                              by {image.user.name}
                            </p>
                            <div className="flex gap-1 mt-2">
                              <Button
                                size="sm"
                                onClick={() => selectUnsplashImage(image)}
                                className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-xs"
                              >
                                Seleziona
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(image.links.html, '_blank')}
                                className="text-xs"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <div>
              <Label htmlFor="meeting_url">Link Evento (Zoom/Meet/Streaming)</Label>
              <Input
                id="meeting_url"
                value={formData.meeting_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, meeting_url: e.target.value }))}
                placeholder="https://zoom.us/j/... o https://youtube.com/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Per eventi online, ibridi o streaming backup
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
              />
              <Label htmlFor="featured">Evento in evidenza</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Annulla
              </Button>
              <Button type="submit" className="bg-saffron-600 hover:bg-saffron-700">
                {editingEvent ? 'Aggiorna' : 'Crea'} Evento
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager; 