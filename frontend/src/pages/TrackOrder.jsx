import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const TrackOrder = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!token || !orderId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const orderItem = response.data.orders.find(
          (order) => order._id === orderId || order.id === orderId
        );
        setOrder(orderItem || null);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching track order:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [backendUrl, token, orderId]);

  if (loading) {
    return (
      <div className="border-t pt-16 text-center text-gray-600">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="border-t pt-16 text-center text-gray-600">
        <div className="max-w-2xl mx-auto py-20">
          <Title text1="TRACK" text2="ORDER" />
          <p className="mt-4 text-gray-500">Order not found or no tracking details are available.</p>
          <Link
            to="/orders"
            className="inline-block mt-8 px-6 py-3 border border-gray-900 text-sm font-medium hover:bg-gray-100"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-6">
        <Title text1="TRACK" text2="ORDER" />
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-6 rounded-md shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase text-gray-400">Order ID</p>
            <p className="font-semibold">{order._id || order.id}</p>
          </div>
          <div>
            <p className="text-sm uppercase text-gray-400">Order status</p>
            <p className="font-semibold text-green-600">{order.status}</p>
          </div>
          <div>
            <p className="text-sm uppercase text-gray-400">Payment</p>
            <p className="font-semibold">{order.paymentMethod || (order.payment ? "Paid" : "COD")}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6 space-y-4">
          <p className="text-sm uppercase text-gray-400">Shipping Address</p>
          <div className="text-gray-700 space-y-1">
            <p className="font-medium">
              {order.address?.firstName || ""} {order.address?.lastName || ""}
            </p>
            {order.address?.street && <p>{order.address.street}</p>}
            <p>
              {order.address?.city ? order.address.city + ", " : ""}
              {order.address?.state ? order.address.state + ", " : ""}
              {order.address?.zipcode || ""}
            </p>
            {order.address?.country && <p>{order.address.country}</p>}
            {order.address?.phone && <p>Phone: {order.address.phone}</p>}
            {order.address?.email && <p>Email: {order.address.email}</p>}
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <p className="text-sm uppercase text-gray-400 mb-4">Items in this order</p>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border p-4 rounded-md bg-gray-50">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size} • Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">{currency}{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            to="/orders"
            className="px-5 py-3 border border-gray-900 text-sm font-medium hover:bg-gray-100"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
