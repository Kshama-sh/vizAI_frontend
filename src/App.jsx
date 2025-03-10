import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup"; // Ensure the correct path
import Login from "./pages/Login";
import Query from "./pages/Query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/static/Navbar";
import Visualisation from "./pages/Visualisation";
import Console from "./pages/Console";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";

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
        <Route path="/console" element={<Console />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visualisation" element={<Visualisation />} />
        <Route path="/database" element={<Database />} />
      </Routes>
    </Router>
  );
}

export default App;
