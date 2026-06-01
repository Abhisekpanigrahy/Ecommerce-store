import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };



  const statusHandler = async (event, orderId)=> {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status: event.target.value}, {headers: {token}})
      if (response.data.success){
        await fetchAllOrders();

      }
    } catch (error){
      console.log(error);
      toast.error(error.message);
    }
  }

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/delete",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };




  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 " key={index}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 border bg-gray-50 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
              {order.items.length > 0 ? (
                <div className={`grid ${order.items.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-0.5 w-full h-full p-1`}>
                  {order.items.slice(0, 4).map((item, idx) => (
                    <img key={idx} src={item.image[0]} className="w-full h-full object-cover rounded-sm bg-white" alt="" />
                  ))}
                </div>
              ) : (
                <img className="w-10" src={assets.parcel_icon} alt="parcel_icon" />
              )}
            </div>
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p className="py-0.5" key={index}>
                        {" "}
                        {item.name} X {item.quantity} <span>{item.size}</span>
                      </p>
                    );
                  } else {
                    return (
                      <p key={index}>
                        {" "}
                        {item.name} X {item.quantity} <span>{item.size}</span>
                      </p>
                    );
                  }
                })}
              </div>

              <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>

              <p>{order.address.phone}</p>
            </div>

              <div>
                <p className="text-sm sm:text-[15px]">Items : {order.items.length}</p>
                <p className="mt-3">Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ?  'Done' : 'Pending'}</p>
                <p>Date & Time: {new Date(order.date).toLocaleString()}</p>
                <p></p>
              </div>


              <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
              <div className="flex items-center gap-3">
                <select onChange={(event)=>statusHandler(event, order._id)} value={order.status} className="p-2 font-semibold border border-gray-300">
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button 
                  onClick={() => deleteOrder(order._id)} 
                  className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100 transition-colors"
                  title="Delete Order"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
