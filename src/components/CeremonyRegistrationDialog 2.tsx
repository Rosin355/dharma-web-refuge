import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCeremonyRegistrations } from '@/hooks/useCeremonies';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];

interface CeremonyRegistrationDialogProps {
  ceremony: Ceremony | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CeremonyRegistrationDialog = ({
  ceremony,
  open,
  onOpenChange,
}: CeremonyRegistrationDialogProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    notes: '',
    privacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createRegistration } = useCeremonyRegistrations();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Il nome è obbligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.privacy) {
      newErrors.privacy = 'Devi accettare la privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ceremony || !validateForm()) return;

    try {
      await createRegistration.mutateAsync({
        ceremony_id: ceremony.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        notes: formData.notes || undefined,
      });

      toast({
        title: 'Iscrizione inviata!',
        description: 'Riceverai una conferma via email a breve.',
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        notes: '',
        privacy: false,
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore. Riprova più tardi.',
        variant: 'destructive',
      });
    }
  };

  if (!ceremony) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            Iscriviti alla cerimonia
          </DialogTitle>
          <DialogDescription>
            {ceremony.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Mario Rossi"
              className={errors.full_name ? 'border-red-500' : ''}
            />
            {errors.full_name && (
              <p className="text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="mario.rossi@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+39 123 456 7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Note / Richieste Speciali</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Eventuali necessità o richieste particolari..."
              rows={3}
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="privacy"
              checked={formData.privacy}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, privacy: checked as boolean })
              }
            />
            <Label
              htmlFor="privacy"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accetto la privacy policy e il trattamento dei dati personali *
            </Label>
          </div>
          {errors.privacy && (
            <p className="text-sm text-red-600">{errors.privacy}</p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-saffron-500 hover:bg-saffron-600"
              disabled={createRegistration.isPending}
            >
              {createRegistration.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio...
                </>
              ) : (
                'Conferma Iscrizione'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};