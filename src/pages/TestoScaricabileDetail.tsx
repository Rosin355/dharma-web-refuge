import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Calendar, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDownloadableText } from '@/hooks/useDownloadableTexts';
import { useEffect } from 'react';

const TestoScaricabileDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { text, isLoading, error } = useDownloadableText(slug || '');

  const getFileIcon = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'epub':
        return '📖';
      case 'mobi':
        return '📱';
      case 'zip':
        return '📦';
      default:
        return '📄';
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (text) {
      document.title = `${text.title || 'Testo'} - Testi Scaricabili - Comunità Bodhidharma`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', text.description || `Scarica ${text.title || 'testo'} in formato ${text.file_format?.toUpperCase() || 'PDF'}`);
      }
    } else {
      document.title = 'Testi Scaricabili - Comunità Bodhidharma';
    }
  }, [text]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
      </div>
    );
  }

  if (error || !text) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? 'Errore nel caricamento del testo' : 'Testo non trovato'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-cream">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Link to="/testi-scaricabili">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla lista
            </Button>
          </Link>

          <Card className="bg-white border-zen-sage">
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-sm">
                    {getFileIcon(text.file_format || 'pdf')} {text.file_format?.toUpperCase() || 'PDF'}
                  </Badge>
                  {text.language && (
                    <Badge variant="secondary" className="text-sm">
                      {text.language === 'it' ? 'Italiano' : text.language === 'en' ? 'English' : text.language === 'es' ? 'Español' : text.language === 'fr' ? 'Français' : text.language}
                    </Badge>
                  )}
                  {text.category && (
                    <Badge variant="outline" className="text-sm">
                      {text.category}
                    </Badge>
                  )}
                </div>
                <h1 className="font-serif text-4xl font-light mb-4">
                  {text.title || 'Titolo non disponibile'}
                </h1>
                {text.description && (
                  <p className="text-lg text-gray-700 mb-4">
                    {text.description}
                  </p>
                )}
              </div>

              {/* Cover Image */}
              {text.cover_image_url && (
                <div className="mb-6">
                  <img
                    src={text.cover_image_url}
                    alt={text.title || ''}
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              {text.content && text.content.trim() && (
                <div className="mb-6 prose prose-saffron max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: String(text.content) }} 
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-zen-sage pt-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  {text.published_at && formatDate(text.published_at) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span>Pubblicato il {formatDate(text.published_at)}</span>
                    </div>
                  )}
                  {text.file_format && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span>Formato: {text.file_format.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                {text.tags && text.tags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Tag:</p>
                    <div className="flex flex-wrap gap-2">
                      {text.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {text.file_url && (
                <div className="flex justify-center">
                  <a href={text.file_url} download target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-saffron-600 hover:bg-saffron-700">
                      <Download className="h-5 w-5 mr-2" />
                      Scarica {text.file_format?.toUpperCase() || 'File'}
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default TestoScaricabileDetail;
