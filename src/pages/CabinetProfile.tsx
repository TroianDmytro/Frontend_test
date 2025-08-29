import React, { useState, useEffect, useCallback, memo } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import type { 
  UserProfile, 
  UpdateUserProfile
} from '../services/userService';
import { AvatarWithFrame } from '../components/CabinetAvatar';
import { ProfileStats } from '../components/ProfileStats';
import { AvatarUpload } from '../components/AvatarUpload';

// Импорты иконок
import editIcon from '../assets/Cabinet/icons/edit.svg';
import walletIcon from '../assets/Cabinet/icons/wallet.svg';
import birthdayIcon from '../assets/Cabinet/icons/birthday_cake.svg';
import clockIcon from '../assets/Cabinet/icons/clock.svg';

// Добавляем стили для анимации
const fadeInStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

// Добавляем стили в head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = fadeInStyles;
  if (!document.head.querySelector('style[data-component="CabinetProfile"]')) {
    styleSheet.setAttribute('data-component', 'CabinetProfile');
    document.head.appendChild(styleSheet);
  }
}

interface ProgressItemProps {
  title: string;
  percentage: number;
  showContinue?: boolean;
}

const ProgressItem = memo<ProgressItemProps>(({ title, percentage, showContinue = false }) => {
  return (
    <div className="flex items-center justify-between py-[0.5em] gap-[0.5em]">
      <span
        className="text-[#F5F5F5] font-bold text-[1.1em] leading-tight tracking-wider flex-shrink-0"
        style={{ fontFamily: 'Inter' }}
      >
        {title}
      </span>
      <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
        <div className="flex items-center gap-[0.5em]">
          <div className="w-[12vw] min-w-[6rem] max-w-[12rem] h-[0.5em] bg-[#414141] relative">
            <div
              className="h-full absolute left-0 top-0 transition-all duration-300"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                background: 'linear-gradient(0deg, #1951F3 -149.25%, #676E84 461.19%)'
              }}
            />
          </div>
          <span
            className="text-[#F5F5F5] text-right text-[0.75em] font-extrabold italic leading-tight tracking-wide w-[3em] flex-shrink-0"
            style={{ fontFamily: 'TT Autonomous Trial Variable' }}
          >
            {percentage}%
          </span>
        </div>
        {showContinue && (
          <div className="relative flex-shrink-0">
            <svg className="w-[6em] h-[2em]" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M109.379 0.5L102.598 31.5H0.5V0.5H109.379Z" stroke="#1951F3"/>
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[#1951F3] text-center text-[0.75em] font-bold leading-normal tracking-wider"
              style={{ fontFamily: 'Inter' }}
            >
              Продовжити
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

ProgressItem.displayName = 'ProgressItem';

interface ContactItemProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const ContactItem = memo<ContactItemProps>(({ title, value, icon }) => {
  return (
    <div className="flex items-center justify-between py-[0.5em] gap-[2em]">
      <span
        className="text-[#F5F5F5] font-bold text-[1.1em] leading-tight tracking-wider flex-shrink-0"
        style={{ fontFamily: 'Inter' }}
      >
        {title}
      </span>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span
          className="text-[#F5F5F5] text-[1em] font-medium leading-tight"
          style={{ fontFamily: 'TT Autonomous Trial Variable' }}
        >
          {value}
        </span>
        <div className="w-[2em] h-[2em] fill-[#F5F5F5] flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
});

ContactItem.displayName = 'ContactItem';

function CabinetProfile() {
  const { user, token, updateUser } = useAuthContext();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserProfile>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState(0); // Ключ для принудительного перерендера анимации

  // Загрузка профиля пользователя
  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const profile = await userService.getCurrentUserProfile();
        setUserProfile(profile);
        setEditForm({
          name: profile.name,
          second_name: profile.second_name,
          age: profile.age,
          telefon_number: profile.telefon_number
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        // Create fallback profile if API fails
        const fallbackProfile: UserProfile = {
          id: user.id,
          email: user.email,
          name: user.name,
          second_name: user.second_name || '',
          isEmailVerified: user.isEmailVerified,
          isBlocked: false,
          hasAvatar: !!user.avatar_url,
          avatarUrl: user.avatar_url,
          roles: user.roles,
          registrationDate: new Date().toLocaleDateString('uk-UA'),
          authProvider: user.provider,
          isGoogleUser: user.is_google_user,
          progressStats: {
            totalCourses: 5,
            completedCourses: 1,
            inProgressCourses: 4,
            overallProgress: 68
          },
          activeCourses: [
            {
              id: "1",
              title: "Відмінність",
              progress: 95,
              status: "В процессі",
              lastAccessed: new Date().toISOString()
            },
            {
              id: "2", 
              title: "Інструменти",
              progress: 70,
              status: "В процессі",
              lastAccessed: new Date().toISOString()
            },
            {
              id: "3",
              title: "Баз принципи", 
              progress: 50,
              status: "В процессі",
              lastAccessed: new Date().toISOString()
            },
            {
              id: "4",
              title: "Будова слова",
              progress: 5,
              status: "В процессі", 
              lastAccessed: new Date().toISOString()
            }
          ],
          completedCourses: [
            {
              id: "5",
              title: "Каліграфія",
              progress: 100,
              status: "Пройдено",
              completedAt: new Date().toISOString()
            }
          ],
          contacts: {
            manager: {
              phone: "+380 12 345 67 89",
              name: "Менеджер"
            },
            curator: {
              phone: "+380 98 765 43 21", 
              name: "Куратор"
            },
            discordGroup: "https://discord.gg/example",
            telegramGroup: "https://t.me/example"
          }
        };
        
        setUserProfile(fallbackProfile);
        setEditForm({
          name: user.name,
          second_name: user.second_name,
          age: undefined,
          telefon_number: undefined
        });
        
        setError('Не вдалося завантажити повну інформацію профілю. Показуються основні дані.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, token]);

  // Обработка обновления профиля
  const handleUpdateProfile = useCallback(async () => {
    if (!userProfile) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userService.updateUserProfile(editForm);
      setUserProfile(response.user);
      setIsEditing(false);
      
      const updatedUserForContext = {
        id: response.user.id,
        email: response.user.email,
        login: user?.login || '',
        name: response.user.name,
        second_name: response.user.second_name,
        isEmailVerified: response.user.isEmailVerified,
        roles: response.user.roles,
        provider: response.user.authProvider,
        avatar_url: response.user.avatarUrl,
        is_google_user: response.user.isGoogleUser
      };
      
      updateUser(updatedUserForContext);
      
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUserForContext));
      }
      
      setSuccessMessage('Профіль успішно оновлено!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка при оновленні профілю');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, editForm, user, updateUser]);

  // Обработка изменений в форме
  const handleInputChange = useCallback((field: keyof UpdateUserProfile, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone || phone.trim() === '') return null;
    return phone;
  };

  const hasPhoneNumber = () => {
    return userProfile?.telefon_number && userProfile.telefon_number.trim() !== '';
  };

  const hasAge = () => {
    return userProfile?.age && userProfile.age > 0;
  };

  const getFullName = () => {
    if (!userProfile) return 'Завантаження...';
    
    const { name, second_name } = userProfile;
    
    // Если есть и имя и фамилия
    if (name && second_name && second_name.trim() !== '' && second_name !== 'Не вказано') {
      return `${name} ${second_name}`;
    }
    
    // Если есть только имя
    if (name) {
      return name;
    }
    
    // Если нет ни имени, ни фамилии
    return 'Користувач';
  };

  // Обработка обновления аватара
  const handleAvatarUpdate = useCallback((newAvatarUrl: string) => {
    if (userProfile) {
      setUserProfile(prev => prev ? { ...prev, avatarUrl: newAvatarUrl, hasAvatar: true } : null);
      setSuccessMessage('Аватар успішно оновлено!');
      setTimeout(() => setSuccessMessage(null), 5000);

      // Update user in auth context
      if (user) {
        const updatedUser = { ...user, avatar_url: newAvatarUrl };
        updateUser(updatedUser);
        if (typeof Storage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    }
  }, [userProfile, user, updateUser]);

  const handleAvatarError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  }, []);

  // Иконки
  const documentIcon = (
    <svg viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M10.8439 4.12821L6.91935 0.157949C6.81963 0.0569387 6.68434 0.000125678 6.54323 0H4.79032C4.27272 0 3.77632 0.208012 3.41032 0.578276C3.04433 0.948541 2.83871 1.45073 2.83871 1.97436V2.87179H1.95161C1.43401 2.87179 0.937612 3.07981 0.571614 3.45007C0.205616 3.82034 0 4.32252 0 4.84615V12.0256C0 12.5493 0.205616 13.0515 0.571614 13.4217C0.937612 13.792 1.43401 14 1.95161 14H6.91935C7.43695 14 7.93335 13.792 8.29935 13.4217C8.66535 13.0515 8.87097 12.5493 8.87097 12.0256V11.1282H9.04839C9.56599 11.1282 10.0624 10.9202 10.4284 10.5499C10.7944 10.1797 11 9.67748 11 9.15385V4.48718C10.9944 4.35192 10.9387 4.22375 10.8439 4.12821ZM7.09677 1.83795L9.18323 3.94872H7.09677V1.83795ZM7.80645 12.0256C7.80645 12.2637 7.71299 12.4919 7.54663 12.6602C7.38026 12.8285 7.15463 12.9231 6.91935 12.9231H1.95161C1.71634 12.9231 1.4907 12.8285 1.32434 12.6602C1.15798 12.4919 1.06452 12.2637 1.06452 12.0256V4.84615C1.06452 4.60814 1.15798 4.37987 1.32434 4.21157C1.4907 4.04327 1.71634 3.94872 1.95161 3.94872H2.83871V9.15385C2.83871 9.67748 3.04433 10.1797 3.41032 10.5499C3.77632 10.9202 4.27272 11.1282 4.79032 11.1282H7.80645V12.0256ZM9.04839 10.0513H4.79032C4.55505 10.0513 4.32941 9.95673 4.16305 9.78843C3.99669 9.62013 3.90323 9.39186 3.90323 9.15385V1.97436C3.90323 1.73634 3.99669 1.50808 4.16305 1.33978C4.32941 1.17147 4.55505 1.07692 4.79032 1.07692H6.03226V4.48718C6.0341 4.62941 6.09076 4.76529 6.19019 4.86587C6.28961 4.96645 6.42392 5.02378 6.56452 5.02564H9.93548V9.15385C9.93548 9.39186 9.84202 9.62013 9.67566 9.78843C9.5093 9.95673 9.28366 10.0513 9.04839 10.0513Z" fill="#F5F5F5"/>
    </svg>
  );

  const discordIcon = (
    <svg viewBox="0 0 27 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M22.8867 2.12891C21.1367 1.35156 19.2734 0.785156 17.3281 0.480469C17.0859 0.925781 16.8047 1.52734 16.6055 2.00391C14.5156 1.72656 12.4453 1.72656 10.3945 2.00391C10.1953 1.52734 9.90625 0.925781 9.66016 0.480469C7.71094 0.785156 5.84375 1.35547 4.09375 2.13672C0.589844 7.55859 -0.359375 12.8516 0.113281 18.0703C2.64844 19.9531 5.10938 21.0781 7.51953 21.8164C8.10156 21.0039 8.625 20.1328 9.08203 19.207C8.25 18.9023 7.45703 18.5273 6.70703 18.0898C6.90625 17.9453 7.10156 17.793 7.28906 17.6367C11.8828 19.7461 16.8555 19.7461 21.3906 17.6367C21.582 17.793 21.7773 17.9453 21.9727 18.0898C21.2188 18.5312 20.4258 18.9062 19.5938 19.2109C20.0508 20.1328 20.5703 21.0078 21.1562 21.8203C23.5703 21.082 26.0312 19.957 28.5664 18.0703C29.1133 12.0781 27.5508 6.83203 22.8867 2.12891ZM9.57422 14.8516C8.16016 14.8516 7.00781 13.5547 7.00781 11.9844C7.00781 10.4141 8.13281 9.11328 9.57422 9.11328C11.0156 9.11328 12.168 10.4102 12.1406 11.9844C12.1445 13.5547 11.0156 14.8516 9.57422 14.8516ZM19.1055 14.8516C17.6914 14.8516 16.5391 13.5547 16.5391 11.9844C16.5391 10.4141 17.6641 9.11328 19.1055 9.11328C20.5469 9.11328 21.6992 10.4102 21.6719 11.9844C21.6719 13.5547 20.5469 14.8516 19.1055 14.8516Z" fill="#F5F5F5"/>
    </svg>
  );

  const telegramIcon = (
    <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M20.9961 2.22656L17.8711 18.3164C17.6289 19.3633 16.9805 19.6641 16.0508 19.1484L11.2734 15.5859L9.00391 17.7617C8.74219 18.0234 8.52344 18.2422 8.02734 18.2422L8.37891 13.3906L17.3203 5.30859C17.7188 4.95703 17.2266 4.76172 16.7109 5.11328L5.85156 12.0586L1.13281 10.5469C0.109375 10.2227 0.09375 9.48047 1.35156 8.96484L19.6875 1.64453C20.5391 1.32031 21.2852 1.83594 20.9961 2.22656Z" fill="#F5F5F5"/>
    </svg>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#121212] text-[#F5F5F5] flex items-center justify-center">
        <div className="text-xl">Завантаження профілю...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen w-full bg-[#121212] text-[#F5F5F5] flex items-center justify-center">
        <div className="text-xl text-red-400">Помилка завантаження профілю</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#121212] text-[#F5F5F5] relative min-h-full">
      {/* Background decorative lines */}
      <div className="absolute left-[7%] top-[66%] w-[86%] h-px bg-[rgba(101,101,101,0.20)] hidden lg:block"></div>
      <div className="absolute left-[7%] top-[13%] w-[86%] h-px bg-[rgba(101,101,101,0.20)] hidden lg:block"></div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center px-[5%] space-y-[3vh] pt-[2vh] pb-[5vh]">
        {/* Main Title */}
        <h1
          className="text-[#F5F5F5] text-center text-[clamp(1.5rem,4vw,3rem)] font-bold leading-tight tracking-wide"
          style={{ fontFamily: 'TT Autonomous Trial Variable' }}
        >
          Твій профіль
        </h1>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-600 text-white px-4 py-2 rounded border border-green-500">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && !userProfile && (
          <div className="bg-yellow-600 text-white px-4 py-2 rounded border border-yellow-500">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-[2em]">
          {/* Avatar and Edit Icons */}
          <div className="relative">
            <AvatarWithFrame
              src={userProfile.avatarUrl || "/Logo.svg"}
              alt="Пользователь"
            />
            <AvatarUpload
              onAvatarUpdate={handleAvatarUpdate}
              onError={handleAvatarError}
            />
            {/* Edit icons */}
            <div className="mt-2 absolute -top-[0.5em] -right-[6em] flex gap-[0.5em]">
              <button 
                onClick={() => {
                  setIsEditing(!isEditing);
                  setEditingKey(prev => prev + 1); // Увеличиваем ключ для новой анимации
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="hover:scale-110 hover:opacity-80 transition-all duration-300 ease-in-out transform"
                aria-label="Редагувати профіль"
              >
                <img src={editIcon} alt="Edit" className="w-[3em] h-[3em]"/>
              </button>
              <img src={walletIcon} alt="Wallet" className="w-[2em] h-[2em]"/>
            </div>
          </div>

          {/* Name field */}
          <div className="relative w-[100%] max-w-[30rem] min-w-[20rem]">
            {isEditing ? (
              <div key={editingKey} className="space-y-2 animate-fadeIn">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ім'я *"
                  required
                  className="w-full h-[2.5em] px-[1em] border border-[#BBBCC1] bg-[#121212] text-[#F5F5F5] text-[clamp(1rem,2.5vw,1.5rem)] font-bold transform transition-all duration-300 ease-in-out hover:border-[#1951F3] focus:border-[#1951F3] focus:outline-none"
                  style={{ fontFamily: 'TT Autonomous Trial Variable' }}
                />
                <input
                  type="text"
                  value={editForm.second_name || ''}
                  onChange={(e) => handleInputChange('second_name', e.target.value)}
                  placeholder="Прізвище (необов'язково)"
                  className="w-full h-[2.5em] px-[1em] border border-[#BBBCC1] bg-[#121212] text-[#F5F5F5] text-[clamp(1rem,2.5vw,1.5rem)] font-bold transform transition-all duration-300 ease-in-out hover:border-[#1951F3] focus:border-[#1951F3] focus:outline-none"
                  style={{ fontFamily: 'TT Autonomous Trial Variable' }}
                />
              </div>
            ) : (
              <div
                className="text-[#F5F5F5] text-[clamp(1rem,2.5vw,1.5rem)] font-bold leading-tight flex items-center justify-center h-[2.5em] px-[1em] border border-[#BBBCC1] transition-all duration-300 ease-in-out"
                style={{ fontFamily: 'TT Autonomous Trial Variable' }}
              >
                {getFullName()}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-[1.5em] items-center">
            {/* Phone - показываем если есть номер, либо в режиме редактирования */}
            {hasPhoneNumber() || isEditing ? (
              <div key={`phone-${editingKey}`} className={`flex items-center gap-[1.5em] ${isEditing ? 'animate-fadeIn' : 'transition-all duration-300'}`}>
                <div className="w-[2em] h-[2em] flex items-center justify-center flex-shrink-0">
                  <svg className="w-[1.8em] h-[1.8em]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" fill="#F5F5F5"/>
                  </svg>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.telefon_number || ''}
                    onChange={(e) => handleInputChange('telefon_number', e.target.value)}
                    placeholder="Номер телефону"
                    className="bg-[#121212] border border-[#BBBCC1] text-[#F5F5F5] px-2 py-1 text-[clamp(1rem,2vw,1.5rem)] font-bold transition-all duration-300 ease-in-out hover:border-[#1951F3] focus:border-[#1951F3] focus:outline-none"
                    style={{ fontFamily: 'Inter' }}
                  />
                ) : (
                  <span
                    className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-bold leading-tight transition-all duration-300"
                    style={{ fontFamily: 'Inter' }}
                  >
                    {formatPhoneNumber(userProfile.telefon_number)}
                  </span>
                )}
              </div>
            ) : null}

            {/* Email */}
            <div key={`email-${editingKey}`} className={`flex items-center gap-[1.5em] ${isEditing ? 'animate-fadeIn' : 'transition-all duration-300'}`}>
              <div className="w-[2.5em] h-[2.5em] flex items-center justify-center flex-shrink-0">
                <svg className="w-[2.5em] h-[2.5em]" viewBox="0 0 31 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" fill="#F5F5F5"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" fill="#F5F5F5"/>
                </svg>
              </div>
              <span
                className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-bold leading-tight transition-all duration-300"
                style={{ fontFamily: 'Inter' }}
              >
                {userProfile.email}
              </span>
            </div>
          </div>

          {/* Age and Date Information */}
          <div className="flex flex-col sm:flex-row gap-[10em] sm:gap-[20em] items-center">
            {/* Age - показываем если есть возраст, либо в режиме редактирования */}
            {hasAge() || isEditing ? (
              <div key={`age-${editingKey}`} className={`flex items-center gap-[1.5em] ${isEditing ? 'animate-fadeIn' : 'transition-all duration-300'}`}>
                <div className="w-[2em] h-[2em] flex items-center justify-center flex-shrink-0">
                  <img src={birthdayIcon} alt='birthcake' className="w-[1.8em] h-[1.8em]"/>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    placeholder="Вік"
                    min="0"
                    max="150"
                    className="bg-[#121212] border border-[#BBBCC1] text-[#F5F5F5] px-2 py-1 text-[clamp(1rem,2vw,1.5rem)] font-medium w-20 transition-all duration-300 ease-in-out hover:border-[#1951F3] focus:border-[#1951F3] focus:outline-none"
                    style={{ fontFamily: 'TT Autonomous Trial Variable' }}
                  />
                ) : (
                  <span
                    className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-medium leading-tight transition-all duration-300"
                    style={{ fontFamily: 'TT Autonomous Trial Variable' }}
                  >
                    {userProfile.age} років
                  </span>
                )}
              </div>
            ) : null}

            {/* Registration Date */}
            <div key={`date-${editingKey}`} className={`flex items-center gap-[1.5em] ${isEditing ? 'animate-fadeIn' : 'transition-all duration-300'}`}>
              <div className="w-[2em] h-[2em] flex items-center justify-center flex-shrink-0">
                <img src={clockIcon} alt='clock' className="w-[1.8em] h-[1.8em]"/>
              </div>
              <span
                className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-medium leading-tight transition-all duration-300"
                style={{ fontFamily: 'TT Autonomous Trial Variable' }}
              >
                {userProfile.registrationDate}
              </span>
            </div>
          </div>

          {/* Edit Controls */}
          {isEditing && (
            <div key={`controls-${editingKey}`} className="flex gap-4 animate-fadeIn">
              <button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="bg-[#1951F3] hover:bg-[#1441CC] text-white px-6 py-2 border border-[#1951F3] transition-colors disabled:opacity-50 hover:scale-105 transform duration-200"
                style={{ fontFamily: 'Inter' }}
              >
                {isLoading ? 'Збереження...' : 'Зберегти'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingKey(prev => prev + 1); // Увеличиваем ключ для новой анимации
                  setError(null);
                  setSuccessMessage(null);
                  setEditForm({
                    name: userProfile.name,
                    second_name: userProfile.second_name,
                    age: userProfile.age,
                    telefon_number: userProfile.telefon_number
                  });
                }}
                className="bg-transparent border border-[#F5F5F5] text-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#121212] px-6 py-2 transition-colors hover:scale-105 transform duration-200"
                style={{ fontFamily: 'Inter' }}
              >
                Скасувати
              </button>
            </div>
          )}
        </div>

        {/* White separator line */}
        <div className="w-[60%] max-w-[60rem] h-px bg-white my-[3em]"/>

        {/* Content Sections */}
        <div className="w-[90%] max-w-[70rem] flex flex-col lg:flex-row gap-[3em]">
          {/* Statistics Section */}
          <div className="flex-1">
            <ProfileStats
              totalCourses={userProfile.progressStats.totalCourses}
              completedCourses={userProfile.progressStats.completedCourses}
              inProgressCourses={userProfile.progressStats.inProgressCourses}
              overallProgress={userProfile.progressStats.overallProgress}
            />
          </div>

          {/* In Progress Section */}
          <div className="flex-1">
            <div className="bg-[#121212] border border-[#F5F5F5] p-[2em] space-y-[2em]">
              <h2
                className="text-[#F5F5F5] text-right text-[clamp(1.2rem,3vw,2rem)] font-bold leading-tight"
                style={{ fontFamily: 'TT Autonomous Trial Variable' }}
              >
                В процессі
              </h2>
              <div className="flex justify-start gap-[4em] mb-[1em]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-[1.5em] h-[1.5em] relative transform rotate-45">
                    <div className="absolute inset-0 border border-white opacity-50"></div>
                  </div>
                ))}
              </div>

              <ProgressItem title={userProfile.activeCourses[0]?.title || "Відмінність"} percentage={userProfile.activeCourses[0]?.progress || 95} showContinue />
              <ProgressItem title={userProfile.activeCourses[1]?.title || "Інструменти"} percentage={userProfile.activeCourses[1]?.progress || 70} showContinue />
              <ProgressItem title={userProfile.activeCourses[2]?.title || "Баз принципи"} percentage={userProfile.activeCourses[2]?.progress || 50} showContinue />
              <ProgressItem title={userProfile.activeCourses[3]?.title || "Будова слова"} percentage={userProfile.activeCourses[3]?.progress || 5} showContinue />

              {/* Completed section */}
              <div className="pt-[3em] border-t border-gray-600">
                <h3
                  className="text-[#F5F5F5] text-right text-[clamp(1.2rem,3vw,2rem)] font-bold leading-tight mb-[2em]"
                  style={{ fontFamily: 'TT Autonomous Trial Variable' }}
                >
                  Пройдено
                </h3>
                <ProgressItem title={userProfile.completedCourses[0]?.title || "Каліграфія"} percentage={userProfile.completedCourses[0]?.progress || 100} />
              </div>
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="w-[90%] max-w-[70rem]">
          <div className="bg-[#121212] border border-[#F5F5F5] p-[2em] space-y-[2em]">
            <h2
              className="text-[#F5F5F5] text-[clamp(1.2rem,3vw,2rem)] font-bold leading-tight"
              style={{ fontFamily: 'TT Autonomous Trial Variable' }}
            >
              Контакти
            </h2>
            <ContactItem
              title="Менеджер"
              value={userProfile.contacts.manager.phone}
              icon={documentIcon}
            />
            <div className="border-b border-white opacity-50"></div>
            <ContactItem
              title="Куратор"
              value={userProfile.contacts.curator.phone}
              icon={documentIcon}
            />
            <div className="border-b border-white opacity-50"></div>
            <ContactItem
              title="Група діскорд"
              value=""
              icon={discordIcon}
            />
            <div className="border-b border-white opacity-50"></div>
            <ContactItem
              title="Група телеграмм"
              value=""
              icon={telegramIcon}
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center items-center mt-[4em]">
          <div className="w-[5em] h-[5em] relative">
            <div className="absolute inset-[0.5em] border border-white opacity-20 rounded-full"></div>
            <div className="absolute inset-[0.25em] border border-white opacity-20 rounded-full"></div>
            <div className="absolute top-0 left-1/2 w-[1em] h-px bg-white opacity-20 transform -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-[1em] h-px bg-white opacity-20 transform -translate-x-1/2"></div>
            <div className="absolute left-0 top-1/2 w-px h-[1em] bg-white opacity-20 transform -translate-y-1/2"></div>
            <div className="absolute right-0 top-1/2 w-px h-[1em] bg-white opacity-20 transform -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Corner decorative elements - only on larger screens */}
      <div className="hidden xl:block absolute top-[2%] right-[2%] w-[3em] h-[3em] opacity-30">
        <div className="absolute inset-0 border border-[#1951F3]"></div>
        <div className="absolute top-1/2 left-0 w-[1.5em] h-px bg-[#1951F3]"></div>
        <div className="absolute top-1/2 right-0 w-[1.5em] h-px bg-[#1951F3]"></div>
        <div className="absolute left-1/2 top-0 w-px h-[1.5em] bg-[#1951F3]"></div>
        <div className="absolute left-1/2 bottom-0 w-px h-[1.5em] bg-[#1951F3]"></div>
      </div>

      <div className="hidden xl:block absolute bottom-[2%] right-[2%] w-[2em] h-[2em] border border-white opacity-20 transform rotate-45"></div>
    </div>
  );
}

export default CabinetProfile;