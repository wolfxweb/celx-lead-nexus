// Dados compartilhados do blog
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
  status: 'published' | 'draft' | 'scheduled';
  scheduledDate?: string;
  tags?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

// Categorias padrão do blog
export const defaultCategories: BlogCategory[] = [
  { id: 1, name: 'Tecnologia', slug: 'tecnologia', description: 'Posts sobre tecnologia e inovação', color: 'blue' },
  { id: 2, name: 'Segurança', slug: 'seguranca', description: 'Posts sobre segurança cibernética', color: 'red' },
  { id: 3, name: 'Cloud', slug: 'cloud', description: 'Posts sobre cloud computing', color: 'purple' },
  { id: 4, name: 'Inteligência Artificial', slug: 'ai', description: 'Posts sobre IA e machine learning', color: 'green' },
  { id: 5, name: 'Marketing', slug: 'marketing', description: 'Posts sobre marketing digital', color: 'orange' },
  { id: 6, name: 'Desenvolvimento', slug: 'desenvolvimento', description: 'Posts sobre desenvolvimento web', color: 'indigo' },
  { id: 7, name: 'Design', slug: 'design', description: 'Posts sobre UX/UI design', color: 'pink' },
  { id: 8, name: 'E-commerce', slug: 'ecommerce', description: 'Posts sobre e-commerce', color: 'teal' }
];

// Posts padrão do blog
export const defaultPosts: BlogPost[] = [
  {
    id: 1,
    title: 'O Futuro da Transformação Digital nas Empresas',
    excerpt: 'A transformação digital não é mais uma opção, mas uma necessidade...',
    content: '<p>Conteúdo completo do post sobre transformação digital e como as empresas podem se adaptar...</p>',
    status: 'published',
    author: 'Carlos Silva',
    date: '2024-06-15',
    readTime: '5 min',
    category: 'tecnologia',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    tags: 'transformação digital, tecnologia, inovação',
    metaDescription: 'Descubra como a transformação digital pode revolucionar sua empresa e impulsionar o crescimento no mercado atual.',
    metaKeywords: 'transformação digital, tecnologia empresarial, inovação, digitalização'
  },
  {
    id: 2,
    title: 'Segurança Cibernética: Protegendo Seus Dados',
    excerpt: 'As melhores práticas para manter sua empresa segura...',
    content: '<p>Conteúdo completo do post sobre segurança cibernética e proteção de dados empresariais...</p>',
    status: 'published',
    author: 'Ana Costa',
    date: '2024-06-10',
    readTime: '7 min',
    category: 'seguranca',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    tags: 'segurança, cibernética, proteção',
    metaDescription: 'Aprenda as estratégias essenciais de segurança cibernética para proteger sua empresa contra ameaças digitais.',
    metaKeywords: 'segurança cibernética, proteção de dados, cybersecurity, segurança digital'
  },
  {
    id: 3,
    title: 'Cloud Computing: O Futuro da Infraestrutura',
    excerpt: 'Como migrar para a nuvem pode revolucionar sua infraestrutura...',
    content: '<p>Conteúdo completo sobre cloud computing e suas vantagens...</p>',
    status: 'draft',
    author: 'Pedro Santos',
    date: '2024-06-12',
    readTime: '6 min',
    category: 'cloud',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    scheduledDate: '2024-06-20',
    tags: 'cloud, infraestrutura, tecnologia',
    metaDescription: 'Entenda como o cloud computing pode transformar sua infraestrutura de TI.',
    metaKeywords: 'cloud computing, infraestrutura, nuvem, tecnologia'
  }
];

// Função para gerar slug
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}; 