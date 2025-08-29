import { useState, useEffect, useCallback, useReducer } from 'react';
import { authService, AuthApiError } from '../services/authService';
import { RegistrationStep } from '../types/auth';
import type {
  AuthState,
  AuthAction,
  LoginFormData,
  RegistrationFormData,
  ChangePasswordFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  RegistrationState
} from '../types/auth';

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
  isLoading: true, // Изначально true для правильной инициализации
  error: null
};

// Main Auth Hook
export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Initialize auth state from localStorage
  useEffect(() => {
    let mounted = true;
    
    const initAuth = () => {
      console.log('🔄 Initializing auth state from localStorage...');
      
      const token = authService.getStoredToken();
      const user = authService.getStoredUser();

      console.log('📝 Auth initialization check:', {
        hasToken: !!token,
        hasUser: !!user,
        tokenValid: token ? authService.isTokenValid() : false
      });

      if (!mounted) return;

      if (token && user && authService.isTokenValid()) {
        console.log('✅ Valid auth data found, setting authenticated state');
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
      } else {
        console.log('❌ No valid auth data found or token expired');
        // Явно устанавливаем состояние "не загружается" и "не аутентифицирован"
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: '' // Пустая строка вместо null
        });
      }
    };

    // Небольшая задержка для предотвращения множественных вызовов
    const timeoutId = setTimeout(initAuth, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Пустой массив зависимостей!

  const login = useCallback(async (formData: LoginFormData) => {
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
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const changePassword = useCallback(async (formData: ChangePasswordFormData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      dispatch({ type: 'CLEAR_ERROR' });
      return response;
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при зміні пароля';
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Handle Google OAuth callback
  const handleGoogleCallback = useCallback((urlParams: URLSearchParams) => {
    try {
      console.log('🔄 Processing Google OAuth callback in useAuth...');
      
      const result = authService.handleGoogleCallback(urlParams);
      
      if (result) {
        console.log('✅ Google OAuth successful, updating auth state...');
        console.log('👤 User data:', {
          email: result.user.email,
          name: result.user.name,
          provider: result.user.provider
        });
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: result.user,
            token: result.token
          }
        });
        
        console.log('✅ Auth state updated successfully');
        return true;
      }
      
      console.error('❌ Google OAuth callback failed - no result');
      return false;
    } catch (error) {
      console.error('❌ Error in handleGoogleCallback:', error);
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: 'Помилка при авторизації через Google' 
      });
      return false;
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    changePassword,
    clearError,
    handleGoogleCallback
  };
};

// Registration Hook
export const useRegistration = () => {
  const [state, setState] = useState<RegistrationState>({
    step: RegistrationStep.EMAIL,
    email: '',
    isLoading: false,
    error: null
  });

  const sendVerificationCode = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await authService.sendVerificationCode({ email });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        email,
        step: RegistrationStep.CODE_VERIFICATION
      }));
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при відправці коду';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const verifyCodeAndRegister = useCallback(async (formData: RegistrationFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (!formData.code || !formData.name || !formData.second_name) {
        throw new Error('Всі поля є обов\'язковими');
      }

      const response = await authService.verifyCodeAndRegister({
        email: state.email,
        code: formData.code,
        name: formData.name,
        second_name: formData.second_name,
        age: formData.age,
        telefon_number: formData.telefon_number
      });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        step: RegistrationStep.COMPLETED
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при реєстрації';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [state.email]);

  const resendVerificationCode = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await authService.resendVerificationCode({ email: state.email });
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при повторній відправці коду';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [state.email]);

  const resetRegistration = useCallback(() => {
    setState({
      step: RegistrationStep.EMAIL,
      email: '',
      isLoading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    sendVerificationCode,
    verifyCodeAndRegister,
    resendVerificationCode,
    resetRegistration,
    clearError
  };
};

// Password Recovery Hook
export const usePasswordRecovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');

  const forgotPassword = useCallback(async (formData: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.forgotPassword(formData);
      
      setEmail(formData.email);
      setStep('reset');
      setIsLoading(false);
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при відправці коду відновлення';
      
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (formData: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Паролі не збігаються');
      }
      
      const response = await authService.resetPassword({
        code: formData.code,
        newPassword: formData.newPassword
      });
      
      setIsLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при скиданні пароля';
      
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const resetState = useCallback(() => {
    setStep('email');
    setEmail('');
    setError(null);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    step,
    email,
    forgotPassword,
    resetPassword,
    resetState,
    clearError
  };
};

// Google OAuth Hook
export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToGoogle = useCallback(() => {
    window.location.href = authService.getGoogleAuthUrl();
  }, []);

  const getGoogleStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const status = await authService.getGoogleStatus();
      
      setIsLoading(false);
      return status;
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при отриманні статусу Google';
      
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const linkGoogleAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.linkGoogleAccount();
      
      setIsLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при прив\'язці Google акаунта';
      
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const unlinkGoogleAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.unlinkGoogleAccount();
      
      setIsLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Помилка при відв\'язці Google акаунта';
      
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    redirectToGoogle,
    getGoogleStatus,
    linkGoogleAccount,
    unlinkGoogleAccount,
    clearError
  };
};
