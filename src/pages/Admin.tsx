
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Lock } from 'lucide-react';

const Admin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementare autenticazione con Supabase
    console.log('Login attempt:', credentials);
  };

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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome Utente</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
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
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-600 text-white">
                <Lock className="mr-2 h-4 w-4" />
                Accedi
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-saffron-50 rounded-lg border border-saffron-200">
              <p className="text-sm text-saffron-700 text-center">
                <strong>Nota:</strong> Per implementare il sistema completo di autenticazione e CMS, 
                è necessario connettere il progetto a Supabase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
