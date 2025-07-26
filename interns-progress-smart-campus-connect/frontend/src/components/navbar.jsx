import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Navbar() {
  const [activeButton, setActiveButton] = useState(null);
  const [unseenCount, setUnseenCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/home")) setActiveButton("home");
    else if (location.pathname.startsWith("/youritems")) setActiveButton("yourItems");
    else if (location.pathname.startsWith("/additem")) setActiveButton("addItem");
    else if (location.pathname.startsWith("/yourcart")) setActiveButton("yourcart");
    else if (location.pathname.startsWith("/yourorders")) setActiveButton("yourorders");
    else setActiveButton(null);
  }, [location.pathname]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/unseen-messages", { withCredentials: true })
      .then(res => setUnseenCount(res.data.count || 0))
      .catch(() => setUnseenCount(0));
  }, [location.pathname]);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    navigate(`/${buttonName}`);
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      alert("Logout failed");
    }
  };

  const buttonStyle = (buttonName) => ({
    margin: "0 10px",
    padding: "8px 16px",
    backgroundColor: activeButton === buttonName ? "rgba(255,255,255,0.3)" : "transparent",
    border: "1px solid #ffffff",
    borderRadius: "6px",
    color: "#ffffff",
    cursor: "pointer"
  });

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      backgroundColor: "#4A54F1",
      color: "#ffffff",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>Campus Connect</div>
      <div>
        <button onClick={() => handleButtonClick("home")} style={buttonStyle("home")}>
          Home
        </button>

        <button onClick={() => handleButtonClick("yourItems")} style={buttonStyle("yourItems")}>
          Your Items
          {unseenCount > 0 && (
            <span style={{
              backgroundColor: "red",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "50%",
              marginLeft: "6px",
              fontSize: "12px"
            }}>
              {unseenCount}
            </span>
          )}
        </button>

        <button onClick={() => handleButtonClick("addItem")} style={buttonStyle("addItem")}>
          Add Item
        </button>

        <button onClick={() => handleButtonClick("yourcart")} style={buttonStyle("yourcart")}>
          Your Cart
        </button>

        <button onClick={() => handleButtonClick("yourorders")} style={buttonStyle("yourorders")}>
          Your Orders
        </button>

        <button onClick={handleLogout} style={buttonStyle("logout")}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
