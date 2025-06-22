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
  const authToken = token || getAuthToken() || BASEROW_CONFIG.TOKEN;
  
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
    throw new Error(`Baserow API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
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
    filter?: string;
    order_by?: string;
  } = {}
): Promise<BaserowResponse<T>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.size) searchParams.append('size', params.size.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.filter) searchParams.append('filter', params.filter);
  if (params.order_by) searchParams.append('order_by', params.order_by);

  const queryString = searchParams.toString();
  const endpoint = `/database/rows/table/${tableId}/${queryString ? `?${queryString}` : ''}`;
  
  return baserowRequest<BaserowResponse<T>>(endpoint);
};

// Função para criar uma nova linha
export const createBaserowRow = async <T = BaserowRow>(
  tableId: number,
  data: Record<string, any>
): Promise<T> => {
  return baserowRequest<T>(`/database/rows/table/${tableId}/`, {
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
  return baserowRequest<T>(`/database/rows/table/${tableId}/${rowId}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Função para deletar uma linha
export const deleteBaserowRow = async (
  tableId: number,
  rowId: number
): Promise<void> => {
  await baserowRequest(`/database/rows/table/${tableId}/${rowId}/`, {
    method: 'DELETE',
  });
};

// Função para obter uma linha específica
export const getBaserowRow = async <T = BaserowRow>(
  tableId: number,
  rowId: number
): Promise<T> => {
  return baserowRequest<T>(`/database/rows/table/${tableId}/${rowId}/`);
}; 