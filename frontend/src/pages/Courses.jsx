import { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [editId, setEditId] = useState(null);

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
      headers: {"Content-Type": "application/json"},
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
    await fetch(`http://127.0.0.1:8000/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  const updateCourse = async (id) => {
    await fetch(`http://127.0.0.1:8000/courses/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        course_name: name,
        credits: parseInt(credits)
      })
    });

    setEditId(null);
    setName("");
    setCredits("");
    fetchCourses();
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    background: "#FFF",
    color: "#1E293B"
  };

  return (
    <div style={{ background:"#F8FAFC", minHeight:"100vh", padding:"30px" }}>
      <h2 style={{ color:"#F97316" }}>Courses Dashboard</h2>

      <div style={{ background:"#FFF", padding:"20px", borderRadius:"12px", marginBottom:"20px", display:"flex", gap:"10px" }}>
        <input placeholder="Course Name" value={name} onChange={(e)=>setName(e.target.value)} style={inputStyle}/>
        <input placeholder="Credits" value={credits} onChange={(e)=>setCredits(e.target.value)} style={inputStyle}/>
        <button onClick={addCourse} style={{background:"#F97316",color:"white"}}>Add</button>
      </div>

      {courses.map(c => (
        <div key={c.id} style={{ background:"#FFF", padding:"15px", marginBottom:"10px", borderRadius:"10px", display:"flex", justifyContent:"space-between" }}>
          
          {editId === c.id ? (
            <>
              <input value={name} onChange={(e)=>setName(e.target.value)} style={inputStyle}/>
              <input value={credits} onChange={(e)=>setCredits(e.target.value)} style={inputStyle}/>
            </>
          ) : (
            <span><b style={{color:"#F97316"}}>{c.title}</b> — {c.credits}</span>
          )}

          <div>
            {editId === c.id ? (
              <button onClick={()=>updateCourse(c.id)}>Save</button>
            ) : (
              <button onClick={()=>{
                setEditId(c.id);
                setName(c.title);
                setCredits(c.credits);
              }}>Edit</button>
            )}

            <button onClick={()=>deleteCourse(c.id)} style={{background:"#EF4444",color:"white"}}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Courses;