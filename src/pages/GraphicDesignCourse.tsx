import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GraphicDesignImage from '../assets/CoursesPres/ГрафДизайн ПНг 1.png';
import FrameImage from '../assets/CoursesPres/Group 128 (5).svg';

const GraphicDesignCourse = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggleModule = (moduleIndex: number) => {
    setExpandedModule(expandedModule === moduleIndex ? null : moduleIndex);
  };

  const courseModules = [
    {
      title: "Фотографія та обробка фото",
      subsections: [
        "Основи композиції та кадрування",
        "Робота зі світлом та тінями",
        "Обробка фото в Adobe Photoshop",
        "Ретуш та колірна корекція",
        "Створення художніх ефектів"
      ]
    },
    {
      title: "Креативне письмо та сторітелінг",
      subsections: [
        "Основи сторітелінгу в дизайні",
        "Створення концепції та ідеї",
        "Розробка персонажів та сценаріїв",
        "Візуальне оповідання",
        "Адаптація історій для різних медіа"
      ]
    },
    {
      title: "Основи каліграфії та леттерінгу",
      subsections: [
        "Історія та стилі каліграфії",
        "Інструменти та матеріали",
        "Базові техніки написання",
        "Створення власних шрифтів",
        "Цифрова каліграфія та леттерінг"
      ]
    },
    {
      title: "Основи дизайну та інтер'єру",
      subsections: [
        "Принципи композиції в просторі",
        "Кольорознавство в інтер'єрі",
        "Планування та зонування",
        "Стилі та напрямки дизайну",
        "3D візуалізація інтер'єрів"
      ]
    },
    {
      title: "Основи графічного дизайну у Figma",
      subsections: [
        "Знайомство з інтерфейсом Figma",
        "Робота з векторною графікою",
        "Створення макетів та прототипів",
        "Системи дизайну та компоненти",
        "Командна робота та експорт файлів"
      ]
    },
    {
      title: "Відеомонтаж",
      subsections: [
        "Основи відеомонтажу та таймлайн",
        "Робота з Adobe Premiere Pro",
        "Колірна корекція відео",
        "Додавання ефектів та переходів",
        "Звукова доріжка та синхронізація"
      ]
    },
    {
      title: "Веб-дизайн, базовий UI/UX",
      subsections: [
        "Принципи UX/UI дизайну",
        "Дослідження користувачів",
        "Створення вайрфреймів та прототипів",
        "Адаптивний дизайн",
        "Тестування та оптимізація інтерфейсів"
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
              background: 'radial-gradient(50% 50% at 50% 50%, #6E00BB 0%, rgba(18, 18, 18, 0.1) 100%)'
            }}
          ></div>
          
          {/* Hero Image */}
          <div className="absolute right-[5%] top-[10%] z-10 hidden lg:block">
            <img
              src={GraphicDesignImage}
              alt="Graphic Design Course"
              className="w-[30vw] max-w-[627px] h-auto object-contain"
            />
          </div>

          <div className="relative z-20 max-w-4xl pt-8 md:pt-12 lg:pt-16">
            {/* Course Navigation */}
            <div className="flex flex-wrap items-center space-x-4 md:space-x-8 lg:space-x-16 mb-8 md:mb-12 lg:mb-16">
              <button 
                className="text-white text-lg md:text-xl lg:text-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-purple-300 focus:outline-none cursor-pointer" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 700,
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
                className="text-lg md:text-xl lg:text-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white focus:outline-none cursor-pointer" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 700, 
                  color: 'rgba(217, 217, 217, 0.44)',
                  outline: 'none',
                  border: 'none'
                }}
                onClick={() => navigate('/courses/3d-design')}
              >
                <span style={{ fontWeight: 900 }}>З</span>Д ДИЗАЙН
              </button>
            </div>

            {/* Main Title */}
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6 lg:mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              ГРАФІЧНИЙ ДИЗАЙН
            </h1>

            {/* Frame Image */}
            <div className="mb-2 md:mb-3 lg:mb-4">
              <img
                src={FrameImage}
                alt="Design Frame"
                className="w-[95%] max-w-[600px] h-auto object-contain"
              />
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
                  Основи графічного дизайну: робота з кольором, композицією, сіткою.
                  <br/>
                  Базове володіння головними інструментами дизайнера: Adobe Photoshop, Adobe Illustrator, Figma.
                  <br/><br/>
                  Грамотне створення дизайну продукту.
                  <br/><br/>
                  Розуміння типографії та робота з логотипами.
                  <br/>
                  Створення брендингів й розробка концепцій.
                  <br/>
                  Робота з рекламними матеріалами та версткою.
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
                  Творче мислення та візуалізація ідей.
                  <br/><br/>
                  Комунікація із замовниками, розуміння їхніх потреб.
                  <br/><br/>
                  Презентація ідеї клієнту та робота з брифом.
                  <br/><br/>
                  Визначення вектора розвитку в професії.
                  <br/><br/>
                  Робота в команді.
                  <br/><br/>
                  Наділеність і смак.
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
              onClick={() => navigate('/courses/design-pricing')}
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

export default GraphicDesignCourse;
