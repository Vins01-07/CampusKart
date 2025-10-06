import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [college, setCollege] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Show success/error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!college) {
      alert("Please select your college");
      return;
    }

    try {
      // Call backend API with proper DB field names
      const res = await axios.post("http://localhost:8081/api/login", {
        mail_id: email,
        pass: password,
        college_name: college,
      });

      // Successful login
      setMessage(res.data.message);

      // Store user info in localStorage
      localStorage.setItem("userData", JSON.stringify(res.data.user));

      // Dispatch login event so Navbar updates immediately
      window.dispatchEvent(new Event('login'));

      // Redirect after short delay
      setTimeout(() => navigate("/home"), 1000);

    } catch (err) {
      // Show backend error or generic message
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">CampusKart Login</h2>
        <form onSubmit={handleLogin}>
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

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "10px",
              color: message.includes("successful") ? "green" : "red",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

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
