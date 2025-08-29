import React, { useState } from 'react';
import Sidebar from '../components/CabinetSidebar';
import CoursesHeader from '../components/CoursesHeader';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'active' | 'secondary';
  date: number;
}

// interface EventCard {
//   id: string;
//   date: string;
//   time: string;
//   title: string;
//   type: 'online' | 'live';
//   status: 'registered' | 'completed';
// }

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => Promise<void>;
  editingEvent: CalendarEvent | null;
  selectedDate: number | null;
  isLoading: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, editingEvent, selectedDate}) => {
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [time, setTime] = useState(editingEvent?.time || '');
  const [type, setType] = useState<'active' | 'secondary'>(editingEvent?.type || 'active');
  const [date, setDate] = useState(editingEvent?.date || selectedDate || 1);

  React.useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setTime(editingEvent.time);
      setType(editingEvent.type);
      setDate(editingEvent.date);
    } else {
      setTitle('');
      setTime('');
      setType('active');
      setDate(selectedDate || 1);
    }
  }, [editingEvent, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !time.trim()) return;

    await onSave({
      title: title.trim(),
      time: time.trim(),
      type,
      date
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-cabinet-black border border-cabinet-white p-6 w-[400px] max-w-[90vw]">
        <h2 className="text-cabinet-white font-inter text-2xl font-bold mb-6">
          {editingEvent ? 'Редагувати подію' : 'Додати подію'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cabinet-white font-inter text-sm mb-2">
              Назва події
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-cabinet-dark-gray border border-cabinet-border-gray text-cabinet-white font-inter"
              placeholder="Введіть назву події"
              required
            />
          </div>

          <div>
            <label className="block text-cabinet-white font-inter text-sm mb-2">
              Час
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-cabinet-dark-gray border border-cabinet-border-gray text-cabinet-white font-inter"
              required
            />
          </div>

          <div>
            <label className="block text-cabinet-white font-inter text-sm mb-2">
              День
            </label>
            <input
              type="number"
              value={date}
              onChange={(e) => setDate(parseInt(e.target.value))}
              min="1"
              max="31"
              className="w-full p-3 bg-cabinet-dark-gray border border-cabinet-border-gray text-cabinet-white font-inter"
              required
            />
          </div>

          <div>
            <label className="block text-cabinet-white font-inter text-sm mb-2">
              Тип події
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'active' | 'secondary')}
              className="w-full p-3 bg-cabinet-dark-gray border border-cabinet-border-gray text-cabinet-white font-inter"
            >
              <option value="active">Основна</option>
              <option value="secondary">Додаткова</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border border-cabinet-border-gray text-cabinet-white font-inter hover:bg-cabinet-border-gray/20"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="flex-1 p-3 bg-cabinet-blue text-cabinet-white font-inter hover:bg-cabinet-blue-dark"
            >
              {editingEvent ? 'Зберегти' : 'Додати'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CabinetCalendar: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [viewType, setViewType] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventsState, setEventsState] = useState<CalendarEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'secondary'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const months = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];

  // Инициализация событий
  React.useEffect(() => {
    const initialEvents: CalendarEvent[] = [
      { id: '1', title: 'Основи каліграфії та летерінгу', time: '9:00', type: 'active', date: 18 },
      { id: '2', title: 'Фотографія', time: '10:40', type: 'secondary', date: 18 },
      { id: '3', title: 'Дизайн інтер\'єру', time: '9:00', type: 'active', date: 17 },
      { id: '4', title: 'Дизайн інтер\'єру', time: '9:00', type: 'active', date: 24 },
      { id: '5', title: 'Основи каліграфії та летерінгу', time: '9:00', type: 'active', date: 25 },
      { id: '6', title: 'Дизайн', time: '10:40', type: 'secondary', date: 25 },
      { id: '7', title: 'Фотографія та обробка фото', time: '10:40', type: 'active', date: 20 },
      { id: '8', title: 'Основи', time: '12:00', type: 'secondary', date: 20 },
      { id: '9', title: 'Фотографія та обробка фото', time: '10:40', type: 'active', date: 27 },
      { id: '10', title: 'Основи', time: '12:00', type: 'secondary', date: 27 },
    ];
    setEventsState(initialEvents);
  }, []);

  // Клавиатурная навигация
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showAddModal) return; // Не обрабатывать если открыто модальное окно

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (selectedDate && selectedDate > 1) {
            setSelectedDate(selectedDate - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          if (selectedDate && selectedDate < daysInCurrentMonth) {
            setSelectedDate(selectedDate + 1);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (selectedDate && selectedDate > 7) {
            setSelectedDate(selectedDate - 7);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          const maxDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          if (selectedDate && selectedDate + 7 <= maxDays) {
            setSelectedDate(selectedDate + 7);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedDate(null);
          break;
        case 'Enter':
          if (selectedDate) {
            event.preventDefault();
            openAddModal();
          }
          break;
        case 't':
        case 'T':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            goToToday();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedDate, currentDate, showAddModal]);

  // Карточки событий
  // const eventCards: EventCard[] = [
  //   {
  //     id: '1',
  //     date: '25.08',
  //     time: '15:30',
  //     title: 'Ілюстрація в стилі кіберпанк',
  //     type: 'online',
  //     status: 'completed'
  //   },
  //   {
  //     id: '2',
  //     date: '19.06',
  //     time: '18:00',
  //     title: 'Майбутнє інтерфейсів',
  //     type: 'live',
  //     status: 'registered'
  //   },
  //   {
  //     id: '3',
  //     date: '20.07',
  //     time: '09:00',
  //     title: 'Зустріч із студентами школи',
  //     type: 'live',
  //     status: 'registered'
  //   }
  // ];

  // Получить дни месяца
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Первый день недели (0 = воскресенье, переводим в понедельник = 0)
    const startDay = (firstDay.getDay() + 6) % 7;
    
    const days: (number | null)[] = [];
    
    // Добавляем пустые ячейки в начале
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Фильтрация событий
  const getFilteredEvents = () => {
    let filtered = eventsState;

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по типу
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    return filtered;
  };

  // Получить события для дня (с учетом фильтров)
  const getEventsForDay = (day: number) => {
    return getFilteredEvents().filter(event => event.date === day);
  };

  // Добавить новое событие
  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    setIsLoading(true);
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEventsState(prev => [...prev, newEvent]);
    } finally {
      setIsLoading(false);
    }
  };

  // Редактировать событие
  const updateEvent = async (eventId: string, eventData: Omit<CalendarEvent, 'id'>) => {
    setIsLoading(true);
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      setEventsState(prev => prev.map(event =>
        event.id === eventId ? { ...eventData, id: eventId } : event
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Удалить событие
  const deleteEvent = async (eventId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю подію?')) return;

    setIsLoading(true);
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 300));
      setEventsState(prev => prev.filter(event => event.id !== eventId));
    } finally {
      setIsLoading(false);
    }
  };

  // Открыть модальное окно для добавления
  const openAddModal = () => {
    setEditingEvent(null);
    setShowAddModal(true);
  };

  // Открыть модальное окно для редактирования
  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  // Навигация по месяцам
  const previousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    // Сбрасываем выбранный день при смене месяца
    setSelectedDate(null);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    // Сбрасываем выбранный день при смене месяца
    setSelectedDate(null);
  };

  // Переход к текущему месяцу
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today.getDate());
  };

  // Проверка, является ли день сегодняшним
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  // Получить выбранные события (с учетом фильтров)
  const getSelectedDayEvents = () => {
    if (!selectedDate) return [];
    return getFilteredEvents().filter(event => event.date === selectedDate);
  };

  const days = getDaysInMonth();
  const selectedEvents = getSelectedDayEvents();

  return (
    <div className="flex min-h-screen bg-cabinet-black">
      <Sidebar />
      
      <CoursesHeader
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Пошук подій..."
      pageTitle="Календар"
    />
      {/* Header */}

      {/* Основной контент */}
      <div className="flex-1 ml-[100px] pt-[110px]">

        <div className="flex px-8 gap-8">
          {/* Левая часть - календарь */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              {/* Переключатель Місяць/Неділя */}
              <div className="flex w-[236px] h-[36px]">
                <button
                  onClick={() => setViewType('month')}
                  className={`flex-1 flex items-center justify-center font-tt-mono text-sm font-medium ${
                    viewType === 'month'
                      ? 'bg-gradient-to-b from-cabinet-blue to-[#676E84] text-cabinet-light-gray'
                      : 'bg-cabinet-blue/10 text-cabinet-light-gray font-bold'
                  }`}
                >
                  Місяць
                </button>
                <button
                  onClick={() => setViewType('week')}
                  className={`flex-1 flex items-center justify-center font-tt-mono text-sm font-medium ${
                    viewType === 'week'
                      ? 'bg-gradient-to-b from-cabinet-blue to-[#676E84] text-cabinet-light-gray'
                      : 'bg-cabinet-blue/10 text-cabinet-light-gray font-bold'
                  }`}
                >
                  Неділя
                </button>
              </div>

              {/* Фильтр событий */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 text-sm font-inter border ${
                    filterType === 'all'
                      ? 'bg-cabinet-blue text-cabinet-white border-cabinet-blue'
                      : 'text-cabinet-white border-cabinet-border-gray hover:border-cabinet-blue'
                  }`}
                >
                  Всі
                </button>
                <button
                  onClick={() => setFilterType('active')}
                  className={`px-3 py-1 text-sm font-inter border ${
                    filterType === 'active'
                      ? 'bg-cabinet-blue text-cabinet-white border-cabinet-blue'
                      : 'text-cabinet-white border-cabinet-border-gray hover:border-cabinet-blue'
                  }`}
                >
                  Основні
                </button>
                <button
                  onClick={() => setFilterType('secondary')}
                  className={`px-3 py-1 text-sm font-inter border ${
                    filterType === 'secondary'
                      ? 'bg-cabinet-blue text-cabinet-white border-cabinet-blue'
                      : 'text-cabinet-white border-cabinet-border-gray hover:border-cabinet-blue'
                  }`}
                >
                  Додаткові
                </button>
              </div>
            </div>

            {/* Навигация по месяцам */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-cabinet-white font-inter text-5xl font-black">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <div className="flex items-center gap-4">
                <button onClick={previousMonth} className="p-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={nextMonth} className="p-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Кнопка Сегодня */}
                <button
                  onClick={goToToday}
                  className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors font-inter text-sm"
                >
                  Сьогодні
                </button>

                {/* Кнопка Додати */}
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-3 px-6 py-3 hover:opacity-80 transition-opacity border-0"
                  style={{
                    background: 'linear-gradient(90deg, #121212 2.94%, #1951F3 108.26%)'
                  }}
                >
                  <div className="text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-cabinet-white font-inter text-xl font-bold tracking-wide">
                    Додати
                  </span>
                </button>
              </div>
            </div>

            {/* Дни недели */}
            <div className="grid grid-cols-7 gap-0 mb-0">
              {weekdays.map((day, index) => (
                <div key={index} className="w-[124px] h-[55px] flex flex-col justify-center relative">
                  <div className="text-cabinet-white font-tt-mono text-xl font-bold text-left">
                    {day}
                  </div>
                  {/* Подчёркивание */}
                  <div className="absolute bottom-0 left-0 w-[124px] h-0 border-b border-white"></div>
                </div>
              ))}
            </div>

            {/* Календарная сетка */}
            <div className="grid grid-cols-7 gap-0 mt-4">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const hasEvents = dayEvents.length > 0;
                const isSelected = day === selectedDate;
                const isTodayDay = day ? isToday(day) : false;
                const isActiveDay = day && [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29].includes(day);

                return (
                  <div
                    key={index}
                    className={`w-[124px] h-[105px] cursor-pointer flex flex-col p-1 relative ${
                      isSelected
                        ? 'bg-cabinet-blue/30'
                        : hasEvents
                        ? 'bg-cabinet-blue/10'
                        : ''
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        {/* Номер дня */}
                        <div className={`text-xl font-bold font-tt-mono relative ${
                          isActiveDay ? 'text-cabinet-white' : 'text-cabinet-white/50'
                        }`}>
                          {day}
                          {/* Подсветка сегодняшнего дня */}
                          {isTodayDay && (
                            <div className="absolute -inset-1 border-2 border-white"></div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Правая бо��овая панель */}
          <div className="w-[340px] h-[300px] border border-cabinet-white">
            <div className="p-6">
              <h3 className="text-cabinet-white font-inter text-3xl font-bold mb-8">
                {selectedDate || '--'} {months[currentDate.getMonth()].toUpperCase()}
              </h3>

              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 group">
                    {/* Иконка точки */}
                    <div className="mt-2">
                      <svg className="w-3 h-3 text-cabinet-white" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className={`font-inter text-xl font-medium leading-tight ${
                        event.type === 'active' ? 'text-cabinet-white' : 'text-cabinet-gray'
                      }`}>
                        {event.title}
                      </div>
                      <div className={`font-inter text-lg font-medium mt-1 ${
                        event.type === 'active' ? 'text-cabinet-white' : 'text-cabinet-gray'
                      }`}>
                        {event.time}
                      </div>
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-1 text-cabinet-blue hover:text-cabinet-blue-dark"
                        title="Редагувати"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Видалити"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Показать заглушку если нет событий */}
                {selectedEvents.length === 0 && selectedDate && (
                  <div className="text-cabinet-gray font-inter text-lg">
                    Немає подій на цей день
                  </div>
                )}

                {/* Показать заглушку если день не выбран */}
                {!selectedDate && (
                  <div className="text-cabinet-gray font-inter text-lg">
                    Оберіть день для перегляду подій
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Подсказки по клавишам */}
        <div className="px-8 py-4 border-t border-cabinet-border-gray">
          <div className="text-cabinet-gray text-sm font-inter">
            <strong>Клавіші:</strong> ←→↑↓ - навігація, Enter - додати подію, T - сьогодні, Esc - скасувати
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-cabinet-black border border-cabinet-white p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cabinet-blue"></div>
            <span className="text-cabinet-white font-inter">Завантаження...</span>
          </div>
        </div>
      )}

      {/* Модальное окно для добавления/редактирования событий */}
      {showAddModal && (
        <EventModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={async (eventData) => {
            if (editingEvent) {
              await updateEvent(editingEvent.id, eventData);
            } else {
              await addEvent(eventData);
            }
            setShowAddModal(false);
          }}
          editingEvent={editingEvent}
          selectedDate={selectedDate}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default CabinetCalendar;
