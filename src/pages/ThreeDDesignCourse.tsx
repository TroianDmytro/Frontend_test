import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThreeDDesignImage from '../assets/CoursesPres/chrome gamepad.png';
import FrameImage from '../assets/CoursesPres/Group 129 (4).svg';

const ThreeDDesignCourse = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggleModule = (moduleIndex: number) => {
    setExpandedModule(expandedModule === moduleIndex ? null : moduleIndex);
  };

  const courseModules = [
    {
      title: "3Д Макс",
      subsections: [
        "Знайомство з інтерфейсом 3ds Max",
        "Основи моделювання полігональних об'єктів",
        "Робота з модифікаторами",
        "Текстурування та матеріали",
        "Основи освітлення та рендерингу"
      ]
    },
    {
      title: "Гейм-дизайн",
      subsections: [
        "Розробка концепції гри та механік",
        "Дизайн персонажів та середовища",
        "Створення рівнів та локацій",
        "Балансування геймплею",
        "Прототипування та тестування"
      ]
    },
    {
      title: "Zbrush",
      subsections: [
        "Основи цифрової скульптури",
        "Інструменти для деталізації моделей",
        "High poly моделювання",
        "Текстурування в ZBrush",
        "Ретопологія та оптимізація"
      ]
    },
    {
      title: "Blender",
      subsections: [
        "Знайомство з Blender та його можливостями",
        "Моделювання в Blender",
        "Анімація та риггінг",
        "Робота з шейдерами та нодами",
        "Рендеринг у Cycles та Eevee"
      ]
    },
    {
      title: "Maya",
      subsections: [
        "Інтерфейс та основи роботи в Maya",
        "Полігональне та NURBS моделювання",
        "Системи частинок та динаміка",
        "Професійне риггінг та анімація",
        "Рендеринг у Arnold"
      ]
    },
    {
      title: "3Д Анімація",
      subsections: [
        "Принципи анімації та таймінг",
        "Ключові кадри та інтерполяція",
        "Анімація персонажів",
        "Камерна робота та композиція",
        "Пост-продакшн та монтаж"
      ]
    },
    {
      title: "Autodesk AutoCAD",
      subsections: [
        "Технічне креслення та проектування",
        "2D та 3D моделювання в AutoCAD",
        "Робота з блоками та бібліотеками",
        "Аннотації та розмірні лінії",
        "Підготовка до друку та презентації"
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: '#121212' }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="relative px-4 md:px-8 lg:px-20 py-8 md:py-12 lg:py-16 min-h-screen">
          {/* Background Gradient Circle */}
          <div 
            className="absolute right-0 top-0 w-[40vw] h-[40vw] max-w-[800px] max-h-[800px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(50% 50% at 50% 50%, #9747FF 0%, rgba(18, 18, 18, 0.16) 100%)'
            }}
          ></div>
          
          {/* Hero Image */}
          <div className="absolute right-[5%] top-[10%] z-10 hidden lg:block">
            <img
              src={ThreeDDesignImage}
              alt="3D Design Course"
              className="w-[30vw] max-w-[627px] h-auto object-contain"
            />
          </div>

          <div className="relative z-20 max-w-4xl pt-8 md:pt-12 lg:pt-16">
            {/* Course Navigation */}
            <div className="flex flex-wrap items-center space-x-4 md:space-x-8 lg:space-x-16 mb-8 md:mb-12 lg:mb-16">
              <button 
                className="text-lg md:text-xl lg:text-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white focus:outline-none cursor-pointer" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 700, 
                  color: 'rgba(217, 217, 217, 0.44)',
                  outline: 'none',
                  border: 'none'
                }}
                onClick={() => navigate('/courses/graphic-design')}
              >
                ГРАФІЧНИЙ ДИЗАЙН
              </button>
              <button 
                className="text-lg md:text-xl lg:text-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white focus:outline-none cursor-pointer" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 700, 
                  color: 'rgba(217, 217, 217, 0.44)',
                  outline: 'none',
                  border: 'none'
                }}
                onClick={() => navigate('/courses/programming')}
              >
                ПРОГРАМУВАННЯ
              </button>
              <button 
                className="text-white text-lg md:text-xl lg:text-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-purple-300 focus:outline-none cursor-pointer" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 700,
                  outline: 'none',
                  border: 'none'
                }}
                onClick={() => navigate('/courses/3d-design')}
              >
                ЗД ДИЗАЙН
              </button>
            </div>

            {/* Main Title */}
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6 lg:mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              ЗД ДИЗАЙН
            </h1>

            {/* Frame Image */}
            <div className="mb-2 md:mb-3 lg:mb-4">
              <img
                src={FrameImage}
                alt="3D Design Frame"
                className="w-[95%] max-w-[600px] h-auto object-contain"
              />
            </div>

            {/* Subtitle */}
            <div className="mb-2 md:mb-3 lg:mb-4">
              <div 
                className="inline-block px-4 py-2 text-sm md:text-base lg:text-lg"
                style={{
                  background: '#FFFFFF',
                  color: '#4F00B4',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700
                }}
              >
                Модулюй та з'єднуй сучасне та майбутнє
              </div>
            </div>

            {/* Duration */}
            <div className="text-white text-base md:text-lg lg:text-xl mb-8 md:mb-12 lg:mb-16" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Від 6-ти до 12-ти місяців
            </div>

            {/* Registration Button */}
            <button
              className="text-white px-6 md:px-8 lg:px-12 py-3 md:py-4 lg:py-6 text-base md:text-xl lg:text-2xl hover:opacity-90 transition-opacity mb-8 md:mb-12 lg:mb-16 focus:outline-none"
              style={{
                background: '#4F00B4',
                clipPath: 'polygon(0 0, 90% 0, 100% 80%, 0 100%)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                paddingTop: '0.75rem',
                paddingLeft: '1.5rem'
              }}
            >
              Зареєструватися
            </button>
          </div>
        </section>

        {/* Skills Section */}
        <section className="px-4 md:px-8 lg:px-20 py-8 md:py-12 lg:py-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-12 lg:mb-16" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#969696' }}>
            НАВИЧКИ ЯКІ ВИ ОПАНУЄТЕ
          </h2>

          {/* Hard Skills */}
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="flex flex-col lg:flex-row items-start">
              <div className="w-full lg:w-1/2 lg:pr-8 mb-4 lg:mb-0">
                <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 lg:mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#969696' }}>
                  Hard skills
                </h3>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-16">
                <div className="text-white text-base md:text-lg lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                  3D-моделювання
                  <br/><br/>
                  3D-анімація: основи риггінгу, ключових кадрів, таймінгу
                  <br/><br/>
                  Гейм-дизайн: розробка механік, рівнів, персонажів
                  <br/><br/>
                  Цифрова скульптура (ZBrush): деталізація моделей, high poly
                  <br/><br/>
                  Технічне креслення та моделювання в AutoCAD
                  <br/><br/>
                  Текстурування та рендеринг: знання V-Ray, Arnold, Cycles тощо
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-white mt-6 md:mt-8 lg:mt-12"></div>
          </div>

          {/* Soft Skills */}
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="flex flex-col lg:flex-row items-start">
              <div className="w-full lg:w-1/2 lg:pr-8 mb-4 lg:mb-0">
                <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 lg:mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#969696' }}>
                  Soft skills
                </h3>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-16">
                <div className="text-white text-base md:text-lg lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                  Просторове мислення — уявлення 3D-об'єктів у голові, об'ємна логіка
                  <br/><br/>
                  Творчість і візуальне сприйняття — розробка дизайну, композиції
                  <br/><br/>
                  Уважність до деталей — при скульптурі, анімації, рендерінгу
                  <br/><br/>
                  Критичне мислення — пошук рішень під час технічних помилок
                  <br/><br/>
                  Терпіння та наполегливість — важливо при роботі з 3D-графікою
                  <br/><br/>
                  Робота в команді — особливо в проєктах з гейм-дизайну чи анімації
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-white mt-6 md:mt-8 lg:mt-12"></div>
          </div>
        </section>

        {/* Course Program Section */}
        <section className="px-4 md:px-8 lg:px-20 py-8 md:py-12 lg:py-16">
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="w-full h-px bg-gray-600"></div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-12 lg:mb-16" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#969696' }}>
            ПРОГРАМА КУРСУ
          </h2>

          {/* Course Modules */}
          <div className="max-w-5xl mx-auto">
            {courseModules.map((module, index) => (
              <div key={index} className="border-b border-gray-600 last:border-b-0">
                <div className="flex items-center justify-between py-4 md:py-6">
                  <div className="flex items-center">
                    <div className="w-12 md:w-16 lg:w-20 text-white text-xl md:text-2xl lg:text-3xl text-center mr-4 md:mr-6 lg:mr-8" style={{ fontFamily: 'JejuGothic, CourseNumbers, monospace', fontWeight: 400 }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="text-white text-lg md:text-2xl lg:text-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                      {module.title}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleModule(index)}
                    className="w-6 h-6 md:w-8 md:h-8 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 focus:outline-none"
                    style={{
                      transform: expandedModule === index ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <span className="text-sm md:text-lg">
                      {expandedModule === index ? '−' : '+'}
                    </span>
                  </button>
                </div>
                
                {/* Expanded Content with Animation */}
                <div 
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: expandedModule === index ? '500px' : '0px',
                    opacity: expandedModule === index ? 1 : 0,
                  }}
                >
                  <div className="pb-4 md:pb-6 pl-16 md:pl-20 lg:pl-24">
                    <div className="space-y-2 md:space-y-3">
                      {module.subsections.map((subsection, subIndex) => (
                        <div 
                          key={subIndex} 
                          className="text-gray-300 text-sm md:text-base lg:text-lg flex items-start transform transition-all duration-300 ease-in-out"
                          style={{ 
                            fontFamily: 'Inter, sans-serif', 
                            fontWeight: 300,
                            transitionDelay: expandedModule === index ? `${subIndex * 100}ms` : '0ms',
                            transform: expandedModule === index ? 'translateY(0)' : 'translateY(-10px)',
                            opacity: expandedModule === index ? 1 : 0,
                          }}
                        >
                          <span className="text-purple-400 mr-3">•</span>
                          {subsection}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-8 md:mt-12 lg:mt-16">
            <button
              onClick={() => navigate('/courses/3d-design-pricing')}
              className="px-8 md:px-12 lg:px-16 py-4 md:py-6 lg:py-8 text-lg md:text-2xl lg:text-3xl hover:opacity-90 transition-opacity focus:outline-none"
              style={{
                background: '#4F00B4',
                clipPath: 'polygon(0 0, 95% 0, 100% 75%, 0 100%)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                color: '#EAEBF0',
                paddingTop: '0.75rem'
              }}
            >
              Обрати план та приєднатися
            </button>
          </div>
        </section>

        {/* Back to Home Button */}
        <section className="px-4 md:px-8 lg:px-20 py-4 md:py-6 lg:py-8">
          <button 
            onClick={() => navigate('/home')}
            className="bg-gray-700 text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg hover:bg-gray-600 transition-colors rounded focus:outline-none"
          >
            ← Повернутися на головну
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ThreeDDesignCourse;
