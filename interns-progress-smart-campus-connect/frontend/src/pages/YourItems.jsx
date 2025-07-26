import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function YourItems() {
  const [yourItems, setYourItems] = useState([]);
  const [messagesMap, setMessagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/home", { withCredentials: true })
      .then(() => {
        axios.get("http://localhost:5000/api/youritems", { withCredentials: true })
          .then((res) => setYourItems(res.data))
          .catch((err) => console.error("Fetch listings error:", err))
          .finally(() => setLoading(false));

        axios.get("http://localhost:5000/api/messages-for-youritems", { withCredentials: true })
          .then((res) => {
            const map = {};
            res.data.forEach(item => {
              map[item.post_id] = item.messages;
            });
            setMessagesMap(map);
          });
      })
      .catch((err) => {
        console.warn("Not logged in:", err.response?.data || err.message);
        navigate("/login");
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    axios.delete(`http://localhost:5000/api/listings/${id}`, { withCredentials: true })
      .then(() => {
        setYourItems(prev => prev.filter(item => item.id !== id));
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  const handleEdit = (id) => {
    navigate(`/additem/${id}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f0f4ff",
      paddingTop: "80px",
      paddingBottom: "40px"
    }}>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
        <h2 style={{ textAlign: "center", color: "#4A54F1", marginBottom: "20px" }}>
          Your Listed Items
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>Loading...</p>
        ) : yourItems.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            {yourItems.map(item => (
              <div key={item.id} style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{ color: "#4A54F1" }}>{item.title}</h3>
                <p>{item.description}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>

                {item.image && (
                  <img
                    src={`http://localhost:5000/static/uploads/${item.image}`}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      margin: "10px 0"
                    }}
                  />
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEdit(item.id)}
                    style={{
                      flex: 1,
                      backgroundColor: "#4A54F1",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 5,
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      flex: 1,
                      backgroundColor: "#ff4d4d",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 5,
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>

                {messagesMap[item.id] && messagesMap[item.id].length > 0 && (
                  <button
                    onClick={() => navigate(`/viewmessages/${item.id}`)}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      padding: "10px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Buyer Messages ({messagesMap[item.id].length})
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>
            You haven't listed any items yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default YourItems;
