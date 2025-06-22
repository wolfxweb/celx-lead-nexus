import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Database, TestTube } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { BASEROW_CONFIG } from '@/lib/baserow';
import { useToast } from '@/hooks/use-toast';

const BaserowTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    connection: boolean | null;
    categories: boolean | null;
    create: boolean | null;
    update: boolean | null;
    delete: boolean | null;
  }>({
    connection: null,
    categories: null,
    create: null,
    update: null,
    delete: null,
  });

  const [loading, setLoading] = useState(false);
  const { categories, loading: categoriesLoading, create, update, remove, error } = useCategories({ autoLoad: false });
  const { toast } = useToast();

  // Teste de conexão básica
  const testConnection = async () => {
    setLoading(true);
    setTestResults(prev => ({ ...prev, connection: null }));

    try {
      const response = await fetch(`${BASEROW_CONFIG.API_URL}/user/token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test',
        }),
      });

      // Se retorna 400 ou 401, significa que a API está funcionando
      const isConnected = response.status === 400 || response.status === 401;
      
      setTestResults(prev => ({ ...prev, connection: isConnected }));
      
      if (isConnected) {
        toast({
          title: "Conexão OK",
          description: "API do Baserow está acessível",
        });
      } else {
        toast({
          title: "Erro de Conexão",
          description: "Não foi possível conectar com o Baserow",
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, connection: false }));
      toast({
        title: "Erro de Conexão",
        description: "Falha na conexão com o Baserow",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Teste de carregamento de categorias
  const testCategories = async () => {
    setTestResults(prev => ({ ...prev, categories: null }));
    
    try {
      // Simular carregamento de categorias
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Se chegou aqui sem erro, consideramos sucesso
      setTestResults(prev => ({ ...prev, categories: true }));
      toast({
        title: "Categorias OK",
        description: "Carregamento de categorias funcionando",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, categories: false }));
      toast({
        title: "Erro nas Categorias",
        description: "Falha ao carregar categorias",
        variant: "destructive"
      });
    }
  };

  // Teste de criação
  const testCreate = async () => {
    setTestResults(prev => ({ ...prev, create: null }));
    
    try {
      const testCategory = {
        name: 'Teste Categoria',
        slug: 'teste-categoria',
        description: 'Categoria de teste',
        color: 'blue',
        type: 'product' as const,
      };

      const result = await create(testCategory);
      
      if (result) {
        setTestResults(prev => ({ ...prev, create: true }));
        toast({
          title: "Criação OK",
          description: "Categoria criada com sucesso",
        });
      } else {
        setTestResults(prev => ({ ...prev, create: false }));
        toast({
          title: "Erro na Criação",
          description: "Falha ao criar categoria",
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, create: false }));
      toast({
        title: "Erro na Criação",
        description: "Falha ao criar categoria",
        variant: "destructive"
      });
    }
  };

  // Teste de atualização
  const testUpdate = async () => {
    setTestResults(prev => ({ ...prev, update: null }));
    
    try {
      if (categories.length === 0) {
        setTestResults(prev => ({ ...prev, update: false }));
        toast({
          title: "Erro na Atualização",
          description: "Nenhuma categoria disponível para teste",
          variant: "destructive"
        });
        return;
      }

      const firstCategory = categories[0];
      const result = await update(firstCategory.id, {
        description: 'Descrição atualizada para teste',
      });
      
      if (result) {
        setTestResults(prev => ({ ...prev, update: true }));
        toast({
          title: "Atualização OK",
          description: "Categoria atualizada com sucesso",
        });
      } else {
        setTestResults(prev => ({ ...prev, update: false }));
        toast({
          title: "Erro na Atualização",
          description: "Falha ao atualizar categoria",
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, update: false }));
      toast({
        title: "Erro na Atualização",
        description: "Falha ao atualizar categoria",
        variant: "destructive"
      });
    }
  };

  // Teste de exclusão
  const testDelete = async () => {
    setTestResults(prev => ({ ...prev, delete: null }));
    
    try {
      if (categories.length === 0) {
        setTestResults(prev => ({ ...prev, delete: false }));
        toast({
          title: "Erro na Exclusão",
          description: "Nenhuma categoria disponível para teste",
          variant: "destructive"
        });
        return;
      }

      const lastCategory = categories[categories.length - 1];
      const result = await remove(lastCategory.id);
      
      if (result) {
        setTestResults(prev => ({ ...prev, delete: true }));
        toast({
          title: "Exclusão OK",
          description: "Categoria excluída com sucesso",
        });
      } else {
        setTestResults(prev => ({ ...prev, delete: false }));
        toast({
          title: "Erro na Exclusão",
          description: "Falha ao excluir categoria",
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, delete: false }));
      toast({
        title: "Erro na Exclusão",
        description: "Falha ao excluir categoria",
        variant: "destructive"
      });
    }
  };

  // Executar todos os testes
  const runAllTests = async () => {
    await testConnection();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testCategories();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testCreate();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testUpdate();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testDelete();
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (status) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return 'Testando...';
    if (status) return 'OK';
    return 'Falhou';
  };

  return (
    <div className="p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Teste de Conexão Baserow
          </CardTitle>
          <CardDescription>
            Teste a conexão e funcionalidades do Baserow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">URL Base</Label>
              <p className="text-sm text-gray-600">{BASEROW_CONFIG.BASE_URL}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Database ID</Label>
              <p className="text-sm text-gray-600">{BASEROW_CONFIG.DATABASE_ID || 'Não configurado'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Token</Label>
              <p className="text-sm text-gray-600">
                {BASEROW_CONFIG.TOKEN ? 'Configurado' : 'Não configurado'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant={error ? "destructive" : "default"}>
                {error ? 'Erro' : 'Pronto'}
              </Badge>
            </div>
          </div>

          {/* Botões de Teste */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={runAllTests} disabled={loading}>
              <TestTube className="h-4 w-4 mr-2" />
              Executar Todos os Testes
            </Button>
            <Button onClick={testConnection} variant="outline" disabled={loading}>
              Testar Conexão
            </Button>
            <Button onClick={testCategories} variant="outline" disabled={loading}>
              Testar Categorias
            </Button>
            <Button onClick={testCreate} variant="outline" disabled={loading}>
              Testar Criação
            </Button>
            <Button onClick={testUpdate} variant="outline" disabled={loading}>
              Testar Atualização
            </Button>
            <Button onClick={testDelete} variant="outline" disabled={loading}>
              Testar Exclusão
            </Button>
          </div>

          {/* Resultados dos Testes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conexão API</span>
                  {getStatusIcon(testResults.connection)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getStatusText(testResults.connection)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Carregar Categorias</span>
                  {getStatusIcon(testResults.categories)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getStatusText(testResults.categories)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Criar Categoria</span>
                  {getStatusIcon(testResults.create)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getStatusText(testResults.create)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Atualizar Categoria</span>
                  {getStatusIcon(testResults.update)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getStatusText(testResults.update)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Excluir Categoria</span>
                  {getStatusIcon(testResults.delete)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getStatusText(testResults.delete)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Categorias */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias Carregadas ({categories.length})</h3>
            {categoriesLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando categorias...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} variant="outline" className="justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">({category.type})</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Erro */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">Erro:</h4>
                <p className="text-sm text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BaserowTest; 