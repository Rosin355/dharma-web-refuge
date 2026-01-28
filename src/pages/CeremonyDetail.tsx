import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Music,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];

const CeremonyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [ceremony, setCeremony] = useState<Ceremony | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCeremony = async () => {
      if (!id) {
        setError('ID cerimonia non valido');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('ceremonies')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Cerimonia non trovata');

        setCeremony(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nel caricamento della cerimonia');
      } finally {
        setLoading(false);
      }
    };

    loadCeremony();
  }, [id]);

  // Aggiorna meta tags Open Graph per la condivisione
  useEffect(() => {
    if (ceremony) {
      const url = `${window.location.origin}/cerimonie/${ceremony.id}`;
      
      // Aggiorna title
      document.title = `${ceremony.title} - Cerimonie - Comunità Bodhidharma`;
      
      // Aggiorna o crea meta tags
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Open Graph tags
      updateMetaTag('og:title', ceremony.title);
      updateMetaTag('og:description', ceremony.description?.substring(0, 200) || 'Cerimonia della Comunità Bodhidharma');
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:url', url);
      if (ceremony.image_url) {
        updateMetaTag('og:image', ceremony.image_url);
        updateMetaTag('og:image:width', '1200');
        updateMetaTag('og:image:height', '630');
      }

      // Twitter Card tags
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', ceremony.title);
      updateMetaTag('twitter:description', ceremony.description?.substring(0, 200) || 'Cerimonia della Comunità Bodhidharma');
      if (ceremony.image_url) {
        updateMetaTag('twitter:image', ceremony.image_url);
      }

      // Meta description standard
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', ceremony.description?.substring(0, 160) || 'Cerimonia della Comunità Bodhidharma');
      }
    }

    // Cleanup: ripristina i meta tags di default quando il componente viene smontato
    return () => {
      document.title = 'Comunità Bodhidharma - Centro Monastico e Blog Spirituale';
    };
  }, [ceremony]);

  const handleShare = async () => {
    if (!ceremony) return;
    
    const url = `${window.location.origin}/cerimonie/${ceremony.id}`;
    const shareData = {
      title: ceremony.title,
      text: ceremony.description?.substring(0, 200) || '',
      url: url,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copiato negli appunti!');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copiato negli appunti!');
        } catch (clipboardErr) {
          console.error('Errore copia appunti:', clipboardErr);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento cerimonia...</p>
        </div>
      </div>
    );
  }

  if (error || !ceremony) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Cerimonia non trovata</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/cerimonie')} className="bg-saffron-600 hover:bg-saffron-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alle Cerimonie
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate('/cerimonie')}
            variant="outline"
            className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alle Cerimonie
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              {ceremony.type && (
                <Badge className="bg-saffron-100 text-saffron-800">
                  {ceremony.type}
                </Badge>
              )}
              {ceremony.featured && (
                <Badge className="bg-saffron-500 text-white">
                  In Evidenza
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-4xl font-light mb-4 text-white">
              {ceremony.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Image */}
            {ceremony.image_url && (
              <Card className="overflow-hidden border-zen-sage">
                <div className="aspect-video">
                  <img 
                    src={ceremony.image_url} 
                    alt={ceremony.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}

            {/* Description */}
            {ceremony.description && (
              <Card className="border-zen-sage">
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-semibold mb-4">Descrizione</h2>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {ceremony.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Audio Player */}
            {ceremony.audio_file_url && (
              <Card className="border-zen-sage">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Music className="h-6 w-6 text-saffron-600" />
                    <h2 className="font-serif text-2xl font-semibold">Ascolta</h2>
                  </div>
                  <div className="space-y-4">
                    <audio controls className="w-full">
                      <source src={ceremony.audio_file_url} />
                      Il tuo browser non supporta l'elemento audio.
                    </audio>
                    <Button
                      variant="outline"
                      onClick={() => window.open(ceremony.audio_file_url!, '_blank')}
                      className="w-full border-saffron-200 hover:bg-saffron-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Scarica Audio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDF/File Download */}
            {ceremony.pdf_file_url && (
              <Card className="border-zen-sage">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-saffron-600" />
                    <h2 className="font-serif text-2xl font-semibold">File Scaricabile</h2>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(ceremony.pdf_file_url!, '_blank')}
                    className="w-full border-saffron-200 hover:bg-saffron-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Scarica File
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Sharing */}
            <Card className="border-zen-sage">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-saffron-600" />
                  Condividi Cerimonia
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    📘 Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const text = `Partecipa a: ${ceremony.title}`;
                      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    🐦 Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const text = `Ciao! Ti segnalo questa cerimonia: ${ceremony.title} - ${window.location.href}`;
                      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    💬 WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    📋 Copia Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CeremonyDetail;
