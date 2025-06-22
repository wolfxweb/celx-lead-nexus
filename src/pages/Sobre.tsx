
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Users, Award, TrendingUp, Target, Heart, Lightbulb, Shield } from 'lucide-react';

const Sobre = () => {
  const team = [
    {
      name: 'Carlos Eduardo Silva',
      role: 'CEO & Fundador',
      description: '15+ anos liderando transformação digital em empresas Fortune 500. Especialista em arquitetura de software empresarial.',
      image: '👨‍💼',
      skills: ['Liderança Estratégica', 'Arquitetura de Software', 'Transformação Digital']
    },
    {
      name: 'Ana Paula Costa',
      role: 'CTO & Co-fundadora',
      description: 'Doutora em Ciência da Computação, especialista em IA e Machine Learning. Ex-Google e Microsoft.',
      image: '👩‍💻',
      skills: ['Inteligência Artificial', 'Machine Learning', 'Cloud Computing']
    },
    {
      name: 'Pedro Santos',
      role: 'Head de Vendas B2B',
      description: 'MBA em Gestão Comercial, 12+ anos construindo relacionamentos estratégicos com grandes contas.',
      image: '👨‍🚀',
      skills: ['Vendas B2B', 'Relacionamento Corporativo', 'Estratégia Comercial']
    }
  ];

  const values = [
    {
      title: 'Inovação Constante',
      description: 'Investimos 25% da receita em P&D para estar sempre na vanguarda tecnológica',
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Excelência Técnica',
      description: 'Qualidade incomparável em cada linha de código e processo automatizado',
      icon: <Award className="h-8 w-8 text-blue-500" />,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Parceria Verdadeira',
      description: 'Relacionamentos duradouros baseados em confiança e resultados mútuos',
      icon: <Heart className="h-8 w-8 text-red-500" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Resultados Mensuráveis',
      description: 'ROI comprovado e métricas transparentes em todos os nossos projetos',
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const achievements = [
    { number: '500+', label: 'Projetos Entregues', description: 'Com qualidade excepcional' },
    { number: '98%', label: 'Satisfação Cliente', description: 'NPS acima da média do setor' },
    { number: '6+', label: 'Anos no Mercado', description: 'Crescimento sustentável' },
    { number: '50+', label: 'Especialistas', description: 'Time altamente qualificado' }
  ];

  const technologies = [
    'React/Next.js', 'Node.js', 'Python', 'TypeScript', 'AWS/Azure', 'Docker/Kubernetes', 
    'PostgreSQL', 'MongoDB', 'Redis', 'Microservices', 'GraphQL', 'TensorFlow'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-8 border border-white/30">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Conheça Nossa História</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transformando
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                o Futuro
              </span>
              das Empresas
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Somos uma empresa de tecnologia focada em criar soluções de software e automação 
              que impulsionam a transformação digital de negócios em todo o Brasil
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{achievement.number}</div>
                  <div className="text-sm md:text-base text-white font-semibold mb-1">{achievement.label}</div>
                  <div className="text-xs text-blue-200">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Nossa História */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 mb-8">
                <Target className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Nossa Jornada</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Uma História de Inovação</h2>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-gray-900">2018:</strong> Fundada por engenheiros visionários com experiência em 
                  grandes corporações, a CELX nasceu com o propósito de democratizar o acesso a tecnologias 
                  empresariais de ponta para empresas de todos os portes.
                </p>
                
                <p className="text-lg">
                  <strong className="text-gray-900">2019-2021:</strong> Período de crescimento acelerado, desenvolvendo 
                  nossas primeiras soluções de automação inteligente e conquistando a confiança de mais de 
                  200 clientes em diversos segmentos do mercado.
                </p>
                
                <p className="text-lg">
                  <strong className="text-gray-900">2022-2024:</strong> Consolidação como referência em desenvolvimento 
                  de software corporativo e automação de processos, com mais de 500 projetos entregues e 
                  presença em todo território nacional.
                </p>
                
                <p className="text-lg font-semibold text-gray-900">
                  Hoje, continuamos fiéis ao nosso propósito original: transformar negócios através da 
                  tecnologia, sempre com foco em resultados mensuráveis e parcerias duradouras.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <Code2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Tecnologia de Ponta</h3>
                  <p className="text-gray-600">Sempre na vanguarda da inovação</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {technologies.slice(0, 9).map((tech, index) => (
                    <div key={index} className="bg-white rounded-lg p-2 text-center shadow-sm">
                      <span className="text-xs font-medium text-gray-700">{tech}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">E muitas outras tecnologias...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 mb-8">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Nossos Princípios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Valores que nos Movem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os pilares fundamentais que orientam cada decisão e ação da nossa empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="flex justify-center mb-4 p-3 bg-white rounded-full shadow-md w-fit mx-auto">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nossa Equipe */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 mb-8">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Time de Especialistas</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Liderança Experiente</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça os profissionais que lideram a transformação digital na CELX
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-semibold text-base mb-4">
                    {member.role}
                  </CardDescription>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{member.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Especialidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Missão, Visão, Propósito */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nossa Essência</h2>
              <p className="text-xl text-gray-600">Os princípios que definem nossa identidade corporativa</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white rounded-xl p-8 shadow-md">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Missão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transformar negócios através de soluções tecnológicas inovadoras e automação inteligente, 
                  gerando valor tangível e impacto positivo duradouro para nossos clientes.
                </p>
              </div>
              
              <div className="text-center bg-white rounded-xl p-8 shadow-md">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Visão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ser a principal referência em desenvolvimento de software e automação empresarial 
                  no Brasil, reconhecida pela excelência técnica e resultados excepcionais.
                </p>
              </div>
              
              <div className="text-center bg-white rounded-xl p-8 shadow-md">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Propósito</h3>
                <p className="text-gray-600 leading-relaxed">
                  Democratizar o acesso à tecnologia de ponta, capacitando empresas de todos os portes 
                  a alcançarem seus objetivos e crescerem de forma sustentável e competitiva.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sobre;
