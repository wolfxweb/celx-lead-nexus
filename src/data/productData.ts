// Dados compartilhados dos produtos
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  image: string;
  images: string[];
  video?: string;
  fileSize: string;
  fileType: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  salesCount: number;
  rating: number;
  reviews: ProductReview[];
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Categorias padrão dos produtos
export const defaultProductCategories: ProductCategory[] = [
  { id: 1, name: 'Templates', slug: 'templates', description: 'Templates e temas para sites', color: 'blue' },
  { id: 2, name: 'Cursos', slug: 'cursos', description: 'Cursos online e treinamentos', color: 'green' },
  { id: 3, name: 'Plugins', slug: 'plugins', description: 'Plugins e extensões', color: 'purple' },
  { id: 4, name: 'E-books', slug: 'ebooks', description: 'Livros digitais e guias', color: 'orange' },
  { id: 5, name: 'Ícones', slug: 'icones', description: 'Pacotes de ícones e elementos visuais', color: 'pink' },
  { id: 6, name: 'Ferramentas', slug: 'ferramentas', description: 'Ferramentas e softwares', color: 'red' },
  { id: 7, name: 'Design', slug: 'design', description: 'Recursos de design e UI/UX', color: 'teal' },
  { id: 8, name: 'Marketing', slug: 'marketing', description: 'Ferramentas e recursos de marketing', color: 'indigo' }
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