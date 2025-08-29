import React, { useEffect, useState } from "react";
import Header from "../components/CoursesHeader";
import Sidebar from "../components/CabinetSidebar";
import CourseCard from "../components/CabinetCourseCard";

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

const Courses: React.FC = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses") // сюда URL бэка
      .then((res) => res.json())
      .then((data: Course[]) => {
        setCoursesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки курсов:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: "#fff", textAlign: "center" }}>Загрузка...</div>;
  }

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", position: "relative" }}>
      <Sidebar />
      <Header />

      <div style={{ marginLeft: "100px", paddingTop: "120px", paddingRight: "20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontFamily: "'TT Autonomous', sans-serif",
              fontSize: "32px",
              fontWeight: "700",
              color: "#F5F5F5",
            }}
          >
            Доступні курси
          </h1>
        </div>

        {coursesData.map((course, index) => (
          <CourseCard key={course.id} course={course} courseIndex={index} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
