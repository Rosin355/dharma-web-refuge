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
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Upload,
  Music,
  FileText,
} from 'lucide-react';
import { useCeremonies } from '@/hooks/useCeremonies';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];

const CeremonyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { ceremonies, createCeremony, updateCeremony } = useCeremonies();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    schedule: '',
    time: '',
    location: '',
    type: '',
    price: '',
    max_participants: '',
    meeting_url: '',
    image_url: '',
    audio_file_url: '',
    pdf_file_url: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
    attendance_type: 'in_person' as 'in_person' | 'online' | 'hybrid',
  });

  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [imageResults, setImageResults] = useState<any[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Carica i dati se siamo in modalità modifica
  useEffect(() => {
    if (isEditMode && ceremonies.length > 0) {
      const ceremony = ceremonies.find((c) => c.id === id);
      if (ceremony) {
        setFormData({
          title: ceremony.title,
          description: ceremony.description || '',
          schedule: ceremony.schedule || '',
          time: ceremony.time || '',
          location: ceremony.location || '',
          type: ceremony.type || '',
          price: ceremony.price || '',
          max_participants: ceremony.max_participants?.toString() || '',
          meeting_url: ceremony.meeting_url || '',
          image_url: ceremony.image_url || '',
          audio_file_url: ceremony.audio_file_url || '',
          pdf_file_url: ceremony.pdf_file_url || '',
          status: (ceremony.status as 'draft' | 'published') || 'draft',
          featured: ceremony.featured || false,
          attendance_type: (ceremony.attendance_type as 'in_person' | 'online' | 'hybrid') || 'in_person',
        });
      }
    }
  }, [id, isEditMode, ceremonies]);

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
      if (isEditMode && id) {
        await updateCeremony.mutateAsync({
          id,
          updates: {
            title: formData.title,
            description: formData.description,
            schedule: formData.schedule || null,
            time: formData.time || null,
            location: formData.location || null,
            type: formData.type || null,
            price: formData.price || null,
            max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
            meeting_url: formData.meeting_url || null,
            image_url: formData.image_url || null,
            audio_file_url: formData.audio_file_url || null,
            pdf_file_url: formData.pdf_file_url || null,
            status: formData.status,
            featured: formData.featured,
            attendance_type: formData.attendance_type,
          },
        });

        toast({
          title: 'Successo',
          description: 'Cerimonia aggiornata con successo',
        });
      } else {
        await createCeremony.mutateAsync({
          title: formData.title,
          description: formData.description,
          schedule: formData.schedule || null,
          time: formData.time || null,
          location: formData.location || null,
          type: formData.type || null,
          price: formData.price || null,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          meeting_url: formData.meeting_url || null,
          image_url: formData.image_url || null,
          audio_file_url: formData.audio_file_url || null,
          pdf_file_url: formData.pdf_file_url || null,
          status: formData.status,
          featured: formData.featured,
          attendance_type: formData.attendance_type,
        });

        toast({
          title: 'Successo',
          description: 'Cerimonia creata con successo',
        });
      }

      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Errore',
        description: isEditMode 
          ? 'Errore durante l\'aggiornamento della cerimonia'
          : 'Errore durante la creazione della cerimonia',
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
      const fileName = `ceremony-image-${Date.now()}.${fileExt}`;
      const filePath = `ceremonies/images/${fileName}`;

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: 'audio' | 'pdf'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileType === 'audio' && !file.type.startsWith('audio/')) {
      toast({
        title: 'Errore',
        description: 'Il file selezionato non è un file audio',
        variant: 'destructive',
      });
      return;
    }

    if (fileType === 'pdf') {
      const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(fileExt)) {
        toast({
          title: 'Errore',
          description: 'Seleziona un file PDF, DOC, DOCX o TXT',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      setSearchingImages(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `ceremony-${Date.now()}.${fileExt}`;
      const filePath = `ceremonies/${fileType}-files/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const fieldName = fileType === 'audio' ? 'audio_file_url' : 'pdf_file_url';
      setFormData((prev) => ({
        ...prev,
        [fieldName]: urlData.publicUrl,
      }));

      toast({
        title: 'Successo',
        description: 'File caricato con successo',
      });
    } catch (err) {
      console.error('❌ Errore upload file:', err);
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante il caricamento del file',
        variant: 'destructive',
      });
    } finally {
      setSearchingImages(false);
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
              {isEditMode ? 'Modifica Cerimonia' : 'Crea Nuova Cerimonia'}
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
                placeholder="Nome cerimonia"
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
                placeholder="Descrizione dettagliata della cerimonia"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule">Frequenza</Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, schedule: e.target.value }))
                  }
                  placeholder="Es. Ogni domenica, Luna piena"
                />
              </div>

              <div>
                <Label htmlFor="time">Orario</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  placeholder="Es. 15:00 - 17:00"
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
                  placeholder="Es. Sala del tè"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  placeholder="Es. Meditazione, Rituale"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prezzo</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Es. Offerta libera"
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

            <div className="space-y-4 border-t pt-4">
              <div>
                <Label>File Audio</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={formData.audio_file_url}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, audio_file_url: e.target.value }))
                    }
                    placeholder="URL file audio"
                  />
                  <label>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'audio')}
                      disabled={searchingImages}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      disabled={searchingImages}
                    >
                      <span>
                        {searchingImages ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Music className="h-4 w-4" />
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
                {formData.audio_file_url && (
                  <audio controls className="mt-2 w-full">
                    <source src={formData.audio_file_url} />
                    Il tuo browser non supporta l'elemento audio.
                  </audio>
                )}
              </div>

              <div>
                <Label>File PDF/Testo</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={formData.pdf_file_url}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pdf_file_url: e.target.value }))
                    }
                    placeholder="URL file PDF o altro file"
                  />
                  <label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      disabled={searchingImages}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      disabled={searchingImages}
                    >
                      <span>
                        {searchingImages ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
                {formData.pdf_file_url && (
                  <div className="mt-2">
                    <a
                      href={formData.pdf_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-saffron-600 hover:underline flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Visualizza file
                    </a>
                  </div>
                )}
              </div>
            </div>

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
                disabled={createCeremony.isPending || updateCeremony.isPending}
                className="bg-saffron-600 hover:bg-saffron-700"
              >
                {(createCeremony.isPending || updateCeremony.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  isEditMode ? 'Salva Modifiche' : 'Crea Cerimonia'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CeremonyForm;

