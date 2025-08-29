import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import GoogleOAuthHandler from '../components/GoogleOAuthHandler';
import Header from '../components/Header';
import MainImg from '../assets/Home/MainImg.svg';
import AboutUs from '../components/AboutUs';
import OurTeachers from '../components/OurTeachers';
import WhyWe from '../components/WhyWe';
import FooterHome from '../components/FooterHome';
import Footer from '../components/Footer';
import ScrollAnimation from '../components/ScrollAnimation';
import Parallax from '../components/Parallax';

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuthContext();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  // Проверяем параметры Google OAuth
  const token = searchParams.get('token');
  const userParam = searchParams.get('user');
  const hasOAuthParams = !!(token && userParam);

  useEffect(() => {
    console.log('🏠 Home page effect:', {
      isAuthenticated,
      isLoading,
      hasOAuthParams,
      isProcessingOAuth
    });

    // Если загружается состояние авторизации, ждем
    if (isLoading) {
      console.log('⏳ Auth state is loading, waiting...');
      return;
    }

    // Если есть OAuth параметры, начинаем обработку
    if (hasOAuthParams && !isProcessingOAuth) {
      console.log('🔄 Starting OAuth processing...');
      setIsProcessingOAuth(true);
      return;
    }

    // Если пользователь уже авторизован и нет OAuth параметров
    if (isAuthenticated && !hasOAuthParams && !isProcessingOAuth) {
      console.log('✅ User already authenticated, redirecting to cabinet...');
      navigate('/cabinet', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, hasOAuthParams, isProcessingOAuth]);

  // Показываем loading экран при обработке OAuth или загрузке состояния
  if (hasOAuthParams || isProcessingOAuth || (isLoading && !isAuthenticated)) {
    return (
      <>
        {hasOAuthParams && (
          <GoogleOAuthHandler onAuthProcessed={() => {
            console.log('📝 OAuth processing completed');
            setIsProcessingOAuth(false);
          }} />
        )}
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B400F0] mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">
              {hasOAuthParams ? 'Авторизація через Google' : 'Завантаження...'}
            </h1>
            <p className="text-gray-400">
              {hasOAuthParams 
                ? 'Обробка даних, перенаправлення до кабінету...' 
                : 'Перевірка стану авторизації...'
              }
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#121212', overflowX: 'hidden' }}>
      <ScrollAnimation direction="down" duration={0.8}>
        <Header />
      </ScrollAnimation>
      
      {/* Main Image with Parallax */}
      <ScrollAnimation direction="scale" duration={1} delay={0.3}>
        <div className="w-full h-full flex justify-center items-center">
          <Parallax speed={0.3}>
            <img 
              src={MainImg} 
              alt="Main Image" 
              className="w-full h-full object-contain"
              style={{maxWidth: '100%', maxHeight: 'auto', marginTop: '100px'}}
            />
          </Parallax>
        </div>
      </ScrollAnimation>
      
      {/* About Us Component */}
      <ScrollAnimation direction="up" duration={0.8} delay={0.2}>
        <AboutUs />
      </ScrollAnimation>
      
      {/* Our Teachers Component */}
      <ScrollAnimation direction="left" duration={0.8} delay={0.1}>
        <OurTeachers />
      </ScrollAnimation>
      
      {/* Why We Component */}
      <ScrollAnimation direction="right" duration={0.8} delay={0.1}>
        <WhyWe />
      </ScrollAnimation>
      
      {/* Footer Home Component */}
      <ScrollAnimation direction="up" duration={0.8}>
        <FooterHome />
      </ScrollAnimation>
      
      <ScrollAnimation direction="fade" duration={0.6} delay={0.2}>
        <Footer/>
      </ScrollAnimation>
    </div>
  );
}

export default Home;
