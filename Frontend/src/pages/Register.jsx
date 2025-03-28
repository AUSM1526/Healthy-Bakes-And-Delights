import React, { useState } from "react";
import toast from "react-hot-toast";
import OTP from "../components/OTP";
import apiClient from "../utils/apiClient";

const Register = () => {
    const [formData,setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
        email: "",
    });

    const [loading,setLoading] = useState(false);
    const [otpsent,setOtpsent] = useState(false);
    
    const handleFormDataChange = (e) => {
        const {name,value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleRegisterSubmit = async(e) => {
        e.preventDefault();

        const {username,firstName,lastName,phoneNumber,password,email} = formData;

        if(!username || !firstName || !lastName || !phoneNumber || !password || !email){
            toast.error("Please fill all fields");
            return;
        }
        
        setLoading(true);
        try {
            const response = await apiClient.post("/user/send-otp", { email });
            if (response?.data?.statusCode === 200) {
                toast.success("OTP sent successfully");
                setOtpsent(true);
            }
        } catch (error) {
            if (error?.response?.statusCode === 400 && error?.response?.data?.message === "User already Registered") {
                toast.error("User already exists! Please log in.");
            } else {
                toast.error(`${error.response?.data?.message} Please login` || "Failed to send OTP");
            }
        } finally {
            setLoading(false);
        }
    }
  
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f0e7db] to-[#d9c7ac] p-6">
          {/* Register Header */}
          <h2 className="text-5xl font-bold text-[#4A2C1A] mb-10 tracking-wide text-center drop-shadow-md">
            Register
          </h2>
      
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 transition-transform hover:scale-105 duration-300">
            {/* Branding */}
            <h2 className="text-4xl text-[#4A2C1A] text-center mb-10 font-playfair leading-snug tracking-wide">
              Healthy Bakes & Delights
            </h2>
      
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {!otpsent && (
                <>
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-lg font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleFormDataChange}
                      placeholder="Enter username"
                      className="mt-2 block w-full p-4 border rounded-lg focus:ring-4 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                      required
                    />
                  </div>
      
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-lg font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleFormDataChange}
                        placeholder="First Name"
                        className="mt-2 block w-full p-4 border rounded-lg focus:ring-4 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                        required
                      />
                    </div>
      
                    <div>
                      <label htmlFor="lastName" className="block text-lg font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleFormDataChange}
                        placeholder="Last Name"
                        className="mt-2 block w-full p-4 border rounded-lg focus:ring-4 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                        required
                      />
                    </div>
                  </div>
      
                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleFormDataChange}
                      placeholder="Enter phone number"
                      className="mt-2 block w-full p-4 border rounded-lg focus:ring-4 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                      required
                    />
                  </div>
      
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormDataChange}
                      placeholder="Enter your email"
                      className="mt-2 block w-full p-4 border rounded-lg focus:ring-4 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                      required
                    />
                  </div>
      
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleFormDataChange}
                      placeholder="Enter password"
                      className="mt-2 block w-full p-4 border rounded-lg focus:ring-4 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                      required
                    />
                  </div>
      
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4A2C1A] text-white py-4 rounded-xl hover:bg-[#3A2314] transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <span className="animate-pulse mr-2">Registering...</span>
                      </div>
                    ) : (
                      "Register"
                    )}
                  </button>
                </>
              )}
            </form>
      
            {/* OTP Section */}
            {otpsent && <OTP {...formData} />}
      
            {!otpsent && (
                <>
                    {/* Login Link */}
                    <div className="mt-6 text-center">
                    <p className="text-gray-700">
                        Already have an account?{" "}
                        <a
                        href="/login"
                        className="text-[#4A2C1A] hover:text-[#3A2314] transition-colors font-medium underline"
                        >
                        Login
                        </a>
                    </p>
                    </div>
                </>
            )}
          </div>
        </div>
      );
      
  
};

export default Register;