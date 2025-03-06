import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup"; // Ensure the correct path
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
