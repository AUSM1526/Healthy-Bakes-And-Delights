import { X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

const AddProductModal = ({ onClose , onSuccess }) => {
    const [imageFiles, setImageFiles] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        productTypeName: "",
        subCategoryName: "",
        description: "",
        additionalPrice: "",
        images: [],
        stock: "",
    });
    const [productTypes, setProductTypes] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProductType, setSelectedProductType] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [hasSubCategories, setHasSubCategories] = useState(false);
    

    const handleFormDataChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleImageChange = (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files);
        setImageFiles(files);

        const previewFiles = files.map((file) => URL.createObjectURL(file));
        setImagesPreview(previewFiles);
        //console.log("Preview Files: ",previewFiles);
    }

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
                //console.log("Product Types: ",displayProductTypes);
                setProductTypes(displayProductTypes);
            } catch (error) {
                console.log("Error while fetching all Product Types: ", error);
            } finally {
                setLoading(false);
            }
        }
        allProductTypes();
    },[]);

    const fetchSubCategories = async (productTypeId) => {
        setLoading(true);
        try {
            const res = await apiFunc().get(`/subCategory/get-all-subCategories-by-productType?productTypeId=${productTypeId}`);
            const subCat = res.data.data.subCategories;
            const displaySubCategories = subCat.map((sub) => ({
                id: sub._id,
                name: sub.name,
            }));
            setSubCategories(displaySubCategories);
        } catch (error) {
            console.log("Error while fetching all Sub Categories: ", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("productTypeName", formData.productTypeName);
        formDataToSend.append("subCategoryName", formData.subCategoryName);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("additionalPrice", formData.additionalPrice);
        formDataToSend.append("stock", formData.stock);
        
        if(imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formDataToSend.append("images", file);
            });
        }
        try {
            console.log("Form Data: ",formData);
            const res = await apiFunc().post("/product/create-product", formDataToSend);
            toast.success("Product added successfully!");
            if(onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error("Error while adding new product!");
            console.log("Error while adding new product: ", error);
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
                        <h2 className="text-xl sm:text-2xl font-semibold font-playfair">Add New Product</h2>
                        <p className="text-sm text-[#8a6f56]">Fill in the details to add a new product to your inventory.</p>
                        </div>
                        <button onClick={onClose} className="text-[#8a6f56] hover:text-[#3e2d26]">
                        <X size={20} />
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div className="border border-dashed border-[#e5c8b1] rounded-md bg-[#fffdfc] p-6 flex flex-col items-center justify-center text-center mb-6 w-full">
                            <Upload className="w-8 h-8 text-[#8a6f56] mb-2" />
                            <p className="text-sm text-[#8a6f56]">Drag & drop product image here</p>
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

                            {imagesPreview.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-4 w-full">
                                {imagesPreview.map((src, idx) => (
                                    <img
                                    key={idx}
                                    src={src}
                                    alt={`Preview ${idx}`}
                                    className="w-full h-24 object-cover rounded-md border"
                                    />
                                ))}
                                </div>
                            )}
                        </div>

                    {/* Form */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Product Name</label>
                                <input type="text" 
                                name="name"
                                value = {formData.name}
                                onChange = {handleFormDataChange}
                                placeholder="Enter product name" 
                                className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Price (₹)</label>
                                <input type="number"
                                name="additionalPrice"
                                value = {formData.additionalPrice} 
                                onChange = {handleFormDataChange} 
                                placeholder="0.00" 
                                className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Category</label>
                                <select 
                                value={selectedProductType}
                                onChange = {(e) => {
                                    setSelectedProductType(e.target.value);
                                    setFormData((prev) => ({...prev, productTypeName: e.target.value}));
                                    const selectedType = productTypes.find((type) => type.name === e.target.value);
                                    setHasSubCategories(selectedType?.hasSubCategories);
                                    fetchSubCategories(selectedType?.id);
                                }}
                                className="w-full border rounded-md px-3 py-2 bg-white text-sm">
                                <option value="" disabled>Select Category</option>
                                {productTypes.map((productType) => (
                                    <option key={productType.name} value={productType.name}>
                                        {productType.name}
                                    </option>
                                ))}
                                </select>
                            </div>
                            <div>
                                {hasSubCategories && (
                                    <>
                                        <label className="block text-sm mb-1">Subcategory</label>
                                        <select
                                        value = {selectedSubCategory}
                                        onChange = {(e) => {
                                        setSelectedSubCategory(e.target.value)
                                        setFormData((prev) => ({...prev, subCategoryName: e.target.value}));
                                        }}
                                        className="w-full border rounded-md px-3 py-2 bg-white text-sm">
                                        <option value="" disabled>Select SubCategory</option>
                                            {subCategories.map((sub) => (
                                                <option key={sub.name} value={sub.name}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea rows="3" 
                        onChange = {handleFormDataChange} 
                        name="description"
                        value = {formData.description}
                        placeholder="Enter product description" 
                        className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Stock Quantity</label>
                            <input type="number" 
                            name="stock"
                            value = {formData.stock}
                            onChange = {handleFormDataChange} 
                            placeholder="0" 
                            className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                        </div>
                        {/* <div>
                            <label className="block text-sm mb-1">SKU</label>
                            <input type="text" placeholder="Enter SKU" className="w-full border rounded-md px-3 py-2 bg-white text-sm" />
                        </div> */}
                        </div>

                        {/* <div className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" id="featured" className="accent-[#3e2d26]" />
                        <label htmlFor="featured" className="text-sm text-[#3e2d26]">Mark as featured product</label>
                        </div> */}

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                        <button type="button" className="px-4 py-2 text-sm border border-[#3e2d26] rounded-md text-[#3e2d26] hover:bg-[#f9ece0]" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm bg-[#3e2d26] text-white rounded-md hover:bg-[#5b362a]" onClick = {(e) => {
                            handleSubmit(e);
                            onClose()
                        }}>
                            Add Product
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

export default AddProductModal;
