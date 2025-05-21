import React, { useEffect, useState } from "react";
import { Eye, Search, Filter, Pencil, Trash2 } from "lucide-react";
import SideBar from "../../components/Sidebar";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import OrderApprovalModal from "../../components/Admin/ApproveOrderModal";
import OrderNotApprovalModal from "../../components/Admin/NotApproveOrderModal";
import ViewOrderModal from "../../components/Admin/ViewOrderModal";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Cancelled: "bg-gray-100 text-gray-600",
  NotApproved: "bg-red-100 text-red-800",
  Approved: "bg-green-100 text-green-800",
};

const AdminOrdersPage = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNotApproveModal, setShowNotApproveModal] = useState(false);
  const [showViewOrderModal, setShowViewOrderModal] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("All Orders");

  const options = {
    year: 'numeric',
    month: 'long',   
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,     
  };

  const [selectedOrder, setSelectedOrder] = useState({
    orderId: "",
    custFirstName: "",
    custLastName: "",
    custEmail: "",
    custPhoneNumber: "",
    custId: "",
    products: "",
    totalPrice: "",
    orderStatus: "",
    address: "",
    transactionId: "",
    isApproved: "",
    date: ""
  });
  
  const [orders, setOrders] = useState([]);
  
  const allOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFunc().get("/order/getAllOrders");
      const fetchedOrders = res.data.data.orders;
      const displayOrders = fetchedOrders.map((order) => ({
        orderId: order._id,
        custFirstName: order.user.firstName,
        custLastName: order.user.lastName,
        custEmail: order.user.email,
        custPhoneNumber: order.user.phoneNumber,
        custId: order.user._id,
        products: order.products,
        totalPrice: order.totalPrice,
        orderStatus: order.status,
        address: order.address,
        transactionId: order.transactionId,
        isApproved: order.isApproved,
        date: new Date(order.createdAt).toLocaleString("en-IN", options)
      }));
      setOrders(displayOrders);
    } catch (error) {
      console.log("Error while fetching all Orders: ", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = selectedOrderStatus === "All Orders" ? orders : orders.filter((order) => order.orderStatus === selectedOrderStatus);

  useEffect(() => {
    allOrders();
  }, []);

  return (
      <>
        {!loading && (
          <div className="min-h-screen bg-[#fdf7f0] text-[#3e2d26] flex flex-col sm:flex-row">
            <SideBar />

            <div className="flex-1 p-6 py-12 sm:p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-playfair font-bold">Orders</h1>
                  <p className="text-sm text-[#8a6f56]">Manage and process customer orders</p>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
      
                {/* Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 text-[#6e5647]" size={18} />
                  <input
                    type="text"
                    placeholder="Search orders by ID, customer..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-[#f0e9e3] rounded-md bg-[#fefaf6] text-[#44352c] placeholder-[#6e5647] focus:outline-none focus:ring-1 focus:ring-[#d5c5b6]"
                  />
                </div>

                {/* Dropdown */}
                <div className="w-full sm:w-auto">
                  <select className="w-full sm:w-auto px-4 py-2 text-sm border border-[#f0e9e3] rounded-md bg-[#fefaf6] text-[#44352c] focus:outline-none focus:ring-1 focus:ring-[#d5c5b6]"
                    value={selectedOrderStatus}
                    onChange = {(e) => setSelectedOrderStatus(e.target.value)}
                  >
                    <option>All Orders</option>
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                {/* Filter Icon Button */}
                <button className="border border-[#f0e9e3] p-2 rounded-md bg-[#fefaf6] text-[#44352c] hover:bg-[#f8f3ef] transition">
                  <Filter size={18} />
                </button>
              </div>

              {/* Orders Table - Desktop */}
              <div className="hidden sm:block overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-chocolate-light text-[#3e2d26]">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium font-serif">OrderID</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Customer</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Date & Time</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Total</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Status</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#3e2d26]">
                    {filteredOrders.map((order) => (
                      <tr key={order.orderId} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium font-serif">
                          #HBD{order.orderId.slice(0, 7)}
                        </td>
                        <td className="px-4 py-3 font-medium font-serif">
                          {order.custFirstName} {order.custLastName}
                        </td>
                        <td className="px-4 py-3 font-medium font-serif">
                          {order.date}
                        </td>
                        <td className="px-4 py-3 font-medium font-serif">
                          ₹{order.totalPrice}
                        </td>
                        <td className="px-4 py-3 font-medium font-serif space-y-1">
                          <div>
                            {order.isApproved ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Approved
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Not Approved
                              </span>
                            )}
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button className="px-3 py-2 text-sm flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif"
                            onClick={() => {
                              setShowViewOrderModal(true);
                              setSelectedOrder({
                                orderId: order.orderId,
                                custFirstName: order.custFirstName,
                                custLastName: order.custLastName,
                                custEmail: order.custEmail,
                                custPhoneNumber: order.custPhoneNumber,
                                custId: order.custId,
                                products: order.products,
                                totalPrice: order.totalPrice,
                                orderStatus: order.orderStatus,
                                address: order.address,
                                transactionId: order.transactionId,
                                isApproved: order.isApproved,
                                date: order.date
                              });
                            }}
                            >
                              <Eye size={14} />
                            </button>
                            {!order.isApproved && (
                              <button
                              className="px-3 py-2 text-sm flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif"
                              onClick={() => {
                                setShowModal(true);
                                setSelectedOrder({
                                    orderId: order.orderId,
                                    custFirstName: order.custFirstName,
                                    custLastName: order.custLastName,
                                    custEmail: order.custEmail,
                                    custPhoneNumber: order.custPhoneNumber,
                                    custId: order.custId,
                                    products: order.products,
                                    totalPrice: order.totalPrice,
                                    orderStatus: order.orderStatus,
                                    address: order.address,
                                    transactionId: order.transactionId,
                                    isApproved: order.isApproved,
                                    date: order.date
                                  });
                              }}
                            >
                              <Pencil size={14} />
                              Approve
                            </button>
                            )}

                            {order.isApproved && (
                              <button
                              className="px-3 py-2 text-sm flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif"
                              onClick={() => {
                                setShowNotApproveModal(true);
                                setSelectedOrder({
                                    orderId: order.orderId,
                                    custFirstName: order.custFirstName,
                                    custLastName: order.custLastName,
                                    custEmail: order.custEmail,
                                    custPhoneNumber: order.custPhoneNumber,
                                    custId: order.custId,
                                    products: order.products,
                                    totalPrice: order.totalPrice,
                                    orderStatus: order.orderStatus,
                                    address: order.address,
                                    transactionId: order.transactionId,
                                    isApproved: order.isApproved,
                                    date: order.date
                                  });
                              }}
                            >
                              <Pencil size={14} />
                              Not Approve
                            </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-6 sm:hidden mt-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 items-start mb-3">
                      <div>
                        <h2 className="font-semibold font-serif text-lg text-[#3e2d26]">
                          #HBD{order.orderId.slice(0, 7)}
                        </h2>
                        <p className="text-sm text-[#8a6f56]">
                          {order.custFirstName} {order.custLastName}
                        </p>
                        <p className="text-sm text-[#a58d7d] mt-1">{order.date}</p>
                      </div>
                      <div className="flex gap-2 justify-start xs:justify-end">
                        <button
                          className="px-3 py-1.5 text-sm flex items-center gap-1 border border-[#c2a188] text-[#3e2d26] rounded-lg hover:bg-[#f7ede3] transition font-serif"
                          onClick={() => {
                            setShowViewOrderModal(true);
                            setSelectedOrder({
                                orderId: order.orderId,
                                custFirstName: order.custFirstName,
                                custLastName: order.custLastName,
                                custEmail: order.custEmail,
                                custPhoneNumber: order.custPhoneNumber,
                                custId: order.custId,
                                products: order.products,
                                totalPrice: order.totalPrice,
                                orderStatus: order.orderStatus,
                                address: order.address,
                                transactionId: order.transactionId,
                                isApproved: order.isApproved,
                                date: order.date
                              });
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        {!order.isApproved && (
                          <button
                          className="px-3 py-1.5 text-sm flex items-center gap-1 border border-[#c2a188] text-[#3e2d26] rounded-lg hover:bg-[#f7ede3] transition font-serif"
                          onClick={() => {
                            setShowModal(true);
                            setSelectedOrder({
                              orderId: order.orderId,
                              custFirstName: order.custFirstName,
                              custLastName: order.custLastName,
                              custEmail: order.custEmail,
                              custPhoneNumber: order.custPhoneNumber,
                              custId: order.custId,
                              products: order.products,
                              totalPrice: order.totalPrice,
                              orderStatus: order.orderStatus,
                              address: order.address,
                              transactionId: order.transactionId,
                              isApproved: order.isApproved,
                              date: order.date
                            });
                          }}
                        >
                          <Pencil size={14} />
                          Approve
                        </button>
                        )}

                        {order.isApproved && (
                          <button
                          className="px-3 py-1.5 text-sm flex items-center gap-1 border border-[#c2a188] text-[#3e2d26] rounded-lg hover:bg-[#f7ede3] transition font-serif"
                          onClick={() => {
                            setShowNotApproveModal(true);
                            setSelectedOrder({
                              orderId: order.orderId,
                              custFirstName: order.custFirstName,
                              custLastName: order.custLastName,
                              custEmail: order.custEmail,
                              custPhoneNumber: order.custPhoneNumber,
                              custId: order.custId,
                              products: order.products,
                              totalPrice: order.totalPrice,
                              orderStatus: order.orderStatus,
                              address: order.address,
                              transactionId: order.transactionId,
                              isApproved: order.isApproved,
                              date: order.date
                            });
                          }}
                        >
                          <Pencil size={14} />
                          Not Approve
                        </button>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-[#3e2d26] space-y-1 font-serif">
                      <div>
                        <span className="font-semibold">Total:</span> ₹{order.totalPrice}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-semibold">Status:</span>
                        {order.isApproved ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Not Approved
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-screen bg-[#fdf7f0]">
            <Spinner />
          </div>
        )}

        {showModal && (
          <OrderApprovalModal orderId={selectedOrder.orderId}onClose={() => setShowModal(false)} onSuccess={() => allOrders()} />
        )}

        {showNotApproveModal && (
          <OrderNotApprovalModal orderId={selectedOrder.orderId} onClose={() => setShowNotApproveModal(false)} onSuccess={() => allOrders()} />
        )}

        {showViewOrderModal && (
          <ViewOrderModal order = {selectedOrder} onClose={() => setShowViewOrderModal(false)} onSuccess={() => allOrders()}/>
        )}

      </>
    );
};

export default AdminOrdersPage;
