import React, { useState, useEffect } from 'react';
import { Download, User, Package, CreditCard, Settings, LogOut, Eye, Calendar, FileText, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { getUserPurchasedProducts, BaserowOrder } from '@/services/orderService';
import { PurchasedProduct } from '@/services/orderService';

const MyAccount: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [orders, setOrders] = useState<BaserowOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para tratar URLs de imagem (igual à página da loja e OrderAdmin)
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

  // Componente de imagem com fallback (igual à página da loja e OrderAdmin)
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

  // Função para carregar dados do usuário
  const loadUserData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Carregar produtos comprados
      const products = await getUserPurchasedProducts(user.id);
      setPurchasedProducts(products);

      // Carregar pedidos do usuário
      const response = await fetch(`${import.meta.env.VITE_BASEROW_API_URL}/database/rows/table/${import.meta.env.VITE_BASEROW_ORDERS_TABLE_ID}/?user_field_names=true&size=100&order_by=-created_at`, {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        // Filtrar apenas pedidos do usuário atual
        const userOrders = ordersData.results.filter((order: BaserowOrder) => 
          order.user_id.toString() === user.id
        );
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar seus produtos e pedidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleDownload = async (productId: string, downloadUrl: string) => {
    try {
      // Simular download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `produto-${productId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ title: "Download iniciado!" });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({ title: "Erro no download", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você precisa estar logado para acessar esta página.</p>
          <Button asChild>
            <a href="/login">Fazer login</a>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
            <p className="text-gray-600 mt-2">Bem-vindo de volta, {user.name}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadUserData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Membro desde:</span>
                    <span className="font-medium">{formatDate(new Date('2024-01-01'))}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Produtos comprados:</span>
                    <span className="font-medium">{purchasedProducts.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pedidos:</span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {(() => {
                        if (!user?.role) return 'Usuário';
                        if (typeof user.role === 'object' && user.role !== null) {
                          const roleValue = (user.role as any).value || (user.role as any).id || 'user';
                          return roleValue === 'admin' ? 'Administrador' : 'Usuário';
                        }
                        return user.role === 'admin' ? 'Administrador' : 'Usuário';
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Meus Produtos
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pedidos
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Perfil
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Produtos Comprados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {purchasedProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto comprado</h3>
                        <p className="text-gray-600 mb-6">
                          Você ainda não comprou nenhum produto. Que tal começar agora?
                        </p>
                        <Button asChild>
                          <a href="/loja">Ver produtos</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {purchasedProducts.map((purchase) => (
                          <Card key={purchase.id} className="overflow-hidden">
                            <div className="flex">
                              <div className="w-24 h-24 flex-shrink-0">
                                <ProductImage
                                  src={getImageUrl(purchase.productImage)}
                                  alt={purchase.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                      {purchase.productName}
                                    </h3>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Comprado em {formatDate(purchase.purchaseDate)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        <span>{purchase.downloadCount} download{purchase.downloadCount !== 1 ? 's' : ''}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        Válido até {formatDate(purchase.expiresAt)}
                                      </Badge>
                                      <Badge className="text-xs bg-green-100 text-green-800">
                                        {purchase.status === 'completed' ? 'Ativo' : 'Pendente'}
                                      </Badge>
                                      <span className="text-sm font-medium text-gray-900">
                                        {formatPrice(purchase.price)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownload(purchase.productId, '#')}
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Baixar
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      asChild
                                    >
                                      <a href={`/produto/${purchase.productId}`}>
                                        <Eye className="w-4 h-4" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                        <p className="text-gray-600 mb-6">
                          Você ainda não fez nenhum pedido. Que tal começar agora?
                        </p>
                        <Button asChild>
                          <a href="/loja">Ver produtos</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id} className="overflow-hidden">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold">Pedido #{order.id}</h3>
                                  <p className="text-sm text-gray-600">
                                    {formatDate(new Date(order.created_at))}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  {getStatusBadge(order.status)}
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatPrice(parseFloat(order.total))}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">Pedido #{order.id}</h4>
                                  <p className="text-sm text-gray-600">
                                    {order.payment_method} • {order.payment_status}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <a href={`/pedido/${order.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver detalhes
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Nome</label>
                          <p className="text-gray-900">{user.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Tipo de conta</label>
                          <p className="text-gray-900 capitalize">
                            {(() => {
                              if (!user?.role) return 'Usuário';
                              if (typeof user.role === 'object' && user.role !== null) {
                                const roleValue = (user.role as any).value || (user.role as any).id || 'user';
                                return roleValue === 'admin' ? 'Administrador' : 'Usuário';
                              }
                              return user.role === 'admin' ? 'Administrador' : 'Usuário';
                            })()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Membro desde</label>
                          <p className="text-gray-900">{formatDate(new Date('2024-01-01'))}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Estatísticas da conta</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{purchasedProducts.length}</div>
                            <div className="text-sm text-gray-600">Produtos</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {purchasedProducts.reduce((sum, p) => sum + p.downloadCount, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Downloads</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{orders.length}</div>
                            <div className="text-sm text-gray-600">Pedidos</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {formatPrice(purchasedProducts.reduce((sum, p) => sum + p.price, 0))}
                            </div>
                            <div className="text-sm text-gray-600">Total gasto</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount; 