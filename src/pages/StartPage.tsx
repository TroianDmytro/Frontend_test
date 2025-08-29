import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import GoogleOAuthHandler from '../components/GoogleOAuthHandler';
import EnterButton from '../components/EnterButton';
import styles from './StartPage.module.css';

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuthContext();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  // Проверяем параметры Google OAuth
  const token = searchParams.get('token');
  const userParam = searchParams.get('user');
  const hasOAuthParams = !!(token && userParam);

  const handleEnter = () => {
    navigate('/home');
  };

  useEffect(() => {
    console.log('🚀 StartPage effect:', {
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
      console.log('🔄 Starting OAuth processing on StartPage...');
      setIsProcessingOAuth(true);
      return;
    }

    // Если пользователь уже авторизован и нет OAuth параметров
    if (isAuthenticated && !hasOAuthParams && !isProcessingOAuth) {
      console.log('✅ User already authenticated on StartPage, redirecting to cabinet...');
      navigate('/cabinet', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, hasOAuthParams, isProcessingOAuth]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleEnter();
      }
    };

    // Добавляем обработчик события только если не обрабатываем OAuth и не загружаемся
    if (!hasOAuthParams && !isProcessingOAuth && !isLoading) {
      document.addEventListener('keydown', handleKeyPress);
    }

    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate, hasOAuthParams, isProcessingOAuth, isLoading]);

  // Показываем loading экран при обработке OAuth или загрузке состояния
  if (hasOAuthParams || isProcessingOAuth || (isLoading && !isAuthenticated)) {
    return (
      <>
        {hasOAuthParams && (
          <GoogleOAuthHandler onAuthProcessed={() => {
            console.log('📝 OAuth processing completed on StartPage');
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
    <div className={styles.container}>
      {/* Top left decorative line - responsive */}
      <svg 
        className={styles.decorativeElement}
        style={{
          width: 'clamp(300px, 35vw, 561px)',
          height: 'clamp(350px, 40vw, 587px)',
          position: 'absolute',
          left: 'clamp(-22px, -2vw, -22px)',
          top: 'clamp(-17px, -2vh, -17px)',
          opacity: 0.8
        }}
        viewBox="0 0 540 571" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M-22 570.107L106.5 441.107L106.5 103.107L160.5 49.1067L424.5 49.1066L539 -17" 
          stroke="#656565" 
          strokeWidth="2"
        />
      </svg>

      {/* Main NeuroNest text - responsive */}
      <div className={styles.title}>
        NeuroNest
      </div>

      {/* Bottom left blue square icon - responsive */}
      <svg 
        className={styles.decorativeElement}
        style={{
          width: 'clamp(40px, 4vw, 56px)',
          height: 'clamp(40px, 4vw, 57px)',
          position: 'absolute',
          left: 'clamp(20px, 25vw, 413px)',
          bottom: 'clamp(50px, 15vh, 200px)'
        }}
        viewBox="0 0 58 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M57 44.0425L42.4046 58.6185H1V15.846L15.6972 1.16833H57V44.0425Z" 
          stroke="#1951F3"
        />
        <path 
          d="M20.9441 11.989H38.0339H39.1516L12.2671 38.8735V20.666L20.9441 11.989Z" 
          stroke="#1951F3"
        />
      </svg>

      {/* Top right decorative elements - responsive */}
      <div 
        className={styles.decorativeElement}
        style={{
          width: 'clamp(60px, 5vw, 83px)',
          height: 'clamp(60px, 5vw, 84px)',
          position: 'absolute',
          right: 'clamp(20px, 15vw, 385px)',
          top: 'clamp(100px, 15vh, 169px)'
        }}
      >
        {/* Purple lines */}
        {[
          { left: '66%', top: '68%' },
          { left: '1%', top: '0%' },
          { left: '67%', top: '1%' },
          { left: '0%', top: '68%' }
        ].map((position, index) => (
          <div 
            key={index}
            style={{
              width: '45%',
              height: '2px',
              background: '#9747FF',
              position: 'absolute',
              left: position.left,
              top: position.top
            }}
          />
        ))}
      </div>

      {/* Purple circle - responsive */}
      <svg 
        className={styles.decorativeElement}
        style={{
          width: 'clamp(18px, 1.5vw, 23px)',
          height: 'clamp(18px, 1.5vw, 23px)',
          position: 'absolute',
          right: 'clamp(20px, 12vw, 355px)',
          top: 'clamp(130px, 18vh, 199px)'
        }}
        viewBox="0 0 23 23" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11.5" cy="11.5" r="11" stroke="#9747FF"/>
      </svg>

      {/* Bottom right white crosses - responsive */}
      {[
        { right: 'clamp(20px, 8vw, 384px)' },
        { right: 'clamp(60px, 12vw, 468px)' },
        { right: 'clamp(100px, 16vw, 552px)' }
      ].map((position, index) => (
        <div 
          key={index}
          className={styles.decorativeElement}
          style={{
            width: 'clamp(20px, 2vw, 28px)',
            height: 'clamp(20px, 2vw, 28px)',
            transform: 'rotate(45deg)',
            position: 'absolute',
            right: position.right,
            bottom: 'clamp(50px, 8vh, 157px)'
          }}
        >
          {[
            { left: '71%', top: '93%' },
            { left: '71%', top: '0%' },
            { left: '93%', top: '71%' },
            { left: '0%', top: '71%' }
          ].map((crossPosition, crossIndex) => (
            <div 
              key={crossIndex}
              style={{
                width: '50%',
                height: '2px',
                background: '#FFF',
                position: 'absolute',
                left: crossPosition.left,
                top: crossPosition.top
              }}
            />
          ))}
        </div>
      ))}

      {/* Bottom right decorative line - responsive */}
      <svg 
        className={styles.decorativeElement}
        style={{
          width: 'clamp(300px, 35vw, 561px)',
          height: 'clamp(350px, 40vw, 587px)',
          position: 'absolute',
          right: 'clamp(-22px, -2vw, -22px)',
          bottom: 'clamp(-50px, -5vh, -83px)',
          opacity: 0.8
        }}
        viewBox="0 0 552 582" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M561.5 1L433 130V468L379 522H115L0.5 588.107" 
          stroke="#656565" 
          strokeWidth="2"
        />
      </svg>

      {/* Enter button - responsive */}
      <div className={styles.enterButton}>
        <EnterButton variant="default" onClick={handleEnter} />
      </div>
    </div>
  );
};

export default StartPage;
