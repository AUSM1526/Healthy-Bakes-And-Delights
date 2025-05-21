import React from "react";
import { useState } from "react";
import { X, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { apiFunc } from "../../utils/apiClient";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Cancelled: "bg-gray-100 text-gray-600",
  NotApproved: "bg-red-100 text-red-800",
  Approved: "bg-green-100 text-green-800",
};

const viewOrderModal = ({order,onClose,onSuccess}) => {
  const [selectedTab, setSelectedTab] = useState("Order Details");
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => setSelectedTab(tab);
  const handleStatusChange = (e) => setOrderStatus(e.target.value);

  const saveOrderStatus = async() => {
    const orderId = order.orderId;
    console.log("New Order Status:", orderStatus);
    setLoading(true);
    try {
        await apiFunc().patch(`/order/updateOrderStatus?orderId=${orderId}`,{
            newStatus: orderStatus
        });
        toast.success("Order status updated successfully");
    } catch (error) {
        console.error("Error updating order status:", error);
    } finally {
        setLoading(false);
        onClose();
        onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[#fffcf7] w-full max-w-2xl rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#44352c]">UPI Transaction ID: {order.transactionId}</h2>
            <p className="text-xs sm:text-sm text-[#7b6652]">{order.date}</p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[#44352c] cursor-pointer" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-[#e6dcd3] overflow-x-auto">
          {["Order Details", "Customer Info", "Shipping"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-t-md font-medium text-sm transition-all ${
                selectedTab === tab
                  ? "bg-[#f1e7dd] text-[#44352c]"
                  : "text-[#7b6652] hover:text-[#44352c]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-sm text-[#44352c] space-y-4">
          {selectedTab === "Order Details" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-medium flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                </span>
                <span className="font-medium">Payment Method: UPI</span>
              </div>
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="text-sm">
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-[#44352c]">
                        {order.products.map((product) => {
                            return (
                                <React.Fragment key={product._id}>
                                    <span className="truncate">{product.subCategory} {product.productName} ({product.productType})</span>
                                    <span className="text-right whitespace-nowrap">
                                        ₹{product.price} × {product.quantity} = ₹{product.price * product.quantity}
                                    </span>
                                </React.Fragment>
                            )
                        })}
                    </div>
                  <hr className="mt-5 mb-0"/>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#7b6652]">Subtotal:</span>
                      <span>₹{order.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7b6652]">Shipping:</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedTab === "Customer Info" && (
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.custFirstName} {order.custLastName}</p>
              <p><span className="font-medium">Email:</span> {order.custEmail}</p>
              <p><span className="font-medium">Phone:</span> +91 {order.custPhoneNumber}</p>
            </div>
          )}

          {selectedTab === "Shipping" && (
            <div>
              <p className="font-medium">Shipping Address:</p>
              <p className="mt-1 text-[#7b6652]">{order.address.houseNumber}, {order.address.name}, {order.address.area}</p>
              <p className="mt-1 text-[#7b6652]">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={orderStatus}
              onChange={handleStatusChange}
              className="bg-[#fef8f2] border border-[#e6dcd3] text-[#44352c] rounded-md px-3 py-1 text-sm w-full sm:w-auto"
            >
              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <button className="bg-[#44352c] text-white text-sm px-4 py-1 rounded-md hover:bg-[#2e221c] transition"
            onClick={saveOrderStatus}
            >
              {loading ? "Saving..." : "Save Status"}
            </button>
          </div>
          <button className="flex items-center space-x-1 border border-[#44352c] text-[#44352c] px-4 py-1 rounded-md text-sm hover:bg-[#f3ebe5] transition">
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default viewOrderModal;
