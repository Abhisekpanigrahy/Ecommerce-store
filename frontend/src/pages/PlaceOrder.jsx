import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import CartTotal from "./../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const loadUserAddresses = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setAddresses(response.data.user.addressData || []);
        // Automatically select the first address if available
        if (response.data.user.addressData?.length > 0 && !selectedAddressId) {
          setSelectedAddressId(response.data.user.addressData[0].id);
          setFormData(response.data.user.addressData[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      loadUserAddresses();
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.id);
    setFormData(address);
    setIsEditingAddress(false);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editAddressId ? "/api/user/address/update" : "/api/user/address/add";
      const payload = editAddressId 
        ? { addressId: editAddressId, updatedAddress: formData } 
        : { address: formData };
      
      console.log("Saving address to:", backendUrl + endpoint);
      
      const response = await axios.post(
        backendUrl + endpoint,
        payload,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        loadUserAddresses();
        setIsEditingAddress(false);
        setEditAddressId(null);
      }
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/address/delete",
        { addressId: id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Address deleted");
        loadUserAddresses();
        if (selectedAddressId === id) {
          setSelectedAddressId("");
          setFormData({
            firstName: "", lastName: "", email: "", street: "",
            city: "", state: "", zipcode: "", country: "", phone: ""
          });
        }
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      name: "Order Payment",
      desscription: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } },
          );
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          try {
            const response = await axios.post(
              `${backendUrl}/api/order/place`,
              orderData,
              { headers: { token } },
            );

            if (response.data.success) {
              setCartItems({});
              navigate("/orders");
              toast.success("Order placed successfully!");
            } else {
              toast.error(response.data.message || "Order failed.");
            }
          } catch (error) {
            console.error("Order API error:", error);
            toast.error(
              error.response?.data?.message || "Something went wrong.",
            );
          }
          break;
        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } },
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }

        case "razorpay": {
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } },
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }

          break;
        }

        default:
          toast.warn("Invalid payment method.");
          break;
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* ---------Left Side----------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        {/* Existing Addresses Selection */}
        {addresses.length > 0 && (
          <div className="flex flex-col gap-3 mb-6">
            <p className="text-sm font-medium text-gray-700 uppercase tracking-widest">Select an address</p>
            <div className="grid grid-cols-1 gap-3">
              {addresses.map((address) => (
                <div 
                  key={address.id}
                  onClick={() => handleAddressSelect(address)}
                  className={`border p-4 rounded cursor-pointer relative group transition-all ${
                    selectedAddressId === address.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <p className="font-medium">{address.firstName} {address.lastName}</p>
                  <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state}, {address.zipcode}, {address.country}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditAddressId(address.id);
                        setFormData(address);
                        setIsEditingAddress(true);
                      }}
                      className="text-xs bg-black text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                  {selectedAddressId === address.id && (
                    <div className="absolute bottom-2 right-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address Form */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700 uppercase tracking-widest">
            {isEditingAddress ? 'Edit Address' : 'Add New Address'}
          </p>
          {(isEditingAddress || !selectedAddressId) && (
            <button 
              onClick={() => {
                setIsEditingAddress(false);
                setEditAddressId(null);
                setFormData({
                  firstName: "", lastName: "", email: "", street: "",
                  city: "", state: "", zipcode: "", country: "", phone: ""
                });
              }}
              className="text-xs underline text-gray-500"
            >
              Clear Form
            </button>
          )}
        </div>

        <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
              type="text"
              placeholder="First name"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
              type="text"
              placeholder="Last name"
            />
          </div>

          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
            type="email"
            placeholder="Email Address"
          />
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
            type="text"
            placeholder="Street"
          />

          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
              type="text"
              placeholder="City"
            />
            <input
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
              type="text"
              placeholder="State"
            />
          </div>

          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
              type="number"
              placeholder="Zipcode"
            />
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
              type="text"
              placeholder="Country"
            />
          </div>

          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black transition-all"
            type="number"
            placeholder="Phone"
          />
          
          <button type="submit" className="bg-black text-white py-2 rounded text-sm uppercase tracking-widest hover:bg-gray-800 transition-all">
            {isEditingAddress ? 'Update & Save' : 'Save Address'}
          </button>
        </form>
      </div>

      {/* ----------Right Side----------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <form onSubmit={onSubmitHandler} className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ------Payment Method Selection-------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer hover:bg-gray-50 transition-all"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="stripe_logo" />
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer hover:bg-gray-50 transition-all"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="razorpay_logo" />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer hover:bg-gray-50 transition-all"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4 uppercase tracking-widest">
                Cash on delivery
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={!selectedAddressId}
              className={`bg-black text-white px-16 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-all ${!selectedAddressId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Place Order
            </button>
            {!selectedAddressId && <p className="text-xs text-red-500 mt-2">Please select a delivery address first</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
