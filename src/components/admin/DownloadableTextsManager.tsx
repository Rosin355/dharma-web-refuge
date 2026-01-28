import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useDownloadableTexts } from '@/hooks/useDownloadableTexts';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type DownloadableText = Database['public']['Tables']['downloadable_texts']['Row'];

const DownloadableTextsManager = () => {
  const navigate = useNavigate();
  const { texts, isLoading, deleteText } = useDownloadableTexts({ published: undefined });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedText, setSelectedText] = useState<DownloadableText | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredTexts = texts.filter((text) => {
    const matchesSearch = text.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      text.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'published' && text.published) ||
      (selectedStatus === 'draft' && !text.published);
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    navigate('/admin/downloadable-texts/new');
  };

  const handleEdit = (text: DownloadableText) => {
    navigate(`/admin/downloadable-texts/${text.id}/edit`);
  };

  const handleDelete = (text: DownloadableText) => {
    setSelectedText(text);
    setShowDeleteModal(true);
  };


  const handleDeleteConfirm = async () => {
    if (!selectedText) return;
    try {
      setSubmitting(true);
      await deleteText.mutateAsync(selectedText.id);
      toast({
        title: 'Successo',
        description: 'Testo scaricabile eliminato con successo',
      });
      setShowDeleteModal(false);
      setSelectedText(null);
    } catch (err) {
      console.error('❌ Errore eliminazione:', err);
      toast({
        title: 'Errore',
        description: err instanceof Error ? err.message : 'Errore durante l\'eliminazione',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
          <h2 className="text-2xl font-semibold">Gestione Testi Scaricabili</h2>
          <p className="text-sm text-muted-foreground">
            {texts.length} testi totali, {filteredTexts.length} visualizzati
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-saffron-600 hover:bg-saffron-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuovo Testo
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca testi..."
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
                <TableHead>Slug</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Lingua</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTexts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nessun testo trovato
                  </TableCell>
                </TableRow>
              ) : (
                filteredTexts.map((text) => (
                  <TableRow key={text.id}>
                    <TableCell className="font-medium">{text.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{text.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{text.file_format?.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{text.language || 'it'}</TableCell>
                    <TableCell>
                      {text.published ? (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Pubblicato
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          <XCircle className="h-3 w-3 mr-1" />
                          Bozza
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(text)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(text)}
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
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal} modal={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
          </DialogHeader>
          <p>Sei sicuro di voler eliminare "{selectedText?.title}"? L'azione è irreversibile.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={submitting}
              variant="destructive"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Elimina'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DownloadableTextsManager;
