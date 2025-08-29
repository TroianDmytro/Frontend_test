import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

interface GoogleOAuthHandlerProps {
  onAuthProcessed?: () => void;
}

const GoogleOAuthHandler = ({ onAuthProcessed }: GoogleOAuthHandlerProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useAuthContext();
  const processingRef = useRef(false);

  useEffect(() => {
    // Предотвращаем повторную обработку
    if (processingRef.current) {
      console.log('⚠️ OAuth already being processed, skipping...');
      return;
    }

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    // Если нет параметров OAuth, не обрабатываем
    if (!token || !userParam) {
      console.log('⚠️ No OAuth parameters found, skipping handler');
      return;
    }

    console.log('🔄 Starting OAuth processing...');
    processingRef.current = true;

    // Обрабатываем OAuth с небольшой задержкой
    const processOAuth = async () => {
      try {
        const success = handleGoogleCallback(searchParams);
        
        if (success) {
          console.log('✅ Google authentication successful!');
          
          // Уведомляем родительский компонент
          onAuthProcessed?.();
          
          // Перенаправляем в кабинет
          setTimeout(() => {
            console.log('🏠 Redirecting to cabinet...');
            navigate('/cabinet', { replace: true });
          }, 1000);
        } else {
          console.error('❌ Google authentication failed');
          
          // В случае ошибки перенаправляем на логин
          setTimeout(() => {
            console.log('🔑 Redirecting to login...');
            navigate('/login', { replace: true });
          }, 1500);
        }
      } catch (error) {
        console.error('❌ Error processing OAuth:', error);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      }
    };

    processOAuth();

    // Cleanup function
    return () => {
      processingRef.current = false;
    };
  }, [searchParams, handleGoogleCallback, navigate, onAuthProcessed]);

  return null; // Этот компонент невидимый
};

export default GoogleOAuthHandler;
