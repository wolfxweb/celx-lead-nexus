import { BASEROW_CONFIG, baserowRequest, getBaserowHeaders, getBaserowRows, createBaserowRow, getBaserowRow, updateBaserowRow } from '@/lib/baserow';
import { User, LoginCredentials, RegisterData } from '@/types/auth';
import { getTableId, getFieldId, createFieldFilter } from '@/config/baserowTables';

// Interface para usuário no Baserow
export interface BaserowUser {
  id: number;
  name: string;
  email: string;
  password_hash: string; // Corrigido de 'password' para 'password_hash'
  role: 'admin' | 'user';
  avatar?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active?: boolean;
}

// Interface para resposta de autenticação do Baserow
export interface BaserowAuthResponse {
  token: string;
  refresh_token?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Função para autenticar usuário
export const authenticateUser = async (credentials: LoginCredentials): Promise<BaserowAuthResponse> => {
  try {
    const response = await fetch(`${BASEROW_CONFIG.API_URL}/user/token-auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Email ou senha inválidos');
    }

    return response.json();
  } catch (error) {
    throw new Error('Falha na autenticação');
  }
};

// Função para buscar usuário por email (CORRIGIDA)
export const getUserByEmail = async (email: string): Promise<BaserowUser | null> => {
  try {
    const tableId = getTableId('USERS');
    const filter = createFieldFilter('USERS', 'email', 'equal', email);
    
    const response = await getBaserowRows<BaserowUser>(tableId, { filter });

    if (response.results.length > 0) {
      return response.results[0];
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

// Função para criar novo usuário (CORRIGIDA)
export const createUser = async (userData: RegisterData): Promise<BaserowUser> => {
  try {
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Este email já está em uso');
    }

    const hashedPassword = await hashPassword(userData.password);
    const tableId = getTableId('USERS');
    
    // Corpo da requisição com nomes de campo corretos
    const newUserPayload = {
      name: userData.name,
      email: userData.email,
      password_hash: hashedPassword,
      role: 'user',
      is_active: "true", // Define o usuário como ativo no registro (enviando como string)
    };

    // Usa a função createBaserowRow que está 100% correta
    const newUser = await createBaserowRow<BaserowUser>(tableId, newUserPayload);

    return newUser;
  } catch (error) {
    console.error("Falha detalhada ao criar usuário:", error);
    throw error;
  }
};

// Função para atualizar último login
export const updateLastLogin = async (userId: number): Promise<void> => {
  try {
    const tableId = getTableId('USERS');
    const lastLoginField = getFieldId('USERS', 'last_login');
    
    await updateBaserowRow(tableId, userId, {
        [lastLoginField]: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar último login:', error);
  }
};

// Função para obter usuário por ID
export const getUserById = async (userId: number): Promise<BaserowUser | null> => {
  try {
    const tableId = getTableId('USERS');
    const user = await getBaserowRow<BaserowUser>(tableId, userId);
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    return null;
  }
};

// Função para atualizar perfil do usuário
export const updateUserProfile = async (
  userId: number,
  data: Partial<Pick<BaserowUser, 'name' | 'avatar'>>
): Promise<BaserowUser> => {
  try {
    const tableId = getTableId('USERS');
    const updateData: Record<string, any> = {};
    
    if (data.name) {
      updateData[getFieldId('USERS', 'name')] = data.name;
    }
    if (data.avatar) {
      updateData[getFieldId('USERS', 'avatar')] = data.avatar;
    }

    const updatedUser = await baserowRequest<BaserowUser>(
      `/database/rows/table/${tableId}/${userId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error('Erro ao atualizar perfil');
  }
};

// Função para alterar senha
export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    // Buscar usuário atual
    const user = await getUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedNewPassword = await hashPassword(newPassword);

    // Atualizar senha
    const tableId = getTableId('USERS');
    const passwordField = getFieldId('USERS', 'password_hash');
    
    await baserowRequest(
      `/database/rows/table/${tableId}/${userId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          [passwordField]: hashedNewPassword,
        }),
      }
    );
  } catch (error) {
    throw new Error('Erro ao alterar senha');
  }
};

// Função para listar todos os usuários (apenas admin)
export const getAllUsers = async (): Promise<BaserowUser[]> => {
  try {
    const tableId = getTableId('USERS');
    const response = await baserowRequest<{ results: BaserowUser[] }>(
      `/database/rows/table/${tableId}/`
    );
    return response.results;
  } catch (error) {
    throw new Error('Erro ao listar usuários');
  }
};

// Função para deletar usuário (apenas admin)
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const tableId = getTableId('USERS');
    await baserowRequest(
      `/database/rows/table/${tableId}/${userId}/`,
      {
        method: 'DELETE',
      }
    );
  } catch (error) {
    throw new Error('Erro ao deletar usuário');
  }
};

// Função para alterar role do usuário (apenas admin)
export const updateUserRole = async (userId: number, role: 'admin' | 'user'): Promise<BaserowUser> => {
  try {
    const tableId = getTableId('USERS');
    const roleField = getFieldId('USERS', 'role');
    
    const updatedUser = await baserowRequest<BaserowUser>(
      `/database/rows/table/${tableId}/${userId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          [roleField]: role,
        }),
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error('Erro ao atualizar role do usuário');
  }
};

// Funções auxiliares para hash de senha (simplificadas para desenvolvimento)
// Em produção, use bcrypt ou similar
const hashPassword = async (password: string): Promise<string> => {
  // Simulação de hash - em produção use bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
};

// Função para converter BaserowUser para User
export const convertBaserowUserToUser = (baserowUser: BaserowUser): User => {
  return {
    id: baserowUser.id.toString(),
    name: baserowUser.name,
    email: baserowUser.email,
    role: baserowUser.role,
    avatar: baserowUser.avatar,
    createdAt: new Date(baserowUser.created_at),
    lastLogin: baserowUser.last_login ? new Date(baserowUser.last_login) : undefined,
  };
}; 