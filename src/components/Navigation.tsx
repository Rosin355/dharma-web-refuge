
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Heart } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Eventi', path: '/eventi' },
    { name: 'Cerimonie', path: '/cerimonie' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Contatti', path: '/contatti' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-zen-stone sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-saffron-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">☸</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Bodhidharma
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-saffron-500 ${
                  isActive(item.path) 
                    ? 'text-saffron-500 border-b-2 border-saffron-500' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-saffron-500 hover:bg-saffron-600 text-white">
              <Heart className="mr-2 h-4 w-4" />
              Dona
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-zen-cream">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium p-2 rounded-lg transition-colors ${
                        isActive(item.path) 
                          ? 'bg-saffron-100 text-saffron-600' 
                          : 'text-muted-foreground hover:bg-zen-stone'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button className="bg-saffron-500 hover:bg-saffron-600 text-white mt-4">
                    <Heart className="mr-2 h-4 w-4" />
                    Dona
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
