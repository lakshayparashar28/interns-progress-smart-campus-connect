import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ViewMessages() {
  const { postId } = useParams();
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch messages for that item
    axios
      .get(`http://localhost:5000/api/messages-for-youritems/${postId}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load messages:", err));

    // Fetch item details
    axios
      .get(`http://localhost:5000/api/listings/${postId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        const image = data.image
          ? `http://localhost:5000/static/uploads/${data.image}`
          : null;
        setItem({ ...data, image });
      })
      .catch((err) => console.error("Failed to load item:", err));

    // Mark messages as seen
    axios
      .post(
        "http://localhost:5000/api/messages/mark-seen",
        {
          post_id: postId,
        },
        {
          withCredentials: true,
        }
      )
      .catch((err) => console.error("Failed to mark seen:", err));

    setLoading(false);
  }, [postId]);

  return (
    <div
      style={{
        backgroundColor: "#f0f4ff",
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      <Navbar />
      <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        {/* LEFT: Item Info with full image */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            borderRight: "1px solid #ccc",
            backgroundColor: "#ffffff",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              color: "#4A54F1",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Item Preview
          </h2>
          {item ? (
            <div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
              )}
              <h3 style={{ color: "#333" }}>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                <strong>Price:</strong> ₹{item.price}
              </p>
            </div>
          ) : (
            <p>Loading item...</p>
          )}
        </div>

        {/* RIGHT: Messages */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              color: "#4A54F1",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Buyer Messages
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#777" }}>
              No messages received for this item.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "15px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <p>
                    <strong>Name:</strong> {msg.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {msg.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {msg.address}
                  </p>
                  {msg.message && (
                    <p>
                      <strong>Message:</strong> {msg.message}
                    </p>
                  )}
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    <strong>Time:</strong> {msg.timestamp}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewMessages;
