import { useEffect, useState } from "react";

function Enrollments() {
  const [displayData, setDisplayData] = useState([]);
  const [rawData, setRawData] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res1 = await fetch("http://127.0.0.1:8000/enrollments");
    const raw = await res1.json();

    const res2 = await fetch("http://127.0.0.1:8000/enrollments/details");
    const display = await res2.json();

    setRawData(raw);
    setDisplayData(display);
  };

  useEffect(() => { fetchData(); }, []);

  const add = async () => {
    if (!studentId || !courseId) return;

    await fetch("http://127.0.0.1:8000/enroll", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        student_id: parseInt(studentId),
        course_id: parseInt(courseId)
      })
    });

    setStudentId("");
    setCourseId("");
    fetchData();
  };

  const update = async (id) => {
    if (!studentId || !courseId) return;

    await fetch(`http://127.0.0.1:8000/enrollments/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        student_id: parseInt(studentId),
        course_id: parseInt(courseId)
      })
    });

    setEditId(null);
    setStudentId("");
    setCourseId("");
    fetchData();
  };

  const del = async (id) => {
    await fetch(`http://127.0.0.1:8000/enrollments/${id}`, {
      method: "DELETE"
    });
    fetchData();
  };

  const inputStyle = {
    padding:"10px",
    border:"1px solid #E2E8F0",
    borderRadius:"6px",
    background:"#FFF",
    color:"#1E293B"
  };

  return (
    <div style={{ background:"#F8FAFC", minHeight:"100vh", padding:"30px" }}>
      <h2 style={{ color:"#F97316", marginBottom:"20px" }}>
        Enrollments Dashboard
      </h2>

      {/* ADD */}
      <div style={{
        background:"#FFF",
        padding:"20px",
        borderRadius:"12px",
        marginBottom:"20px",
        display:"flex",
        gap:"10px"
      }}>
        <input
          placeholder="Student ID"
          value={studentId}
          onChange={(e)=>setStudentId(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Course ID"
          value={courseId}
          onChange={(e)=>setCourseId(e.target.value)}
          style={inputStyle}
        />
        <button style={{background:"#F97316",color:"white"}} onClick={add}>
          Add
        </button>
      </div>

      {/* LIST */}
      {displayData.map((e, i) => {
        const realId = rawData[i]?.id;

        return (
          <div key={realId} style={{
            background:"#FFF",
            padding:"15px",
            marginBottom:"10px",
            borderRadius:"10px",
            border:"1px solid #E2E8F0",
            display:"flex",
            justifyContent:"space-between"
          }}>
            {editId === realId ? (
              <>
                <input value={studentId} onChange={(e)=>setStudentId(e.target.value)} style={inputStyle}/>
                <input value={courseId} onChange={(e)=>setCourseId(e.target.value)} style={inputStyle}/>
              </>
            ) : (
              <span>
                <b style={{color:"#F97316"}}>{e.student_name}</b> → {e.course_name}
              </span>
            )}

            <div style={{display:"flex", gap:"8px"}}>
              {editId === realId ? (
                <button onClick={()=>update(realId)}>Save</button>
              ) : (
                <button onClick={()=>{
                  setEditId(realId);
                  setStudentId(rawData[i].student_id);
                  setCourseId(rawData[i].course_id);
                }}>
                  Edit
                </button>
              )}

              <button style={{background:"#EF4444",color:"white"}} onClick={()=>del(realId)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Enrollments;