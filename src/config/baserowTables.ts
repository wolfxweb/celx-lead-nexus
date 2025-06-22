// Configuração das tabelas do Baserow
// IDs baseados nas variáveis de ambiente do .env

export const BASEROW_TABLES = {
  // Tabela de usuários
  USERS: {
    id: parseInt(import.meta.env.VITE_BASEROW_USERS_TABLE_ID || '629'),
    fields: {
      id: 'field_1',
      name: 'field_2',
      email: 'field_3',
      password_hash: 'field_4',
      role: 'field_5',
      avatar: 'field_6',
      created_at: 'field_7',
      updated_at: 'field_8',
      last_login: 'field_9',
    }
  },
  
  // Tabela de categorias (produtos e blog)
  CATEGORIES: {
    id: parseInt(import.meta.env.VITE_BASEROW_CATEGORIES_TABLE_ID || '634'),
    fields: {
      id: 'field_1',
      name: 'field_2',
      slug: 'field_3',
      description: 'field_4',
      color: 'field_5',
      type: 'field_6', // 'product' ou 'blog'
      created_at: 'field_7',
      updated_at: 'field_8',
    }
  },
  
  // Tabela de produtos
  PRODUCTS: {
    id: parseInt(import.meta.env.VITE_BASEROW_PRODUCTS_TABLE_ID || '628'),
    fields: {
      id: 'field_1',
      name: 'field_2',
      slug: 'field_3',
      description: 'field_4',
      price: 'field_5',
      images: 'field_6', // JSON array
      video: 'field_7',
      category_id: 'field_8',
      stock: 'field_9',
      active: 'field_10',
      created_at: 'field_11',
      updated_at: 'field_12',
    }
  },
  
  // Tabela de posts do blog
  BLOG_POSTS: {
    id: parseInt(import.meta.env.VITE_BASEROW_BLOG_POSTS_TABLE_ID || '632'),
    fields: {
      id: 'field_1',
      title: 'field_2',
      slug: 'field_3',
      content: 'field_4',
      excerpt: 'field_5',
      featured_image: 'field_6',
      category_id: 'field_7',
      author_id: 'field_8',
      published: 'field_9',
      published_at: 'field_10',
      created_at: 'field_11',
      updated_at: 'field_12',
    }
  },
  
  // Tabela de pedidos
  ORDERS: {
    id: parseInt(import.meta.env.VITE_BASEROW_ORDERS_TABLE_ID || '630'),
    fields: {
      id: 'field_1',
      user_id: 'field_2',
      status: 'field_3',
      total: 'field_4',
      shipping_address: 'field_5',
      billing_address: 'field_6',
      payment_method: 'field_7',
      created_at: 'field_8',
      updated_at: 'field_9',
    }
  },
  
  // Tabela de itens do pedido
  ORDER_ITEMS: {
    id: parseInt(import.meta.env.VITE_BASEROW_ORDER_ITEMS_TABLE_ID || '631'),
    fields: {
      id: 'field_1',
      order_id: 'field_2',
      product_id: 'field_3',
      quantity: 'field_4',
      price: 'field_5',
      created_at: 'field_6',
    }
  },
  
  // Tabela de avaliações de produtos
  PRODUCT_REVIEWS: {
    id: parseInt(import.meta.env.VITE_BASEROW_REVIEWS_TABLE_ID || '633'),
    fields: {
      id: 'field_1',
      product_id: 'field_2',
      user_id: 'field_3',
      rating: 'field_4',
      comment: 'field_5',
      created_at: 'field_6',
    }
  }
};

// Função para obter ID da tabela
export const getTableId = (tableName: keyof typeof BASEROW_TABLES): number => {
  return BASEROW_TABLES[tableName].id;
};

// Função para obter campo da tabela
export const getFieldId = (
  tableName: keyof typeof BASEROW_TABLES, 
  fieldName: string
): string => {
  const table = BASEROW_TABLES[tableName];
  const field = table.fields[fieldName as keyof typeof table.fields];
  
  if (!field) {
    throw new Error(`Campo '${fieldName}' não encontrado na tabela '${tableName}'`);
  }
  
  return field;
};

// Função para criar filtro de campo
export const createFieldFilter = (
  tableName: keyof typeof BASEROW_TABLES,
  fieldName: string,
  operator: 'equal' | 'contains' | 'greater_than' | 'less_than',
  value: string | number
): string => {
  const fieldId = getFieldId(tableName, fieldName);
  return `filter__${fieldId}__${operator}=${encodeURIComponent(value.toString())}`;
}; 