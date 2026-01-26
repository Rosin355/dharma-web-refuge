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
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import { useDownloadableTexts } from '@/hooks/useDownloadableTexts';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

const DownloadableTextForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { texts, createText, updateText } = useDownloadableTexts({ published: undefined });
  const isEditMode = !!id;

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && texts.length > 0) {
      const text = texts.find((t) => t.id === id);
      if (text) {
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
      }
    }
  }, [id, isEditMode, texts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (!formData.file_url) {
        toast({
          title: 'Errore',
          description: 'È necessario caricare un file',
          variant: 'destructive',
        });
        return;
      }

      const submitData: any = {
        ...formData,
        published_at: formData.published && !formData.published_at ? new Date().toISOString() : formData.published_at
      };

      if (isEditMode && id) {
        await updateText.mutateAsync({ id, updates: submitData });
        toast({
          title: 'Successo',
          description: 'Testo scaricabile aggiornato con successo',
        });
      } else {
        await createText.mutateAsync(submitData);
        toast({
          title: 'Successo',
          description: 'Testo scaricabile creato con successo',
        });
      }

      navigate('/admin');
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['pdf', 'epub', 'mobi', 'zip'].includes(fileExt)) {
      toast({
        title: 'Errore',
        description: 'Formato file non supportato. Usa PDF, EPUB, MOBI o ZIP',
        variant: 'destructive',
      });
      return;
    }

    const allowedMimes = ALLOWED_FILE_TYPES[fileExt as keyof typeof ALLOWED_FILE_TYPES];
    if (!allowedMimes.includes(file.type)) {
      toast({
        title: 'Errore',
        description: 'Tipo MIME non valido per questo formato',
        variant: 'destructive',
      });
      return;
    }

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

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-zen-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna all'Admin
          </Button>
          <h1 className="font-serif text-3xl font-light">
            {isEditMode ? 'Modifica Testo Scaricabile' : 'Nuovo Testo Scaricabile'}
          </h1>
        </div>

        <Card className="bg-white border-zen-sage">
          <CardHeader>
            <CardTitle>Informazioni Testo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="content">Contenuto</Label>
                <div className="border rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    modules={quillModules}
                    placeholder="Inserisci il contenuto del testo..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    value={formData.category || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value || '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nessuna categoria</SelectItem>
                      <SelectItem value="sutra">Sutra</SelectItem>
                      <SelectItem value="altro testo">Altro testo</SelectItem>
                      <SelectItem value="testi consigliati">Testi consigliati</SelectItem>
                      <SelectItem value="approfondimenti">Approfondimenti</SelectItem>
                      <SelectItem value="insegnamenti della comunità">Insegnamenti della comunità</SelectItem>
                      <SelectItem value="insegnamenti dei grandi maestri">Insegnamenti dei grandi maestri</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">File caricato:</span>
                    <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-saffron-600 hover:underline text-sm">
                      Visualizza
                    </a>
                    <Badge variant="outline">{formData.file_format.toUpperCase()}</Badge>
                  </div>
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
                  <div className="mt-4">
                    <img src={formData.cover_image_url} alt="Cover" className="h-48 w-auto rounded-lg border" />
                  </div>
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

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={submitting || !formData.file_url} className="bg-saffron-600 hover:bg-saffron-700">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    'Salva'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DownloadableTextForm;
