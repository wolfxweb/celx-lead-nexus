import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Plus, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Phone, 
  MoreVertical,
  Reply,
  Image as ImageIcon,
  FileText,
  Mic,
  Smile,
  Paperclip
} from 'lucide-react';
import { 
  getWhatsAppMessages, 
  sendWhatsAppMessage, 
  scheduleWhatsAppMessage,
  getWhatsAppInstances,
  WhatsAppMessage,
  WhatsAppInstance 
} from '@/services/whatsappService';
import { BASEROW_TABLES } from '@/config/baserowTables';

interface ChatMessage extends WhatsAppMessage {
  isOutgoing?: boolean;
  isReply?: boolean;
  replyTo?: WhatsAppMessage;
}

const WhatsAppMessages: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [replyToMessage, setReplyToMessage] = useState<WhatsAppMessage | null>(null);
  const [isNewContact, setIsNewContact] = useState(false);
  const [newContactNumber, setNewContactNumber] = useState('');
  const [newMessage, setNewMessage] = useState({
    to: '',
    message: '',
    type: 'text',
    scheduled_at: ''
  });
  const [chatInput, setChatInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Carregando dados do WhatsApp...');
      
      const [messagesData, instancesData] = await Promise.all([
        getWhatsAppMessages(),
        getWhatsAppInstances()
      ]);
      
      console.log('Mensagens carregadas:', messagesData);
      console.log('Instâncias carregadas:', instancesData);
      
      setMessages(messagesData);
      setInstances(instancesData);
      
      if (instancesData.length > 0 && !selectedInstance) {
        setSelectedInstance('all');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedInstance) {
      toast.error('Selecione uma instância');
      return;
    }

    try {
      let message;
      
      if (newMessage.scheduled_at) {
        message = await scheduleWhatsAppMessage({
          instance_id: selectedInstance,
          to: newMessage.to,
          message: newMessage.message,
          type: newMessage.type as any,
          scheduled_at: newMessage.scheduled_at
        });
      } else {
        message = await sendWhatsAppMessage({
          instance_id: selectedInstance,
          to: newMessage.to,
          message: newMessage.message,
          type: newMessage.type as any
        });
      }
      
      setMessages(prev => [message, ...prev]);
      setNewMessage({ to: '', message: '', type: 'text', scheduled_at: '' });
      setIsDialogOpen(false);
      
      const action = newMessage.scheduled_at ? 'agendada' : 'enviada';
      toast.success(`Mensagem ${action} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  const handleSendChatMessage = async () => {
    if (!selectedInstance || !selectedContact || !chatInput.trim()) {
      toast.error('Selecione uma instância e contato, e digite uma mensagem');
      return;
    }

    try {
      const messageData = {
        instance_id: selectedInstance,
        to: selectedContact,
        message: chatInput,
        type: 'text' as any
      };

      if (replyToMessage) {
        messageData.message = `*Respondendo:* ${replyToMessage.message}\n\n${chatInput}`;
      }

      const message = await sendWhatsAppMessage(messageData);
      
      setMessages(prev => [message, ...prev]);
      setChatInput('');
      setReplyToMessage(null);
      
      toast.success('Mensagem enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
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

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <AlertCircle className="w-4 h-4 text-gray-600" />;
    
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'read':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredMessages = selectedInstance && selectedInstance !== 'all'
    ? messages.filter(msg => msg.instance_id === selectedInstance)
    : messages;

  // Agrupar mensagens por contato
  const messagesByContact = filteredMessages.reduce((acc, message) => {
    const contact = message.to;
    if (!acc[contact]) {
      acc[contact] = [];
    }
    acc[contact].push(message);
    return acc;
  }, {} as Record<string, WhatsAppMessage[]>);

  // Ordenar contatos por última mensagem
  const sortedContacts = Object.keys(messagesByContact).sort((a, b) => {
    const lastMessageA = messagesByContact[a][0];
    const lastMessageB = messagesByContact[b][0];
    
    const dateA = lastMessageA?.created_at ? new Date(lastMessageA.created_at).getTime() : 0;
    const dateB = lastMessageB?.created_at ? new Date(lastMessageB.created_at).getTime() : 0;
    
    return dateB - dateA;
  });

  const selectedContactMessages = selectedContact ? messagesByContact[selectedContact] || [] : [];

  // Função para determinar se a mensagem é de entrada (recebida) ou saída (enviada)
  const isIncomingMessage = (message: WhatsAppMessage) => {
    // Assumindo que mensagens recebidas têm um campo específico ou podemos determinar pela estrutura
    // Por enquanto, vamos considerar que todas as mensagens são enviadas (outgoing)
    // Você pode ajustar essa lógica baseada na estrutura real dos seus dados
    return false; // Todas as mensagens são consideradas enviadas por padrão
  };

  // Função para formatar data de forma segura
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data desconhecida';
    try {
      return new Date(dateString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando mensagens...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">WhatsApp Messages</h1>
            <p className="text-gray-600">Chat em tempo real</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Mensagem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Enviar Mensagem</DialogTitle>
                <DialogDescription>
                  Envie uma mensagem ou agende para mais tarde.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="instance">Instância</Label>
                  <Select value={selectedInstance} onValueChange={setSelectedInstance}>
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
                  <Label htmlFor="to">Para (Número)</Label>
                  <Input
                    id="to"
                    value={newMessage.to}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="Ex: 5511999999999"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newMessage.type} onValueChange={(value) => setNewMessage(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="image">Imagem</SelectItem>
                      <SelectItem value="document">Documento</SelectItem>
                      <SelectItem value="audio">Áudio</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Digite sua mensagem..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduled_at">Agendar (opcional)</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={newMessage.scheduled_at}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSendMessage} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {newMessage.scheduled_at ? 'Agendar Mensagem' : 'Enviar Mensagem'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtro por instância */}
        <div className="flex items-center space-x-4 mt-4">
          <Label htmlFor="filter-instance">Instância:</Label>
          <Select value={selectedInstance} onValueChange={setSelectedInstance}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Todas as instâncias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as instâncias</SelectItem>
              {instances.map((instance) => (
                <SelectItem key={instance.id} value={instance.id}>
                  {instance.name} ({instance.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex bg-gray-50">
        {/* Sidebar - Lista de Contatos */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Conversas</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNewContact(true)}
                title="Nova conversa"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {sortedContacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Send className="w-8 h-8 mx-auto mb-2" />
                <p>Nenhuma conversa encontrada</p>
              </div>
            ) : (
              <div>
                {sortedContacts.map((contact) => {
                  const contactMessages = messagesByContact[contact];
                  const lastMessage = contactMessages?.[0];
                  const isSelected = selectedContact === contact;
                  
                  // Verificar se lastMessage existe
                  if (!lastMessage || !contactMessages) {
                    return null;
                  }
                  
                  return (
                    <div
                      key={contact}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            <Phone className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm truncate">{contact}</p>
                            <span className="text-xs text-gray-500">
                              {formatDate(lastMessage.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {lastMessage.message ? (
                              <>
                                {lastMessage.message.substring(0, 50)}
                                {lastMessage.message.length > 50 && '...'}
                              </>
                            ) : (
                              <span className="text-gray-400 italic">Mensagem sem texto</span>
                            )}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getStatusIcon(lastMessage.status)}
                            <span className="text-xs text-gray-500">
                              {contactMessages?.length || 0} mensagem{(contactMessages?.length || 0) !== 1 ? 's' : ''}
                            </span>
                            {lastMessage?.instance_id && instances.find(i => i.id === lastMessage.instance_id) && (
                              <span className="text-xs text-green-600 font-medium">
                                • {instances.find(i => i.id === lastMessage.instance_id)?.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        <Phone className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedContact}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedContactMessages.length} mensagem{selectedContactMessages.length !== 1 ? 's' : ''}
                        {selectedInstance && selectedInstance !== 'all' && (
                          <span className="ml-2 text-green-600">
                            • {instances.find(i => i.id === selectedInstance)?.name}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsDialogOpen(true)}
                      title="Nova mensagem"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedContactMessages
                    .sort((a, b) => {
                      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                      return dateA - dateB;
                    })
                    .map((message) => {
                      const isIncoming = isIncomingMessage(message);
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isIncoming ? 'justify-start' : 'justify-end'} group`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                              isIncoming
                                ? 'bg-white border text-gray-800'
                                : 'bg-blue-500 text-white'
                            } ${replyToMessage?.id === message.id ? 'ring-2 ring-blue-300 shadow-lg' : ''}`}
                            onClick={() => setReplyToMessage(message)}
                            title="Clique para responder"
                          >
                            {replyToMessage?.id === message.id && (
                              <div className={`text-xs mb-1 font-medium ${isIncoming ? 'text-blue-600' : 'text-blue-200'}`}>
                                ← Respondendo a esta mensagem
                              </div>
                            )}
                            <p className="text-sm">
                              {message.message || <span className="text-gray-400 italic">Mensagem sem texto</span>}
                            </p>
                            <div className={`flex items-center justify-between mt-1 ${
                              isIncoming ? 'text-gray-500' : 'text-blue-100'
                            }`}>
                              <span className="text-xs">
                                {formatDate(message.created_at)}
                              </span>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(message.status)}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Reply className="w-3 h-3" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>

              {/* Reply Preview */}
              {replyToMessage && (
                <div className="bg-gray-100 p-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1 font-medium">Respondendo a:</p>
                      <div className="bg-white p-2 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-gray-800 truncate">
                          {replyToMessage.message || <span className="text-gray-400 italic">Mensagem sem texto</span>}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(replyToMessage.created_at)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyToMessage(null)}
                      className="ml-2"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="bg-white border-t p-4">
                {isNewContact ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newContactNumber}
                        onChange={(e) => setNewContactNumber(e.target.value)}
                        placeholder="Digite o número (ex: 5511999999999)"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (newContactNumber.trim()) {
                            setSelectedContact(newContactNumber.trim());
                            setIsNewContact(false);
                            setNewContactNumber('');
                          }
                        }}
                      >
                        Iniciar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsNewContact(false);
                          setNewContactNumber('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="min-h-[40px] max-h-32 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChatMessage();
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleSendChatMessage}
                        disabled={!chatInput.trim()}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-600 mb-4">
                  Escolha um contato para começar a conversar
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setIsNewContact(true)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Conversa
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seção de Debug */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Informações de Debug
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <strong>ID da Tabela Mensagens:</strong> {BASEROW_TABLES.WHATSAPP_MESSAGES.id}
            </div>
            <div>
              <strong>ID da Tabela Instâncias:</strong> {BASEROW_TABLES.WHATSAPP_INSTANCES.id}
            </div>
            <div>
              <strong>Total de Mensagens:</strong> {messages.length}
            </div>
            <div>
              <strong>Total de Instâncias:</strong> {instances.length}
            </div>
            <div>
              <strong>Instância Selecionada:</strong> {selectedInstance === 'all' ? 'Todas' : selectedInstance || 'Nenhuma'}
            </div>
            <div>
              <strong>Contato Selecionado:</strong> {selectedContact || 'Nenhum'}
            </div>
            <div>
              <strong>Total de Contatos:</strong> {sortedContacts.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppMessages; 