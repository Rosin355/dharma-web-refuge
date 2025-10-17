import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

interface EventInfoDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventInfoDialog = ({ event, open, onOpenChange }: EventInfoDialogProps) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        {event.image_url && (
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {event.type && (
              <Badge variant="secondary" className="bg-saffron-100 text-saffron-700">
                {event.type}
              </Badge>
            )}
            {event.featured && (
              <Badge className="bg-saffron-500 text-white">
                In Evidenza
              </Badge>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-saffron-500 mt-0.5" />
              <div>
                <p className="font-medium">Data</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.start_date)}
                  {event.end_date && event.end_date !== event.start_date && (
                    <> - {formatDate(event.end_date)}</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-saffron-500 mt-0.5" />
              <div>
                <p className="font-medium">Orario</p>
                <p className="text-sm text-muted-foreground">
                  Inizio: {formatTime(event.start_date)}
                  {event.end_date && (
                    <> - Fine: {formatTime(event.end_date)}</>
                  )}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-saffron-500 mt-0.5" />
                <div>
                  <p className="font-medium">Luogo</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}

            {event.max_participants && (
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-saffron-500 mt-0.5" />
                <div>
                  <p className="font-medium">Partecipanti</p>
                  <p className="text-sm text-muted-foreground">
                    Massimo {event.max_participants} partecipanti
                  </p>
                </div>
              </div>
            )}

            {event.price && (
              <div className="flex items-start space-x-3">
                <span className="text-2xl font-semibold text-saffron-600">
                  {event.price}
                </span>
              </div>
            )}

            {event.meeting_url && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(event.meeting_url!, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Link Meeting Online
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
