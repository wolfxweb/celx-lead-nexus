import { Product } from '@/types/ecommerce';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Template de Landing Page Premium',
    description: 'Template completo e responsivo para landing pages de alta conversão. Inclui 10 variações de design, formulários otimizados, integração com analytics e suporte completo.',
    shortDescription: 'Template premium para landing pages com alta conversão',
    price: 97.00,
    originalPrice: 197.00,
    category: 'templates',
    tags: ['landing page', 'conversão', 'premium', 'responsivo'],
    image: '/images/products/landing-template.jpg',
    images: [
      '/images/products/landing-template.jpg',
      '/images/products/landing-template-2.jpg',
      '/images/products/landing-template-3.jpg'
    ],
    downloadUrl: 'https://example.com/downloads/landing-template.zip',
    fileSize: '15.2 MB',
    fileType: 'ZIP',
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-19'),
    salesCount: 342,
    rating: 4.8,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'João Silva',
        rating: 5,
        comment: 'Template incrível! Aumentei minhas conversões em 40%',
        createdAt: new Date('2024-12-15')
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Maria Santos',
        rating: 4,
        comment: 'Muito bom, fácil de personalizar',
        createdAt: new Date('2024-12-10')
      }
    ]
  },
  {
    id: '2',
    name: 'Curso de Marketing Digital',
    description: 'Curso completo de marketing digital com 20 módulos, mais de 50 horas de conteúdo, exercícios práticos, certificado e acesso vitalício.',
    shortDescription: 'Curso completo de marketing digital com certificado',
    price: 297.00,
    originalPrice: 597.00,
    category: 'cursos',
    tags: ['marketing', 'digital', 'curso', 'certificado'],
    image: '/images/products/marketing-course.jpg',
    images: [
      '/images/products/marketing-course.jpg',
      '/images/products/marketing-course-2.jpg'
    ],
    downloadUrl: 'https://example.com/downloads/marketing-course.zip',
    fileSize: '2.1 GB',
    fileType: 'ZIP',
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-19'),
    salesCount: 156,
    rating: 4.9,
    reviews: [
      {
        id: '3',
        userId: 'user3',
        userName: 'Pedro Costa',
        rating: 5,
        comment: 'Conteúdo excelente, muito prático e atual',
        createdAt: new Date('2024-12-18')
      }
    ]
  },
  {
    id: '3',
    name: 'Plugin WordPress SEO',
    description: 'Plugin completo para otimização SEO em WordPress. Inclui análise de palavras-chave, otimização automática, relatórios detalhados e suporte premium.',
    shortDescription: 'Plugin completo para SEO em WordPress',
    price: 67.00,
    category: 'plugins',
    tags: ['wordpress', 'seo', 'plugin', 'otimização'],
    image: '/images/products/seo-plugin.jpg',
    images: [
      '/images/products/seo-plugin.jpg',
      '/images/products/seo-plugin-2.jpg'
    ],
    downloadUrl: 'https://example.com/downloads/seo-plugin.zip',
    fileSize: '5.8 MB',
    fileType: 'ZIP',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-12-19'),
    salesCount: 89,
    rating: 4.7,
    reviews: []
  },
  {
    id: '4',
    name: 'E-book: Guia de Vendas Online',
    description: 'E-book com estratégias comprovadas para aumentar vendas online. Inclui 25 técnicas práticas, estudos de caso e templates de copywriting.',
    shortDescription: 'Guia completo para aumentar vendas online',
    price: 37.00,
    originalPrice: 67.00,
    category: 'ebooks',
    tags: ['vendas', 'online', 'ebook', 'copywriting'],
    image: '/images/products/sales-ebook.jpg',
    images: [
      '/images/products/sales-ebook.jpg'
    ],
    downloadUrl: 'https://example.com/downloads/sales-ebook.pdf',
    fileSize: '8.5 MB',
    fileType: 'PDF',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-12-19'),
    salesCount: 234,
    rating: 4.6,
    reviews: [
      {
        id: '4',
        userId: 'user4',
        userName: 'Ana Oliveira',
        rating: 4,
        comment: 'Conteúdo muito útil, recomendo!',
        createdAt: new Date('2024-12-12')
      }
    ]
  },
  {
    id: '5',
    name: 'Kit de Ícones Premium',
    description: 'Kit com 500+ ícones vetoriais em SVG e PNG. Inclui ícones para redes sociais, e-commerce, tecnologia e muito mais. Licença comercial incluída.',
    shortDescription: '500+ ícones vetoriais para projetos digitais',
    price: 47.00,
    category: 'design',
    tags: ['ícones', 'vetorial', 'svg', 'design'],
    image: '/images/products/icon-kit.jpg',
    images: [
      '/images/products/icon-kit.jpg',
      '/images/products/icon-kit-2.jpg'
    ],
    downloadUrl: 'https://example.com/downloads/icon-kit.zip',
    fileSize: '12.3 MB',
    fileType: 'ZIP',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-12-19'),
    salesCount: 178,
    rating: 4.8,
    reviews: []
  },
  {
    id: '6',
    name: 'Template de E-commerce',
    description: 'Template completo para lojas online com carrinho de compras, sistema de pagamento, gestão de produtos e painel administrativo.',
    shortDescription: 'Template completo para lojas online',
    price: 147.00,
    originalPrice: 247.00,
    category: 'templates',
    tags: ['e-commerce', 'loja', 'template', 'pagamento'],
    image: '/images/products/ecommerce-template.jpg',
    images: [
      '/images/products/ecommerce-template.jpg',
      '/images/products/ecommerce-template-2.jpg'
    ],
    downloadUrl: 'https://example.com/downloads/ecommerce-template.zip',
    fileSize: '28.7 MB',
    fileType: 'ZIP',
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-12-19'),
    salesCount: 95,
    rating: 4.9,
    reviews: []
  }
];

export const categories = [
  {
    id: '1',
    name: 'Templates',
    slug: 'templates',
    description: 'Templates prontos para websites e aplicações',
    image: '/images/categories/templates.jpg',
    productCount: 2
  },
  {
    id: '2',
    name: 'Cursos',
    slug: 'cursos',
    description: 'Cursos online com certificado',
    image: '/images/categories/courses.jpg',
    productCount: 1
  },
  {
    id: '3',
    name: 'Plugins',
    slug: 'plugins',
    description: 'Plugins para WordPress e outras plataformas',
    image: '/images/categories/plugins.jpg',
    productCount: 1
  },
  {
    id: '4',
    name: 'E-books',
    slug: 'ebooks',
    description: 'Livros digitais e guias práticos',
    image: '/images/categories/ebooks.jpg',
    productCount: 1
  },
  {
    id: '5',
    name: 'Design',
    slug: 'design',
    description: 'Recursos de design e criativos',
    image: '/images/categories/design.jpg',
    productCount: 1
  }
]; 