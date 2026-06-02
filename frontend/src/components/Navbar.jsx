import { assets } from "./../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  return (
    <>
      {/* ── Navbar bar ── */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between py-5 font-medium">
        <Link to={"/"} className="flex items-center gap-1">
          <p className="text-2xl font-bold tracking-tighter text-gray-800 uppercase">
            ELITE WEAR<span className="text-pink-500">.</span>
          </p>
        </Link>

        {/* Desktop nav links */}
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
              className="flex flex-col items-center gap-1"
            >
              <span className="border px-5 text-sm py-1 rounded-full -mt-1">
                Admin Panel
              </span>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </a>
          )}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <img
            onClick={openSearch}
            src={assets.search_icon}
            className="w-5 h-5 cursor-pointer object-contain"
            alt="searchIcon"
          />

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="cartIco" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>

          {/* Profile */}
          <div ref={profileRef} className="relative group flex items-center gap-2">
            <img
              onClick={handleProfileClick}
              src={token && userData?.image ? userData.image : assets.profile_icon}
              className={`cursor-pointer ${
                token && userData?.image ? "w-8 h-8 rounded-full object-cover" : "w-5 h-5 object-contain"
              }`}
              alt="profileIcon"
            />
            {token ? (
              <span
                onClick={handleProfileClick}
                className="text-sm font-medium text-gray-700 cursor-pointer hover:text-black whitespace-nowrap"
              >
                {userData?.name || "Profile"}
              </span>
            ) : (
              <span
                onClick={handleProfileClick}
                className="text-sm text-gray-700 cursor-pointer hover:text-black"
              >
                Sign In
              </span>
            )}
            {token && profileOpen && (
              <div className="absolute right-0 top-full mt-2 dropdown-menu z-50">
                <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow-sm">
                  <p
                    onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                    className="cursor-pointer hover:text-black"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => { navigate("/orders"); setProfileOpen(false); }}
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

          {/* Hamburger – mobile only */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="menu_icon"
            className="w-5 cursor-pointer sm:hidden"
          />
        </div>
      </div>

      {/* ── Mobile drawer – rendered via portal directly into <body> ── */}
      {visible &&
        createPortal(
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9999 }}
            className="sm:hidden"
          >
            {/* Backdrop */}
            <div
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }}
              onClick={() => setVisible(false)}
            />

            {/* Drawer panel */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                width: "75%",
                maxWidth: "320px",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: 600 }}>Menu</span>
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  style={{
                    fontSize: "28px",
                    lineHeight: 1,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#374151",
                  }}
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ display: "flex", flexDirection: "column", padding: "8px 0" }}>
                {[
                  { to: "/", label: "Home" },
                  { to: "/collection", label: "Collection" },
                  { to: "/orders", label: "Orders" },
                  { to: "/about", label: "About Us" },
                  { to: "/contact", label: "Contact Us" },
                ].map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setVisible(false)}
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "16px 24px",
                      borderBottom: "1px solid #e5e7eb",
                      borderLeft: isActive ? "3px solid #000" : "3px solid transparent",
                      fontSize: "15px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#fff" : "#374151",
                      textDecoration: "none",
                      background: isActive ? "#000" : "transparent",
                    })}
                  >
                    {label}
                  </NavLink>
                ))}
                {adminUrl && (
                  <a
                    href={adminUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setVisible(false)}
                    style={{
                      display: "block",
                      padding: "16px 24px",
                      borderBottom: "1px solid #f3f4f6",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#374151",
                      textDecoration: "none",
                    }}
                  >
                    Admin Panel
                  </a>
                )}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Navbar;
