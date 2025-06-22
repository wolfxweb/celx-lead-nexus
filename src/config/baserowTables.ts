// Configuração das tabelas do Baserow
// IDs baseados nas variáveis de ambiente do .env

export const BASEROW_TABLES = {
  // Tabela de usuários
  USERS: {
    id: parseInt(import.meta.env.VITE_BASEROW_USERS_TABLE_ID || '629'),
    fields: {
      id: 'id',
      name: 'name',
      email: 'email',
      password_hash: 'password_hash',
      role: 'role',
      avatar: 'avatar',
      phone: 'phone',
      address: 'address',
      is_active: 'is_active',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  
  // Tabela de categorias (produtos e blog)
  CATEGORIES: {
    id: parseInt(import.meta.env.VITE_BASEROW_CATEGORIES_TABLE_ID || '634'),
    fields: {
      id: 'id',
      name: 'name',
      slug: 'slug',
      description: 'description',
      color: 'color',
      type: 'type', // 'product' ou 'blog'
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  
  // Tabela de produtos
  PRODUCTS: {
    id: parseInt(import.meta.env.VITE_BASEROW_PRODUCTS_TABLE_ID || '628'),
    fields: {
      id: 'id',
      name: 'name',
      short_description: 'short_description',
      description: 'description',
      price: 'price',
      original_price: 'original_price',
      category_id: 'category_id',
      tags: 'tags',
      image: 'image',
      images: 'images',
      video_url: 'video_url',
      file_size: 'file_size',
      file_type: 'file_type',
      is_active: 'is_active',
      is_featured: 'is_featured',
      sales_count: 'sales_count',
      rating: 'rating',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  
  // Tabela de posts do blog
  BLOG_POSTS: {
    id: parseInt(import.meta.env.VITE_BASEROW_BLOG_POSTS_TABLE_ID || '632'),
    fields: {
      id: 'id',
      title: 'title',
      excerpt: 'excerpt',
      content: 'content',
      category_id: 'category_id',
      author_id: 'author_id',
      image: 'image',
      status: 'status',
      scheduled_date: 'scheduled_date',
      tags: 'tags',
      meta_description: 'meta_description',
      meta_keywords: 'meta_keywords',
      read_time: 'read_time',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  
  // Tabela de pedidos
  ORDERS: {
    id: parseInt(import.meta.env.VITE_BASEROW_ORDERS_TABLE_ID || '630'),
    fields: {
      id: 'id',
      user_id: 'user_id',
      guest_email: 'guest_email',
      guest_name: 'guest_name',
      total: 'total',
      status: 'status',
      payment_method: 'payment_method',
      payment_status: 'payment_status',
      shipping_address: 'shipping_address',
      billing_address: 'billing_address',
      notes: 'notes',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  
  // Tabela de itens do pedido
  ORDER_ITEMS: {
    id: parseInt(import.meta.env.VITE_BASEROW_ORDER_ITEMS_TABLE_ID || '631'),
    fields: {
      id: 'id',
      order_id: 'order_id',
      product_id: 'product_id',
      quantity: 'quantity',
      price: 'price',
      created_at: 'created_at',
    }
  },
  
  // Tabela de avaliações de produtos
  PRODUCT_REVIEWS: {
    id: parseInt(import.meta.env.VITE_BASEROW_REVIEWS_TABLE_ID || '633'),
    fields: {
      id: 'id',
      product_id: 'product_id',
      user_id: 'user_id',
      guest_name: 'guest_name',
      guest_email: 'guest_email',
      rating: 'rating',
      comment: 'comment',
      is_verified: 'is_verified',
      is_approved: 'is_approved',
      created_at: 'created_at',
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