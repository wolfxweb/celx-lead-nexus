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
      product_type: 'product_type',
      linked_course_id: 'linked_course_id',
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
  },
  
  // Tabela de inscrições da newsletter
  NEWSLETTER_SUBSCRIPTIONS: {
    id: parseInt(import.meta.env.VITE_BASEROW_NEWSLETTER_TABLE_ID || '635'),
    fields: {
      id: 'id',
      email: 'email',
      name: 'name',
      subscribed_at: 'subscribed_at',
      status: 'status',
      source: 'source',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },

  // Tabela de configurações de pop-up
  POPUP_CONFIGS: {
    id: parseInt(import.meta.env.VITE_BASEROW_POPUP_CONFIGS_TABLE_ID || '636'),
    fields: {
      id: 'id',
      title: 'title',
      message: 'message',
      show_email_field: 'show_email_field',
      email_placeholder: 'email_placeholder',
      button_text: 'button_text',
      pdf_url: 'pdf_url',
      delay: 'delay',
      pages: 'pages',
      is_active: 'is_active',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },

  // Tabela de emails capturados por pop-up
  POPUP_EMAILS: {
    id: parseInt(import.meta.env.VITE_BASEROW_POPUP_EMAILS_TABLE_ID || '637'),
    fields: {
      id: 'id',
      email: 'email',
      popup_id: 'popup_id',
      page: 'page',
      timestamp: 'timestamp',
      created_at: 'created_at',
    }
  },

  // Tabela de instâncias do WhatsApp
  WHATSAPP_INSTANCES: {
    id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_INSTANCES_TABLE_ID || '643'),
    fields: {
      id: 'id',
      name: 'name',
      phone: 'phone',
      status: 'status',
      qr_code: 'qr_code',
      user_id: 'user_id',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },

  // Tabela de mensagens do WhatsApp
  WHATSAPP_MESSAGES: {
    id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_MESSAGES_TABLE_ID || '644'),
    fields: {
      id: 'id',
      instance_id: 'instance_id',
      to: 'to',
      message: 'message',
      type: 'type',
      status: 'status',
      scheduled_at: 'scheduled_at',
      sent_at: 'sent_at',
      created_at: 'created_at',
      user_id: 'user_id',
    }
  },

  // Tabela de webhooks do WhatsApp
  WHATSAPP_WEBHOOKS: {
    id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_WEBHOOKS_TABLE_ID || '645'),
    fields: {
      id: 'id',
      instance_id: 'instance_id',
      url: 'url',
      events: 'events',
      is_active: 'is_active',
      created_at: 'created_at',
      user_id: 'user_id',
    }
  },

  // Tabela de configurações do WhatsApp
  WHATSAPP_SETTINGS: {
    id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_SETTINGS_TABLE_ID || '646'),
    fields: {
      id: 'id',
      user_id: 'user_id',
      evolution_api_url: 'evolution_api_url',
      evolution_api_key: 'evolution_api_key',
      default_instance_id: 'default_instance_id',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },

  // Tabela de licenças do WhatsApp
  WHATSAPP_LICENSES: {
    id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_LICENSES_TABLE_ID || '647'),
    fields: {
      id: 'id',
      name: 'name',
      description: 'description',
      short_description: 'short_description',
      price: 'price',
      original_price: 'original_price',
      license_type: 'license_type',
      instance_limit: 'instance_limit',
      message_limit: 'message_limit',
      duration_days: 'duration_days',
      features: 'features',
      is_active: 'is_active',
      is_featured: 'is_featured',
      sales_count: 'sales_count',
      rating: 'rating',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },

  // Tabela de compras de licenças do WhatsApp
  WHATSAPP_LICENSE_PURCHASES: {
    id: parseInt(import.meta.env.VITE_BASEROW_WHATSAPP_LICENSE_PURCHASES_TABLE_ID || '648'),
    fields: {
      id: 'id',
      user_id: 'user_id',
      license_id: 'license_id',
      purchase_date: 'purchase_date',
      expiry_date: 'expiry_date',
      status: 'status',
      instances_created: 'instances_created',
      messages_sent: 'messages_sent',
      payment_status: 'payment_status',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  }
};

const COURSE_TABLES = {
  COURSES: {
    id: parseInt(import.meta.env.VITE_BASEROW_COURSES_TABLE_ID || '0'),
    fields: {
      id: 'id',
      title: 'title',
      description: 'description',
      cover_image: 'cover_image',
      instructor_id: 'instructor_id',
      product_id: 'product_id',
      is_published: 'is_published',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  COURSE_MODULES: {
    id: parseInt(import.meta.env.VITE_BASEROW_COURSE_MODULES_TABLE_ID || '0'),
    fields: {
      id: 'id',
      course_id: 'course_id',
      title: 'title',
      description: 'description',
      order: 'order',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  COURSE_LESSONS: {
    id: parseInt(import.meta.env.VITE_BASEROW_COURSE_LESSONS_TABLE_ID || '0'),
    fields: {
      id: 'id',
      module_id: 'module_id',
      title: 'title',
      content_type: 'content_type',
      video_url: 'video_url',
      pdf_file: 'pdf_file',
      text_content: 'text_content',
      quiz_data: 'quiz_data',
      order: 'order',
      is_free_preview: 'is_free_preview',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  },
  LESSON_DOUBTS: {
    id: parseInt(import.meta.env.VITE_BASEROW_LESSON_DOUBTS_TABLE_ID || '0'),
    fields: {
      id: 'id',
      lesson_id: 'lesson_id',
      user_id: 'user_id',
      doubt_text: 'doubt_text',
      answer_text: 'answer_text',
      answered_by_id: 'answered_by_id',
      is_resolved: 'is_resolved',
      created_at: 'created_at',
      answered_at: 'answered_at',
    }
  }
};

// Merge dos objetos de tabelas
export const ALL_TABLES = {
  ...BASEROW_TABLES,
  ...COURSE_TABLES,
};

// Tipo para os nomes das tabelas
export type TableName = keyof typeof ALL_TABLES;

// Função para obter ID da tabela
export const getTableId = (tableName: TableName): number => {
  return ALL_TABLES[tableName].id;
};

// Função para obter o nome de um campo
export const getFieldId = (
  tableName: TableName, 
  fieldName: string
): string => {
  const tableFields = (ALL_TABLES[tableName] as any).fields;
  return tableFields[fieldName] || fieldName;
};

// Função para criar um filtro de forma segura
export const createFieldFilter = (
  tableName: TableName,
  fieldName: string,
  operator: 'equal' | 'contains' | 'greater_than' | 'less_than',
  value: string | number
): string => {
  const fieldId = getFieldId(tableName, fieldName);
  return `filter__${fieldId}__${operator}=${encodeURIComponent(value.toString())}`;
}; 