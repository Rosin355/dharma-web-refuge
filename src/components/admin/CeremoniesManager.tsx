import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Loader2,
} from 'lucide-react';
import { useCeremonies } from '@/hooks/useCeremonies';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Ceremony = Database['public']['Tables']['ceremonies']['Row'];

const CeremoniesManager = () => {
  const navigate = useNavigate();
  const { ceremonies, isLoading, deleteCeremony } = useCeremonies();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCeremony, setSelectedCeremony] = useState<Ceremony | null>(null);

  const handleDelete = async () => {
    try {
      if (!selectedCeremony) return;

      await deleteCeremony.mutateAsync(selectedCeremony.id);

      toast({
        title: 'Successo',
        description: 'Cerimonia eliminata con successo',
      });

      setShowDeleteModal(false);
      setSelectedCeremony(null);
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'eliminazione della cerimonia',
        variant: 'destructive',
      });
    }
  };

  const filteredCeremonies = ceremonies.filter((ceremony) => {
    const matchesSearch = ceremony.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || ceremony.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            Pubblicato
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Bozza
          </Badge>
        );
      default:
        return <Badge variant="secondary">Sconosciuto</Badge>;
    }
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
          <h2 className="text-2xl font-semibold">Gestione Cerimonie</h2>
          <p className="text-sm text-muted-foreground">
            {ceremonies.length} cerimonie totali, {filteredCeremonies.length} visualizzate
          </p>
        </div>
        <Button
          onClick={() => navigate('/admin/ceremonies/new')}
          className="bg-saffron-600 hover:bg-saffron-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuova Cerimonia
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca cerimonie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="published">Pubblicati</SelectItem>
                <SelectItem value="draft">Bozze</SelectItem>
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
                <TableHead>Titolo</TableHead>
                <TableHead>Frequenza</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCeremonies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nessuna cerimonia trovata
                  </TableCell>
                </TableRow>
              ) : (
                filteredCeremonies.map((ceremony) => (
                  <TableRow key={ceremony.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ceremony.title}</div>
                        {ceremony.featured && (
                          <Badge className="mt-1 bg-saffron-500 text-white text-xs">
                            In Evidenza
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{ceremony.schedule || '-'}</TableCell>
                    <TableCell>{ceremony.type || '-'}</TableCell>
                    <TableCell>{getStatusBadge(ceremony.status || 'draft')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/ceremonies/${ceremony.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCeremony(ceremony);
                              setShowDeleteModal(true);
                            }}
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

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
          </DialogHeader>
          <p>Sei sicuro di voler eliminare questa cerimonia? L'azione è irreversibile.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteCeremony.isPending}
              variant="destructive"
            >
              {deleteCeremony.isPending ? (
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

export default CeremoniesManager;
