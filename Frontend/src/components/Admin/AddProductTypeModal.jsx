import { X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

const AddProductTypeModal = ({ onClose , onSuccess }) => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        hasSubCategories: false,
        image: [],
    });
    const [loading, setLoading] = useState(false);
    

    const handleFormDataChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImageFile(file);

        const previewFile = URL.createObjectURL(file);
        setImagePreview(previewFile);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("hasSubCategories", formData.hasSubCategories);
        
        if(imageFile){
            formDataToSend.append("image", imageFile);
        }
        try {
            await apiFunc().post("/productType/add-product-type", formDataToSend);
            toast.success("Product Type added successfully!");
            if(onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.log("Error while adding new product type: ", error);
        } finally {
            setLoading(false);
        }
    }
  
    
    return (
    <>
        {!loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 sm:p-6">
                <div className="bg-[#fff8f2] text-[#3e2d26] rounded-xl shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                    <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                        <h2 className="text-xl sm:text-2xl font-semibold font-playfair">Add New Product Type</h2>
                        <p className="text-sm text-[#8a6f56]">Fill in the details to add a new product type to your inventory.</p>
                        </div>
                        <button onClick={onClose} className="text-[#8a6f56] hover:text-[#3e2d26]">
                        <X size={20} />
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div className="border border-dashed border-[#e5c8b1] rounded-md bg-[#fffdfc] p-6 flex flex-col items-center justify-center text-center mb-6 w-full">
                            <Upload className="w-8 h-8 text-[#8a6f56] mb-2" />
                            <p className="text-sm text-[#8a6f56]">Drag & drop product type image here</p>
                            <p className="text-xs text-[#c0a68f]">or click to browse files</p>

                            
                            <div className="text-xs text-[#c0a68f] mt-2 mb-2">
                                <input
                                type="file"
                                accept="image/*"
                                multiple
                                id="product-images"
                                onChange={handleImageChange}
                            />
                            </div>

                            {imagePreview && (
                                <div className="grid grid-cols-3 gap-2 mt-4 w-full">
                                    <img
                                        src={imagePreview}
                                        alt={`Preview ${imagePreview}`}
                                        className="w-full h-24 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                        </div>

                    {/* Form */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Product Type Name</label>
                                <input type="text" 
                                name="name"
                                value = {formData.name}
                                onChange = {handleFormDataChange}
                                placeholder="Enter product type name" 
                                className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                        <input 
                            type="checkbox" 
                            id="featured" 
                            className="accent-[#3e2d26]"
                            checked={formData.hasSubCategories}
                            onChange = {(e) => {setFormData((prev) => ({...prev, hasSubCategories: e.target.checked}))}}
                        />
                        <label htmlFor="featured" className="text-sm text-[#3e2d26]">Has SubCategories</label>
                        </div>
                        <div>
                            {formData.hasSubCategories && <p className="text-xs text-gray-500">This product type includes subcategories.</p>}
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                        <button type="button" className="px-4 py-2 text-sm border border-[#3e2d26] rounded-md text-[#3e2d26] hover:bg-[#f9ece0]" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm bg-[#3e2d26] text-white rounded-md hover:bg-[#5b362a]" onClick = {(e) => {
                            handleSubmit(e);
                            onClose()
                        }}>
                            Add Product Type
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        )}

        {loading && <Spinner/>}
    </>
  );
};

export default AddProductTypeModal;
