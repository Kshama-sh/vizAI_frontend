import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.BACKEND_URL;
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://192.168.94.112:8000/users/signup",
        data
      );
      alert("Signup successful!");
      navigate("/Login");
    } catch (error) {
      alert(
        "Signup failed! " + (error.response?.data?.message || "Try again.")
      );
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md m-auto mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Create an account to get started!
        </h1>
        <p className="text-gray-500 text-center mt-2">Sign Up now!!!!!!</p>

        <form
          className="mt-6 w-full max-w-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="flex text-gray-700 font-medium flex-start">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your Name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* <label className="flex text-gray-700 font-medium flex-start">
          Organisation
        </label>
        <input
          type="text"
          placeholder="Your Organisation"
          {...register("tenant_id", {
            required: "Organisation is required",
          })}
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
        />
        {errors.organisation && (
          <p className="text-red-500">{errors.organisation.message}</p>
        )} */}

          <label className="flex text-gray-700 font-medium flex-start">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your Email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <label className="flex text-gray-700 font-medium flex-start">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your Password"
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#230C33] text-white py-3 rounded-lg transition"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
export default Signup;
