import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from './../context/ShopContext';
import Title from './../components/Title';
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [rawOrders, setRawOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    if (!token) {
      setOrderData([]);
      setRawOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        const reversedOrders = response.data.orders.slice().reverse();
        const allOrdersItem = [];

        reversedOrders.forEach((order) => {
          order.items.forEach((item) => {
            const itemCopy = { ...item };
            itemCopy.orderId = order._id || order.id;
            itemCopy.status = order.status;
            itemCopy.payment = order.payment;
            itemCopy.paymentMethod = order.paymentMethod;
            itemCopy.date = order.date;
            allOrdersItem.push(itemCopy);
          });
        });

        setRawOrders(reversedOrders);
        setOrderData(allOrdersItem);
      } else {
        setRawOrders([]);
        setOrderData([]);
      }
    } catch (error) {
      console.error("Error loading order data:", error);
      setRawOrders([]);
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, backendUrl]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <p className="text-xl font-semibold text-gray-700">Loading orders...</p>
          </div>
        ) : orderData.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <p className="text-xl font-semibold text-gray-700">No orders yet.</p>
            <p className="mt-2">Your order history is empty. Make a purchase to see orders here.</p>
          </div>
        ) : (
          orderData.map((item, index) => {
            const productId = item._id || item.id || item.productId || item.product?._id;
            const orderState = rawOrders.find((order) => order._id === item.orderId || order.id === item.orderId);

            return (
              <div key={index} className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-6 text-sm">
                  {productId ? (
                    <Link to={`/product/${productId}`} className="flex items-start gap-6 text-sm group">
                      <img className="w-16 sm:w-20 rounded-sm object-cover" src={item.image?.[0]} alt="item_image" />
                      <div>
                        <p className="sm:text-base font-medium group-hover:text-gray-900">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-base text-gray-700 ">
                          <p>{currency}{item.price}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size}</p>
                        </div>
                        <p className="mt-1">Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span></p>
                        <p className="mt-1">Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-start gap-6 text-sm">
                      <img className="w-16 sm:w-20 rounded-sm object-cover" src={item.image?.[0]} alt="item_image" />
                      <div>
                        <p className="sm:text-base font-medium">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-base text-gray-700 ">
                          <p>{currency}{item.price}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size}</p>
                        </div>
                        <p className="mt-1">Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span></p>
                        <p className="mt-1">Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:w-1/2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                    <p className="text-sm md:text-base">{item.status}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/track-order/${item.orderId}`, { state: { order: orderState } })}
                    className="border px-4 py-2 text-sm font-medium rounded-sm"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
