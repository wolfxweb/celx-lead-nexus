import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Trash2, QrCode, Wifi, WifiOff, AlertCircle, RefreshCw, Download, Upload, Settings } from 'lucide-react';
import { 
  getWhatsAppInstances, 
  getAllWhatsAppInstances,
  createWhatsAppInstance, 
  deleteWhatsAppInstance, 
  deleteWhatsAppInstanceAsAdmin,
  connectWhatsAppInstance,
  getWhatsAppSettings,
  updateWhatsAppInstanceStatus,
  updateWhatsAppInstanceStatusAsAdmin,
  WhatsAppInstance,
  getEvolutionAPIInstances,
  connectEvolutionAPIInstance,
  testEvolutionAPIConnectivity,
  discoverEvolutionAPIEndpoints,
  connectCarlosInstance,
  fetchQRCodeForInstance
} from '@/services/whatsappService';
import { useAuth } from '@/contexts/AuthContext';

const WhatsAppInstances: React.FC = () => {
  const { user } = useAuth();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [instanceToDelete, setInstanceToDelete] = useState<WhatsAppInstance | null>(null);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [newInstance, setNewInstance] = useState({
    name: '',
    phone: ''
  });
  const [connectingInstance, setConnectingInstance] = useState<string | null>(null);
  const [deletingInstance, setDeletingInstance] = useState<string | null>(null);
  const [creatingInstance, setCreatingInstance] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [apiSettings, setApiSettings] = useState<{ evolution_api_url: string; evolution_api_key: string } | null>(null);
  const [isInstanceSelectionOpen, setIsInstanceSelectionOpen] = useState(false);
  const [evolutionInstances, setEvolutionInstances] = useState<any[]>([]);
  const [selectedEvolutionInstance, setSelectedEvolutionInstance] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Verificar status da conexão quando QR code é mostrado
  useEffect(() => {
    if (qrCode && connectingInstance) {
      setCheckingConnection(true);
      
      const checkConnectionStatus = async () => {
        try {
          // Buscar status atual da instância
          const response = await fetch(`${apiSettings?.evolution_api_url}/instance/fetchInstances`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': apiSettings?.evolution_api_key || ''
            }
          });

          if (response.ok) {
            const evolutionInstances = await response.json();
            const currentInstance = evolutionInstances.find((evInstance: any) => 
              evInstance.id === connectingInstance || evInstance.instanceName === instances.find(i => i.id === connectingInstance)?.name
            );
            
            if (currentInstance) {
              const newStatus = currentInstance.connectionStatus === 'open' ? 'connected' : 
                               currentInstance.connectionStatus === 'close' ? 'disconnected' : 
                               currentInstance.connectionStatus || 'connecting';
              
              // Atualizar status da instância
              setInstances(prev => prev.map(instance => 
                instance.id === connectingInstance 
                  ? { ...instance, status: newStatus as any }
                  : instance
              ));
              
              // Se conectou, fechar modal e mostrar sucesso
              if (newStatus === 'connected') {
                setQrCode(null);
                setConnectingInstance(null);
                setCheckingConnection(false);
                toast.success('WhatsApp conectado com sucesso!');
              }
            }
          }
        } catch (error) {
          console.error('Erro ao verificar status da conexão:', error);
        }
      };

      // Verificar a cada 3 segundos
      const interval = setInterval(checkConnectionStatus, 3000);
      
      return () => {
        clearInterval(interval);
        setCheckingConnection(false);
      };
    }
  }, [qrCode, connectingInstance, apiSettings, instances]);

  // Adicionar useEffect para buscar QR code automaticamente quando houver instância em 'connecting'
  useEffect(() => {
    const connecting = instances.find((i) => i.status === 'connecting');
    if (connecting && connecting.name) {
      // Só busca se não estiver já mostrando o QR code
      if (!qrCode) {
        fetchQRCodeForInstance(connecting.name)
          .then((result) => {
            if (result.qr_code) {
              setQrCode(result.qr_code);
              toast.success('QR Code gerado automaticamente! Escaneie com seu WhatsApp.');
            }
          })
          .catch((err) => {
            console.error('Erro ao buscar QR code automaticamente:', err);
          });
      }
    }
  }, [instances, qrCode]);

  const syncStatusWithEvolutionAPI = useCallback(async () => {
    if (!apiSettings?.evolution_api_url || !apiSettings?.evolution_api_key) {
      return;
    }

    try {
      // Buscar status atual das instâncias na Evolution API
      const response = await fetch(`${apiSettings.evolution_api_url}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiSettings.evolution_api_key
        }
      });

      if (response.ok) {
        const evolutionInstances = await response.json();
        
        if (Array.isArray(evolutionInstances)) {
          // Filtrar apenas instâncias que pertencem ao usuário atual
          const userInstances = instances.filter(instance => 
            String(instance.user_id) === String(user?.id)
          );
          
          // Atualizar status das instâncias locais
          for (const localInstance of userInstances) {
            // Buscar a instância na Evolution API pelo nome
            const evInstance = evolutionInstances.find((ev: any) => 
              ev.instanceName === localInstance.name ||
              ev.name === localInstance.name
            );
            
            if (evInstance) {
              const newStatus = evInstance.connectionStatus === 'open' ? 'connected' : 
                               evInstance.connectionStatus === 'close' ? 'disconnected' : 
                               evInstance.connectionStatus || 'unknown';
              
              if (localInstance.status !== newStatus) {
                try {
                  // Atualizar apenas o estado local, sem fazer PATCH no Baserow
                  setInstances(prev => prev.map(instance => 
                    instance.id === localInstance.id 
                      ? { ...instance, status: newStatus as any }
                      : instance
                  ));
                } catch (error) {
                  console.error('Erro ao atualizar status da instância:', localInstance.id, error);
                }
              }
            }
          }
        }
      } else {
        console.error('Erro ao buscar instâncias da Evolution API:', response.status);
      }
    } catch (error) {
      console.error('Erro na sincronização automática:', error);
    }
  }, [apiSettings, instances, user?.id]);

  // Sincronizar status das instâncias com a Evolution API periodicamente
  useEffect(() => {
    if (!apiSettings?.evolution_api_url || !apiSettings?.evolution_api_key || instances.length === 0) {
      return;
    }

    const syncInterval = setInterval(() => {
      syncStatusWithEvolutionAPI();
    }, 10000); // Sincronizar a cada 10 segundos

    return () => clearInterval(syncInterval);
  }, [apiSettings, instances, syncStatusWithEvolutionAPI]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Sempre buscar apenas instâncias do usuário atual
      const instancesData = await getWhatsAppInstances();
      
      const settingsData = await getWhatsAppSettings();
      
      setInstances(instancesData);
      if (settingsData) {
        setApiSettings({
          evolution_api_url: settingsData.evolution_api_url,
          evolution_api_key: settingsData.evolution_api_key
        });
        
        // Sincronizar status com a Evolution API após carregar os dados
        setTimeout(() => {
          syncStatusWithEvolutionAPI();
        }, 1000);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstance = async () => {
    if (!user) return;

    if (!newInstance.name.trim() || !newInstance.phone.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      setCreatingInstance(true);
      
      const instance = await createWhatsAppInstance({
        name: newInstance.name.trim(),
        phone: newInstance.phone.trim()
      });
      
      setInstances(prev => [...prev, instance]);
      setNewInstance({ name: '', phone: '' });
      setIsDialogOpen(false);
      
      // Garantir que o toast apareça
      setTimeout(() => {
        toast.success('Instância criada com sucesso!');
      }, 100);
      
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      
      let errorMessage = 'Erro ao criar instância';
      
      if (error instanceof Error) {
        if (error.message.includes('já está em uso')) {
          errorMessage = `O nome "${newInstance.name.trim()}" já está em uso. Escolha outro nome.`;
        } else if (error.message.includes('API WhatsApp não configurada')) {
          errorMessage = 'Configure a API WhatsApp em Configurações primeiro';
        } else if (error.message.includes('Configuração da API inválida')) {
          errorMessage = 'Configuração da API inválida. Verifique a URL e chave da API em Configurações.';
        } else if (error.message.includes('Chave da API inválida')) {
          errorMessage = 'Chave da API inválida. Verifique as configurações.';
        } else if (error.message.includes('Instância não encontrada no banco de dados')) {
          errorMessage = 'Instância removida com sucesso da Evolution API (não existia no banco local)';
        } else if (error.message.includes('Erro ao criar instância:')) {
          errorMessage = error.message.replace('Erro ao criar instância: ', '');
        } else if (error.message.includes('Uma instância com este nome já existe na Evolution API')) {
          errorMessage = 'Uma instância com este nome já existe na Evolution API. Use um nome diferente.';
        } else if (error.message.includes('Falha ao criar instância na Evolution API')) {
          errorMessage = 'Erro ao criar instância na Evolution API. Verifique as configurações.';
        } else if (error.message.includes('Uma instância com este nome já existe na Evolution API, mas não foi possível encontrá-la para conectar.')) {
          // Abrir modal para selecionar instância existente
          try {
            const instances = await getEvolutionAPIInstances();
            setEvolutionInstances(instances);
            setIsInstanceSelectionOpen(true);
            return; // Não mostrar erro, pois vamos abrir o modal
          } catch (fetchError) {
            errorMessage = 'Erro ao buscar instâncias da Evolution API. Tente novamente.';
          }
        }
      }
      
      // Garantir que o toast apareça
      setTimeout(() => {
        toast.error(errorMessage);
      }, 100);
      
      // Não fechar a modal em caso de erro para o usuário poder corrigir
    } finally {
      setCreatingInstance(false);
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    try {
      setDeletingInstance(instanceId);
      
      // Usar função normal, já que só mostramos instâncias do usuário
      await deleteWhatsAppInstance(instanceId);
      
      // Atualizar estado local
      setInstances(prev => {
        const filtered = prev.filter(instance => String(instance.id) !== String(instanceId));
        return filtered;
      });
      
      toast.success('Instância removida com sucesso!');
    } catch (error) {
      console.error('Erro no handleDeleteInstance:', error);
      
      let errorMessage = 'Erro ao deletar instância';
      
      if (error instanceof Error) {
        if (error.message.includes('Acesso negado')) {
          errorMessage = 'Você não tem permissão para deletar esta instância';
        } else if (error.message.includes('não encontrada')) {
          errorMessage = 'Instância não encontrada';
        } else if (error.message.includes('Erro ao deletar instância:')) {
          errorMessage = error.message.replace('Erro ao deletar instância: ', '');
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setDeletingInstance(null);
    }
  };

  const handleConnectInstance = async (instanceId: string) => {
    try {
      setConnectingInstance(instanceId);
      console.log('Iniciando conexão da instância:', instanceId);
      
      // Mostrar toast informativo sobre criação automática
      toast.info('Verificando instância na Evolution API...');
      
      const result = await connectWhatsAppInstance(instanceId);
      console.log('Resultado da conexão:', result);
      
      // Atualizar status da instância
      setInstances(prev => prev.map(instance => 
        instance.id === instanceId 
          ? { ...instance, status: result.status as any }
          : instance
      ));
      
      // Se temos QR code, mostrar o modal
      if (result.qr_code) {
        setQrCode(result.qr_code);
        toast.success('QR Code gerado! Escaneie com seu WhatsApp.');
      } else if (result.status === 'connected') {
        toast.success('Instância já está conectada!');
      } else if (result.status === 'connecting') {
        toast.info('Instância está conectando... Aguarde a confirmação.');
      } else {
        toast.success('Instância conectada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      
      let errorMessage = 'Erro ao conectar instância';
      
      if (error instanceof Error) {
        if (error.message.includes('Evolution API não configurada')) {
          errorMessage = 'Configure a Evolution API em Configurações primeiro';
        } else if (error.message.includes('Acesso negado')) {
          errorMessage = 'Você não tem permissão para conectar esta instância';
        } else if (error.message.includes('Instância não encontrada na Evolution API')) {
          errorMessage = 'Instância não encontrada na Evolution API. Tentando criar automaticamente...';
        } else if (error.message.includes('Falha ao criar instância na Evolution API')) {
          errorMessage = 'Erro ao criar instância na Evolution API. Verifique as configurações.';
        } else if (error.message.includes('Chave da API inválida')) {
          errorMessage = 'Chave da API inválida. Verifique as configurações.';
        } else if (error.message.includes('Falha ao conectar instância:')) {
          errorMessage = error.message;
        } else if (error.message.includes('Erro ao conectar com a Evolution API:')) {
          errorMessage = error.message;
        } else if (error.message.includes('Uma instância com este nome já existe na Evolution API')) {
          errorMessage = 'Uma instância com este nome já existe na Evolution API. Use um nome diferente.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setConnectingInstance(null);
    }
  };

  const syncWithEvolutionAPI = async () => {
    if (!apiSettings?.evolution_api_url || !apiSettings?.evolution_api_key) {
      toast.error('Configure a Evolution API primeiro em Configurações');
      return;
    }

    // Abrir modal de confirmação
    setIsSyncDialogOpen(true);
  };

  const executeSync = async () => {
    if (!apiSettings?.evolution_api_url || !apiSettings?.evolution_api_key) {
      toast.error('Configure a Evolution API primeiro em Configurações');
      return;
    }

    try {
      setSyncing(true);
      setIsSyncDialogOpen(false);
      
      // Buscar instâncias da Evolution API
      const response = await fetch(`${apiSettings.evolution_api_url}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiSettings.evolution_api_key
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar instâncias da Evolution API');
      }

      const evolutionInstances = await response.json();
      
      if (Array.isArray(evolutionInstances) && evolutionInstances.length > 0) {
        // Buscar instâncias existentes do usuário atual
        const existingInstances = await getWhatsAppInstances();
        const existingIds = existingInstances.map(i => i.id);
        
        // Filtrar apenas instâncias que não existem localmente
        const newInstances = evolutionInstances.filter((evInstance: any) => !existingIds.includes(evInstance.id));
        
        let importedCount = 0;
        let skippedCount = 0;
        
        for (const evInstance of newInstances) {
          try {
            // Validar se a instância tem dados mínimos necessários
            if (!evInstance.id || !evInstance.name) {
              skippedCount++;
              continue;
            }
            
            const newInstance = await createWhatsAppInstance({
              name: evInstance.name || 'Instância Importada',
              phone: evInstance.number || 'Número não disponível'
            });
            
            setInstances(prev => [...prev, newInstance]);
            importedCount++;
          } catch (error) {
            console.error('Erro ao importar instância:', evInstance.id, error);
            skippedCount++;
          }
        }
        
        // Atualizar status das instâncias existentes
        await syncStatusWithEvolutionAPI();
        
        // Relatório detalhado
        let message = '';
        if (importedCount > 0) {
          message += `${importedCount} instância(s) importada(s) com sucesso. `;
        }
        if (skippedCount > 0) {
          message += `${skippedCount} instância(s) ignorada(s) (dados inválidos ou erro). `;
        }
        if (importedCount === 0 && skippedCount === 0) {
          message = 'Todas as instâncias já estão sincronizadas.';
        }
        
        if (importedCount > 0) {
          toast.success(message);
        } else if (skippedCount > 0) {
          toast.warning(message);
        } else {
          toast.info(message);
        }
      } else {
        toast.info('Nenhuma instância encontrada na Evolution API');
      }
    } catch (error) {
      console.error('Erro ao sincronizar com a Evolution API:', error);
      toast.error(`Erro ao sincronizar com a Evolution API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800">Conectando...</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-100 text-gray-800">Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-600 animate-pulse" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setInstanceToDelete(null);
  };

  const handleConnectSelectedInstance = async () => {
    if (!selectedEvolutionInstance) {
      toast.error('Selecione uma instância primeiro');
      return;
    }
    
    try {
      setConnectingInstance(selectedEvolutionInstance.id);
      
      const result = await connectEvolutionAPIInstance(selectedEvolutionInstance.id);
      
      if (result.qr_code) {
        setQrCode(result.qr_code);
        toast.success('QR Code gerado! Escaneie com seu WhatsApp.');
      } else if (result.status === 'connected') {
        toast.success('Instância já está conectada!');
      } else {
        toast.success('Instância conectada com sucesso!');
      }
      
      setIsInstanceSelectionOpen(false);
      setSelectedEvolutionInstance(null);
    } catch (error) {
      console.error('Erro ao conectar instância selecionada:', error);
      toast.error('Erro ao conectar instância');
    } finally {
      setConnectingInstance(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando instâncias...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Instâncias WhatsApp</h1>
          <p className="text-gray-600">
            Gerencie suas instâncias do WhatsApp
            {user && (
              <span className="text-sm text-blue-600 ml-2">
                (Usuário: {user.name || user.email})
              </span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Instância
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Instância</DialogTitle>
                <DialogDescription>
                  Adicione uma nova instância do WhatsApp para gerenciar mensagens.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Instância</Label>
                  <Input
                    id="name"
                    value={newInstance.name}
                    onChange={(e) => setNewInstance(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: WhatsApp Principal"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Número do Telefone</Label>
                  <Input
                    id="phone"
                    value={newInstance.phone}
                    onChange={(e) => setNewInstance(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Ex: 5511999999999"
                  />
                </div>
                <Button onClick={handleCreateInstance} className="w-full" disabled={creatingInstance}>
                  {creatingInstance ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Instância'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status da API */}
      {!apiSettings && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Evolution API não configurada</p>
                <p className="text-sm text-yellow-700">
                  Configure a Evolution API em Configurações para sincronizar instâncias automaticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sincronização Automática */}
      {apiSettings && instances.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Sincronização Automática Ativa</p>
                <p className="text-sm text-blue-700">
                  O status das instâncias é atualizado automaticamente a cada 10 segundos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      {instances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suas Instâncias</CardTitle>
            <CardDescription>Resumo das suas instâncias do WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{instances.length}</div>
                <div className="text-sm text-gray-600">Total de Instâncias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {instances.filter(i => i.status === 'connected').length}
                </div>
                <div className="text-sm text-gray-600">Conectadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {instances.filter(i => i.status === 'connecting').length}
                </div>
                <div className="text-sm text-gray-600">Conectando</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {instances.filter(i => i.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Com Erro</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {instances.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <QrCode className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma instância encontrada</h3>
            <p className="text-gray-600 text-center mb-4">
              Você ainda não possui instâncias do WhatsApp. Crie sua primeira instância ou sincronize com a Evolution API.
            </p>
            <div className="flex space-x-2">
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Instância
              </Button>
              {apiSettings && (
                <Button variant="outline" onClick={syncWithEvolutionAPI}>
                  <Download className="w-4 h-4 mr-2" />
                  Sincronizar com API
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((instance) => (
            <Card key={instance.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{instance.name}</CardTitle>
                    <CardDescription>{instance.phone}</CardDescription>
                  </div>
                  {getStatusIcon(instance.status)}
                </div>
                <div className="flex justify-between items-center">
                  {getStatusBadge(instance.status)}
                  <div className="flex space-x-2">
                    {instance.status === 'disconnected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnectInstance(instance.id)}
                        disabled={connectingInstance === instance.id}
                      >
                        {connectingInstance === instance.id ? 'Conectando...' : 'Conectar'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setInstanceToDelete(instance);
                      }}
                      disabled={deletingInstance === instance.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {deletingInstance === instance.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Deletando...
                        </>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p>Criada em: {new Date(instance.created_at).toLocaleDateString()}</p>
                  <p>Atualizada em: {new Date(instance.updated_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {qrCode && (
        <Dialog open={!!qrCode} onOpenChange={() => setQrCode(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-green-600" />
                <span>Conectar WhatsApp</span>
              </DialogTitle>
              <DialogDescription>
                Escaneie o QR Code com seu WhatsApp para conectar a instância.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Instruções */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Como conectar:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Abra o WhatsApp no seu celular</li>
                    <li>Toque em <strong>Menu</strong> → <strong>WhatsApp Web</strong></li>
                    <li>Aponte a câmera para o QR Code</li>
                    <li>Aguarde a confirmação de conexão</li>
                  </ol>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>
              
              {/* Status e Ações */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  {checkingConnection ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm text-blue-600">Verificando conexão...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Aguardando conexão...</span>
                    </>
                  )}
                </div>
                
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Recarregar QR code
                      if (connectingInstance) {
                        handleConnectInstance(connectingInstance);
                      }
                    }}
                    disabled={checkingConnection}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recarregar QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQrCode(null);
                      setConnectingInstance(null);
                      setCheckingConnection(false);
                    }}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && instanceToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                <span>Confirmar Exclusão</span>
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja deletar a instância <strong>"{instanceToDelete.name}"</strong>?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-700">
                  <p><strong>Nome:</strong> {instanceToDelete.name}</p>
                  <p><strong>Telefone:</strong> {instanceToDelete.phone}</p>
                  <p><strong>Status:</strong> {instanceToDelete.status}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCloseDeleteDialog}
                disabled={deletingInstance === instanceToDelete.id}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleDeleteInstance(instanceToDelete.id);
                  handleCloseDeleteDialog();
                }}
                disabled={deletingInstance === instanceToDelete.id}
              >
                {deletingInstance === instanceToDelete.id ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Deletando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar Instância
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Sync Confirmation Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-blue-600" />
              <span>Confirmar Sincronização</span>
            </DialogTitle>
            <DialogDescription>
              Esta ação irá sincronizar instâncias da Evolution API com seu banco de dados local. 
              Apenas instâncias que você criou ou que pertencem à sua conta serão importadas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">O que será feito:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Buscar instâncias da Evolution API</li>
                    <li>Importar apenas instâncias que não existem localmente</li>
                    <li>Atualizar status das instâncias existentes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsSyncDialogOpen(false)}
              disabled={syncing}
            >
              Cancelar
            </Button>
            <Button 
              onClick={executeSync}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Sincronizar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instance Selection Modal */}
      <Dialog open={isInstanceSelectionOpen} onOpenChange={setIsInstanceSelectionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Selecionar Instância da Evolution API</span>
            </DialogTitle>
            <DialogDescription>
              Uma instância com este nome já existe na Evolution API. Selecione a instância que deseja conectar:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto">
              {evolutionInstances.length > 0 ? (
                <div className="grid gap-3">
                  {evolutionInstances.map((instance) => (
                    <div
                      key={instance.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEvolutionInstance?.id === instance.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedEvolutionInstance(instance)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {instance.instanceName || instance.name || 'Sem nome'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            ID: {instance.id} | Status: {instance.connectionStatus || 'desconhecido'}
                          </p>
                          {instance.number && (
                            <p className="text-sm text-gray-600">Número: {instance.number}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedEvolutionInstance?.id === instance.id && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma instância encontrada na Evolution API</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsInstanceSelectionOpen(false);
                setSelectedEvolutionInstance(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConnectSelectedInstance}
              disabled={!selectedEvolutionInstance || connectingInstance === selectedEvolutionInstance?.id}
            >
              {connectingInstance === selectedEvolutionInstance?.id ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Conectar Instância
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsAppInstances; 