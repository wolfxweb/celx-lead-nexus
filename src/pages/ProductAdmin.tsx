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
import { mockProducts } from '@/data/products';
import { Product } from '@/types/ecommerce';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Importando nosso serviço e tipos
import { 
  getProductCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  generateUniqueSlug,
  type Category 
} from '@/services/categoryService';

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type BaserowProduct
} from '@/services/productService';

import { getAllCourses, type Course } from '@/services/courseService';
import { getWhatsAppLicenses, type WhatsAppLicense } from '@/services/whatsappService';

const ProductAdmin: React.FC = () => {
  const [products, setProducts] = useState<BaserowProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<BaserowProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BaserowProduct | null>(null);

  // Estados para gerenciamento de categorias (ATUALIZADO)
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'blue'
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  // --> NOVOS ESTADOS
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [whatsappLicenses, setWhatsappLicenses] = useState<WhatsAppLicense[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(true);
  // <-- FIM NOVOS ESTADOS

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    category_id: '',
    tags: '',
    image: '',
    images: '',
    video: '',
    fileSize: '',
    fileType: '',
    isActive: 'true',
    isFeatured: 'false',
    product_type: 'Download',
    linked_course_id: '',
    whatsapp_license_id: '',
  });

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);

  // Função para buscar produtos (COM DEBUG)
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const { products: fetchedProducts } = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({ title: "Erro ao carregar produtos", variant: "destructive" });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // --> NOVA FUNÇÃO
  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      toast({
        title: "Erro ao buscar cursos",
        description: "Não foi possível carregar a lista de cursos.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchLicenses = async () => {
    try {
      setIsLoadingLicenses(true);
      const licenses = await getWhatsAppLicenses();
      setWhatsappLicenses(licenses);
    } catch (error) {
      toast({ title: 'Erro ao buscar licenças WhatsApp', variant: 'destructive' });
    } finally {
      setIsLoadingLicenses(false);
    }
  };

  // Hook para buscar categorias do Baserow
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const categories = await getProductCategories();
      setProductCategories(categories);
    } catch (error) {
      toast({
        title: "Erro ao buscar categorias",
        description: "Não foi possível carregar as categorias de produtos.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchCourses();
    fetchLicenses();
  }, [toast]);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      // CORREÇÃO: Filtrar pelo nome da categoria
      filtered = filtered.filter(product => product.category_id === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numPrice);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData: any = {
        name: formData.name,
        description: formData.description,
        short_description: formData.shortDescription,
        price: formData.price,
        original_price: formData.originalPrice,
        category_id: formData.category_id,
        tags: formData.tags,
        image: formData.image,
        images: formData.images,
        video_url: formData.video,
        is_active: formData.isActive,
        is_featured: formData.isFeatured,
        sales_count: editingProduct?.sales_count || '0',
        rating: editingProduct?.rating || '0',
        product_type: formData.product_type,
        whatsapp_license_id: formData.product_type === 'Licença WhatsApp' ? formData.whatsapp_license_id : '',
      };

      if (formData.product_type === 'Curso') {
        productData.linked_course_id = formData.linked_course_id;
        productData.file_size = '';
        productData.file_type = '';
        productData.whatsapp_license_id = '';
      } else if (formData.product_type === 'Download') {
        productData.file_size = formData.fileSize;
        productData.file_type = formData.fileType;
        productData.linked_course_id = '';
        productData.whatsapp_license_id = '';
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({ title: "Produto atualizado!" });
      } else {
        await createProduct(productData);
        toast({ title: "Produto criado!" });
      }
      
      // Recarregar os produtos do Baserow para garantir sincronização
      await fetchProducts();
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({ title: "Erro ao salvar produto", variant: "destructive" });
    }
  };

  const handleEdit = (product: BaserowProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.short_description || '',
      price: product.price || '',
      originalPrice: product.original_price || '',
      category_id: product.category_id || '',
      tags: product.tags || '',
      image: product.image || '',
      images: product.images || '',
      video: product.video_url || '',
      fileSize: product.file_size || '',
      fileType: product.file_type || '',
      isActive: product.is_active || 'true',
      isFeatured: product.is_featured || 'false',
      product_type: product.product_type || 'Download',
      linked_course_id: product.linked_course_id || '',
      whatsapp_license_id: product.whatsapp_license_id || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      
      // Recarregar os produtos do Baserow para garantir sincronização
      await fetchProducts();
      
      toast({ title: "Produto excluído!" });
    } catch (error) {
      toast({ title: "Erro ao excluir produto", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      category_id: '',
      tags: '',
      image: '',
      images: '',
      video: '',
      fileSize: '',
      fileType: '',
      isActive: 'true',
      isFeatured: 'false',
      product_type: 'Download',
      linked_course_id: '',
      whatsapp_license_id: '',
    });
    setEditingProduct(null);
  };

  const addImageField = () => {
    const currentImages = formData.images ? formData.images.split(';').filter(img => img.trim()) : [];
    const newImages = [...currentImages, ''];
    setFormData({
      ...formData,
      images: newImages.join(';')
    });
  };

  const removeImageField = (index: number) => {
    const currentImages = formData.images ? formData.images.split(';').filter(img => img.trim()) : [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.join(';')
    });
  };

  const updateImageField = (index: number, value: string) => {
    const currentImages = formData.images ? formData.images.split(';') : [];
    currentImages[index] = value;
    setFormData({
      ...formData,
      images: currentImages.join(';')
    });
  };

  // Funções para gerenciamento de categorias (CORRIGIDAS)
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditingCategory && editingCategory) {
        // Atualizar categoria
        const slug = await generateUniqueSlug(newCategory.name, editingCategory.id);
        await updateCategory(editingCategory.id, { 
          name: newCategory.name,
          slug,
          description: newCategory.description,
          color: newCategory.color
        });
        
        toast({ title: "Categoria atualizada com sucesso!" });
        
      } else {
        // Criar nova categoria
        const slug = await generateUniqueSlug(newCategory.name);
        const newCatData = { ...newCategory, slug, type: 'product' as const };
        await createCategory(newCatData);
        
        toast({ title: "Categoria criada com sucesso!" });
      }

      // Recarregar as categorias do Baserow para garantir sincronização
      await fetchCategories();
      
      resetCategoryForm();
    } catch (error) {
       toast({
        title: "Erro ao salvar categoria",
        description: "Não foi possível completar a operação.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: Category) => {
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

  const resetCategoryForm = () => {
    setIsEditingCategory(false);
    setEditingCategory(null);
    setNewCategory({ name: '', slug: '', description: '', color: 'blue' });
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      
      // Recarregar as categorias do Baserow para garantir sincronização
      await fetchCategories();
      
      toast({ title: "Categoria excluída com sucesso." });
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: "Verifique se a categoria não está sendo usada por um produto.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEditCategory = () => {
    resetCategoryForm();
  };

  // Função para calcular estatísticas dos produtos
  const calculateProductStats = () => {
    let totalRevenue = 0;
    let totalSales = 0;
    let totalRating = 0;
    let ratedProducts = 0;

    products.forEach(product => {
      const price = parseFloat(product.price) || 0;
      const sales = parseInt(product.sales_count) || 0;
      const rating = parseFloat(product.rating) || 0;

      totalRevenue += price * sales;
      totalSales += sales;

      if (rating > 0) {
        totalRating += rating;
        ratedProducts++;
      }
    });

    const averageRating = ratedProducts > 0 ? totalRating / ratedProducts : 0;

    return {
      totalRevenue,
      totalSales,
      averageRating,
      productCount: products.length
    };
  };

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
                  <Label htmlFor="product_type">Tipo de Produto</Label>
                  <Select
                    value={formData.product_type}
                    onValueChange={(value) => setFormData({ ...formData, product_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Download">Produto Digital (Download)</SelectItem>
                      <SelectItem value="Curso">Curso Online</SelectItem>
                      <SelectItem value="Licença WhatsApp">Licença WhatsApp</SelectItem>
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
                <Label htmlFor="description">Descrição Completa</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={5} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Categoria</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCategories ? (
                        <SelectItem value="loading" disabled>Carregando categorias...</SelectItem>
                      ) : (
                        productCategories.map(category => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por ;)</Label>
                  <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="ex: novo;digital;importante" />
                </div>
              </div>

              {formData.product_type === 'Curso' && (
                <div className="space-y-2">
                  <Label htmlFor="linked_course_id">Vincular a um Curso Existente</Label>
                  <Select
                    value={formData.linked_course_id}
                    onValueChange={(value) => setFormData({ ...formData, linked_course_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso..." />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCourses ? (
                        <SelectItem value="loading" disabled>Carregando cursos...</SelectItem>
                      ) : courses.length === 0 ? (
                        <SelectItem value="no-courses" disabled>Nenhum curso disponível</SelectItem>
                      ) : (
                        courses.map(course => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {courses.length === 0 && !isLoadingCourses && (
                    <p className="text-sm text-muted-foreground">
                      Nenhum curso encontrado. <a href="/admin/cursos" className="text-primary hover:underline">Criar um curso primeiro</a>.
                    </p>
                  )}
                </div>
              )}

              {formData.product_type === 'Licença WhatsApp' && (
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_license_id">Plano/Licença WhatsApp</Label>
                  <Select
                    value={formData.whatsapp_license_id}
                    onValueChange={(value) => setFormData({ ...formData, whatsapp_license_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano/licença" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingLicenses ? (
                        <SelectItem value="loading" disabled>Carregando planos...</SelectItem>
                      ) : whatsappLicenses.length === 0 ? (
                        <SelectItem value="no-licenses" disabled>Nenhum plano disponível</SelectItem>
                      ) : (
                        whatsappLicenses.map(license => (
                          <SelectItem key={license.id} value={license.id}>
                            {license.name} - {license.price ? `R$ ${license.price}` : ''}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
                {formData.images.split(';').map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      value={image}
                      onChange={(e) => updateImageField(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.split(';').length > 1 && (
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

              {formData.product_type === 'Download' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fileSize">Tamanho do Arquivo (ex: 15MB)</Label>
                    <Input
                      id="fileSize"
                      value={formData.fileSize}
                      onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileType">Tipo do Arquivo (ex: PDF, ZIP)</Label>
                    <Input
                      id="fileType"
                      value={formData.fileType}
                      onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive === 'true'}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked ? 'true' : 'false'})}
                  />
                  <Label htmlFor="isActive">Produto Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured === 'true'}
                    onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked ? 'true' : 'false'})}
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
                    <p className="text-2xl font-bold">{formatPrice(calculateProductStats().totalRevenue.toString())}</p>
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
                    <p className="text-2xl font-bold">{calculateProductStats().totalSales}</p>
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
                    <p className="text-2xl font-bold">{calculateProductStats().averageRating.toFixed(1)}</p>
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
                  {isLoadingProducts ? (
                    <TableRow><TableCell colSpan={7}>Carregando produtos...</TableCell></TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.short_description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {product.category_id}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatPrice(product.price)}</p>
                            {product.original_price && parseFloat(product.original_price) > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(product.original_price)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.sales_count}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge className={product.is_active === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {product.is_active === 'true' ? 'Ativo' : 'Inativo'}
                            </Badge>
                            {product.is_featured === 'true' && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Destaque
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Categorias */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isEditingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</CardTitle>
              <CardDescription>
                {isEditingCategory ? 'Altere os detalhes da categoria.' : 'Crie uma nova categoria para organizar seus produtos.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Nome da Categoria</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Ex: Templates de Sites"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Descrição</Label>
                  <Textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Uma breve descrição da categoria."
                  />
                </div>
                <div>
                  <Label htmlFor="categoryColor">Cor</Label>
                  <Input
                    id="categoryColor"
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">{isEditingCategory ? 'Salvar Alterações' : 'Criar Categoria'}</Button>
                  {isEditingCategory && (
                    <Button variant="outline" onClick={handleCancelEditCategory}>Cancelar</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCategories ? (
                    <TableRow><TableCell colSpan={3}>Carregando categorias...</TableCell></TableRow>
                  ) : (
                    productCategories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell>
                          <Badge style={{ backgroundColor: cat.color, color: '#fff' }}>{cat.name}</Badge>
                        </TableCell>
                        <TableCell>{cat.slug}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleEditCategory(cat)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductAdmin; 