import { useNavigate } from "react-router-dom";

function ContactUs() {
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
            onClick={() => navigate("/")}
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

      {/* Contact Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 70px)",
        }}
      >
        <div
          style={{
            height: "300px",
            width: "400px",
            backgroundColor: "#ffffff",
            border: "2px solid #4A54F1",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#4A54F1" }}>
            IBS INTERNS
          </h2>
          <p style={{ textAlign: "center", color: "#444", marginTop: "10px" }}>
            Impressico Business Solutions
          </p>
          <p style={{ textAlign: "center", margin: "8px 0" }}>
            C-1, Sector 7, Noida, UP 201301, INDIA
          </p>
          <p style={{ textAlign: "center", margin: "8px 0" }}>
            Phone: +91-120-419 0000
          </p>
          <p style={{ textAlign: "center", margin: "8px 0" }}>
            Website:{" "}
            <a
              href="http://www.impressico.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#4A54F1", textDecoration: "none" }}
            >
              www.impressico.com
            </a>
          </p>
          <h3 style={{ textAlign: "center", color: "#4A54F1" }}>
            THANKYOU FOR VISITING!
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
