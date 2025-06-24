import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, ExternalLink, Key, Globe } from 'lucide-react';
import { 
  getWhatsAppSettings, 
  createWhatsAppSettings, 
  updateWhatsAppSettings,
  getWhatsAppInstances,
  WhatsAppInstance 
} from '@/services/whatsappService';
import type { WhatsAppSettings } from '@/services/whatsappService';
import { useAuth } from '@/contexts/AuthContext';

const WhatsAppSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    evolution_api_url: 'https://automacao-evolution-api.219u5p.easypanel.host',
    evolution_api_key: '',
    default_instance_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [settingsData, instancesData] = await Promise.all([
        getWhatsAppSettings(Number(user.id)),
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
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      if (settings) {
        // Atualizar configurações existentes
        const updatedSettings = await updateWhatsAppSettings(settings.id, {
          evolution_api_url: formData.evolution_api_url,
          evolution_api_key: formData.evolution_api_key,
          default_instance_id: formData.default_instance_id || undefined
        });
        setSettings(updatedSettings);
      } else {
        // Criar novas configurações
        const newSettings = await createWhatsAppSettings({
          user_id: Number(user.id),
          evolution_api_url: formData.evolution_api_url,
          evolution_api_key: formData.evolution_api_key
        });
        setSettings(newSettings);
      }
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${formData.evolution_api_url}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': formData.evolution_api_key
        }
      });
      
      if (response.ok) {
        toast.success('Conexão com a Evolution API estabelecida com sucesso!');
      } else {
        toast.error('Falha na conexão com a Evolution API');
      }
    } catch (error) {
      toast.error('Erro ao testar conexão');
    }
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
      <div>
        <h1 className="text-3xl font-bold">Configurações WhatsApp</h1>
        <p className="text-gray-600">Configure sua integração com a Evolution API</p>
      </div>

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
              <Input
                id="api_url"
                value={formData.evolution_api_url}
                onChange={(e) => setFormData(prev => ({ ...prev, evolution_api_url: e.target.value }))}
                placeholder="https://sua-evolution-api.com"
              />
            </div>
            <div>
              <Label htmlFor="api_key">Chave da API</Label>
              <Input
                id="api_key"
                type="password"
                value={formData.evolution_api_key}
                onChange={(e) => setFormData(prev => ({ ...prev, evolution_api_key: e.target.value }))}
                placeholder="Sua chave da API"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={testConnection} variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Testar Conexão
              </Button>
              <Button onClick={handleSaveSettings} disabled={saving} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
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
            
            <div className="pt-4">
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

      {/* Status da Configuração */}
      {settings && (
        <Card>
          <CardHeader>
            <CardTitle>Status da Configuração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm text-gray-600">Configuração Salva</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{instances.length}</div>
                <div className="text-sm text-gray-600">Instâncias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formData.default_instance_id ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-600">Instância Padrão</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppSettings; 