import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Loader2,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { events, createEvent, updateEvent } = useEvents();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date(),
    start_time: '09:00',
    end_date: new Date(),
    end_time: '18:00',
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

  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [imageResults, setImageResults] = useState<any[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEditMode && events.length > 0) {
      const event = events.find((e) => e.id === id);
      if (event) {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date || event.start_date);
        
        const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
        const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        setFormData({
          title: event.title,
          description: event.description || '',
          start_date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
          start_time: startTime,
          end_date: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
          end_time: endTime,
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
      }
    }
  }, [id, isEditMode, events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Errore',
        description: 'Titolo e descrizione sono obbligatori',
        variant: 'destructive',
      });
      return;
    }

    try {
      const startDateTime = new Date(formData.start_date);
      const [startHours, startMinutes] = formData.start_time.split(':');
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      const endDateTime = new Date(formData.end_date);
      const [endHours, endMinutes] = formData.end_time.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      if (isEditMode && id) {
        await updateEvent.mutateAsync({
          id,
          updates: {
            title: formData.title,
            description: formData.description,
            start_date: startDateTime.toISOString(),
            end_date: endDateTime.toISOString(),
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
      } else {
        await createEvent.mutateAsync({
          title: formData.title,
          description: formData.description,
          start_date: startDateTime.toISOString(),
          end_date: endDateTime.toISOString(),
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
      }

      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Errore',
        description: isEditMode 
          ? 'Errore durante l\'aggiornamento dell\'evento'
          : 'Errore durante la creazione dell\'evento',
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Errore',
        description: 'Il file selezionato non è un\'immagine',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingImage(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Devi essere autenticato per caricare immagini.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `event-image-${Date.now()}.${fileExt}`;
      const filePath = `events/images/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('row-level security') || uploadError.message.includes('policy')) {
          throw new Error('Errore permessi: le policy del storage non sono configurate correttamente.');
        }
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        image_url: urlData.publicUrl,
      }));

      toast({
        title: 'Successo',
        description: 'Immagine caricata con successo',
      });
    } catch (err) {
      console.error('❌ Errore upload immagine:', err);
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante il caricamento dell\'immagine',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Indietro
            </Button>
            <CardTitle className="text-2xl">
              {isEditMode ? 'Modifica Evento' : 'Crea Nuovo Evento'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Titolo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Nome evento"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrizione *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Descrizione dettagliata dell'evento"
                rows={4}
                required
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
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="start_time">Orario Inizio *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="end_time">Orario Fine</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Luogo</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="Es. Centro Bodhidharma"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type || undefined}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ritiri">Ritiri</SelectItem>
                    <SelectItem value="Conferenze">Conferenze</SelectItem>
                    <SelectItem value="Meditazione">Meditazione</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prezzo</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
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
                    setFormData((prev) => ({ ...prev, max_participants: e.target.value }))
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
                  setFormData((prev) => ({ ...prev, attendance_type: value }))
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
                    setFormData((prev) => ({ ...prev, meeting_url: e.target.value }))
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
                    setFormData((prev) => ({ ...prev, image_url: e.target.value }))
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
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage}
                    asChild
                  >
                    <span>
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </span>
                  </Button>
                </label>
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
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona stato" />
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
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="rounded"
                />
                <Label htmlFor="featured">In Evidenza</Label>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={createEvent.isPending || updateEvent.isPending}
                className="bg-saffron-600 hover:bg-saffron-700"
              >
                {(createEvent.isPending || updateEvent.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  isEditMode ? 'Salva Modifiche' : 'Crea Evento'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;

