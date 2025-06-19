import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  Loader2
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

const ImageManager = () => {
  const [posts, setPosts] = useState<PostWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Auto-assign settings
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const [unsplashAccessKey, setUnsplashAccessKey] = useState('');
  const [defaultKeywords, setDefaultKeywords] = useState('zen, meditation, buddhism, spirituality, nature');
  
  // Manual assignment state
  const [selectedPost, setSelectedPost] = useState<PostWithImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [searching, setSearching] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchPosts();
    loadSettings();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prima proviamo senza le colonne immagini per verificare la connessione base
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('id, title, content, excerpt, status, image_url, image_alt')
        .order('created_at', { ascending: false });

      if (fetchError) {
        // Se l'errore è dovuto alle colonne mancanti, informiamo l'utente
        if (fetchError.message.includes('column') && fetchError.message.includes('does not exist')) {
          throw new Error('Le colonne image_url e image_alt non esistono nella tabella posts. Consulta la documentazione per aggiungerle.');
        }
        throw fetchError;
      }

      // Gestiamo il caso in cui le colonne potrebbero essere null/undefined
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

  const loadSettings = () => {
    // Carico le impostazioni dal localStorage
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

      // Download e trigger di Unsplash per tracciare l'utilizzo
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

  const autoAssignImages = async () => {
    if (!unsplashAccessKey) {
      setError('Configurare prima la chiave API di Unsplash');
      return;
    }

    const postsWithoutImages = posts.filter(post => !post.image_url);
    
    if (postsWithoutImages.length === 0) {
      setSuccess('Tutti gli articoli hanno già un\'immagine!');
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    try {
      setAssigning(true);
      setError(null);

      for (const post of postsWithoutImages) {
        // Genera keywords dal titolo e contenuto
        const keywords = extractKeywords(post.title, post.content || '');
        const searchQuery = keywords.length > 0 ? keywords.join(' ') : defaultKeywords;

        try {
          // Cerca un'immagine
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
            {
              headers: {
                'Authorization': `Client-ID ${unsplashAccessKey}`
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const image = data.results[0];
              
              // Assegna l'immagine
              await assignImageToPost(post, image);
              
              // Aspetta un po' per rispettare i rate limits
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (err) {
          console.error(`❌ Errore assegnazione automatica per ${post.title}:`, err);
        }
      }

      setSuccess(`Processo completato! Assegnate immagini automaticamente.`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('❌ Errore assegnazione automatica:', err);
      setError(err instanceof Error ? err.message : 'Errore assegnazione automatica');
    } finally {
      setAssigning(false);
    }
  };

  const extractKeywords = (title: string, content: string): string[] => {
    const text = `${title} ${content}`.toLowerCase();
    
    // Parole chiave comuni per il blog spirituale
    const spiritualKeywords = [
      'meditazione', 'zen', 'buddhismo', 'dharma', 'sangha', 'buddha',
      'mindfulness', 'compassione', 'saggezza', 'pace', 'armonia',
      'serenità', 'contemplazione', 'illuminazione', 'risveglio',
      'meditation', 'wisdom', 'peace', 'harmony', 'nature', 'temple'
    ];

    const foundKeywords = spiritualKeywords.filter(keyword => 
      text.includes(keyword)
    );

    // Se non trova keywords specifiche, usa quelle di default
    return foundKeywords.length > 0 ? foundKeywords.slice(0, 3) : ['zen', 'meditation', 'nature'];
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

  const postsWithoutImages = posts.filter(post => !post.image_url);
  const postsWithImages = posts.filter(post => post.image_url);

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
            {posts.length} articoli totali, {postsWithoutImages.length} senza immagine
          </p>
        </div>
        
        {postsWithoutImages.length > 0 && (
          <Button 
            onClick={autoAssignImages}
            disabled={!unsplashAccessKey || assigning}
            className="bg-saffron-600 hover:bg-saffron-700"
          >
            {assigning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Assegna Automaticamente
          </Button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            {error.includes('colonne image_url e image_alt non esistono') && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="font-semibold text-blue-800 mb-2">🛠️ Come risolvere:</p>
                <ol className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>1. Vai su <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase Dashboard</a></li>
                  <li>2. Seleziona il progetto → Table Editor → posts</li>
                  <li>3. Clicca "Add column" e aggiungi:</li>
                  <li className="ml-4">• <code>image_url</code> (tipo: text, nullable: true)</li>
                  <li className="ml-4">• <code>image_alt</code> (tipo: text, nullable: true)</li>
                  <li>4. Ricarica questa pagina</li>
                </ol>
              </div>
            )}
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

      {/* Settings */}
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
            <p className="text-xs text-gray-500">
              Separate da virgola. Usate quando non si trovano keywords specifiche nell'articolo.
            </p>
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

      {/* Manual Search */}
      {selectedPost && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-saffron-600" />
              Cerca Immagine per "{selectedPost.title}"
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
                          onClick={() => assignImageToPost(selectedPost, image)}
                          disabled={assigning}
                          className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-xs"
                        >
                          Usa
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

      {/* Posts without images */}
      {postsWithoutImages.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-red-600">
              Articoli senza immagine ({postsWithoutImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
          </CardContent>
        </Card>
      )}

      {/* Posts with images */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-green-600">
            Articoli con immagine ({postsWithImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                      variant="outline"
                      onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                      className="flex-1 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Vedi
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post);
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
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManager;