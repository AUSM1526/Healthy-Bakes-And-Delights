import React from 'react';
import { useState } from 'react';
import apiClient from "../../utils/apiClient";
import toast from "react-hot-toast";
import Deadpool from "../../assets/Deadpool.jpg";
import { useEffect } from 'react';
import ProductCard from './ProductCard';

const Products = () => {
    const [products,setProducts]  = useState([]);

    useEffect(() => {
        const allProducts = async() => {
            try {
                const response = await apiClient.get("/product/get-products-with-subcategory");
                
                const fetchedProducts = response?.data?.data.products || [];
                if(fetchedProducts.length === 0){
                    toast.error("No Products Found");
                    return;
                }
    
                const displayProducts = fetchedProducts.map((product) => ({
                    productName: product.name,
                    productType: product.productType,
                    productsubCategories: (product.subCategories || []).map((sub) => ({
                        name: sub.name || "Standard",
                        price: sub.price,
                        stock: sub.stock,
                        images: sub.images.length > 0 ? sub.images : Deadpool
                    }))
                }));
                setProducts(displayProducts);
            } catch (error) {
                console.log("Error while fetching all Products: ",error);
            }
        }

        allProducts();
    },[]);

    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <ProductCard
                    key={product.productName}
                    name={product.productName}
                    productType = {product.productType === "Chocolate" ? "Chocolate" : ""}
                    imageSrc={product.productsubCategories[0]?.images[0] || Deadpool} // First image of first subcategory
                    variants={product.productsubCategories.map(sub => ({
                        type: sub.name,
                        price: sub.price,
                        images: sub.images
                    }))}
                />
            ))}
        </div>
    );
    
};

export default Products;