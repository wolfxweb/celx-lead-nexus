import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, ShoppingCart, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultProductCategories } from '@/data/productData';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/ecommerce';
import { Link } from 'react-router-dom';
import { getAllProducts, type BaserowProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [products, setProducts] = useState<BaserowProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();

  // Buscar produtos do Baserow
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllProducts({
          limit: 100,
          search: searchTerm
        });
        
        // Debug: mostrar informações sobre as imagens
        console.log('Produtos carregados:', response.products.map(p => ({
          id: p.id,
          name: p.name,
          image: p.image,
          hasImage: !!p.image && p.image.trim() !== ''
        })));
        
        setProducts(response.products);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar produtos. Tente novamente.');
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, toast]);

  // Converter BaserowProduct para Product (tipo usado pelo carrinho)
  const convertToProduct = (baserowProduct: BaserowProduct): Product => {
    // Função para tratar URLs de imagem
    const getImageUrl = (imageUrl: string) => {
      console.log('Processando URL de imagem:', imageUrl);
      
      if (!imageUrl || imageUrl.trim() === '') {
        console.log('URL vazia, usando imagem padrão');
        return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop';
      }
      
      let processedUrl = imageUrl.trim();
      
      // Se a URL não tem protocolo, adicionar https://
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
        console.log('URL sem protocolo, adicionado https://:', processedUrl);
      }
      
      // Verificar se é uma URL válida
      try {
        new URL(processedUrl);
        console.log('URL válida:', processedUrl);
        return processedUrl;
      } catch (error) {
        console.log('URL inválida, usando imagem padrão:', processedUrl);
        return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop';
      }
    };

    return {
      id: baserowProduct.id.toString(),
      name: baserowProduct.name,
      description: baserowProduct.description,
      shortDescription: baserowProduct.short_description,
      price: parseFloat(baserowProduct.price) || 0,
      originalPrice: baserowProduct.original_price ? parseFloat(baserowProduct.original_price) : undefined,
      category: baserowProduct.category_id,
      tags: baserowProduct.tags ? baserowProduct.tags.split(',').map(tag => tag.trim()) : [],
      image: getImageUrl(baserowProduct.image),
      images: baserowProduct.images ? baserowProduct.images.split(';').filter(img => img.trim()).map(getImageUrl) : [],
      video: baserowProduct.video_url,
      fileSize: baserowProduct.file_size,
      fileType: baserowProduct.file_type,
      isActive: baserowProduct.is_active === 'true',
      isFeatured: baserowProduct.is_featured === 'true',
      createdAt: new Date(baserowProduct.created_at),
      updatedAt: new Date(baserowProduct.updated_at),
      salesCount: parseInt(baserowProduct.sales_count) || 0,
      rating: parseFloat(baserowProduct.rating) || 0,
      reviews: []
    };
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => product.is_active === 'true');

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-high':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'rating':
          return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
        case 'sales':
          return (parseInt(b.sales_count) || 0) - (parseInt(a.sales_count) || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, sortBy]);

  const handleAddToCart = (baserowProduct: BaserowProduct) => {
    const product = convertToProduct(baserowProduct);
    addItem(product);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numPrice);
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(numRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Loja de Produtos Digitais
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Descubra produtos digitais de alta qualidade para impulsionar seu negócio
            </p>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {defaultProductCategories.map(category => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="price-low">Preço: Menor</SelectItem>
                    <SelectItem value="price-high">Preço: Maior</SelectItem>
                    <SelectItem value="rating">Melhor Avaliado</SelectItem>
                    <SelectItem value="sales">Mais Vendidos</SelectItem>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
              <div className="text-gray-500 text-lg">
                Carregando produtos...
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">
                {error}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setError(null);
                }}
              >
                Tentar novamente
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                Nenhum produto encontrado
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop';
                      }}
                    />
                    {product.original_price && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)}% OFF
                      </Badge>
                    )}
                    {product.is_featured === 'true' && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        Destaque
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                        <span className="ml-1">({parseFloat(product.rating).toFixed(1)})</span>
                      </div>
                      <span>•</span>
                      <span>{parseInt(product.sales_count) || 0} vendas</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.short_description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    {product.file_size && (
                      <p className="text-xs text-gray-500 mt-1">
                        {product.file_size} • {product.file_type}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/produto/${product.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalhes
                        </Link>
                      </Button>
                      
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart(product.id.toString())}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isInCart(product.id.toString()) ? 'No carrinho' : 'Adicionar'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Store; 