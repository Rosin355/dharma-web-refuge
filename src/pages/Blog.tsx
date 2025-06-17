
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');

  const categories = ['Tutti', 'Meditazione', 'Insegnamenti', 'Zen', 'Dharma', 'Comunità'];

  const blogPosts = [
    {
      id: 1,
      title: "La Via del Risveglio: Meditazione Quotidiana",
      excerpt: "Scopri come integrare la pratica meditativa nella vita di tutti i giorni per trovare pace interiore e consapevolezza. Una guida pratica per principianti e praticanti esperti.",
      content: "La meditazione quotidiana è il fondamento della pratica spirituale...",
      author: "Maestro Chen",
      date: "15 Giugno 2024",
      category: "Meditazione",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Il Sentiero dell'Illuminazione secondo Bodhidharma",
      excerpt: "Un viaggio attraverso gli insegnamenti del primo patriarca zen e la sua influenza sulla pratica moderna. Scopriamo insieme i principi fondamentali.",
      content: "Bodhidharma, il leggendario monaco che portò lo zen in Cina...",
      author: "Maestra Lin",
      date: "12 Giugno 2024",
      category: "Zen",
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Compassione e Saggezza: I Pilastri del Buddhismo",
      excerpt: "Esploriamo i fondamenti della pratica buddhista e come applicarli nella vita contemporanea per vivere con maggiore consapevolezza.",
      content: "La compassione e la saggezza sono i due pilastri su cui si fonda...",
      author: "Maestro Chen",
      date: "10 Giugno 2024",
      category: "Dharma",
      image: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Il Potere del Momento Presente nella Pratica Zen",
      excerpt: "Come coltivare la presenza mentale attraverso tecniche zen antiche e moderne. Una riflessione sulla natura del tempo e della coscienza.",
      content: "Il momento presente è tutto ciò che abbiamo realmente...",
      author: "Maestro Roshi",
      date: "8 Giugno 2024",
      category: "Zen",
      image: "https://images.unsplash.com/photo-1544373884-5d7f2017d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "7 min"
    },
    {
      id: 5,
      title: "La Pratica della Gentilezza Amorevole",
      excerpt: "Scopri come sviluppare metta (gentilezza amorevole) verso te stesso e gli altri. Una pratica fondamentale per aprire il cuore.",
      content: "La gentilezza amorevole è una delle pratiche più trasformative...",
      author: "Maestra Lin",
      date: "5 Giugno 2024",
      category: "Meditazione",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "4 min"
    },
    {
      id: 6,
      title: "Costruire una Comunità Spirituale Autentica",
      excerpt: "Riflessioni sull'importanza della sangha (comunità spirituale) nel percorso di crescita personale e collettiva.",
      content: "La sangha, o comunità spirituale, è uno dei tre gioielli...",
      author: "Abate Dharma",
      date: "3 Giugno 2024",
      category: "Comunità",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "9 min"
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tutti' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            Blog & <span className="text-saffron-600">Insegnamenti</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Approfondimenti, riflessioni e guide pratiche per il tuo viaggio spirituale
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-zen-sage">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cerca negli articoli..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-saffron-500 hover:bg-saffron-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nessun articolo trovato.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-zen-sage">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-saffron-100 text-saffron-700">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    
                    <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-zen-sage">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-saffron-600 hover:text-saffron-700 hover:bg-saffron-50 p-0">
                        Leggi →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600 text-white">
                Carica altri articoli
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
