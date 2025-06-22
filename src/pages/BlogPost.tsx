import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowDown } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const BlogPost = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [comment, setComment] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'João Silva',
      date: '2024-06-16',
      message: 'Excelente artigo! Muito esclarecedor sobre as tendências do mercado.'
    },
    {
      id: 2,
      name: 'Maria Santos',
      date: '2024-06-17',
      message: 'Vocês oferecem consultoria em segurança? Gostaria de saber mais.'
    }
  ]);

  // Mock data do post with SEO fields
  const post = {
    id: parseInt(id || '1'),
    title: 'O Futuro da Transformação Digital nas Empresas',
    content: `
      A transformação digital não é mais uma opção, mas uma necessidade para empresas que desejam se manter competitivas no mercado atual. Este processo envolve a integração de tecnologias digitais em todas as áreas de negócio, mudando fundamentalmente como as empresas operam e entregam valor aos clientes.

      ## Por que a Transformação Digital é Essencial?

      A transformação digital oferece diversos benefícios:

      1. **Eficiência Operacional**: Automatização de processos manuais
      2. **Melhor Experiência do Cliente**: Canais digitais integrados
      3. **Tomada de Decisão Baseada em Dados**: Analytics avançados
      4. **Agilidade de Negócio**: Resposta rápida às mudanças do mercado
      5. **Redução de Custos**: Otimização de recursos e processos

      ## Principais Tecnologias Envolvidas

      ### Cloud Computing
      A migração para a nuvem é frequentemente o primeiro passo na jornada de transformação digital. Oferece escalabilidade, flexibilidade e redução de custos de infraestrutura.

      ### Inteligência Artificial e Machine Learning
      Essas tecnologias permitem automação inteligente, análise preditiva e personalização em escala.

      ### Internet das Coisas (IoT)
      Conecta dispositivos e sistemas, gerando dados valiosos para otimização de processos.

      ### Big Data e Analytics
      Transformam dados em insights acionáveis para melhor tomada de decisão.

      ## Desafios Comuns

      Embora os benefícios sejam claros, a transformação digital apresenta desafios:

      - **Resistência à Mudança**: Funcionários podem resistir a novos processos
      - **Investimento Inicial**: Custos significativos de implementação
      - **Segurança**: Novos riscos cibernéticos devem ser gerenciados
      - **Integração**: Conectar sistemas legados com novas tecnologias

      ## Estratégias para o Sucesso

      Para uma transformação digital bem-sucedida, considere:

      1. **Definir uma Visão Clara**: Estabeleça objetivos específicos
      2. **Engajar a Liderança**: Apoio executivo é fundamental
      3. **Investir em Capacitação**: Treine sua equipe
      4. **Implementação Gradual**: Comece com projetos piloto
      5. **Medir Resultados**: Acompanhe métricas de sucesso

      ## Conclusão

      A transformação digital é uma jornada contínua que requer planejamento estratégico, investimento em tecnologia e, principalmente, uma mudança cultural. Empresas que abraçam essa transformação estarão melhor posicionadas para prosperar no futuro digital.

      Na CELX, ajudamos empresas em todas as etapas dessa jornada, desde o planejamento estratégico até a implementação de soluções tecnológicas avançadas.
    `,
    category: 'tecnologia',
    author: 'Carlos Silva',
    date: '2024-06-15',
    readTime: '5 min',
    tags: ['transformação digital', 'tecnologia', 'inovação', 'estratégia'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    metaDescription: 'Descubra como a transformação digital pode revolucionar sua empresa e impulsionar o crescimento no mercado atual. Estratégias, tecnologias e benefícios essenciais.',
    metaKeywords: 'transformação digital, tecnologia empresarial, inovação, digitalização, automação, cloud computing, inteligência artificial'
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComment = {
      id: comments.length + 1,
      name: comment.name,
      date: new Date().toISOString().split('T')[0],
      message: comment.message
    };

    setComments([...comments, newComment]);
    
    toast({
      title: "Comentário enviado!",
      description: "Seu comentário será analisado antes da publicação.",
    });

    setComment({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen py-20">
      <SEOHead 
        title={post.title}
        description={post.metaDescription}
        keywords={post.metaKeywords}
        image={post.image}
        url={`https://celx.com.br/blog/${post.id}`}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/blog" className="text-primary hover:underline">
            ← Voltar ao Blog
          </Link>
        </nav>

        {/* Post Header */}
        <article className="mb-12">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span>Por {post.author}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readTime} de leitura</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace('##', '').trim()}
                  </h2>
                );
              }
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              }
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

        {/* Related Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link to="/blog/2" className="hover:text-primary transition-colors">
                    Segurança Cibernética: Protegendo Seus Dados
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  As melhores práticas para manter sua empresa segura no ambiente digital atual.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link to="/blog/3" className="hover:text-primary transition-colors">
                    Cloud Computing: Benefícios e Implementação
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Como migrar para a nuvem pode revolucionar sua infraestrutura de TI.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comments Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comentários ({comments.length})
          </h2>

          {/* Add Comment Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Deixe seu comentário</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={comment.name}
                      onChange={(e) => setComment({...comment, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={comment.email}
                      onChange={(e) => setComment({...comment, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Comentário *</Label>
                  <Textarea
                    id="message"
                    value={comment.message}
                    onChange={(e) => setComment({...comment, message: e.target.value})}
                    placeholder="Compartilhe sua opinião..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit">Enviar Comentário</Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-l-primary pl-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-semibold">{comment.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPost;
