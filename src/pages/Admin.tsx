import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Lock, LogOut, Database, Users, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { testSupabaseConnection } from '@/lib/supabase-utils';

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

          {/* Connection Test */}
          <Card className="mb-8 border-zen-sage">
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

          {/* Admin Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-zen-sage hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-8 w-8 text-saffron-600 mr-3" />
                  <div>
                    <h3 className="font-semibold">Gestione Contenuti</h3>
                    <p className="text-sm text-muted-foreground">Blog, insegnamenti, eventi</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Gestisci Contenuti
                </Button>
              </CardContent>
            </Card>

            <Card className="border-zen-sage hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-saffron-600 mr-3" />
                  <div>
                    <h3 className="font-semibold">Gestione Utenti</h3>
                    <p className="text-sm text-muted-foreground">Amministratori e moderatori</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Gestisci Utenti
                </Button>
              </CardContent>
            </Card>

            <Card className="border-zen-sage hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Settings className="h-8 w-8 text-saffron-600 mr-3" />
                  <div>
                    <h3 className="font-semibold">Impostazioni</h3>
                    <p className="text-sm text-muted-foreground">Configurazione sistema</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Impostazioni
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <Card className="mt-8 border-saffron-200 bg-saffron-50">
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
                  <p><strong>Versione:</strong> 1.0.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  required
                  placeholder="admin@bodhidharma.info"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-saffron-500 hover:bg-saffron-600 text-white"
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
            
            <div className="mt-6 p-4 bg-saffron-50 rounded-lg border border-saffron-200">
              <p className="text-sm text-saffron-700 text-center">
                <strong>Nota:</strong> Per accedere all'area amministrativa, 
                è necessario essere registrati come amministratori nel sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
