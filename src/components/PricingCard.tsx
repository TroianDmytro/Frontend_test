import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './PricingCard.module.css';

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  courseType: 'design' | 'programming' | '3d-design';
  gradient: string;
  icon: React.ReactNode;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  originalPrice,
  features,
  isPopular = false,
  buttonText,
  courseType,
  gradient,
  icon
}) => {
  const navigate = useNavigate();

  const handleSelectCourse = () => {
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
    <motion.div
      className={`${styles.pricingCard} ${isPopular ? styles.popular : styles.standard}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      {/* Popular badge */}
      {isPopular && (
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
        style={{ background: gradient }}
      />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={styles.cardIcon}
        style={{ background: gradient }}
      >
        {icon}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.cardTitle}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={styles.cardDescription}
      >
        {description}
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
            від {price}
          </span>
          {originalPrice && (
            <span className={styles.originalPrice}>
              {originalPrice}
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
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
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
        onClick={handleSelectCourse}
        className={`${styles.cardButton} ${isPopular ? styles.popular : styles.standard}`}
        onMouseEnter={(e) => {
          if (!isPopular) {
            const target = e.target as HTMLButtonElement;
            target.style.background = 'linear-gradient(135deg, #B400F0, #9747FF)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isPopular) {
            const target = e.target as HTMLButtonElement;
            target.style.background = 'transparent';
          }
        }}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
};

export default PricingCard;
