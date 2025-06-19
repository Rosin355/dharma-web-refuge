import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles?: {
    full_name: string | null;
  } | null;
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

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Caricamento articolo ID:', postId);

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            full_name
          )
        `)
        .eq('id', postId)
        .eq('status', 'published')
        .single();

      if (fetchError) {
        console.error('❌ Errore fetch post:', fetchError);
        throw fetchError;
      }

      if (!data) {
        throw new Error('Articolo non trovato');
      }

      console.log('✅ Articolo caricato:', data.title);
      setPost(data);

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
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
          <p className="text-zen-stone">Caricamento articolo...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-zen-cream">
        <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-8">
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
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
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

  // Formatta il contenuto preservando la struttura HTML e markdown di base
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Gestisce i titoli con **
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          const title = paragraph.slice(2, -2);
          return <h3 key={index} className="font-serif text-xl font-semibold mt-6 mb-3 text-zen-stone">{title}</h3>;
        }
        
        // Gestisce i paragrafi normali con grassetto inline
        const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return (
          <p 
            key={index} 
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedParagraph }}
          />
        );
      });
  };

  // Dati del post
  const authorName = post.profiles?.full_name || 'Comunità Bodhidharma';
  const formattedDate = formatDate(post.published_at);
  const readTime = calculateReadTime(post.content);

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header con breadcrumb */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-8">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className="text-white hover:text-saffron-300 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al Blog
            </Button>
          </Link>
          <Badge className="bg-green-600 hover:bg-green-700 mb-4">
            Database
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
            {post.title}
          </h1>
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

      {/* Immagine principale */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <div className="aspect-video md:aspect-[21/9] overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-saffron-100 to-zen-sage/20">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-zen-stone/60">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">{formattedDate}</p>
                <p className="text-sm">Articolo dal database</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenuto dell'articolo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-saffron-600 font-light leading-relaxed mb-8 border-l-4 border-saffron-200 pl-6">
                  {post.excerpt}
                </p>
              )}
              
              {/* Contenuto principale */}
              <div className="prose prose-lg max-w-none">
                {formatContent(post.content)}
              </div>

              {/* Condivisione e navigazione */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link to="/blog">
                    <Button variant="outline" className="border-saffron-600 text-saffron-600 hover:bg-saffron-600 hover:text-white">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Tutti gli articoli
                    </Button>
                  </Link>
                  <div className="text-sm text-gray-500">
                    Condividi questo articolo con la tua comunità
                  </div>
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
