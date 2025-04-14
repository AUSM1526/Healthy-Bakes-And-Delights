import React from 'react';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { apiFunc } from '../utils/apiClient';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const fetchCartDetails = async() => {
        try {
            const res = await apiFunc().get("/user/view-cart");
            const cartdetails = res.data.data.cartItems;
            // console.log("Cart Details: ", cartdetails);
            setCart(cartdetails);
            //toast.success("Fetched Cart Details Successfully");
        } catch (error) {
            console.log("Error fetching cart details: ", error);
            toast.error(error.response.data.message || "Error fetching cart details");
        }
    };
    
    useEffect(() => {
        fetchCartDetails();
        window.scrollTo(0, 0);
    },[]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddtoCart = async(productId) => {
        try {
          const res = await apiFunc().post(`/user/add-to-cart?productId=${productId}&productQuantity=${1}`);
          await fetchCartDetails();
          const updatedCart = res.data.data.cart;
          console.log("Updated Cart: ", updatedCart); 
          dispatch(addToCart(updatedCart));
        } catch (error) {
          //console.log("Error while adding to cart: ", error);
          toast.error(error.response.data.message || "Error while adding to cart");
        }
      }


    const handleRemoveFromCart = async(productId) => {
        try {
          const res = await apiFunc().delete(`/user/remove-from-cart?productId=${productId}`);
          await fetchCartDetails();
          const updatedCart = res.data.data.cart;
          //console.log("Updated Cart: ", updatedCart); 
          dispatch(addToCart(updatedCart));
        } catch (error) {
          console.log("Error while adding to cart: ", error);
          toast.error(error.response.data.message || "Error while adding to cart");
        }
    }

    const total = cart.reduce((acc, item) => {
        return acc + (item.totalPrice);
    }, 0);

    const totalItems = cart.reduce((acc, item) => {
        return acc + (item.quantity);
    },0);

  return (
    <>
        <Navbar/>
        <br/>
        <br/>
        <div className="bg-[#F9F4EF] min-h-screen py-10 px-6 md:px-20 text-[#4b2e1e]">
        <h1 className="mt-5 text-3xl font-semibold mb-5 text-center font-serif">Your Cart</h1>
        
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
                <h2 className="font-serif text-xl font-medium border-b p-4">Cart Items ({totalItems})</h2>

                <div className="divide-y">
                    {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#f3e7da] rounded-md">
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                            <h3 className="font-serif font-medium">{item.name}<span className="text-[#96705B] text-sm font-light ml-2">{item.productType === "Chocolate" && `${item.subCategory}  ${item.productType}`}</span></h3>
                        </div>
                        </div>

                        <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded px-2 py-1">
                            <button className="px-1" onClick={() => handleRemoveFromCart(item.productId)}>-</button>
                            <span className="px-2">{item.quantity}</span>
                            <button className="px-1" onClick={() =>handleAddtoCart(item.productId)}>+</button>
                        </div>
                        <div className="w-24 text-right">
                            ₹{item.productPrice}.00
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg border shadow-sm p-6 h-[290px]">
                <h2 className="font-serif text-xl font-medium mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    {/* <span>Subtotal</span>
                    <span>₹3700.00</span> */}
                    </div>
                    <div className="flex justify-between">
                    {/* <span>Shipping</span>
                    <span>₹100.00</span> */}
                    </div>
                    <div className="flex justify-between">
                    {/* <span>Tax</span>
                    <span>₹185.00</span> */}
                    </div>
                    <div className="font-serif text-base flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total}.00</span>
                    </div>
                </div>

                <button className="w-full mt-6 bg-[#4b2e1e] hover:bg-[#5e3b24] text-white py-2 rounded-lg font-medium">
                    Proceed to Checkout
                </button>

                <button className="w-full mt-3 border border-[#4b2e1e] text-[#4b2e1e] py-2 rounded-lg font-medium hover:bg-[#f4ebe5]" onClick={() => navigate("/products")}>
                    Continue Shopping
                </button>
                </div>
            </div>
        </div>
    </>
  );
};

export default CartPage;
