import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Loader2,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useDownloadableTexts } from '@/hooks/useDownloadableTexts';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DownloadableText = Database['public']['Tables']['downloadable_texts']['Row'];

const ALLOWED_FILE_TYPES = {
  pdf: ['application/pdf'],
  epub: ['application/epub+zip', 'application/epub'],
  mobi: ['application/x-mobipocket-ebook', 'application/vnd.amazon.mobi8-ebook'],
  zip: ['application/zip', 'application/x-zip-compressed']
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const DownloadableTextsManager = () => {
  const { texts, isLoading, createText, updateText, deleteText } = useDownloadableTexts({ published: undefined });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedText, setSelectedText] = useState<DownloadableText | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '',
    language: 'it',
    tags: [] as string[],
    cover_image_url: '',
    file_url: '',
    file_format: 'pdf' as 'pdf' | 'epub' | 'mobi' | 'zip',
    published: false,
    published_at: null as string | null,
    sort_order: 0
  });

  const [tagInput, setTagInput] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const filteredTexts = texts.filter((text) => {
    const matchesSearch = text.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      text.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'published' && text.published) ||
      (selectedStatus === 'draft' && !text.published);
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      category: '',
      language: 'it',
      tags: [],
      cover_image_url: '',
      file_url: '',
      file_format: 'pdf',
      published: false,
      published_at: null,
      sort_order: 0
    });
    setTagInput('');
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (text: DownloadableText) => {
    setFormData({
      title: text.title || '',
      slug: text.slug || '',
      description: text.description || '',
      content: text.content || '',
      category: text.category || '',
      language: text.language || 'it',
      tags: text.tags || [],
      cover_image_url: text.cover_image_url || '',
      file_url: text.file_url || '',
      file_format: (text.file_format as 'pdf' | 'epub' | 'mobi' | 'zip') || 'pdf',
      published: text.published || false,
      published_at: text.published_at || null,
      sort_order: text.sort_order || 0
    });
    setSelectedText(text);
    setShowEditModal(true);
  };

  const handleDelete = (text: DownloadableText) => {
    setSelectedText(text);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const submitData: any = {
        ...formData,
        published_at: formData.published && !formData.published_at ? new Date().toISOString() : formData.published_at
      };

      if (showCreateModal) {
        await createText.mutateAsync(submitData);
        toast({
          title: 'Successo',
          description: 'Testo scaricabile creato con successo',
        });
        setShowCreateModal(false);
      } else if (selectedText) {
        await updateText.mutateAsync({ id: selectedText.id, updates: submitData });
        toast({
          title: 'Successo',
          description: 'Testo scaricabile aggiornato con successo',
        });
        setShowEditModal(false);
      }
      
      resetForm();
      setSelectedText(null);
    } catch (err) {
      console.error('❌ Errore salvataggio:', err);
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante il salvataggio',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedText) return;
    try {
      setSubmitting(true);
      await deleteText.mutateAsync(selectedText.id);
      toast({
        title: 'Successo',
        description: 'Testo scaricabile eliminato con successo',
      });
      setShowDeleteModal(false);
      setSelectedText(null);
    } catch (err) {
      console.error('❌ Errore eliminazione:', err);
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante l\'eliminazione',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['pdf', 'epub', 'mobi', 'zip'].includes(fileExt)) {
      toast({
        title: 'Errore',
        description: 'Formato file non supportato. Usa PDF, EPUB, MOBI o ZIP',
        variant: 'destructive',
      });
      return;
    }

    // Validate MIME type
    const allowedMimes = ALLOWED_FILE_TYPES[fileExt as keyof typeof ALLOWED_FILE_TYPES];
    if (!allowedMimes.includes(file.type)) {
      toast({
        title: 'Errore',
        description: 'Tipo MIME non valido per questo formato',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Errore',
        description: `File troppo grande. Dimensione massima: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingFile(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Devi essere autenticato');

      // Sanitize filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `downloadable-texts/${Date.now()}-${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Calculate file hash (simple implementation)
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setFormData(prev => ({
        ...prev,
        file_url: urlData.publicUrl,
        file_format: fileExt as 'pdf' | 'epub' | 'mobi' | 'zip',
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
      setUploadingFile(false);
      event.target.value = '';
    }
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Errore',
        description: 'Il file deve essere un\'immagine',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingCover(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Devi essere autenticato');

      const fileExt = file.name.split('.').pop();
      const fileName = `downloadable-texts/covers/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        cover_image_url: urlData.publicUrl,
      }));

      toast({
        title: 'Successo',
        description: 'Immagine di copertina caricata con successo',
      });
    } catch (err) {
      console.error('❌ Errore upload cover:', err);
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante il caricamento dell\'immagine',
        variant: 'destructive',
      });
    } finally {
      setUploadingCover(false);
      event.target.value = '';
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Gestione Testi Scaricabili</h2>
          <p className="text-sm text-muted-foreground">
            {texts.length} testi totali, {filteredTexts.length} visualizzati
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-saffron-600 hover:bg-saffron-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuovo Testo
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca testi..."
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
                <TableHead>Slug</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Lingua</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTexts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nessun testo trovato
                  </TableCell>
                </TableRow>
              ) : (
                filteredTexts.map((text) => (
                  <TableRow key={text.id}>
                    <TableCell className="font-medium">{text.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{text.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{text.file_format?.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{text.language || 'it'}</TableCell>
                    <TableCell>
                      {text.published ? (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Pubblicato
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          <XCircle className="h-3 w-3 mr-1" />
                          Bozza
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(text)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(text)}
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

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          setShowEditModal(false);
          resetForm();
          setSelectedText(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showCreateModal ? 'Nuovo Testo Scaricabile' : 'Modifica Testo Scaricabile'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      title,
                      slug: prev.slug || generateSlug(title)
                    }));
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Contenuto (Markdown/HTML)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="language">Lingua</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort_order">Ordine</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label>Tag</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Aggiungi tag e premi Invio"
                />
                <Button type="button" onClick={addTag} variant="outline">Aggiungi</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>File *</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.epub,.mobi,.zip"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="flex-1"
                />
                {uploadingFile && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {formData.file_url && (
                <p className="text-sm text-muted-foreground mt-2">
                  File caricato: <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-saffron-600 hover:underline">Visualizza</a>
                </p>
              )}
            </div>

            <div>
              <Label>Immagine di Copertina</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="flex-1"
                />
                {uploadingCover && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {formData.cover_image_url && (
                <img src={formData.cover_image_url} alt="Cover" className="mt-2 h-32 w-auto rounded" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="published" className="cursor-pointer">Pubblicato</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                resetForm();
                setSelectedText(null);
              }}>
                Annulla
              </Button>
              <Button type="submit" disabled={submitting || !formData.file_url}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salva'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
          </DialogHeader>
          <p>Sei sicuro di voler eliminare "{selectedText?.title}"? L'azione è irreversibile.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={submitting}
              variant="destructive"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Elimina'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DownloadableTextsManager;
