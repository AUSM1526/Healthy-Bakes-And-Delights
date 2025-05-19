import { X, Trash2 } from "lucide-react";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../Spinner";
import { useState } from "react";
import toast from "react-hot-toast";

const DeleteProductModal = ({ isOpen, onClose, productName, subCategory, productId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const handleDelete = async() => {
    setLoading(true);
    try {
        await apiFunc().delete(`/product/delete-product?productId=${productId}`);
        toast.success("Product deleted successfully");
        if(onSuccess) {
            onSuccess();
        }
        onClose();
    } catch (error) {
        console.log("Error deleting product:", error);
    } finally {
        setLoading(false);
    }
  }
  if (!isOpen) return null;

  return (
    <>
        {!loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-chocolate-dark rounded-2xl p-6 w-[90%] max-w-md shadow-2xl border border-[#d8ccc1] dark:border-[#333] relative transition-all">
                    
                    {/* Close Icon */}
                    <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition"
                    onClick={onClose}
                    >
                    <X className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4 text-red-500">
                    <Trash2 className="w-10 h-10" />
                    </div>

                    {/* Title */}
                    <h2 className="text-center text-xl font-semibold text-[#3d2e2e] dark:text-[#fdf8f3] mb-2">
                    Delete Product?
                    </h2>

                    {/* Description */}
                    <p className="text-center text-sm text-[#5e4a4a] dark:text-gray-300 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{subCategory} {productName}</span>? This action cannot be undone.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded-xl bg-[#ece1d4] text-[#3d2e2e] hover:bg-[#dfd0bd] transition font-medium"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-medium"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                    </div>
                </div>
            </div>
        )}

        {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <Spinner />
            </div>
        )}
    </>
  );
};

export default DeleteProductModal;
