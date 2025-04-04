import React from 'react';
import Products from '../components/Product/Products';

const Product = () => {

    return (
        <div className="bg-[#FAF3E0] min-h-screen py-12 px-6 md:px-16">
            {/* Page Heading */}
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold text-[#4A2E19] font-serif leading-tight">
                    Our Artisanal Collection
                </h1>
                <p className="text-m text-[#6b4226] mt-4 tracking-wide font-serif">
                    Handcrafted with organic ingredients, our treats balance indulgence with wholesome goodness.
                    Each bite is a testament to our commitment to quality and flavor.
                </p>
            </div>

            {/* Product Grid */}
            <div className="mt-12">
                <Products />
            </div>
        </div>
    );
}

export default Product;