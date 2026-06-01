import { assets } from "./../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const adminUrl = import.meta.env.VITE_ADMIN_URL;

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    userData,
    setUserData,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken("");
    setCartItems({});
    setUserData(null);
    setProfileOpen(false);
  };

  const openSearch = () => {
    navigate("/collection");
    setShowSearch(true);
  };

  const handleProfileClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"} className="flex items-center gap-1">
        <p className="text-2xl font-bold tracking-tighter text-gray-800 uppercase">ELITE WEAR<span className="text-pink-500">.</span></p>
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        {adminUrl && (
          <a
            target="_blank"
            rel="noreferrer"
            href={adminUrl}
            className="flex flex-col items-center gap-1 "
          >
            <span className="border px-5 text-sm py-1 rounded-full -mt-1">
              Admin Panel
            </span>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </a>
        )}
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={openSearch}
          src={assets.search_icon}
          className="w-5 h-5 cursor-pointer object-contain"
          alt="searchIcon"
        />

        <div ref={profileRef} className="relative group">
          <img
            onClick={handleProfileClick}
            src={(token && userData?.image) ? userData.image : assets.profile_icon}
            className={`w-5 h-5 cursor-pointer ${(token && userData?.image) ? 'rounded-full object-cover' : 'object-contain'}`}
            alt="profileIcon"
          />

          {/* dropdown menu for profile icon */}
          {token && profileOpen && (
            <div className="absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow-sm">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/orders");
                    setProfileOpen(false);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* card icon start */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="cartIco" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        {/* card icon end */}

        {/* mobile responsive menu icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt="menu_icon"
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* sidebar menu for small screen basically for mobile */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="close_icon"
            />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            Contact
          </NavLink>
          <a
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            href={adminUrl}
            target="_blank"
            rel="noreferrer"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
