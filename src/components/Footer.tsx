import styles from './Footer.module.css';
import DiscordIcon from '../assets/Footer/Discord.svg';
import FacebookIcon from '../assets/Footer/Facebook.svg';
import InstagramIcon from '../assets/Footer/Inst.svg';
import YouTubeIcon from '../assets/Footer/YouTube.svg';
import AppStoreIcon from '../assets/Footer/appstore.svg';
import GooglePlayIcon from '../assets/Footer/googleplay.svg';

// Типы для компонентов
interface SocialIconProps {
  type: 'Discord' | 'Instagram' | 'Facebook' | 'YouTube';
  className: string;
}

interface AppStoreButtonProps {
  type: 'appstore' | 'googleplay';
  className: string;
}

// Компонент для иконок социальных сетей
const SocialIcon = ({ type, className }: SocialIconProps) => {
  const iconMap = {
    Discord: DiscordIcon,
    Instagram: InstagramIcon,
    Facebook: FacebookIcon,
    YouTube: YouTubeIcon,
  };

  return (
    <img 
      src={iconMap[type]} 
      alt={type} 
      className={`${styles.socialIcon} ${className}`}
    />
  );
};

const AppStoreButton = ({ type, className }: AppStoreButtonProps) => {
  const iconMap = {
    appstore: AppStoreIcon,
    googleplay: GooglePlayIcon,
  };

  return (
    <img 
      src={iconMap[type]} 
      alt={type === 'appstore' ? 'App Store' : 'Google Play'} 
      className={`${styles.appButton} ${className}`}
    />
  );
};

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Основная информация */}
        <div className={styles.mainInfo}>
          <div className={styles.contactInfo}>
            <div className={styles.phones}>
              +380 98 015 9272 +380 99 235 6838
            </div>
            <div className={styles.address}>
              вул. Василя Симоненка 24П
            </div>
          </div>
        </div>

        {/* Основной контент футера */}
        <div className={styles.footerContent}>
          
          {/* Секция "Про нас" */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Neuronest</h3>
            <ul className={styles.linksList}>
              <li><a href="#" className={styles.link}>Про нас</a></li>
              <li><a href="#" className={styles.link}>Робота в Neuronest</a></li>
              <li><a href="#" className={styles.link}>Стати куратором у Neuronest</a></li>
              <li><a href="#" className={styles.link}>Запропонувати курс</a></li>
              <li><a href="#" className={styles.link}>Запропонувати вакансію</a></li>
              <li><a href="#" className={styles.link}>Політика кронфіденційності</a></li>
              <li><a href="#" className={styles.link}>Політика використання Cookie</a></li>
            </ul>
          </div>

          {/* Секция "Курси" */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Курси</h3>
            <ul className={styles.linksList}>
              <li><a href="#" className={styles.link}>Дизайн</a></li>
              <li><a href="#" className={styles.link}>3Д</a></li>
              <li><a href="#" className={styles.link}>Програмування</a></li>
            </ul>
          </div>

          {/* Социальные сети и приложения */}
          <div className={styles.section}>
            <div className={styles.socialAndApps}>
              
              {/* Социальные иконки */}
              <div className={styles.socialContainer}>
                <div className={styles.socialGrid}>
                  <SocialIcon type="Discord" className="" />
                  <SocialIcon type="Instagram" className="" />
                  <SocialIcon type="Facebook" className="" />
                  <SocialIcon type="YouTube" className="" />
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки приложений */}
          <div className={styles.section}>
            <div className={styles.appsContainer}>
              <AppStoreButton type="appstore" className={styles.appStore} />
              <AppStoreButton type="googleplay" className={styles.googlePlay} />
            </div>
          </div>

        </div>

        {/* Города в правом нижнем углу */}
        <div className={styles.citiesBottomRight}>
          <span className={styles.city}>Дніпро</span>
          <span className={styles.city}>Одесса</span>
          <span className={styles.city}>Київ</span>
          <span className={styles.city}>Харків</span>
          <span className={styles.city}>Львів</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;