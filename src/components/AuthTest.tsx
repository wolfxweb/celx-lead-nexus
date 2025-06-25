import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, User, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BASEROW_CONFIG } from '@/lib/baserow';

const AuthTest: React.FC = () => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginForm);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(registerForm);
  };

  const handleLogout = () => {
    logout();
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Teste de Autenticação Baserow
          </CardTitle>
          <CardDescription>
            Teste o sistema de login e registro com o Baserow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">URL Base</Label>
              <p className="text-sm text-gray-600">{BASEROW_CONFIG.BASE_URL}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Database ID</Label>
              <p className="text-sm text-gray-600">{BASEROW_CONFIG.DATABASE_ID || 'Não configurado'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? 'Logado' : 'Deslogado'}
              </Badge>
            </div>
          </div>

          {/* Status do Usuário */}
          {isAuthenticated && user && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">Usuário Logado:</h4>
                <div className="space-y-1">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Nome:</span> {user.name}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Role:</span> {(() => {
                      if (!user?.role) return 'user';
                      if (typeof user.role === 'object' && user.role !== null) {
                        return (user.role as any).value || (user.role as any).id || 'user';
                      }
                      return user.role as string;
                    })()}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Avatar:</span> {user.avatar}
                  </p>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm" className="mt-2">
                  Sair
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Erro */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">Erro:</h4>
                <p className="text-sm text-red-600">{error}</p>
                <Button onClick={clearError} variant="outline" size="sm" className="mt-2">
                  Limpar Erro
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Formulário de Login */}
          {!isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        'Entrar'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Formulário de Registro */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Registro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Nome</Label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        'Registrar'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Informações de Teste */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Informações de Teste:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>• Para testar o login, você precisa ter um usuário criado no Baserow</p>
                <p>• O registro criará um novo usuário na tabela de usuários</p>
                <p>• Usuários novos sempre começam com role 'user'</p>
                <p>• Verifique se a tabela de usuários está configurada corretamente</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest; 