import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { apiFunc } from "../utils/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddAddressModal from "../components/Address/AddAddressModal";
import Footer from '../components/Home/Third'

const SingleOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {products} = location.state;
  const [qrCode, setQrcode] = useState("");
  const [addAddress, setAddAddress] = useState(false);
  const [addressDetails, setAddressDetails] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalPrice = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  
  //  const [paymentMode, setPaymentMode] = useState("qr");

    const fetchAddressDetails = async() => {
            try {
                const res = await apiFunc().get("/user/get-all-addresses");
                const addresses = res.data.data.addr;
                setAddressDetails(addresses);
                if(addresses.length > 0) {
                    setShowAddresses(true);
                }
            } catch (error) {
                console.log("Error fetching address details: ", error);
            }
    }


    const handleGenerateQrCode = async () => {
        try {
            const res = await apiFunc().post(`/order/orderQrCode?total=${totalPrice}`);
            const qrCodeData = res.data.data.qrCode;
            setQrcode(qrCodeData);
        } catch (error) {
            console.log("Error generating QR code: ", error);
            toast.error("Error generating QR code");
        }
    }

    const handleAddAddress = (e) => {
        e.preventDefault();
        setAddAddress(true);
    }

    const handleAddressChange = (e) => {
        e.preventDefault();
        setSelectedAddress(e.target.value);
    }

    const handlePlaceOrder = async () => {
        setLoading(true);
        if(transactionId.length !== 12){
            toast.error("Please enter a valid UPI transaction ID");
            setLoading(false);
            return;
        }
        try {
            const res = await apiFunc().post(`/order/placeSingleOrder?productId=${products[0].productId}&quantity=${products[0].quantity}&addressId=${selectedAddress}&upiTransactionId=${transactionId}`);
            const orderDetails = res.data.data.createdOrder;
            navigate("/orderSuccess",{state:{order: orderDetails}});
        } catch (error) {
            console.log("Error placing order: ", error);
            toast.error(error.response.data.message || "Error placing order");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAddressDetails();
    },[]);

    useEffect(() => {
        const address = addressDetails.find((addr) => addr.isDefault)?.addrId || addressDetails[0]?.addrId || null;
        setSelectedAddress(address);
    },[addressDetails]);

    useEffect(() => {
        handleGenerateQrCode();
    });

    return (
        <>
            <Navbar />
            <br />
            <br />
            <div className="min-h-screen bg-[#F9F4EF] text-[#4b2e1e] px-4 sm:px-6 lg:px-20 py-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 font-serif mt-8">Your Order</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Summary & Address */}
                    <div className="lg:col-span-2 space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-md shadow-sm">
                        <h2 className="text-[#4b2e1e] text-lg font-semibold mb-2 font-serif">Order Summary</h2>
                        {/* <p className="text-sm text-gray-600 mb-4">Order #HBD-2023-04-17</p> */}

                        <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            {
                                products.map((product) => (
                                    <>
                                        <div className="w-12 h-12 bg-gray-100 rounded" >
                                            <img src={product.image} alt={product.productName} className="w-full h-full object-cover rounded" />
                                        </div>
                                        <div>
                                            <p className="text-[#4b2e1e] font-medium font-serif">{product.productName}</p>
                                            <p className="text-sm text-gray-500">{product.subCategory} {product.productType}</p>
                                            <p className="text-sm text-gray-500 ">Quantity: {product.quantity}</p>
                                        </div> 
                                        <div className="text-[#4b2e1e] ml-auto font-medium font-serif">₹{product.price}</div>
                                    </>
                                ))
                            }
                        </div>
                        
                        </div>

                        <hr className="my-4" />

                        <div className="space-y-2 text-sm">
                        {/* <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹100.00</span>
                        </div> */}
                        <div className="text-[#4b2e1e] flex justify-between font-semibold font-serif">
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        </div>
                    </div>

                    {/* Address & Instructions */}
                    <div className="grid md:grid-cols-2 gap-4 ">
                        <div className="bg-white p-6 rounded-md shadow-sm ">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                                <h3 className="text-lg sm:text-xl font-semibold font-serif"> Addresses</h3>
                                <button className="bg-[#5c3a1d] hover:bg-[#3e2b1c] text-white px-4 py-1 text-sm rounded flex items-center gap-1" onClick={handleAddAddress}>
                                Add New Address
                                </button>
                            </div>
                            <div className="space-y-4">
                                {showAddresses && (
                                    <>
                                        {addressDetails.map((addr, index) => (
                                            <>
                                                <label key={index} className="block border rounded-md p-3 cursor-pointer hover:border-[#3B2F2F] transition-all" htmlFor={`address-${index}`}>
                                                    <input
                                                        id={`address-${index}`}
                                                        type="radio"
                                                        name="address"
                                                        value={addr.addrId}
                                                        checked={selectedAddress === addr.addrId}
                                                        onChange={handleAddressChange}
                                                        className="mr-2"
                                                    />
                                                    {addr.isDefault && (
                                                        <>
                                                        <span className="font-medium">Default Address</span>
                                                        </>
                                                        
                                                    )}
                                                    <p className="text-sm text-gray-500 ml-5">
                                                        {addr.houseNumber}, {addr.Name}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}
                                                    </p>
                                                </label>
                                            </>
                                        ))}
                                    </>
                                )}
                                {!showAddresses && (
                                    <>
                                        <p className="text-gray-400 italic">No Addresses Added.</p>
                                    </>
                                    
                                )}
                            </div>
                        </div>

                        {/* <div className="bg-white p-6 rounded-md shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Special Instructions</h3>
                            <textarea
                                placeholder="Add any special instructions for delivery or packaging..."
                                className="w-full min-h-[100px] border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B2F2F]"
                            />
                        </div> */}
                    </div> 
                </div>

                    {/* Right: Payment */}
                    <div className="bg-white p-6 rounded-md shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2 font-serif">Payment</h2>
                        <p className="text-sm text-gray-600 mb-4">Complete your payment to confirm order</p>

                        {/* <div className="flex space-x-2 mb-4">
                        <button
                            className={`w-full px-4 py-2 rounded-md border ${
                            paymentMode === "qr"
                                ? "bg-[#3B2F2F] text-white"
                                : "bg-white text-[#3B2F2F] border-[#3B2F2F]"
                            }`}
                            onClick={() => setPaymentMode("qr")}
                        >
                            QR Payment
                        </button>
                        <button
                            className={`w-full px-4 py-2 rounded-md border ${
                            paymentMode === "cod"
                                ? "bg-[#3B2F2F] text-white"
                                : "bg-white text-[#3B2F2F] border-[#3B2F2F]"
                            }`}
                            onClick={() => setPaymentMode("cod")}
                        >
                            Cash on Delivery
                        </button>
                        </div> */}

                        <div className="bg-[#F9F4EF] rounded-md p-4 flex flex-col items-center text-center">    
                            <p className="text-sm font-medium mb-2">Scan QR to Pay</p>
                            <p className="text-sm text-gray-500 mb-2">Amount: ₹{totalPrice}.00</p>
                            <div className="w-32 h-32 bg-gray-300 rounded mb-2">
                                <img src = {qrCode} className="w-full h-full object-cover rounded"/>
                            </div>
                        </div>

                        <div className="text-sm mt-4">
                            <p className="mb-1">After payment, enter your UPI transaction ID / Reference Number:</p>
                            <div className="border-2 border-dashed border-[#3B2F2F]/30 rounded-md p-4">
                                <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter your transaction ID"
                                className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B2F2F]/50 placeholder-gray-400"
                                />
                                <p className="text-xs text-gray-500 mt-2">Make sure to double-check the ID before submitting.</p>
                            </div>
                        </div>

                        {/* {paymentMode === "qr" && (
                        <>
                            
                        </>
                        )} */}
                    </div>

                    <button className="w-full bg-[#3B2F2F] text-white hover:bg-[#4e3b3b] py-2 rounded-md text-sm font-medium font-serif" onClick={handlePlaceOrder}>
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                    <p className="text-xs text-center text-gray-500">
                        By placing your order, you agree to our <a href="/terms" className="underline">Terms of Service</a> and{" "}
                        <a href="/privacy" className="underline">Privacy Policy</a>
                    </p>
                    </div>
                </div>
            </div>
            <Footer />
            {addAddress && <AddAddressModal onClose={() => setAddAddress(false)}    onSuccess={() => {
            fetchAddressDetails();
            setAddAddress(false);
            }}/>
        }
        </>
    );
  
};

export default SingleOrderPage;
