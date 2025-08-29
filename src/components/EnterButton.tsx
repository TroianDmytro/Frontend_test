import React from 'react';

interface EnterButtonProps {
  variant?: 'default' | 'highlighted';
  onClick?: () => void;
}

const EnterButton: React.FC<EnterButtonProps> = ({ 
  variant = 'default', 
  onClick 
}) => {
  if (variant === 'highlighted') {
    return (
      <div 
        className="flex justify-center items-center cursor-pointer"
        style={{
          width: '140px',
          height: '29px',
          flexShrink: 0,
          color: '#EFEFF2',
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal'
        }}
        onClick={onClick}
      >
        <span style={{ color: '#1919EC' }}>[</span>
        <span style={{ color: '#EFEFF2' }}>  ENTER  </span>
        <span style={{ color: '#1919EC' }}>]</span>
      </div>
    );
  }

  return (
    <div 
      className="flex justify-center items-center cursor-pointer"
      style={{
        width: '120px',
        height: '29px',
        flexShrink: 0,
        color: '#EFEFF2',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal'
      }}
      onClick={onClick}
    >
      [ ENTER ]
    </div>
  );
};

export default EnterButton;
