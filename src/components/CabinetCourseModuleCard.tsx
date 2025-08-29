import React from "react";

interface Module {
  id: number;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  status: "completed" | "continue" | "start";
}

interface ModuleCardProps {
  module: Module;
  courseIndex: number;
  moduleIndex: number;
}

const getButtonStyle = (status: string) => {
  const baseStyle = {
    width: "112px",
    height: "33px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    position: "relative" as const,
    clipPath: "polygon(13px 0, 100% 0, 88% 100%, 0 100%)"
  };

  if (status === "completed") {
    return {
      ...baseStyle,
      background: "linear-gradient(0deg, #1951F3 -149.25%, #676E84 461.19%)",
      color: "#EFF0F2",
      border: "none"
    };
  } else if (status === "start") {
    return {
      ...baseStyle,
      background: "#F5F5F5",
      color: "#121212",
      border: "1px solid white"
    };
  } else {
    return {
      ...baseStyle,
      background: "transparent",
      color: "#EFF0F2",
      border: "1px solid white"
    };
  }
};

const getButtonText = (status: string) => {
  if (status === "completed") return "Завершено";
  if (status === "start") return "Розпочати";
  return "Продовжити";
};

const getProgressBarFill = (progress: number) => {
  if (progress === 100) {
    return "linear-gradient(0deg, #1951F3 -149.25%, #676E84 461.19%)";
  } else if (progress > 0) {
    return "linear-gradient(0deg, #1951F3 -149.25%, #676E84 461.19%)";
  }
  return "#414141";
};

const ModuleCard: React.FC<ModuleCardProps> = ({ module, courseIndex, moduleIndex }) => {
  return (
    <div style={{ position: "relative" }}>
      {/* Название модуля */}
      <h3 style={{
        fontFamily: "'TT Autonomous', sans-serif",
        fontSize: "24px",
        fontWeight: "700",
        color: "#F5F5F5",
        margin: "0 0 10px 0"
      }}>
        {module.title}
      </h3>

      {/* Превьюшка */}
      <div style={{
        width: "279px",
        height: "163px",
        background: "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
        border: "1px solid #F5F5F5",
        marginBottom: "20px",
        clipPath: courseIndex === 0 && moduleIndex === 2
          ? "polygon(88% 0, 100% 32%, 100% 100%, 14% 100%, 0 68%, 0 0)"
          : courseIndex === 0 && (moduleIndex === 0 || moduleIndex === 1 || moduleIndex === 3)
          ? "polygon(0 28%, 14% 0, 100% 0, 100% 52%, 86% 100%, 0 100%)"
          : "polygon(0 40%, 14% 0, 100% 0, 100% 60%, 86% 100%, 0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          color: "#666",
          fontSize: "12px",
          textAlign: "center",
          zIndex: 1
        }}>
          Зображення модуля
        </div>
      </div>

      {/* Карточка описания + кнопка */}
      <div style={{
        width: "275px",
        border: "1px solid #F5F5F5",
        background: "#121212",
        padding: "12px",
        position: "relative"
      }}>
        <p style={{
          fontFamily: "Inter",
          fontSize: "11px",
          fontWeight: "700",
          color: "#F5F5F5",
          margin: "0",
          lineHeight: "10px",
          width: "100px"
        }}>
          {module.description}
        </p>
        <div style={{
          marginLeft: "140px",
          ...getButtonStyle(module.status)
        }}>
          {getButtonText(module.status)}
        </div>
      </div>

      {/* Прогресс бар */}
      <div style={{
        width: "188px",
        height: "9px",
        background: "#414141",
        marginTop: "10px",
        position: "relative"
      }}>
        <div style={{
          width: `${module.progress * 1.88}px`,
          height: "9px",
          background: getProgressBarFill(module.progress),
          position: "absolute",
          top: 0,
          left: 0
        }}></div>
        <span style={{
          position: "absolute",
          right: "-40px",
          top: "0",
          fontFamily: "'TT Autonomous', sans-serif",
          fontSize: "10px",
          fontWeight: "700",
          color: "#F5F5F5",
          letterSpacing: "2px"
        }}>
          {module.progress}%
        </span>
      </div>
    </div>
  );
};

export default ModuleCard;
