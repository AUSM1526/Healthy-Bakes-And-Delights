import React from "react";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { apiFunc } from "../utils/apiClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {order} = location.state || {};

  const orderId = order._id;
  const orderedProducts = order.products;
  const total = order.totalPrice;
  const orderStatus = order.status;
  const deliveryAddress = order.address;
  const transcationId = order.transactionId;
  const approvalStatus = order.isApproved;

  const [address,setAddress] = useState({});

  const date = new Date(order.createdAt);
  const options = {
    year: 'numeric',
    month: 'long',   
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,     
  };

  const formattedDate = date.toLocaleString('en-IN', options);

  const fetchAddressDetails = async() => {
    try {
      const res = await apiFunc().get(`/address/get-address/?addressId=${deliveryAddress}`);
      const addrDetails = res.data.data.address;
      setAddress(addrDetails);
    } catch (error) {
      console.log("Error fetching address details:", error);
    }
  }

  useEffect(()=>{
    fetchAddressDetails();
  },[]);

  useEffect(() => {
    window.scrollTo(0, 0);
  })

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="min-h-screen bg-[#fefaf6] px-4 py-10 text-[#3b2f2f]">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-[#4b2e1e] mt-8" />
          <h1 className="text-[#4b2e1e] text-2xl font-semibold mt-4 font-serif">Order Placed Successfully!</h1>
          <p className="text-sm text-gray-600 mt-1">
            Thank you for your order. We’ve sent a confirmation email to your registered email address.
          </p>

          <div className="bg-white border border-gray-200 rounded-md shadow-sm mt-6 text-left">
            <div className="border-b border-gray-200 p-4">
              <p className="font-medium">Order #HBD{orderId}</p>
              <p className="text-sm text-gray-500 mt-1">Placed on {formattedDate}</p>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-medium mb-2 font-serif">Order Summary</h2>
              {
                orderedProducts.map((product, index) => (
                  <>
                    <div className="w-12 h-12 bg-gray-100 rounded" >
                      <img src={product.image} alt={product.productName} className="w-full h-full object-cover rounded" />
                      </div>
                    <div className="flex justify-between text-sm mb-1">
                      <div>
                        <p>{product.productName}</p>
                        <p className="text-gray-500">{product.subCategory} {product.productType} - Qty: {product.quantity}</p>
                      </div>
                      <p>₹{product.price}</p>
                    </div>
                  </>
                ))
              }
            </div>

            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-medium mb-2 font-serif">Payment Details</h2>
              {/* <div className="flex justify-between text-sm mb-1">
                <p>Subtotal</p>
                <p>₹2100.00</p>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <p>Shipping</p>
                <p>₹100.00</p>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <p>Tax</p>
                <p>₹105.00</p>
              </div> */}
              <div className="flex justify-between font-medium text-sm font-serif">
                <p>Total</p>
                <p>₹{total}.00</p>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-sm font-medium mb-1 font-serif">Delivery Address</h2>
              <p className="text-sm text-gray-600">
                {address.houseNumber}, {address.name}, {address.area}<br />
                {address.city}, {address.state} – {address.pincode}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-md shadow-sm mt-6 p-4 text-left text-sm space-y-3">
            <h2 className="font-medium mb-1">What’s Next?</h2>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">●</span>
              <p>Your order is currently being reviewed. You’ll receive an update once it’s approved.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">●</span>
              <p>We’ve sent a detailed confirmation email to your registered email address with all order information.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">●</span>
              <p>In case of any issues with your order, a full refund will be processed to your original payment method.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#3b2f2f] hover:bg-gray-100" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 bg-[#3b2f2f] text-white rounded-md text-sm font-medium hover:bg-[#2f2525]" onClick={() => navigate("/products")}>
              <ShoppingBag className="w-4 h-4 mr-2" /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
