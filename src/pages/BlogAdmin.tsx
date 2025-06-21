
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BlogAdmin = () => {
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    tags: ''
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'O Futuro da Transformação Digital nas Empresas',
      status: 'published',
      author: 'Carlos Silva',
      date: '2024-06-15'
    },
    {
      id: 2,
      title: 'Segurança Cibernética: Protegendo Seus Dados',
      status: 'published',
      author: 'Ana Costa',
      date: '2024-06-10'
    }
  ]);

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const post = {
      id: posts.length + 1,
      title: newPost.title,
      status: 'draft',
      author: newPost.author,
      date: new Date().toISOString().split('T')[0]
    };

    setPosts([...posts, post]);
    
    toast({
      title: "Post criado com sucesso!",
      description: "O post foi salvo como rascunho.",
    });

    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      tags: ''
    });
  };

  const handlePublish = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: 'published' } : post
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

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Administração do Blog
          </h1>
          <p className="text-gray-600">
            Gerencie o conteúdo do blog CELX
          </p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Criar Post</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar Posts</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
          </TabsList>

          {/* Criar Post */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Novo Post</CardTitle>
                <CardDescription>
                  Crie um novo artigo para o blog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Digite o título do post"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                      placeholder="Breve descrição do post"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      placeholder="Escreva o conteúdo completo do post"
                      rows={10}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="seguranca">Segurança</SelectItem>
                          <SelectItem value="cloud">Cloud</SelectItem>
                          <SelectItem value="ai">Inteligência Artificial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="author">Autor</Label>
                      <Input
                        id="author"
                        value={newPost.author}
                        onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                        placeholder="Nome do autor"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                      placeholder="Tags separadas por vírgula"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" variant="outline">
                      Salvar como Rascunho
                    </Button>
                    <Button type="submit">
                      Publicar Agora
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gerenciar Posts */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Posts Existentes</CardTitle>
                <CardDescription>
                  Gerencie todos os posts do blog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{post.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>Por {post.author}</span>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        {post.status === 'draft' && (
                          <Button size="sm" onClick={() => handlePublish(post.id)}>
                            Publicar
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comentários */}
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Comentários</CardTitle>
                <CardDescription>
                  Modere os comentários dos posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">João Silva</p>
                        <p className="text-sm text-gray-500">Em: O Futuro da Transformação Digital</p>
                        <p className="mt-2">Excelente artigo! Muito esclarecedor sobre as tendências do mercado.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Aprovar</Button>
                        <Button size="sm" variant="destructive">Rejeitar</Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">Maria Santos</p>
                        <p className="text-sm text-gray-500">Em: Segurança Cibernética</p>
                        <p className="mt-2">Vocês oferecem consultoria em segurança? Gostaria de saber mais.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Aprovar</Button>
                        <Button size="sm" variant="destructive">Rejeitar</Button>
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
  );
};

export default BlogAdmin;
