import ScrollAnimation from './ScrollAnimation';
import StaggeredAnimation from './StaggeredAnimation';

const TeamSection = () => {
  return (
    <div className="relative text-white py-20 px-4" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#121212' }}>
      <div className="relative max-w-7xl mx-auto">
        
        {/* Основной контент */}
        <div className="relative flex flex-col lg:flex-row items-start gap-2">
          
          {/* Левая часть - изображение команды */}
          <ScrollAnimation direction="left" duration={1} delay={0.2}>
            <div className="relative flex-shrink-0">
              {/* Изображение команды */}
              <div className="relative" style={{ width: 'clamp(450px, 50vw, 650px)', height: 'clamp(550px, 60vw, 750px)' }}>
                <img 
                  src="src/assets/Home/AboutUsPhoto.svg" 
                  alt="Команда викладачів" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </ScrollAnimation>

          {/* Правая часть - текстовый контент */}
          <div className="flex-1 space-y-8 mt-16">
            {/* Главный заголовок */}
            <ScrollAnimation direction="right" duration={0.8} delay={0.3}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Наша команда, це досвітні практикуючі викладачі
              </h2>
            </ScrollAnimation>

            {/* Основной текст */}
            <StaggeredAnimation staggerDelay={0.2} direction="up">
              {[
                "Кожен з нас має реальний досвід роботи в індустрії — від розробки програмного забезпечення до створення візуальних рішень для бізнесу та ігрових проєктів.",
                "Ми створили онлайн-курси, щоб передати не лише знання, а й інструменти, які допоможуть вам одразу застосовувати вивчене на практиці.",
                "Наші заняття — це живий контакт, підтримка, реальні кейси та доступне пояснення складних речей."
              ].map((text, index) => (
                <div key={index} className="text-base md:text-lg font-bold leading-relaxed">
                  <p>{text}</p>
                </div>
              ))}
            </StaggeredAnimation>

            {/* Дополнительный текст */}
            <ScrollAnimation direction="up" duration={0.8} delay={0.6}>
              <div 
                className="text-white text-right flex items-end"
                style={{
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '26px',
                  width: '423px',
                  height: '147px',
                  marginTop: '2rem'
                }}
              >
                Ми постійно оновлюємо навчальні програми відповідно до змін у галузі, слідкуємо за трендами та впроваджуємо найефективніші методики викладання.
              </div>
            </ScrollAnimation>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamSection;