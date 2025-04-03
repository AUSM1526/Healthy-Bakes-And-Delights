import { useState } from "react";
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ name, productType, imageSrc, variants = [] }) => {
  const [selectedVariant, setSelectedVariant] = useState(variants?.[0] || {});

  return (
    <div className="border border-[#c0a16b] rounded-xl shadow-lg p-5 bg-white
      w-full max-w-[320px] min-h-[500px] flex flex-col transition-transform 
      transform hover:scale-105 hover:shadow-2xl duration-300">
      
      {/* Product Image */}
      <div className="h-48 w-full overflow-hidden rounded-lg shadow-md">
        <img
          src={selectedVariant?.images?.[0] || imageSrc}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
        />
      </div>

      {/* Product Name */}
      <h3 className="mt-3 text-xl font-bold text-[#4A2E19] tracking-wide font-serif leading-tight">
        {name} <span className="text-[#96705B] text-lg font-light">{productType}</span>
      </h3>

      {/* Product Variants */}
      {variants.length > 1 ? (
        <div className="mt-3 space-y-2">
          {variants.map((variant) => (
            <label key={variant.type} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${name}`}
                  value={variant.type}
                  checked={selectedVariant.type === variant.type}
                  onChange={() => setSelectedVariant(variant)}
                  className="w-4 h-4 accent-[#4A2E19]"
                />
                <span className="text-lg font-medium text-[#4A2E19] font-serif">{variant.type}</span>
              </div>
              <span className="text-lg font-semibold text-[#4A2E19]">₹{variant.price.toFixed(2)}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-[#4A2E19] text-xl font-semibold font-serif text-center">
            ₹{variants[0].price.toFixed(2)}
          </p>
          {/* Thin bottom line for non-variant products */}
          <hr className="border-t border-[#c0a16b] w-full my-3" />
          {/* Description for non-variant products */}
          <p className="text-[#4A2E19] text-sm font-light text-center font-serif">
            {variants[0].description}
          </p>
        </div>
      )}

      {/* View Product Button */}
      <div className="mt-auto pt-3">
        <button className="w-full border border-[#4A2E19] text-[#4A2E19] hover:bg-[#4A2E19] hover:text-white 
          py-3 rounded-md transition-all text-lg shadow-md font-serif hover:scale-105 duration-300">
          View Product
        </button>
      </div>
    </div>
  );
  
};

export default ProductCard;
