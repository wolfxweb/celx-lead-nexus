import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, QrCode, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { 
  getWhatsAppInstances, 
  createWhatsAppInstance, 
  deleteWhatsAppInstance, 
  connectWhatsAppInstance,
  WhatsAppInstance 
} from '@/services/whatsappService';
import { useAuth } from '@/contexts/AuthContext';

const WhatsAppInstances: React.FC = () => {
  const { user } = useAuth();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInstance, setNewInstance] = useState({
    name: '',
    phone: ''
  });
  const [connectingInstance, setConnectingInstance] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    try {
      setLoading(true);
      const data = await getWhatsAppInstances();
      setInstances(data);
    } catch (error) {
      toast.error('Erro ao carregar instâncias');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstance = async () => {
    if (!user) return;

    try {
      const instance = await createWhatsAppInstance({
        name: newInstance.name,
        phone: newInstance.phone,
        user_id: Number(user.id)
      });
      
      setInstances(prev => [...prev, instance]);
      setNewInstance({ name: '', phone: '' });
      setIsDialogOpen(false);
      toast.success('Instância criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar instância');
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    try {
      await deleteWhatsAppInstance(instanceId);
      setInstances(prev => prev.filter(instance => instance.id !== instanceId));
      toast.success('Instância deletada com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar instância');
    }
  };

  const handleConnectInstance = async (instanceId: string) => {
    try {
      setConnectingInstance(instanceId);
      const result = await connectWhatsAppInstance(instanceId);
      
      if (result.qr_code) {
        setQrCode(result.qr_code);
      }
      
      // Atualizar status da instância
      setInstances(prev => prev.map(instance => 
        instance.id === instanceId 
          ? { ...instance, status: result.status as any }
          : instance
      ));
      
      toast.success('Instância conectada com sucesso!');
    } catch (error) {
      toast.error('Erro ao conectar instância');
    } finally {
      setConnectingInstance(null);
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
          <p className="text-gray-600">Gerencie suas instâncias do WhatsApp</p>
        </div>
        
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
              <Button onClick={handleCreateInstance} className="w-full">
                Criar Instância
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {instances.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <QrCode className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma instância encontrada</h3>
            <p className="text-gray-600 text-center mb-4">
              Crie sua primeira instância do WhatsApp para começar a enviar mensagens.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Instância
            </Button>
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
                      onClick={() => handleDeleteInstance(instance.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conectar WhatsApp</DialogTitle>
              <DialogDescription>
                Escaneie o QR Code com seu WhatsApp para conectar a instância.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WhatsAppInstances; 