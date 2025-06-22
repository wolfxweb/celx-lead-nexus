import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
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

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const authResponse = await authenticateUser(credentials);
      const baserowUser = await getUserById(authResponse.user.id);
      
      if (!baserowUser) {
        throw new Error('Usuário não encontrado');
      }

      await updateLastLogin(baserowUser.id);
      const user = convertBaserowUserToUser(baserowUser);

      localStorage.setItem('celx_user', JSON.stringify(user));
      localStorage.setItem('celx_token', authResponse.token);

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: authResponse.token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no login';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });

    try {
      if (data.password !== data.confirmPassword) {
        dispatch({ type: 'REGISTER_FAILURE', payload: 'As senhas não coincidem' });
        return;
      }

      const baserowUser = await createUser(data);
      const user = convertBaserowUserToUser(baserowUser);
      const token = 'temp_token_' + Date.now();

      localStorage.setItem('celx_user', JSON.stringify(user));
      localStorage.setItem('celx_token', token);

      dispatch({ type: 'REGISTER_SUCCESS', payload: { user, token } });
    } catch (error) {
      let errorMessage = 'Ocorreu um erro desconhecido durante o registro.';
      
      if (error instanceof Error) {
        try {
          const errorJson = JSON.parse(error.message);
          
          // Verifica se é um erro de validação do Baserow com detalhes
          if (errorJson.detail) {
            const detail = typeof errorJson.detail === 'object' ? errorJson.detail : JSON.parse(errorJson.detail);
            const fieldName = Object.keys(detail)[0];
            const errorInfo = detail[fieldName][0];
            errorMessage = `Erro no campo '${fieldName}': ${errorInfo.error}`;
          } else if (errorJson.error) {
            errorMessage = `Erro: ${errorJson.error}`;
          } else {
             // Fallback para outros tipos de erro JSON
             const firstKey = Object.keys(errorJson)[0];
             errorMessage = errorJson[firstKey][0];
          }
        } catch (e) {
          // A mensagem de erro não era JSON, usa a mensagem como está
          errorMessage = error.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
    }
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem('celx_user');
    localStorage.removeItem('celx_token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    clearError
  }), [state, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 