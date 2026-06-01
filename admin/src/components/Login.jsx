import React, { useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { MdEmail, MdLock } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        {/* Logo/Image */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-3xl font-bold tracking-tighter text-gray-800 uppercase">ELITE WEAR<span className="text-pink-500">.</span></p>
          <p className="text-[12px] text-pink-500 font-medium tracking-widest -mt-1 uppercase">Admin Panel</p>
        </div>

        <form onSubmit={onSubmitHandler}>
          {/* Email Field */}
          <div className="mb-3 min-w-72">
            <p className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdEmail className="mr-2 text-gray-600 text-lg" /> Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="your@email.com"
              required
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 min-w-72">
            <p className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdLock className="mr-2 text-gray-600 text-lg" /> Password
            </p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="enter your password"
              required
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer"
          >
            <FiLogIn className="text-lg" /> Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
