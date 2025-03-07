import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup"; // Ensure the correct path
import Login from "./pages/Login";
import Query from "./pages/Query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/static/Navbar";
import Visualisation from "./pages/Visualisation";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/query" element={<Query />} />
        <Route path="/visualisation" element={<Visualisation />} />
      </Routes>
    </Router>
  );
}

export default App;
