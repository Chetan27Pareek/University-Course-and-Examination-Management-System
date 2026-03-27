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
      <Link style={{ color: "#64748B" }} to="/courses">
        Courses
      </Link>
    </div>
  );
}

export default Navbar;