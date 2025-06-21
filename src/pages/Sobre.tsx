
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Sobre = () => {
  const team = [
    {
      name: 'Carlos Silva',
      role: 'CEO & Fundador',
      description: '15 anos de experiência em tecnologia empresarial',
      image: '👨‍💼'
    },
    {
      name: 'Ana Costa',
      role: 'CTO',
      description: 'Especialista em arquitetura de software e inovação',
      image: '👩‍💻'
    },
    {
      name: 'Pedro Santos',
      role: 'Head de Vendas',
      description: 'Expert em soluções B2B e relacionamento com clientes',
      image: '👨‍💼'
    }
  ];

  const values = [
    {
      title: 'Inovação',
      description: 'Sempre buscamos as tecnologias mais avançadas',
      icon: '🚀'
    },
    {
      title: 'Qualidade',
      description: 'Excelência em cada projeto e entrega',
      icon: '⭐'
    },
    {
      title: 'Parceria',
      description: 'Construímos relacionamentos duradouros',
      icon: '🤝'
    },
    {
      title: 'Resultados',
      description: 'Foco em gerar valor real para nossos clientes',
      icon: '📈'
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sobre a CELX
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos uma empresa de tecnologia focada em transformar negócios através de soluções inovadoras e personalizadas
          </p>
        </div>

        {/* Nossa História */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Fundada em 2018, a CELX nasceu da visão de democratizar o acesso a tecnologias 
                  empresariais de ponta. Começamos como uma pequena startup com grandes sonhos e 
                  hoje somos uma referência no mercado de soluções tecnológicas.
                </p>
                <p>
                  Nossa jornada é marcada pela constante busca por inovação e pela paixão em 
                  resolver problemas complexos através da tecnologia. Cada cliente que atendemos 
                  nos ensina algo novo e nos motiva a continuar evoluindo.
                </p>
                <p>
                  Hoje, com mais de 500 clientes atendidos e projetos em diversos segmentos, 
                  continuamos fiéis ao nosso propósito original: transformar negócios e criar 
                  valor através da tecnologia.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-primary mb-2">6 Anos</h3>
              <p className="text-gray-600">de experiência no mercado</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-gray-600">Clientes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-gray-600">Projetos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-xl text-gray-600">Os princípios que guiam nossa empresa</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-2">{value.icon}</div>
                  <CardTitle className="text-primary">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nossa Equipe */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
            <p className="text-xl text-gray-600">Conheça as pessoas por trás da CELX</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="text-6xl mb-4">{member.image}</div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Missão, Visão, Valores */}
        <section className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary mb-4">Missão</h3>
              <p className="text-gray-600">
                Transformar negócios através de soluções tecnológicas inovadoras, 
                gerando valor e impacto positivo para nossos clientes.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser a principal referência em soluções tecnológicas empresariais 
                no Brasil, reconhecida pela excelência e inovação.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary mb-4">Propósito</h3>
              <p className="text-gray-600">
                Democratizar o acesso à tecnologia de ponta, capacitando empresas 
                a alcançarem seus objetivos e crescerem de forma sustentável.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sobre;
