import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Code2, 
  Brain, 
  Award, 
  GraduationCap, 
  MapPin, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Mail,
  Linkedin,
  Github
} from 'lucide-react';

const Sobre = () => {
  const skills = [
    'Desenvolvimento de Soluções de IA End-to-End',
    'Engenharia de Software',
    'Machine Learning',
    'Deep Learning',
    'Python',
    'TensorFlow',
    'Arquitetura de Software para IA',
    'MLOps',
    'Desenvolvimento Full-Stack',
    'Redes Neurais',
    'Cluster'
  ];

  const experience = [
    {
      company: 'Outplan Tecnologia - e-Procurement',
      role: 'Desenvolvedor de software',
      period: 'janeiro de 2022 - Presente'
    },
    {
      company: 'Udemy',
      role: 'Instrutor',
      period: 'dezembro de 2021 - Presente'
    },
    {
      company: 'Freelance',
      role: 'Desenvolvedor de software e aplicativos',
      period: 'janeiro de 2016 - Presente'
    }
  ];

  const education = [
    {
      institution: 'Instituto Infnet',
      degree: 'Pós-graduação Lato Sensu - MBA',
      field: 'Inteligência Artificial, Machine Learning e Deep Learning',
      period: 'julho de 2023 - julho de 2024'
    },
    {
      institution: 'Anhanguera Educacional',
      degree: 'Pós-graduação Lato Sensu - MBA',
      field: 'Engenharia de Software',
      period: 'maio de 2022 - março de 2023'
    },
    {
      institution: 'Universidade do Vale do Itajaí | Univali',
      degree: 'Pós-graduação',
      field: 'Sistemas embarcados',
      period: '2015 - 2016'
    },
    {
      institution: 'Universidade do Sul de Santa Catarina',
      degree: 'Curso Superior de Tecnologia (CST)',
      field: 'Tecnologia em Engenharia Elétrica e Eletrônica',
      period: 'março de 2004 - dezembro de 2008'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-8 border border-white/30">
              <Brain className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Desenvolvedor de Soluções de IA</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Sobre
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Mim
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Desenvolvedor de Soluções de IA End-to-End com paixão por transformar ideias complexas em realidade
            </p>

            {/* Location and Experience */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-cyan-400" />
                <span>São José, Santa Catarina, Brasil</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
                <span>Desde 2018</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Introdução */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Olá! Sou <strong className="text-gray-900">Carlos Eduardo Lobo</strong>, um Desenvolvedor de Soluções de IA End-to-End com uma paixão por transformar ideias complexas em realidade através da Inteligência Artificial. Atualmente baseado em São José, Santa Catarina, Brasil, dedico-me a construir o futuro inteligente, unindo o rigor da Engenharia de Software com o poder transformador do Machine Learning e Deep Learning.
              </p>
            </div>
          </div>
        </section>

        {/* Minha Abordagem */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Minha Abordagem: Da Ideia à Realidade com IA End-to-End
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Você tem um desafio complexo que a Inteligência Artificial pode resolver, mas precisa de mais do que apenas um modelo de Machine Learning? Precisa de uma solução completa, robusta e pronta para operar no mundo real? É exatamente aí que minha expertise entra em jogo.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Com uma sólida formação em Engenharia de Software (MBA) e uma especialização aprofundada em Inteligência Artificial, Machine Learning e Deep Learning (MBA), atuo na concepção, desenvolvimento e implementação de soluções de IA end-to-end. Minha abordagem combina o rigor da engenharia de software com o poder dos algoritmos de IA. Isso significa que não apenas desenvolvo modelos preditivos ou de classificação eficazes (utilizando Python, TensorFlow e as melhores práticas de ML), mas também me dedico a construir toda a arquitetura de software necessária para suportá-los.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Garanto que as soluções que entrego sejam:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Robustas e Confiáveis</h4>
                    <p className="text-gray-600">Projetadas com boas práticas de engenharia, testes automatizados e código de alta qualidade.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Escaláveis</h4>
                    <p className="text-gray-600">Capazes de lidar com o crescimento do volume de dados e usuários.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prontas para Produção</h4>
                    <p className="text-gray-600">Implementadas com atenção a aspectos cruciais como monitoramento, manutenção e integração (incluindo princípios de MLOps).</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Focadas em Valor</h4>
                    <p className="text-gray-600">Alinhadas aos objetivos de negócio do cliente, entregando resultados tangíveis.</p>
                  </div>
                </div>
              </div>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Desde 2018, venho aplicando essa visão integrada em projetos desafiadores, colaborando com equipes para transformar conceitos inovadores em sistemas inteligentes funcionais e eficientes. Minha experiência abrange desde o desenvolvimento de software tradicional até a aplicação de técnicas avançadas de IA.
              </p>
            </div>
          </div>
        </section>

        {/* Especialidades */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Especialidades e Experiência
              </h2>
            </div>

            <div className="mb-12">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Minhas especialidades incluem Desenvolvimento de Soluções de IA End-to-End, Engenharia de Software, Machine Learning, Deep Learning, Python, TensorFlow, Arquitetura de Software para IA, MLOps (conceitos e implementação) e Desenvolvimento Full-Stack. Possuo também competências chave em Redes Neurais, Deep Learning e Cluster.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Sou certificado em Engenharia de Prompts e Agentes de IA com Python e LangChain, o que me permite estar na vanguarda das tecnologias de IA.
              </p>
            </div>

            {/* Skills */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Habilidades Técnicas</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Experiência Profissional</h3>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{exp.company}</h4>
                          <p className="text-gray-600">{exp.role}</p>
                        </div>
                        <div className="text-sm text-gray-500 mt-2 md:mt-0">
                          {exp.period}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Formação Acadêmica */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Formação Acadêmica
              </h2>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-xl text-gray-700 leading-relaxed">
                Minha formação acadêmica sólida inclui:
              </p>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <GraduationCap className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="text-lg font-semibold text-gray-900">{edu.institution}</h4>
                        </div>
                        <p className="text-gray-900 font-medium">{edu.degree}</p>
                        <p className="text-gray-600">{edu.field}</p>
                      </div>
                      <div className="text-sm text-gray-500 mt-2 md:mt-0 md:ml-4">
                        {edu.period}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vamos Conectar */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Vamos Conectar!
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-center">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Busco conectar-me com empresas e profissionais que necessitam ir além do protótipo e buscam implementar soluções de IA completas e de alto impacto. Se você tem um projeto que exige essa combinação de Engenharia de Software e Inteligência Artificial, vamos conversar sobre como podemos transformar sua visão em realidade.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a
                  href="mailto:wolfxweb@gmail.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Enviar Mensagem
                </a>
                <a
                  href="https://www.linkedin.com/in/carlos-eduardo-lobo-4343b019a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/wolfxweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sobre;
