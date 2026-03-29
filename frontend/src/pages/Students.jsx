import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

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
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ name, email })
    });

    setName("");
    setEmail("");
    fetchStudents();
  };

  const [query, setQuery] = useState("");
const [result, setResult] = useState([]);

const runQuery = async () => {
  if (!query) return;

  const res = await fetch("http://127.0.0.1:8000/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  setResult(data);
};

  const deleteStudent = async (id) => {
    await fetch(`http://127.0.0.1:8000/students/${id}`, { method: "DELETE" });
    fetchStudents();
  };

  const updateStudent = async (id) => {
    await fetch(`http://127.0.0.1:8000/students/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ name, email })
    });

    setEditId(null);
    setName("");
    setEmail("");
    fetchStudents();
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
        Students Dashboard
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
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} style={inputStyle}/>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} style={inputStyle}/>

        <button style={{background:"#F97316",color:"white",padding:"10px",border:"none",borderRadius:"6px"}} onClick={addStudent}>
          Add Student
        </button>
      </div>

      {/* QUERY BOX */}
<div style={{
  color: "white",
  background:"#FFF",
  padding:"20px",
  borderRadius:"12px",
  marginBottom:"20px"
}}>
  <h3 style={{color:"#F97316", marginBottom:"10px"}}>Run SQL Query</h3>

  <textarea
    placeholder="Write your SQL query here..."
    value={query}
    onChange={(e)=>setQuery(e.target.value)}
    style={{
      width:"100%",
      height:"80px",
      padding:"10px",
      border:"1px solid #E2E8F0",
      borderRadius:"6px",
      color:"white"
    }}
  />

  <button
    style={{
      marginTop:"10px",
      background:"#F97316",
      color:"white",
      padding:"10px",
      border:"none",
      borderRadius:"6px"
    }}
    onClick={runQuery}
  >
    Run Query
  </button>

  {/* RESULT */}
  <div style={{marginTop:"10px"}}>
    {Array.isArray(result) ? (
      result.map((row, i) => (
        <div key={i} style={{
          background:"black",
          padding:"8px",
          marginTop:"5px",
          borderRadius:"6px"
        }}>
          {JSON.stringify(row)}
        </div>
      ))
    ) : (
      <div>{JSON.stringify(result)}</div>
    )}
  </div>
</div>

      {/* LIST */}
      {students.map(s => (
        <div key={s.student_id} style={{
          background:"#FFF",
          padding:"15px",
          marginBottom:"10px",
          borderRadius:"10px",
          border:"1px solid #E2E8F0",
          display:"flex",
          justifyContent:"space-between"
        }}>
          {editId === s.student_id ? (
            <>
              <input value={name} onChange={(e)=>setName(e.target.value)} style={inputStyle}/>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} style={inputStyle}/>
            </>
          ) : (
            <span>
              <b style={{color:"#F97316"}}>{s.name}</b> — {s.email}
            </span>
          )}

          <div style={{display:"flex", gap:"8px"}}>
            {editId === s.student_id ? (
              <button onClick={()=>updateStudent(s.student_id)}>Save</button>
            ) : (
              <button onClick={()=>{
                setEditId(s.student_id);
                setName(s.name);
                setEmail(s.email);
              }}>Edit</button>
            )}

            <button style={{background:"#EF4444",color:"white"}} onClick={()=>deleteStudent(s.student_id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Students;