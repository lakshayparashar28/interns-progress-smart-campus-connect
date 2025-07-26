import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function AddItem() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    rent: "",
    price: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/listings/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setFormData({
            title: res.data.title,
            description: res.data.description,
            category: res.data.category,
            rent: res.data.rent,
            price: res.data.price,
            image: null,
          });
          if (res.data.image) {
            setImagePreview(`http://localhost:5000/static/uploads/${res.data.image}`);
          }
        })
        .catch((err) => {
          console.error("Failed to load listing:", err);
          alert("Failed to load listing");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        payload.append(key, formData[key]);
      }
    }

    const endpoint = id
      ? `http://localhost:5000/api/listings/${id}`
      : "http://localhost:5000/api/listings";

    const method = id ? axios.put : axios.post;

    method(endpoint, payload, {
      withCredentials: true,
    })
      .then(() => {
        setSuccessMessage(id ? "Item updated successfully!" : "Item added successfully!");
        setTimeout(() => navigate("/youritems"), 1500);
      })
      .catch((err) => {
        console.error("Submission error:", err.response?.data || err.message);
        alert("Something went wrong: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f0f4ff",
        paddingTop: "70px",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <Navbar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, paddingTop: "70px" }}>
        <h2 style={{ textAlign: "center", color: "#4A54F1" }}>
          {id ? "Edit Item" : "Add New Item"}
        </h2>

        {successMessage && (
          <p style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>
            {successMessage}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#777" }}>Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data" // ✅ Added for image upload
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ ...inputStyle, height: 160, resize: "vertical" }}
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option value="textbooks">Textbooks</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="sports">Sports</option>
              <option value="others">Others</option>
            </select>
            <input
              type="number"
              name="rent"
              placeholder="Rent"
              value={formData.rent}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ ...inputStyle, padding: 0 }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginTop: "10px",
                  border: "1px solid #ccc",
                }}
              />
            )}

            <button
              type="submit"
              style={{
                backgroundColor: "#4A54F1",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%",
              }}
            >
              {id ? "Update Item" : "Add Item"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default AddItem;
