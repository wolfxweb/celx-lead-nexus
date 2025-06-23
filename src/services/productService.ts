import { 
  getBaserowRows, 
  createBaserowRow, 
  updateBaserowRow, 
  deleteBaserowRow,
  getBaserowRow 
} from '@/lib/baserow';
import { getTableId } from '@/config/baserowTables';
import type { Product } from '@/types/ecommerce'; // Usando o tipo Product principal

// Interface que reflete exatamente os campos da tabela PRODUCTS no Baserow
// Baseado nos dados reais retornados pela API
export interface BaserowProduct {
  id: number;
  order: string;
  name: string;
  short_description: string;
  description: string;
  price: string; // Vem como string da API
  original_price: string; // Vem como string da API
  category_id: string; // Vem como string (nome da categoria)
  tags: string; // Vem como string separada por vírgula
  image: string;
  images: string; // Vem como string separada por ponto e vírgula
  video_url: string;
  file_size: string;
  file_type: string;
  is_active: string; // Vem como string "true"/"false"
  is_featured: string; // Vem como string "true"/"false"
  sales_count: string; // Vem como string da API
  rating: string; // Vem como string da API
  created_at: string;
  updated_at: string;
  product_type: string;
  linked_course_id: string;
}

// Função para obter todos os produtos
export const getAllProducts = async (params: {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
} = {}): Promise<{ products: BaserowProduct[], count: number }> => {
  const tableId = getTableId('PRODUCTS');
  const queryParams: any = { size: params.limit || 200 };
  
  if (params.offset) {
    // Baserow usa `page` e `size` para paginação.
    // É preciso calcular a página a partir do offset.
    const page = Math.floor(params.offset / (params.limit || 200)) + 1;
    queryParams.page = page;
  }

  if (params.search) {
    queryParams.search = params.search;
  }
  
  // O filtro de categoria precisa ser implementado com o ID da categoria,
  // não com o slug. Isto exigiria uma busca extra ou um ajuste no frontend.
  // Por agora, vamos deixar a filtragem de categoria de lado para simplificar.

  const response = await getBaserowRows<BaserowProduct>(tableId, queryParams);
  
  return { products: response.results, count: response.count };
};

// Função para obter um produto específico
export const getProduct = async (id: number): Promise<BaserowProduct> => {
  const tableId = getTableId('PRODUCTS');
  return getBaserowRow<BaserowProduct>(tableId, id);
};

// Função para criar um novo produto
export const createProduct = async (productData: Omit<BaserowProduct, 'id' | 'order' | 'created_at' | 'updated_at'>): Promise<BaserowProduct> => {
  const tableId = getTableId('PRODUCTS');
  return createBaserowRow<BaserowProduct>(tableId, productData);
};

// Função para atualizar um produto
export const updateProduct = async (id: number, productData: Partial<Omit<BaserowProduct, 'id' | 'order' | 'created_at' | 'updated_at'>>): Promise<BaserowProduct> => {
  const tableId = getTableId('PRODUCTS');
  return updateBaserowRow<BaserowProduct>(tableId, id, productData);
};

// Função para deletar um produto
export const deleteProduct = async (id: number): Promise<void> => {
  const tableId = getTableId('PRODUCTS');
  await deleteBaserowRow(tableId, id);
}; 