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
                        description: sub.description,
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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16">
          {products.map((product) => (
            <ProductCard
              key={product.productName}
              name={product.productName}
              productType={product.productType === "Chocolate" ? "Chocolate" : ""}
              imageSrc={product.productsubCategories[0]?.images[0]} 
              variants={product.productsubCategories.map((sub) => ({
                type: sub.name,
                price: sub.price,
                images: sub.images,
                description: sub.description,
              }))}
            />
          ))}
        </div>
      );
    
};

export default Products;