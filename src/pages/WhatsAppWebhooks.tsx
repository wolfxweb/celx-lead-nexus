import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Trash2, Database, Globe, Activity } from 'lucide-react';
import { 
  getWhatsAppWebhooks, 
  createWhatsAppWebhook, 
  deleteWhatsAppWebhook,
  getWhatsAppInstances,
  WhatsAppWebhook,
  WhatsAppInstance 
} from '@/services/whatsappService';

const WhatsAppWebhooks: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WhatsAppWebhook[]>([]);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    instance_id: '',
    url: '',
    events: [] as string[]
  });

  const availableEvents = [
    'message',
    'message.ack',
    'connection.update',
    'qr.update',
    'group.join',
    'group.leave',
    'group.update',
    'contact.update'
  ];

  // Função auxiliar para processar eventos de forma segura
  const parseEvents = (eventsString: string): string[] => {
    try {
      if (!eventsString || typeof eventsString !== 'string') {
        return [];
      }
      return JSON.parse(eventsString);
    } catch (error) {
      console.error('Erro ao fazer parse dos eventos:', error);
      return [];
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Carregando webhooks...');
      const [webhooksData, instancesData] = await Promise.all([
        getWhatsAppWebhooks(),
        getWhatsAppInstances()
      ]);
      console.log('Webhooks carregados:', webhooksData);
      console.log('Instâncias carregadas:', instancesData);
      setWebhooks(webhooksData);
      setInstances(instancesData);
      
      if (instancesData.length > 0 && !newWebhook.instance_id) {
        setNewWebhook(prev => ({ ...prev, instance_id: instancesData[0].id }));
      }
    } catch (error) {
      console.error('Erro ao carregar webhooks:', error);
      toast.error('Erro ao carregar webhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.instance_id || !newWebhook.url || newWebhook.events.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const webhook = await createWhatsAppWebhook({
        instance_id: newWebhook.instance_id,
        url: newWebhook.url,
        events: newWebhook.events
      });
      
      setWebhooks(prev => [...prev, webhook]);
      setNewWebhook({ instance_id: '', url: '', events: [] });
      setIsDialogOpen(false);
      toast.success('Webhook criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar webhook');
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    try {
      await deleteWhatsAppWebhook(webhookId);
      setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
      toast.success('Webhook deletado com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar webhook');
    }
  };

  const handleEventToggle = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando webhooks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Webhooks WhatsApp</h1>
          <p className="text-gray-600">Configure webhooks para receber notificações em tempo real</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Webhook</DialogTitle>
              <DialogDescription>
                Configure um webhook para receber notificações da Evolution API.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instance">Instância</Label>
                <Select value={newWebhook.instance_id} onValueChange={(value) => setNewWebhook(prev => ({ ...prev, instance_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma instância" />
                  </SelectTrigger>
                  <SelectContent>
                    {instances.map((instance) => (
                      <SelectItem key={instance.id} value={instance.id}>
                        {instance.name} ({instance.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="url">URL do Webhook</Label>
                <Input
                  id="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://seu-servidor.com/webhook"
                />
              </div>
              <div>
                <Label>Eventos</Label>
                <div className="space-y-2 mt-2">
                  {availableEvents.map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={event}
                        checked={newWebhook.events.includes(event)}
                        onCheckedChange={() => handleEventToggle(event)}
                      />
                      <Label htmlFor={event} className="text-sm">{event}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateWebhook} className="w-full">
                Criar Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum webhook configurado</h3>
            <p className="text-gray-600 text-center mb-4">
              Configure webhooks para receber notificações em tempo real da Evolution API.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Webhook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {instances.find(i => i.id === webhook.instance_id)?.name || 'Instância desconhecida'}
                    </CardTitle>
                    <CardDescription className="break-all">{webhook.url}</CardDescription>
                  </div>
                  <Badge className={webhook.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {webhook.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Eventos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {webhook.events && typeof webhook.events === 'string' ? (
                        parseEvents(webhook.events).map((event: string) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Nenhum evento configurado</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Criado em: {new Date(webhook.created_at).toLocaleString()}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Documentação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Documentação dos Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Como funcionam os webhooks?</h4>
              <p className="text-sm text-gray-600">
                Os webhooks permitem que sua aplicação receba notificações em tempo real quando eventos 
                específicos acontecem no WhatsApp, como mensagens recebidas, mudanças de status, etc.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Eventos disponíveis:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>message:</strong> Nova mensagem recebida</li>
                <li>• <strong>message.ack:</strong> Confirmação de entrega/leitura</li>
                <li>• <strong>connection.update:</strong> Mudanças no status da conexão</li>
                <li>• <strong>qr.update:</strong> Atualizações do QR Code</li>
                <li>• <strong>group.join/leave:</strong> Entrada/saída de grupos</li>
                <li>• <strong>group.update:</strong> Atualizações de grupos</li>
                <li>• <strong>contact.update:</strong> Atualizações de contatos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Exemplo de payload:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "event": "message",
  "instance": "instance-name",
  "data": {
    "key": {...},
    "message": {...},
    "messageTimestamp": 1234567890
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppWebhooks; 