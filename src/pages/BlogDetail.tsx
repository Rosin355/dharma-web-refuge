import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowLeft, Calendar, User, Clock, Loader2, AlertCircle, Share2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { applyPageMetadata, buildContentUrl, normalizeDescription } from '@/lib/page-metadata';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles?: {
    full_name: string | null;
  } | null;
  image_url?: string | null;
  image_alt?: string | null;
};

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch del post dal database
  useEffect(() => {
    if (!id) {
      setError('ID articolo non specificato');
      setLoading(false);
      return;
    }

    fetchPost(id);
  }, [id]);

  useEffect(() => {
    if (!post) return;

    return applyPageMetadata({
      title: post.title,
      description: post.excerpt || post.content,
      pathname: `/blog/${post.id}`,
      image: post.image_url,
      type: 'article',
    });
  }, [post]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Caricamento articolo ID:', postId);

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
          image_alt,
          profiles:author_id (
            full_name
          )
        `)
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('❌ Errore fetch post:', fetchError);
        throw fetchError;
      }

      if (!data) {
        throw new Error('Articolo non trovato');
      }

      console.log('✅ Articolo caricato:', data.title);
      setPost(data as unknown as Post);

    } catch (err) {
      console.error('❌ Errore caricamento articolo:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento articolo');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
          <p className="text-gray-400">Caricamento articolo...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-900">
        <section className="bg-gray-800 py-8">
          <div className="container mx-auto px-4">
            <Link to="/blog">
              <Button variant="ghost" className="text-white hover:text-saffron-300 mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna al Blog
              </Button>
            </Link>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Alert className="border-red-500/50 bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {error || 'Articolo non trovato'}
                </AlertDescription>
              </Alert>
              
              <div className="text-center mt-8">
                <Link to="/blog">
                  <Button className="bg-saffron-600 hover:bg-saffron-700">
                    Torna a tutti gli articoli
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Funzioni helper
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

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  };

  // Estrae le immagini dal contenuto HTML
  const extractImages = (html: string): string[] => {
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
    const images: string[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]);
    }
    return images;
  };

  // Formatta il contenuto preservando HTML, gestendo immagini e video YouTube
  const formatContent = (content: string) => {
    // Estrai tutte le immagini
    const images = extractImages(content);
    
    // Rimuovi le immagini dal contenuto per mostrarle separatamente
    let processedContent = content.replace(/<img[^>]+>/gi, '');
    
    // Se ci sono immagini, crea un carosello
    const imageCarousel = images.length > 0 ? (
      <div className="my-8">
        {images.length > 1 ? (
          <Carousel className="w-full max-w-2xl mx-auto">
            <CarouselContent>
              {images.map((imgSrc, index) => (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center">
                    <img
                      src={imgSrc}
                      alt={`Immagine ${index + 1}`}
                      className="max-w-full h-auto max-h-[600px] rounded-lg shadow-lg object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-gray-700/50 hover:bg-gray-700 text-white border-gray-600" />
            <CarouselNext className="bg-gray-700/50 hover:bg-gray-700 text-white border-gray-600" />
          </Carousel>
        ) : (
          <div className="flex items-center justify-center my-8">
            <img
              src={images[0]}
              alt="Immagine articolo"
              className="max-w-2xl w-full h-auto max-h-[600px] rounded-lg shadow-lg object-contain"
            />
          </div>
        )}
      </div>
    ) : null;

    // Processa il contenuto HTML rimanente
    // Il contenuto può già contenere video YouTube embed e altro HTML
    return (
      <>
        {imageCarousel}
        <div 
          className="prose prose-lg max-w-none prose-invert text-gray-400"
          dangerouslySetInnerHTML={{ __html: processedContent }}
          style={{
            // Stili per assicurarsi che i video YouTube siano responsive
            '--tw-prose-body': '#9ca3af',
            '--tw-prose-headings': '#f3f4f6',
          } as React.CSSProperties}
        />
        <style>{`
          .prose img {
            max-width: 42rem !important;
            max-height: 600px !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            margin: 1.5rem auto !important;
            display: block !important;
          }
        `}</style>
      </>
    );
  };

  // Funzione per condividere l'articolo
  const handleShare = async () => {
    const url = buildContentUrl(`/blog/${post.id}`);
    const shareData = {
      title: post.title,
      text: normalizeDescription(post.excerpt || post.content, ''),
      url: url,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copia negli appunti
        await navigator.clipboard.writeText(url);
        alert('Link copiato negli appunti!');
      }
    } catch (err) {
      // L'utente ha annullato la condivisione o si è verificato un errore
      if ((err as Error).name !== 'AbortError') {
        console.error('Errore condivisione:', err);
        // Fallback: copia negli appunti
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copiato negli appunti!');
        } catch (clipboardErr) {
          console.error('Errore copia appunti:', clipboardErr);
        }
      }
    }
  };

  // Dati del post
  const authorName = post.profiles?.full_name || 'Comunità Bodhidharma';
  const formattedDate = formatDate(post.published_at);
  const readTime = calculateReadTime(post.content);

      return (
      <div className="min-h-screen bg-gray-900">
      {/* Header con breadcrumb */}
      <section className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className="text-white hover:text-saffron-300 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al Blog
            </Button>
          </Link>

          {/* Immagine di copertina */}
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden bg-gray-900 max-w-4xl mx-auto">
              <div className="relative w-full" style={{ aspectRatio: '21/9', minHeight: '300px', maxHeight: '400px' }}>
                <img
                  src={post.image_url}
                  alt={post.image_alt || post.title}
                  className="w-full h-full object-contain"
                  style={{ objectPosition: 'center center' }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-white">
              {post.title}
            </h1>
            {post.status === 'draft' && (
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                BOZZA
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white font-medium">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
              <User className="h-4 w-4" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-2 bg-saffron-600 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenuto dell'articolo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-sm p-8 md:p-12">
              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-saffron-400 font-light leading-relaxed mb-8 border-l-4 border-saffron-600/50 pl-6">
                  {post.excerpt}
                </p>
              )}
              
              {/* Contenuto principale */}
              <div className="prose prose-lg max-w-none prose-invert">
                {formatContent(post.content || '')}
              </div>

              {/* Condivisione e navigazione */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link to="/blog">
                    <Button variant="outline" className="border-saffron-600 text-saffron-400 hover:bg-saffron-600 hover:text-white bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Tutti gli articoli
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="border-saffron-600 text-saffron-400 hover:bg-saffron-600 hover:text-white bg-transparent"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Condividi questo articolo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
