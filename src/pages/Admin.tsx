import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Lock, LogOut, Database, Users, FileText, Image, BarChart3, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { testSupabaseConnection } from '@/lib/supabase-utils';
import PostsManager from '@/components/admin/PostsManager';
import ImageManager from '@/components/admin/ImageManager';
import ContentManager from '@/components/admin/ContentManager';
import EventsManager from '@/components/admin/EventsManager';
import CeremoniesManager from '@/components/admin/CeremoniesManager';

const Admin = () => {
  const { user, loading, error, signIn, signOut, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [connectionTest, setConnectionTest] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const result = await signIn(credentials.email, credentials.password);
    
    if (result.success) {
      // Reset form
      setCredentials({ email: '', password: '' });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleTestConnection = async () => {
    const result = await testSupabaseConnection();
    setConnectionTest(result);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Admin Dashboard (utente autenticato)
  if (user) {
    return (
      <div className="min-h-screen bg-zen-cream">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-serif text-3xl font-light mb-2">
                Area <span className="text-saffron-600">Amministrazione</span>
              </h1>
              <p className="text-muted-foreground">
                Benvenuto, {user.email}
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-saffron-200 text-saffron-600 hover:bg-saffron-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-none lg:flex">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Articoli
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Eventi
              </TabsTrigger>
              <TabsTrigger value="ceremonies" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Cerimonie
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                CMS
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Immagini
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Impostazioni
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Connection Test */}
              <Card className="border-zen-sage">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Test Connessione Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Verifica la connessione al database Supabase
                      </p>
                      {connectionTest && (
                        <Alert className={connectionTest.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                          <AlertDescription className={connectionTest.success ? 'text-green-800' : 'text-red-800'}>
                            {connectionTest.success ? '✅ Connessione riuscita!' : `❌ Errore: ${connectionTest.error}`}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <Button onClick={handleTestConnection} variant="outline">
                      Test Connessione
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-zen-sage hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <FileText className="h-8 w-8 text-saffron-600 mr-3" />
                      <div>
                        <h3 className="font-semibold">Gestione Articoli</h3>
                        <p className="text-sm text-muted-foreground">CRUD completo per blog</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Crea, modifica ed elimina articoli del blog con interfaccia intuitiva
                    </p>
                    <Button 
                      className="w-full bg-saffron-600 hover:bg-saffron-700" 
                      onClick={() => {
                        const tabTrigger = document.querySelector('[value="posts"]') as HTMLElement;
                        tabTrigger?.click();
                      }}
                    >
                      Gestisci Articoli
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-zen-sage hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Image className="h-8 w-8 text-saffron-600 mr-3" />
                      <div>
                        <h3 className="font-semibold">Gestione Immagini</h3>
                        <p className="text-sm text-muted-foreground">Unsplash automatico</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Assegna automaticamente immagini pertinenti agli articoli tramite Unsplash
                    </p>
                    <Button 
                      className="w-full bg-saffron-600 hover:bg-saffron-700"
                      onClick={() => {
                        const tabTrigger = document.querySelector('[value="images"]') as HTMLElement;
                        tabTrigger?.click();
                      }}
                    >
                      Gestisci Immagini
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-zen-sage hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Users className="h-8 w-8 text-saffron-600 mr-3" />
                      <div>
                        <h3 className="font-semibold">Statistiche</h3>
                        <p className="text-sm text-muted-foreground">Analytics del sito</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Visualizza statistiche di utilizzo e performance del sito web
                    </p>
                    <Button className="w-full" variant="outline" disabled>
                      Prossimamente
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Info Panel */}
              <Card className="border-saffron-200 bg-saffron-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-saffron-800 mb-2">Informazioni Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>User ID:</strong> {user.id}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Ultimo accesso:</strong> {new Date(user.last_sign_in_at || '').toLocaleString('it-IT')}</p>
                    </div>
                    <div>
                      <p><strong>Stato:</strong> <span className="text-green-600">✓ Autenticato</span></p>
                      <p><strong>Ruolo:</strong> Amministratore</p>
                      <p><strong>Versione:</strong> 2.0.0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posts Management Tab */}
            <TabsContent value="posts">
              <PostsManager />
            </TabsContent>

            {/* Events Management Tab */}
            <TabsContent value="events">
              <EventsManager />
            </TabsContent>

            {/* Ceremonies Management Tab */}
            <TabsContent value="ceremonies">
              <CeremoniesManager />
            </TabsContent>

            {/* Content Management Tab */}
            <TabsContent value="content">
              <ContentManager />
            </TabsContent>

            {/* Images Management Tab */}
            <TabsContent value="images">
              <ImageManager />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="border-zen-sage">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Configurazione Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Database</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Configurazione connessione Supabase
                      </p>
                      <Button variant="outline" onClick={handleTestConnection}>
                        <Database className="h-4 w-4 mr-2" />
                        Test Connessione
                      </Button>
                    </div>
                    
                    <hr className="border-gray-200" />
                    
                    <div>
                      <h4 className="font-medium mb-2">Immagini</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Le impostazioni per Unsplash sono gestite nella sezione Immagini
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const tabTrigger = document.querySelector('[value="images"]') as HTMLElement;
                          tabTrigger?.click();
                        }}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Configura Unsplash
                      </Button>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h4 className="font-medium mb-2">Account</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Gestione del tuo account amministratore
                      </p>
                      <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Login Form (utente non autenticato)
  return (
    <div className="min-h-screen bg-zen-cream flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="border-zen-sage shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-saffron-100 rounded-full flex items-center justify-center">
              <Settings className="h-8 w-8 text-saffron-600" />
            </div>
            <CardTitle className="font-serif text-2xl">Area Operatori</CardTitle>
            <p className="text-muted-foreground">Accesso riservato agli amministratori</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@dharma-web-refuge.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-saffron-600 hover:bg-saffron-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Accesso in corso...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Accedi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
