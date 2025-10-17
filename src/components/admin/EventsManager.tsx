import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Calendar as CalendarIcon,
  Save,
  X,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

const EventsManager = () => {
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    location: '',
    type: '',
    price: '',
    max_participants: '',
    meeting_url: '',
    image_url: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
    attendance_type: 'in_person' as 'in_person' | 'online' | 'hybrid',
  });

  // Image search
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [imageResults, setImageResults] = useState<any[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [unsplashKey, setUnsplashKey] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: new Date(),
      end_date: new Date(),
      location: '',
      type: '',
      price: '',
      max_participants: '',
      meeting_url: '',
      image_url: '',
      status: 'draft',
      featured: false,
      attendance_type: 'in_person',
    });
    setShowImageSearch(false);
    setImageResults([]);
  };

  const handleCreate = async () => {
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        toast({
          title: 'Errore',
          description: 'Titolo e descrizione sono obbligatori',
          variant: 'destructive',
        });
        return;
      }

      await createEvent.mutateAsync({
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        location: formData.location || null,
        type: formData.type || null,
        price: formData.price || null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        meeting_url: formData.meeting_url || null,
        image_url: formData.image_url || null,
        status: formData.status,
        featured: formData.featured,
        attendance_type: formData.attendance_type,
      });

      toast({
        title: 'Successo',
        description: 'Evento creato con successo',
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante la creazione dell\'evento',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedEvent) return;

      await updateEvent.mutateAsync({
        id: selectedEvent.id,
        updates: {
          title: formData.title,
          description: formData.description,
          start_date: formData.start_date.toISOString(),
          end_date: formData.end_date.toISOString(),
          location: formData.location || null,
          type: formData.type || null,
          price: formData.price || null,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          meeting_url: formData.meeting_url || null,
          image_url: formData.image_url || null,
          status: formData.status,
          featured: formData.featured,
          attendance_type: formData.attendance_type,
        },
      });

      toast({
        title: 'Successo',
        description: 'Evento aggiornato con successo',
      });

      setShowEditModal(false);
      resetForm();
      setSelectedEvent(null);
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'aggiornamento dell\'evento',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedEvent) return;

      await deleteEvent.mutateAsync(selectedEvent.id);

      toast({
        title: 'Successo',
        description: 'Evento eliminato con successo',
      });

      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'eliminazione dell\'evento',
        variant: 'destructive',
      });
    }
  };

  const searchUnsplashImages = async (query: string) => {
    const savedKey = localStorage.getItem('unsplash_access_key');
    if (!savedKey || !query.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci una chiave Unsplash e un termine di ricerca',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSearchingImages(true);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=12&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${savedKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Errore ricerca Unsplash');

      const data = await response.json();
      setImageResults(data.results || []);
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante la ricerca immagini',
        variant: 'destructive',
      });
    } finally {
      setSearchingImages(false);
    }
  };

  const selectImage = (image: any) => {
    setFormData((prev) => ({
      ...prev,
      image_url: image.urls.regular,
    }));
    setShowImageSearch(false);
    setImageResults([]);
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date || event.start_date),
      location: event.location || '',
      type: event.type || '',
      price: event.price || '',
      max_participants: event.max_participants?.toString() || '',
      meeting_url: event.meeting_url || '',
      image_url: event.image_url || '',
      status: (event.status as 'draft' | 'published') || 'draft',
      featured: event.featured || false,
      attendance_type: (event.attendance_type as 'in_person' | 'online' | 'hybrid') || 'in_person',
    });
    setShowEditModal(true);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            Pubblicato
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Bozza
          </Badge>
        );
      default:
        return <Badge variant="secondary">Sconosciuto</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
      </div>
    );
  }

  const FormFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Titolo *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nome evento"
        />
      </div>

      <div>
        <Label htmlFor="description">Descrizione *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Descrizione dettagliata dell'evento"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Data Inizio *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.start_date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.start_date, 'PPP', { locale: it })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.start_date}
                onSelect={(date) =>
                  date && setFormData({ ...formData, start_date: date })
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Data Fine</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.end_date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.end_date, 'PPP', { locale: it })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.end_date}
                onSelect={(date) =>
                  date && setFormData({ ...formData, end_date: date })
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Luogo</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Es. Centro Bodhidharma"
          />
        </div>
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="Es. Ritiri, Meditazione"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Prezzo</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Es. €150 o Offerta libera"
          />
        </div>
        <div>
          <Label htmlFor="max_participants">Max Partecipanti</Label>
          <Input
            id="max_participants"
            type="number"
            value={formData.max_participants}
            onChange={(e) =>
              setFormData({ ...formData, max_participants: e.target.value })
            }
            placeholder="20"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="attendance_type">Modalità di Partecipazione *</Label>
        <Select
          value={formData.attendance_type}
          onValueChange={(value: 'in_person' | 'online' | 'hybrid') =>
            setFormData({ ...formData, attendance_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_person">Solo in Presenza</SelectItem>
            <SelectItem value="online">Solo Online</SelectItem>
            <SelectItem value="hybrid">Ibrido (Presenza + Online)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.attendance_type === 'online' || formData.attendance_type === 'hybrid') && (
        <div>
          <Label htmlFor="meeting_url">Link Meeting Online *</Label>
          <Input
            id="meeting_url"
            value={formData.meeting_url}
            onChange={(e) =>
              setFormData({ ...formData, meeting_url: e.target.value })
            }
            placeholder="https://meet.example.com"
          />
        </div>
      )}

      <div>
        <Label>Immagine</Label>
        <div className="flex gap-2">
          <Input
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            placeholder="URL immagine"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowImageSearch(!showImageSearch)}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Preview"
            className="mt-2 w-full h-32 object-cover rounded"
          />
        )}
      </div>

      {showImageSearch && (
        <div className="space-y-2 p-4 border rounded-lg">
          <div className="flex gap-2">
            <Input
              value={imageSearchTerm}
              onChange={(e) => setImageSearchTerm(e.target.value)}
              placeholder="Cerca immagini su Unsplash..."
            />
            <Button
              type="button"
              onClick={() => searchUnsplashImages(imageSearchTerm)}
              disabled={searchingImages}
            >
              {searchingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cerca'}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {imageResults.map((img) => (
              <img
                key={img.id}
                src={img.urls.small}
                alt={img.alt_description}
                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                onClick={() => selectImage(img)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Stato</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'draft' | 'published') =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Bozza</SelectItem>
              <SelectItem value="published">Pubblicato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 mt-8">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="rounded"
          />
          <Label htmlFor="featured">In Evidenza</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Gestione Eventi</h2>
          <p className="text-sm text-muted-foreground">
            {events.length} eventi totali, {filteredEvents.length} visualizzati
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-saffron-600 hover:bg-saffron-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuovo Evento
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca eventi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="published">Pubblicati</SelectItem>
                <SelectItem value="draft">Bozze</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nessun evento trovato
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        {event.featured && (
                          <Badge className="mt-1 bg-saffron-500 text-white text-xs">
                            In Evidenza
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(event.start_date)}</TableCell>
                    <TableCell>{event.type || '-'}</TableCell>
                    <TableCell>{getStatusBadge(event.status || 'draft')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(event)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crea Nuovo Evento</DialogTitle>
          </DialogHeader>
          <FormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createEvent.isPending}
              className="bg-saffron-600 hover:bg-saffron-700"
            >
              {createEvent.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Crea Evento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Evento</DialogTitle>
          </DialogHeader>
          <FormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateEvent.isPending}
              className="bg-saffron-600 hover:bg-saffron-700"
            >
              {updateEvent.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Salva Modifiche'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
          </DialogHeader>
          <p>Sei sicuro di voler eliminare questo evento? L'azione è irreversibile.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
              variant="destructive"
            >
              {deleteEvent.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Elimina'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;
