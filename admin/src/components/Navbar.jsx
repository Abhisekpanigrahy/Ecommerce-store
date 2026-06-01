import React from "react";
import { assets } from "../assets/assets";
import { FiLogOut } from "react-icons/fi"; // logout icon

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <div className="flex flex-col">
        <p className="text-xl font-bold tracking-tighter text-gray-800 uppercase">ELITE WEAR<span className="text-pink-500">.</span></p>
        <p className="text-[10px] text-pink-500 font-medium tracking-widest -mt-1 uppercase text-center">Admin Panel</p>
      </div>

      <button
        onClick={() => setToken("")}
        className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm  hover:bg-gray-700 transition cursor-pointer"
      >
        <FiLogOut className="text-lg" /> {/* Icon */}
        Logout
      </button>
    </div>
  );
};

export default Navbar;
