import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Home/Third";
import { useEffect } from "react";

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <>
        <Navbar />
        <div className="bg-[#F9F4EF] min-h-screen py-12 px-6 sm:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-12 border border-[#f2e8dd]">
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#44352c] mb-6 border-b pb-4 border-[#e6dcd3]">
            About Us
            </h1>

            <p className="text-[#5c4639] text-base sm:text-lg leading-relaxed space-y-4 font-light">
            <span className="block text-xl font-serif font-medium text-[#7b6652] mb-4">
                A Note from the Founder
            </span>

            <span className="block mb-4">
                Hi, I’m <span className="font-medium text-[#44352c]">Urvi Modi</span>, the heart behind <span className="italic">Healthy Bakes & Delights</span>.
            </span>

            <span className="block mb-4">
                What started as a personal journey to create healthier versions of my favorite sweet treats soon turned into a full-fledged passion project. I set out to prove that indulgence and wellness don’t have to be opposites.
            </span>

            <span className="block mb-4">
                Every recipe we offer has been tested (and re-tested!) in my own kitchen, with a focus on real ingredients, balanced flavors, and a whole lot of love. Whether it’s our gooey brownies, nutrient-packed granola, or handcrafted chocolates — each product is a reflection of my belief that food should nourish both the body and the soul.
            </span>

            <span className="block mt-6">
                Thank you for being part of this sweet journey. I can’t wait for you to taste the difference!
            </span>

            <div className="mt-8 text-right">
                <p className="font-medium text-[#44352c]">Warmly,</p>
                <p className="text-[#7b6652] italic">Urvi Modi</p>
                <p className="text-[#7b6652]">Founder, Healthy Bakes & Delights</p>
            </div>
            </p>
        </div>
        </div>
        <Footer />
    </>
  );
};

export default AboutUs;
