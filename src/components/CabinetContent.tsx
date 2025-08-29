import React from 'react';
import { AvatarWithFrame } from './CabinetAvatar';

interface ProgressItemProps {
  title: string;
  percentage: number;
  showContinue?: boolean;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ title, percentage, showContinue = false }) => {
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
};

interface ContactItemProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const ContactItem: React.FC<ContactItemProps> = ({ title, value, icon }) => {
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
        <div className="w-[1em] h-[1.2em] fill-[#F5F5F5] flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

const Cabinet: React.FC = () => {
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

  return (
    <div className="min-h-screen w-full bg-[#121212] text-[#F5F5F5] relative overflow-hidden">
      {/* Background decorative lines */}
      <div className="absolute left-[7%] top-[66%] w-[86%] h-px bg-[rgba(101,101,101,0.20)] hidden lg:block"></div>
      <div className="absolute left-[7%] top-[13%] w-[86%] h-px bg-[rgba(101,101,101,0.20)] hidden lg:block"></div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center px-[5%] space-y-[3vh] pt-[5vh]">
        {/* Main Title */}
        <h1
          className="text-[#F5F5F5] text-center text-[clamp(1.5rem,4vw,3rem)] font-bold leading-tight tracking-wide"
          style={{ fontFamily: 'TT Autonomous Trial Variable' }}
        >
          Твій профіль
        </h1>

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-[2em]">
          {/* Avatar and Edit Icons */}
          <div className="relative">
            
            {/* Avatar frame */}
            <AvatarWithFrame
              src="public/Logo.svg"
              alt="Пользователь"
            />
            {/* Edit icons */}
            <div className="mt-2 absolute -top-[0.5em] -right-[6em] flex gap-[0.5em]">
              <img src="src\assets\Cabinet\icons\edit.svg"/>
              <img src="src\assets\Cabinet\icons\wallet.svg"/>
            </div>
          </div>

          {/* Name field */}
          <div className="relative w-[100%] max-w-[30rem] min-w-[20rem]">
            <div
              className="text-[#F5F5F5] text-[clamp(1rem,2.5vw,1.5rem)] font-bold leading-tight flex items-center justify-center h-[2.5em] px-[1em] border border-[#BBBCC1]"
              style={{ fontFamily: 'TT Autonomous Trial Variable' }}
            >
              Миколенко Миколай Батькович
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-[1.5em] items-center">
            <div className="flex items-center gap-[1.5em]">
              <svg className="w-[1.5em] h-[1.5em]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" fill="#F5F5F5"/>
              </svg>
              <span
                className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-bold leading-tight"
                style={{ fontFamily: 'Inter' }}
              >
                +380 98 799 55 15
              </span>
            </div>
            <div className="flex items-center gap-[1.5em]">
              <svg className="w-[1.8em] h-[1.2em]" viewBox="0 0 31 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" fill="#F5F5F5"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" fill="#F5F5F5"/>
              </svg>
              <span
                className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-bold leading-tight"
                style={{ fontFamily: 'Inter' }}
              >
                voloshka227@gmail.com
              </span>
            </div>
          </div>

          {/* Date Information */}
          <div className="flex flex-col sm:flex-row gap-[20em] items-center">
            <div className="flex items-center gap-[1.5em]">
              <img src="src\assets\Cabinet\icons\birthday_cake.svg" alt='birthcake'/>
              <span
                className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-medium leading-tight"
                style={{ fontFamily: 'TT Autonomous Trial Variable' }}
              >
                22/03/2006
              </span>
            </div>
            <div className="flex items-center gap-[1.5em]">
              <img src="src\assets\Cabinet\icons\clock.svg" alt='clock'/>
              <span
                className="text-[#F5F5F5] text-[clamp(1rem,2vw,1.5rem)] font-medium leading-tight"
                style={{ fontFamily: 'TT Autonomous Trial Variable' }}
              >
                01/02/2025
              </span>
            </div>
          </div>
        </div>

        {/* White separator line */}
        <div className="w-[60%] max-w-[60rem] h-px bg-white my-[3em]"/>

        {/* Content Sections */}
        <div className="w-[90%] max-w-[70rem] flex flex-col lg:flex-row gap-[3em]">
          {/* In Progress Section */}
          <div className="flex-1">

            {/* Background container */}
            <div className="bg-[#121212] border border-[#F5F5F5] p-[2em] space-y-[2em]">
              {/* Star decorations */}
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

              <ProgressItem title="Відмінність" percentage={95} showContinue />
              <ProgressItem title="Інструменти" percentage={70} showContinue />
              <ProgressItem title="Баз принципи" percentage={50} showContinue />
              <ProgressItem title="Будова слова" percentage={5} showContinue />

              {/* Completed section */}
              <div className="pt-[3em] border-t border-gray-600">
                <h3
                  className="text-[#F5F5F5] text-right text-[clamp(1.2rem,3vw,2rem)] font-bold leading-tight mb-[2em]"
                  style={{ fontFamily: 'TT Autonomous Trial Variable' }}
                >
                  Пройдено
                </h3>
                <ProgressItem title="Каліграфія" percentage={100} />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="flex-1">

            {/* Background container */}
            <div className="bg-[#121212] border border-[#F5F5F5] p-[2em] space-y-[2em]">
            <h2
              className="text-[#F5F5F5] text-[clamp(1.2rem,3vw,2rem)] font-bold leading-tight"
              style={{ fontFamily: 'TT Autonomous Trial Variable' }}
            >
              Контакти
            </h2>
              <ContactItem
                title="Менеджер"
                value="+380 12 345 67 89"
                icon={documentIcon}
              />
              <div className="border-b border-white opacity-50"></div>
              <ContactItem
                title="Куратор"
                value="+380 98 765 43 21"
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
};

export default Cabinet;
