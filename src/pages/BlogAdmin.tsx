import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Eye, Calendar, User, Clock, Search, Plus, FileText } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { defaultCategories, defaultPosts, generateSlug, type BlogCategory, type BlogPost } from '@/data/blogData';

const BlogAdmin = () => {
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    tags: '',
    metaDescription: '',
    metaKeywords: '',
    isDraft: true,
    scheduledDate: '',
    image: ''
  });

  const [editingPost, setEditingPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('manage');

  // Estados para gerenciamento de categorias
  const [categories, setCategories] = useState<BlogCategory[]>(defaultCategories);

  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'blue'
  });

  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);

  const { toast } = useToast();

  // Configuração do ReactQuill
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'align', 'color', 'background',
    'blockquote', 'code-block'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postStatus = newPost.isDraft ? 'draft' : 
                      newPost.scheduledDate ? 'scheduled' : 'published';
    
    if (isEditing && editingPost) {
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { 
              ...editingPost, 
              ...newPost, 
              id: editingPost.id,
              status: postStatus,
              date: newPost.isDraft || newPost.scheduledDate ? editingPost.date : new Date().toISOString().split('T')[0]
            }
          : post
      ));
      
      toast({
        title: "Post atualizado com sucesso!",
        description: `Post ${postStatus === 'draft' ? 'salvo como rascunho' : postStatus === 'scheduled' ? 'agendado' : 'publicado'}.`,
      });
      
      setIsEditing(false);
      setEditingPost(null);
      setActiveTab('manage');
    } else {
      const post: BlogPost = {
        id: posts.length + 1,
        ...newPost,
        status: postStatus,
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min' // Valor padrão para readTime
      };

      setPosts([...posts, post]);
      
      toast({
        title: "Post criado com sucesso!",
        description: `Post ${postStatus === 'draft' ? 'salvo como rascunho' : postStatus === 'scheduled' ? 'agendado' : 'publicado'}.`,
      });
    }

    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      tags: '',
      metaDescription: '',
      metaKeywords: '',
      isDraft: true,
      scheduledDate: '',
      image: ''
    });
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      tags: post.tags,
      metaDescription: post.metaDescription || '',
      metaKeywords: post.metaKeywords || '',
      isDraft: post.status === 'draft',
      scheduledDate: post.scheduledDate || '',
      image: post.image || ''
    });
    setIsEditing(true);
    setActiveTab('create');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      tags: '',
      metaDescription: '',
      metaKeywords: '',
      isDraft: true,
      scheduledDate: '',
      image: ''
    });
  };

  const handlePublish = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: 'published', date: new Date().toISOString().split('T')[0] } : post
    ));
    
    toast({
      title: "Post publicado!",
      description: "O post está agora visível no blog.",
    });
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
    
    toast({
      title: "Post excluído",
      description: "O post foi removido permanentemente.",
    });
  };

  // Funções para gerenciamento de categorias
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditingCategory && editingCategory) {
      setCategories(categories.map(cat => 
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
      const category = {
        id: categories.length + 1,
        ...newCategory
      };

      setCategories([...categories, category]);
      
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

  const handleEditCategory = (category: any) => {
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
    // Verificar se há posts usando esta categoria
    const postsUsingCategory = posts.filter(post => post.category === categories.find(cat => cat.id === id)?.slug);
    
    if (postsUsingCategory.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Esta categoria está sendo usada por ${postsUsingCategory.length} post(s).`,
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.filter(cat => cat.id !== id));
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi removida permanentemente.",
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length
  };

  return (
    <div className="p-8">
      <SEOHead 
        title="Administração do Blog"
        description="Gerencie posts, categorias e conteúdo do blog CELX"
        keywords="blog admin, gestão de posts, CELX, administração"
      />
      
      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Administração do Blog
          </h1>
          <p className="text-gray-600 text-lg">
            Crie, edite e gerencie posts do blog
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total de Posts</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Publicados</p>
                  <p className="text-3xl font-bold">{stats.published}</p>
                </div>
                <Eye className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Rascunhos</p>
                  <p className="text-3xl font-bold">{stats.drafts}</p>
                </div>
                <Edit className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Agendados</p>
                  <p className="text-3xl font-bold">{stats.scheduled}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white shadow-sm">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{isEditing ? 'Editar Post' : 'Criar Post'}</span>
            <span className="sm:hidden">{isEditing ? 'Editar' : 'Criar'}</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Gerenciar Posts</span>
            <span className="sm:hidden">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Categorias</span>
            <span className="sm:hidden">Cats</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2 hidden lg:flex">
            <User className="h-4 w-4" />
            Comentários
          </TabsTrigger>
        </TabsList>

        {/* Criar/Editar Post */}
        <TabsContent value="create">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditing ? 'Editar Post' : 'Novo Post'}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {isEditing ? 'Edite o artigo selecionado' : 'Crie um novo artigo para o blog'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-base font-semibold">Título *</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        placeholder="Digite o título do post"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt" className="text-base font-semibold">Resumo</Label>
                      <Textarea
                        id="excerpt"
                        value={newPost.excerpt}
                        onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                        placeholder="Breve descrição do post"
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="image" className="text-base font-semibold">Imagem Principal</Label>
                      <Input
                        id="image"
                        type="url"
                        value={newPost.image}
                        onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                        placeholder="URL da imagem principal do post"
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Cole a URL da imagem (recomendado: 800x400px)
                      </p>
                      {newPost.image && (
                        <div className="mt-3">
                          <img 
                            src={newPost.image} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-base font-semibold">Categoria</Label>
                        <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.slug}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="author" className="text-base font-semibold">Autor</Label>
                        <Input
                          id="author"
                          value={newPost.author}
                          onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                          placeholder="Nome do autor"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
                      <Input
                        id="tags"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                        placeholder="Tags separadas por vírgula"
                        className="mt-2"
                      />
                    </div>

                    {/* Configurações de Publicação */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">Configurações de Publicação</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isDraft"
                            checked={newPost.isDraft}
                            onCheckedChange={(checked) => setNewPost({...newPost, isDraft: checked})}
                          />
                          <Label htmlFor="isDraft" className="text-base font-semibold">
                            Salvar como Rascunho
                          </Label>
                        </div>

                        {!newPost.isDraft && (
                          <div>
                            <Label htmlFor="scheduledDate" className="text-base font-semibold">
                              Data de Agendamento (opcional)
                            </Label>
                            <Input
                              id="scheduledDate"
                              type="datetime-local"
                              value={newPost.scheduledDate}
                              onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
                              className="mt-2"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Deixe em branco para publicar imediatamente
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="content" className="text-base font-semibold">Conteúdo *</Label>
                      <div className="mt-2">
                        <ReactQuill
                          theme="snow"
                          value={newPost.content}
                          onChange={(content) => setNewPost({...newPost, content})}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Escreva o conteúdo completo do post..."
                          style={{ height: '300px', marginBottom: '50px' }}
                        />
                      </div>
                    </div>

                    {/* SEO Fields */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">Configurações SEO</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="metaDescription" className="text-base font-semibold">Meta Descrição</Label>
                          <Textarea
                            id="metaDescription"
                            value={newPost.metaDescription}
                            onChange={(e) => setNewPost({...newPost, metaDescription: e.target.value})}
                            placeholder="Descrição para mecanismos de busca"
                            rows={3}
                            maxLength={160}
                            className="mt-2"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            {newPost.metaDescription.length}/160 caracteres
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="metaKeywords" className="text-base font-semibold">Palavras-chave SEO</Label>
                          <Input
                            id="metaKeywords"
                            value={newPost.metaKeywords}
                            onChange={(e) => setNewPost({...newPost, metaKeywords: e.target.value})}
                            placeholder="Palavras-chave separadas por vírgula"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} className="order-2 sm:order-1">
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" className="order-1 sm:order-2 bg-gradient-to-r from-blue-500 to-blue-600">
                    {isEditing ? 'Atualizar Post' : 'Salvar Post'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gerenciar Posts */}
        <TabsContent value="manage">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Posts Existentes
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Gerencie todos os posts do blog
                  </CardDescription>
                </div>
                
                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/90 w-full sm:w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-white/90 w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="published">Publicados</SelectItem>
                      <SelectItem value="draft">Rascunhos</SelectItem>
                      <SelectItem value="scheduled">Agendados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-all duration-200 border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        {post.image && (
                          <div className="lg:w-32 lg:flex-shrink-0">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-24 lg:h-20 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="font-semibold text-lg text-gray-900 flex-1">{post.title}</h3>
                            <Badge 
                              variant={post.status === 'published' ? 'default' : 'secondary'}
                              className={
                                post.status === 'published' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : post.status === 'scheduled'
                                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }
                            >
                              {post.status === 'published' ? 'Publicado' : 
                               post.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                            {post.scheduledDate && (
                              <span className="flex items-center gap-1 text-purple-600">
                                <Clock className="h-4 w-4" />
                                Agendado: {new Date(post.scheduledDate).toLocaleString()}
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(post)}
                            className="flex-1 lg:flex-none flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Editar</span>
                          </Button>
                          {(post.status === 'draft' || post.status === 'scheduled') && (
                            <Button 
                              size="sm" 
                              onClick={() => handlePublish(post.id)}
                              className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">Publicar</span>
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                            className="flex-1 lg:flex-none flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Excluir</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum post encontrado com os filtros aplicados.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categorias */}
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
                  {isEditingCategory ? 'Edite a categoria selecionada' : 'Crie uma nova categoria para os posts'}
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
                      placeholder="Ex: Tecnologia"
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
                      placeholder="tecnologia"
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
                  <FileText className="h-5 w-5" />
                  Categorias Existentes
                </CardTitle>
                <CardDescription className="text-green-100">
                  Gerencie todas as categorias do blog
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {categories.map((category) => {
                    const postsInCategory = posts.filter(post => post.category === category.slug).length;
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
                                <span className="text-sm text-gray-500">({postsInCategory} posts)</span>
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
                                disabled={postsInCategory > 0}
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
                  
                  {categories.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma categoria criada ainda.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comentários */}
        <TabsContent value="comments" className="hidden lg:block">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Gerenciar Comentários
              </CardTitle>
              <CardDescription className="text-blue-100">
                Modere os comentários dos posts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">João Silva</p>
                          <Badge variant="outline" className="text-xs">Pendente</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Em: O Futuro da Transformação Digital</p>
                        <p className="text-gray-700">Excelente artigo! Muito esclarecedor sobre as tendências do mercado.</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Há 2 horas
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          Aprovar
                        </Button>
                        <Button size="sm" variant="destructive">
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">Maria Santos</p>
                          <Badge variant="outline" className="text-xs">Pendente</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Em: Segurança Cibernética</p>
                        <p className="text-gray-700">Vocês oferecem consultoria em segurança? Gostaria de saber mais.</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Há 1 dia
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          Aprovar
                        </Button>
                        <Button size="sm" variant="destructive">
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogAdmin;
