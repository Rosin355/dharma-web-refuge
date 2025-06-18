import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ExternalLink } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [showAll, setShowAll] = useState(false);

  const categories = ['Tutti', 'Eventi', 'Insegnamenti', 'Progetti Sociali', 'Storia', 'Cerimonie', 'Ritiri'];

  const allBlogPosts = [
    {
      id: 1,
      title: "Italia Buddhista - Tavole Rotonde Online",
      excerpt: "Una serie di incontri via Zoom con religiosi di diverse tradizioni buddhiste italiane per approfondire temi fondamentali: la sofferenza, il karma, la natura di Buddha e l'interdipendenza.",
      content: "Il nostro centro, in collaborazione con i Religiosi di Italia Buddhista, organizza una serie di tavole rotonde online da marzo a giugno 2021. Ogni incontro viene trasmesso via Zoom con la partecipazione di massimo 100 persone. I temi affrontati includono: La sofferenza e la prima nobile verità, Il karma e la legge di causa-effetto, La natura di Buddha e il risveglio, L'interdipendenza e la visione buddhista del mondo.",
      author: "Kusalananda",
      date: "Febbraio 2021",
      category: "Eventi",
      image: "https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Lokanatha: Il Primo Monaco Buddhista Italiano",
      excerpt: "La straordinaria storia di Salvatore Cioffi (1897-1966), nato a Napoli e diventato il Venerabile Lokanatha, primo monaco buddhista italiano ordinato in Sri Lanka.",
      content: "Salvatore Cioffi nacque a Napoli nel 1897 da una numerosa famiglia che emigrò negli Stati Uniti quando lui aveva solo tre anni. La sua vita cambiò radicalmente quando, da giovane adulto, si trasferì in Sri Lanka dove venne ordinato monaco buddhista con il nome di Lokanatha. Fu il primo italiano a ricevere l'ordinazione completa nella tradizione Theravada. La sua storia rappresenta un ponte importante tra l'Oriente e l'Occidente nel cammino di diffusione del Buddhismo.",
      author: "Comunità Bodhidharma",
      date: "Maggio 2017",
      category: "Storia",
      image: "https://images.unsplash.com/photo-1544373884-5d7f2017d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "12 min"
    },
    {
      id: 3,
      title: "Progetto Scuole: Mindfulness ed Educazione",
      excerpt: "Il nostro impegno nell'introduzione della mindfulness nelle scuole italiane per supportare studenti e insegnanti nel percorso educativo.",
      content: "Da diversi anni la nostra comunità porta la pratica della mindfulness nelle scuole primarie e secondarie. Il progetto mira a insegnare ai giovani tecniche di concentrazione, gestione dello stress e sviluppo dell'intelligenza emotiva. Collaboriamo con insegnanti e dirigenti scolastici per integrare questi insegnamenti nel curriculum educativo tradizionale.",
      author: "Team Educativo",
      date: "Settembre 2020",
      category: "Progetti Sociali",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "7 min"
    },
    {
      id: 4,
      title: "Ritiro di Vesak 2021",
      excerpt: "Celebrazione della nascita, illuminazione e parinirvana del Buddha con un ritiro speciale di tre giorni nel nostro centro.",
      content: "Il Vesak è la festa più importante del calendario buddhista. Quest'anno abbiamo organizzato un ritiro speciale di tre giorni con meditazioni guidate, insegnamenti sui Jataka (vite precedenti del Buddha) e cerimonie tradizionali. Il ritiro si è concluso con una cerimonia di offerta della luce e la recitazione dei Paritta (versi di protezione).",
      author: "Sangha Bodhidharma",
      date: "Maggio 2021",
      category: "Cerimonie",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "6 min"
    },
    {
      id: 5,
      title: "I Quattro Fondamenti della Consapevolezza",
      excerpt: "Approfondimento sui Satipatthana, la pratica fondamentale per lo sviluppo della mindfulness secondo gli insegnamenti del Buddha.",
      content: "I Satipatthana rappresentano il cuore della pratica meditativa buddhista. Questo insegnamento esplora i quattro ambiti della consapevolezza: il corpo, le sensazioni, la mente e gli oggetti mentali. Attraverso la pratica costante di questi fondamenti, il praticante sviluppa una comprensione profonda della natura impermanente di tutti i fenomeni.",
      author: "Ven. Nyanavira",
      date: "Marzo 2021",
      category: "Insegnamenti",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "15 min"
    },
    {
      id: 6,
      title: "Meditazione Camminata nel Parco",
      excerpt: "Ogni domenica mattina organizziamo sessioni di meditazione camminata nel parco locale, aperte a tutti i livelli di esperienza.",
      content: "La meditazione camminata è una pratica che combina movimento e consapevolezza. Ogni domenica alle 9:00 ci ritroviamo nel parco per una sessione di un'ora che include istruzioni per principianti e pratica guidata. L'attività è gratuita e aperta a tutti, indipendentemente dall'esperienza meditativa precedente.",
      author: "Gruppo Pratica",
      date: "Gennaio 2021",
      category: "Eventi",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "4 min"
    }
  ];

  const filteredPosts = allBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tutti' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const postsToShow = showAll ? filteredPosts : filteredPosts.slice(0, 6);
  const hasMorePosts = filteredPosts.length > 6 && !showAll;

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4 text-white">
            Blog & <span className="text-saffron-300">Attività</span>
          </h1>
          <p className="text-xl text-zen-cream max-w-2xl mx-auto">
            Le nostre iniziative, eventi e riflessioni per la diffusione del Dharma
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-stone h-4 w-4" />
              <Input
                type="text"
                placeholder="Cerca articoli..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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
                    ? "bg-saffron-600 hover:bg-saffron-700" 
                    : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zen-stone text-lg">Nessun articolo trovato per la ricerca corrente.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {postsToShow.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        className="absolute top-4 left-4 bg-saffron-600 hover:bg-saffron-700"
                      >
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-zen-stone mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <span className="text-saffron-600">{post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-zen-stone mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Button 
                        variant="outline" 
                        className="group/btn border-saffron-600 text-saffron-600 hover:bg-saffron-600 hover:text-white"
                      >
                        Leggi tutto 
                        <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
        </div>
      </section>
    </div>
  );
};

export default Blog;