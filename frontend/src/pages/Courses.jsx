import { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div style={{
      background:"#F8FAFC",
      minHeight:"100vh",
      padding:"30px",
      fontFamily:"sans-serif"
    }}>
      <h2 style={{ color: "#F97316", marginBottom:"20px" }}>
        Courses
      </h2>

      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        courses.map(c => (
          <div key={c.course_id} style={{
            background:"#FFFFFF",
            padding:"15px",
            marginBottom:"10px",
            borderRadius:"10px",
            border:"1px solid #E2E8F0"
          }}>
            <b style={{color:"#F97316"}}>{c.course_name}</b> — {c.credits} credits
          </div>
        ))
      )}
    </div>
  );
}

export default Courses;