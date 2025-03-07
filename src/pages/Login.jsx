import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post("http://192.168.1.4:8000", data);
      if (res.data.success) {
        localStorage.setItem("login", res.data.success);
        console.log("Logged in successfully");
        navigate("/Console");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md m-auto mt-20">
      <h1 className="text-2xl font-bold text-center text-gray-900">
        Unlock a World of AI-Powered Insights!
      </h1>
      <p className="text-gray-500 text-center mt-2">Login to your account</p>

      <form onSubmit={handleSubmit(handleLogin)} className="mt-6">
        <div>
          <label className="flex text-gray-700 font-medium flex-start">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="flex text-gray-700 font-medium flex-start">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-950 text-white py-3 rounded-lg transition"
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
