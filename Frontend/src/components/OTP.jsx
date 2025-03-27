import React, { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";
import OtpInput from "react-otp-input";
import {useNavigate} from "react-router-dom";

const OTP = (props) => {
    const [otp,setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const {username, firstName, lastName, phoneNumber,password,email}=props;
    const navigate = useNavigate();

    const handleOtpSubmit = (e) => {
        e.preventDefault();

        if(!otp){
            toast.error("Please enter OTP");
            return;
        }

        setLoading(true);
        apiClient.post("/user/register", {username, email, firstName, lastName, phoneNumber,password, otp})
        .then((res) => {
            toast.success("OTP verified successfully");
            navigate("/login");
        })
        .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message);
        })
        setLoading(false);
    };

    return (
      <div className="flex justify-center items-center h-full w-full bg-gray-50">
        <div className="max-w-md w-full mx-14 lg:mx-auto rounded-2xl p-6 md:p-8 shadow-lg bg-white">
          <div className="text-center">
            <h2 className="font-bold text-2xl text-gray-800">OTP Verification</h2>
            <p className="text-gray-600 text-md max-w-sm mt-2 p-2">
              We've sent a 4-digit code to your email. Enter it below.
            </p>
          </div>
  
          <form className="my-8" onSubmit={handleOtpSubmit}>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
  
            <div className="flex justify-center items-center mt-4 gap-2">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                shouldAutoFocus
                containerStyle="flex justify-between gap-3"
                renderInput={(props) => (
                  <input
                    {...props}
                    placeholder="-"
                    style={{
                      width: "48px",
                      height: "48px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "0.5rem",
                      backgroundColor: "#D9C7AC",
                      color: "#4A2C1A",
                      fontSize: "18px",
                      textAlign: "center",
                      transition: "border 0.3s ease",
                      outline: "none",
                    }}
                    className="focus:border-[#4A2C1A] focus:ring-2 focus:ring-[#4A2C1A]"
                  />
                )}
              />
            </div>
  
            <button
              className="w-full bg-[#4A2C1A] text-white rounded-md h-10 font-medium mt-8 hover:bg-[#3A2314] transition flex justify-center items-center"
              type="button"
              onClick={handleOtpSubmit}
              disabled={loading}
            >
              {loading ? (
                <div>
                  <span className="ml-2">Verifying...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    );
      
      
      
};

export default OTP;