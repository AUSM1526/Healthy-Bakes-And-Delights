import React from "react";
import HomeProductCard from "./HomeProductCard";

const ProductDisplay = ({products}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-10 bg-[#F9F4EF]">
      <div className="flex flex-wrap gap-8 justify-center">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33%-1.5rem)] max-w-[400px]"
          >
            <HomeProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDisplay;