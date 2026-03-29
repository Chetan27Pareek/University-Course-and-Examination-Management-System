import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Navbar from "./components/Navbar";
import Enrollments from "./pages/Enrollments";
import Results from "./pages/Results";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/enrollments" element={<Enrollments />} />
        <Route path="/results" element={<Results />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;