import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ChevronLeft, ChevronRight, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/services/newsletterService';
import SEOHead from '@/components/SEOHead';
import { defaultPosts, defaultCategories, type BlogPost } from '@/data/blogData';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const postsPerPage = 12;

  // Usar posts compartilhados e filtrar apenas os publicados
  const posts = defaultPosts.filter(post => post.status === 'published');

  // Criar categorias dinâmicas baseadas nos posts existentes
  const categoryCounts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    { id: 'all', name: 'Todos', count: posts.length },
    ...defaultCategories
      .filter(cat => categoryCounts[cat.slug])
      .map(cat => ({
        id: cat.slug,
        name: cat.name,
        count: categoryCounts[cat.slug] || 0
      }))
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginação
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset para primeira página ao mudar categoria
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset para primeira página ao buscar
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);

    try {
      // Usar o serviço de newsletter com Baserow
      await subscribeToNewsletter(newsletterEmail, undefined, 'blog');
      
      // Sucesso
      setIsSubscribed(true);
      setNewsletterEmail('');
      
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Você receberá nossas atualizações por email.",
      });

      // Reset após 3 segundos
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);

    } catch (error: any) {
      console.error('Erro ao inscrever na newsletter:', error);
      
      let errorMessage = "Ocorreu um erro. Tente novamente.";
      if (error.message === 'Este email já está inscrito na newsletter') {
        errorMessage = "Este email já está inscrito na newsletter.";
      }
      
      toast({
        title: "Erro ao inscrever",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <SEOHead 
        title="Blog CELX - Insights sobre Tecnologia e Inovação"
        description="Acompanhe as últimas tendências em transformação digital, segurança cibernética, cloud computing e inteligência artificial. Conteúdo especializado da CELX."
        keywords="blog tecnologia, transformação digital, segurança cibernética, cloud computing, inteligência artificial, inovação empresarial"
      />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog CELX
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tendências e conhecimento sobre tecnologia e inovação
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Por {post.author}</span>
                  <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link to={`/blog/${post.id}`}>
                    Ler mais
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum artigo encontrado com os filtros aplicados.</p>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Info da paginação */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-6 text-sm text-gray-500">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPosts.length)} de {filteredPosts.length} artigos
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-24 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Fique por dentro das novidades!
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Inscreva-se em nossa newsletter e receba os melhores artigos sobre tecnologia, 
                  inovação e transformação digital diretamente no seu email.
                </p>

                {isSubscribed ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 px-6 py-4 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Inscrição realizada com sucesso!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Seu melhor email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1"
                      disabled={isSubscribing}
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubscribing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubscribing ? 'Inscrevendo...' : 'Inscrever-se'}
                    </Button>
                  </form>
                )}

                <p className="text-sm text-gray-500 mt-4">
                  Não enviamos spam. Você pode cancelar a inscrição a qualquer momento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
