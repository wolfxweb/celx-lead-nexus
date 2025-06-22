import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Efeito para rolar para o topo quando o ID do post mudar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

  // Mock de todos os posts disponíveis
  const allPosts = [
    {
      id: 1,
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
    },
    {
      id: 2,
      title: 'Segurança Cibernética: Protegendo Seus Dados Essenciais',
      content: `
        A segurança cibernética é uma preocupação essencial para qualquer empresa que dependa de tecnologias digitais. Este artigo aborda os principais riscos cibernéticos, as melhores práticas para proteger seus dados e estratégias para mitigar esses riscos.

        ## Principais Riscos Cibernéticos

        - **Phishing**: Fraudes online que visam roubar informações pessoais
        - **Ransomware**: Malware que criptografa arquivos e exige um resgate para desbloqueá-los
        - **DDoS**: Ataques de negação de serviço que sobrecarregam o sistema
        - **Man-in-the-Middle**: Interceptação de comunicações entre dois dispositivos

        ## Melhores Práticas para Proteger Seus Dados

        1. **Autenticação Multifator**: Use vários métodos de verificação
        2. **Atualizações de Segurança**: Mantenha seus sistemas atualizados
        3. **Backup Regular**: Faça backups regulares dos seus dados
        4. **Treinamento em Segurança**: Eduque seus funcionários sobre práticas seguras
        5. **Monitoramento de Segurança**: Use ferramentas de monitoramento

        ## Estratégias para Mitigar Riscos

        - **Implemente Políticas de Segurança**: Defina regras claras para proteger seus dados
        - **Treine sua Equipe**: Ensine a reconhecer e responder a ameaças cibernéticas
        - **Contrate Especialistas**: Contrate profissionais qualificados para gerenciar sua segurança
        - **Participe de Programas de Certificação**: Obtenha certificações que comprovem sua segurança

        ## Conclusão

        Proteger seus dados é uma responsabilidade compartilhada entre a empresa e seus funcionários. Adotando práticas de segurança eficazes, você pode mitigar riscos cibernéticos e garantir a segurança de seus dados.
      `,
      category: 'segurança',
      author: 'Ana Oliveira',
      date: '2024-06-18',
      readTime: '4 min',
      tags: ['segurança cibernética', 'tecnologia', 'proteção de dados'],
      image: 'https://images.unsplash.com/photo-1554224371-f57f5ecc2e50?w=800&h=400&fit=crop',
      metaDescription: 'Descubra como proteger seus dados contra riscos cibernéticos. Melhores práticas, estratégias e tecnologias para garantir a segurança dos seus dados.',
      metaKeywords: 'segurança cibernética, proteção de dados, tecnologia, segurança digital'
    },
    {
      id: 3,
      title: 'Cloud Computing: Benefícios e Estratégias de Implementação',
      content: `
        O Cloud Computing é uma tecnologia essencial para empresas que buscam escalabilidade, flexibilidade e redução de custos. Este artigo explora os principais benefícios do Cloud Computing, estratégias para implementá-lo e como isso pode revolucionar sua infraestrutura de TI.

        ## Principais Benefícios

        - **Escalabilidade**: Aumente ou diminua recursos conforme necessário
        - **Flexibilidade**: Acesse recursos de qualquer lugar, a qualquer momento
        - **Redução de Custos**: Economize em infraestrutura física e energia
        - **Agilidade**: Responda rapidamente às mudanças do mercado

        ## Estratégias para Implementar o Cloud Computing

        1. **Análise de Necessidades**: Identifique quais serviços podem ser migrados para a nuvem
        2. **Seleção de Provedor**: Escolha um provedor de nuvem confiável
        3. **Migração Gradual**: Migre serviços gradualmente para a nuvem
        4. **Integração**: Conecte sistemas legados com a nuvem
        5. **Monitoramento e Gerenciamento**: Monitore o uso e o desempenho da nuvem

        ## Conclusão

        O Cloud Computing é uma tecnologia poderosa que pode transformar sua infraestrutura de TI. Ao adotá-lo, você pode obter benefícios significativos em termos de escalabilidade, flexibilidade e redução de custos.
      `,
      category: 'tecnologia',
      author: 'Pedro Mendes',
      date: '2024-06-20',
      readTime: '5 min',
      tags: ['cloud computing', 'tecnologia', 'inovação', 'infraestrutura'],
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
      metaDescription: 'Descubra como o Cloud Computing pode revolucionar sua infraestrutura de TI. Benefícios, estratégias e tecnologias essenciais.',
      metaKeywords: 'cloud computing, tecnologia empresarial, inovação, digitalização, automação, cloud computing, inteligência artificial'
    }
  ];

  const post = allPosts.find(p => p.id === parseInt(id || '1'));

  // Filtra posts relacionados, excluindo o atual
  const relatedPosts = allPosts.filter(p => p.id !== post?.id);

  if (!post) {
    useEffect(() => {
      navigate('/404');
    }, [navigate]);
    return null;
  }
  
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
            {relatedPosts.map(relatedPost => (
              <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link to={`/blog/${relatedPost.id}`} className="hover:text-primary transition-colors">
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {relatedPost.content.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            ))}
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
