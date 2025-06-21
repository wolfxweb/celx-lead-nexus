
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Linkedin } from 'lucide-react';

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
      nome: 'CELX Cloud',
      descricao: 'Plataforma em nuvem para gestão empresarial',
      preco: 'A partir de R$ 299/mês',
      features: ['Backup automático', 'Acesso multiplataforma', 'Suporte 24/7']
    },
    {
      id: 2,
      nome: 'CELX Analytics',
      descricao: 'Análise avançada de dados empresariais',
      preco: 'A partir de R$ 499/mês',
      features: ['Dashboard interativo', 'Relatórios automatizados', 'IA integrada']
    },
    {
      id: 3,
      nome: 'CELX Security',
      descricao: 'Segurança digital corporativa',
      preco: 'A partir de R$ 399/mês',
      features: ['Monitoramento 24/7', 'Firewall avançado', 'Compliance LGPD']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular envio do lead
    console.log('Lead capturado:', leadForm);
    
    toast({
      title: "Lead enviado com sucesso!",
      description: "Entraremos em contato em breve.",
    });

    // Limpar formulário
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
    // Simulação de integração com LinkedIn
    toast({
      title: "Conectando com LinkedIn",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleGoogleMapsIntegration = () => {
    // Simulação de integração com Google Maps
    toast({
      title: "Localização capturada",
      description: "Dados do Google Maps integrados",
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nossos Produtos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra nossas soluções inovadoras e transforme sua empresa
          </p>
        </div>

        {/* Produtos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {produtos.map((produto) => (
            <Card key={produto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-primary">{produto.nome}</CardTitle>
                <CardDescription>{produto.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-2xl font-bold text-primary">{produto.preco}</p>
                  <ul className="space-y-2">
                    {produto.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" onClick={() => setLeadForm({...leadForm, produto: produto.nome})}>
                    Solicitar Demonstração
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lead Capture Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Interessado em nossos produtos?
              </CardTitle>
              <CardDescription className="text-center">
                Preencha o formulário abaixo e nossa equipe entrará em contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      type="text"
                      value={leadForm.nome}
                      onChange={(e) => setLeadForm({...leadForm, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input
                      id="empresa"
                      type="text"
                      value={leadForm.empresa}
                      onChange={(e) => setLeadForm({...leadForm, empresa: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={leadForm.telefone}
                      onChange={(e) => setLeadForm({...leadForm, telefone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="produto">Produto de Interesse</Label>
                  <Select value={leadForm.produto} onValueChange={(value) => setLeadForm({...leadForm, produto: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CELX Cloud">CELX Cloud</SelectItem>
                      <SelectItem value="CELX Analytics">CELX Analytics</SelectItem>
                      <SelectItem value="CELX Security">CELX Security</SelectItem>
                      <SelectItem value="Todos">Todos os produtos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Conte-nos mais sobre suas necessidades..."
                    value={leadForm.mensagem}
                    onChange={(e) => setLeadForm({...leadForm, mensagem: e.target.value})}
                  />
                </div>

                {/* Integração LinkedIn e Google Maps */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLinkedInConnect}
                    className="flex items-center"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
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

                <Button type="submit" className="w-full" size="lg">
                  Enviar Solicitação
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
