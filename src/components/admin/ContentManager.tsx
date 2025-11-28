import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Edit, 
  Save, 
  X, 
  FileText, 
  Search,
  RefreshCw,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PageContent {
  id: string;
  page_name: string;
  section_key: string;
  section_title: string | null;
  content_type: string;
  content: string;
  editor_instructions: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ContentManager = () => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [editedContent, setEditedContent] = useState('');
  
  // Form per nuovo contenuto
  const [newContent, setNewContent] = useState({
    page_name: 'chi-siamo',
    section_key: '',
    section_title: '',
    content_type: 'text',
    content: '',
    editor_instructions: '',
    display_order: 0
  });

  // Pagine disponibili
  const availablePages = ['chi-siamo', 'home', 'insegnamenti', 'eventi', 'dona', 'contatti'];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usa una query generica per bypassare i problemi di tipo
      const { data, error: fetchError } = await supabase
        .from('page_contents' as any)
        .select('*')
        .order('page_name', { ascending: true })
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      // Map data to ensure correct types
      const mappedData: PageContent[] = (data || []).map((item: any) => ({
        id: item.id,
        page_name: item.page_name,
        section_key: item.section_key,
        section_title: item.section_title,
        content_type: item.content_type || 'text',
        content: item.content,
        editor_instructions: item.editor_instructions,
        display_order: item.display_order || 0,
        is_active: item.is_active ?? true,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setContents(mappedData);
    } catch (err) {
      console.error('❌ Errore caricamento contenuti:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento contenuti - La tabella potrebbe non esistere ancora');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: PageContent) => {
    setSelectedContent(content);
    setEditedContent(content.content);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!selectedContent) return;

    try {
      setSubmitting(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('page_contents' as any)
        .update({ 
          content: editedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedContent.id);

      if (updateError) throw updateError;

      // Aggiorna lo stato locale
      setContents(prev => prev.map(c => 
        c.id === selectedContent.id 
          ? { ...c, content: editedContent, updated_at: new Date().toISOString() }
          : c
      ));

      setShowEditModal(false);
      setSelectedContent(null);
      setEditedContent('');
    } catch (err) {
      console.error('❌ Errore salvataggio:', err);
      setError(err instanceof Error ? err.message : 'Errore salvataggio contenuto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!newContent.section_key.trim() || !newContent.content.trim()) {
        setError('Chiave sezione e contenuto sono obbligatori');
        return;
      }

      const { error: createError } = await supabase
        .from('page_contents' as any)
        .insert({
          ...newContent,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (createError) throw createError;

      await fetchContents();
      setShowCreateModal(false);
      setNewContent({
        page_name: 'chi-siamo',
        section_key: '',
        section_title: '',
        content_type: 'text',
        content: '',
        editor_instructions: '',
        display_order: 0
      });
    } catch (err) {
      console.error('❌ Errore creazione:', err);
      setError(err instanceof Error ? err.message : 'Errore creazione contenuto');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtra contenuti
  const filteredContents = contents.filter(content => {
    const matchesSearch = 
      content.section_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.section_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPage = selectedPage === 'all' || content.page_name === selectedPage;
    
    return matchesSearch && matchesPage;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'html':
        return '🔧';
      case 'markdown':
        return '📝';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
          <p>Caricamento contenuti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🎯 STEP 4: Gestione Contenuti Pagine</h2>
          <p className="text-muted-foreground">
            Sistema CMS per modificare i testi delle pagine del sito
          </p>
        </div>
        <Button onClick={fetchContents} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Ricarica
        </Button>
      </div>

      {/* Info */}
      {contents.length === 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            📋 Il sistema CMS non è ancora configurato. Sarà necessario creare prima la tabella `page_contents` nel database per utilizzare questa funzionalità.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtri */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                Cerca contenuti
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cerca per titolo, chiave o contenuto..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Label htmlFor="page-filter" className="text-sm font-medium mb-2 block">
                Filtra per pagina
              </Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le pagine</SelectItem>
                  {availablePages.map(page => (
                    <SelectItem key={page} value={page}>
                      {page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-saffron-600">{filteredContents.length}</div>
              <div className="text-sm text-muted-foreground">Contenuti trovati</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(filteredContents.map(c => c.page_name)).size}
              </div>
              <div className="text-sm text-muted-foreground">Pagine</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredContents.filter(c => c.content_type === 'html').length}
              </div>
              <div className="text-sm text-muted-foreground">Contenuti HTML</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredContents.filter(c => c.content_type === 'text').length}
              </div>
              <div className="text-sm text-muted-foreground">Contenuti Testo</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabella contenuti */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-saffron-600" />
            Contenuti ({filteredContents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pagina</TableHead>
                  <TableHead>Sezione</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contenuto</TableHead>
                  <TableHead>Aggiornato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {content.page_name.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{content.section_title || content.section_key}</div>
                        <div className="text-sm text-gray-500">{content.section_key}</div>
                        {content.editor_instructions && (
                          <div className="text-xs text-blue-600 mt-1">
                            💡 {content.editor_instructions}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getContentTypeIcon(content.content_type)}</span>
                        <span className="text-sm">{content.content_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm line-clamp-2">
                          {content.content.length > 100 
                            ? `${content.content.substring(0, 100)}...` 
                            : content.content
                          }
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {content.content.length} caratteri
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(content.updated_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(content)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifica
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContents.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nessun contenuto trovato</p>
              <p className="text-sm text-gray-500">
                {contents.length === 0 ? 'La tabella page_contents deve essere creata nel database per utilizzare questo sistema.' : 'Modifica i filtri di ricerca per vedere altri risultati'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal di modifica */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Edit className="h-5 w-5 text-saffron-600" />
              Modifica Contenuto
            </DialogTitle>
          </DialogHeader>
          
          {selectedContent && (
            <div className="grid gap-4 py-4">
              {/* Info sezione */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Pagina:</span> {selectedContent.page_name}
                  </div>
                  <div>
                    <span className="font-medium">Tipo:</span> {selectedContent.content_type}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Sezione:</span> {selectedContent.section_title || selectedContent.section_key}
                  </div>
                  {selectedContent.editor_instructions && (
                    <div className="col-span-2 text-blue-600">
                      <span className="font-medium">💡 Istruzioni:</span> {selectedContent.editor_instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Editor contenuto */}
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Contenuto
                </Label>
                <Textarea
                  id="content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={selectedContent.content_type === 'html' ? 15 : 8}
                  className={`text-sm ${selectedContent.content_type === 'html' ? 'font-mono' : ''}`}
                  placeholder="Inserisci il contenuto..."
                />
                <div className="text-xs text-gray-500">
                  {editedContent.length} caratteri
                  {selectedContent.content_type === 'html' && (
                    <span className="ml-2">• Supporta HTML</span>
                  )}
                </div>
              </div>

              {/* Anteprima */}
              {selectedContent.content_type === 'html' && editedContent && (
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Anteprima</Label>
                  <div 
                    className="border rounded-lg p-4 bg-white"
                    dangerouslySetInnerHTML={{ __html: editedContent }}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              disabled={submitting}
            >
              <X className="h-4 w-4 mr-2" />
              Annulla
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-saffron-600 hover:bg-saffron-700"
              disabled={submitting || !editedContent.trim()}
            >
              {submitting ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {submitting ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal di creazione */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-saffron-600" />
              Nuovo Contenuto
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Pagina</Label>
                <Select value={newContent.page_name} onValueChange={(value) => setNewContent(prev => ({ ...prev, page_name: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map(page => (
                      <SelectItem key={page} value={page}>
                        {page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Tipo Contenuto</Label>
                <Select value={newContent.content_type} onValueChange={(value) => setNewContent(prev => ({ ...prev, content_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Testo</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Chiave Sezione *</Label>
              <Input
                value={newContent.section_key}
                onChange={(e) => setNewContent(prev => ({ ...prev, section_key: e.target.value }))}
                placeholder="es: header-title, maestri-biografia"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Titolo Sezione</Label>
              <Input
                value={newContent.section_title}
                onChange={(e) => setNewContent(prev => ({ ...prev, section_title: e.target.value }))}
                placeholder="Nome visualizzato nell'admin"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Contenuto *</Label>
              <Textarea
                value={newContent.content}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                placeholder="Inserisci il contenuto..."
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Istruzioni per l'Editor</Label>
              <Input
                value={newContent.editor_instructions}
                onChange={(e) => setNewContent(prev => ({ ...prev, editor_instructions: e.target.value }))}
                placeholder="Istruzioni per chi modifica questo contenuto"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Ordine di Visualizzazione</Label>
              <Input
                type="number"
                value={newContent.display_order}
                onChange={(e) => setNewContent(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
              disabled={submitting}
            >
              <X className="h-4 w-4 mr-2" />
              Annulla
            </Button>
            <Button 
              onClick={handleCreate} 
              className="bg-saffron-600 hover:bg-saffron-700"
              disabled={submitting || !newContent.section_key.trim() || !newContent.content.trim()}
            >
              {submitting ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {submitting ? 'Creazione...' : 'Crea Contenuto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManager; 