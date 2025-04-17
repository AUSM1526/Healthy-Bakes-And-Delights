import React from "react";
import HomeProductCard from "./HomeProductCard";

const ProductDisplay = ({products}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-10 bg-[#F9F4EF]">
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {products.map((product, index) => (
          <HomeProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductDisplay;