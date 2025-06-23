import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ProdutoAnalytics = () => {
  const [leadForm, setLeadForm] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    mensagem: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Interesse registrado!",
      description: "Entraremos em contato em breve para apresentar a solução.",
    });
    setLeadForm({ nome: '', email: '', empresa: '', telefone: '', mensagem: '' });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/produtos" className="text-primary hover:underline">
            ← Voltar aos Produtos
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">ANALYTICS</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            CELX Analytics
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Transforme dados em insights acionáveis com nossa plataforma de análise avançada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Solicitar Demonstração
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Ver Preços
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Funcionalidades Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  📊 <span className="ml-2">Dashboard Interativo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Visualize seus dados em tempo real com dashboards personalizáveis e intuitivos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  📈 <span className="ml-2">Relatórios Automatizados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Receba relatórios automáticos com insights relevantes para seu negócio.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  🤖 <span className="ml-2">IA Integrada</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Inteligência artificial para análise preditiva e recomendações estratégicas.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Lead Form */}
        <section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Interesse no CELX Analytics?
                </CardTitle>
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
                    <Label htmlFor="mensagem">Como podemos ajudá-lo?</Label>
                    <Textarea
                      id="mensagem"
                      placeholder="Conte-nos mais sobre suas necessidades de análise de dados..."
                      value={leadForm.mensagem}
                      onChange={(e) => setLeadForm({...leadForm, mensagem: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Solicitar Informações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProdutoAnalytics;
