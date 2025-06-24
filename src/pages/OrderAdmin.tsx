import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, DollarSign, Users, Calendar, Eye, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BaserowOrder, BaserowOrderItem, createOrderItem, updateOrderStatus } from '@/services/orderService';
import { getProduct } from '@/services/productService';
import { getUserById } from '@/services/authService';

// Interface para pedidos com informações completas
interface OrderWithDetails extends BaserowOrder {
  items: (BaserowOrderItem & {
    productName: string;
    productImage: string;
  })[];
  userName: string;
  userEmail: string;
}

const OrderAdmin: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const { toast } = useToast();

  // Função para tratar URLs de imagem (igual à página da loja)
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || imageUrl.trim() === '') {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop';
    }
    
    let processedUrl = imageUrl.trim();
    
    // Se a URL não tem protocolo, adicionar https://
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    // Verificar se é uma URL válida
    try {
      new URL(processedUrl);
      return processedUrl;
    } catch (error) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop';
    }
  };

  // Componente de imagem com fallback (igual à página da loja)
  const ProductImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const fallbackImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop';

    const handleError = () => {
      if (!hasError) {
        console.log('Erro ao carregar imagem:', src);
        setImageSrc(fallbackImage);
        setHasError(true);
      }
    };

    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={handleError}
        loading="lazy"
      />
    );
  };

  // Função para carregar todos os pedidos com detalhes
  const loadOrders = async () => {
    setLoading(true);
    try {
      // Buscar todos os pedidos
      const response = await fetch(`${import.meta.env.VITE_BASEROW_API_URL}/database/rows/table/${import.meta.env.VITE_BASEROW_ORDERS_TABLE_ID}/?user_field_names=true&size=100&order_by=-created_at`, {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }

      const ordersData = await response.json();
      
      // Para cada pedido, buscar itens e informações do usuário
      const ordersWithDetails: OrderWithDetails[] = [];
      
      for (const order of ordersData.results) {
        try {
          // Buscar itens do pedido
          const itemsResponse = await fetch(`${import.meta.env.VITE_BASEROW_API_URL}/database/rows/table/${import.meta.env.VITE_BASEROW_ORDER_ITEMS_TABLE_ID}/?user_field_names=true&filter__field_order_id__equal=${order.id}`, {
            headers: {
              'Authorization': `Token ${import.meta.env.VITE_BASEROW_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });

          let items: (BaserowOrderItem & { productName: string; productImage: string })[] = [];
          
          if (itemsResponse.ok) {
            const itemsData = await itemsResponse.json();
            
            // Para cada item, buscar informações do produto
            for (const item of itemsData.results) {
              try {
                const product = await getProduct(parseInt(item.product_id));
                items.push({
                  ...item,
                  productName: product.name,
                  productImage: getImageUrl(product.image) // Usar a função getImageUrl
                });
              } catch (error) {
                console.error(`Erro ao buscar produto ${item.product_id}:`, error);
                items.push({
                  ...item,
                  productName: `Produto ${item.product_id}`,
                  productImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop'
                });
              }
            }
          }

          // Buscar informações do usuário se não for guest
          let userName = order.guest_name || 'Cliente';
          let userEmail = order.guest_email || 'N/A';
          
          if (order.user_id && order.user_id !== '') {
            try {
              const user = await getUserById(order.user_id);
              if (user) {
                userName = user.name || user.email || userName;
                userEmail = user.email || userEmail;
              }
            } catch (error) {
              console.error(`Erro ao buscar usuário ${order.user_id}:`, error);
            }
          }

          ordersWithDetails.push({
            ...order,
            items,
            userName,
            userEmail
          });
        } catch (error) {
          console.error(`Erro ao processar pedido ${order.id}:`, error);
        }
      }

      setOrders(ordersWithDetails);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar os pedidos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.payment_status === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processando', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Concluído', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
      refunded: { label: 'Reembolsado', className: 'bg-gray-100 text-gray-800' },
      paid: { label: 'Pago', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Falhou', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Atualizar o estado local
      setOrders(orders.map(order =>
        order.id === parseInt(orderId)
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));

      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do pedido.",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os pedidos da sua loja</p>
        </div>
        <Button onClick={loadOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Pedidos Concluídos</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pedidos Pendentes</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, email ou ID do pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status do pedido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status do pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pagamentos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="font-mono text-sm">#{order.id}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-sm text-gray-600">{order.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <ProductImage
                            src={item.productImage}
                            alt={item.productName}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="text-sm">{item.productName}</span>
                          <Badge variant="secondary" className="text-xs">
                            x{item.quantity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatPrice(parseFloat(order.total))}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(order.status)}
                      <Select
                        value={order.status}
                        onValueChange={(value: string) => handleStatusUpdate(order.id.toString(), value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="processing">Processando</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                          <SelectItem value="refunded">Reembolsado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(order.payment_status)}
                      <span className="text-xs text-gray-600 capitalize">
                        {order.payment_method}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(order.created_at)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
                        </DialogHeader>
                        <OrderDetails order={selectedOrder} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

interface OrderDetailsProps {
  order: OrderWithDetails | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Componente de imagem com fallback para os detalhes
  const ProductImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const fallbackImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop';

    const handleError = () => {
      if (!hasError) {
        console.log('Erro ao carregar imagem:', src);
        setImageSrc(fallbackImage);
        setHasError(true);
      }
    };

    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={handleError}
        loading="lazy"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div>
        <h3 className="font-semibold mb-3">Informações do Cliente</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-medium">{order.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{order.userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Order Items */}
      <div>
        <h3 className="font-semibold mb-3">Itens do Pedido</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <ProductImage
                src={item.productImage}
                alt={item.productName}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(parseFloat(item.price) * parseInt(item.quantity))}</p>
                <p className="text-sm text-gray-600">{formatPrice(parseFloat(item.price))} cada</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Order Summary */}
      <div>
        <h3 className="font-semibold mb-3">Resumo do Pedido</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(parseFloat(order.total))}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de processamento:</span>
              <span>Grátis</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatPrice(parseFloat(order.total))}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Order Status */}
      <div>
        <h3 className="font-semibold mb-3">Status e Informações</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Status do Pedido</p>
            <p className="font-medium capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status do Pagamento</p>
            <p className="font-medium capitalize">{order.payment_status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Método de Pagamento</p>
            <p className="font-medium capitalize">{order.payment_method}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Data do Pedido</p>
            <p className="font-medium">{formatDate(order.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Observações</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm">{order.notes}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderAdmin; 