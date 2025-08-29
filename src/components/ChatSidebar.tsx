import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import ChatContact from './ChatContact';

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isOnline?: boolean;
}

interface ChatSidebarProps {
  contacts: Contact[];
  activeContactId?: string;
  onContactSelect: (id: string) => void;
  loading?: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  activeContactId,
  onContactSelect,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-cabinet-black/95 backdrop-blur-sm border-r border-white/20 flex flex-col relative max-h-screen">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cabinet-black/50 to-cabinet-black/90 pointer-events-none"></div>

      {/* Search bar */}
      <div className="relative z-10 p-4 border-b border-white/10 flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-cabinet-gray" />
          </div>
          <input
            type="text"
            placeholder="Ім'я, повідомлення, чат"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full pl-10 pr-3 py-3
              bg-cabinet-light-gray/90 backdrop-blur-sm
              text-cabinet-black text-base
              placeholder-cabinet-muted-gray
              border border-white/10 outline-none
              font-medium tracking-wider
              transition-all duration-200
              focus:bg-cabinet-light-gray focus:border-white/30
            "
          />
        </div>
      </div>

      {/* Contacts list */}
      <div className="relative z-10 flex-1 overflow-y-auto min-h-0 chat-scroll-container">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-cabinet-gray">Завантаження...</div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-cabinet-gray">
              {searchQuery ? 'Контакти не знайдені' : 'Немає контактів'}
            </div>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <ChatContact
              key={contact.id}
              id={contact.id}
              name={contact.name}
              lastMessage={contact.lastMessage}
              time={contact.time}
              avatar={contact.avatar}
              isActive={contact.id === activeContactId}
              isOnline={contact.isOnline}
              onClick={onContactSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
