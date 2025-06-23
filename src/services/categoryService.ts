import { 
  getBaserowRows, 
  createBaserowRow, 
  updateBaserowRow, 
  deleteBaserowRow,
  getBaserowRow
} from '@/lib/baserow';
import { getTableId, createFieldFilter } from '@/config/baserowTables';

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

// Função para obter todas as categorias
export const getAllCategories = async (): Promise<Category[]> => {
  const tableId = getTableId('CATEGORIES');
  const response = await getBaserowRows<Category>(tableId, {
    size: 200,
    order_by: 'name',
  });
  
  return response.results;
};

// Função para obter categorias por tipo
export const getCategoriesByType = async (type: 'product' | 'blog'): Promise<Category[]> => {
  const tableId = getTableId('CATEGORIES');
  
  const response = await getBaserowRows<Category>(tableId, {
    size: 200,
    order_by: 'name',
  });
  
  // Filtrar localmente por tipo
  return response.results.filter(category => category.type === type);
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
  const tableId = getTableId('CATEGORIES');
  return getBaserowRow<Category>(tableId, id);
};

// Função para criar uma nova categoria
export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  const tableId = getTableId('CATEGORIES');
  return createBaserowRow<Category>(tableId, categoryData);
};

// Função para atualizar uma categoria
export const updateCategory = async (id: number, categoryData: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> => {
  const tableId = getTableId('CATEGORIES');
  return updateBaserowRow<Category>(tableId, id, categoryData);
};

// Função para deletar uma categoria
export const deleteCategory = async (id: number): Promise<void> => {
  const tableId = getTableId('CATEGORIES');
  await deleteBaserowRow(tableId, id);
};

// Função para buscar categorias por nome
export const searchCategories = async (searchTerm: string, type?: 'product' | 'blog'): Promise<Category[]> => {
  const tableId = getTableId('CATEGORIES');
  const params = {
    search: searchTerm,
    size: 100,
    order_by: 'name',
  };

  const response = await getBaserowRows<Category>(tableId, params);
  
  // Filtrar por tipo localmente se especificado
  if (type) {
    return response.results.filter(category => category.type === type);
  }
  
  return response.results;
};

// Função para verificar se uma categoria está sendo usada
export const isCategoryInUse = async (categoryId: number, type: 'product' | 'blog'): Promise<boolean> => {
  try {
    const tableId = getTableId(type === 'product' ? 'PRODUCTS' : 'BLOG_POSTS');
    
    const response = await getBaserowRows(tableId, { size: 1 });
    
    // Filtrar localmente
    const items = response.results.filter((item: any) => {
      const itemCategoryId = parseInt(item.category_id);
      return itemCategoryId === categoryId;
    });
    
    return items.length > 0;
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
  const tableId = getTableId('CATEGORIES');
  const response = await getBaserowRows<Category>(tableId, {
    size: 100,
  });
  
  // Filtrar localmente por slug
  const matchingCategories = response.results.filter(category => category.slug === slug);
  
  if (matchingCategories.length === 0) {
    return true;
  }
  
  if (excludeId) {
    return matchingCategories[0].id === excludeId;
  }
  
  return false;
};

// Função para gerar slug único
export const generateUniqueSlug = async (name: string, excludeId?: number): Promise<string> => {
  let slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  let counter = 1;
  let uniqueSlug = slug;
  
  while (!(await isSlugUnique(uniqueSlug, excludeId))) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}; 