import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Profile = () => {
  const { backendUrl, token, setToken, navigate, getUserData, userData, setUserData, setCartItems } = useContext(ShopContext);
  const [profile, setProfile] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: userData?.name || "" });

  const loadProfile = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setProfile(response.data.user);
        setUserData(response.data.user);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        setEditData({ name: response.data.user.name });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      setProfile(userData);
      setEditData({ name: userData.name });
    }
    loadProfile();
  }, [backendUrl, token, navigate]);

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile/update",
        { name: editData.name },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setIsEditing(false);
        loadProfile();
        getUserData(token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, upload to Cloudinary and get URL
    // For now, we'll use base64 for simplicity in this demo
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          backendUrl + "/api/user/profile/update-pic",
          { image: reader.result },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("Profile picture updated");
          loadProfile();
          getUserData(token);
        }
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-t pt-10">
      <div className="text-2xl text-center">
        <Title text1="MY" text2="PROFILE" />
      </div>

      <div className="max-w-2xl mx-auto my-10 border border-gray-200 p-6 sm:p-8 flex flex-col items-center">
        <div className="relative group">
          <img
            src={profile?.image || assets.profile_icon}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-100"
            alt="Profile"
          />
          <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
              <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
            </svg>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <div className="w-full mt-8 space-y-6">
          <div className="border-b pb-4">
            <p className="text-xs uppercase text-gray-400 mb-1">Full Name</p>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="border px-2 py-1 flex-1 outline-none"
                />
                <button onClick={() => setIsEditing(false)} className="text-sm border px-3 py-1">Cancel</button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-xl font-medium">{profile?.name || "Loading..."}</p>
                <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 underline">Edit</button>
              </div>
            )}
          </div>

          <div className="border-b pb-4">
            <p className="text-xs uppercase text-gray-400 mb-1">Email Address</p>
            <p className="text-gray-700">{profile?.email || "Loading..."}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={handleProfileUpdate}
            className="bg-black text-white px-12 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            Save
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              setToken("");
              setUserData(null);
              setCartItems({});
              navigate('/login');
            }}
            className="border border-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
