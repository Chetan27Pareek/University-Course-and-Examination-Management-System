import { useEffect, useState } from "react";

function Results() {
  const [displayData, setDisplayData] = useState([]);
  const [rawData, setRawData] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [marks, setMarks] = useState("");
  const [grade, setGrade] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res1 = await fetch("http://127.0.0.1:8000/results");
    const raw = await res1.json();

    const res2 = await fetch("http://127.0.0.1:8000/results/details");
    const display = await res2.json();

    setRawData(raw);
    setDisplayData(display);
  };

  useEffect(() => { fetchData(); }, []);

  const add = async () => {
    if (!studentId || !examId || !marks || !grade) return;

    await fetch("http://127.0.0.1:8000/results", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        student_id: parseInt(studentId),
        exam_id: parseInt(examId),
        marks: parseInt(marks),
        grade
      })
    });

    setStudentId("");
    setExamId("");
    setMarks("");
    setGrade("");
    fetchData();
  };

  const update = async (id) => {
    if (!studentId || !examId || !marks || !grade) return;

    await fetch(`http://127.0.0.1:8000/results/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        student_id: parseInt(studentId),
        exam_id: parseInt(examId),
        marks: parseInt(marks),
        grade
      })
    });

    setEditId(null);
    setStudentId("");
    setExamId("");
    setMarks("");
    setGrade("");
    fetchData();
  };

  const del = async (id) => {
    await fetch(`http://127.0.0.1:8000/results/${id}`, {
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
        Results Dashboard
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
        <input placeholder="Student ID" value={studentId} onChange={(e)=>setStudentId(e.target.value)} style={inputStyle}/>
        <input placeholder="Exam ID" value={examId} onChange={(e)=>setExamId(e.target.value)} style={inputStyle}/>
        <input placeholder="Marks" value={marks} onChange={(e)=>setMarks(e.target.value)} style={inputStyle}/>
        <input placeholder="Grade" value={grade} onChange={(e)=>setGrade(e.target.value)} style={inputStyle}/>

        <button style={{background:"#F97316",color:"white"}} onClick={add}>
          Add
        </button>
      </div>

      {/* LIST */}
      {displayData.map((r, i) => {
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
                <input value={examId} onChange={(e)=>setExamId(e.target.value)} style={inputStyle}/>
                <input value={marks} onChange={(e)=>setMarks(e.target.value)} style={inputStyle}/>
                <input value={grade} onChange={(e)=>setGrade(e.target.value)} style={inputStyle}/>
              </>
            ) : (
              <div style={{ marginTop: "4px", color: "#64748B", fontSize: "14px" }}>
                <b style={{color:"#F97316"}}>{r.student_name}</b> → {r.course_name}
                <div>Marks: {r.marks} | Grade: {r.grade}</div>
              </div>
            )}

            <div style={{display:"flex", gap:"8px"}}>
              {editId === realId ? (
                <button onClick={()=>update(realId)}>Save</button>
              ) : (
                <button onClick={()=>{
                  setEditId(realId);
                  setStudentId(rawData[i].student_id);
                  setExamId(rawData[i].exam_id);
                  setMarks(rawData[i].marks);
                  setGrade(rawData[i].grade);
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

export default Results;