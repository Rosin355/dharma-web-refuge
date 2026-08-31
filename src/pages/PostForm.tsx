import { useState, useEffect, useRef } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Upload, Image, AlertCircle, Search, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'color', 'background',
  'link', 'image', 'video'
];

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published',
    author_id: null as string | null,
    image_url: '' as string,
    image_alt: '' as string
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContentImages, setUploadingContentImages] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Image search state
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [imageResults, setImageResults] = useState<any[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [unsplashKey, setUnsplashKey] = useState('');
  
  const quillRef = useRef<ReactQuill>(null);

  // Load post data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadPost(id);
    }
    const savedKey = localStorage.getItem('unsplash_access_key');
    if (savedKey) setUnsplashKey(savedKey);
  }, [id, isEditMode]);

  const loadPost = async (postId: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Articolo non trovato');

      // Il valore controllato di ReactQuill e lo stato React sono l'unica fonte di verità.
      const content = data.content || '';
      
      // Verifica che le immagini nel contenuto siano accessibili
      if (content) {
        // Estrai tutte le immagini dal contenuto
        const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
        const images = [];
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
          images.push(match[1]);
        }
        
        console.log('🖼️ Immagini trovate nel contenuto:', images);
      }

      setFormData({
        title: data.title || '',
        content: content,
        excerpt: data.excerpt || '',
        status: (data.status as 'draft' | 'published') || 'draft',
        author_id: data.author_id,
        image_url: data.image_url || '',
        image_alt: data.image_alt || ''
      });
    } catch (err) {
      console.error('❌ Errore caricamento post:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento articolo');
      toast({
        title: 'Errore',
        description: 'Impossibile caricare l\'articolo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler per caricare immagini nel contenuto dell'editor
  const handleContentImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingContentImages(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Devi essere autenticato per caricare immagini.');
      }

      const quill = quillRef.current?.getEditor();
      if (!quill) {
        throw new Error('Editor non disponibile. Clicca nell\'area di testo prima di caricare immagini.');
      }

      // Ottieni la selezione corrente o usa la fine del contenuto
      let range = quill.getSelection();
      if (!range) {
        // Se non c'è selezione, inserisci alla fine
        const length = quill.getLength();
        range = { index: length - 1, length: 0 };
      }
      
      // Carica tutte le immagini
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `post-content-${Date.now()}-${i}.${fileExt}`;
        const filePath = `post-images/content/${fileName}`;

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

        if (!urlData?.publicUrl) {
          throw new Error('Impossibile ottenere l\'URL pubblico dell\'immagine');
        }

        // Inserisci l'immagine nell'editor alla posizione corrente
        // insertEmbed crea un elemento <img> nell'HTML
        quill.insertEmbed(range.index + i, 'image', urlData.publicUrl);
        
        // Aggiungi un break dopo l'immagine per migliorare la formattazione
        quill.insertText(range.index + i + 1, '\n', 'user');
        
        // Sposta il cursore dopo l'immagine
        quill.setSelection(range.index + i + 2, 0);
        
        // Aggiorna la posizione per la prossima immagine
        range.index += 2;
        
        console.log('✅ Immagine caricata:', urlData.publicUrl);
      }
    } catch (err) {
      console.error('❌ Errore upload immagini contenuto:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento delle immagini');
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante il caricamento delle immagini',
        variant: 'destructive',
      });
    } finally {
      setUploadingContentImages(false);
      event.target.value = '';
    }
  };

  // Funzione per convertire link YouTube in embed
  const convertYouTubeLinks = (html: string): string => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
    
    return html.replace(youtubeRegex, (match, videoId) => {
      return `<div class="youtube-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0;">
        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
      </div>`;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        setError('Titolo e contenuto sono obbligatori');
        toast({
          title: 'Errore',
          description: 'Titolo e contenuto sono obbligatori',
          variant: 'destructive',
        });
        return;
      }

      setSubmitting(true);
      setError(null);

      // Ottieni il contenuto HTML direttamente dall'editor per assicurarsi che le immagini siano incluse
      const quill = quillRef.current?.getEditor();
      let contentToSave = formData.content;
      
      if (quill) {
        // Ottieni l'HTML completo dall'editor, che include le immagini
        const htmlContent = quill.root.innerHTML;
        if (htmlContent && htmlContent.trim()) {
          contentToSave = htmlContent;
        }
      }

      // Converti link YouTube in embed
      const processedContent = convertYouTubeLinks(contentToSave);
      
      // Log per debug (rimuovere in produzione)
      console.log('📝 Contenuto da salvare:', processedContent.substring(0, 500));

      if (isEditMode && id) {
        const updateData: any = {
          title: formData.title,
          content: processedContent,
          excerpt: formData.excerpt || `${formData.content.replace(/<[^>]*>/g, '').substring(0, 200)}...`,
          status: formData.status,
          author_id: formData.author_id,
          image_url: formData.image_url || null,
          image_alt: formData.image_alt || null
        };

        // Se cambio da draft a published, imposto published_at
        const { data: currentPost } = await supabase
          .from('posts')
          .select('status')
          .eq('id', id)
          .single();

        if (currentPost?.status !== 'published' && formData.status === 'published') {
          updateData.published_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('posts')
          .update(updateData)
          .eq('id', id);

        if (updateError) throw updateError;

        toast({
          title: 'Successo',
          description: 'Articolo aggiornato con successo',
        });
      } else {
        const { error: createError } = await supabase
          .from('posts')
          .insert({
            title: formData.title,
            content: processedContent,
            excerpt: formData.excerpt || `${formData.content.replace(/<[^>]*>/g, '').substring(0, 200)}...`,
            status: formData.status,
            author_id: formData.author_id,
            image_url: formData.image_url || null,
            image_alt: formData.image_alt || null,
            published_at: formData.status === 'published' ? new Date().toISOString() : null
          });

        if (createError) throw createError;

        toast({
          title: 'Successo',
          description: 'Articolo creato con successo',
        });
      }

      navigate('/admin');
    } catch (err) {
      console.error('❌ Errore salvataggio:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante il salvataggio',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Il file selezionato non è un\'immagine');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Devi essere autenticato per caricare immagini.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `post-${Date.now()}.${fileExt}`;
      const filePath = `post-images/${fileName}`;

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

      setFormData(prev => ({
        ...prev,
        image_url: urlData.publicUrl,
        image_alt: file.name
      }));

      toast({
        title: 'Successo',
        description: 'Immagine caricata con successo',
      });
    } catch (err) {
      console.error('❌ Errore upload immagine:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento dell\'immagine');
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

  const searchUnsplashImages = async (query: string) => {
    if (!unsplashKey || !query.trim()) {
      setError('Inserisci una chiave Unsplash e un termine di ricerca');
      return;
    }

    try {
      setSearchingImages(true);
      setError(null);

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
      setImageResults(data.results || []);

      if (data.results.length === 0) {
        setError('Nessuna immagine trovata per questa ricerca');
      }
    } catch (err) {
      console.error('❌ Errore ricerca Unsplash:', err);
      setError(err instanceof Error ? err.message : 'Errore ricerca immagini');
    } finally {
      setSearchingImages(false);
    }
  };

  const selectImage = (image: any) => {
    setFormData(prev => ({
      ...prev,
      image_url: image.urls.regular,
      image_alt: image.alt_description || image.description || `Immagine di ${image.user.name}`
    }));
    setShowImageSearch(false);
    setImageResults([]);
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image_url: '',
      image_alt: ''
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
      </div>
    );
  }

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
            {isEditMode ? 'Modifica Articolo' : 'Nuovo Articolo'}
          </h1>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-white border-zen-sage">
          <CardHeader>
            <CardTitle>Informazioni Articolo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Inserisci il titolo dell'articolo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Estratto</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrizione dell'articolo (opzionale - se vuoto verrà generato automaticamente)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Contenuto *</Label>
                <div className="border rounded-md" style={{ position: 'relative' }}>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => {
                      // Assicurati che le immagini siano incluse correttamente nell'HTML
                      setFormData(prev => ({ ...prev, content: value }));
                    }}
                    modules={QUILL_MODULES}
                    formats={QUILL_FORMATS}
                    placeholder="Scrivi il contenuto dell'articolo. Puoi inserire immagini, video YouTube e formattare il testo."
                    style={{ minHeight: '300px' }}
                    readOnly={false}
                    preserveWhitespace={true}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-xs text-gray-500">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleContentImageUpload}
                      disabled={uploadingContentImages}
                      id="content-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingContentImages}
                      onClick={() => {
                        // Assicura che l'editor abbia focus prima di aprire il file picker
                        const quill = quillRef.current?.getEditor();
                        if (quill) {
                          const editorElement = quill.root;
                          if (editorElement) {
                            editorElement.focus();
                            // Se non c'è selezione, posiziona il cursore alla fine
                            const length = quill.getLength();
                            quill.setSelection(length - 1, 0);
                          }
                        }
                        // Triggera il click sull'input file
                        document.getElementById('content-image-upload')?.click();
                      }}
                    >
                      {uploadingContentImages ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Caricamento...
                        </>
                      ) : (
                        <>
                          <Image className="h-3 w-3 mr-1" />
                          Carica immagini nel contenuto
                        </>
                      )}
                    </Button>
                  </label>
                  <span className="text-xs text-gray-500">
                    Puoi anche incollare link YouTube per convertirli automaticamente in video
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Stato</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'draft' | 'published') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Salva come bozza</SelectItem>
                    <SelectItem value="published">Pubblica subito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Selection */}
              <div>
                <Label>Immagine di copertina</Label>
                {formData.image_url ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt={formData.image_alt}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Testo alternativo (accessibilità)"
                      value={formData.image_alt}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_alt: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowImageSearch(true)}
                        disabled={!unsplashKey}
                        className="flex-1"
                      >
                        <Image className="h-4 w-4 mr-2" />
                        {unsplashKey ? 'Cerca Immagine' : 'Configura Unsplash prima'}
                      </Button>
                      <label className="flex-1">
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
                          className="w-full"
                          disabled={uploadingImage}
                          asChild
                        >
                          <span>
                            {uploadingImage ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {uploadingImage ? 'Caricamento...' : 'Carica da Computer'}
                          </span>
                        </Button>
                      </label>
                    </div>
                    {!unsplashKey && (
                      <p className="text-xs text-gray-500">
                        Vai nella sezione Immagini per configurare Unsplash
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Image Search Modal */}
              {showImageSearch && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cerca immagini (es: zen, meditation, nature)"
                      value={imageSearchTerm}
                      onChange={(e) => setImageSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchUnsplashImages(imageSearchTerm)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => searchUnsplashImages(imageSearchTerm)}
                      disabled={searchingImages || !imageSearchTerm.trim()}
                      className="bg-saffron-600 hover:bg-saffron-700"
                    >
                      {searchingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowImageSearch(false);
                        setImageResults([]);
                        setImageSearchTerm('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {imageResults.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {imageResults.map((image: any) => (
                        <div
                          key={image.id}
                          className="cursor-pointer border rounded overflow-hidden hover:shadow-md transition-shadow"
                          onClick={() => selectImage(image)}
                        >
                          <img
                            src={image.urls.small}
                            alt={image.alt_description || 'Immagine Unsplash'}
                            className="w-full h-20 object-cover"
                          />
                          <div className="p-1">
                            <p className="text-xs text-gray-600 truncate">
                              by {image.user.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={submitting} className="bg-saffron-600 hover:bg-saffron-700">
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

export default PostForm;
