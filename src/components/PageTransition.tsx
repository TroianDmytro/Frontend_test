import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PageTransitionProps {
  children: ReactNode;
  loading?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, loading = false }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Показываем анимацию загрузки при смене роута
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Минимальное время показа загрузки

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: 'blur(4px)'
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)'
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
      filter: 'blur(4px)'
    }
  };

  const pageTransition = {
    duration: 0.4
  };

  if (loading || isLoading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
