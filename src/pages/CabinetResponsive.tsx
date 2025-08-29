import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import Sidebar from "../components/CabinetSidebar";
import { useAuthContext } from '../contexts/AuthContext';
import type { CabinetPageType } from '../contexts/AuthContext';
import CabinetHomeCalendar from '../components/CabinetHomeCalendar';

// Импортируем компоненты страниц
import CabinetProfile from './CabinetProfile';
import CabinetCourses from './CabinetCourses';
import CabinetCalendar from './CabinetCalendar';
import CabinetBooks from './CabinetBooks';
import CabinetAchievements from './CabinetAchievements';
import CabinetChat from './CabinetChat';
import CabinetWallet from './CabinetWallet';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CabinetResponsive: React.FC = () => {
  const { activePage, setActivePage } = useAuthContext();
  const location = useLocation();

  // Определяем активную страницу по URL
  useEffect(() => {
    const path = location.pathname;
    let pageType: CabinetPageType = 'home';
    
    if (path.includes('/profile')) {
      pageType = 'profile';
    } else if (path.includes('/courses')) {
      pageType = 'courses';
    } else if (path.includes('/calendar')) {
      pageType = 'calendar';
    } else if (path.includes('/books')) {
      pageType = 'books';
    } else if (path.includes('/achievements')) {
      pageType = 'achievements';
    } else if (path.includes('/chat')) {
      pageType = 'chat';
    } else if (path.includes('/wallet')) {
      pageType = 'wallet';
    }
    
    // Устанавливаем активную страницу только если она отличается
    if (activePage !== pageType) {
      setActivePage(pageType);
    }
  }, [location.pathname, setActivePage]);

  // Функция для рендеринга контента на основе активной страницы
  const renderContent = () => {
    switch (activePage) {
      case 'profile':
        return <CabinetProfile />;
      case 'courses':
        return <CabinetCourses />;
      case 'calendar':
        return <CabinetCalendar />;
      case 'books':
        return <CabinetBooks />;
      case 'achievements':
        return <CabinetAchievements />;
      case 'chat':
        return <CabinetChat />;
      case 'wallet':
        return <CabinetWallet />;
      case 'home':
      default:
        return renderHomeContent();
    }
  };

  // Функция для рендеринга главной страницы (оригинальный контент)
  const renderHomeContent = () => {
    // Weekly progress chart data
    const weeklyProgressData = {
      labels: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'],
      datasets: [
        {
          label: 'Фото та обробка',
          data: [40, 60, 45, 80, 70, 55, 65],
          borderColor: '#345BCD',
          backgroundColor: 'rgba(52, 91, 205, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#345BCD',
          pointBorderColor: '#345BCD',
          pointRadius: 4,
        },
        {
          label: 'Дизайн інтер\'єру',
          data: [20, 30, 25, 40, 50, 35, 45],
          borderColor: '#6E00BB',
          backgroundColor: 'rgba(110, 0, 187, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#6E00BB',
          pointBorderColor: '#6E00BB',
          pointRadius: 4,
        },
        {
          label: 'Основи каліграфії',
          data: [10, 15, 20, 25, 30, 20, 25],
          borderColor: '#6B707F',
          backgroundColor: 'rgba(107, 112, 127, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#6B707F',
          pointBorderColor: '#6B707F',
          pointRadius: 4,
        },
        {
          label: 'Веб дизайн',
          data: [30, 45, 35, 60, 55, 40, 50],
          borderColor: '#3735E0',
          backgroundColor: 'rgba(55, 53, 224, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#3735E0',
          pointBorderColor: '#3735E0',
          pointRadius: 4,
        },
      ],
    };

    const weeklyProgressOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#F5F5F5',
            font: {
              family: 'TT Autonomous Mono Trl',
              size: 16,
              weight: 700,
            },
          },
        },
        y: {
          display: false,
        },
      },
      elements: {
        line: {
          borderWidth: 2,
        },
      },
    };

    // Donut chart data for progress circles
    const progressDonutData35 = {
      datasets: [
        {
          data: [35, 65],
          backgroundColor: ['#6E00BB', '#CFD3E1'],
          borderWidth: 0,
          cutout: '70%',
        },
      ],
    };

    const progressDonutData50 = {
      datasets: [
        {
          data: [50, 50],
          backgroundColor: ['#1951F3', '#D0D4E2'],
          borderWidth: 0,
          cutout: '70%',
        },
      ],
    };

    const progressDonutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    };

    return (
      <div className="min-h-screen min-w-screen bg-[#121212] text-[#F5F5F5] overflow-x-hidden">
        {/* Main Quote Section */}
        <div className="left-48 z-10">
          <h1 className="text-white font-inter text-[40px] font-black leading-normal mb-2">
            Майбутнє не чекають
          </h1>
          <h2 className="text-[#F5F5F5] font-inter text-[40px] font-black leading-normal" 
              style={{ WebkitTextStroke: '2px #F5F5F5', WebkitTextFillColor: 'transparent' }}>
            [ Його створюють ]
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="px-4 lg:px-6 xl:px-8 grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column - Tasks and Charts */}
          <div className="xl:col-span-7 space-y-6 lg:space-y-8">
            
            {/* Weekly Progress Chart */}
            <div className="bg-[#121212] border border-[#F5F5F5] p-4 lg:p-6">
              <div className="flex justify-between items-start mb-4 lg:mb-6">
                <h3 className="text-[#EFF0F2] font-tt-autonomous text-lg lg:text-xl xl:text-2xl font-bold">
                  Прогрес неділі
                </h3>
                <div className="bg-[#424242] px-2 py-1 text-[#121212] text-xs font-bold">
                  85%
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#345BCD]"></div>
                    <span className="text-[#F5F5F5] font-inter text-sm font-bold">Фото та обробка</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6B707F]"></div>
                    <span className="text-[#A1A1A1] font-inter text-sm">Основи каліграфії</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6E00BB]"></div>
                    <span className="text-[#A1A1A1] font-inter text-sm">Дизайн інтер'єру</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3735E0]"></div>
                    <span className="text-[#A1A1A1] font-inter text-sm">Веб дизайн</span>
                  </div>
                </div>
              </div>
              
              <div className="h-24 lg:h-32">
                <Line data={weeklyProgressData} options={weeklyProgressOptions} />
              </div>
            </div>

            {/* Task Section */}
            <div>
              <div className="flex items-end gap-4 mb-6">
                <h3 className="text-[#EFF0F2] font-tt-autonomous text-lg lg:text-xl xl:text-2xl font-bold">
                  Твої задачі
                </h3>
                <svg width="35" height="35" viewBox="0 0 47 47" fill="none" className="mb-1">
                  <path d="M23.3234 46.1607L0 22.7253V0H47V46.1607H23.3234Z" fill="#414141"/>
                  <path
                    d="M17.8917 29.375C17.9573 29.375 18.0228 29.3684 18.0884 29.3586L23.6022 28.3914C23.6678 28.3783 23.7301 28.3488 23.776 28.2996L37.672 14.4022C37.7024 14.3719 37.7265 14.3359 37.7429 14.2962C37.7594 14.2566 37.7678 14.214 37.7678 14.1711C37.7678 14.1282 37.7594 14.0857 37.7429 14.046C37.7265 14.0063 37.7024 13.9703 37.672 13.94L32.2237 8.4879C32.1614 8.42561 32.0795 8.39282 31.991 8.39282C31.9025 8.39282 31.8205 8.42561 31.7582 8.4879L17.8622 22.3853C17.813 22.4345 17.7835 22.4935 17.7704 22.559L16.8034 28.0734C16.7715 28.249 16.7829 28.4298 16.8366 28.6C16.8903 28.7703 16.9846 28.9249 17.1115 29.0504C17.3279 29.2602 17.6 29.375 17.8917 29.375ZM20.1012 23.6573L31.991 11.7696L34.3938 14.1727L22.5041 26.0604L19.5898 26.5752L20.1012 23.6573Z"
                    fill="#F5F5F5"
                  />
                </svg>
              </div>

              {/* Task Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {/* Task 1 */}
                <div className="bg-white bg-opacity-20 border border-black border-opacity-10 backdrop-blur-[15px] p-4 lg:p-6 hover:transform hover:scale-105 transition-transform">
                  <h4 className="text-[#F5F5F5] font-inter text-base lg:text-lg xl:text-xl font-bold mb-4 leading-normal">
                    Завершити обкладинку для мобільної гри
                  </h4>
                  <div className="flex justify-between items-end">
                    <div className="px-3 py-1 bg-gradient-to-b from-[#1951F3] to-[#676E84] bg-opacity-20 border border-[#BBBCC1]">
                      <span className="text-[#E5E4E9] font-inter text-sm font-semibold">
                        Проста
                      </span>
                    </div>
                    <svg width="12" height="15" viewBox="0 0 15 19" fill="none">
                      <path
                        d="M14.2858 15.0273H13.7501V7.68636C13.7501 4.63989 11.4219 2.12239 8.39292 1.70352V0.863636C8.39292 0.386477 7.99336 0 7.50006 0C7.00676 0 6.6072 0.386477 6.6072 0.863636V1.70352C3.57819 2.12239 1.25006 4.63989 1.25006 7.68636V15.0273H0.714347C0.319257 15.0273 6.10352e-05 15.336 6.10352e-05 15.7182V16.4091C6.10352e-05 16.5041 0.0804182 16.5818 0.178632 16.5818H5.00006C5.00006 17.9161 6.1206 19 7.50006 19C8.87953 19 10.0001 17.9161 10.0001 16.5818H14.8215C14.9197 16.5818 15.0001 16.5041 15.0001 16.4091V15.7182C15.0001 15.336 14.6809 15.0273 14.2858 15.0273ZM7.50006 17.6182C6.90854 17.6182 6.42863 17.154 6.42863 16.5818H8.57149C8.57149 17.154 8.09158 17.6182 7.50006 17.6182ZM2.8572 15.0273V7.68636C2.8572 6.48591 3.33935 5.35886 4.21658 4.51034C5.09381 3.66182 6.25899 3.19545 7.50006 3.19545C8.74113 3.19545 9.90631 3.66182 10.7835 4.51034C11.6608 5.35886 12.1429 6.48591 12.1429 7.68636V15.0273H2.8572Z"
                        fill="#F5F5F5"
                      />
                    </svg>
                  </div>
                  <div className="mt-4 bg-gradient-to-t from-[#1951F3] to-[#676E84] p-2 text-center">
                    <span className="text-[#EFEFF2] font-inter text-sm font-bold">
                      Дизайн Обкладинки
                    </span>
                  </div>
                </div>

                {/* Task 2 */}
                <div className="bg-white bg-opacity-20 border border-black border-opacity-10 backdrop-blur-[15px] p-4 lg:p-6 hover:transform hover:scale-105 transition-transform">
                  <h4 className="text-[#F5F5F5] font-inter text-base lg:text-lg xl:text-xl font-bold mb-4 leading-normal">
                    Підготувати презентацію шрифтів у стилі кібервейву
                  </h4>
                  <div className="flex justify-between items-end">
                    <div className="px-3 py-1 bg-gradient-to-r from-[#6E00BB] to-[#D0D3E2] bg-opacity-20 border border-[#BBBCC1]">
                      <span className="text-[#D4D8E3] font-inter text-sm font-semibold">
                        Складна
                      </span>
                    </div>
                    <svg width="12" height="15" viewBox="0 0 15 19" fill="none">
                      <path
                        d="M14.2858 15.0273H13.7501V7.68636C13.7501 4.63989 11.4219 2.12239 8.39292 1.70352V0.863636C8.39292 0.386477 7.99336 0 7.50006 0C7.00676 0 6.6072 0.386477 6.6072 0.863636V1.70352C3.57819 2.12239 1.25006 4.63989 1.25006 7.68636V15.0273H0.714347C0.319257 15.0273 6.10352e-05 15.336 6.10352e-05 15.7182V16.4091C6.10352e-05 16.5041 0.0804182 16.5818 0.178632 16.5818H5.00006C5.00006 17.9161 6.1206 19 7.50006 19C8.87953 19 10.0001 17.9161 10.0001 16.5818H14.8215C14.9197 16.5818 15.0001 16.5041 15.0001 16.4091V15.7182C15.0001 15.336 14.6809 15.0273 14.2858 15.0273ZM7.50006 17.6182C6.90854 17.6182 6.42863 17.154 6.42863 16.5818H8.57149C8.57149 17.154 8.09158 17.6182 7.50006 17.6182ZM2.8572 15.0273V7.68636C2.8572 6.48591 3.33935 5.35886 4.21658 4.51034C5.09381 3.66182 6.25899 3.19545 7.50006 3.19545C8.74113 3.19545 9.90631 3.66182 10.7835 4.51034C11.6608 5.35886 12.1429 6.48591 12.1429 7.68636V15.0273H2.8572Z"
                        fill="#F5F5F5"
                      />
                    </svg>
                  </div>
                  <div className="mt-4 bg-gradient-to-t from-[#9747FF] to-[#676E84] p-2 text-center">
                    <span className="text-[#EFEFF2] font-inter text-sm font-bold">
                      Дизайн Шрифта
                    </span>
                  </div>
                </div>

                {/* Add Task Card */}
                <div className="border-2 border-[#6E00BB] bg-[#121212] flex items-center justify-center h-32 lg:h-40 hover:bg-[#6E00BB] hover:bg-opacity-10 transition-colors cursor-pointer">
                  <span className="text-[#585858] font-tt-autonomous text-2xl lg:text-3xl xl:text-4xl font-extralight">
                    +
                  </span>
                </div>
              </div>
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Card 1 - Poster */}
              <div className="bg-[#121212] border border-white p-4 text-center hover:transform hover:scale-105 transition-transform">
                <h4 className="text-[#F5F5F5] font-inter text-lg font-bold mb-2">Постер</h4>
                <p className="text-[#F5F5F5] font-inter text-sm font-semibold mb-4">
                  Місто майбутнього
                </p>
                <div className="border border-white p-2 text-center">
                  <span className="text-[#F5F5F5] font-inter text-xs font-bold">
                    Очікує на перевірку
                  </span>
                </div>
              </div>

              {/* Card 2 - Redesign */}
              <div className="bg-[#121212] border border-white p-4 text-center hover:transform hover:scale-105 transition-transform">
                <h4 className="text-[#F5F5F5] font-inter text-lg font-bold mb-2">Редизайн</h4>
                <p className="text-[#F5F5F5] font-inter text-sm font-semibold mb-4">
                  Іконки для застосунку
                </p>
                <div className="border border-white p-2 text-center space-y-1">
                  <div className="text-white font-inter text-xs font-bold">Оцінено</div>
                  <div className="text-white font-inter text-xs font-bold">0/10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar, Event Flow, Progress */}
          <div className="xl:col-span-5 space-y-6 lg:space-y-8">
            
            {/* Calendar */}
            <div className="bg-[#153182] p-3 lg:p-6 font-tt-mono text-base font-bold text-center mb-4">
              <CabinetHomeCalendar/>
            </div>

            {/* Event Flow Section */}
            <div className="bg-[#414141] p-4 lg:p-6">
              <h3 className="text-[#EFEFF2] font-tt-autonomous text-lg lg:text-xl xl:text-2xl font-bold mb-4">
                Подієвий потік
              </h3>
              
              {/* Tab Navigation */}
              <div className="flex mb-4">
                <div className="flex-1 bg-gradient-to-t from-[#1951F3] to-[#676E84] p-2 text-center">
                  <span className="text-[#EFEFF2] font-tt-mono text-sm font-medium">Особисте</span>
                </div>
                <div className="flex-1 bg-transparent p-2 text-center border-b border-gray-600">
                  <span className="text-[#EFEFF2] font-tt-mono text-sm font-bold">Фідбек</span>
                </div>
                <div className="flex-1 bg-transparent p-2 text-center border-b border-gray-600">
                  <span className="text-[#EFEFF2] font-tt-mono text-sm font-bold">Статистика</span>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="space-y-4">
                {/* Event 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#345BCD] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white font-inter text-sm mb-1">
                      Ти здав завдання "3D-модель персонажа"
                    </p>
                    <span className="text-[#1951F3] font-inter text-xs">20:22</span>
                  </div>
                </div>
                
                <hr className="border-[#EFEFF2]" />

                {/* Event 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#345BCD] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-[#EFEFF2] font-inter text-sm mb-1">
                      Новий дедлайн "Скетч до логотипу" до 20 червня
                    </p>
                    <span className="text-[#A1A1A1] font-inter text-xs">20:00</span>
                  </div>
                </div>
                
                <hr className="border-[#C9CBD3]" />

                {/* Event 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#EFEFF2] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-[#EFEFF2] font-inter text-sm mb-1">
                      Ти переглянув відеоурок "Основи композиції"
                    </p>
                    <span className="text-[#A1A1A1] font-inter text-xs">16:20</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Link Cards */}
            <div className="space-y-4">
              {/* Card 3 - Course Link */}
              <div className="bg-[#414141] p-4 text-center hover:transform hover:scale-105 transition-transform cursor-pointer">
                <h5 className="text-[#F5F5F5] font-tt-autonomous text-sm font-bold mb-4">
                  Основи калірафії
                </h5>
                <div className="bg-black bg-opacity-50 px-2 py-1">
                  {/* Progress Circles */}
                  <div className="flex justify-center gap-6 lg:gap-8">
                    {/* Circle 1 - 35% */}
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32">
                      <Doughnut data={progressDonutData35} options={progressDonutOptions} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#F5F5F5] font-tt-autonomous text-sm font-bold">35%</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-[#EFF0F2] font-inter text-sm font-semibold">Перейти</span>
                </div>
              </div>
              
              {/* Card 4 - Course Link */}
              <div className="bg-[#414141] p-4 text-center hover:transform hover:scale-105 transition-transform cursor-pointer">
                <h5 className="text-[#F5F5F5] font-tt-autonomous text-sm font-bold mb-4">
                  Фото та обробка
                </h5>
                <div className="bg-black bg-opacity-50 px-2 py-1">
                  {/* Progress Circles */}
                  <div className="flex justify-center gap-6 lg:gap-8">
                    {/* Circle 2 - 50% */}
                    <div className="relative w-20 h-20 lg:w-24 lg:h-24">
                      <Doughnut data={progressDonutData50} options={progressDonutOptions} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#F5F5F5] font-tt-autonomous text-sm font-bold">50%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[#EFF0F2] font-inter text-sm font-semibold">Перейти</span>
                </div>
              </div>
            </div>

            {/* Live Stream Card */}
            {/* <div className="border border-white p-4 text-center">
              <div className="text-[#A1A1A1] font-inter text-xs mb-2">19.06 18:00</div>
              <h5 className="text-[#F5F5F5] font-inter text-sm lg:text-base font-bold mb-4 leading-normal">
                "Майбутнє інтерфейсів"
              </h5>
              <div className="border border-[#F5F5F5] p-2 mb-4 hover:bg-white hover:bg-opacity-10 transition-colors cursor-pointer">
                <span className="text-[#F5F5F5] font-inter text-sm font-semibold">Реєстрація</span>
              </div>
              <div className="text-[#A1A1A1] font-inter text-xs italic">
                Прямий ефір Q&A
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#121212]">
      {/* Sidebar */}
      <Sidebar/>
      <div className="ml-28">
        {renderContent()}
      </div>
    </div>
  );
};

export default CabinetResponsive;
