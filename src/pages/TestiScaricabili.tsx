import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, FileText, Loader2 } from 'lucide-react';
import { useDownloadableTexts } from '@/hooks/useDownloadableTexts';
import { useEffect } from 'react';

const TestiScaricabili = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  
  const { texts = [], isLoading, error } = useDownloadableTexts({ published: true });

  // Extract unique categories and languages
  const categories = Array.from(new Set((texts || []).map(t => t.category).filter(Boolean)));
  const languages = Array.from(new Set((texts || []).map(t => t.language || 'it')));

  const filteredTexts = (texts || []).filter((text) => {
    const matchesSearch = 
      text.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      text.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || text.category === selectedCategory;
    
    const matchesLanguage = 
      selectedLanguage === 'all' || (text.language || 'it') === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

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

  useEffect(() => {
    document.title = 'Testi Scaricabili - Comunità Bodhidharma';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Scarica testi, libri e documenti sulla pratica del Dharma. PDF, EPUB e altri formati disponibili.');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Errore nel caricamento dei testi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-cream">
        {/* Header */}
        <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-5xl font-light mb-4">
              Testi <span className="text-saffron-600">Scaricabili</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Esplora la nostra collezione di testi, libri e documenti sulla pratica del Dharma
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-white border-b border-zen-sage">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cerca testi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {categories.length > 0 && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le categorie</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Lingua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le lingue</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang === 'it' ? 'Italiano' : lang === 'en' ? 'English' : lang === 'es' ? 'Español' : lang === 'fr' ? 'Français' : lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Texts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredTexts.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-muted-foreground">Nessun testo trovato</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTexts.map((text) => (
                  <Card key={text.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-zen-sage">
                    {text.cover_image_url && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <img
                          src={text.cover_image_url}
                          alt={text.title || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getFileIcon(text.file_format || 'pdf')} {text.file_format?.toUpperCase() || 'PDF'}
                        </Badge>
                        {text.language && (
                          <Badge variant="secondary" className="text-xs">
                            {text.language}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-saffron-600 transition-colors">
                        {text.title}
                      </h3>
                      {text.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {text.description}
                        </p>
                      )}
                      {text.category && (
                        <p className="text-xs text-muted-foreground mb-4">
                          Categoria: {text.category}
                        </p>
                      )}
                      {text.tags && text.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {text.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link to={`/testi-scaricabili/${text.slug}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Dettagli
                          </Button>
                        </Link>
                        {text.file_url && (
                          <a href={text.file_url} download target="_blank" rel="noopener noreferrer">
                            <Button className="bg-saffron-600 hover:bg-saffron-700">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
    </div>
  );
};

export default TestiScaricabili;
