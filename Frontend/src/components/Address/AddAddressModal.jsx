import React from "react";
import AddAddressForm from "./AddAddressForm";
import { PlusCircle, X } from "lucide-react";

const AddAddressModal = ({ onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="relative bg-[#fcf8f3] text-[#4b2e1e] rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-2xl border border-[#e0d7ce]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#4b2e1e] hover:text-[#3a2317] transition"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          Add New Address
        </h2>

        <AddAddressForm onSuccess = {onSuccess}/>
      </div>
    </div>
  );
};

export default AddAddressModal;
