import React, { useState, useEffect } from 'react';
import Sidebar from '../components/CabinetSidebar';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatToggleButton from '../components/ChatToggleButton';

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  avatar?: string;
  isOwn?: boolean;
}

// Mock data - replace with actual data loading
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Ірина Олександрівна',
    lastMessage: 'Ірина: Я відправила тобі оцінку, подивись у особистому кабінеті. Ще...',
    time: '1 хвилину тому',
    avatar: '/api/placeholder/53/53',
    isOnline: true
  },
  {
    id: '2',
    name: 'Олександр Тавринський',
    lastMessage: 'Олександр: Подивись спільному чаті завдання!!! Ми нічого не стигаємо...',
    time: 'Вчора',
    avatar: '/api/placeholder/53/53'
  },
  {
    id: '3',
    name: 'Олег',
    lastMessage: 'Олег: На парі будеш?',
    time: 'Середа',
    avatar: '/api/placeholder/53/53'
  },
  {
    id: '4',
    name: 'Марія з групи',
    lastMessage: 'Марія: Скинь домашку пж',
    time: 'Субота',
    avatar: '/api/placeholder/53/53'
  },
  {
    id: '5',
    name: 'Одногрупник',
    lastMessage: 'Ви: Добре, куплю',
    time: 'Нед. назад',
    avatar: '/api/placeholder/53/53'
  },
  {
    id: '6',
    name: 'Куратор',
    lastMessage: 'Куратор: Ви будете на парі?',
    time: 'Нед. назад',
    avatar: '/api/placeholder/53/53'
  },
  {
    id: '7',
    name: 'Адмін',
    lastMessage: 'Ви: Я -',
    time: 'Нед. назад',
    avatar: '/api/placeholder/53/53'
  }
];

const mockMessages: { [contactId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      content: 'Доброго дня, ви дивилися моє домашнє завдання?',
      timestamp: '11:13',
      sender: 'Ви',
      isOwn: true,
      avatar: '/api/placeholder/63/63'
    },
    {
      id: '2',
      content: 'Я відправила тобі оцінку, подивись у особистому кабінеті. Ще я написала у помітках правки які потрібні',
      timestamp: '11:25',
      sender: 'Ірина Олександрівна',
      isOwn: false,
      avatar: '/api/placeholder/53/53'
    },
    {
      id: '3',
      content: 'Добре, дякую',
      timestamp: '11:30',
      sender: 'Ви',
      isOwn: true,
      avatar: '/api/placeholder/63/63'
    }
  ]
};

const CabinetChat: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Prevent body scroll when chat is mounted
  useEffect(() => {
    document.body.classList.add('chat-active');
    return () => {
      document.body.classList.remove('chat-active');
    };
  }, []);

  // Simulate data loading
  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContacts(mockContacts);
      setLoading(false);
    };

    loadContacts();
  }, []);

  // Load messages when contact is selected
  useEffect(() => {
    if (activeContactId) {
      const loadMessages = async () => {
        setMessagesLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessages(mockMessages[activeContactId] || []);
        setMessagesLoading(false);
      };

      loadMessages();
    }
  }, [activeContactId]);

  const handleContactSelect = (contactId: string) => {
    setActiveContactId(contactId);
    // Hide sidebar on mobile when contact is selected
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleBackToContacts = () => {
    setShowSidebar(true);
    setActiveContactId(undefined);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeContactId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      timestamp: new Date().toLocaleTimeString('uk-UA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sender: 'Ви',
      isOwn: true,
      avatar: '/api/placeholder/63/63'
    };

    setMessages(prev => [...prev, newMessage]);

    // Update last message in contacts
    setContacts(prev => prev.map(contact => 
      contact.id === activeContactId 
        ? { ...contact, lastMessage: `Ви: ${messageText}`, time: 'щойно' }
        : contact
    ));

    // Here you would normally send the message to your backend
    console.log('Sending message:', messageText, 'to contact:', activeContactId);
  };

  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <div className="cabinet-container bg-cabinet-black relative h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="cabinet-main-content bg-transparent relative z-10 h-screen">
        <div className="h-full flex relative">
          {/* Chat Sidebar - Responsive with mobile overlay */}
          <div className={`
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:relative md:flex
            fixed md:relative inset-y-0 left-0 z-20
            w-full sm:w-[85%] md:w-2/5 lg:w-1/3 xl:w-[30%] 2xl:w-[25%]
            border-r border-white/30
            min-w-[280px] max-w-[500px]
            transition-transform duration-300 ease-in-out
            bg-cabinet-black md:bg-transparent
            h-full
          `}>
            <ChatSidebar
              contacts={contacts}
              activeContactId={activeContactId}
              onContactSelect={handleContactSelect}
              loading={loading}
            />
          </div>

          {/* Overlay for mobile */}
          {showSidebar && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-10"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Chat Window - Takes remaining space */}
          <div className="flex-1 min-w-0 relative">
            <ChatWindow
              contact={activeContact}
              messages={messages}
              loading={messagesLoading}
              onSendMessage={handleSendMessage}
              onBackToContacts={handleBackToContacts}
              showBackButton={!showSidebar && window.innerWidth < 768}
            />
          </div>
        </div>
      </div>

      {/* Mobile Chat Toggle Button */}
      <ChatToggleButton
        isOpen={showSidebar}
        onClick={() => setShowSidebar(!showSidebar)}
        hasNewMessages={contacts.some(c => c.time === 'щойно' || c.time.includes('хвилину'))}
      />
    </div>
  );
};

export default CabinetChat;
