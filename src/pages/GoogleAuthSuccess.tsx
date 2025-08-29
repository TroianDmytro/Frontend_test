import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const success = handleGoogleCallback(searchParams);
    
    if (success) {
      // Redirect to cabinet after successful Google auth
      setTimeout(() => {
        navigate('/cabinet');
      }, 2000);
    } else {
      // Redirect to login page if something went wrong
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [searchParams, handleGoogleCallback, navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B400F0] mx-auto mb-4"></div>
        <h1 className="text-2xl font-Inter font-bold mb-2">Авторизація через Google</h1>
        <p className="text-[#B0B0B0]">Обробка даних, будь ласка зачекайте...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
