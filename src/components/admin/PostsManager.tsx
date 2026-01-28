import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  Search, 
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles?: {
    full_name: string | null;
  } | null;
  image_url?: string | null;
  image_alt?: string | null;
};


const PostsManager = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string>('newest');
  
  // Modal states (solo per delete)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err) {
      console.error('❌ Errore caricamento posts:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento articoli');
    } finally {
      setLoading(false);
    }
  };


  // Delete post
  const handleDelete = async () => {
    try {
      if (!selectedPost) return;

      setSubmitting(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', selectedPost.id);

      if (deleteError) throw deleteError;

      await fetchPosts();
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (err) {
      console.error('❌ Errore eliminazione post:', err);
      setError(err instanceof Error ? err.message : 'Errore eliminazione articolo');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (post: Post) => {
    navigate(`/admin/posts/${post.id}/edit`);
  };

  const openDeleteModal = (post: Post) => {
    setSelectedPost(post);
    setError(null);
    setShowDeleteModal(true);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || '').getTime();
    const dateB = new Date(b.published_at || b.created_at || '').getTime();
    
    switch (selectedOrder) {
      case 'newest':
        return dateB - dateA; // Dal più nuovo al più vecchio
      case 'oldest':
        return dateA - dateB; // Dal più vecchio al più nuovo
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '');
      default:
        return dateB - dateA;
    }
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non pubblicato';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white">Pubblicato</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Bozza</Badge>;
      default:
        return <Badge variant="secondary">Sconosciuto</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
            <FileText className="h-6 w-6 text-saffron-600" />
            Gestione Articoli
          </h2>
          <p className="text-sm text-gray-600">
            {posts.length} articoli totali, {filteredPosts.length} visualizzati
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/admin/posts/new')}
          className="bg-saffron-600 hover:bg-saffron-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuovo Articolo
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cerca articoli..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtra per stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="published">Pubblicati</SelectItem>
                <SelectItem value="draft">Bozze</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ordina per" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Dal più recente</SelectItem>
                <SelectItem value="oldest">Dal più vecchio</SelectItem>
                <SelectItem value="title-asc">Titolo A-Z</SelectItem>
                <SelectItem value="title-desc">Titolo Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Titolo</TableHead>
                  <TableHead className="font-semibold">Stato</TableHead>
                  <TableHead className="font-semibold">Autore</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="w-[100px] font-semibold">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchTerm || selectedStatus !== 'all' 
                        ? 'Nessun articolo trovato con i filtri attuali' 
                        : 'Nessun articolo presente. Creane uno nuovo!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {post.excerpt || `${post.content?.substring(0, 100)}...`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(post.status || 'draft')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {post.profiles?.full_name || 'Comunità Bodhidharma'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizza
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openEditModal(post)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifica
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openDeleteModal(post)}
                              className="text-red-600 cursor-pointer"
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
          </div>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal} modal={true}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Conferma Eliminazione
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-700">
              Sei sicuro di voler eliminare l'articolo <strong>"{selectedPost?.title}"</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Questa azione non può essere annullata.
            </p>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
              disabled={submitting}
            >
              Annulla
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={submitting}
            >
              {submitting ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {submitting ? 'Eliminazione...' : 'Elimina'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsManager;