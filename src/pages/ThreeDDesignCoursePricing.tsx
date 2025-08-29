import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// CSS анимации для галочек
const checkboxAnimationStyles = `
  @keyframes checkmarkAppear {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes drawCheck {
    0% {
      stroke-dashoffset: 20;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes pulseBackground {
    0% {
      background-color: #D9D9D9;
    }
    50% {
      background-color: #E9E9E9;
    }
    100% {
      background-color: #D9D9D9;
    }
  }
`;

// Добавляем стили в документ
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = checkboxAnimationStyles;
  if (!document.head.querySelector('style[data-checkbox-animations-3d]')) {
    styleElement.setAttribute('data-checkbox-animations-3d', 'true');
    document.head.appendChild(styleElement);
  }
}

interface CourseModule {
  id: number;
  title: string;
  price: number;
  selected: boolean;
}

const ThreeDDesignCoursePricing = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<CourseModule[]>([
    { id: 1, title: "3ds Max: професійне моделювання", price: 6200, selected: true },
    { id: 2, title: "Blender: комплексна 3D-графіка", price: 5600, selected: false },
    { id: 3, title: "ZBrush: цифрова скульптура", price: 8900, selected: true },
    { id: 4, title: "Maya: анімація та візуальні ефекти", price: 9200, selected: true },
    { id: 5, title: "Гейм-дизайн та розробка ігор", price: 7400, selected: false },
    { id: 6, title: "3D-анімація персонажів", price: 8100, selected: false },
    { id: 7, title: "AutoCAD: технічне креслення", price: 4800, selected: true }
  ]);

  const toggleModule = (id: number) => {
    setModules(prev => 
      prev.map(module => 
        module.id === id ? { ...module, selected: !module.selected } : module
      )
    );
  };

  const totalPrice = modules.reduce((sum, module) => 
    module.selected ? sum + module.price : sum, 0
  );

  const handleSelectPlan = () => {
    const selectedModules = modules.filter(m => m.selected);
    if (selectedModules.length === 0) {
      alert('Будь ласка, оберіть хоча б один модуль');
      return;
    }
    
    navigate('/payment', {
      state: {
        modules: selectedModules,
        totalPrice,
        courseType: '3D дизайн'
      }
    });
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#121212', position: 'relative', overflow: 'hidden' }}>
      {/* Back button */}
      <div style={{ position: 'absolute', top: '3vh', right: '5vw', zIndex: 50 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '1.5vh 2vw',
            border: '1px solid #D9D9D9',
            background: 'transparent',
            color: '#EFEFF2',
            fontFamily: 'TT_Autonomous_Trial_Variable, sans-serif',
            fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.background = '#D9D9D9';
            target.style.color = '#121212';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.background = 'transparent';
            target.style.color = '#EFEFF2';
          }}
        >
          На головну
        </button>
      </div>

      {/* Decorative background SVGs */}
      <svg 
        style={{ width: '8.4vw', height: '40.8vh', position: 'absolute', left: '-2.6vw', top: '25vh' }}
        width="113" height="957" viewBox="0 0 113 957" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-49 1L40.9379 90.6297V285.381L112 356.199V594.105L40.9379 664.924V850.5L-20 956.048" stroke="#656565" strokeWidth="2"/>
      </svg>
      
      <svg 
        style={{ width: '8.7vw', height: '42.6vh', position: 'absolute', left: '-1.5vw', top: '24vh' }}
        width="140" height="1000" viewBox="0 0 140 1000" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-28 1L65.2897 94.6608V298.171L139 372.174V620.78L65.2897 694.783V888.705L2.08074 999" stroke="#656565" strokeWidth="2"/>
      </svg>

      {/* Decorative geometric elements */}
      <svg 
        style={{ width: '4.2vw', height: '4.2vw', position: 'absolute', left: '8.5vw', top: '40vh' }}
        width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22.9853 64.0597C22.9853 63.0896 23.1693 21.6965 22.9853 1H1V22.3433H66V1H44.0147V66H66V44.6567H1.95588V66H22.9853V64.0597Z" stroke="#656565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Target/circle decorations */}
      <div style={{ width: '8.2vw', height: '8.2vw', position: 'absolute', right: '15vw', top: '14vh' }}>
        <svg 
          style={{ width: '3.8vw', height: '3.8vw', position: 'absolute', left: '2.2vw', top: '2.2vw' }}
          width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="30.0975" cy="29.9311" r="29.2567" stroke="white"/>
        </svg>
        <svg 
          style={{ width: '5.8vw', height: '5.8vw', position: 'absolute', left: '1.2vw', top: '1.2vw' }}
          width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="46.0976" cy="45.9311" r="45.0937" stroke="white"/>
        </svg>
        <div style={{ width: '2.2vw', height: '1px', background: '#FFF', position: 'absolute', left: '4.2vw', top: '0px' }}></div>
        <div style={{ width: '2.2vw', height: '1px', background: '#FFF', position: 'absolute', right: '0px', top: '4.2vw' }}></div>
        <div style={{ width: '2.2vw', height: '1px', background: '#FFF', position: 'absolute', left: '0px', top: '4.2vw' }}></div>
        <div style={{ width: '2.2vw', height: '1px', background: '#FFF', position: 'absolute', left: '4.2vw', bottom: '0px' }}></div>
      </div>

      {/* Main content container */}
      <div style={{ 
        width: '85vw', 
        maxWidth: '1340px',
        margin: '0 auto',
        paddingTop: '8vh',
        position: 'relative'
      }}>
        {/* Title */}
        <div style={{
          color: '#FFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
          fontWeight: 700,
          marginBottom: '3.5vh',
          textAlign: 'center'
        }}>
          Оберіть модулі 3D дизайну, які б ви бажали вчити
        </div>

        {/* Course modules container */}
        <div style={{
          width: '100%',
          minHeight: '55vh',
          background: '#2F2F2F',
          position: 'relative',
          padding: '12vh 6vw 12vh 6vw',
          marginTop: '5vh',
          clipPath: 'polygon(0 3.5rem, 0 calc(100% - 6rem), 9vw 100%, calc(96.5% - 0px) 100%, calc(96.5% - 0px) calc(100% - 15vh), 100% calc(100% - 20vh), 100% 3.5rem, 100% 0, calc(79.2% - 0px) 0, calc(72% - 0px) 3.5rem, 0 3.5rem)'
        }}>
          {/* Course modules list */}
          {modules.map((module, index) => (
            <div key={module.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1.5vh 0',
              borderBottom: index < modules.length - 1 ? '2px solid #656565' : 'none',
              gap: '2vw'
            }}>
              {/* Checkbox */}
              <div 
                style={{
                  width: '2.5vw',
                  minWidth: '30px',
                  height: '2.5vw',
                  minHeight: '30px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                onClick={() => toggleModule(module.id)}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '4px',
                  border: '1px solid #D9D9D9',
                  background: module.selected ? '#D9D9D9' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  transform: module.selected ? 'scale(1.05)' : 'scale(1)'
                }}>
                  {module.selected && (
                    <svg 
                      width="70%" 
                      height="70%" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      style={{
                        animation: 'checkmarkAppear 0.4s ease-out'
                      }}
                    >
                      <path 
                        d="M20 6L9 17l-5-5" 
                        fill="none"
                        stroke="#2F2F2F"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          strokeDasharray: '20',
                          strokeDashoffset: module.selected ? '0' : '20',
                          animation: 'drawCheck 0.4s ease-out 0.1s forwards'
                        }}
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Module number */}
              <div style={{
                width: '4vw',
                minWidth: '50px',
                color: '#FFF',
                fontFamily: 'JejuGothic, monospace',
                fontSize: 'clamp(1.2rem, 2vw, 2rem)',
                fontWeight: 400,
                textAlign: 'center',
                flexShrink: 0
              }}>
                {String(module.id).padStart(2, '0')}
              </div>

              {/* Module title */}
              <div style={{
                color: '#FFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
                fontWeight: 400,
                flex: 1,
                minWidth: 0
              }}>
                {module.title}
              </div>

              {/* Module price */}
              <div style={{
                color: '#FFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
                fontWeight: 800,
                textAlign: 'right',
                minWidth: '8vw',
                flexShrink: 0
              }}>
                {module.price.toLocaleString()} грн.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total price section */}
      <div style={{
        width: '85vw',
        maxWidth: '1340px',
        margin: '5vh auto 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2vw'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
          {/* Close icon */}
          <svg 
            style={{ width: '1.2vw', minWidth: '16px', height: '1.2vw', minHeight: '16px' }}
            viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.7529 1.00012C18.7529 0.447837 18.3052 0.00012195 17.7529 0.00012207C17.2006 0.000122191 16.7529 0.447838 16.7529 1.00012L17.7529 1.00012L18.7529 1.00012ZM17.7529 1.00012L16.7529 1.00012L16.7529 17.0001L17.7529 17.0001L18.7529 17.0001L18.7529 1.00012L17.7529 1.00012Z" fill="white"/>
            <path d="M1 15.0588C0.447715 15.0588 -4.82823e-08 15.5066 0 16.0588C4.82823e-08 16.6111 0.447715 17.0588 1 17.0588L1 16.0588L1 15.0588ZM1 16.0588L1 17.0588L16.8118 17.0588L16.8118 16.0588L16.8118 15.0588L1 15.0588L1 16.0588Z" fill="white"/>
            <path d="M1.66747 0.255485C1.25622 -0.113148 0.623997 -0.0785994 0.255363 0.332652C-0.11327 0.743904 -0.0787214 1.37613 0.33253 1.74476L1 1.00012L1.66747 0.255485ZM1 1.00012L0.33253 1.74476L16.8098 16.5145L17.4773 15.7699L18.1448 15.0252L1.66747 0.255485L1 1.00012Z" fill="white"/>
          </svg>

          <div style={{
            color: '#FFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
            fontWeight: 700
          }}>
            ВСЬОГО
          </div>
        </div>

        {/* Connecting line */}
        <div style={{ flex: 1, minWidth: '20vw', display: 'flex', alignItems: 'center' }}>
          <svg 
            style={{ width: '100%', maxWidth: '35vw', height: '5vh' }}
            viewBox="0 0 553 76" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 74.5H210.926L336.5 2H551.5" stroke="#656565" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{
          color: '#FFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
          fontWeight: 800
        }}>
          {totalPrice.toLocaleString()} грн.
        </div>
      </div>

      {/* Select plan button */}
      <div style={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '5vh',
        paddingBottom: '5vh'
      }}>
        <button
          onClick={handleSelectPlan}
          style={{
            width: 'min(35vw, 500px)',
            height: '8vh',
            minHeight: '60px',
            background: 'transparent',
            border: '2px solid #B400F0',
            borderRadius: '8px',
            cursor: 'pointer',
            position: 'relative',
            color: '#EAEBF0',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1rem, 1.8vw, 2rem)',
            fontWeight: 400,
            transition: 'all 0.3s ease',
            clipPath: 'polygon(0 0, calc(100% - 2rem) 0, 100% 2rem, 100% 100%, 2rem 100%, 0 calc(100% - 2rem))'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.background = '#B400F0';
            target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.background = 'transparent';
            target.style.transform = 'translateY(0)';
          }}
        >
          Обрати та приєднатися
        </button>
      </div>

      {/* Decorative plus icons */}
      <div style={{ position: 'absolute', right: '5vw', top: '60vh' }}>
        {[0, 1, 2].map((index) => (
          <div key={index} style={{ 
            width: '1.8vw', 
            minWidth: '20px',
            height: '1.8vw', 
            minHeight: '20px',
            transform: 'rotate(45deg)', 
            position: 'absolute', 
            top: `${index * 6}vh`
          }}>
            <div style={{ width: '50%', height: '1px', background: '#FFF', position: 'absolute', left: '0', top: '50%' }}></div>
            <div style={{ width: '50%', height: '1px', background: '#FFF', position: 'absolute', right: '0', top: '0' }}></div>
            <div style={{ width: '50%', height: '1px', background: '#FFF', position: 'absolute', right: '0', top: '50%' }}></div>
            <div style={{ width: '50%', height: '1px', background: '#FFF', position: 'absolute', left: '0', bottom: '0' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeDDesignCoursePricing;
