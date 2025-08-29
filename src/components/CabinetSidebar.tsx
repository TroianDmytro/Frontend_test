import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import type { CabinetPageType } from "../contexts/AuthContext";

import HomeIcon from "../assets/Cabinet/icons/home.svg";
import CatalogIcon from "../assets/Cabinet/icons/catalog.svg";
import CalendarIcon from "../assets/Cabinet/icons/calendar.svg";
import BookIcon from "../assets/Cabinet/icons/book.svg";
import AwardIcon from "../assets/Cabinet/icons/achieve.svg";
import ChatIcon from "../assets/Cabinet/icons/chat.svg";
import WalletIcon from "../assets/Cabinet/icons/wallet.svg";
import ProfileIcon from "../assets/Cabinet/icons/gear.svg";

interface MenuItem {
  icon: string;
  id: CabinetPageType;
  label?: string;
}

const menuItems: MenuItem[] = [
  { icon: HomeIcon, id: "home", label: "Головна" },
  { icon: ProfileIcon, id: "profile", label: "Профіль" },
  { icon: CatalogIcon, id: "courses", label: "Курси" },
  { icon: CalendarIcon, id: "calendar", label: "Календар" },
  { icon: BookIcon, id: "books", label: "Уроки" },
  { icon: AwardIcon, id: "achievements", label: "Досягнення" },
  { icon: ChatIcon, id: "chat", label: "Чат" },
  { icon: WalletIcon, id: "wallet", label: "Оплата та підписка" },
];

const Sidebar: React.FC = () => {
  const { activePage, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleItemClick = (pageId: CabinetPageType) => {
    if (pageId === "home") {
      navigate("/cabinet");
    } else {
      navigate(`/cabinet/${pageId}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: isHovered ? "230px" : "80px",
        background: "#1e1e1e",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.35s ease-in-out, background 0.3s ease",
        overflow: "hidden",
        boxShadow: "2px 0 8px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Лого */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 15px",
          transition: "all 0.3s ease",
        }}
      >
        <img src="/Logo.svg" alt="Logo" style={{ width: "40px", height: "40px" }} />
        <span
          style={{
            marginLeft: "12px",
            color: "#f5f5f5",
            fontWeight: "700",
            fontSize: "18px",
            whiteSpace: "nowrap",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          NeuroNest
        </span>
      </div>

      {/* Меню */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flexGrow: 1,
          padding: "10px",
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              border: "none",
              background:
                activePage === item.id ? "rgba(128,128,128,0.3)" : "transparent",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#f5f5f5",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={item.icon}
              alt={item.label}
              style={{
                width: "22px",
                height: "22px",
                filter:
                  activePage === item.id
                    ? "brightness(0) invert(1)"
                    : "brightness(0) invert(0.7)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                marginLeft: "12px",
                whiteSpace: "nowrap",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(-10px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                fontWeight: activePage === item.id ? "600" : "400",
                fontSize: "15px",
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          margin: "10px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#f5f5f5",
          transition: "all 0.3s ease",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            flexShrink: 0,
            filter: "brightness(0) invert(0.7)",
          }}
        >
          <path
            d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
            fill="currentColor"
          />
        </svg>
        <span
          style={{
            marginLeft: "12px",
            whiteSpace: "nowrap",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          Вийти
        </span>
      </button>
    </aside>
  );
};

export default Sidebar;
