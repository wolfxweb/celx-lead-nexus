import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterData, User } from '@/types/auth';

// Mock users for demonstration - in a real app this would be in a database
let mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@celx.com',
    role: 'admin',
    avatar: '👨‍💼',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@celx.com',
    role: 'user',
    avatar: '👩‍💻',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  }
];

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
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
        user: action.payload,
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

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('celx_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Update last login
        const updatedUser = { ...user, lastLogin: new Date() };
        localStorage.setItem('celx_user', JSON.stringify(updatedUser));
        dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
      } catch (error) {
        localStorage.removeItem('celx_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password') { // Mock password
      const updatedUser = { ...user, lastLogin: new Date() };
      localStorage.setItem('celx_user', JSON.stringify(updatedUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou senha inválidos' });
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.password !== data.confirmPassword) {
      dispatch({ type: 'REGISTER_FAILURE', payload: 'As senhas não coincidem' });
      return;
    }

    if (mockUsers.some(u => u.email === data.email)) {
      dispatch({ type: 'REGISTER_FAILURE', payload: 'Este email já está em uso' });
      return;
    }

    // New users are always registered as 'user' by default
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: 'user', // Always 'user' by default
      avatar: '👤',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    mockUsers.push(newUser);
    localStorage.setItem('celx_user', JSON.stringify(newUser));
    dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
  };

  const logout = (): void => {
    localStorage.removeItem('celx_user');
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