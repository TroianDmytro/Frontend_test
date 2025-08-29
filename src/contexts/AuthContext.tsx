import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService, AuthApiError } from '../services/authService';
import type {
  AuthState,
  AuthAction,
  LoginFormData
} from '../types/auth';

// Типы для кабинета
export type CabinetPageType = 'home' | 'courses' | 'calendar' | 'books' | 'achievements' | 'chat' | 'wallet' | 'profile';

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

interface AuthContextType extends AuthState {
  login: (formData: LoginFormData) => Promise<any>;
  logout: () => Promise<void>;
  handleGoogleCallback: (urlParams: URLSearchParams) => boolean;
  clearError: () => void;
  updateUser: (user: any) => void;
  // Добавляем логику кабинета
  activePage: CabinetPageType;
  setActivePage: (page: CabinetPageType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [activePage, setActivePage] = React.useState<CabinetPageType>('home');

  // Initialize auth state from localStorage - только один раз при монтировании провайдера
  useEffect(() => {
    let mounted = true;
    
    const initAuth = () => {
      console.log('🔄 [AuthContext] Initializing auth state...');
      
      const token = authService.getStoredToken();
      const user = authService.getStoredUser();

      console.log('📝 [AuthContext] Auth check:', {
        hasToken: !!token,
        hasUser: !!user,
        tokenValid: token ? authService.isTokenValid() : false
      });

      if (!mounted) return;

      if (token && user && authService.isTokenValid()) {
        console.log('✅ [AuthContext] Valid auth data found');
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
      } else {
        console.log('❌ [AuthContext] No valid auth data found');
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: ''
        });
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (formData: LoginFormData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.login(formData);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.access_token
        }
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Сталася помилка під час входу';
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const handleGoogleCallback = (urlParams: URLSearchParams): boolean => {
    try {
      console.log('🔄 [AuthContext] Processing Google OAuth callback...');
      
      const result = authService.handleGoogleCallback(urlParams);
      
      if (result) {
        console.log('✅ [AuthContext] Google OAuth successful');
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: result.user,
            token: result.token
          }
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ [AuthContext] Error in handleGoogleCallback:', error);
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: 'Помилка при авторизації через Google' 
      });
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (updatedUser: any) => {
    dispatch({ type: 'SET_USER', payload: updatedUser });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    handleGoogleCallback,
    clearError,
    updateUser,
    activePage,
    setActivePage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
