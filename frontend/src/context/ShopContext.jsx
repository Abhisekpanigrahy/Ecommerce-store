import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { products as localProducts } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

  // for searching state
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // for products state
  const [cartItems, setCartItems] = useState({});

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || null);

  const navigate = useNavigate();

  const getUserData = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setUserData(response.data.user);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);
    // check if the item already exists in the cart
    // if it does, increment the quantity
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    toast.success("Product added to cart successfully");

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // add to card counter
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };

  // update quantity of the cart item
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;
      for (const size in cartItems[itemId]) {
        try {
          const quantity = cartItems[itemId][size];
          if (quantity > 0) {
            totalAmount += itemInfo.price * quantity;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  // Fetch products data from the backend
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        const normalizeImageUrl = (url) => {
          if (!url) return url;
          // already absolute
          if (/^https?:\/\//i.test(url)) return url;
          // protocol-relative //example.com/.. -> https://example.com/..
          if (/^\/\//.test(url)) return (window?.location?.protocol || "https:") + url;
          // absolute path on server: /uploads/.. -> prepend backendUrl
          if (/^\//.test(url)) {
            const proto = window?.location?.protocol || "https:";
            let base = backendUrl;
            if (proto === "https:" && base.startsWith("http:")) base = base.replace(/^http:/, "https:");
            return base + url;
          }
          // relative path (no leading slash) -> treat as relative to backend
          if (!/^data:|^blob:/.test(url)) {
            let base = backendUrl;
            if ((window?.location?.protocol || "https:") === "https:" && base.startsWith("http:")) {
              base = base.replace(/^http:/, "https:");
            }
            return base + "/" + url;
          }
          return url;
        };

        const productsWithImages = response.data.products.map((product, index) => {
          const hasRemoteImage = Array.isArray(product.image) && product.image.length > 0 && Boolean(product.image[0]);

          if (hasRemoteImage) {
            const images = product.image.map((img) => normalizeImageUrl(img));
            return { ...product, image: images };
          }

          return {
            ...product,
            image: localProducts[index % localProducts.length].image,
          };
        });

        setProducts(productsWithImages);
      } else {
        console.log("API Error:", response.data.message);
        // Fallback to local products if API succeeds but returns error
        setProducts(localProducts);
      }
    } catch (error) {
      console.log("Product fetch error:", error);
      // Fallback to local products is already handled by initial state,
      // but we ensure it here too.
      setProducts(localProducts);
    }
  };

  // Fetch user cart data from the backend
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.info("Please login to add to wishlist.");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/user/wishlist/toggle",
        { productId },
        { headers: { token } }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Could not update wishlist.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Could not update wishlist.");
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      getUserCart(storedToken);
      getUserData(storedToken);
    }
  }, []);

  const value = {
    products,
    setProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    userData,
    setUserData,
    getUserData,
    toggleWishlist,
  };

  ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validates that 'children' is a React node and required
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
