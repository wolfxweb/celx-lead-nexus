import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, Code2, Zap, Shield, TrendingUp, Users, Award, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Automação Inteligente',
      description: 'Soluções de automação com IA para otimizar processos empresariais e reduzir custos operacionais',
      icon: <Zap className="h-8 w-8 text-blue-500" />
    },
    {
      title: 'Desenvolvimento Custom',
      description: 'Software sob medida desenvolvido com as mais modernas tecnologias e metodologias ágeis',
      icon: <Code2 className="h-8 w-8 text-green-500" />
    },
    {
      title: 'Segurança Avançada',
      description: 'Proteção de dados e sistemas com criptografia de ponta e compliance total com LGPD',
      icon: <Shield className="h-8 w-8 text-red-500" />
    }
  ];

  const stats = [
    { number: '500+', label: 'Projetos Entregues' },
    { number: '98%', label: 'Satisfação do Cliente' },
    { number: '24/7', label: 'Suporte Técnico' },
    { number: '6+', label: 'Anos de Mercado' }
  ];

  const testimonials = [
    {
      name: 'João Silva',
      company: 'TechCorp Ltda',
      role: 'CTO',
      text: 'A CELX revolucionou nossa operação com automação inteligente. ROI de 300% em 6 meses!',
      avatar: '👨‍💼'
    },
    {
      name: 'Maria Santos',
      company: 'Inovação Digital',
      role: 'Diretora de TI',
      text: 'Desenvolvimento ágil e qualidade excepcional. Parceria estratégica fundamental para nosso crescimento.',
      avatar: '👩‍💻'
    },
    {
      name: 'Pedro Costa',
      company: 'StartUp Plus',
      role: 'Fundador',
      text: 'Do MVP ao produto final, a CELX nos acompanhou com expertise técnica incomparável.',
      avatar: '👨‍🚀'
    }
  ];

  const technologies = [
    'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'PostgreSQL'
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
              <span className="text-sm font-medium">Liderando a Transformação Digital</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Software que
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Transforma
              </span>
              Negócios
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Desenvolvemos soluções de software personalizadas e sistemas de automação inteligente 
              para empresas que buscam excelência operacional e crescimento acelerado
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold" asChild>
                <Link to="/produtos">Ver Soluções</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Agendar Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                  <div className="text-sm md:text-base text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
          <ArrowDown className="h-6 w-6" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Soluções Inovadoras</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tecnologia que Acelera Resultados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combinamos expertise em desenvolvimento de software com automação inteligente 
              para criar soluções que transformam operações e impulsionam o crescimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300"></div>
                <CardHeader className="relative z-10 text-center pb-4">
                  <div className="flex justify-center mb-4 p-3 bg-white rounded-full shadow-md w-fit mx-auto">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technologies */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Tecnologias que Dominamos</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {technologies.map((tech, index) => (
                <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2240%22%20height=%2240%22%20viewBox=%220%200%2040%2040%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10zm10%200c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para Revolucionar seu Negócio?
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Descubra como nossas soluções de software e automação podem acelerar 
              seu crescimento e otimizar suas operações
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                Solicitar Proposta
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Ver Cases de Sucesso
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 mb-6">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Casos de Sucesso</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Clientes que Transformaram seus Negócios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Histórias reais de empresas que alcançaram resultados excepcionais com nossas soluções
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-blue-600 font-medium">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center mt-4 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
