import React, { useState, useEffect } from "react";

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Введіть ключове слово",
  pageTitle
}) => {
  const [internalSearch, setInternalSearch] = useState("");
  const [user, setUser] = useState<{ name: string; avatar: string }>({
    name: "",
    avatar: ""
  });

  // используем внешнее значение поиска если есть, иначе внутреннее
  const search = searchValue !== undefined ? searchValue : internalSearch;
  const setSearch = onSearchChange || setInternalSearch;

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name || "Гость",
        avatar: parsed.avatar || "/Logo.svg"
      });
    }
  }, []);

  return (
    <header className="fixed top-0 left-20 right-0 h-[92px] flex items-center justify-between pl-40 px-8 z-[1001]">
      {/* ПОИСК */}
      <div className="flex items-center gap-4">
        <div
          className="relative w-[505px] h-[60px] bg-cabinet-light-gray flex items-center px-4"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)"
          }}
        >
          <svg
            className="w-6 h-6 mr-4 text-cabinet-black flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-cabinet-black placeholder-cabinet-black/50 font-inter text-base font-medium tracking-wide focus:outline-none"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="ml-2 p-1 text-cabinet-black/50 hover:text-cabinet-black flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* PAGE TITLE */}
      {pageTitle && (
        <div className="flex-1 flex justify-center">
          <div className="text-cabinet-white font-tt-autonomous text-4xl font-bold tracking-wide">
            {pageTitle}
          </div>
        </div>
      )}

      {/* ПРОФИЛЬ */}
      <div className="flex items-center">
        <div
          className="flex items-center px-5 py-3 h-[54px]"
          style={{
            background:
              "linear-gradient(90deg, #121212 2.94%, #1951F3 108.26%)"
          }}
        >
          <span className="text-cabinet-white font-inter text-base font-medium tracking-wide leading-6 ml-4">
            {user.name}
          </span>
        </div>
        <div className="w-[53px] h-[54px] flex items-center justify-center bg-cabinet-light-gray">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-8 h-8 object-cover rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
