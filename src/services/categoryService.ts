import { 
  getBaserowRows, 
  createBaserowRow, 
  updateBaserowRow, 
  deleteBaserowRow,
  getBaserowRow,
  type BaserowRow 
} from '@/lib/baserow';

// Interface para categoria
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  type: 'product' | 'blog';
  created_at: string;
  updated_at: string;
}

// Configuração das tabelas (será configurada após criar no Baserow)
export const TABLE_IDS = {
  CATEGORIES: process.env.VITE_BASEROW_CATEGORIES_TABLE_ID || '0',
};

// Função para obter todas as categorias
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await getBaserowRows<Category>(parseInt(TABLE_IDS.CATEGORIES), {
    size: 1000, // Buscar todas as categorias
    order_by: 'name',
  });
  
  return response.results;
};

// Função para obter categorias por tipo
export const getCategoriesByType = async (type: 'product' | 'blog'): Promise<Category[]> => {
  const filter = `filter__field_type__equal=${type}`;
  const response = await getBaserowRows<Category>(parseInt(TABLE_IDS.CATEGORIES), {
    size: 1000,
    filter,
    order_by: 'name',
  });
  
  return response.results;
};

// Função para obter categorias de produtos
export const getProductCategories = async (): Promise<Category[]> => {
  return getCategoriesByType('product');
};

// Função para obter categorias de blog
export const getBlogCategories = async (): Promise<Category[]> => {
  return getCategoriesByType('blog');
};

// Função para obter uma categoria específica
export const getCategory = async (id: number): Promise<Category> => {
  return getBaserowRow<Category>(parseInt(TABLE_IDS.CATEGORIES), id);
};

// Função para criar uma nova categoria
export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  return createBaserowRow<Category>(parseInt(TABLE_IDS.CATEGORIES), categoryData);
};

// Função para atualizar uma categoria
export const updateCategory = async (id: number, categoryData: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> => {
  return updateBaserowRow<Category>(parseInt(TABLE_IDS.CATEGORIES), id, categoryData);
};

// Função para deletar uma categoria
export const deleteCategory = async (id: number): Promise<void> => {
  await deleteBaserowRow(parseInt(TABLE_IDS.CATEGORIES), id);
};

// Função para buscar categorias por nome
export const searchCategories = async (searchTerm: string, type?: 'product' | 'blog'): Promise<Category[]> => {
  const params: any = {
    search: searchTerm,
    size: 100,
    order_by: 'name',
  };

  if (type) {
    params.filter = `filter__field_type__equal=${type}`;
  }

  const response = await getBaserowRows<Category>(parseInt(TABLE_IDS.CATEGORIES), params);
  return response.results;
};

// Função para verificar se uma categoria está sendo usada
export const isCategoryInUse = async (categoryId: number, type: 'product' | 'blog'): Promise<boolean> => {
  try {
    // Esta função precisará ser implementada quando tivermos as tabelas de produtos e posts
    // Por enquanto, retorna false
    return false;
  } catch (error) {
    console.error('Erro ao verificar uso da categoria:', error);
    return false;
  }
};

// Função para obter estatísticas das categorias
export const getCategoryStats = async (): Promise<{
  total: number;
  products: number;
  blog: number;
}> => {
  const allCategories = await getAllCategories();
  
  return {
    total: allCategories.length,
    products: allCategories.filter(cat => cat.type === 'product').length,
    blog: allCategories.filter(cat => cat.type === 'blog').length,
  };
};

// Função para validar slug único
export const isSlugUnique = async (slug: string, excludeId?: number): Promise<boolean> => {
  const filter = `filter__field_slug__equal=${slug}`;
  const response = await getBaserowRows<Category>(parseInt(TABLE_IDS.CATEGORIES), {
    filter,
    size: 1,
  });
  
  if (response.results.length === 0) {
    return true;
  }
  
  // Se estamos editando, verificar se é o mesmo registro
  if (excludeId) {
    return response.results[0].id === excludeId;
  }
  
  return false;
};

// Função para gerar slug único
export const generateUniqueSlug = async (name: string, excludeId?: number): Promise<string> => {
  let slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
  
  let counter = 1;
  let uniqueSlug = slug;
  
  while (!(await isSlugUnique(uniqueSlug, excludeId))) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}; 