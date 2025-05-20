import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

const EditProductModal = ({ product, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    category: product.category,
    stock: product.stock,
    description: product.description,
    subCategory: product.subCategory,
    categoryId: product.categoryId,
    id: product.id
  });

  const [images, setImages] = useState(product.images);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesPreview,setImagesPreview] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [productTypes, setProductTypes] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(product.category);
  const [selectedSubCategory, setSelectedSubCategory] = useState(product.subCategory ? product.subCategory : "");
  const [hasSubCategories, setHasSubCategories] = useState(true);

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
              //console.log("Sub Categories: ", displaySubCategories);
              setSubCategories(displaySubCategories);
          } catch (error) {
              console.log("Error while fetching all Sub Categories: ", error);
          } finally {
              setLoading(false);
          }
    }
  
    useEffect(() => {
        const selectedcategory = productTypes.find((type) => type.name === product.category);
        setHasSubCategories(selectedcategory?.hasSubCategories);
        if(product.subCategory){
            fetchSubCategories(product.categoryId);
        }
    },[productTypes, product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previewFiles = files.map((file) => URL.createObjectURL(file));
    setImagesPreview(previewFiles);
  };

  const toggleImageSelection = (img) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const saveProductDetails = async (e) => {
    e.preventDefault();
    const productId = formData.id;
    setLoading(true);

    try {
        const res = await apiFunc().patch(`/product/update-product/${productId}`,{
            name: formData.name,
            productTypeName: selectedProductType,
            subCategoryName: selectedSubCategory,
            description: formData.description,
            additionalPrice: formData.price,
            stock: formData.stock
        });
        toast.success("Product details updated successfully");
        if(onSuccess){
            onSuccess();
        }
    } catch (error) {
        console.log("Error while saving product details: ", error);
    } finally{
        setLoading(false);
        onClose();
    }
  }

  const saveProductImages = async (e) => {
    e.preventDefault();
    const productId = formData.id;
    setLoading(true);

    const formDataToSend = new FormData();
    if(imageFiles.length > 0) {
        imageFiles.forEach((file) => {
            formDataToSend.append("images", file);
        });
    }

    try {
        await apiFunc().patch(`/product/add-product-images?productId=${productId}`,formDataToSend);
        toast.success("Product images updated successfully");
        if(onSuccess){
            onSuccess();
        }
    } catch (error) {
        console.log("Error while saving product images: ", error);
    } finally{
        setLoading(false);
        onClose();
    }
  }

  const deleteImages = async() => {
    setLoading(true);
    try {
        for (const img of selectedImages) {
            await apiFunc().delete(`/product/delete-product-image?productId=${formData.id}&imageUrl=${encodeURIComponent(img)}`);
        }
        if(onSuccess){
            onSuccess();
        }
        onClose();
        toast.success("Selected images deleted successfully");
    } catch (error) {
        console.log("Error while deleting images: ", error);
    }
  }

  return (
    <>
        {!loading && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-[#fef7f2] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif text-xl font-semibold text-[#5b3a29]">Edit Product</h2>
                <button onClick={onClose}><X className="text-[#5b3a29]" /></button>
                </div>

                <div className="px-5 flex border-b border-gray-200">
                <button
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === "details" ? "bg-[#5b3a29] text-white" : "bg-transparent text-[#5b3a29]"}`}
                    onClick={() => setActiveTab("details")}
                >
                    Product Details
                </button>
                <button
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === "images" ? "bg-[#5b3a29] text-white" : "bg-transparent text-[#5b3a29]"}`}
                    onClick={() => setActiveTab("images")}
                >
                    Manage Images
                </button>
                </div>

                {activeTab === "details" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    <div>
                    <label className="text-sm text-gray-700">Product Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 w-full border rounded-xl p-2"
                    />
                    </div>
                    <div>
                    <label className="text-sm text-gray-700">Price (₹)</label>
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="mt-1 w-full border rounded-xl p-2"
                    />
                    </div>
                    <div>
                    <label className="text-sm text-gray-700">Category</label>
                    <select
                        name="category"
                        value={selectedProductType}
                        onChange={(e) => {
                            setSelectedProductType(e.target.value);
                            setFormData((prev) => ({...prev, category: e.target.value}));
                            const selectedType = productTypes.find((type) => type.name === e.target.value);
                            setHasSubCategories(selectedType?.hasSubCategories);
                            fetchSubCategories(selectedType?.id);
                        }}
                        className="mt-1 w-full border rounded-xl p-2"
                    >
                        {productTypes.map((productType) => (
                            <option key={productType.name} value={productType.name}>
                                {productType.name}
                            </option>
                        ))}
                    </select>
                    </div>
                    {hasSubCategories && (
                        <div>
                            <label className="text-sm text-gray-700">Subcategory</label>
                            <select
                                name="subCategory"
                                value={selectedSubCategory}
                                onChange={(e) => {
                                    setSelectedSubCategory(e.target.value)
                                    setFormData((prev) => ({...prev, subCategoryName: e.target.value}));
                                }}
                                className="mt-1 w-full border rounded-xl p-2"
                            >
                                {subCategories.map((sub) => (
                                    <option key={sub.name} value={sub.name}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                    <label className="text-sm text-gray-700">Stock Quantity</label>
                    <input
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="mt-1 w-full border rounded-xl p-2"
                    />
                    </div>
                    <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 w-full border rounded-xl p-2"
                    ></textarea>
                    </div>
                </div>
                ) : (
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-[#5b3a29]">Current Images</p>
                    <div className="flex gap-2">
                        <label className="inline-flex items-center cursor-pointer text-[#5b3a29]">
                        <Plus className="h-4 w-4 mr-1" /> Add Image
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        </label>
                        <button
                        onClick={deleteImages}
                        className="bg-red-200 text-red-800 px-3 py-1 rounded-xl flex items-center gap-1"
                        >
                        <Trash2 className="h-4 w-4" /> Delete Selected
                        </button>
                    </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <div
                        key={index}
                        onClick={() => toggleImageSelection(img)}
                        className={`aspect-square border rounded-xl relative cursor-pointer overflow-hidden ${
                            selectedImages.includes(img) ? "ring-4 ring-[#5b3a29]" : ""
                        }`}
                        >
                        <img src={img} alt="Product" className="object-cover w-full h-full" />
                        </div>
                    ))}
                    {imagesPreview.map((img, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => toggleImageSelection(img)}
                                
                                className={`aspect-square border rounded-xl relative cursor-pointer overflow-hidden ${
                                    selectedImages.includes(img) ? "ring-4 ring-[#5b3a29]" : ""
                                }`}
                                >
                                <img src={img} alt="Product" className="object-cover w-full h-full" />
                            </div>
                        )
                    })}
                    </div>
                </div>
                )}

                {activeTab === "details" && (
                    <div className="flex justify-end p-6 gap-3">
                    <button onClick={onClose} className="text-[#5b3a29] border px-4 py-2 rounded-xl hover:bg-chocolate-light">Cancel</button>
                    <button onClick={(e) => {
                        saveProductDetails(e);
                    }} className="bg-[#5b3a29] text-white px-4 py-2 rounded-xl hover:bg-chocolate-buttonColor">Save Changes</button>
                </div>
                )}

                {activeTab === "images" && (
                    <div className="flex justify-end p-6 gap-3">
                    <button onClick={onClose} className="text-[#5b3a29] border px-4 py-2 rounded-xl hover:bg-chocolate-light">Cancel</button>
                    <button onClick={(e) => {
                        saveProductImages(e);
                    }} className="bg-[#5b3a29] text-white px-4 py-2 rounded-xl hover:bg-chocolate-buttonColor">Save Changes</button>
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

export default EditProductModal;
