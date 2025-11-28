
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import { useCeremonies } from '@/hooks/useCeremonies';
import { CeremonyInfoDialog } from '@/components/CeremonyInfoDialog';
import { CeremonyRegistrationDialog } from '@/components/CeremonyRegistrationDialog';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];

const Cerimonie = () => {
  const { ceremonies, isLoading } = useCeremonies('published');
  const [selectedCeremony, setSelectedCeremony] = useState<Ceremony | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  const handleInfoClick = (ceremony: Ceremony) => {
    setSelectedCeremony(ceremony);
    setShowInfoDialog(true);
  };

  const handlePartecipaClick = (ceremony: Ceremony) => {
    setSelectedCeremony(ceremony);
    setShowRegistrationDialog(true);
  };

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            Cerimonie & <span className="text-saffron-600">Rituali</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Partecipa alle nostre cerimonie tradizionali e rituali di crescita spirituale
          </p>
        </div>
      </section>

      {/* Cerimonie */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto"></div>
            </div>
          ) : ceremonies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessuna cerimonia disponibile al momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ceremonies.map((ceremony) => (
                <Card key={ceremony.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-zen-sage">
                  {ceremony.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={ceremony.image_url} 
                        alt={ceremony.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-saffron-600 transition-colors">
                      {ceremony.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {ceremony.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {ceremony.schedule && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-saffron-500" />
                          <span>{ceremony.schedule}</span>
                        </div>
                      )}
                      {ceremony.time && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 text-saffron-500" />
                          <span>{ceremony.time}</span>
                        </div>
                      )}
                      {ceremony.location && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-saffron-500" />
                          <span>{ceremony.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1 border-saffron-200 text-saffron-600 hover:bg-saffron-50"
                        onClick={() => handleInfoClick(ceremony)}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Info
                      </Button>
                      <Button 
                        className="flex-1 bg-saffron-500 hover:bg-saffron-600 text-white"
                        onClick={() => handlePartecipaClick(ceremony)}
                      >
                        Partecipa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dialogs */}
      <CeremonyInfoDialog
        ceremony={selectedCeremony}
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
      />
      <CeremonyRegistrationDialog
        ceremony={selectedCeremony}
        open={showRegistrationDialog}
        onOpenChange={setShowRegistrationDialog}
      />
    </div>
  );
};

export default Cerimonie;
