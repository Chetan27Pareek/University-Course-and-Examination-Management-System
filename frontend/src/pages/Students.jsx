import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    const res = await fetch("http://127.0.0.1:8000/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (!name || !email) return;

    await fetch("http://127.0.0.1:8000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email })
    });

    setName("");
    setEmail("");
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await fetch(`http://127.0.0.1:8000/students/${id}`, {
      method: "DELETE"
    });
    fetchStudents();
  };

  const searchStudent = async () => {
    if (!search) return;

    const res = await fetch(`http://127.0.0.1:8000/students/search/${search}`);
    const data = await res.json();
    setStudents(data);
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    flex: 1,
    background: "#FFFFFF",
    color: "#1E293B",
    outline: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{
      background: "#F8FAFC",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ color: "#F97316", marginBottom: "20px" }}>
        Students Dashboard
      </h2>

      {/* ADD */}
      <div style={{
        background: "#FFFFFF",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        gap: "10px"
      }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={inputStyle}
        />

        <button
          style={{
            background:"#F97316",
            color:"white",
            padding:"10px 15px",
            border:"none",
            borderRadius:"6px",
            cursor:"pointer"
          }}
          onClick={addStudent}
        >
          Add Student
        </button>
      </div>

      {/* SEARCH */}
      <div style={{
        marginBottom: "20px",
        display: "flex",
        gap: "10px"
      }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={inputStyle}
        />

        <button
          style={{
            background:"#F97316",
            color:"white",
            padding:"10px 15px",
            border:"none",
            borderRadius:"6px"
          }}
          onClick={searchStudent}
        >
          Search
        </button>

        <button
          style={{
            background:"#E2E8F0",
            padding:"10px 15px",
            border:"none",
            borderRadius:"6px"
          }}
          onClick={fetchStudents}
        >
          Reset
        </button>
      </div>

      {/* LIST */}
      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        students.map((s) => (
          <div key={s.student_id} style={{
            background:"#FFFFFF",
            padding:"15px",
            marginBottom:"10px",
            borderRadius:"10px",
            border:"1px solid #E2E8F0",
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}>
            <span>
              <b style={{color:"#F97316"}}>{s.name}</b> — {s.email}
            </span>

            <button
              style={{
                background:"#EF4444",
                color:"white",
                border:"none",
                padding:"6px 10px",
                borderRadius:"6px",
                cursor:"pointer"
              }}
              onClick={()=>deleteStudent(s.student_id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Students;