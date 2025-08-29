import React from 'react';

interface ChatContactProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isActive?: boolean;
  isOnline?: boolean;
  onClick: (id: string) => void;
}

const ChatContact: React.FC<ChatContactProps> = ({
  id,
  name,
  lastMessage,
  time,
  avatar,
  isActive = false,
  isOnline = false,
  onClick
}) => {
  return (
    <div
      className={`
        w-full p-3 cursor-pointer transition-all duration-200 relative
        hover:bg-white/10 hover:backdrop-blur-sm
        ${isActive ? 'bg-cabinet-blue-dark/80 backdrop-blur-sm border-l-2 border-cabinet-blue' : ''}
      `}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-13 h-13 rounded-full border border-white/30 overflow-hidden shadow-lg">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-cabinet-black shadow-lg"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-cabinet-white text-base font-medium truncate">
              {name}
            </h3>
            <span className="text-cabinet-gray text-xs whitespace-nowrap ml-2">
              {time}
            </span>
          </div>
          <p className="text-cabinet-gray text-sm line-clamp-2 leading-tight">
            {lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatContact;
