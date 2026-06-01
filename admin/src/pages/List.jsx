import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import EditProduct from "../components/EditProduct";

const List = ({token}) => {
  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editProductData, setEditProductData] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  


  // Function to remove a product
  // This function will be called when the user clicks on the delete icon

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove' , { id }, {headers:{token}});
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh the list after deletion
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditProductData(product);
    setShowEdit(true);
  };


  // Fetch the product list when the component mounts
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>

      {showEdit && (
        <EditProduct 
          token={token} 
          product={editProductData} 
          onUpdate={() => {
            setShowEdit(false);
            fetchList();
          }} 
          onCancel={() => setShowEdit(false)} 
        />
      )}

      <div className="flex flex-col gap-2">
        {/* ------ List Table Title--------- */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ------ Product List--------- */}

        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="product_image" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="flex md:justify-center gap-4 text-right md:text-center cursor-pointer text-lg">
              <p 
                onClick={() => handleEdit(item)} 
                className="hover:text-blue-600"
                title="Edit Product"
              >
                ✎
              </p>
              <p 
                onClick={() => removeProduct(item._id)} 
                className="hover:text-red-600"
                title="Remove Product"
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
