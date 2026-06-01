import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
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
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    loadProfile();
  }, [backendUrl, token, navigate]);

  return (
    <div className="border-t pt-10">
      <div className="text-2xl text-center">
        <Title text1="MY" text2="PROFILE" />
      </div>

      <div className="max-w-2xl mx-auto my-10 border border-gray-200 p-6 sm:p-8">
        <p className="text-sm text-gray-500">Account details</p>
        <h2 className="text-2xl font-medium mt-2">
          {profile?.name || "Loading..."}
        </h2>

        <div className="mt-6 space-y-4 text-gray-700">
          <div>
            <p className="text-xs uppercase text-gray-400">Email</p>
            <p>{profile?.email || "Loading..."}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">Customer ID</p>
            <p className="break-all">{profile?._id || "Loading..."}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="mt-8 bg-black text-white px-8 py-3 text-sm"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default Profile;
