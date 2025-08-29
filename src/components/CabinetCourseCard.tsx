import React from "react";
import ModuleCard from "./CabinetCourseModuleCard.tsx";

interface Module {
  id: number;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  status: "completed" | "continue" | "start";
}

interface Course {
  id: number;
  title: string;
  modules: Module[];
}

interface CourseCardProps {
  course: Course;
  courseIndex: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, courseIndex }) => {
  return (
    <div style={{ marginBottom: "100px" }}>
      {/* Заголовок */}
      <div style={{
        position: "relative",
        marginBottom: "50px",
        marginLeft: "30px",
        display: "flex",
        alignItems: "center"
      }}>
        <div style={{
          border: "1px solid #BBBCC1",
          clipPath: "polygon(0 0, calc(100% - 11px) 0, 100% 100%, 0 100%)",
          padding: "8px 20px",
          minWidth: "220px"
        }}>
          <span style={{
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "600",
            color: "#EFF0F2",
            textAlign: "center",
            display: "block"
          }}>
            {course.title}
          </span>
        </div>
        <div style={{
          marginLeft: "auto",
          marginRight: "50px",
          background: "#153182",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 75%, 95% 100%, 0 100%)",
          padding: "10px 20px",
          minWidth: "155px"
        }}>
          <span style={{
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "600",
            color: "#F5F5F5",
            textAlign: "center",
            display: "block"
          }}>
            Матеріали до робіт
          </span>
        </div>
      </div>

      {/* Сетка модулей */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "50px",
        marginLeft: "30px",
        marginRight: "100px"
      }}>
        {course.modules.map((module, moduleIndex) => (
          <ModuleCard
            key={module.id}
            module={module}
            courseIndex={courseIndex}
            moduleIndex={moduleIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseCard;
