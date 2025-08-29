import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollAnimation from '../components/ScrollAnimation';
import styles from './PricingPage.module.css';

const PricingPage = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      title: "Графічний дизайн",
      description: "Створення візуального контенту, робота з фото, каліграфія, дизайн інтер'єрів та UI/UX",
      price: "2,420",
      originalPrice: "3,000",
      features: [
        "Фотографія та обробка фото",
        "Креативне письмо та сторітелінг", 
        "Основи каліграфії та леттерінгу",
        "Основи дизайну та інтер'єру",
        "Основи графічного дизайну у Figma",
        "Відеомонтаж",
        "Веб-дизайн, базовий UI/UX"
      ],
      isPopular: true,
      courseType: "design",
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E8E)",
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 24H24M8 8H24M8 16H24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="4" cy="8" r="2" fill="white"/>
          <circle cx="4" cy="16" r="2" fill="white"/>
          <circle cx="4" cy="24" r="2" fill="white"/>
        </svg>
      )
    },
    {
      title: "Програмування",
      description: "Веб-розробка, JavaScript, React, Python, AI-інструменти та розробка додатків",
      price: "3,800",
      features: [
        "Основи веб-розробки HTML/CSS",
        "JavaScript та інтерактивні елементи",
        "React: сучасна фронтенд розробка",
        "No-code платформи: Tilda та Webflow",
        "Python: основи програмування",
        "AI-інструменти для розробників",
        "Розробка додатків для соціальних мереж"
      ],
      isPopular: false,
      courseType: "programming",
      gradient: "linear-gradient(135deg, #4ECDC4, #44A08D)",
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M10 12L6 16L10 20M22 12L26 16L22 20M20 8L12 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "3D дизайн",
      description: "Професійне 3D моделювання, анімація, гейм-дизайн та технічне креслення",
      price: "4,800",
      originalPrice: "6,000",
      features: [
        "3ds Max: професійне моделювання",
        "Blender: комплексна 3D-графіка",
        "ZBrush: цифрова скульптура",
        "Maya: анімація та візуальні ефекти",
        "Гейм-дизайн та розробка ігор",
        "3D-анімація персонажів",
        "AutoCAD: технічне креслення"
      ],
      isPopular: false,
      courseType: "3d-design",
      gradient: "linear-gradient(135deg, #9747FF, #B400F0)",
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 16L28 9M16 16L4 9M16 16V30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const handleSelectCourse = (courseType: string) => {
    switch (courseType) {
      case 'design':
        navigate('/courses/design-pricing');
        break;
      case 'programming':
        navigate('/courses/programming-pricing');
        break;
      case '3d-design':
        navigate('/courses/3d-design-pricing');
        break;
    }
  };

  return (
    <div className={styles.pricingPage}>
      <Header />
      
      {/* Decorative background elements */}
      <div className={styles.decorativeElements}>
        {/* Left side geometric lines */}
        <svg className={styles.geometricLine1} viewBox="0 0 113 957" fill="none">
          <path d="M-49 1L40.9379 90.6297V285.381L112 356.199V594.105L40.9379 664.924V850.5L-20 956.048" stroke="#656565" strokeWidth="2"/>
        </svg>
        
        <svg className={styles.geometricLine2} viewBox="0 0 140 1000" fill="none">
          <path d="M-28 1L65.2897 94.6608V298.171L139 372.174V620.78L65.2897 694.783V888.705L2.08074 999" stroke="#656565" strokeWidth="2"/>
        </svg>

        {/* Geometric cross shape */}
        <svg className={styles.geometricCross} viewBox="0 0 67 67" fill="none">
          <path d="M22.9853 64.0597C22.9853 63.0896 23.1693 21.6965 22.9853 1H1V22.3433H66V1H44.0147V66H66V44.6567H1.95588V66H22.9853V64.0597Z" stroke="#656565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Target/circle decorations */}
        <div className={styles.targetDecoration}>
          <svg className={styles.innerCircle} viewBox="0 0 60 60" fill="none">
            <circle cx="30.0975" cy="29.9311" r="29.2567" stroke="white"/>
          </svg>
          <svg className={styles.outerCircle} viewBox="0 0 92 92" fill="none">
            <circle cx="46.0976" cy="45.9311" r="45.0937" stroke="white"/>
          </svg>
          <div className={styles.targetLine1}></div>
          <div className={styles.targetLine2}></div>
          <div className={styles.targetLine3}></div>
          <div className={styles.targetLine4}></div>
        </div>

        {/* Plus icons */}
        <div className={styles.plusIconsContainer}>
          {[0, 1, 2].map((index) => (
            <div key={index} className={styles.plusIcon} style={{ top: `${index * 6}vh` }}>
              <div className={styles.plusLine1}></div>
              <div className={styles.plusLine2}></div>
              <div className={styles.plusLine3}></div>
              <div className={styles.plusLine4}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <ScrollAnimation direction="up" duration={0.8}>
          <motion.h1 className={styles.heroTitle}>
            Прайси на курси
          </motion.h1>
        </ScrollAnimation>

        <ScrollAnimation direction="up" duration={0.8} delay={0.2}>
          <motion.p className={styles.heroDescription}>
            Оберіть курс та модулі, які найкраще підходять для ваших цілей. 
            Гнучка система оплати та персоналізований підхід до навчання.
          </motion.p>
        </ScrollAnimation>
      </section>

      {/* Pricing Cards Section */}
      <section className={styles.pricingSection}>
        <div className={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              className={styles.pricingCard}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={styles.popularBadge}
                >
                  Популярний
                </motion.div>
              )}

              {/* Background gradient */}
              <div
                className={styles.backgroundGradient}
                style={{ background: plan.gradient }}
              />

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={styles.cardIcon}
                style={{ background: plan.gradient }}
              >
                {plan.icon}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={styles.cardTitle}
              >
                {plan.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={styles.cardDescription}
              >
                {plan.description}
              </motion.p>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={styles.priceContainer}
              >
                <div className={styles.priceWrapper}>
                  <span className={styles.price}>
                    від {plan.price}
                  </span>
                  {plan.originalPrice && (
                    <span className={styles.originalPrice}>
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className={styles.currency}>
                    грн
                  </span>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={styles.featuresContainer}
              >
                <ul className={styles.featuresList}>
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + featureIndex * 0.1 }}
                      className={styles.featureItem}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={styles.featureIcon}
                      >
                        <path
                          d="M13.333 4L5.999 11.333L2.666 8"
                          stroke="#B400F0"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Button */}
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(180, 0, 240, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCourse(plan.courseType)}
                className={`${styles.cardButton} ${plan.isPopular ? styles.popular : styles.standard}`}
              >
                Обрати модулі
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <ScrollAnimation direction="up" duration={0.8}>
          <h2 className={styles.featuresTitle}>
            Чому обирають наші курси?
          </h2>
        </ScrollAnimation>

        <div className={styles.featuresGrid}>
          {[
            {
              icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35Z" stroke="#B400F0" strokeWidth="2"/>
                  <path d="M15 20L18 23L25 16" stroke="#B400F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Практичний підхід",
              description: "Всі знання одразу застосовуються на реальних проєктах"
            },
            {
              icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M35 20L30 15V18H10V22H30V25L35 20Z" stroke="#B400F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 10H35V30H5V10Z" stroke="#B400F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Гнучка система",
              description: "Оберіть тільки ті модулі, які вам потрібні"
            },
            {
              icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 2L25 12H37L28 20L32 30L20 25L8 30L12 20L3 12H15L20 2Z" stroke="#B400F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Досвідчені викладачі",
              description: "Навчання від практикуючих спеціалістів галузі"
            }
          ].map((feature, index) => (
            <ScrollAnimation key={index} direction="up" duration={0.8} delay={index * 0.2}>
              <motion.div
                whileHover={{ y: -5 }}
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>
                  {feature.title}
                </h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </motion.div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
