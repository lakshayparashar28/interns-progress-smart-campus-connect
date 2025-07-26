import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function YourCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/yourcart", { withCredentials: true })
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        console.error("Failed to load cart:", err.response?.data || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (id) => {
    axios
      .post(
        "http://localhost:5000/api/yourcart/remove",
        { post_id: id },
        { withCredentials: true }
      )
      .then(() => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error("Failed to remove from cart:", err.response?.data || err.message);
      });
  };

  const handleCheckout = (itemId) => {
    navigate(`/checkout/${itemId}`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f4ff", paddingTop: "80px" }}>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#4A54F1", marginBottom: "20px" }}>
          Your Cart
        </h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
            Your cart is empty.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ color: "#4A54F1" }}>{item.title}</h3>
                <p>{item.description}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      margin: "10px 0",
                    }}
                  />
                )}

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  Remove from Cart
                </button>

                {/* Checkout Button */}
                <button
                  onClick={() => handleCheckout(item.id)}
                  style={{
                    backgroundColor: "#4A54F1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  Checkout
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default YourCart;
