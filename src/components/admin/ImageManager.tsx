import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image, 
  Search, 
  RefreshCw, 
  Save, 
  Settings, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Eye,
  Loader2,
  Upload,
  Users,
  Building,
  FileText,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface PostWithImage {
  id: string;
  title: string;
  content: string;
  status: string;
  image_url?: string | null;
  image_alt?: string | null;
  excerpt?: string | null;
}

interface TempleImage {
  id: string;
  filename: string;
  storage_url: string;
  alt_text: string | null;
  category: string | null;
  page_section: string | null;
  created_at: string;
  updated_at: string;
}

const ImageManager = () => {
  const [activeTab, setActiveTab] = useState('blog');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Blog images state
  const [posts, setPosts] = useState<PostWithImage[]>([]);
  
  // Temple images state
  const [templeImages, setTempleImages] = useState<TempleImage[]>([]);
  
  // Unsplash settings
  const [unsplashAccessKey, setUnsplashAccessKey] = useState('');
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const [defaultKeywords, setDefaultKeywords] = useState('zen, meditation, buddhism, spirituality, nature');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [searching, setSearching] = useState(false);
  const [assigning, setAssigning] = useState(false);
  
  // Selected items for assignment
  const [selectedPost, setSelectedPost] = useState<PostWithImage | null>(null);
  const [selectedImageType, setSelectedImageType] = useState<string>('');

  useEffect(() => {
    fetchPosts();
    fetchTempleImages();
    loadSettings();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('id, title, content, excerpt, status, image_url, image_alt')
        .order('created_at', { ascending: false });

      if (fetchError) {
        if (fetchError.message.includes('column') && fetchError.message.includes('does not exist')) {
          throw new Error('Le colonne image_url e image_alt non esistono nella tabella posts. Consulta la documentazione per aggiungerle.');
        }
        throw fetchError;
      }

      const postsWithImages = (data || []).map(post => ({
        ...post,
        image_url: post.image_url || null,
        image_alt: post.image_alt || null
      }));

      setPosts(postsWithImages);
    } catch (err) {
      console.error('❌ Errore caricamento posts:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore caricamento articoli';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchTempleImages = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('temple_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTempleImages(data || []);
    } catch (err) {
      console.error('❌ Errore caricamento immagini tempio:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore caricamento immagini tempio';
      setError(errorMessage);
    }
  };

  const loadSettings = () => {
    const savedKey = localStorage.getItem('unsplash_access_key');
    const savedKeywords = localStorage.getItem('default_keywords');
    const savedAutoAssign = localStorage.getItem('auto_assign_enabled');

    if (savedKey) setUnsplashAccessKey(savedKey);
    if (savedKeywords) setDefaultKeywords(savedKeywords);
    if (savedAutoAssign) setAutoAssignEnabled(savedAutoAssign === 'true');
  };

  const saveSettings = () => {
    localStorage.setItem('unsplash_access_key', unsplashAccessKey);
    localStorage.setItem('default_keywords', defaultKeywords);
    localStorage.setItem('auto_assign_enabled', autoAssignEnabled.toString());
    setSuccess('Impostazioni salvate con successo!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const searchUnsplashImages = async (query: string) => {
    if (!unsplashAccessKey) {
      setError('Configurare prima la chiave API di Unsplash');
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${unsplashAccessKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Errore nella ricerca immagini Unsplash');
      }

      const data = await response.json();
      setSearchResults(data.results || []);

      if (data.results.length === 0) {
        setError('Nessuna immagine trovata per questa ricerca');
      }
    } catch (err) {
      console.error('❌ Errore ricerca Unsplash:', err);
      setError(err instanceof Error ? err.message : 'Errore ricerca immagini');
    } finally {
      setSearching(false);
    }
  };

  const assignImageToPost = async (post: PostWithImage, image: UnsplashImage) => {
    try {
      setAssigning(true);
      setError(null);

      await fetch(image.links.html + '?utm_source=dharma-web-refuge&utm_medium=referral');

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          image_url: image.urls.regular,
          image_alt: image.alt_description || image.description || `Immagine di ${image.user.name}`
        })
        .eq('id', post.id);

      if (updateError) throw updateError;

      await fetchPosts();
      setSuccess(`Immagine assegnata all'articolo "${post.title}"`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Errore assegnazione immagine:', err);
      setError(err instanceof Error ? err.message : 'Errore assegnazione immagine');
    } finally {
      setAssigning(false);
    }
  };

  const assignImageToTemple = async (imageType: string, image: UnsplashImage) => {
    try {
      setAssigning(true);
      setError(null);

      await fetch(image.links.html + '?utm_source=dharma-web-refuge&utm_medium=referral');

      const { error: insertError } = await supabase
        .from('temple_images')
        .insert({
          filename: `${imageType}-${image.id}.jpg`,
          original_url: image.urls.regular,
          storage_url: image.urls.regular,
          alt_text: image.alt_description || image.description || `Immagine di ${image.user.name}`,
          category: getCategoryFromImageType(imageType),
          page_section: 'chi-siamo'
        });

      if (insertError) throw insertError;

      await fetchTempleImages();
      setSuccess(`Immagine assegnata a ${getImageTypeLabel(imageType)}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Errore assegnazione immagine tempio:', err);
      setError(err instanceof Error ? err.message : 'Errore assegnazione immagine');
    } finally {
      setAssigning(false);
    }
  };

  const getCategoryFromImageType = (imageType: string): string => {
    switch (imageType) {
      case 'taehye':
      case 'taeri':
      case 'kusalananda':
        return 'maestri';
      case 'tempio':
        return 'tempio';
      default:
        return 'generale';
    }
  };

  const getImageTypeLabel = (imageType: string): string => {
    switch (imageType) {
      case 'taehye':
        return 'Taehye sunim';
      case 'taeri':
        return 'Taeri sunim';
      case 'kusalananda':
        return 'Ven. Kusalananda';
      case 'tempio':
        return 'Tempio (Galleria)';
      default:
        return imageType;
    }
  };

  const removeImageFromPost = async (post: PostWithImage) => {
    try {
      setAssigning(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          image_url: null,
          image_alt: null
        })
        .eq('id', post.id);

      if (updateError) throw updateError;

      await fetchPosts();
      setSuccess(`Immagine rimossa dall'articolo "${post.title}"`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Errore rimozione immagine:', err);
      setError(err instanceof Error ? err.message : 'Errore rimozione immagine');
    } finally {
      setAssigning(false);
    }
  };

  const removeTempleImage = async (imageId: string) => {
    try {
      setAssigning(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('temple_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) throw deleteError;

      await fetchTempleImages();
      setSuccess('Immagine rimossa con successo');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Errore rimozione immagine tempio:', err);
      setError(err instanceof Error ? err.message : 'Errore rimozione immagine');
    } finally {
      setAssigning(false);
    }
  };

  const extractKeywords = (title: string, content: string): string[] => {
    const text = `${title} ${content}`.toLowerCase();
    
    const spiritualKeywords = [
      'meditazione', 'zen', 'buddhismo', 'dharma', 'sangha', 'buddha',
      'mindfulness', 'compassione', 'saggezza', 'pace', 'armonia',
      'serenità', 'contemplazione', 'illuminazione', 'risveglio',
      'meditation', 'wisdom', 'peace', 'harmony', 'nature', 'temple'
    ];

    const foundKeywords = spiritualKeywords.filter(keyword => 
      text.includes(keyword)
    );

    return foundKeywords.length > 0 ? foundKeywords.slice(0, 3) : ['zen', 'meditation', 'nature'];
  };

  const postsWithoutImages = posts.filter(post => !post.image_url);
  const postsWithImages = posts.filter(post => post.image_url);
  const masterImages = templeImages.filter(img => img.category === 'maestri');
  const templeGalleryImages = templeImages.filter(img => img.category === 'tempio');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
            <Image className="h-6 w-6 text-saffron-600" />
            Gestione Immagini
          </h2>
          <p className="text-sm text-gray-600">
            Gestisci le immagini del blog, dei maestri e del tempio
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs per organizzare le diverse tipologie */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="maestri" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Maestri
          </TabsTrigger>
          <TabsTrigger value="tempio" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Tempio
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Impostazioni
          </TabsTrigger>
        </TabsList>

        {/* Tab Impostazioni */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-saffron-600" />
                Configurazione Unsplash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="unsplash-key" className="text-sm font-medium">
                  Chiave API Unsplash
                </Label>
                <Input
                  id="unsplash-key"
                  type="password"
                  value={unsplashAccessKey}
                  onChange={(e) => setUnsplashAccessKey(e.target.value)}
                  placeholder="Inserisci la tua Access Key di Unsplash"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">
                  Ottieni una chiave gratuita su{' '}
                  <a 
                    href="https://unsplash.com/developers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-saffron-600 hover:underline"
                  >
                    unsplash.com/developers
                  </a>
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="default-keywords" className="text-sm font-medium">
                  Parole Chiave Predefinite
                </Label>
                <Textarea
                  id="default-keywords"
                  value={defaultKeywords}
                  onChange={(e) => setDefaultKeywords(e.target.value)}
                  placeholder="zen, meditation, buddhism, spirituality"
                  rows={2}
                  className="text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-assign"
                  checked={autoAssignEnabled}
                  onCheckedChange={setAutoAssignEnabled}
                />
                <Label htmlFor="auto-assign" className="text-sm">
                  Abilita assegnazione automatica per nuovi articoli
                </Label>
              </div>

              <Button onClick={saveSettings} className="bg-saffron-600 hover:bg-saffron-700">
                <Save className="h-4 w-4 mr-2" />
                Salva Configurazione
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Blog */}
        <TabsContent value="blog" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-saffron-600" />
                Immagini Articoli Blog
              </CardTitle>
              <p className="text-sm text-gray-600">
                {posts.length} articoli totali, {postsWithoutImages.length} senza immagine
              </p>
            </CardHeader>
            <CardContent>
              {/* Articoli senza immagine */}
              {postsWithoutImages.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-medium text-red-600">
                    Articoli senza immagine ({postsWithoutImages.length})
                  </h3>
                  {postsWithoutImages.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{post.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'PUB' : 'BOZZA'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {post.excerpt || `${post.content?.substring(0, 100)}...`}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post);
                          setSelectedImageType('');
                          setSearchTerm(extractKeywords(post.title, post.content || '').join(' '));
                          setSearchResults([]);
                        }}
                        className="bg-saffron-600 hover:bg-saffron-700"
                      >
                        <Search className="h-4 w-4 mr-1" />
                        Cerca
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Articoli con immagine */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-green-600">
                  Articoli con immagine ({postsWithImages.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {postsWithImages.map((post) => (
                    <div key={post.id} className="border rounded-lg overflow-hidden bg-white">
                      <img
                        src={post.image_url!}
                        alt={post.image_alt || post.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate flex-1">{post.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'PUB' : 'BOZZA'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {post.excerpt || `${post.content?.substring(0, 80)}...`}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setSelectedImageType('');
                              setSearchTerm('');
                              setSearchResults([]);
                            }}
                            className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-xs"
                          >
                            <Search className="h-3 w-3 mr-1" />
                            Cambia
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImageFromPost(post)}
                            disabled={assigning}
                            className="text-xs"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Maestri */}
        <TabsContent value="maestri" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-saffron-600" />
                Immagini dei Maestri
              </CardTitle>
              <p className="text-sm text-gray-600">
                Gestisci le immagini dei profili dei maestri per la pagina "Chi Siamo"
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Taehye sunim */}
                <div className="border rounded-lg p-4">
                  <div className="text-center mb-3">
                    <h3 className="font-medium text-gray-900">Taehye sunim</h3>
                    <p className="text-xs text-gray-600">大慧스님 / Mahapañña</p>
                  </div>
                  {masterImages.find(img => img.alt_text?.toLowerCase().includes('taehye')) ? (
                    <div className="space-y-2">
                      <img
                        src={masterImages.find(img => img.alt_text?.toLowerCase().includes('taehye'))?.storage_url}
                        alt="Taehye sunim"
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPost(null);
                            setSelectedImageType('taehye');
                            setSearchTerm('zen monk meditation master');
                            setSearchResults([]);
                          }}
                          className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-xs"
                        >
                          Cambia
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeTempleImage(masterImages.find(img => img.alt_text?.toLowerCase().includes('taehye'))?.id || '')}
                          className="text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
                        <span className="text-gray-400">Nessuna immagine</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPost(null);
                          setSelectedImageType('taehye');
                          setSearchTerm('zen monk meditation master');
                          setSearchResults([]);
                        }}
                        className="bg-saffron-600 hover:bg-saffron-700 text-xs"
                      >
                        <Search className="h-3 w-3 mr-1" />
                        Aggiungi
                      </Button>
                    </div>
                  )}
                </div>

                {/* Taeri sunim */}
                <div className="border rounded-lg p-4">
                  <div className="text-center mb-3">
                    <h3 className="font-medium text-gray-900">Taeri sunim</h3>
                    <p className="text-xs text-gray-600">太利스님 / Kumara</p>
                  </div>
                  {masterImages.find(img => img.alt_text?.toLowerCase().includes('taeri')) ? (
                    <div className="space-y-2">
                      <img
                        src={masterImages.find(img => img.alt_text?.toLowerCase().includes('taeri'))?.storage_url}
                        alt="Taeri sunim"
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPost(null);
                            setSelectedImageType('taeri');
                            setSearchTerm('zen monk meditation master');
                            setSearchResults([]);
                          }}
                          className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-xs"
                        >
                          Cambia
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeTempleImage(masterImages.find(img => img.alt_text?.toLowerCase().includes('taeri'))?.id || '')}
                          className="text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
                        <span className="text-gray-400">Nessuna immagine</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPost(null);
                          setSelectedImageType('taeri');
                          setSearchTerm('zen monk meditation master');
                          setSearchResults([]);
                        }}
                        className="bg-saffron-600 hover:bg-saffron-700 text-xs"
                      >
                        <Search className="h-3 w-3 mr-1" />
                        Aggiungi
                      </Button>
                    </div>
                  )}
                </div>

                {/* Ven. Kusalananda */}
                <div className="border rounded-lg p-4">
                  <div className="text-center mb-3">
                    <h3 className="font-medium text-gray-900">Ven. Kusalananda</h3>
                    <p className="text-xs text-gray-600">Monaco e Musicista</p>
                  </div>
                  {masterImages.find(img => img.alt_text?.toLowerCase().includes('kusalananda')) ? (
                    <div className="space-y-2">
                      <img
                        src={masterImages.find(img => img.alt_text?.toLowerCase().includes('kusalananda'))?.storage_url}
                        alt="Ven. Kusalananda"
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPost(null);
                            setSelectedImageType('kusalananda');
                            setSearchTerm('zen monk meditation master');
                            setSearchResults([]);
                          }}
                          className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-xs"
                        >
                          Cambia
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeTempleImage(masterImages.find(img => img.alt_text?.toLowerCase().includes('kusalananda'))?.id || '')}
                          className="text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
                        <span className="text-gray-400">Nessuna immagine</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPost(null);
                          setSelectedImageType('kusalananda');
                          setSearchTerm('zen monk meditation master');
                          setSearchResults([]);
                        }}
                        className="bg-saffron-600 hover:bg-saffron-700 text-xs"
                      >
                        <Search className="h-3 w-3 mr-1" />
                        Aggiungi
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Tempio */}
        <TabsContent value="tempio" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-saffron-600" />
                Galleria Immagini Tempio
              </CardTitle>
              <p className="text-sm text-gray-600">
                Gestisci le immagini per la galleria del tempio nella pagina "Chi Siamo"
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button
                  onClick={() => {
                    setSelectedPost(null);
                    setSelectedImageType('tempio');
                    setSearchTerm('zen temple buddhist monastery garden');
                    setSearchResults([]);
                  }}
                  className="bg-saffron-600 hover:bg-saffron-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Aggiungi Immagine al Tempio
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templeGalleryImages.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden bg-white">
                    <img
                      src={image.storage_url}
                      alt={image.alt_text || 'Immagine del tempio'}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.alt_text || 'Immagine del tempio'}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {new Date(image.created_at).toLocaleDateString('it-IT')}
                      </p>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeTempleImage(image.id)}
                        disabled={assigning}
                        className="w-full text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Rimuovi
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {templeGalleryImages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nessuna immagine del tempio caricata</p>
                  <p className="text-sm text-gray-400">Utilizza il pulsante "Aggiungi Immagine" per iniziare</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal per ricerca e assegnazione immagini */}
      {(selectedPost || selectedImageType) && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-saffron-600" />
              Cerca Immagine per {selectedPost ? `"${selectedPost.title}"` : getImageTypeLabel(selectedImageType)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cerca immagini (es: zen garden, meditation, nature)"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && searchUnsplashImages(searchTerm)}
              />
              <Button 
                onClick={() => searchUnsplashImages(searchTerm)}
                disabled={!searchTerm.trim() || searching}
                className="bg-saffron-600 hover:bg-saffron-700"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPost(null);
                  setSelectedImageType('');
                  setSearchResults([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden bg-white">
                    <img
                      src={image.urls.small}
                      alt={image.alt_description || 'Immagine Unsplash'}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">
                        by {image.user.name}
                      </p>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (selectedPost) {
                              assignImageToPost(selectedPost, image);
                            } else if (selectedImageType) {
                              assignImageToTemple(selectedImageType, image);
                            }
                          }}
                          disabled={assigning}
                          className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-xs"
                        >
                          {assigning ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Usa'
                          )}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageManager;