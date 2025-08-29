import React from 'react';

interface ProfileStatsProps {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  overallProgress: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalCourses,
  completedCourses,
  inProgressCourses,
  overallProgress
}) => {
  return (
    <div className="bg-[#121212] border border-[#F5F5F5] p-[2em] space-y-[1.5em]">
      <h2
        className="text-[#F5F5F5] text-center text-[clamp(1.2rem,3vw,2rem)] font-bold leading-tight"
        style={{ fontFamily: 'TT Autonomous Trial Variable' }}
      >
        Статистика навчання
      </h2>
      
      <div className="grid grid-cols-2 gap-[2em]">
        <div className="text-center">
          <div 
            className="text-[#1951F3] text-[clamp(2rem,5vw,3rem)] font-bold"
            style={{ fontFamily: 'TT Autonomous Trial Variable' }}
          >
            {totalCourses}
          </div>
          <div 
            className="text-[#F5F5F5] text-[1rem] font-medium"
            style={{ fontFamily: 'Inter' }}
          >
            Всього курсів
          </div>
        </div>
        
        <div className="text-center">
          <div 
            className="text-[#1951F3] text-[clamp(2rem,5vw,3rem)] font-bold"
            style={{ fontFamily: 'TT Autonomous Trial Variable' }}
          >
            {completedCourses}
          </div>
          <div 
            className="text-[#F5F5F5] text-[1rem] font-medium"
            style={{ fontFamily: 'Inter' }}
          >
            Завершено
          </div>
        </div>
        
        <div className="text-center">
          <div 
            className="text-[#1951F3] text-[clamp(2rem,5vw,3rem)] font-bold"
            style={{ fontFamily: 'TT Autonomous Trial Variable' }}
          >
            {inProgressCourses}
          </div>
          <div 
            className="text-[#F5F5F5] text-[1rem] font-medium"
            style={{ fontFamily: 'Inter' }}
          >
            В процессі
          </div>
        </div>
        
        <div className="text-center">
          <div 
            className="text-[#1951F3] text-[clamp(2rem,5vw,3rem)] font-bold"
            style={{ fontFamily: 'TT Autonomous Trial Variable' }}
          >
            {overallProgress}%
          </div>
          <div 
            className="text-[#F5F5F5] text-[1rem] font-medium"
            style={{ fontFamily: 'Inter' }}
          >
            Загальний прогрес
          </div>
        </div>
      </div>
    </div>
  );
};
