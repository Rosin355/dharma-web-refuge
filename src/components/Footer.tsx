
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Settings } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zen-stone border-t border-zen-sage mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrizione */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/ee0a1e23-8f51-4b46-8c99-f0b6fc5493e9.png" 
                  alt="Comunità Bodhidharma Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif text-xl font-semibold">Comunità Bodhidharma</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Un centro monastico dedicato alla pratica del Dharma, alla meditazione 
              e alla crescita spirituale nella tradizione buddhista zen.
            </p>
          </div>

          {/* Link utili */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Link Utili</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/insegnamenti" className="text-muted-foreground hover:text-saffron-500 transition-colors">Insegnamenti</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-saffron-500 transition-colors">Blog</Link></li>
              <li><Link to="/eventi" className="text-muted-foreground hover:text-saffron-500 transition-colors">Eventi</Link></li>
              <li><Link to="/cerimonie" className="text-muted-foreground hover:text-saffron-500 transition-colors">Cerimonie</Link></li>
              <li><Link to="/dona" className="text-muted-foreground hover:text-saffron-500 transition-colors">Dona</Link></li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Contatti</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-saffron-500" />
                <span>Via del Dharma, 108</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-saffron-500" />
                <span>+39 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-saffron-500" />
                <span>info@bodhidharma.info</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zen-sage mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 Comunità Bodhidharma. Tutti i diritti riservati.</p>
          <Link 
            to="/admin" 
            className="mt-4 sm:mt-0 flex items-center space-x-1 hover:text-saffron-500 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Accesso Operatori</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
