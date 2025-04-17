import React from "react";
import ProductDisplay from "./ProductDisplay";
import { apiFunc } from '../../utils/apiClient';
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Second = () => {
    const [productTypes, setProductTypes] = useState([]);

    const fetchProductTypes = async () => {
        try {
            const res = apiFunc().get("/productType/get-all-productTypes");
            const productTypedetails = (await res).data.data.productTypes;
            setProductTypes(productTypedetails);
        } catch (error) {
            console.log("Error fetching product types:", error);
            toast.error("Failed to fetch product types. Please try again later.");
        }
    };

    useEffect(() => {
        fetchProductTypes();
    },[]);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F9F4EF]">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-chocolate-dark relative inline-block leading-tight mt-0">
                    Our Collections
                    <span className="block w-100 h-1 bg-chocolate-gold mt-3 mx-auto rounded"></span>
                </h2>
                <p className="mt-6 text-lg sm:text-xl text-[#5C3A21] font-serif tracking-wide leading-relaxed">
                    Handcrafted with premium ingredients, our products are the perfect balance of indulgence and wellness.
                </p>
            </div>
            <ProductDisplay products={productTypes}/>
        </section>
    );
}

export default Second;