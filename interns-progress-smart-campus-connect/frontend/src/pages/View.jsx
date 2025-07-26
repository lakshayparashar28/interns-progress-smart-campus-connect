import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/listings/${id}`, {
        withCredentials: true,
      })
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
        console.error("Error fetching listing:", err);
        alert("Listing not found");
        navigate("/");
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
  if (!item || !item.id) {
    alert("Item not ready yet.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemId = String(item.id); 

  if (cart.includes(itemId)) {
    alert("Item already in cart.");
  } else {
    cart.push(itemId);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  }
  };


  if (!item) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4ff",
        paddingTop: "80px",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#4A54F1" }}>{item.title}</h2>
        <p style={{ color: "#555" }}>{item.description}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Rent:</strong> {item.rent || "N/A"}</p>
        <p><strong>Price:</strong> ₹{item.price}</p>

        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          />
        )}

        <button
          onClick={handleAddToCart}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default View;
