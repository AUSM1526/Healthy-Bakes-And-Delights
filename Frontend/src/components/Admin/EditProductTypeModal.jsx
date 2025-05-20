import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

const EditProductTypeModal = ({ productType, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    id: productType.id,
    name: productType.name,
    hasSubCategories: productType.hasSubCategories,
    image: productType.image,
  });

  const [image, setImage] = useState(productType.image);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview,setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImageFile(file);

    const previewFile = URL.createObjectURL(file);
    setImagePreview(previewFile);
  };

  const saveProductTypeDetails = async (e) => {
    e.preventDefault();
    const productTypeId = formData.id;
    setLoading(true);
    try {
        await apiFunc().patch(`/productType/update-ProductType?productTypeid=${productTypeId}`,{
            name: formData.name,
            hasSubCategories: formData.hasSubCategories,
        });
        toast.success("Product type details updated successfully");
        if(onSuccess){
            onSuccess();
        }
    } catch (error) {
        console.log("Error while saving product type details: ", error);
    } finally{
        setLoading(false);
        onClose();
    }
  }

  const saveProductTypeImage = async (e) => {
    e.preventDefault();
    const productTypeId = formData.id;
    setLoading(true);

    const formDataToSend = new FormData();
     formDataToSend.append("image", imageFile);

    try {
        await apiFunc().patch(`/productType/update-productType-image?productTypeid=${productTypeId}`,  formDataToSend);
        toast.success("Product type image updated successfully");
        if(onSuccess){
            onSuccess();
        }
    } catch (error) {
        console.log("Error while saving product type image: ", error);
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
                <h2 className="font-serif text-xl font-semibold text-[#5b3a29]">Edit Product Type</h2>
                <button onClick={onClose}><X className="text-[#5b3a29]" /></button>
                </div>

                <div className="px-5 flex border-b border-gray-200">
                <button
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === "details" ? "bg-[#5b3a29] text-white" : "bg-transparent text-[#5b3a29]"}`}
                    onClick={() => setActiveTab("details")}
                >
                    Product Type Details
                </button>
                <button
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === "images" ? "bg-[#5b3a29] text-white" : "bg-transparent text-[#5b3a29]"}`}
                    onClick={() => setActiveTab("images")}
                >
                    Manage Image
                </button>
                </div>

                {activeTab === "details" ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                        <div>
                        <label className="text-sm text-gray-700">Product Type Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 w-full border rounded-xl p-2"
                        />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 ml-7">
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
                        {formData.hasSubCategories && <p className="text-xs text-gray-500 ml-7">This product type includes subcategories.</p>}
                    </div>
                </div>
                ) : (
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-[#5b3a29]">Current Images</p>
                    <div className="mr-5">
                        <label className="inline-flex items-center cursor-pointer text-[#5b3a29]">
                        Update Image
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        </label>
                    </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="aspect-square border rounded-xl relative cursor-pointer overflow-hidden">
                            <img src={imagePreview || image} alt="Product" className="object-cover w-full h-full rounded-md" />
                        </div>
                    </div>
                </div>
                )}

                {activeTab === "details" && (
                    <div className="flex justify-end p-6 gap-3">
                    <button onClick={onClose} className="text-[#5b3a29] border px-4 py-2 rounded-xl hover:bg-chocolate-light">Cancel</button>
                    <button onClick={(e) => {
                        saveProductTypeDetails(e);
                    }} className="bg-[#5b3a29] text-white px-4 py-2 rounded-xl hover:bg-chocolate-buttonColor">Save Changes</button>
                </div>
                )}

                {activeTab === "images" && (
                    <div className="flex justify-end p-6 gap-3">
                    <button onClick={onClose} className="text-[#5b3a29] border px-4 py-2 rounded-xl hover:bg-chocolate-light">Cancel</button>
                    <button className="bg-[#5b3a29] text-white px-4 py-2 rounded-xl hover:bg-chocolate-buttonColor"
                        onClick={(e) => {
                            saveProductTypeImage(e);
                        }}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
                )}
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

export default EditProductTypeModal;
