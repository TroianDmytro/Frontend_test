import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';
import HeaderFrameBack from '../assets/Header/HeaderFrameBack.svg';
import Logo from '../assets/Header/Logo.svg';
import targetIcon from '../assets/Circles.svg';

interface HeaderProps {
  variant?: 'main' | 'auth';
  onHome?: () => void;
}

export default function Header({ variant = 'main', onHome }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Отслеживание скролла для добавления тени
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие мобильного меню при изменении роута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Закрытие мобильного меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Блокировка скролла при открытом меню
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const handleCabinet = () => {
    navigate('/cabinet');
  };

  const handleLogoClick = () => {
    navigate('/home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Курси', path: '/courses/graphic-design', isRoute: true },
    { label: 'Прайс', path: '/pricing', isRoute: true },
    { label: 'Про нас', path: '#about', isRoute: false }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      navigate(item.path);
    } else {
      // Плавный скролл к секции
      const element = document.querySelector(item.path);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (variant === 'auth') {
    return (
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="relative flex h-16 items-center justify-between px-6 bg-zinc-900 text-white border-b border-zinc-700">
          {/* Левая заглушка для центрирования */}
          <div className="w-10 h-10 opacity-0" />
          
          {/* Центральная иконка - кликабельная */}
          <button
            onClick={handleLogoClick}
            className="group relative p-2 transition-transform duration-300 hover:scale-110 focus:outline-none rounded-full"
            aria-label="Перейти на главную"
          >
            <img 
              src={targetIcon} 
              alt="Logo" 
              className="w-12 h-12 select-none transition-opacity duration-300 group-hover:opacity-80" 
            />
            <span className="absolute inset-0 rounded-full bg-white/10 scale-0 transition-transform duration-300 group-hover:scale-110" />
          </button>
          
          {/* Кнопка "На головну" */}
          <button
            onClick={onHome || handleLogoClick}
            className="relative px-4 py-2 border border-gray-300 text-sm font-medium overflow-hidden group transition-all duration-300 hover:border-white focus:outline-none"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-zinc-900">
              На головну
            </span>
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-screen h-[94px] transition-all duration-500 ${
        isScrolled ? 'shadow-2xl backdrop-blur-md' : ''
      }`}
      style={{
        overflow: 'hidden',
        backgroundImage: `url(${HeaderFrameBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Улучшенный overlay с градиентом */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      
      {/* Дополнительный слой для эффекта глубины */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      
      {/* Контейнер содержимого */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 md:px-14">
        
        {/* Улучшенный логотип */}
        <motion.button
          onClick={handleLogoClick}
          className="group flex items-center focus:outline-none rounded-lg p-1 relative"
          aria-label="Перейти на главную"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.6 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 rounded-lg bg-white/5 scale-0"
            whileHover={{ scale: 1.2, opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />
          <motion.img 
            src={Logo}
            alt="Logo"
            className="w-[52px] h-[59px] rounded-lg object-contain relative z-10"
            style={{
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))"
            }}
            whileHover={{
              filter: "brightness(1.2) drop-shadow(0 0 20px rgba(255,255,255,0.8))"
            }}
          />
          {/* Дополнительный glow эффект */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>

        {/* Навигация и кнопка входа */}
        <div className="flex items-center space-x-9" style={{ transform: 'translateY(-9px)' }}>
          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`relative text-white font-bold text-base leading-[22px] transition-all duration-300 nav-item-hover focus:outline-none rounded px-2 py-1 ${
                  item.isRoute && isActiveRoute(item.path) ? 'text-white nav-item-active' : 'text-white/80'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.02em' }}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3 + index * 0.1,
                  ease: [0.23, 1, 0.32, 1]
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Улучшенный активный индикатор */}
                {item.isRoute && isActiveRoute(item.path) && (
                  <motion.span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                    layoutId="activeIndicator"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}
                
                {/* Эффект частиц при hover */}
                <motion.div
                  className="absolute inset-0 opacity-0"
                  whileHover={{
                    opacity: 1,
                    background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Улучшенная кнопка входа/выхода */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              // Кнопки для авторизованных пользователей
              <>
                <motion.button 
                  onClick={handleCabinet}
                  className="relative border-2 border-white px-6 py-2.5 text-white font-semibold text-base leading-[22px] overflow-hidden group focus:outline-none shimmer-effect login-button"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    letterSpacing: '0.02em',
                    fontWeight: 600
                  }}
                  initial={{ opacity: 0, x: 30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.7,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(255,255,255,0.4)",
                    borderColor: "rgb(255, 255, 255)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="button-text-hover relative z-30"
                    style={{ color: 'white' }}
                    whileHover={{ color: '#000000' }}
                    transition={{ duration: 0.2 }}
                  >
                    Кабінет
                  </motion.span>
                  
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 z-10"
                    whileHover={{ 
                      opacity: 0.95,
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                  />
                  
                  <motion.div
                    className="absolute inset-0 border border-white/30 z-5"
                    whileHover={{
                      borderColor: "rgba(255,255,255,0.8)",
                      boxShadow: "0 0 20px rgba(255,255,255,0.4)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                <motion.button 
                  onClick={handleLogout}
                  className="relative border-2 border-red-500 px-6 py-2.5 text-red-500 font-semibold text-base leading-[22px] overflow-hidden group focus:outline-none"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    letterSpacing: '0.02em',
                    fontWeight: 600
                  }}
                  initial={{ opacity: 0, x: 30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)",
                    borderColor: "rgb(239, 68, 68)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="relative z-30"
                    whileHover={{ color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    Вийти
                  </motion.span>
                  
                  <motion.div
                    className="absolute inset-0 bg-red-500 opacity-0 z-10"
                    whileHover={{ 
                      opacity: 0.95,
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                  />
                </motion.button>
              </>
            ) : (
              // Кнопка входа для неавторизованных пользователей
              <motion.button 
                onClick={handleLogin}
                className="relative border-2 border-white px-6 py-2.5 text-white font-semibold text-base leading-[22px] overflow-hidden group focus:outline-none shimmer-effect login-button"
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  letterSpacing: '0.02em',
                  fontWeight: 600
                }}
                initial={{ opacity: 0, x: 30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.7,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(255,255,255,0.4)",
                  borderColor: "rgb(255, 255, 255)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="button-text-hover relative z-30"
                  style={{ color: 'white' }}
                  whileHover={{ color: '#000000' }}
                  transition={{ duration: 0.2 }}
                >
                  Увійти
                </motion.span>
                
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 z-10"
                  whileHover={{ 
                    opacity: 0.95,
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }}
                />
                
                <motion.div
                  className="absolute inset-0 border border-white/30 z-5"
                  whileHover={{
                    borderColor: "rgba(255,255,255,0.8)",
                    boxShadow: "0 0 20px rgba(255,255,255,0.4)"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )}
          </div>

          {/* Улучшенное мобильное меню */}
          <div className="lg:hidden mobile-menu-container">
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="relative text-white p-2 transition-colors duration-300 hover:text-white/80 focus:outline-none rounded"
              aria-label="Меню навигации"
              aria-expanded={isMobileMenuOpen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <motion.span 
                  className="block h-0.5 w-full bg-current"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 8 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                />
                <motion.span 
                  className="block h-0.5 w-full bg-current"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scaleX: isMobileMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                />
                <motion.span 
                  className="block h-0.5 w-full bg-current"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -8 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Улучшенное мобильное выпадающее меню */}
      <motion.div 
        className="absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-white/10 lg:hidden overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMobileMenuOpen ? "auto" : 0, 
          opacity: isMobileMenuOpen ? 1 : 0 
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.23, 1, 0.32, 1],
          height: { duration: 0.4 },
          opacity: { duration: 0.3, delay: isMobileMenuOpen ? 0.1 : 0 }
        }}
      >
        <motion.nav 
          className="flex flex-col p-4 space-y-2"
          initial={{ y: -20 }}
          animate={{ y: isMobileMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="text-left px-4 py-3 text-white font-semibold transition-all duration-300 hover:bg-white/10 rounded-lg group"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ 
                opacity: isMobileMenuOpen ? 1 : 0, 
                x: isMobileMenuOpen ? 0 : -20,
                scale: isMobileMenuOpen ? 1 : 0.9
              }}
              transition={{ 
                duration: 0.3, 
                delay: isMobileMenuOpen ? 0.1 + index * 0.05 : 0,
                ease: [0.23, 1, 0.32, 1]
              }}
              whileHover={{ x: 8, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center">
                  <motion.span
                    className="mr-3 w-2 h-2 bg-white/30 rounded-full"
                    whileHover={{ 
                      scale: 1.5, 
                      backgroundColor: "rgb(255, 255, 255)",
                      transition: { duration: 0.2 }
                    }}
                  />
                  {item.label}
                </span>
                {item.isRoute && isActiveRoute(item.path) && (
                  <motion.span 
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </span>
            </motion.button>
          ))}
          <motion.button
            onClick={isAuthenticated ? handleCabinet : handleLogin}
            className="text-left px-4 py-3 mt-2 bg-white text-purple-900 font-semibold transition-all duration-300 hover:bg-white/90 rounded-lg group"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ 
              opacity: isMobileMenuOpen ? 1 : 0, 
              x: isMobileMenuOpen ? 0 : -20,
              scale: isMobileMenuOpen ? 1 : 0.9
            }}
            transition={{ 
              duration: 0.3, 
              delay: isMobileMenuOpen ? 0.1 + navItems.length * 0.05 : 0,
              ease: [0.23, 1, 0.32, 1]
            }}
            whileHover={{ 
              x: 8, 
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center">
              <motion.span
                className="mr-3 w-2 h-2 bg-purple-900/30 rounded-full"
                whileHover={{ 
                  scale: 1.5, 
                  backgroundColor: "rgb(126, 34, 206)",
                  transition: { duration: 0.2 }
                }}
              />
              {isAuthenticated ? 'Кабінет' : 'Увійти'}
            </span>
          </motion.button>
          
          {/* Кнопка выхода для мобильного меню (только для авторизованных) */}
          {isAuthenticated && (
            <motion.button
              onClick={handleLogout}
              className="text-left px-4 py-3 mt-2 bg-red-600 text-white font-semibold transition-all duration-300 hover:bg-red-700 rounded-lg group"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ 
                opacity: isMobileMenuOpen ? 1 : 0, 
                x: isMobileMenuOpen ? 0 : -20,
                scale: isMobileMenuOpen ? 1 : 0.9
              }}
              transition={{ 
                duration: 0.3, 
                delay: isMobileMenuOpen ? 0.1 + (navItems.length + 1) * 0.05 : 0,
                ease: [0.23, 1, 0.32, 1]
              }}
              whileHover={{ 
                x: 8, 
                backgroundColor: "rgb(185, 28, 28)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <motion.span
                  className="mr-3 w-2 h-2 bg-white/30 rounded-full"
                  whileHover={{ 
                    scale: 1.5, 
                    backgroundColor: "rgb(255, 255, 255)",
                    transition: { duration: 0.2 }
                  }}
                />
                Вийти
              </span>
            </motion.button>
          )}
        </motion.nav>
      </motion.div>
    </motion.header>
  );
}
