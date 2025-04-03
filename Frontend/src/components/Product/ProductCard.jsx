import { useState } from "react";
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ name, productType, imageSrc, variants = [] }) => {
  const [selectedVariant, setSelectedVariant] = useState(variants?.[0] || {});

  return (
    <div className="border border-[#c0a16b] rounded-xl shadow-lg p-6 bg-[#FDFBF5] max-w-sm transition-transform transform hover:scale-105 hover:shadow-xl">
      {/* Product Image */}
      <div className="h-56 w-full overflow-hidden rounded-lg shadow-md">
        <img
          src={selectedVariant?.images?.[0] || imageSrc}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
        />
      </div>
  
      {/* Product Name */}
      <h3 className="mt-5 text-2xl font-bold text-[#4A2E19] tracking-wide font-serif leading-tight">
        {name} <span className="text-[#96705B] text-lg font-light">{productType}</span>
      </h3>
  
      {/* Product Variants */}
      {variants.length > 1 ? (
        <div className="mt-4 space-y-3">
          {variants.map((variant) => (
            <label key={variant.type} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`${name}`}
                  value={variant.type}
                  checked={selectedVariant.type === variant.type}
                  onChange={() => setSelectedVariant(variant)}
                  className="w-4 h-4 accent-[#4A2E19]"
                />
                <span className="text-lg font-medium text-[#4A2E19] font-serif tracking-wide">
                  {variant.type}
                </span>
              </div>
              <span className="text-lg font-semibold text-[#4A2E19] font-serif tracking-wide">
                ₹{variant.price.toFixed(2)}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-[#4A2E19] text-xl font-semibold mt-4 font-serif tracking-wide">
          ₹{variants[0].price.toFixed(2)}
        </p>
      )}
  
      {/* Add to Cart & View Product Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          className="w-full bg-gradient-to-r from-[#6b4226] to-[#4a2f1a] hover:from-[#4a2f1a] hover:to-[#6b4226] text-white py-3 rounded-md transition-all text-lg shadow-lg flex justify-center items-center gap-2 font-serif tracking-wide"
          disabled={!selectedVariant?.price && variants.length > 0}
        >
          <ShoppingCart /> Add to Cart
        </button>
  
        <button className="w-full border border-[#4A2E19] text-[#4A2E19] hover:bg-[#4A2E19] hover:text-white py-3 rounded-md transition-all text-lg shadow-md font-serif tracking-wide">
          View Product
        </button>
      </div>
    </div>
  );
  
};

export default ProductCard;
