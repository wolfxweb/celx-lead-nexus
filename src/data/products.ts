import { Product } from '@/types/ecommerce';
import { defaultProductCategories } from '@/data/productData';

export const categories = defaultProductCategories;

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Template de Landing Page Premium',
    description: 'Template profissional para landing pages com design moderno e responsivo. Inclui seções para hero, features, testimonials, pricing e contato. Totalmente customizável com HTML, CSS e JavaScript.',
    shortDescription: 'Template profissional para landing pages com design moderno e responsivo.',
    price: 97.00,
    originalPrice: 147.00,
    category: 'templates',
    tags: ['landing page', 'template', 'responsive', 'moderno'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fileSize: '2.5 MB',
    fileType: 'HTML/CSS/JS',
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    salesCount: 156,
    rating: 4.8,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'João Silva',
        rating: 5,
        comment: 'Template excelente! Muito fácil de customizar e o resultado ficou profissional.',
        createdAt: new Date('2024-11-15')
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Maria Santos',
        rating: 4,
        comment: 'Bom template, mas poderia ter mais opções de cores.',
        createdAt: new Date('2024-11-10')
      }
    ]
  },
  {
    id: '2',
    name: 'Curso Completo de Marketing Digital',
    description: 'Curso completo com mais de 50 horas de conteúdo sobre marketing digital. Aprenda SEO, Google Ads, Facebook Ads, email marketing, content marketing e muito mais. Inclui certificado e suporte.',
    shortDescription: 'Curso completo com mais de 50 horas de conteúdo sobre marketing digital.',
    price: 297.00,
    originalPrice: 497.00,
    category: 'cursos',
    tags: ['marketing digital', 'curso', 'seo', 'ads', 'email marketing'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop'
    ],
    video: 'https://www.youtube.com/embed/9bZkp7q19f0',
    fileSize: '15.2 GB',
    fileType: 'MP4',
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-11-15'),
    salesCount: 89,
    rating: 4.9,
    reviews: [
      {
        id: '3',
        userId: 'user3',
        userName: 'Pedro Costa',
        rating: 5,
        comment: 'Curso incrível! Conteúdo muito bem estruturado e prático.',
        createdAt: new Date('2024-11-20')
      }
    ]
  },
  {
    id: '3',
    name: 'Plugin WordPress - Sistema de Vendas',
    description: 'Plugin completo para WordPress que transforma seu site em uma plataforma de vendas. Inclui carrinho de compras, gateway de pagamento, gestão de produtos e relatórios de vendas.',
    shortDescription: 'Plugin completo para WordPress que transforma seu site em uma plataforma de vendas.',
    price: 127.00,
    category: 'plugins',
    tags: ['wordpress', 'plugin', 'vendas', 'ecommerce'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop'
    ],
    fileSize: '1.8 MB',
    fileType: 'ZIP',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-05'),
    salesCount: 234,
    rating: 4.7,
    reviews: [
      {
        id: '4',
        userId: 'user4',
        userName: 'Ana Oliveira',
        rating: 4,
        comment: 'Plugin muito útil, mas a documentação poderia ser melhor.',
        createdAt: new Date('2024-11-25')
      }
    ]
  },
  {
    id: '4',
    name: 'E-book: Guia Completo de Vendas Online',
    description: 'E-book com estratégias comprovadas para aumentar suas vendas online. Inclui técnicas de copywriting, psicologia de vendas, funil de conversão e otimização de conversão.',
    shortDescription: 'E-book com estratégias comprovadas para aumentar suas vendas online.',
    price: 47.00,
    originalPrice: 67.00,
    category: 'ebooks',
    tags: ['vendas', 'ebook', 'copywriting', 'conversão'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop'
    ],
    fileSize: '8.5 MB',
    fileType: 'PDF',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-11-20'),
    salesCount: 567,
    rating: 4.6,
    reviews: [
      {
        id: '5',
        userId: 'user5',
        userName: 'Carlos Lima',
        rating: 5,
        comment: 'Conteúdo muito valioso! Já apliquei algumas técnicas e vi resultados.',
        createdAt: new Date('2024-11-30')
      }
    ]
  },
  {
    id: '5',
    name: 'Kit de Ícones Premium - 1000+ Ícones',
    description: 'Kit completo com mais de 1000 ícones em diferentes estilos (outline, filled, duotone). Inclui ícones para redes sociais, negócios, tecnologia, saúde e muito mais. Formatos SVG, PNG e AI.',
    shortDescription: 'Kit completo com mais de 1000 ícones em diferentes estilos.',
    price: 67.00,
    category: 'icones',
    tags: ['ícones', 'svg', 'design', 'ui'],
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop'
    ],
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    fileSize: '45.2 MB',
    fileType: 'ZIP',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-12-10'),
    salesCount: 789,
    rating: 4.8,
    reviews: [
      {
        id: '6',
        userId: 'user6',
        userName: 'Fernanda Silva',
        rating: 5,
        comment: 'Kit incrível! Ícones de alta qualidade e muito bem organizados.',
        createdAt: new Date('2024-12-01')
      }
    ]
  },
  {
    id: '6',
    name: 'Ferramenta de Análise de SEO',
    description: 'Ferramenta completa para análise de SEO. Inclui auditoria de sites, análise de palavras-chave, monitoramento de rankings e relatórios detalhados. Interface intuitiva e relatórios em PDF.',
    shortDescription: 'Ferramenta completa para análise de SEO com auditoria de sites.',
    price: 157.00,
    originalPrice: 197.00,
    category: 'ferramentas',
    tags: ['seo', 'ferramenta', 'análise', 'auditoria'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop'
    ],
    fileSize: '12.8 MB',
    fileType: 'EXE',
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-11-25'),
    salesCount: 123,
    rating: 4.9,
    reviews: [
      {
        id: '7',
        userId: 'user7',
        userName: 'Roberto Alves',
        rating: 5,
        comment: 'Ferramenta essencial para SEO! Relatórios muito detalhados.',
        createdAt: new Date('2024-12-05')
      }
    ]
  }
]; 