import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function YourOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/yourorders", { withCredentials: true })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err.response?.data || err.message);
        alert("Failed to load orders.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f4ff", paddingTop: "80px" }}>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#4A54F1", marginBottom: "20px" }}>
          Your Orders
        </h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
            You haven't placed any orders yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <h3 style={{ color: "#4A54F1" }}>{order.post_title}</h3>
                <p><strong>Price:</strong> ₹{order.post_price}</p>
                <p><strong>Delivered To:</strong> {order.name}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                {order.message && <p><strong>Message:</strong> {order.message}</p>}
                <p style={{ fontSize: "12px", color: "#777", marginTop: "10px" }}>
                  Ordered at: {order.timestamp}
                </p>
                {order.post_image && (
                  <img
                    src={`http://localhost:5000/static/uploads/${order.post_image}`}
                    alt={order.post_title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default YourOrders;
