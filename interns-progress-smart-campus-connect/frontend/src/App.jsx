import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import YourItems from "./pages/YourItems";
import View from "./pages/View";
import YourCart from "./pages/YourCart";
import ContactUs from "./pages/ContactUs";
import Checkout from "./pages/Checkout";
import YourOrders from "./pages/YourOrders";
import ViewMessages from "./pages/ViewMessages";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/logout" element={<Dashboard />} />
      <Route path="/additem" element={<AddItem />} />
      <Route path="/youritems" element={<YourItems />} />
      <Route path="/additem/:id" element={<AddItem />} />
      <Route path="/listing/:id" element={<View />} />
      <Route path="/yourcart" element={<YourCart />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/yourorders" element={<YourOrders />} />
      <Route path="/viewmessages" element={<ViewMessages />} />
      <Route path="/viewmessages/:postId" element={<ViewMessages />} />


    </Routes>
  );
}

export default App;
