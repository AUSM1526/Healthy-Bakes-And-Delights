import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Home/Third"

const ContactUs = () => {
  return (
    <>
        <Navbar />
        <div className="bg-[#fdf9f3] min-h-screen py-16 px-4 sm:px-8 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
            <h1 className="mt-10 text-3xl sm:text-4xl font-serif font-bold text-[#4b2e1e] mb-4">
            We'd Love to Hear From You
            </h1>
            <div className="w-20 h-[3px] bg-[#c2a188] mx-auto mb-6" />
            <p className="text-[#5c4639] text-base sm:text-lg max-w-2xl mx-auto mb-12">
            Whether you have a question about our products, want to place a custom
            order, or simply want to say hello, we're here to help.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visit Us */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-[#f3e9df]">
                <div className="bg-[#f5ebdf] rounded-full p-4 mb-4">
                <MapPin className="text-[#4b2e1e]" size={28} />
                </div>
                <h2 className="font-serif text-lg font-semibold text-[#4b2e1e] mb-2">
                Visit Us
                </h2>
                <p className="text-[#5c4639] text-sm leading-relaxed">
                Ahmedabad, Gujarat
                </p>
            </div>

            {/* Call Us */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-[#f3e9df]">
                <div className="bg-[#f5ebdf] rounded-full p-4 mb-4">
                <Phone className="text-[#4b2e1e]" size={28} />
                </div>
                <h2 className="font-serif text-lg font-semibold text-[#4b2e1e] mb-2">
                Call Us
                </h2>
                <p className="text-[#5c4639] text-sm leading-relaxed">
                +91 1234567890<br />
                Monday to Saturday, 9am to 6pm
                </p>
            </div>

            {/* Email Us */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-[#f3e9df]">
                <div className="bg-[#f5ebdf] rounded-full p-4 mb-4">
                <Mail className="text-[#4b2e1e]" size={28} />
                </div>
                <h2 className="font-serif text-lg font-semibold text-[#4b2e1e] mb-2">
                Email Us
                </h2>
                <p className="text-[#5c4639] text-sm leading-relaxed">
                healthybakes@gmail.com<br />
                We'll respond within 24 hours
                </p>
            </div>
            </div>
        </div>
        </div>
        <Footer/>
    </>
  );
};

export default ContactUs;
