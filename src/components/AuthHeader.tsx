import HeaderFrameBack from '../assets/Header/HeaderFrameBack.svg';
import Logo from '../assets/Header/Logo.svg';
import circlesIcon from '../assets/Circles.svg';

interface HeaderProps {
  variant?: 'main' | 'auth';
  onHome?: () => void;
}

export default function Header({ variant = 'main', onHome }: HeaderProps) {
  if (variant === 'auth') {
    return (
<header className="absolute top-0 left-0 w-full flex h-16 items-center justify-between px-6 bg-[#121212] text-white z-50">
        
        <div className="absolute left-1/4 h-full border-l-2 border-zinc-700 "></div>
        <div className="absolute right-1/4 h-full border-l-2 border-zinc-700"></div>
        <div className="absolute left ml-4 h-full border-l-2 border-zinc-700 "></div>
        <img src={Logo} alt="" className="w-14 h-14 shrink-0 ml-8" />
        
        <div/>
        <div/>
        
        <img src={circlesIcon} alt="" className="w-14 h-14 select-none pointer-events-none" />
        
        <button
          onClick={onHome}
          className="px-8 py-3 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 group"
        >
        <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-semibold mb-6 opacity-90 group-hover:text-black transition-colors duration-200">
        На головну
        </span> 
        </button>
        
        <span className="absolute bottom-0 left-0 w-full h-px bg-zinc-700" />
      </header>
    );
  }

  return (
    <header 
      className="relative w-screen h-[94px]" 
      style={{
        overflow: 'hidden',
        backgroundImage: `url(${HeaderFrameBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Контейнер содержимого */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 md:px-14">
        
        {/* Логотип */}
        <div className="flex items-center">
          <img 
            src={Logo}
            alt="Logo"
            className="w-[52px] h-[59px] rounded-lg object-contain"
          />
        </div>

        {/* Навигация и кнопка входа */}
        <div className="flex items-center space-x-9" style={{ transform: 'translateY(-9px)' }}>
          {/* Навигация */}
          <nav className="hidden lg:flex items-center space-x-9">
            <a 
              href="#courses"
              className="text-white font-bold text-base leading-[22px] hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.02em' }}
            >
              Курси
            </a>
            <a 
              href="#price"
              className="text-white font-bold text-base leading-[22px] hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.02em' }}
            >
              Прайс
            </a>
            <a 
              href="#about"
              className="text-white font-bold text-base leading-[22px] hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.02em' }}
            >
              Про нас
            </a>
          </nav>

          {/* Кнопка входа */}
          <div className="flex items-center">
            <button 
              className="border border-white px-5 py-2 text-white font-semibold text-base leading-[22px] hover:bg-white hover:text-purple-800 transition-all duration-300 flex items-center justify-center"
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                letterSpacing: '0.02em',
                fontWeight: 600
              }}
            >
              Увійти
            </button>
          </div>
          {/* Мобильное меню */}
          <div className="lg:hidden">
            <button className="text-white p-2">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
