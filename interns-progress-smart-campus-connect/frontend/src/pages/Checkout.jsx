import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/listings/${id}`, { withCredentials: true })
      .then((res) => {
        const data = res.data;
        setItem({
          ...data,
          image: data.image
            ? `http://localhost:5000/static/uploads/${data.image}`
            : null,
        });
      })
      .catch((err) => {
        console.error("Failed to load item:", err);
        alert("Item not found");
        navigate("/yourcart");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!buyer.name || !buyer.phone || !buyer.address) {
      alert("Please fill in all required fields.");
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/checkout",
        {
          post_id: id,
          name: buyer.name,
          phone: buyer.phone,
          address: buyer.address,
          message: buyer.message,
        },
        { withCredentials: true }
      )
      .then(() => {
        alert("Message sent to seller. Please wait for their response.");
        setFormSubmitted(true);
      })
      .catch((err) => {
        console.error("Checkout error:", err.response?.data || err.message);
        alert("Failed to send message.");
      });
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>;
  if (!item) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f4ff", paddingTop: "80px" }}>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "40px 20px",
        }}
      >
        {/* LEFT: Item Card */}
        <div
          style={{
            flex: "1 1 350px",
            maxWidth: "450px",
            backgroundColor: "#fff",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#4A54F1", marginBottom: "15px" }}>Item Details</h2>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Rent:</strong> {item.rent || "N/A"}</p>
          <p><strong>Price:</strong> ₹{item.price}</p>

          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
                marginTop: "15px",
              }}
            />
          )}
        </div>

        {/* RIGHT: Buyer Form */}
        <div
          style={{
            flex: "1 1 350px",
            maxWidth: "450px",
            backgroundColor: "#fff",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#4A54F1", marginBottom: "15px" }}>Your Contact Info</h2>
          <form
            onSubmit={handleSendMessage}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={buyer.name}
              onChange={handleChange}
              disabled={formSubmitted}
              required
              style={inputStyle}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={buyer.phone}
              onChange={handleChange}
              disabled={formSubmitted}
              required
              style={inputStyle}
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={buyer.address}
              onChange={handleChange}
              disabled={formSubmitted}
              required
              style={{ ...inputStyle, height: "70px" }}
            />
            <textarea
              name="message"
              placeholder="Optional message to the seller..."
              value={buyer.message}
              onChange={handleChange}
              disabled={formSubmitted}
              style={{ ...inputStyle, height: "70px" }}
            />

            <button
              type="submit"
              disabled={formSubmitted}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "12px",
                backgroundColor: "#4A54F1",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: formSubmitted ? "not-allowed" : "pointer",
                opacity: formSubmitted ? 0.7 : 1,
              }}
            >
              {formSubmitted ? "Message Sent. Await Reply." : "Send Message to Seller"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default Checkout;
