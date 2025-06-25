import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, ExternalLink, Key, Globe, CheckCircle, XCircle, AlertCircle, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';
import { 
  getWhatsAppSettings, 
  createWhatsAppSettings, 
  updateWhatsAppSettings,
  getWhatsAppInstances,
  WhatsAppInstance,
  updateWhatsAppInstanceStatus,
  createWhatsAppInstance
} from '@/services/whatsappService';
import type { WhatsAppSettings } from '@/services/whatsappService';
import { useAuth } from '@/contexts/AuthContext';

const WhatsAppSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    message: string;
    instances: number;
    lastTest: Date | null;
  }>({
    connected: false,
    message: 'Não testado',
    instances: 0,
    lastTest: null
  });
  const [formData, setFormData] = useState({
    evolution_api_url: '',
    evolution_api_key: '',
    default_instance_id: ''
  });
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastTested = useRef<{ url: string; key: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  // Testa conexão automaticamente ao montar e ao alterar URL/chave
  useEffect(() => {
    // Só testa se ambos estiverem preenchidos
    if (formData.evolution_api_url && formData.evolution_api_key) {
      // Evita múltiplos testes simultâneos
      if (
        lastTested.current &&
        lastTested.current.url === formData.evolution_api_url &&
        lastTested.current.key === formData.evolution_api_key
      ) {
        return;
      }
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        testConnection();
        lastTested.current = {
          url: formData.evolution_api_url,
          key: formData.evolution_api_key,
        };
      }, 600); // 600ms debounce
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.evolution_api_url, formData.evolution_api_key]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const [settingsData, instancesData] = await Promise.all([
        getWhatsAppSettings(),
        getWhatsAppInstances()
      ]);
      
      setSettings(settingsData);
      setInstances(instancesData);
      
      if (settingsData) {
        setFormData({
          evolution_api_url: settingsData.evolution_api_url,
          evolution_api_key: settingsData.evolution_api_key,
          default_instance_id: settingsData.default_instance_id || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    // Validação dos campos obrigatórios
    if (!formData.evolution_api_url.trim()) {
      toast.error('Por favor, preencha a URL da Evolution API');
      return;
    }

    if (!formData.evolution_api_key.trim()) {
      toast.error('Por favor, preencha a chave da API');
      return;
    }

    // Validação da URL
    try {
      new URL(formData.evolution_api_url);
    } catch (error) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    try {
      setSaving(true);
      
      // SEMPRE criar uma nova linha para evitar problemas de estado
      const newSettings = await createWhatsAppSettings({
        evolution_api_url: formData.evolution_api_url.trim(),
        evolution_api_key: formData.evolution_api_key.trim()
      });
      setSettings(newSettings);
      toast.success('Configurações salvas com sucesso!');
      
    } catch (error) {
      console.error('Erro detalhado ao salvar configurações:', error);
      toast.error(`Erro ao salvar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!formData.evolution_api_url || !formData.evolution_api_key) {
      toast.error('Por favor, configure a URL e chave da API primeiro');
      return;
    }

    try {
      setTesting(true);
      const currentTime = new Date();
      console.log('Testando conexão com:', formData.evolution_api_url);
      
      // Primeiro testa o endpoint raiz
      const statusResponse = await fetch(formData.evolution_api_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': formData.evolution_api_key
        }
      });
      
      if (!statusResponse.ok) {
        setApiStatus({
          connected: false,
          message: `Erro: ${statusResponse.status} ${statusResponse.statusText}`,
          instances: 0,
          lastTest: currentTime
        });
        toast.error(`❌ Falha na conexão: ${statusResponse.status} ${statusResponse.statusText}`, {
          description: `Verificado em ${currentTime.toLocaleTimeString('pt-BR')}`
        });
        return;
      }
      
      const statusData = await statusResponse.json();
      console.log('Status da API:', statusData);
      
      // Depois testa o endpoint de instâncias
      const instancesResponse = await fetch(`${formData.evolution_api_url}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': formData.evolution_api_key
        }
      });
      
      if (instancesResponse.ok) {
        const instancesData = await instancesResponse.json();
        console.log('Instâncias encontradas:', instancesData);
        
        const instanceCount = Array.isArray(instancesData) ? instancesData.length : 0;
        
        setApiStatus({
          connected: true,
          message: `Conectado - ${instanceCount} instância(s) encontrada(s)`,
          instances: instanceCount,
          lastTest: currentTime
        });
        
        toast.success(`✅ Conexão estabelecida!`, {
          description: `${instanceCount} instância(s) encontrada(s) • Verificado em ${currentTime.toLocaleTimeString('pt-BR')}`
        });
        
      } else {
        const errorText = await instancesResponse.text();
        console.error('Erro ao buscar instâncias:', errorText);
        
        setApiStatus({
          connected: false,
          message: `Erro ao buscar instâncias: ${instancesResponse.status}`,
          instances: 0,
          lastTest: currentTime
        });
        
        toast.error(`❌ Erro ao buscar instâncias: ${instancesResponse.status} ${instancesResponse.statusText}`, {
          description: `Verificado em ${currentTime.toLocaleTimeString('pt-BR')}`
        });
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      const currentTime = new Date();
      
      setApiStatus({
        connected: false,
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        instances: 0,
        lastTest: currentTime
      });
      
      toast.error(`❌ Erro na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
        description: `Verificado em ${currentTime.toLocaleTimeString('pt-BR')}`
      });
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const getStatusIcon = () => {
    if (testing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (apiStatus.connected) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (apiStatus.lastTest) return <XCircle className="w-4 h-4 text-red-600" />;
    return <AlertCircle className="w-4 h-4 text-yellow-600" />;
  };

  const getStatusBadge = () => {
    if (testing) return <Badge variant="secondary">Analisando...</Badge>;
    if (apiStatus.connected) return <Badge variant="default" className="bg-green-600">Conectado</Badge>;
    if (apiStatus.lastTest) return <Badge variant="destructive">Erro</Badge>;
    return <Badge variant="outline">Não testado</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações WhatsApp</h1>
          <p className="text-gray-600">Configure sua integração com a Evolution API</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          {getStatusBadge()}
        </div>
      </div>

      {/* Status da Configuração */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Configuração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {settings ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Configuração Salva</div>
              {settings && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(settings.created_at).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{apiStatus.instances}</div>
              <div className="text-sm text-gray-600">Instâncias</div>
              {apiStatus.lastTest && (
                <div className="text-xs text-gray-500 mt-1">
                  {apiStatus.lastTest.toLocaleTimeString('pt-BR')}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formData.default_instance_id ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Instância Padrão</div>
              {formData.default_instance_id && (
                <div className="text-xs text-gray-500 mt-1">
                  {instances.find(i => i.id === formData.default_instance_id)?.name || 'Selecionada'}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${apiStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                {apiStatus.connected ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">API Conectada</div>
              {apiStatus.lastTest && (
                <div className="text-xs text-gray-500 mt-1">
                  {apiStatus.message}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configurações da API */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Configurações da API
            </CardTitle>
            <CardDescription>
              Configure a URL e chave da API da Evolution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api_url">URL da Evolution API</Label>
              <div className="flex space-x-2">
                <Input
                  id="api_url"
                  value={formData.evolution_api_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, evolution_api_url: e.target.value }))}
                  placeholder="https://sua-evolution-api.com (ex: https://api.evolution.com)"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formData.evolution_api_url)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="api_key">Chave da API</Label>
              <div className="flex space-x-2">
                <Input
                  id="api_key"
                  type={showApiKey ? "text" : "password"}
                  value={formData.evolution_api_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, evolution_api_key: e.target.value }))}
                  placeholder="Sua chave da API"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formData.evolution_api_key)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={testConnection} 
                variant="outline" 
                className="flex-1"
                disabled={testing}
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Testar Conexão
                  </>
                )}
              </Button>
              <Button onClick={handleSaveSettings} disabled={saving} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button 
                onClick={loadData} 
                variant="outline" 
                size="sm"
                title="Recarregar configurações"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Configure as opções padrão do WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default_instance">Instância Padrão</Label>
              <Select 
                value={formData.default_instance_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, default_instance_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma instância padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma instância padrão</SelectItem>
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id}>
                      {instance.name} ({instance.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Informações da API</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>URL Atual:</strong> {formData.evolution_api_url}</p>
                <p><strong>Status:</strong> {formData.evolution_api_key ? 'Configurada' : 'Não configurada'}</p>
                {settings && (
                  <p><strong>Última atualização:</strong> {new Date(settings.updated_at).toLocaleString()}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instâncias Encontradas */}
      {instances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Instâncias Encontradas</CardTitle>
            <CardDescription>
              Instâncias disponíveis na sua Evolution API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {instances.map((instance) => (
                <div key={instance.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{instance.name}</h4>
                    <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                      {instance.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{instance.phone}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {instance.id}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentação */}
      <Card>
        <CardHeader>
          <CardTitle>Documentação da Evolution API</CardTitle>
          <CardDescription>
            Links úteis para configurar e usar a Evolution API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Recursos Úteis</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <a href="https://doc.evolution-api.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Documentação Oficial</a></li>
                <li>• <a href="https://github.com/EvolutionAPI/evolution-api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Repositório GitHub</a></li>
                <li>• <a href="https://doc.evolution-api.com/docs/instances/instance" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Gerenciar Instâncias</a></li>
                <li>• <a href="https://doc.evolution-api.com/docs/chat/sendText" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Enviar Mensagens</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Endpoints Principais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code className="bg-gray-100 px-1 rounded">GET /instance/fetchInstances</code></li>
                <li>• <code className="bg-gray-100 px-1 rounded">POST /instance/create</code></li>
                <li>• <code className="bg-gray-100 px-1 rounded">POST /instance/connect/{'{instance}'}</code></li>
                <li>• <code className="bg-gray-100 px-1 rounded">POST /chat/sendText/{'{instance}'}</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSettings; 