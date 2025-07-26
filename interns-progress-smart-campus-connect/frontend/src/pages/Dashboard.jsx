import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [listings, setListings] = useState([]);
  const handleDelete = () => {};
  const navigate = useNavigate();

  return (
    <div style={{ height: "100vh", backgroundColor: "#f0f4ff" }}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#4A54F1",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Campus Connect
        </div>
        <div>
          <button
            onClick={() => navigate("/login")}
            style={{
              margin: "0 10px",
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/contact")}
            style={{
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Contact Us
          </button>
        </div>
      </nav>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "120px",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "280px",
            width: "400px",
            backgroundColor: "#f0f4ff",
            border: "2px solid blue",
            borderRadius: "10px",
            opacity: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#4A54F1" }}>
            Welcome to Campus Connect
          </h2>
          <h3 style={{ textAlign: "center", color: "#4A54F1" }}>
            Student own Marketplace
          </h3>

          {/* Login and Signup Options */}
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                margin: "0 10px",
                padding: "10px 20px",
                backgroundColor: "#4A54F1",
                color: "#ffffff",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{
                margin: "0 10px",
                padding: "10px 20px",
                backgroundColor: "#4A54F1",
                color: "#ffffff",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "20px auto" }}>
        {listings.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              margin: 10,
              padding: 10,
              borderRadius: 5,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ color: "#4A54F1" }}>{item.title}</h3>
            <p>{item.description}</p>
            <p>
              <strong>Price: ₹{item.price}</strong>
            </p>
            <p>Status: {item.status}</p>
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                backgroundColor: "#ff4d4d",
                color: "#ffffff",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                padding: "5px 10px",
              }}
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
