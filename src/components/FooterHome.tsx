import FooterHomeImg from '../assets/Home/FooterHome.svg';
import styles from './FooterHome.module.css';

function FooterHome() {

  return (
    <div 
      className={styles.footerHomeContainer}
      style={{
        backgroundImage: `url(${FooterHomeImg})`
      }}
    >
      {/* Невидимое изображение для задания правильных размеров */}
      <img 
        src={FooterHomeImg} 
        alt="" 
        className={styles.backgroundImage}
      />
    </div>
  );
}

export default FooterHome;
