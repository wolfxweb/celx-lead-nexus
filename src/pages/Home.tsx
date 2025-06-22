import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDown, 
  Code2, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle,
  Globe,
  ShoppingCart,
  Settings,
  Bot,
  BarChart3,
  Smartphone,
  Clock,
  Target,
  Lightbulb,
  Heart,
  Star
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

const Home = () => {
  const services = [
    {
      title: 'Transforme Visitantes em Clientes',
      description: 'Criamos sites institucionais que vão além do visual. Gere autoridade, conquiste a confiança do seu público e aumente suas oportunidades de negócio com um design profissional, conteúdo otimizado para conversão e integração perfeita com suas redes sociais.',
      icon: <Globe className="h-8 w-8 text-blue-500" />
    },
    {
      title: 'Venda Online Sem Complicação',
      description: 'Lançamos sua loja virtual completa, segura e otimizada para vender mais, 24/7. Gerencie produtos, estoque e pagamentos com facilidade, integre com marketplaces e expanda seu negócio para o mundo digital com uma plataforma robusta e confiável.',
      icon: <ShoppingCart className="h-8 w-8 text-green-500" />
    },
    {
      title: 'A Ferramenta Certa para Sua Operação',
      description: 'Desenvolvemos sistemas web sob medida que se adaptam perfeitamente aos seus processos únicos. Otimize a gestão, integre ferramentas, automatize fluxos e tenha controle total do seu negócio com uma solução personalizada, escalável e segura.',
      icon: <Settings className="h-8 w-8 text-purple-500" />
    },
    {
      title: 'Sua Equipe Focada no Estratégico',
      description: 'Chega de tarefas manuais e repetitivas! Automatize processos, reduza custos operacionais e minimize erros. Nossas soluções de automação inteligente liberam seu time para atividades que realmente geram valor, aumentando a produtividade e a eficiência.',
      icon: <Bot className="h-8 w-8 text-orange-500" />
    },
    {
      title: 'Vendas no Piloto Automático',
      description: 'Implementamos automações de marketing que nutrem seus leads de forma inteligente, qualificam oportunidades e impulsionam suas vendas de forma consistente. Acompanhe a jornada do cliente e tome decisões baseadas em dados para um crescimento previsível.',
      icon: <BarChart3 className="h-8 w-8 text-red-500" />
    },
    {
      title: 'Leve Seu Negócio para o Bolso do Cliente',
      description: 'Criamos aplicativos móveis (iOS e Android) intuitivos, de alta performance e que encantam seus usuários. Engaje seu público, ofereça novas funcionalidades, fortaleça sua marca e abra novos canais de receita com uma presença mobile impactante.',
      icon: <Smartphone className="h-8 w-8 text-indigo-500" />
    }
  ];

  const differentials = [
    {
      title: 'Entrega Ágil e Confiável',
      description: 'Respeitamos seu tempo. Cumprimos prazos rigorosos sem abrir mão da excelência, entregando seu projeto em média em X semanas, com comunicação transparente em cada etapa.',
      icon: <Clock className="h-8 w-8 text-blue-500" />
    },
    {
      title: 'Sua Solução, Seu Jeito',
      description: 'Não acreditamos em fórmulas prontas. Ouvimos atentamente suas necessidades específicas para desenhar e desenvolver a solução tecnológica exata que sua empresa precisa para operar com máxima eficiência e se destacar no mercado.',
      icon: <Target className="h-8 w-8 text-green-500" />
    },
    {
      title: 'Inovação que Gera Valor Real',
      description: 'Utilizamos as tecnologias mais atuais e metodologias comprovadas (como Scrum) não apenas por serem modernas, mas por entregarem resultados mensuráveis e vantagem competitiva real para o seu negócio.',
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />
    },
    {
      title: 'Parceria de Verdade, Suporte Contínuo',
      description: 'Seu sucesso é o nosso. Conte com um gerente de projetos dedicado do início ao fim e um time de suporte ágil e acessível para garantir que sua solução funcione perfeitamente e evolua com suas necessidades.',
      icon: <Heart className="h-8 w-8 text-red-500" />
    }
  ];

  const partners = [
    { name: 'DigitalOcean', category: 'Cloud Computing', logo: '🌐' },
    { name: 'Hostinger', category: 'Hospedagem Web', logo: '🏠' },
    { name: 'GoDaddy', category: 'Domínios & Hosting', logo: '🌍' },
    { name: 'RegistroBR', category: 'Registro de Domínios', logo: '📝' },
    { name: 'MATRIARCA AI', category: 'Inteligência Artificial', logo: '🤖' },
    { name: 'OpenAI', category: 'IA Avançada', logo: '🧠' },
    { name: 'FlutterFlow', category: 'Desenvolvimento Low-Code', logo: '⚡' },
    { name: 'N8N', category: 'Automação de Workflows', logo: '🔄' }
  ];

  const technologies = [
    'Firebase', 'MongoDB', 'Supabase', 'Dart', 'PHP', 'Python', 'PostgreSQL', 'MySQL'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-8 border border-white/30">
              <Code2 className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Soluções Digitais Personalizadas</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Soluções Digitais
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Personalizadas
              </span>
              para Alavancar Seus Resultados
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Deixe a tecnologia trabalhar por você: desenvolvemos sistemas e aplicativos que aumentam sua eficiência e lucratividade.
            </p>

            <p className="text-lg md:text-xl text-blue-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Seu Negócio Merece Crescer. Nós Criamos a Tecnologia para Isso.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
                onClick={() => {
                  const message = encodeURIComponent("Olá! Gostaria de solicitar um orçamento detalhado para soluções digitais personalizadas.");
                  window.open(`https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${message}`, '_blank');
                }}
              >
                Solicitar Orçamento Detalhado
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
          <ArrowDown className="h-6 w-6" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Há mais de 5 anos, ajudamos empresas como a sua a transformar desafios complexos – como otimizar operações, automatizar tarefas ou alcançar novos mercados – em resultados concretos e mensuráveis. Através de soluções digitais personalizadas, desenvolvidas com tecnologia de ponta e um time apaixonado por inovação, entregamos não apenas software, mas o impulso estratégico que seu negócio precisa para prosperar e se destacar.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossas Soluções
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300"></div>
                <CardHeader className="relative z-10 text-center pb-4">
                  <div className="flex justify-center mb-4 p-3 bg-white rounded-full shadow-md w-fit mx-auto">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2240%22%20height=%2240%22%20viewBox=%220%200%2040%2040%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10zm10%200c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sua Próxima Grande Ideia Começa Aqui.
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Tem um projeto inovador em mente ou um desafio operacional que precisa ser resolvido? Vamos conversar sobre como a tecnologia personalizada da Wolfx pode transformar seu negócio e gerar resultados reais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
                onClick={() => {
                  const message = encodeURIComponent("Olá! Gostaria de solicitar um orçamento detalhado para soluções digitais personalizadas.");
                  window.open(`https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${message}`, '_blank');
                }}
              >
                Solicitar Orçamento Detalhado
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossos Diferenciais
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {differentials.map((differential, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300"></div>
                <CardHeader className="relative z-10 text-center pb-4">
                  <div className="flex justify-center mb-4 p-3 bg-white rounded-full shadow-md w-fit mx-auto">
                    {differential.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{differential.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {differential.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossos Parceiros
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trabalhamos com as melhores empresas do mercado para oferecer soluções completas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {partners.map((partner, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{partner.logo}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tecnologias que Utilizamos
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-lg">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2240%22%20height=%2240%22%20viewBox=%220%200%2040%2040%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10zm10%200c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para Impulsionar Seus Resultados com Tecnologia?
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Não espere mais para modernizar sua empresa e alcançar seus objetivos. Entre em contato conosco hoje mesmo e descubra como as soluções personalizadas da Wolfx podem fazer a diferença.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
                onClick={() => {
                  const message = encodeURIComponent("Olá! Gostaria de solicitar um orçamento detalhado para soluções digitais personalizadas.");
                  window.open(`https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${message}`, '_blank');
                }}
              >
                Solicitar Orçamento Detalhado
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
