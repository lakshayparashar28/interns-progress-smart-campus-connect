import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(""); // Reset error message

    // Check for empty fields
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Set loading state
    try {
      const response = await axios.post("http://localhost:5000/api/register", { name, email, password, confirmPassword });
      alert(response.data.message); // Show success message
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already registered");
      } 
      else {
        setError("Registration failed, Try in some time");
      }
    } finally {
      setLoading(false); // Reset loading state
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
        <h2 style={{ color: "#4A54F1", textAlign: "center" }}>Register</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>} {/* Display error message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ padding: "10px", borderRadius: 5, border: "1px solid #ddd" }} 
            required
          />
          <input 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: "10px", borderRadius: 5, border: "1px solid #ddd" }} 
            required
          />
          <input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: "10px", borderRadius: 5, border: "1px solid #ddd" }} 
            required
          />
          <input 
            placeholder="Confirm Password" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            style={{ padding: "10px", borderRadius: 5, border: "1px solid #ddd" }} 
            required
          />
          <button 
            onClick={handleRegister} 
            style={{
              padding: "10px",
              backgroundColor: "#4A54F1",
              color: "#ffffff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              opacity: loading ? 0.6 : 1, // Disable button when loading
              pointerEvents: loading ? "none" : "auto" // Prevent clicks when loading
            }}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <p style={{ margin: 0 }}>Already have an account?</p>
          <button 
            onClick={() => navigate("/login")} 
            style={{
              background: "none",
              border: "none",
              color: "#4A54F1",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
