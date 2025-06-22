import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart3, 
  Settings,
  TrendingUp,
  DollarSign,
  Eye,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard stats
  const stats = {
    totalUsers: 1247,
    totalProducts: 89,
    totalOrders: 456,
    totalRevenue: 125000,
    activeProducts: 67,
    pendingOrders: 23
  };

  const recentOrders = [
    { id: '1', customer: 'João Silva', product: 'Template de Landing Page', amount: 97.00, status: 'completed' },
    { id: '2', customer: 'Maria Santos', product: 'Curso de Marketing Digital', amount: 197.00, status: 'pending' },
    { id: '3', customer: 'Pedro Costa', product: 'E-book de Vendas', amount: 47.00, status: 'completed' },
    { id: '4', customer: 'Ana Oliveira', product: 'Plugin WordPress', amount: 127.00, status: 'processing' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Concluído', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processando', className: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const adminSections = [
    {
      title: 'Gerenciar Produtos',
      description: 'Adicionar, editar e remover produtos da loja',
      icon: Package,
      href: '/admin/produtos',
      color: 'bg-blue-500',
      stats: `${stats.totalProducts} produtos`
    },
    {
      title: 'Gerenciar Pedidos',
      description: 'Visualizar e atualizar status dos pedidos',
      icon: ShoppingCart,
      href: '/admin/pedidos',
      color: 'bg-green-500',
      stats: `${stats.pendingOrders} pendentes`
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Administrar contas de usuários',
      icon: Users,
      href: '/admin/usuarios',
      color: 'bg-purple-500',
      stats: `${stats.totalUsers} usuários`
    },
    {
      title: 'Gerenciar Posts',
      description: 'Criar e editar posts do blog',
      icon: FileText,
      href: '/blog-admin',
      color: 'bg-orange-500',
      stats: 'Blog'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie sua loja digital, produtos, pedidos e usuários</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.activeProducts}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminSections.map((section) => (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {section.stats}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <p className="text-sm text-gray-600">{section.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full">
                  <Link to={section.href}>
                    <Eye className="w-4 h-4 mr-2" />
                    Acessar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Pedidos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{order.customer}</p>
                      <p className="text-xs text-gray-600">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatPrice(order.amount)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/admin/pedidos">
                    Ver todos os pedidos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to="/admin/produtos">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Novo Produto
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/admin/pedidos">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ver Pedidos Pendentes
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/admin/usuarios">
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Usuários
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/blog-admin">
                    <FileText className="w-4 h-4 mr-2" />
                    Criar Novo Post
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 