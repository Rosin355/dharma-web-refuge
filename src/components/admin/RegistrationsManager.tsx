import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Search,
  Loader2,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Registration = Database['public']['Tables']['event_registrations']['Row'] & {
  events?: Database['public']['Tables']['events']['Row'];
};

const RegistrationsManager = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  // Fetch all events for filter
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .order('title');
      if (error) throw error;
      return data;
    },
  });

  // Fetch all registrations with event details
  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['all-event-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            id,
            title,
            start_date,
            type
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Registration[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-event-registrations'] });
      toast({
        title: 'Successo',
        description: 'Stato prenotazione aggiornato',
      });
    },
    onError: () => {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'aggiornamento dello stato',
        variant: 'destructive',
      });
    },
  });

  const deleteRegistration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-event-registrations'] });
      toast({
        title: 'Successo',
        description: 'Prenotazione eliminata con successo',
      });
      setShowDeleteModal(false);
      setSelectedRegistration(null);
    },
    onError: () => {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'eliminazione della prenotazione',
        variant: 'destructive',
      });
    },
  });

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.events?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      selectedStatus === 'all' || reg.status === selectedStatus;
    
    const matchesEvent =
      selectedEvent === 'all' || reg.event_id === selectedEvent;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confermata
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Cancellata
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            In Attesa
          </Badge>
        );
    }
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const handleDelete = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowDeleteModal(true);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Gestione Prenotazioni</h2>
          <p className="text-sm text-muted-foreground">
            {registrations.length} prenotazioni totali, {filteredRegistrations.length} visualizzate
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca per nome, email o evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtra per stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="pending">In Attesa</SelectItem>
                <SelectItem value="confirmed">Confermate</SelectItem>
                <SelectItem value="cancelled">Cancellate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtra per evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli eventi</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Data Prenotazione</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nessuna prenotazione trovata
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.full_name}
                    </TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>
                      {registration.events?.title || 'Evento non trovato'}
                    </TableCell>
                    <TableCell>{registration.phone || '-'}</TableCell>
                    <TableCell>{formatDate(registration.created_at)}</TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(registration)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Dettagli
                          </DropdownMenuItem>
                          {registration.status !== 'confirmed' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(registration.id, 'confirmed')}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Conferma
                            </DropdownMenuItem>
                          )}
                          {registration.status !== 'cancelled' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(registration.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancella
                            </DropdownMenuItem>
                          )}
                          {registration.status !== 'pending' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(registration.id, 'pending')}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Ripristina
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(registration)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dettagli Prenotazione</DialogTitle>
            <DialogDescription>
              Informazioni complete sulla prenotazione
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                  <p className="text-base">{selectedRegistration.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedRegistration.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefono</p>
                  <p className="text-base">{selectedRegistration.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stato</p>
                  <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Evento</p>
                  <p className="text-base">{selectedRegistration.events?.title || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Evento</p>
                  <p className="text-base">
                    {selectedRegistration.events?.start_date
                      ? formatDate(selectedRegistration.events.start_date)
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Prenotazione</p>
                  <p className="text-base">{formatDate(selectedRegistration.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ultimo Aggiornamento</p>
                  <p className="text-base">{formatDate(selectedRegistration.updated_at)}</p>
                </div>
              </div>
              {selectedRegistration.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Note</p>
                  <p className="text-base bg-muted p-3 rounded-md">
                    {selectedRegistration.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
          </DialogHeader>
          <p>
            Sei sicuro di voler eliminare la prenotazione di{' '}
            <strong>{selectedRegistration?.full_name}</strong>? L'azione è irreversibile.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={() => selectedRegistration && deleteRegistration.mutate(selectedRegistration.id)}
              disabled={deleteRegistration.isPending}
              variant="destructive"
            >
              {deleteRegistration.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Elimina'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationsManager;
