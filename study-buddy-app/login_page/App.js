import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

/* -------------------- LOGIN PAGE -------------------- */
function Login() {
  const [role, setRole] = useState("owner");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "owner") {
      navigate("/dashboard");
    } else {
      alert("Dashboard for this role coming soon!");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="owner">Organization Owner</option>
          <option value="educator">Educator</option>
          <option value="student">Student</option>
        </select>

        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <p>
        New Organization? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

/* -------------------- SIGNUP PAGE -------------------- */
function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    alert("Organization Registered (Demo)");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Create Organization</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Owner Name" required />
        <input type="email" placeholder="Owner Email" required />
        <input type="text" placeholder="Organization Name" required />
        <input type="password" placeholder="Create Password" required />
        <button type="submit">Register Organization</button>
      </form>

      <p>
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
}

/* -------------------- DASHBOARD PAGE -------------------- */
function Dashboard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("educator");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  const addMember = (e) => {
    e.preventDefault();
    const newMember = { name, role };
    setMembers([...members, newMember]);
    setName("");
  };

  return (
    <div className="container">
      <h2>Owner Dashboard</h2>

      <h3>Add Member</h3>
      <form onSubmit={addMember}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="educator">Educator</option>
          <option value="student">Student</option>
        </select>

        <button type="submit">Add Member</button>
      </form>

      <h3>Organization Members</h3>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            {member.name} — {member.role}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
}

/* -------------------- MAIN APP -------------------- */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}


