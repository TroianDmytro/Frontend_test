// src/pages/CabinetCalendar.tsx
import React from "react";

const months = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень",
];

const weekdays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

const CabinetHomeCalendar: React.FC = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  // Первый день месяца
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // сдвиг (ПН начало недели)

  // Количество дней в месяце
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Генерация массива дней
  const days: (number | null)[] = Array(startDay).fill(null); // пустые ячейки в начале
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="flex items-start bg-[#153182] text-white p-8 rounded-lg">
      {/* Левая часть - календарь */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">{months[currentMonth]}</h2>
        <div className="grid grid-cols-7 gap-2 text-sm font-semibold mb-2">
          {weekdays.map((day, idx) => (
            <div key={idx} className="text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`h-8 w-8 flex items-center justify-center rounded-full ${
                day === currentDay
                  ? "border-2 border-white font-bold"
                  : day
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Правая часть - число и месяц */}
      <div className="ml-8 flex flex-col items-center justify-center">
        <span className="text-6xl font-extrabold">
          {currentDay.toString().padStart(2, "0")}
        </span>
        <span className="text-6xl font-extrabold">
          {(currentMonth + 1).toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default CabinetHomeCalendar;
