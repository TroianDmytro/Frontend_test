import React from 'react';
import Sidebar from './CabinetSidebar';

interface CabinetPageStubProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const CabinetPageStub: React.FC<CabinetPageStubProps> = ({ title, description, icon }) => {
  const defaultIcon = (
    <svg
      className="w-12 h-12 text-[#F5F5F5]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
      />
    </svg>
  );
  return (
    <div className="cabinet-container bg-[#121212]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="cabinet-main-content bg-[#121212] text-[#F5F5F5]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <div className="text-center space-y-6">
            {/* Icon placeholder */}
            <div className="w-24 h-24 mx-auto bg-[#414141] rounded-full flex items-center justify-center">
              {icon || defaultIcon}
            </div>

            {/* Title */}
            <h1 className="text-[#F5F5F5] font-tt-autonomous text-3xl lg:text-4xl xl:text-5xl font-extrabold">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-[#A1A1A1] font-inter text-lg lg:text-xl max-w-2xl">
                {description}
              </p>
            )}

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center px-6 py-3 border border-[#6E00BB] bg-[#6E00BB] bg-opacity-10">
              <span className="text-[#F5F5F5] font-inter text-sm font-semibold">
                Скоро буде доступно
              </span>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#6E00BB] opacity-60 transform rotate-45"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinetPageStub;
