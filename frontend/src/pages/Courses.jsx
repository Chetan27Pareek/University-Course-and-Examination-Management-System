import { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");

  const fetchCourses = async () => {
    const res = await fetch("http://127.0.0.1:8000/courses");
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async () => {
    if (!name || !credits) return;

    await fetch("http://127.0.0.1:8000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        course_name: name,
        credits: parseInt(credits)
      })
    });

    setName("");
    setCredits("");
    fetchCourses();
  };

  const deleteCourse = async (id) => {
    await fetch(`http://127.0.0.1:8000/courses/${id}`, {
      method: "DELETE"
    });
    fetchCourses();
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    background: "#FFFFFF",
    color: "#1E293B"
  };

  return (
    <div style={{
      background:"#F8FAFC",
      minHeight:"100vh",
      padding:"30px"
    }}>
      <h2 style={{ color: "#F97316", marginBottom:"20px" }}>
        Courses Dashboard
      </h2>

      {/* ADD COURSE */}
      <div style={{
        background:"#FFFFFF",
        padding:"20px",
        borderRadius:"12px",
        marginBottom:"20px",
        display:"flex",
        gap:"10px"
      }}>
        <input
          placeholder="Course Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Credits"
          value={credits}
          onChange={(e)=>setCredits(e.target.value)}
          style={inputStyle}
        />

        <button
          style={{
            background:"#F97316",
            color:"white",
            padding:"10px",
            border:"none",
            borderRadius:"6px"
          }}
          onClick={addCourse}
        >
          Add Course
        </button>
      </div>

      {/* LIST */}
      {courses.map(c => (
        <div key={c.id} style={{
          background:"#FFFFFF",
          padding:"15px",
          marginBottom:"10px",
          borderRadius:"10px",
          border:"1px solid #E2E8F0",
          display:"flex",
          justifyContent:"space-between"
        }}>
          <span>
            <b style={{color:"#F97316"}}>{c.title}</b> — {c.credits} credits
          </span>

          <button
            style={{
              background:"#EF4444",
              color:"white",
              border:"none",
              padding:"6px 10px",
              borderRadius:"6px"
            }}
            onClick={()=>deleteCourse(c.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Courses;