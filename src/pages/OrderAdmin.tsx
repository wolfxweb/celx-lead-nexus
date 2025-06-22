import React, { useState } from 'react';
import { Search, Filter, Package, DollarSign, Users, Calendar, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Order, OrderStatus, PaymentStatus } from '@/types/ecommerce';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'João Silva',
    userEmail: 'joao@example.com',
    items: [
      {
        productId: '1',
        productName: 'Template de Landing Page Premium',
        productImage: '/images/products/landing-template.jpg',
        price: 97.00,
        quantity: 1,
        downloadUrl: 'https://example.com/downloads/landing-template.zip'
      }
    ],
    total: 97.00,
    status: 'completed',
    paymentMethod: 'credit',
    paymentStatus: 'paid',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
    downloadLinks: [
      {
        productId: '1',
        productName: 'Template de Landing Page Premium',
        downloadUrl: 'https://example.com/downloads/landing-template.zip',
        expiresAt: new Date('2025-12-15'),
        downloadCount: 2
      }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Maria Santos',
    userEmail: 'maria@example.com',
    items: [
      {
        productId: '4',
        productName: 'E-book: Guia de Vendas Online',
        productImage: '/images/products/sales-ebook.jpg',
        price: 37.00,
        quantity: 1,
        downloadUrl: 'https://example.com/downloads/sales-ebook.pdf'
      },
      {
        productId: '5',
        productName: 'Kit de Ícones Premium',
        productImage: '/images/products/icon-kit.jpg',
        price: 47.00,
        quantity: 1,
        downloadUrl: 'https://example.com/downloads/icon-kit.zip'
      }
    ],
    total: 84.00,
    status: 'processing',
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2024-12-16'),
    downloadLinks: [
      {
        productId: '4',
        productName: 'E-book: Guia de Vendas Online',
        downloadUrl: 'https://example.com/downloads/sales-ebook.pdf',
        expiresAt: new Date('2025-12-16'),
        downloadCount: 1
      },
      {
        productId: '5',
        productName: 'Kit de Ícones Premium',
        downloadUrl: 'https://example.com/downloads/icon-kit.zip',
        expiresAt: new Date('2025-12-16'),
        downloadCount: 0
      }
    ]
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Pedro Costa',
    userEmail: 'pedro@example.com',
    items: [
      {
        productId: '2',
        productName: 'Curso de Marketing Digital',
        productImage: '/images/products/marketing-course.jpg',
        price: 297.00,
        quantity: 1,
        downloadUrl: 'https://example.com/downloads/marketing-course.zip'
      }
    ],
    total: 297.00,
    status: 'pending',
    paymentMethod: 'boleto',
    paymentStatus: 'pending',
    createdAt: new Date('2024-12-17'),
    updatedAt: new Date('2024-12-17'),
    downloadLinks: []
  }
];

const OrderAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processando', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Concluído', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
      refunded: { label: 'Reembolsado', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Pago', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Falhou', className: 'bg-red-100 text-red-800' },
      refunded: { label: 'Reembolsado', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os pedidos da sua loja</p>
          </div>
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
                            <img
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
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(order.status)}
                        <Select
                          value={order.status}
                          onValueChange={(value: OrderStatus) => handleStatusUpdate(order.id, value)}
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
                        {getPaymentStatusBadge(order.paymentStatus)}
                        <span className="text-xs text-gray-600 capitalize">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(order.createdAt)}</p>
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
    </div>
  );
};

interface OrderDetailsProps {
  order: Order | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-sm text-gray-600">{formatPrice(item.price)} cada</p>
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
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de processamento:</span>
              <span>Grátis</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
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
            <p className="font-medium capitalize">{order.paymentStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Método de Pagamento</p>
            <p className="font-medium capitalize">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Data do Pedido</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Download Links */}
      {order.downloadLinks.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Links de Download</h3>
            <div className="space-y-2">
              {order.downloadLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">{link.productName}</p>
                    <p className="text-sm text-gray-600">
                      Downloads: {link.downloadCount} | Expira: {link.expiresAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Link
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderAdmin; 