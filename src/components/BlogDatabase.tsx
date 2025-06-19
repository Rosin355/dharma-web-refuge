import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles?: {
    full_name: string | null;
  } | null;
  image_url?: string | null;
  image_alt?: string | null;
};

const BlogDatabase = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [showAll, setShowAll] = useState(false);

  // Categorie statiche per ora
  const categories = ['Tutti', 'Eventi', 'Insegnamenti', 'Progetti Sociali', 'Storia', 'Cerimonie', 'Ritiri'];

  // Fetch posts dal database
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Tentativo connessione database...');

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          excerpt,
          status,
          author_id,
          published_at,
          created_at,
          updated_at,
          image_url,
          image_alt
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Errore fetch posts:', fetchError);
        throw fetchError;
      }

      console.log('✅ Dati ricevuti:', data?.length || 0, 'post');
      setPosts(data || []);

    } catch (err) {
      console.error('❌ Errore caricamento posts:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento articoli');
    } finally {
      setLoading(false);
    }
  };

  // Popolamento manuale per test
  const populateTestData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📝 Creazione dati di test...');

      // Dati di test semplificati (senza autore per evitare problemi RLS)
      const testPosts = [
        {
          title: "Benvenuti nel nuovo blog della Comunità Bodhidharma",
          content: `Siamo felici di presentare il nuovo sito web della Comunità Bodhidharma. Questo spazio digitale sarà il nostro punto di incontro per condividere insegnamenti, notizie ed eventi.

Il nuovo sito include:
- Blog con articoli su dharma e pratica
- Calendario eventi e ritiri
- Sezione insegnamenti e testi
- Informazioni sui nostri programmi

Continuate a seguirci per rimanere aggiornati su tutte le attività del nostro centro monastico.`,
          excerpt: "Presentazione del nuovo sito web della Comunità Bodhidharma con tutte le novità e funzionalità.",
          status: 'published',
          published_at: new Date().toISOString()
        },
        {
          title: "La pratica della meditazione quotidiana",
          content: `La meditazione quotidiana è la base di ogni percorso spirituale buddhista. Nel nostro tempio, incoraggiamo una pratica regolare che integri la contemplazione nella vita di tutti i giorni.

Benefici della pratica quotidiana:
- Maggiore presenza mentale
- Riduzione dello stress
- Sviluppo della compassione
- Chiarezza nella vita quotidiana

Ogni mattina alle 6:00 e ogni sera alle 19:00 pratichiamo insieme zazen. Tutti sono benvenuti a unirsi alla nostra comunità di pratica.`,
          excerpt: "I benefici e l'importanza della meditazione quotidiana nella tradizione zen.",
          status: 'published',
          published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Ieri
        }
      ];

      for (const post of testPosts) {
        const { error: insertError } = await supabase
          .from('posts')
          .insert(post);

        if (insertError) {
          console.error('❌ Errore inserimento:', insertError);
        } else {
          console.log('✅ Inserito:', post.title);
        }
      }

      // Ricarica i dati
      await fetchPosts();

    } catch (err) {
      console.error('❌ Errore popolamento:', err);
      setError('Errore durante il popolamento dei dati di test');
    } finally {
      setLoading(false);
    }
  };

  // Filtra i post
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const postsToShow = showAll ? filteredPosts : filteredPosts.slice(0, 6);
  const hasMorePosts = filteredPosts.length > 6 && !showAll;

  // Funzione per formattare la data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data non disponibile';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Data non valida';
    }
  };

  // Funzione per calcolare tempo di lettura
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4 text-white">
            Blog & <span className="text-saffron-400">Attività</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Le nostre iniziative, eventi e riflessioni per la diffusione del Dharma
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-800 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cerca articoli..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-saffron-600 hover:bg-saffron-700 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-saffron-600 mr-3" />
              <span className="text-lg text-gray-400">Caricamento articoli dal database...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert className="mb-8 border-red-500/50 bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <strong>Errore connessione database:</strong> {error}
                <div className="mt-2 flex gap-2">
                  <Button 
                    onClick={fetchPosts}
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-300 hover:bg-red-900/30"
                  >
                    Riprova connessione
                  </Button>
                  <Button 
                    onClick={populateTestData}
                    size="sm"
                    className="bg-saffron-600 hover:bg-saffron-700 text-white"
                  >
                    Popola dati di test
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">Nessun articolo nel database</h3>
              <p className="text-gray-300 mb-6">
                Il database è vuoto. Vuoi aggiungere alcuni articoli di esempio?
              </p>
              <Button 
                onClick={populateTestData}
                className="bg-saffron-600 hover:bg-saffron-700"
              >
                Crea articoli di esempio
              </Button>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && posts.length > 0 && (
            <>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">Nessun articolo trovato per la ricerca corrente.</p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('Tutti');
                    }}
                    variant="outline"
                    className="mt-4 border-gray-600 text-gray-200 hover:bg-gray-700"
                  >
                    Mostra tutti gli articoli
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {postsToShow.map((post) => {
                      const authorName = post.profiles?.full_name || 'Comunità Bodhidharma';
                      const formattedDate = formatDate(post.published_at);
                      const readTime = calculateReadTime(post.content);
                      
                      return (
                        <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-gray-800 border-gray-700">
                          <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-saffron-100 to-zen-sage/20">
                            {post.image_url ? (
                              <img
                                src={post.image_url}
                                alt={post.image_alt || post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center text-zen-stone/60">
                                  <Calendar className="h-12 w-12 mx-auto mb-2" />
                                  <p className="text-sm font-medium">{formattedDate}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formattedDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{authorName}</span>
                              </div>
                              <span className="text-saffron-400 font-semibold">{readTime}</span>
                            </div>
                            <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-saffron-400 transition-colors text-gray-100">
                              {post.title}
                            </h3>
                            <p className="text-gray-400 mb-4 line-clamp-3">
                              {post.excerpt || `${post.content.substring(0, 150)}...`}
                            </p>
                            <Link to={`/blog/${post.id}`}>
                              <Button 
                                variant="outline" 
                                className="group/btn border-saffron-600 text-saffron-400 hover:bg-saffron-600 hover:text-white bg-transparent"
                              >
                                Leggi tutto 
                                <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {hasMorePosts && (
                    <div className="text-center">
                      <Button 
                        onClick={() => setShowAll(true)}
                        size="lg"
                        className="bg-saffron-600 hover:bg-saffron-700"
                      >
                        Carica altri articoli ({filteredPosts.length - 6} rimanenti)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDatabase; 