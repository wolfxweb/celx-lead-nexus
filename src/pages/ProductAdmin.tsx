import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, Package, DollarSign, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { mockProducts, categories } from '@/data/products';
import { Product } from '@/types/ecommerce';
import { defaultProductCategories, generateSlug, type ProductCategory } from '@/data/productData';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estados para gerenciamento de categorias
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(defaultProductCategories);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'blue'
  });
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    category: '',
    tags: '',
    image: '',
    images: [''],
    video: '',
    fileSize: '',
    fileType: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: formData.image,
      images: formData.images.filter(img => img.trim()),
      video: formData.video || undefined,
      fileSize: formData.fileSize,
      fileType: formData.fileType,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      createdAt: editingProduct?.createdAt || new Date(),
      updatedAt: new Date(),
      salesCount: editingProduct?.salesCount || 0,
      rating: editingProduct?.rating || 0,
      reviews: editingProduct?.reviews || []
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      tags: product.tags.join(', '),
      image: product.image,
      images: product.images.length > 0 ? product.images : [''],
      video: product.video || '',
      fileSize: product.fileSize || '',
      fileType: product.fileType || '',
      isActive: product.isActive,
      isFeatured: product.isFeatured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      category: '',
      tags: '',
      image: '',
      images: [''],
      video: '',
      fileSize: '',
      fileType: '',
      isActive: true,
      isFeatured: false
    });
    setEditingProduct(null);
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.length > 0 ? newImages : ['']
    });
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // Funções para gerenciamento de categorias
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditingCategory && editingCategory) {
      setProductCategories(productCategories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...editingCategory, ...newCategory }
          : cat
      ));
      
      toast({
        title: "Categoria atualizada com sucesso!",
        description: "A categoria foi atualizada.",
      });
      
      setIsEditingCategory(false);
      setEditingCategory(null);
    } else {
      const category: ProductCategory = {
        id: productCategories.length + 1,
        ...newCategory
      };

      setProductCategories([...productCategories, category]);
      
      toast({
        title: "Categoria criada com sucesso!",
        description: "A nova categoria foi adicionada.",
      });
    }

    setNewCategory({
      name: '',
      slug: '',
      description: '',
      color: 'blue'
    });
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color
    });
    setIsEditingCategory(true);
    setActiveTab('categories');
  };

  const handleCancelEditCategory = () => {
    setIsEditingCategory(false);
    setEditingCategory(null);
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      color: 'blue'
    });
  };

  const handleDeleteCategory = (id: number) => {
    // Verificar se há produtos usando esta categoria
    const productsUsingCategory = products.filter(product => product.category === productCategories.find(cat => cat.id === id)?.slug);
    
    if (productsUsingCategory.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Esta categoria está sendo usada por ${productsUsingCategory.length} produto(s).`,
        variant: "destructive"
      });
      return;
    }

    setProductCategories(productCategories.filter(cat => cat.id !== id));
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi removida permanentemente.",
    });
  };

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.salesCount), 0);
  const totalSales = products.reduce((sum, product) => sum + product.salesCount, 0);
  const averageRating = products.length > 0 
    ? products.reduce((sum, product) => sum + product.rating, 0) / products.length 
    : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Produtos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os produtos da sua loja</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(category => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descrição Curta *</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Completa *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Preço Original (opcional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagem Principal *</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Imagens Adicionais (para carrossel)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                </div>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      value={image}
                      onChange={(e) => updateImageField(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImageField(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">URL do Vídeo (opcional)</Label>
                <Input
                  id="video"
                  type="url"
                  value={formData.video}
                  onChange={(e) => setFormData({...formData, video: e.target.value})}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                />
                <p className="text-sm text-muted-foreground">
                  Para YouTube, use o formato: https://www.youtube.com/embed/VIDEO_ID
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileSize">Tamanho do Arquivo</Label>
                  <Input
                    id="fileSize"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({...formData, fileSize: e.target.value})}
                    placeholder="ex: 2.5 MB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileType">Tipo do Arquivo</Label>
                  <Input
                    id="fileType"
                    value={formData.fileType}
                    onChange={(e) => setFormData({...formData, fileType: e.target.value})}
                    placeholder="ex: PDF, ZIP, MP4"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Produto Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})}
                  />
                  <Label htmlFor="isFeatured">Produto em Destaque</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Badge className="h-4 w-4" />
            Categorias
          </TabsTrigger>
        </TabsList>

        {/* Aba de Produtos */}
        <TabsContent value="products">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold">{products.length}</p>
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
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Vendas</p>
                    <p className="text-2xl font-bold">{totalSales}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avaliação Média</p>
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
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
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {productCategories.map(category => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.shortDescription}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatPrice(product.price)}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.salesCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {product.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                          {product.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Destaque
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a href={`/produto/${product.id}`}>
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Categorias */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Categoria */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  {isEditingCategory ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {isEditingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {isEditingCategory ? 'Edite a categoria selecionada' : 'Crie uma nova categoria para os produtos'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName" className="text-base font-semibold">Nome da Categoria *</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({
                        ...newCategory, 
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      })}
                      placeholder="Ex: Templates"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="categorySlug" className="text-base font-semibold">Slug</Label>
                    <Input
                      id="categorySlug"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                      placeholder="templates"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      URL amigável (gerado automaticamente)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="categoryDescription" className="text-base font-semibold">Descrição</Label>
                    <Textarea
                      id="categoryDescription"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder="Breve descrição da categoria"
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoryColor" className="text-base font-semibold">Cor</Label>
                    <Select value={newCategory.color} onValueChange={(value) => setNewCategory({...newCategory, color: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Azul</SelectItem>
                        <SelectItem value="red">Vermelho</SelectItem>
                        <SelectItem value="green">Verde</SelectItem>
                        <SelectItem value="purple">Roxo</SelectItem>
                        <SelectItem value="orange">Laranja</SelectItem>
                        <SelectItem value="indigo">Índigo</SelectItem>
                        <SelectItem value="pink">Rosa</SelectItem>
                        <SelectItem value="teal">Teal</SelectItem>
                        <SelectItem value="yellow">Amarelo</SelectItem>
                        <SelectItem value="gray">Cinza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    {isEditingCategory && (
                      <Button type="button" variant="outline" onClick={handleCancelEditCategory} className="order-2 sm:order-1">
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit" className="order-1 sm:order-2 bg-gradient-to-r from-green-500 to-green-600">
                      {isEditingCategory ? 'Atualizar Categoria' : 'Salvar Categoria'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Categorias */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Badge className="h-5 w-5" />
                  Categorias Existentes
                </CardTitle>
                <CardDescription className="text-green-100">
                  Gerencie todas as categorias de produtos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {productCategories.map((category) => {
                    const productsInCategory = products.filter(product => product.category === category.slug).length;
                    return (
                      <Card key={category.id} className="hover:shadow-md transition-all duration-200 border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={`bg-${category.color}-100 text-${category.color}-800 hover:bg-${category.color}-200`}
                                >
                                  {category.name}
                                </Badge>
                                <span className="text-sm text-gray-500">({productsInCategory} produtos)</span>
                              </div>
                              <p className="text-sm text-gray-600">{category.description}</p>
                              <p className="text-xs text-gray-400">Slug: {category.slug}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditCategory(category)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline">Editar</span>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="flex items-center gap-1"
                                disabled={productsInCategory > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Excluir</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {productCategories.length === 0 && (
                    <div className="text-center py-12">
                      <Badge className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma categoria criada ainda.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductAdmin; 