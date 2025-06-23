// Configuração do Baserow
export const BASEROW_CONFIG = {
  BASE_URL: 'https://master-baserow.219u5p.easypanel.host',
  API_URL: 'https://master-baserow.219u5p.easypanel.host/api',
  DATABASE_ID: import.meta.env.VITE_BASEROW_DATABASE_ID || '134',
  TOKEN: import.meta.env.VITE_BASEROW_TOKEN || '',
};

// Tipos para autenticação
export interface BaserowAuth {
  token: string;
  refresh_token?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Tipos para tabelas
export interface BaserowTable {
  id: number;
  name: string;
  order: number;
  database_id: number;
}

export interface BaserowField {
  id: number;
  name: string;
  type: string;
  table_id: number;
  order: number;
}

// Tipos para dados
export interface BaserowRow {
  id: number;
  [key: string]: any;
}

export interface BaserowResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Função para obter token do localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('celx_token');
  }
  return null;
};

// Função para obter headers da API
export const getBaserowHeaders = (token?: string) => {
  const authToken = token || BASEROW_CONFIG.TOKEN;
  
  if (!authToken) {
    throw new Error('Token do Baserow não configurado. Verifique o arquivo .env');
  }
  
  return {
    'Authorization': `Token ${authToken}`,
    'Content-Type': 'application/json',
  };
};

// Função para fazer requisições à API
export const baserowRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASEROW_CONFIG.API_URL}${endpoint}`;
  const headers = getBaserowHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch (e) {
      errorBody = { detail: response.statusText };
    }
    
    // Log do erro real para depuração
    console.error('Baserow API Error Body:', errorBody);

    // Garante que a mensagem de erro seja sempre uma string JSON
    const errorMessage = JSON.stringify(errorBody);
    
    throw new Error(errorMessage);
  }

  // Para operações DELETE, a resposta pode estar vazia
  if (options.method === 'DELETE') {
    return {} as T;
  }

  // Verificar se há conteúdo antes de tentar fazer parse JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch (e) {
    // Se não conseguir fazer parse do JSON, retorna objeto vazio
    return {} as T;
  }
};

// Função para autenticar
export const authenticateBaserow = async (
  email: string,
  password: string
): Promise<BaserowAuth> => {
  const response = await fetch(`${BASEROW_CONFIG.API_URL}/user/token-auth/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Falha na autenticação do Baserow');
  }

  return response.json();
};

// Função para obter token de acesso
export const getBaserowToken = async (
  email: string,
  password: string
): Promise<string> => {
  const auth = await authenticateBaserow(email, password);
  return auth.token;
};

// Função para listar tabelas do banco
export const getBaserowTables = async (databaseId: number): Promise<BaserowTable[]> => {
  return baserowRequest<BaserowTable[]>(`/database/tables/database/${databaseId}/`);
};

// Função para listar campos de uma tabela
export const getBaserowFields = async (tableId: number): Promise<BaserowField[]> => {
  return baserowRequest<BaserowField[]>(`/database/fields/table/${tableId}/`);
};

// Função para obter dados de uma tabela
export const getBaserowRows = async <T = BaserowRow>(
  tableId: number,
  params: {
    page?: number;
    size?: number;
    search?: string;
    filter?: Record<string, string | number>;
    orderBy?: string;
  } = {}
): Promise<BaserowResponse<T>> => {
  const searchParams = new URLSearchParams({ user_field_names: 'true' });
  
  if (params.page) searchParams.append('page', String(params.page));
  if (params.size) searchParams.append('size', String(params.size));
  if (params.search) searchParams.append('search', params.search);
  if (params.filter) {
    for (const fieldName in params.filter) {
      if (Object.prototype.hasOwnProperty.call(params.filter, fieldName)) {
        const value = params.filter[fieldName];
        // O padrão é 'equal', mas pode ser estendido no futuro
        const filterParam = `filter__field_${fieldName}__equal`;
        searchParams.append(filterParam, String(value));
      }
    }
  }
  if (params.orderBy) searchParams.append('order_by', params.orderBy);

  const queryString = searchParams.toString();
  const endpoint = `/database/rows/table/${tableId}/?${queryString}`;
  
  return baserowRequest<BaserowResponse<T>>(endpoint);
};

// Função para criar uma nova linha
export const createBaserowRow = async <T = BaserowRow>(
  tableId: number,
  data: Record<string, any>
): Promise<T> => {
  const endpoint = `/database/rows/table/${tableId}/?user_field_names=true`;
  return baserowRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Função para atualizar uma linha
export const updateBaserowRow = async <T = BaserowRow>(
  tableId: number,
  rowId: number,
  data: Record<string, any>
): Promise<T> => {
  const endpoint = `/database/rows/table/${tableId}/${rowId}/?user_field_names=true`;
  return baserowRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Função para deletar uma linha
export const deleteBaserowRow = async (
  tableId: number,
  rowId: number
): Promise<void> => {
  const endpoint = `/database/rows/table/${tableId}/${rowId}/?user_field_names=true`;
  
  await baserowRequest(endpoint, {
    method: 'DELETE',
  });
};

// Função para obter uma linha específica
export const getBaserowRow = async <T = BaserowRow>(
  tableId: number,
  rowId: number
): Promise<T> => {
  const endpoint = `/database/rows/table/${tableId}/${rowId}/?user_field_names=true`;
  return baserowRequest<T>(endpoint);
}; 