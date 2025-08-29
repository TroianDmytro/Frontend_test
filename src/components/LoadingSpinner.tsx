import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#60A5FA',
  fullscreen = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const containerClasses = fullscreen 
    ? 'fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  const fullscreenStyle = fullscreen ? {
    backgroundColor: '#121212ee'
  } : {};

  return (
    <div 
      className={containerClasses}
      style={fullscreenStyle}
    >
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-700 rounded-full`}
        style={{ borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
