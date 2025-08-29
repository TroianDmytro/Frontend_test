import React from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

interface ChatToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasNewMessages?: boolean;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  isOpen,
  onClick,
  hasNewMessages = false
}) => {
  return (
    <button
      onClick={onClick}
      className="
        md:hidden fixed bottom-6 right-6 z-30
        w-14 h-14 
        bg-gradient-to-r from-cabinet-blue to-cabinet-blue-dark
        text-white rounded-full
        shadow-lg hover:shadow-xl
        transform transition-all duration-200
        hover:scale-105 active:scale-95
        flex items-center justify-center
        border border-white/20
      "
    >
      {isOpen ? (
        <FiX className="w-6 h-6" />
      ) : (
        <>
          <FiMessageCircle className="w-6 h-6" />
          {hasNewMessages && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          )}
        </>
      )}
    </button>
  );
};

export default ChatToggleButton;
