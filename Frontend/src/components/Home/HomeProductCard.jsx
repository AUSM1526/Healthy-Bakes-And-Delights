import React from "react";
import { useNavigate } from "react-router-dom";

const HomeProductCard = ({ name,image}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products", {state: {selectedType: name}});
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-72 rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-white text-2xl sm:text-3xl font-playfair font-bold mb-2 drop-shadow-md">
          {name}
        </h2>
        <span className="text-white text-sm font-semibold tracking-wide border-b-2 border-white pb-1 drop-shadow-sm">
          EXPLORE
        </span>
      </div>
    </div>
  );
};

export default HomeProductCard;
