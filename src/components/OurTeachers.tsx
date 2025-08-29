import OurTeachersImg from '../assets/Home/OurTeachers.svg';
import styles from './OurTeachers.module.css';

function OurTeachers() {

  return (
    <div 
      className={styles.ourTeachersContainer}
      style={{
        backgroundImage: `url(${OurTeachersImg})`
      }}
    >
      {/* Невидимое изображение для задания правильных размеров */}
      <img 
        src={OurTeachersImg} 
        alt="" 
        className={styles.backgroundImage}
      />
    </div>
  );
}

export default OurTeachers;
