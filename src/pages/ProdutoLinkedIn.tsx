import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Linkedin } from 'lucide-react';

const ProdutoLinkedIn = () => {
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
          <Badge variant="secondary" className="mb-4">AUTOMAÇÃO + IA</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Desbloqueie o Potencial Oculto do LinkedIn
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Automação de Captura de Leads com n8n e IA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              ADQUIRIR AGORA
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Ver Demonstração
            </Button>
          </div>
        </div>

        {/* Problem Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Cansado de Perder Tempo e Oportunidades no LinkedIn?
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Você sabe que o LinkedIn é um tesouro de leads qualificados. Mas a prospecção manual é um processo lento, repetitivo e que drena sua energia. Horas gastas pesquisando perfis, enviando mensagens genéricas e acompanhando cada interação, enquanto seu verdadeiro potencial de vendas fica estagnado.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>Imagine:</strong> Você poderia estar fechando mais negócios, construindo relacionamentos estratégicos e escalando sua prospecção de forma inteligente, se não estivesse preso à rotina manual. A verdade é que a maioria das empresas deixa dinheiro na mesa por não otimizar sua geração de leads no LinkedIn.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-red-700 mb-4">Problemas da Prospecção Manual:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Processo lento e repetitivo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Mensagens genéricas e pouco efetivas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Tempo desperdiçado em leads não qualificados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Dificuldade em escalar a prospecção</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              A Revolução da Prospecção Chegou
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Sua Automação Inteligente com n8n e IA
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg mb-12">
            <p className="text-gray-700 text-lg leading-relaxed">
              Desenvolvemos uma solução inovadora que transforma a maneira como você gera leads no LinkedIn. Nossa automação, construída com a flexibilidade e o poder do n8n e a inteligência artificial, permite que você capture leads qualificados de forma eficiente, personalizada e em escala.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  🤖 <span className="ml-2">Geração de Leads Orientada por IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Basta informar o nicho e o objetivo em um formulário simples. Nossa IA avançada converte suas descrições em parâmetros de pesquisa precisos no LinkedIn.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  📊 <span className="ml-2">Captura de Dados Abrangente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  O sistema navega pelo LinkedIn, identifica perfis relevantes e coleta dados cruciais, salvando tudo automaticamente em uma planilha do Google Sheets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  🔍 <span className="ml-2">Enriquecimento Inteligente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Nossa automação enriquece os dados analisando sites de empresas, postagens do LinkedIn e notícias recentes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  🎯 <span className="ml-2">Pontuação de Leads com IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  A IA analisa todos os dados coletados e pontua cada lead de 1 a 10, identificando os prospects com maior probabilidade de conversão.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  💬 <span className="ml-2">Divulgação Automatizada</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Envie solicitações de conexão e mensagens personalizadas automaticamente para os leads mais promissores.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  📚 <span className="ml-2">Tutorial Completo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Tutorial passo a passo detalhado para configurar e personalizar sua automação, mesmo sem conhecimento técnico.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Pare de Perder Tempo. Comece a Gerar Resultados.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <span className="text-green-600 text-xl">⏰</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Economia de Tempo Massiva</h3>
                  <p className="text-gray-700">Elimine horas de prospecção manual e redirecione seus recursos para o que realmente importa.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <span className="text-green-600 text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Leads Altamente Qualificados</h3>
                  <p className="text-gray-700">Chega de leads genéricos! Conecte-se apenas com quem realmente importa para o seu negócio.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <span className="text-green-600 text-xl">📈</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Escalabilidade Ilimitada</h3>
                  <p className="text-gray-700">Aumente seu volume de leads sem aumentar sua equipe. Nossa automação lida com grandes volumes.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Precisão e Consistência</h3>
                  <p className="text-gray-700">Garanta que suas campanhas sejam executadas com máxima precisão e sigam suas diretrizes.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <span className="text-green-600 text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Vantagem Competitiva</h3>
                  <p className="text-gray-700">Ultrapasse seus concorrentes com uma estratégia de geração de leads mais inteligente e eficaz.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <span className="text-green-600 text-xl">🤝</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Foco no Relacionamento</h3>
                  <p className="text-gray-700">Dedique mais tempo à construção de relacionamentos genuínos e à conversão de leads.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Differentials Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Por Que Nossa Solução é Diferente?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 text-xl">✓</span>
                    <span><strong>Intuitiva e Fácil de Usar:</strong> Configure campanhas com poucos cliques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 text-xl">✓</span>
                    <span><strong>Altamente Personalizável:</strong> Adapte às suas necessidades específicas</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 text-xl">✓</span>
                    <span><strong>Construída para Resultados:</strong> Baseada nas melhores práticas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 text-xl">✓</span>
                    <span><strong>Suporte Completo:</strong> Tutorial detalhado e grupo VIP</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Perguntas Frequentes (FAQ)
          </h2>
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>Preciso ter conhecimento em programação para usar esta automação?</AccordionTrigger>
              <AccordionContent>
                Não! Nossa solução foi projetada para ser intuitiva e fácil de usar. O tutorial completo e detalhado irá guiá-lo passo a passo na configuração, mesmo que você não tenha nenhum conhecimento em programação.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>A automação é segura e está em conformidade com os termos do LinkedIn?</AccordionTrigger>
              <AccordionContent>
                Sim. O workflow inclui salvaguardas para evitar exceder os limites de uso do LinkedIn. No entanto, é fundamental que você utilize a automação de forma responsável e em conformidade com os termos de serviço do LinkedIn para evitar restrições na sua conta.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Quais são os requisitos para rodar a automação?</AccordionTrigger>
              <AccordionContent>
                Você precisará de uma instância n8n auto-hospedada, acesso à API OpenAI, acesso ao Google Sheets, uma chave de API HDW e uma conta no LinkedIn. Todos os detalhes são explicados no tutorial.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Posso personalizar a automação para minhas necessidades específicas?</AccordionTrigger>
              <AccordionContent>
                Com certeza! O workflow é altamente personalizável. Você pode ajustar os parâmetros de pesquisa, os critérios de pontuação de leads e os modelos de mensagem para se adequar perfeitamente à sua estratégia de prospecção.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Como recebo os leads capturados?</AccordionTrigger>
              <AccordionContent>
                Os leads são automaticamente salvos em uma planilha do Google Sheets que você configurar. Você terá acesso a todas as informações coletadas de forma organizada e pronta para uso.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Há algum suporte caso eu tenha dúvidas?</AccordionTrigger>
              <AccordionContent>
                Sim! Além do tutorial completo, ao adquirir hoje, você terá acesso exclusivo ao nosso grupo VIP de suporte, onde poderá tirar dúvidas e receber atualizações.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-12 rounded-lg text-center">
            <h2 className="text-4xl font-bold mb-6">
              Não Deixe Seus Concorrentes Tomarem a Frente!
            </h2>
            <p className="text-xl mb-8 max-w-4xl mx-auto">
              O mercado está em constante evolução, e a prospecção manual está se tornando obsoleta. É hora de adotar uma abordagem inteligente e automatizada para a geração de leads no LinkedIn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                🚀 ADQUIRIR AGORA
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-primary">
                Ver Demonstração
              </Button>
            </div>
            <p className="mt-6 text-lg">
              <strong>Oferta por Tempo Limitado:</strong> Garanta acesso exclusivo ao nosso grupo VIP de suporte!
            </p>
          </div>
        </section>

        {/* Lead Form */}
        <section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl flex items-center justify-center">
                  <Linkedin className="mr-2" />
                  Pronto para Revolucionar Sua Prospecção?
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
                      placeholder="Conte-nos mais sobre suas necessidades de prospecção..."
                      value={leadForm.mensagem}
                      onChange={(e) => setLeadForm({...leadForm, mensagem: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Quero Saber Mais Sobre a Automação
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

export default ProdutoLinkedIn;
