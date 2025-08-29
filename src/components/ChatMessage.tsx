import React from 'react';

interface ChatMessageProps {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  avatar?: string;
  isOwn?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  timestamp,
  sender,
  avatar,
  isOwn = false
}) => {
  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isOwn && (
        <div className="w-13 h-13 rounded-full border border-white/30 overflow-hidden flex-shrink-0 shadow-lg">
          <img
            src={avatar || '/default-avatar.png'}
            alt={sender}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Message content */}
      <div className={`max-w-md ${isOwn ? 'text-right' : ''}`}>
        {/* Sender name and timestamp */}
        <div className={`mb-1 ${isOwn ? 'text-right' : ''}`}>
          <span className="text-cabinet-muted-gray text-xs font-bold">
            {isOwn ? 'Ви' : sender}
          </span>
        </div>

        {/* Message bubble */}
        <div
          className={`
            inline-block px-4 py-3 rounded-lg text-sm font-semibold leading-tight
            shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl
            ${isOwn
              ? 'bg-cabinet-light-gray/90 text-cabinet-black border border-white/10'
              : 'bg-cabinet-blue-dark/90 text-white border border-cabinet-blue/30'
            }
          `}
        >
          {content}
        </div>

        {/* Timestamp */}
        <div className={`mt-1 ${isOwn ? 'text-right' : ''}`}>
          <span className="text-cabinet-muted-gray text-xs">
            {timestamp}
          </span>
        </div>
      </div>

      {/* Own avatar */}
      {isOwn && (
        <div className="w-16 h-16 rounded-full border border-white/30 overflow-hidden flex-shrink-0 shadow-lg">
          <img
            src={avatar || '/default-avatar.png'}
            alt="Ви"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
