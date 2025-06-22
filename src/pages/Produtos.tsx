import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Linkedin, Bot, BarChart3, Shield, Zap, Code2, ArrowRight, CheckCircle, Star } from 'lucide-react';

const Produtos = () => {
  const [leadForm, setLeadForm] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    produto: '',
    mensagem: ''
  });
  const { toast } = useToast();

  const produtos = [
    {
      id: 1,
      nome: 'Automação LinkedIn + IA',
      descricao: 'Plataforma inteligente para geração e captura automática de leads no LinkedIn com algoritmos de IA avançados',
      preco: 'A partir de R$ 1.299/mês',
      features: [
        'Geração de leads orientada por IA',
        'Captura de dados abrangente',
        'Pontuação automática de leads',
        'Integração com CRM',
        'Analytics em tempo real',
        'Automação de mensagens'
      ],
      icon: <Bot className="h-8 w-8 text-blue-500" />,
      badge: 'Mais Popular',
      color: 'from-blue-500 to-cyan-500',
      link: '/produtos/linkedin-automation'
    },
    {
      id: 2,
      nome: 'CELX Analytics Pro',
      descricao: 'Suite completa de análise de dados empresariais com dashboards interativos e insights automatizados',
      preco: 'A partir de R$ 799/mês',
      features: [
        'Dashboards interativos em tempo real',
        'Relatórios automatizados',
        'IA para insights preditivos',
        'Integração multi-plataforma',
        'Alertas inteligentes',
        'API robusta'
      ],
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      badge: 'Analytics',
      color: 'from-green-500 to-emerald-500',
      link: '/produtos/analytics'
    },
    {
      id: 3,
      nome: 'CELX Security Suite',
      descricao: 'Solução completa de segurança digital corporativa com monitoramento 24/7 e compliance LGPD',
      preco: 'A partir de R$ 599/mês',
      features: [
        'Monitoramento 24/7 automatizado',
        'Firewall avançado com IA',
        'Compliance total LGPD',
        'Backup automático',
        'Detecção de ameaças',
        'Auditoria completa'
      ],
      icon: <Shield className="h-8 w-8 text-red-500" />,
      badge: 'Segurança',
      color: 'from-red-500 to-pink-500',
      link: '/produtos/security'
    }
  ];

  const benefits = [
    {
      title: 'ROI Comprovado',
      description: 'Média de 300% de retorno sobre investimento em 6 meses',
      icon: <ArrowRight className="h-6 w-6 text-green-500" />
    },
    {
      title: 'Suporte Premium',
      description: 'Time especializado disponível 24/7 para suporte técnico',
      icon: <Zap className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'Customização Total',
      description: 'Adaptamos cada solução às necessidades específicas da sua empresa',
      icon: <Code2 className="h-6 w-6 text-purple-500" />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Lead capturado:', leadForm);
    
    toast({
      title: "Lead enviado com sucesso!",
      description: "Entraremos em contato em breve.",
    });

    setLeadForm({
      nome: '',
      email: '',
      empresa: '',
      telefone: '',
      produto: '',
      mensagem: ''
    });
  };

  const handleLinkedInConnect = () => {
    toast({
      title: "Conectando com LinkedIn",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleGoogleMapsIntegration = () => {
    toast({
      title: "Localização capturada",
      description: "Dados do Google Maps integrados",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-8 border border-white/30">
              <Code2 className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Soluções Enterprise</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Software que
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Potencializa
              </span>
              Resultados
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubra nossas soluções de automação inteligente e desenvolvimento de software 
              que já transformaram mais de 500 empresas
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-50 rounded-full">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossas Soluções
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Produtos desenvolvidos com tecnologia de ponta para automatizar processos 
              e acelerar o crescimento do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {produtos.map((produto) => (
              <Card key={produto.id} className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${produto.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Badge */}
                {produto.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 bg-gradient-to-r ${produto.color} text-white text-xs font-bold rounded-full`}>
                      {produto.badge}
                    </span>
                  </div>
                )}

                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-white rounded-lg shadow-md mr-4">
                      {produto.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{produto.nome}</CardTitle>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{produto.preco}</p>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {produto.descricao}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    <ul className="space-y-3">
                      {produto.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <Link to={produto.link}>
                        <Button className={`w-full bg-gradient-to-r ${produto.color} hover:opacity-90 transition-opacity font-semibold`}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => setLeadForm({...leadForm, produto: produto.nome})}
                      >
                        Solicitar Demo Gratuita
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lead Capture Form */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para Transformar seu Negócio?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Preencha o formulário e nossa equipe de especialistas entrará em contato 
                para uma consultoria personalizada gratuita
              </p>
            </div>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">Nome Completo *</Label>
                    <Input
                      id="nome"
                      type="text"
                      value={leadForm.nome}
                      onChange={(e) => setLeadForm({...leadForm, nome: e.target.value})}
                      className="mt-2 h-12"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail Corporativo *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                      className="mt-2 h-12"
                      placeholder="seu@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="empresa" className="text-sm font-semibold text-gray-700">Empresa</Label>
                    <Input
                      id="empresa"
                      type="text"
                      value={leadForm.empresa}
                      onChange={(e) => setLeadForm({...leadForm, empresa: e.target.value})}
                      className="mt-2 h-12"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone" className="text-sm font-semibold text-gray-700">Telefone/WhatsApp</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={leadForm.telefone}
                      onChange={(e) => setLeadForm({...leadForm, telefone: e.target.value})}
                      className="mt-2 h-12"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="produto" className="text-sm font-semibold text-gray-700">Solução de Interesse</Label>
                  <Select value={leadForm.produto} onValueChange={(value) => setLeadForm({...leadForm, produto: value})}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Selecione a solução de interesse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automação LinkedIn + IA">Automação LinkedIn + IA</SelectItem>
                      <SelectItem value="CELX Analytics Pro">CELX Analytics Pro</SelectItem>
                      <SelectItem value="CELX Security Suite">CELX Security Suite</SelectItem>
                      <SelectItem value="Desenvolvimento Customizado">Desenvolvimento Customizado</SelectItem>
                      <SelectItem value="Consultoria Tecnológica">Consultoria Tecnológica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mensagem" className="text-sm font-semibold text-gray-700">Desafio ou Projeto</Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Conte-nos sobre seu desafio atual ou projeto que precisa de automação/desenvolvimento..."
                    value={leadForm.mensagem}
                    onChange={(e) => setLeadForm({...leadForm, mensagem: e.target.value})}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                {/* Integration Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLinkedInConnect}
                    className="flex items-center"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                    Conectar LinkedIn
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleMapsIntegration}
                  >
                    📍 Capturar Localização
                  </Button>
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800">
                  <Star className="h-5 w-5 mr-2" />
                  Solicitar Consultoria Gratuita
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
