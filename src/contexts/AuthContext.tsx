import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterData, User } from '@/types/auth';
import { 
  authenticateUser, 
  createUser, 
  getUserById, 
  updateLastLogin, 
  convertBaserowUserToUser,
  BaserowAuthResponse 
} from '@/services/authService';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored user and token on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('celx_user');
    const storedToken = localStorage.getItem('celx_token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: storedToken } });
      } catch (error) {
        localStorage.removeItem('celx_user');
        localStorage.removeItem('celx_token');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Autenticar com o Baserow
      const authResponse: BaserowAuthResponse = await authenticateUser(credentials);
      
      // Buscar dados completos do usuário
      const baserowUser = await getUserById(authResponse.user.id);
      
      if (!baserowUser) {
        throw new Error('Usuário não encontrado');
      }

      // Atualizar último login
      await updateLastLogin(baserowUser.id);

      // Converter para o formato da aplicação
      const user = convertBaserowUserToUser(baserowUser);

      // Salvar no localStorage
      localStorage.setItem('celx_user', JSON.stringify(user));
      localStorage.setItem('celx_token', authResponse.token);

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: authResponse.token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no login';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });

    try {
      if (data.password !== data.confirmPassword) {
        dispatch({ type: 'REGISTER_FAILURE', payload: 'As senhas não coincidem' });
        return;
      }

      // Criar usuário no Baserow
      const baserowUser = await createUser(data);

      // Converter para o formato da aplicação
      const user = convertBaserowUserToUser(baserowUser);

      // Gerar token (em uma implementação real, você faria login após o registro)
      const token = 'temp_token_' + Date.now();

      // Salvar no localStorage
      localStorage.setItem('celx_user', JSON.stringify(user));
      localStorage.setItem('celx_token', token);

      dispatch({ type: 'REGISTER_SUCCESS', payload: { user, token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no registro';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
    }
  };

  const logout = (): void => {
    localStorage.removeItem('celx_user');
    localStorage.removeItem('celx_token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 