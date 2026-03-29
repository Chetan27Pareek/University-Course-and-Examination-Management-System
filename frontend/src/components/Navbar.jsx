import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      background: "#FFFFFF",
      padding: "15px 30px",
      borderBottom: "1px solid #E2E8F0",
      display: "flex",
      gap: "20px"
    }}>
      <Link style={{ color: "#F97316", fontWeight: "bold" }} to="/students">
        Students
      </Link>
      <Link style={{ color: "#F97316" }} to="/courses">
        Courses
      </Link>
      <Link style={{ color: "#F97316", fontWeight: "bold" }} to="/enrollments">Enrollments</Link>
      <Link style={{ color: "#F97316", fontWeight: "bold" }} to="/results">Results</Link>
    </div>
  );
}

export default Navbar;