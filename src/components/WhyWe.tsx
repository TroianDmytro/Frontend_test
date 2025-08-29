import WhyWeImg from '../assets/Home/WhyWe.svg';
import styles from './WhyWe.module.css';

function WhyWe() {

  return (
    <div 
      className={styles.whyWeContainer}
      style={{
        backgroundImage: `url(${WhyWeImg})`
      }}
    >
      {/* Невидимое изображение для задания правильных размеров */}
      <img 
        src={WhyWeImg} 
        alt="" 
        className={styles.backgroundImage}
      />
    </div>
  );
}

export default WhyWe;
