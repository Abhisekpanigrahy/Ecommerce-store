import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const { backendUrl } = useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(backendUrl + "/api/newsletter/subscribe", {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off
      </p>

      <p className="mt-2 text-sm sm:text-base text-gray-600">
        Join our newsletter for exclusive offers, fresh arrivals, and style updates delivered to your inbox.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          required
        />

        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
