import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

const EditSubCategoryModal = ({ subCategory, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: subCategory.id,
    name: subCategory.name,
    productTypeName: subCategory.productTypeName,
    basePrice: subCategory.basePrice,
  });

  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState(subCategory.productTypeName);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveDetails = async (e) => {
    e.preventDefault();
    const subCategoryId = formData.id;
    setLoading(true);
    try {
        await apiFunc().patch(`/subCategory/${subCategoryId}`,{
            name: formData.name,
            productTypeName: selectedProductType,
            basePrice: formData.basePrice,
        });
        toast.success("Subcategory details updated successfully");
        if(onSuccess){
            onSuccess();
        }
    } catch (error) {
        console.log("Error while saving subcategory details: ", error);
    } finally{
        setLoading(false);
        onClose();
    }
  }

  
  return (
    <>
        {!loading && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-[#fef7f2] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif text-xl font-semibold text-[#5b3a29]">Edit Subcategory</h2>
                <button onClick={onClose}><X className="text-[#5b3a29]" /></button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                        <div>
                        <label className="text-sm text-gray-700">Subcategory Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 w-full border rounded-xl p-2"
                        />
                        </div>
                        <div>
                        <label className="text-sm text-gray-700">Base Price (₹)</label>
                        <input
                            type="number"
                            name="basePrice"
                            value={formData.basePrice}
                            onChange={handleInputChange}
                            className="mt-1 w-full border rounded-xl p-2"
                        />
                        </div>
                        <div>
                            <label className="text-sm text-gray-700">Parent Category</label>
                            <select
                                name="productTypeName"
                                value={selectedProductType}
                                onChange={(e) => {
                                    setSelectedProductType(e.target.value);
                                    setFormData((prev) => ({...prev, category: e.target.value}));
                                }}
                                className="mt-1 w-full border rounded-xl p-2"
                            >
                                {productTypes.map((productType) => (
                                    productType.hasSubCategories && (
                                        <option key={productType.name} value={productType.name}>
                                            {productType.name}
                                        </option>
                                    )
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-6 gap-3">
                    <button onClick={onClose} className="text-[#5b3a29] border px-4 py-2 rounded-xl hover:bg-chocolate-light">Cancel</button>
                    <button onClick={(e) => {
                        saveDetails(e);
                    }} className="bg-[#5b3a29] text-white px-4 py-2 rounded-xl hover:bg-chocolate-buttonColor">Save Changes</button>
                </div>
            </div>
        </div>
        )}

        {loading && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                <Spinner />
            </div>
        )}
    </>
  );
}

export default EditSubCategoryModal;
