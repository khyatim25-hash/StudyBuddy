import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

/* ---------------- LOGIN PAGE ---------------- */

function Login() {

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login system will be connected after database setup.");
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <select>
          <option value="owner">Organization Owner</option>
          <option value="educator">Educator</option>
          <option value="student">Student</option>
        </select>

        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />

        <button type="submit">Login</button>

      </form>

      <p className="options">

        New Organization?

        <Link to="/create-org"> Create Organization </Link>

        |

        <Link to="/user-signup"> Sign Up </Link>

      </p>

    </div>
  );
}


/* ------------ CREATE ORGANIZATION PAGE ------------ */

function CreateOrganization() {

  const handleCreate = (e) => {
    e.preventDefault();
    alert("Organization will be created and code generated after backend setup.");
  };

  return (

    <div className="container">

      <h2>Create Organization</h2>

      <form onSubmit={handleCreate}>

        <input type="text" placeholder="Owner Name" required />

        <input type="email" placeholder="Owner Email" required />

        <input type="password" placeholder="Create Password" required />

        <input type="text" placeholder="Organization Name" required />

        <button>Create Organization</button>

      </form>

      <p>
        <Link to="/">Back to Login</Link>
      </p>

    </div>

  );
}


/* ------------ STUDENT / EDUCATOR SIGNUP ------------ */

function UserSignup() {

  const handleSignup = (e) => {
    e.preventDefault();
    alert("User will be registered after backend connection.");
  };

  return (

    <div className="container">

      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>

        <select required>
          <option value="">Select Role</option>
          <option value="educator">Educator</option>
          <option value="student">Student</option>
        </select>

        <input type="text" placeholder="Full Name" required />

        <input type="email" placeholder="Email" required />

        <input type="password" placeholder="Create Password" required />

        <input type="text" placeholder="Organization Code" required />

        <input type="text" placeholder="Class" required />

        <select required>
          <option value="">Stream</option>
          <option value="PCM">PCM</option>
          <option value="PCB">PCB</option>
        </select>

        <button>Sign Up</button>

      </form>

      <p>
        <Link to="/">Back to Login</Link>
      </p>

    </div>

  );
}


/* ---------------- MAIN APP ---------------- */

export default function App() {

  const [darkMode, setDarkMode] = useState(false);

  const toggleMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  return (

    <Router>

      <div>

        <div className="navbar">

          <div className="logo">
            <img src="/logo.png" alt="Logo" height="45" />
          </div>

          <div className="focus-toggle">
            <span>Dark Mode</span>
            <button onClick={toggleMode}>
              {darkMode ? "On" : "Off"}
            </button>
          </div>

        </div>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/create-org" element={<CreateOrganization />} />

          <Route path="/user-signup" element={<UserSignup />} />

        </Routes>

      </div>

    </Router>

  );

}
