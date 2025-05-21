import React from "react";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiFunc } from "../utils/apiClient";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import Footer from '../components/Home/Third'

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Cancelled: "bg-gray-100 text-gray-600",
  NotApproved: "bg-red-100 text-red-800",
  Approved: "bg-green-100 text-green-800",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectOrderId, setSelectOrderId] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("All Orders");

  useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  
  const fetchOrderDetails = async() => {
    setLoading(true);
    try {
        const res = await apiFunc().get("/user/order-history");
        const orderDetails = res.data.data.orders;
        setOrders(orderDetails);
    } catch (error) {
        console.log("Error fetching order details:", error);
        toast.error(error.response.data.message || "Failed to fetch order details. Please try again later.");
    } finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrderDetails();
  },[]);

  const options = {
    year: 'numeric',
    month: 'long',   
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,     
  };

  const handleCancelOrder = async () => {
    if(!selectOrderId) return;
    const orderId = selectOrderId;
    setLoading(true);
    try {
        const res = await apiFunc().patch(`/order/cancelOrder?orderId=${orderId}`);
        toast.success(res.data.message || "Order cancelled successfully");
    } catch (error) {
        console.log("Error cancelling order:", error);
        toast.error(error.response.data.message || "Failed to cancel order. Please try again later.");
    } finally{
        setLoading(false);
        setShowCancelModal(false);
        fetchOrderDetails();
    }
  }
  
  const filteredOrders = selectedOrderStatus == "All Orders" ? orders : orders.map((order) => {
    const filteredOrderHistory = order.orderHistory.filter(
        (history) => history.status === selectedOrderStatus
    );
    return {...order, orderHistory: filteredOrderHistory};
  }).filter((order) => order.orderHistory.length > 0);

  return (
    <>
        <Navbar />
        <br />
        <br />
        {!loading && (
            <>
                <div className="bg-[#F9F4EF] min-h-screen">
                    <div className="max-w-5xl mx-auto px-4 py-10 text-[#3e2f23] font-serif">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 font-serif mt-8">My Orders</h1>

                        <div className="p-4 mb-6">
                            <h2 className="font-semibold mb-2 font-serif">Order Filters</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className="block text-sm mb-1">Order Status</label>
                                    <select 
                                    value = {selectedOrderStatus == "All Orders" ? "": selectedOrderStatus}
                                    onChange={(e) => setSelectedOrderStatus(e.target.value)}
                                    className="w-full border rounded px-3 py-2">
                                    <option>All Orders</option>
                                    <option>Pending</option>
                                    <option>Delivered</option>
                                    <option>Shipped</option>
                                    <option>Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredOrders.length > 0 ? (
                            <>
                                {filteredOrders.map((order) =>
                                        order.orderHistory.map((historyItem, index) => {
                                        const isExpanded = expanded === order._id + index;
                                        
                                        const orderedTime = new Date(historyItem.createdAt).getTime();
                                        const currentTime = new Date().getTime();
                                        const timeDiff = currentTime - orderedTime;
                                        const diffInMins = Math.floor(timeDiff/(1000*60));

                                        const showCancel = diffInMins < 60 && historyItem.status === "Pending";

                                        return (
                                        <div
                                            key={order._id + index}
                                            className="border border-x-chocolate-light rounded-md p-4 mb-4 shadow-sm bg-white"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold">Order #HBD{historyItem._id.slice(0,7)}</h3>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <CalendarDays size={14} />
                                                    <span>{new Date(historyItem.createdAt).toLocaleString("en-IN", options)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 text-right">
                                                    {historyItem.isApproved ? (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Approved</span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Not Approved</span>
                                                    )}
                                                    
                                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[historyItem.status]}`}>
                                                        {historyItem.status === "NotApproved" ? "Waiting for Approval" : historyItem.status}
                                                    </span>

                                                    <div className="text-lg font-semibold mt-1 sm:mt-0">
                                                        ₹{historyItem.totalPrice.toLocaleString("en-IN")}
                                                    </div>
                                                </div>

                                            </div>

                                            <div>
                                                <button
                                                    onClick={() => setExpanded(isExpanded ? null : order._id + index)}
                                                    className="text-sm mt-2 text-[#3e2f23] flex place-items-start justify-between w-full"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                            <span>Hide Order Details</span>
                                                            <ChevronUp size={16} />
                                                            </>
                                                        ) : (
                                                            
                                                            <>
                                                                <span>View Order Details</span> 
                                                                <ChevronDown size={16} />
                                                            </>

                                                        )}
                                                </button>
                                            </div>

                                            {/* Expandable Section */}
                                            {isExpanded && (
                                            <div className="mt-4">
                                                <div className="font-semibold text-sm text-gray-800 mb-2">Items:</div>
                                                <ul className="space-y-2">
                                                {historyItem.products.map((item, idx) => (
                                                    <li key={idx} className="flex justify-between items-center p-2 border rounded">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                        src={item.image}
                                                        alt={item.productName}
                                                        className="w-14 h-14 object-cover rounded"
                                                        />
                                                        <div>
                                                        <div className="font-medium">{item.productName}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {item.subCategory && `${item.subCategory} `}
                                                            {item.productType}
                                                            
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Quantity: {item.quantity}
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        ₹{item.price}
                                                    </div>
                                                    </li>
                                                ))}
                                                </ul>

                                                <div className="mt-4 text-sm text-gray-800">
                                                <div className="font-semibold mb-1">Delivery Address</div>
                                                <p>{historyItem.address.houseNumber}, {historyItem.address.name}, {historyItem.address.area}, {historyItem.address.city}, {historyItem.address.state} - {historyItem.address.pincode}</p>
                                                </div>

                                                <div className="mt-2 text-sm text-gray-800">
                                                <div className="font-semibold mb-1">Order Summary</div>
                                                <div className="flex justify-between">
                                                    <span>Subtotal</span>
                                                    <span>₹{historyItem.totalPrice.toLocaleString("en-IN")}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Shipping</span>
                                                    <span>₹0.00</span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span>Total</span>
                                                    <span>₹{historyItem.totalPrice.toLocaleString("en-IN")}</span>
                                                </div>
                                                </div>
                                            </div>
                                            )}

                                            {showCancel && (
                                                <button className="bg-chocolate-buttonColor text-white px-2 py-0.5 rounded shadow hover:opacity-90 mt-2 text-sm" onClick={()=> {setShowCancelModal(true);
                                                    setSelectOrderId(historyItem._id);
                                                }

                                                }>
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                        );
                                    })
                                )}
                            </>
                        ) : (
                            <div className="text-center text-lg text-gray-500 mb-6">
                                No orders found.
                            </div>
                        )}
                        
                    </div>
                </div>

                {showCancelModal && (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                            <div className="bg-[#fefaf6] rounded-2xl shadow-xl p-6 w-full max-w-md text-[#3e2f23]">
                                <div className="mb-4">
                                <h2 className="text-xl font-semibold mb-2">Confirm Cancel Order</h2>
                                <p className="text-sm text-gray-700">Are you sure you want to cancel this order? This action cannot be undone.</p>
                                <p className="text-sm text-gray-700 font-bold">The paid amount will be refunded soon.</p>
                                </div>
                        
                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    className="px-4 py-2 bg-[#d1a670] text-white rounded-lg hover:bg-[#cb934e] transition-colors"
                                >
                                    {loading ? (
                                    <div className="flex items-center">
                                        <span className="animate-pulse">Cancelling...</span>
                                    </div>
                                    ) : (
                                    "Cancel Order"
                                    )}
                                </button>
                                </div>
                            </div>
                        </div>
                  </>
                )}
            <Footer/>
            </>
        )}

        {loading && (
            <div className="flex justify-center items-center min-h-screen bg-[#F9F4EF]">
                <Spinner />
            </div>
        )}
    </>
    
  );
}

export default MyOrders;