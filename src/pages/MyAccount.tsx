import React, { useState } from 'react';
import { Download, User, Package, CreditCard, Settings, LogOut, Eye, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockProducts } from '@/data/products';

// Mock purchased products data
const mockPurchasedProducts = [
  {
    id: '1',
    productId: '1',
    productName: 'Template de Landing Page Premium',
    productImage: '/images/products/landing-template.jpg',
    purchaseDate: new Date('2024-12-15'),
    downloadUrl: 'https://example.com/downloads/landing-template.zip',
    downloadCount: 3,
    expiresAt: new Date('2025-12-15'),
    status: 'active'
  },
  {
    id: '2',
    productId: '4',
    productName: 'E-book: Guia de Vendas Online',
    productImage: '/images/products/sales-ebook.jpg',
    purchaseDate: new Date('2024-12-10'),
    downloadUrl: 'https://example.com/downloads/sales-ebook.pdf',
    downloadCount: 1,
    expiresAt: new Date('2025-12-10'),
    status: 'active'
  }
];

const MyAccount: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const handleDownload = (productId: string, downloadUrl: string) => {
    // Simulate download
    console.log(`Downloading ${productId} from ${downloadUrl}`);
    // In a real app, this would trigger the actual download
    alert('Download iniciado!');
  };

  const handleLogout = () => {
    logout();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
            <p className="text-gray-600 mt-2">Bem-vindo de volta, {user.name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
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
                    <span className="font-medium">{mockPurchasedProducts.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="secondary" className="text-xs">
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
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
                    {mockPurchasedProducts.length === 0 ? (
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
                        {mockPurchasedProducts.map((purchase) => (
                          <Card key={purchase.id} className="overflow-hidden">
                            <div className="flex">
                              <div className="w-24 h-24 flex-shrink-0">
                                <img
                                  src={purchase.productImage}
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
                                        {purchase.status === 'active' ? 'Ativo' : 'Expirado'}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownload(purchase.productId, purchase.downloadUrl)}
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
                    <div className="space-y-4">
                      {mockPurchasedProducts.map((purchase) => (
                        <Card key={purchase.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-semibold">Pedido #{purchase.id}</h3>
                                <p className="text-sm text-gray-600">
                                  {formatDate(purchase.purchaseDate)}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Concluído
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <img
                                src={purchase.productImage}
                                alt={purchase.productName}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{purchase.productName}</h4>
                                <p className="text-sm text-gray-600">
                                  Download disponível até {formatDate(purchase.expiresAt)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(purchase.productId, purchase.downloadUrl)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Baixar
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
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
                          <p className="text-gray-900 capitalize">{user.role}</p>
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
                            <div className="text-2xl font-bold text-blue-600">{mockPurchasedProducts.length}</div>
                            <div className="text-sm text-gray-600">Produtos</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">3</div>
                            <div className="text-sm text-gray-600">Downloads</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">2</div>
                            <div className="text-sm text-gray-600">Pedidos</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">30</div>
                            <div className="text-sm text-gray-600">Dias ativo</div>
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