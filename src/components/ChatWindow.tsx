import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiMoreHorizontal } from 'react-icons/fi';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  avatar?: string;
  isOwn?: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

interface ChatWindowProps {
  contact?: Contact;
  messages: Message[];
  loading?: boolean;
  onSendMessage: (message: string) => void;
  onBackToContacts?: () => void;
  showBackButton?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  contact,
  messages,
  loading = false,
  onSendMessage,
  onBackToContacts,
  showBackButton = false
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cabinet-black/95 backdrop-blur-sm relative h-full">
        {/* Background decorative elements for empty state */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/5 transform rotate-45"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/5 transform rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/3 rounded-full"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cabinet-dark-gray to-cabinet-black border border-white/10 rounded-full flex items-center justify-center">
            <div className="text-3xl text-cabinet-gray">💬</div>
          </div>
          <h3 className="text-cabinet-white text-xl font-semibold mb-3">
            Оберіть чат
          </h3>
          <p className="text-cabinet-gray text-lg max-w-md">
            Виберіть контакт зі списку, щоб почати спілкування
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-cabinet-black/95 backdrop-blur-sm flex flex-col relative h-full max-h-screen">
      {/* Chat header */}
      <div className="relative p-4 border-b border-white/20 bg-gradient-to-r from-cabinet-blue/90 to-cabinet-blue-dark/90 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile back button */}
            {showBackButton && onBackToContacts && (
              <button
                onClick={onBackToContacts}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="relative">
              <div className="w-13 h-13 rounded-full border border-white overflow-hidden">
                <img 
                  src={contact.avatar} 
                  alt={contact.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {contact.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-cabinet-black"></div>
              )}
            </div>
            <div>
              <h2 className="text-cabinet-white text-xl font-bold">
                {contact.name}
              </h2>
              <p className="text-cabinet-white text-sm">
                {contact.isOnline ? 'У мережі' : 'Не в мережі'}
              </p>
            </div>
          </div>
          <button className="text-white hover:text-cabinet-gray transition-colors">
            <FiMoreHorizontal className="w-6 h-6 transform rotate-90" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative min-h-0 chat-scroll-container">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white"></div>
          <div className="absolute top-0 left-2/4 w-px h-full bg-white"></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-white"></div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-cabinet-gray">Завантаження повідомлень...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-cabinet-gray text-lg mb-2">
                Немає повідомлень
              </div>
              <div className="text-cabinet-muted-gray">
                Почніть розмову з {contact.name}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              content={message.content}
              timestamp={message.timestamp}
              sender={message.sender}
              avatar={message.avatar}
              isOwn={message.isOwn}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="relative p-4 border-t border-white/20 bg-cabinet-black/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Повідомлення"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="
                w-full px-4 py-3 pr-12
                bg-transparent
                border border-white/30
                text-cabinet-white text-base
                placeholder-cabinet-muted-gray
                outline-none
                font-medium
                transition-all duration-200
                focus:border-white/60 focus:bg-white/5
              "
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cabinet-gray hover:text-white transition-colors"
              onClick={() => {/* Handle file attachment */}}
            >
              <FiPaperclip className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="
              p-3 bg-cabinet-blue
              text-white
              hover:bg-cabinet-accent-blue
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
