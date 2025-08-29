import React from "react";

interface AvatarWithFrameProps {
  src: string;
  alt?: string;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({ src, alt }) => {
  return (
    <div className="w-[20vmin] h-[20vmin] min-w-[8rem] min-h-[8rem] max-w-[12rem] max-h-[12rem] relative">
      {/* SVG рамка */}
      <svg
        className="w-full h-full absolute inset-0 z-0"
        viewBox="0 0 181 182"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.659 1L1 20V105L20.659 124V181H158.272L180 160V58.2034L158.272 37.2034V1H20.659Z"
          fill="#272525ff"
          stroke="white"
        />
      </svg>

      {/* Аватарка */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img
          src={src}
          alt={alt || "Avatar"}
          className="w-[75%] h-[75%] rounded-full object-cover"
        />
      </div>
    </div>
  );
};
