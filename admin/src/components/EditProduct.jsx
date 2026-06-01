import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const EditProduct = ({ token, product, onUpdate, onCancel }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setBestseller(product.bestseller);
      setSizes(product.sizes);
    }
  }, [product]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("id", product._id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/update",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onUpdate();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-10">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-gray-100 w-full max-w-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-500 transition-colors"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-8 border-b pb-4">Edit Product</h2>
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4">
          <div>
            <p className="mb-2">Upload Image (Optional - replaces old ones)</p>
            <div className="flex gap-2">
              <label htmlFor="edit_image1">
                <img
                  className="w-20 border border-gray-300 rounded p-1 cursor-pointer"
                  src={image1 ? URL.createObjectURL(image1) : (product.image[0] || assets.upload_area)}
                  alt=""
                />
                <input
                  onChange={(e) => setImage1(e.target.files[0])}
                  type="file"
                  id="edit_image1"
                  hidden
                />
              </label>
              <label htmlFor="edit_image2">
                <img
                  className="w-20 border border-gray-300 rounded p-1 cursor-pointer"
                  src={image2 ? URL.createObjectURL(image2) : (product.image[1] || assets.upload_area)}
                  alt=""
                />
                <input
                  onChange={(e) => setImage2(e.target.files[0])}
                  type="file"
                  id="edit_image2"
                  hidden
                />
              </label>
              <label htmlFor="edit_image3">
                <img
                  className="w-20 border border-gray-300 rounded p-1 cursor-pointer"
                  src={image3 ? URL.createObjectURL(image3) : (product.image[2] || assets.upload_area)}
                  alt=""
                />
                <input
                  onChange={(e) => setImage3(e.target.files[0])}
                  type="file"
                  id="edit_image3"
                  hidden
                />
              </label>
              <label htmlFor="edit_image4">
                <img
                  className="w-20 border border-gray-300 rounded p-1 cursor-pointer"
                  src={image4 ? URL.createObjectURL(image4) : (product.image[3] || assets.upload_area)}
                  alt=""
                />
                <input
                  onChange={(e) => setImage4(e.target.files[0])}
                  type="file"
                  id="edit_image4"
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2">Product Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-3 py-2 border border-gray-300"
              type="text"
              required
            />
          </div>

          <div className="w-full">
            <p className="mb-2">Product Description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-3 py-2 border border-gray-300"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
            <div>
              <p className="mb-2">Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="w-full px-3 py-2 border border-gray-300"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <p className="mb-2">Sub Category</p>
              <select
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
                className="w-full px-3 py-2 border border-gray-300"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>
            <div>
              <p className="mb-2">Price</p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-3 py-2 border border-gray-300 sm:w-[120px]"
                type="number"
                required
              />
            </div>
          </div>

          <div>
            <p className="mb-2">Sizes</p>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "XXL"].map(size => (
                <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}>
                  <p className={`${sizes.includes(size) ? "bg-pink-100 border-pink-300" : "bg-slate-200 border-transparent"} px-3 py-1 cursor-pointer border`}>
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <input 
              onChange={() => setBestseller(prev => !prev)} 
              checked={bestseller} 
              type="checkbox" 
              id="edit_bestseller" 
            />
            <label className="cursor-pointer" htmlFor="edit_bestseller">Add to bestseller</label>
          </div>

          <div className="flex gap-4 w-full mt-4">
            <button type="submit" className="bg-black text-white px-10 py-3 rounded flex-1">
              UPDATE PRODUCT
            </button>
            <button type="button" onClick={onCancel} className="border border-gray-300 px-10 py-3 rounded flex-1">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
