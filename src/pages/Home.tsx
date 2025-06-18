
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, BookOpen, Users, Heart } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Insegnamenti",
      description: "Scopri gli insegnamenti del Buddha e approfondisci la tua pratica spirituale attraverso i nostri articoli e riflessioni.",
      link: "/insegnamenti"
    },
    {
      icon: Calendar,
      title: "Eventi",
      description: "Partecipa ai nostri ritiri, conferenze e incontri di meditazione per crescere insieme nella comunità.",
      link: "/eventi"
    },
    {
      icon: Users,
      title: "Cerimonie",
      description: "Unisciti alle nostre cerimonie tradizionali e ai momenti di raccoglimento spirituale.",
      link: "/cerimonie"
    },
    {
      icon: Heart,
      title: "Donazioni",
      description: "Sostieni la nostra comunità e contribuisci alla diffusione del Dharma con una donazione.",
      link: "/dona"
    }
  ];

  const recentPosts = [
    {
      title: "Italia Buddhista - Tavole Rotonde Online",
      excerpt: "Serie di incontri via Zoom con religiosi di diverse tradizioni buddhiste per approfondire temi fondamentali come la sofferenza, il karma e la natura di Buddha.",
      date: "Marzo 2021",
      image: "https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Ritiro di Vesak 2021",
      excerpt: "Celebrazione della nascita, illuminazione e parinirvana del Buddha con un ritiro speciale di tre giorni nel nostro centro con meditazioni e cerimonie.",
      date: "Maggio 2021",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Progetto Scuole: Mindfulness ed Educazione",
      excerpt: "Il nostro impegno nell'introduzione della mindfulness nelle scuole italiane per supportare studenti e insegnanti nel percorso educativo.",
      date: "Settembre 2020",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center zen-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            backgroundBlendMode: "overlay"
          }}
        ></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-6 animate-fade-in text-shadow">
            Comunità<br />
            <span className="text-saffron-300">Bodhidharma</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-zen-cream animate-fade-in">
            Un centro monastico dedicato alla pratica del Dharma e alla crescita spirituale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600 text-white px-8 py-3 text-lg">
              <Link to="/insegnamenti">Esplora gli Insegnamenti</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-foreground px-8 py-3 text-lg">
              <Link to="/eventi">Partecipa agli Eventi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zen-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-light mb-4">
              Il Nostro <span className="text-saffron-500">Sentiero</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scopri le diverse vie attraverso cui puoi intraprendere il tuo viaggio spirituale con la nostra comunità
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-white border-zen-sage">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center group-hover:bg-saffron-200 transition-colors">
                    <feature.icon className="h-8 w-8 text-saffron-600" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <Link to={feature.link}>
                    <Button variant="ghost" size="sm" className="text-saffron-600 hover:text-saffron-700 hover:bg-saffron-50">
                      Scopri di più →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-light mb-4">
              Ultime <span className="text-saffron-500">Attività</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Riflessioni, insegnamenti e guide pratiche per approfondire la tua comprensione del Dharma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {recentPosts.map((post, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-zen-sage">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-saffron-600 mb-2">{post.date}</p>
                  <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/blog">
              <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600 text-white">
                Scopri tutti le attività
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 saffron-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-light text-white mb-6">
            Unisciti alla Nostra Comunità
          </h2>
          <p className="text-xl text-saffron-100 mb-8 max-w-2xl mx-auto">
            Inizia il tuo viaggio spirituale con noi. Partecipa ai nostri eventi, 
            leggi i nostri insegnamenti e scopri la pace interiore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/eventi">
              <Button size="lg" variant="outline" className="bg-white text-saffron-600 border-white hover:bg-saffron-50">
                Partecipa agli Eventi
              </Button>
            </Link>
            <Link to="/dona">
              <Button size="lg" className="bg-burgundy-500 hover:bg-burgundy-600 text-white">
                <Heart className="mr-2 h-4 w-4" />
                Sostieni la Comunità
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
