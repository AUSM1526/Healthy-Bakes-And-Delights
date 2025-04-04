import React, { useState } from "react";
import toast from "react-hot-toast";
import {apiFunc} from "../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from "../store/authSlice";

const Login = () => {
    const [formData,setFormData] = useState({
        email: "",
        password: "",
    });
    const[loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleFormDataChange = (e) => {
        const {name,value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleLoginSubmit = async(e) => {
        e.preventDefault();
        const {email,password} = formData;
        if(!email || !password){
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await apiFunc().post("/user/login",{email,password});
            if(response?.data?.statusCode === 200){
                toast.success("Login Successfull");
                dispatch(login(response.data.data.user));
                navigate("/");
            }
        } catch (error) {
            toast.error(`${error.response?.data?.message} ` || "Login failed");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f0e7db] to-[#d9c7ac] p-4">
          
          {/* Login Header (Outside Form) */}
          <h2 className="text-4xl font-bold text-[#4A2C1A] mb-10 tracking-wide text-center drop-shadow-md">
            Login
          </h2>
      
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 transition-transform hover:scale-105 duration-300">
            
            {/* Branding */}
            <h2 className="text-3xl text-[#4A2C1A] text-center mb-6 font-playfair leading-snug tracking-wide">
              Healthy Bakes & Delights
            </h2>
      
            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-md font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormDataChange}
                  placeholder="Enter your email"
                  className="mt-1 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                  required
                />
              </div>
      
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-md font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormDataChange}
                  placeholder="Enter password"
                  className="mt-1 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4A2C1A] focus:outline-none bg-[#f8f1e8] text-gray-900 shadow-sm transition-all hover:shadow-md"
                  required
                />
              </div>
      
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A2C1A] text-white py-3 rounded-xl hover:bg-[#3A2314] transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <span className="animate-pulse mr-2">Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
      
            {/* Register Link */}
            <div className="mt-4 text-center">
              <p className="text-gray-700">
                Not registered?{" "}
                <a
                  href="/register"
                  className="text-[#4A2C1A] hover:text-[#3A2314] transition-colors font-medium underline"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>
        </div>
      );
      
      
      
};

export default Login;