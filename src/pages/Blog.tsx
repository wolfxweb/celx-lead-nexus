import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Mock data para posts do blog
  const posts = [
    {
      id: 1,
      title: 'O Futuro da Transformação Digital nas Empresas',
      excerpt: 'Descubra como a transformação digital está moldando o futuro dos negócios e como sua empresa pode se preparar.',
      category: 'tecnologia',
      author: 'Carlos Silva',
      date: '2024-06-15',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'Segurança Cibernética: Protegendo Seus Dados',
      excerpt: 'As melhores práticas para manter sua empresa segura no ambiente digital atual.',
      category: 'seguranca',
      author: 'Ana Costa',
      date: '2024-06-10',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Cloud Computing: Benefícios e Implementação',
      excerpt: 'Como migrar para a nuvem pode revolucionar sua infraestrutura de TI.',
      category: 'cloud',
      author: 'Pedro Santos',
      date: '2024-06-05',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'Inteligência Artificial: Oportunidades de Negócio',
      excerpt: 'Explore como a IA pode criar novas oportunidades e otimizar processos empresariais.',
      category: 'ai',
      author: 'Maria Oliveira',
      date: '2024-05-30',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      title: 'Marketing Digital: Estratégias para 2024',
      excerpt: 'As principais tendências e estratégias de marketing digital para o próximo ano.',
      category: 'marketing',
      author: 'Fernanda Lima',
      date: '2024-05-25',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      title: 'Desenvolvimento Web: Frameworks Modernos',
      excerpt: 'Uma análise dos frameworks mais populares para desenvolvimento web em 2024.',
      category: 'desenvolvimento',
      author: 'Roberto Alves',
      date: '2024-05-20',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop'
    },
    {
      id: 7,
      title: 'UX/UI Design: Princípios Fundamentais',
      excerpt: 'Os princípios essenciais para criar interfaces intuitivas e atraentes.',
      category: 'design',
      author: 'Juliana Costa',
      date: '2024-05-15',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop'
    },
    {
      id: 8,
      title: 'E-commerce: Tendências e Melhores Práticas',
      excerpt: 'Como criar uma experiência de compra online excepcional.',
      category: 'ecommerce',
      author: 'Lucas Mendes',
      date: '2024-05-10',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop'
    },
    {
      id: 9,
      title: 'Mobile First: Design Responsivo',
      excerpt: 'Por que o design mobile-first é essencial nos dias de hoje.',
      category: 'mobile',
      author: 'Camila Santos',
      date: '2024-05-05',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop'
    },
    {
      id: 10,
      title: 'SEO Avançado: Técnicas para 2024',
      excerpt: 'Estratégias avançadas de SEO para melhorar o ranking do seu site.',
      category: 'seo',
      author: 'Diego Oliveira',
      date: '2024-04-30',
      readTime: '9 min',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop'
    },
    {
      id: 11,
      title: 'Analytics: Medindo o Sucesso Digital',
      excerpt: 'Como usar dados para tomar decisões estratégicas no marketing digital.',
      category: 'analytics',
      author: 'Patrícia Silva',
      date: '2024-04-25',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
    },
    {
      id: 12,
      title: 'Automação de Marketing: Ferramentas Essenciais',
      excerpt: 'As melhores ferramentas para automatizar suas campanhas de marketing.',
      category: 'automacao',
      author: 'Ricardo Ferreira',
      date: '2024-04-20',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop'
    },
    {
      id: 13,
      title: 'Redes Sociais: Estratégias de Engajamento',
      excerpt: 'Como aumentar o engajamento nas suas redes sociais.',
      category: 'redes-sociais',
      author: 'Amanda Costa',
      date: '2024-04-15',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop'
    },
    {
      id: 14,
      title: 'Content Marketing: Criando Conteúdo Valioso',
      excerpt: 'Estratégias para criar conteúdo que realmente engaja sua audiência.',
      category: 'content',
      author: 'Thiago Martins',
      date: '2024-04-10',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: posts.length },
    { id: 'tecnologia', name: 'Tecnologia', count: 1 },
    { id: 'seguranca', name: 'Segurança', count: 1 },
    { id: 'cloud', name: 'Cloud', count: 1 },
    { id: 'ai', name: 'IA', count: 1 },
    { id: 'marketing', name: 'Marketing', count: 1 },
    { id: 'desenvolvimento', name: 'Desenvolvimento', count: 1 },
    { id: 'design', name: 'Design', count: 1 },
    { id: 'ecommerce', name: 'E-commerce', count: 1 },
    { id: 'mobile', name: 'Mobile', count: 1 },
    { id: 'seo', name: 'SEO', count: 1 },
    { id: 'analytics', name: 'Analytics', count: 1 },
    { id: 'automacao', name: 'Automação', count: 1 },
    { id: 'redes-sociais', name: 'Redes Sociais', count: 1 },
    { id: 'content', name: 'Content', count: 1 }
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
      </div>
    </div>
  );
};

export default Blog;
