function Dashboard() {
  return (
    <div>
      <h1>University Management System</h1>
      <p>Manage Students, Courses, and Academic Data</p>
    </div>
  );
}

const searchStudent = async () => {
  const res = await fetch(`http://127.0.0.1:8000/students/search/${name}`);
  const data = await res.json();
  setStudents(data);
};

export default Dashboard;