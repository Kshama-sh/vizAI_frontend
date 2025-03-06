import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle login (To be implemented with backend API)
  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post(" ", {
  //       email,
  //       password,
  //     });
  //     if (response.data.success) {
  //       localStorage.setItem("login", response.data.success);
  //       console.log("Logged in successfully");
  //       navigate("/dashboard"); // Redirect after login
  //     }
  //   } catch (error) {
  //     console.error("Login failed", error);
  //   }
  // };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md m-auto mt-20">
      <h1 className="text-2xl font-bold text-center text-gray-900">
        Unlock a World of AI-Powered Insights!
      </h1>
      <p className="text-gray-500 text-center mt-2">Login to your account</p>

      <form className="mt-6">
        <div>
          <label className="flex text-gray-700 font-medium flex-start">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="flex text-gray-700 font-medium flex-start">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <Button
          type="button"
          // onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg transition"
        >
          Login
        </Button>
      </form>

      <p className="text-center text-gray-500 mt-4">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/Signup")}
          className="text-blue-600 font-medium cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
export default Login;
