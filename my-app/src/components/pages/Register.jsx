import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios to call backend
import "./register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Show backend response
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !college || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Send data to backend with updated property names
      const res = await axios.post("http://localhost:8081/api/register", {
        full_name: name,        // maps to DB column full_name
        mail_id: email,         // maps to DB column mail_id
        pass: password,         // maps to DB column pass
        college_name: college,  // maps to DB column college_name
      });

      // Display success message
      setMessage(res.data.message);

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      // Show backend error or generic message
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

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
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Sign Up
          </button>
        </form>

        {/* Show backend success/error message */}
        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: message.includes("successful") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        <p className="login-link">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#c77dff" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
