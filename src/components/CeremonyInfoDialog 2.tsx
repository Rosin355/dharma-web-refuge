import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ExternalLink, Video, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];

interface CeremonyInfoDialogProps {
  ceremony: Ceremony | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CeremonyInfoDialog = ({ ceremony, open, onOpenChange }: CeremonyInfoDialogProps) => {
  if (!ceremony) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {ceremony.title}
          </DialogTitle>
        </DialogHeader>

        {ceremony.image_url && (
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img
              src={ceremony.image_url}
              alt={ceremony.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {ceremony.type && (
              <Badge variant="secondary" className="bg-saffron-100 text-saffron-700">
                {ceremony.type}
              </Badge>
            )}
            {ceremony.featured && (
              <Badge className="bg-saffron-500 text-white">
                In Evidenza
              </Badge>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {ceremony.description}
            </p>
          </div>

          <div className="space-y-3 border-t pt-4">
            {ceremony.schedule && (
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-saffron-500 mt-0.5" />
                <div>
                  <p className="font-medium">Frequenza</p>
                  <p className="text-sm text-muted-foreground">{ceremony.schedule}</p>
                </div>
              </div>
            )}

            {ceremony.time && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-saffron-500 mt-0.5" />
                <div>
                  <p className="font-medium">Orario</p>
                  <p className="text-sm text-muted-foreground">{ceremony.time}</p>
                </div>
              </div>
            )}

            {ceremony.location && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-saffron-500 mt-0.5" />
                <div>
                  <p className="font-medium">Luogo</p>
                  <p className="text-sm text-muted-foreground">{ceremony.location}</p>
                </div>
              </div>
            )}

            {ceremony.max_participants && (
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-saffron-500 mt-0.5" />
                <div>
                  <p className="font-medium">Partecipanti</p>
                  <p className="text-sm text-muted-foreground">
                    Massimo {ceremony.max_participants} partecipanti
                  </p>
                </div>
              </div>
            )}

            {ceremony.price && (
              <div className="flex items-start space-x-3">
                <span className="text-2xl font-semibold text-saffron-600">
                  {ceremony.price}
                </span>
              </div>
            )}

            {/* Modalità di partecipazione */}
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-lg">Modalità di Partecipazione</h4>
              
              {ceremony.attendance_type === 'online' && ceremony.meeting_url && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Video className="h-5 w-5 text-saffron-500" />
                    <span className="font-medium">Cerimonia Online</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-saffron-200 hover:bg-saffron-50"
                    onClick={() => window.open(ceremony.meeting_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Accedi al Meeting Online
                  </Button>
                </div>
              )}

              {ceremony.attendance_type === 'in_person' && ceremony.location && (
                <div className="flex items-center space-x-2 text-sm">
                  <UserCheck className="h-5 w-5 text-saffron-500" />
                  <span className="font-medium">Solo in Presenza</span>
                </div>
              )}

              {ceremony.attendance_type === 'hybrid' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <UserCheck className="h-5 w-5 text-saffron-500" />
                    <span className="font-medium">Cerimonia Ibrida - Partecipazione in presenza e online</span>
                  </div>
                  {ceremony.location && (
                    <div className="p-3 bg-saffron-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">In Presenza:</p>
                      <p className="text-sm text-muted-foreground">{ceremony.location}</p>
                    </div>
                  )}
                  {ceremony.meeting_url && (
                    <Button
                      variant="outline"
                      className="w-full border-saffron-200 hover:bg-saffron-50"
                      onClick={() => window.open(ceremony.meeting_url!, '_blank')}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Oppure Partecipa Online
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};