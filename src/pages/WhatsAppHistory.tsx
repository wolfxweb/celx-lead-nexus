import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, Filter, Download, Calendar } from 'lucide-react';
import { 
  getWhatsAppMessages, 
  getWhatsAppInstances,
  WhatsAppMessage,
  WhatsAppInstance 
} from '@/services/whatsappService';

const WhatsAppHistory: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstance, setSelectedInstance] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [messagesData, instancesData] = await Promise.all([
        getWhatsAppMessages(),
        getWhatsAppInstances()
      ]);
      setMessages(messagesData);
      setInstances(instancesData);
    } catch (error) {
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Enviada</Badge>;
      case 'delivered':
        return <Badge className="bg-blue-100 text-blue-800">Entregue</Badge>;
      case 'read':
        return <Badge className="bg-purple-100 text-purple-800">Lida</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesInstance = selectedInstance === 'all' || message.instance_id === selectedInstance;
    const matchesSearch = !searchTerm || 
      message.to.includes(searchTerm) || 
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesDate = !dateFilter || 
      new Date(message.created_at).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesInstance && matchesSearch && matchesStatus && matchesDate;
  });

  const exportHistory = () => {
    const csvContent = [
      ['Data', 'Para', 'Mensagem', 'Tipo', 'Status', 'Instância'],
      ...filteredMessages.map(msg => [
        new Date(msg.created_at).toLocaleString(),
        msg.to,
        msg.message,
        msg.type,
        msg.status,
        instances.find(i => i.id === msg.instance_id)?.name || 'Desconhecida'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Histórico exportado com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando histórico...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Histórico de Mensagens</h1>
        <p className="text-gray-600">Visualize o histórico completo de mensagens do WhatsApp</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="instance-filter">Instância</Label>
              <Select value={selectedInstance} onValueChange={setSelectedInstance}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as instâncias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as instâncias</SelectItem>
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id}>
                      {instance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por número ou mensagem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="read">Lida</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-filter">Data</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{filteredMessages.length}</div>
            <div className="text-sm text-gray-600">Total de mensagens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredMessages.filter(m => m.status === 'sent').length}
            </div>
            <div className="text-sm text-gray-600">Enviadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {filteredMessages.filter(m => m.status === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Entregues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {filteredMessages.filter(m => m.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-600">Falharam</div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Mostrando {filteredMessages.length} de {messages.length} mensagens
        </div>
        <Button onClick={exportHistory} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Lista de Mensagens */}
      {filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-gray-600 text-center">
              Tente ajustar os filtros para encontrar as mensagens que procura.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Para: {message.to}</CardTitle>
                    <CardDescription>
                      {instances.find(i => i.id === message.instance_id)?.name || 'Instância desconhecida'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(message.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Tipo:</span> {message.type}
                  </div>
                  <div>
                    <span className="font-medium">Mensagem:</span>
                    <p className="mt-1 text-gray-700">{message.message}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {message.scheduled_at && (
                      <div>Agendada para: {new Date(message.scheduled_at).toLocaleString()}</div>
                    )}
                    {message.sent_at && (
                      <div>Enviada em: {new Date(message.sent_at).toLocaleString()}</div>
                    )}
                    <div>Criada em: {new Date(message.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhatsAppHistory; 