import { useState } from "react";
import { useLocation } from "react-router-dom";

const ProductDetail = () => {
  const { state } = useLocation();
  const { product, selectedVariant } = state;
  const productName = product.name;
  const productType = product.productType;
  const subCategories = product.variants;

  const [currentVariant, setCurrentVariant] = useState(selectedVariant || subCategories[0]);
  const [quantity, setQuantity] = useState(1);
  const[selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="px-6 md:px-16 py-10 font-serif bg-[#F9F4EF] min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Section - Images */}
            <div className="flex flex-col gap-4 w-full lg:w-1/2">
            <div className="w-full aspect-square rounded-xl border flex items-center justify-center overflow-hidden">
                <img src={currentVariant.images[selectedImageIndex]} alt={productName} className="object-cover w-full h-full" />
            </div>
            <div className="flex gap-3">
                {currentVariant.images.map((img, idx) => (
                <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 border rounded-lg overflow-hidden cursor-pointer ${
                        selectedImageIndex === idx ? 'ring-2 ring-[#4A2E19]' : ''
                    }`}
                >
                    <img src={img} alt={`variant-${idx}`} className="w-full h-full object-cover" />
                </div>
                ))}
            </div>
            </div>

            {/* Right Section - Details */}
            <div className="w-full lg:w-1/2 space-y-5">
                {/* Title & Price */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-[#4A2E19]">
                    {productName}
                    <span className="text-[#96705B] text-lg font-light"> {productType}</span>
                    </h1>
                    <p className="text-[#4A2E19] text-xl font-semibold">
                    ₹{currentVariant.price.toFixed(2)}
                    </p>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center border border-[#C8B6A6] rounded-md px-4 py-1 w-fit">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-lg text-[#4A2E19] px-2"
                    >
                        −
                    </button>
                    <span className="text-lg text-[#4A2E19] font-medium px-3">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-lg text-[#4A2E19] px-2"
                    >
                        +
                    </button>
                    </div>
                    <button className="px-20 ml-6 bg-[#4A2E19] hover:bg-[#3a2115] text-white py-2 rounded-md transition-all">
                    Add to Cart
                    </button>
                </div>

                <br />

                {/* Variant Selection */}
                {subCategories.length > 1 && (
                    <div className="mt-6 space-y-2">
                    <hr className="border-t border-[#c0a16b] w-full my-3" />
                    <h4 className="text-[#4A2E19] font-semibold">Select a Chocolate Type:</h4>
                    <div className="flex flex-wrap gap-3">
                        {subCategories.map((variant) => (
                        <button
                            key={variant.productId}
                            onClick={() => setCurrentVariant(variant)}
                            className={`border px-4 py-2 rounded-md text-sm ${
                            currentVariant.productId === variant.productId
                                ? "bg-[#4A2E19] text-white"
                                : "text-[#4A2E19] border-[#4A2E19]"
                            }`}
                        >
                            {variant.type}
                        </button>
                        ))}
                    </div>
                    </div>
                )}

                {/* Accordions for Shipping & Returns and Dimensions */}
                <div className="space-y-4 mt-6">
                    <details className="group border-t border-[#C8B6A6] pt-4 cursor-pointer">
                    <summary className="flex justify-between items-center text-[#4A2E19] font-medium text-base list-none">
                        Shipping & Returns
                        <span className="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-2 text-sm text-[#4A2E19]">
                        We offer standard shipping nationwide. Returns are accepted within 7 days of delivery, provided the item is unopened and in original condition.
                    </p>
                    </details>

                    <details className="group border-t border-[#C8B6A6] pt-4 cursor-pointer">
                    <summary className="flex justify-between items-center text-[#4A2E19] font-medium text-base list-none">
                        Dimensions
                        <span className="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-2 text-sm text-[#4A2E19]">
                        Each bar weighs approximately 100g and measures 12cm x 5cm x 1.5cm.
                    </p>
                    </details>
                </div>
            </div>
        </div>

      {/* Description */}
      <div className="mt-12 border-t pt-6">
        <h3 className="text-2xl text-[#4A2E19] font-bold mb-3">Description</h3>
        <p className="text-[#4A2E19] max-w-4xl">
          {currentVariant.description ||
            "Handcrafted in small batches to ensure quality and freshness, our product delivers a rich, satisfying taste in every bite."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
