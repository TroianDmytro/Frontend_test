import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  once?: boolean;
  margin?: string;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    once = true,
    margin = "-100px 0px -100px 0px"
  } = options;
  
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold, 
    once,
    margin: margin as any
  });

  return { ref, isInView };
};

export default useScrollAnimation;
