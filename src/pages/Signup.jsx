import React from "react";
import { Button } from "@/components/ui/button";
function Signup() {
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md m-auto mt-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Create an account to get started!
      </h1>
      <p className="text-gray-500 text-center mt-2">Sign Up now!!!!!!</p>
      <form className="mt-6 w-full max-w-sm">
        <label className="flex text-gray-700 font-medium flex-start">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
        />
        {/* <label className="flex text-gray-700 font-medium flex-start">
          Organisation
        </label>
        <input
          type="text"
          placeholder="Your Organisation"
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
        /> */}
        <label className="flex text-gray-700 font-medium flex-start">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
        />
        <label className="flex text-gray-700 font-medium flex-start">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your Password"
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
        />
        <Button
          type="submit"
          className="w-full bg-blue-950 text-white py-3 rounded-lg transition"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}
export default Signup;
