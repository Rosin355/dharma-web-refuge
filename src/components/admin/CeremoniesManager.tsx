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
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useCeremonies } from '@/hooks/useCeremonies';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];

const CeremoniesManager = () => {
  const { ceremonies, isLoading, createCeremony, updateCeremony, deleteCeremony } = useCeremonies();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCeremony, setSelectedCeremony] = useState<Ceremony | null>(null);

  // Form state
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
    status: 'draft' as 'draft' | 'published',
    featured: false,
    attendance_type: 'in_person' as 'in_person' | 'online' | 'hybrid',
  });

  // Image search
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [imageResults, setImageResults] = useState<any[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);

  const resetForm = () => {
    setFormData({
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
        status: formData.status,
        featured: formData.featured,
        attendance_type: formData.attendance_type,
      });

      toast({
        title: 'Successo',
        description: 'Cerimonia creata con successo',
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante la creazione della cerimonia',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedCeremony) return;

      await updateCeremony.mutateAsync({
        id: selectedCeremony.id,
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
          status: formData.status,
          featured: formData.featured,
          attendance_type: formData.attendance_type,
        },
      });

      toast({
        title: 'Successo',
        description: 'Cerimonia aggiornata con successo',
      });

      setShowEditModal(false);
      resetForm();
      setSelectedCeremony(null);
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'aggiornamento della cerimonia',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedCeremony) return;

      await deleteCeremony.mutateAsync(selectedCeremony.id);

      toast({
        title: 'Successo',
        description: 'Cerimonia eliminata con successo',
      });

      setShowDeleteModal(false);
      setSelectedCeremony(null);
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'eliminazione della cerimonia',
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

  const openEditModal = (ceremony: Ceremony) => {
    setSelectedCeremony(ceremony);
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
      status: (ceremony.status as 'draft' | 'published') || 'draft',
      featured: ceremony.featured || false,
      attendance_type: (ceremony.attendance_type as 'in_person' | 'online' | 'hybrid') || 'in_person',
    });
    setShowEditModal(true);
  };

  const filteredCeremonies = ceremonies.filter((ceremony) => {
    const matchesSearch = ceremony.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || ceremony.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
          placeholder="Nome cerimonia"
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
          placeholder="Descrizione dettagliata della cerimonia"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="schedule">Frequenza</Label>
          <Input
            id="schedule"
            value={formData.schedule}
            onChange={(e) =>
              setFormData({ ...formData, schedule: e.target.value })
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
              setFormData({ ...formData, time: e.target.value })
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
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Es. Sala del tè"
          />
        </div>
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
          <h2 className="text-2xl font-semibold">Gestione Cerimonie</h2>
          <p className="text-sm text-muted-foreground">
            {ceremonies.length} cerimonie totali, {filteredCeremonies.length} visualizzate
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
          Nuova Cerimonia
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca cerimonie..."
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
                <TableHead>Frequenza</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCeremonies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nessuna cerimonia trovata
                  </TableCell>
                </TableRow>
              ) : (
                filteredCeremonies.map((ceremony) => (
                  <TableRow key={ceremony.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ceremony.title}</div>
                        {ceremony.featured && (
                          <Badge className="mt-1 bg-saffron-500 text-white text-xs">
                            In Evidenza
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{ceremony.schedule || '-'}</TableCell>
                    <TableCell>{ceremony.type || '-'}</TableCell>
                    <TableCell>{getStatusBadge(ceremony.status || 'draft')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(ceremony)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCeremony(ceremony);
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
            <DialogTitle>Crea Nuova Cerimonia</DialogTitle>
          </DialogHeader>
          <FormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createCeremony.isPending}
              className="bg-saffron-600 hover:bg-saffron-700"
            >
              {createCeremony.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Crea Cerimonia'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Cerimonia</DialogTitle>
          </DialogHeader>
          <FormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateCeremony.isPending}
              className="bg-saffron-600 hover:bg-saffron-700"
            >
              {updateCeremony.isPending ? (
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
          <p>Sei sicuro di voler eliminare questa cerimonia? L'azione è irreversibile.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteCeremony.isPending}
              variant="destructive"
            >
              {deleteCeremony.isPending ? (
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

export default CeremoniesManager;