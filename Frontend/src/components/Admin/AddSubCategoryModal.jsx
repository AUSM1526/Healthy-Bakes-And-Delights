import { X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

const AddSubCategoryModal = ({ onClose , onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        productTypeName: "",
        basePrice: "",
    });
    const [loading, setLoading] = useState(false);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState("");

    useEffect(() => {
        const allProductTypes = async () => {
            setLoading(true);
            try {
                const res = await apiFunc().get("/productType/get-all-productTypes");
                const fetchedProductTypes = res.data.data.productTypes;
                const displayProductTypes = fetchedProductTypes.map((productType) => ({
                        id: productType._id,
                        name: productType.name,
                        hasSubCategories: productType.hasSubCategories,
                    }));
                setProductTypes(displayProductTypes);
            } catch (error) {
                console.log("Error while fetching all Product Types: ", error);
            } finally {
                setLoading(false);
            }
        }
        allProductTypes();
    },[]);
    

    const handleFormDataChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Form Data: ", formData);
        try {
            await apiFunc().post("/subCategory/create-SubCategory", {
                name: formData.name,
                productTypeName: formData.productTypeName,
                basePrice: formData.basePrice,
            });
            toast.success("Subcategory added successfully!");
            if(onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.log("Error while adding new subcategory: ", error);
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
                        <h2 className="text-xl sm:text-2xl font-semibold font-playfair">Add New Subcategory</h2>
                        <p className="text-sm text-[#8a6f56]">Fill in the details to add a new subcategory to your inventory.</p>
                        </div>
                        <button onClick={onClose} className="text-[#8a6f56] hover:text-[#3e2d26]">
                        <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Subcategory Name</label>
                                <input type="text" 
                                name="name"
                                value = {formData.name}
                                onChange = {handleFormDataChange}
                                placeholder="Enter subcategory name" 
                                className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Base Price (₹)</label>
                                <input type="number"
                                name="basePrice"
                                value = {formData.basePrice} 
                                onChange = {handleFormDataChange} 
                                placeholder="0.00" 
                                className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Parent Category</label>
                                <select 
                                value={selectedProductType}
                                onChange = {(e) => {
                                    setSelectedProductType(e.target.value);
                                    setFormData((prev) => ({...prev, productTypeName: e.target.value}));
                                }}
                                className="w-full border rounded-md px-3 py-2 bg-white text-sm">
                                <option value="" disabled>Select Category</option>
                                {productTypes.map((productType) => 
                                    productType.hasSubCategories && (
                                        <option key={productType.name} value={productType.name}>
                                            {productType.name}
                                        </option>
                                    )
                                )}
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                        <button type="button" className="px-4 py-2 text-sm border border-[#3e2d26] rounded-md text-[#3e2d26] hover:bg-[#f9ece0]" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm bg-[#3e2d26] text-white rounded-md hover:bg-[#5b362a]" onClick = {(e) => {
                            handleSubmit(e);
                            onClose();
                        }}>
                            Add Subcategory
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

export default AddSubCategoryModal;
