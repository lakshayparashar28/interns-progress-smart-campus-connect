import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/home", { withCredentials: true })
      .then(() => {
        axios
          .get("http://localhost:5000/api/listings", { withCredentials: true })
          .then((res) => {
            setListings(res.data);
            setSuggestedItems(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.warn("Not logged in:", err.response?.data || err.message);
        navigate("/login");
      });
  }, []);

  const handleSearch = () => {
    axios
      .get("http://localhost:5000/api/search", {
        params: { q: searchTerm, category },
        withCredentials: true,
      })
      .then((res) => {
        setSuggestedItems(res.data);
        setSearchPerformed(true);
      })
      .catch((err) => {
        console.error("Search failed:", err.response?.data || err.message);
      });
  };

  const handleAddToCart = (itemId) => {
    axios
      .post(
        "http://localhost:5000/api/yourcart/add",
        { post_id: itemId },
        { withCredentials: true }
      )
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.error("Failed to add to cart:", err.response?.data || err.message);
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f0f4ff",
        paddingTop: "80px",
        paddingBottom: "40px",
        boxSizing: "border-box",
        overflowX: "hidden",
        margin: 0,
        padding: 0,
        overflowY: "hidden",
      }}
    >
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
        <h2 style={{ textAlign: "center", color: "#4A54F1", marginTop: "50px" }}>
          Students Marketplace
        </h2>

        {/* Search Feature */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "20px 0",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              padding: "10px",
              borderRadius: 5,
              border: "1px solid #ddd",
              width: "200px",
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: 5,
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Categories</option>
            <option value="textbooks">Textbooks</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="sports">Sports</option>
            <option value="others">Others</option>
          </select>
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4A54F1",
              color: "#ffffff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {/* Section Title */}
        <h3 style={{ textAlign: "center", color: "#4A54F1", margin: "20px 0" }}>
          {searchPerformed ? "Search Results" : "Suggested Items"}
        </h3>

        {/* Listings Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {suggestedItems.length > 0 ? (
            suggestedItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ color: "#4A54F1", marginTop: 0 }}>{item.title}</h3>
                  <p style={{ color: "#555" }}>{item.description}</p>
                  <p style={{ fontWeight: "bold" }}>Price: ₹{item.price}</p>
                  <p>
                    Status:{" "}
                    <span
                      style={{
                        color: item.status === "available" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status}
                    </span>
                  </p>

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
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={() => navigate(`/listing/${item.id}`)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      backgroundColor: "#4A54F1",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleAddToCart(item.id)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                gridColumn: "1 / -1",
                color: "#555",
                fontSize: "18px",
              }}
            >
              {listings.length > 0
                ? "No items match your search. Try different keywords or categories."
                : "No listings available yet. Be the first to add one!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
