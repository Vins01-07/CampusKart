import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [college, setCollege] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (!storedData) {
      alert("No registered user found. Please register first.");
      return;
    }

    if (!college) {
      alert("Please select your college");
      return;
    }

    // Simulated login validation
    if (
      email.endsWith("@vcet.edu.in") &&
      email === storedData.email &&
      password === storedData.password
    ) {
      console.log("Login successful", { college: storedData.college, email });
      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      
      {/* Login card stays on top of background */}
      <div className="login-card">
        <h2 className="login-title">CampusKart Login</h2>
        <form onSubmit={handleLogin}>
          
          {/* College Dropdown */}
          <div className="input-group">
            <label>Select College</label>
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            >
              <option value="">-- Select College --</option>
              <option value="VCET">VCET</option>
              <option value="TSEC">TSEC</option>
              <option value="VJTI">VJTI</option>
              <option value="SPIT">SPIT</option>
            </select>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>College Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Sign up link */}
        <p className="register-link">
          Don’t have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#c77dff", fontWeight: "600" }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
