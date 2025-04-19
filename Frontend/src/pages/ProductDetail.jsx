import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFunc } from "../utils/apiClient";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/authSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { state } = useLocation();
  const { product, selectedVariant } = state;
  const productName = product.name;
  const productType = product.productType;
  const subCategories = product.variants;

  const [currentVariant, setCurrentVariant] = useState(selectedVariant || subCategories[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddtoCart = async() => {
    if(!user){
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      const res = await apiFunc().post(`/user/add-to-cart?productId=${currentVariant.productId}&productQuantity=${quantity}`);
      const updatedCart = res.data.data.cart;
      console.log("Updated Cart: ", updatedCart); 
      dispatch(addToCart(updatedCart));
      toast.success("Added to Cart Successfully");
    } catch (error) {
      console.log("Error while adding to cart: ", error);
      toast.error(error.response.data.message || "Error while adding to cart");
    }
  }

  const handleOrder = async() => {
    const productId = currentVariant.productId;
    const products = [{ productId, quantity, productName, productType, price: currentVariant.price, image: currentVariant.images[0], subCategory: currentVariant.type }];
    navigate("/order",{state:{products}});
  }

  return (
    <>
      <Navbar />
      <br />
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-20 font-serif bg-[#F9F4EF] min-h-screen">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Left Section - Images */}
          <div className="flex flex-col gap-4 w-full lg:w-1/2 min-w-0">
            <div className="w-full aspect-square sm:aspect-[4/3] rounded-xl border flex items-center justify-center overflow-hidden">
              <img src={currentVariant.images[selectedImageIndex]} alt={productName} className="object-cover w-full h-full" />
            </div>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {currentVariant.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-lg overflow-hidden cursor-pointer ${
                    selectedImageIndex === idx ? 'ring-2 ring-[#4A2E19]' : ''
                  }`}
                >
                  <img src={img} alt={`variant-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="w-full lg:w-1/2 space-y-6 min-w-0">
            {/* Title & Price */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#4A2E19]">
                {productName}
                <span className="text-[#96705B] text-lg font-light ml-2">{productType}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-[#4A2E19] font-semibold">
                ₹{currentVariant.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center border border-[#C8B6A6] rounded-md px-4 py-1">
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

              <button className="flex-1 sm:flex-none px-10 py-2 bg-[#4A2E19] hover:bg-[#3a2115] text-white rounded-md transition-all" onClick={handleAddtoCart}>
                Add to Cart
              </button>

              <button className="flex-1 sm:flex-none px-11 py-2 bg-[#4A2E19] hover:bg-[#3a2115] text-white rounded-md transition-all" onClick={handleOrder}>
                Buy Now
              </button>
            </div>

            {/* Variant Selection */}
            {subCategories.length > 1 && (
              <div className="space-y-2 mt-4">
                <hr className="border-t border-[#c0a16b] w-full my-2" />
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

            {/* Accordions */}
            <div className="space-y-4 mt-4">
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
          <h3 className="text-xl sm:text-2xl text-[#4A2E19] font-bold mb-3">Description</h3>
          <p className="text-[#4A2E19] max-w-4xl text-sm sm:text-base">
            {currentVariant.description ||
              "Handcrafted in small batches to ensure quality and freshness, our product delivers a rich, satisfying taste in every bite."}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
