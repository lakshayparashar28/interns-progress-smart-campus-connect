import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:5000/api/login", { email, password }, { withCredentials: true });
      navigate("/home");
    } catch (err) {
      alert("Invalid Information");
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f4ff", padding: 20, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ 
          maxWidth: 400, 
          width: "100%", 
          padding: 20, 
          border: "1px solid #ddd", 
          borderRadius: 5, 
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
          backgroundColor: "#ffffff" 
        }}>
        <h2 style={{ color: "#4A54F1", textAlign: "center" }}>Login</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: "10px", borderRadius: 5, border: "1px solid #ddd" }} 
          />
          <input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: "10px", borderRadius: 5, border: "1px solid #ddd" }} 
          />
          <button 
            onClick={handleLogin} 
            style={{
              padding: "10px",
              backgroundColor: "#4A54F1",
              color: "#ffffff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <p style={{ margin: 0 }}>Don't have an account?</p>
          <button 
            onClick={() => navigate("/register")} 
            style={{
              background: "none",
              border: "none",
              color: "#4A54F1",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
