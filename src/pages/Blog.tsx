import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: posts.length },
    { id: 'tecnologia', name: 'Tecnologia', count: 1 },
    { id: 'seguranca', name: 'Segurança', count: 1 },
    { id: 'cloud', name: 'Cloud', count: 1 },
    { id: 'ai', name: 'IA', count: 1 }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Access */}
        <div className="mb-8 text-center">
          <Button variant="outline" asChild>
            <Link to="/blog/admin">Área Administrativa</Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
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
      </div>
    </div>
  );
};

export default Blog;
