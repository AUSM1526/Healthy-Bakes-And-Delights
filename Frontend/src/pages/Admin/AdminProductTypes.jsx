import { useEffect, useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2 } from "lucide-react";
import SideBar from "../../components/Sidebar";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import AddProductTypeModal from "../../components/Admin/AddProductTypeModal";
import EditProductTypeModal from "../../components/Admin/EditProductTypeModal";
import DeleteProductTypeModal from "../../components/Admin/DeleteProductTypeModal";

const AdminProductTypesPage = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedProductType, setSelectedProductType] = useState({
    id: "",
    name: "",
    hasSubCategories: false,
    image: "",
  });

  const [productTypes, setProductTypes] = useState([]);

  const allProductTypes = async () => {
        setLoading(true);
        try {
            const res = await apiFunc().get("/productType/get-products-per-product-type");
            const fetchedProductTypes = res.data.data.productsPerProductType;
            const displayProductTypes = fetchedProductTypes.map((productType) => ({
                    id: productType.productType._id,
                    name: productType.productType.name,
                    hasSubCategories: productType.productType.hasSubCategories,
                    image: productType.productType.image,
                    products: productType.count,
                }));
            setProductTypes(displayProductTypes);
        } catch (error) {
            console.log("Error while fetching all Product Types: ", error);
        } finally {
            setLoading(false);
        }
    }

  useEffect(() => {
        allProductTypes();
    },[]);

  return (
      <>
        {!loading && (
          <div className="min-h-screen bg-[#fdf7f0] text-[#3e2d26] flex flex-col sm:flex-row">
            <SideBar />

            <div className="flex-1 p-6 py-12 sm:p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-playfair font-bold">Product Types</h1>
                  <p className="text-sm text-[#8a6f56]">Manage your product categories and types</p>
                </div>
                <button
                  className="bg-chocolate-buttonColor text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-chocolate-buttonHover font-serif"
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Product Type
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 text-[#a58d7d]" size={18} />
                  <input
                    type="text"
                    placeholder="Search product types..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c2a188] bg-white"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-md hover:bg-[#f3e5d8] self-start sm:self-auto">
                  <Filter size={18} />
                </button>
              </div>

              {/* ProductType Table - Desktop */}
              <div className="hidden sm:block overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-chocolate-light text-[#3e2d26]">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium font-serif">Image</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Product Type Name</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Products</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#3e2d26]">
                    {productTypes.map((productType) => (
                      <tr key={productType.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <div className="w-16 h-16 bg-[#f3e7da] rounded-md overflow-hidden">
                            <img
                              src={productType.image}
                              alt={productType.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium font-serif">
                          {productType.name}
                        </td>
                        <td className="px-4 py-3 font-medium font-serif">
                          {productType.products}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              className="px-3 py-2 text-sm flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif"
                              onClick={() => {
                                setSelectedProductType({
                                  id: productType.id,
                                  name: productType.name,
                                  hasSubCategories: productType.hasSubCategories,
                                  image: productType.image,
                                });
                                setShowEditModal(true);
                              }}
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button className="px-3 py-2 text-sm text-red-600 flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif" onClick = {() => {
                              setShowDeleteModal(true);
                               setSelectedProductType({
                                  id: productType.id,
                                  name: productType.name,
                                  hasSubCategories: productType.hasSubCategories,
                                  image: productType.image,
                                });
                              }}>
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-5 sm:hidden mt-6">
                    {productTypes.map((productType) => (
                        <div
                        key={productType.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-md p-4"
                        >
                        <div className="flex items-center gap-4">
                            {/* Image */}
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#f3e7da] flex-shrink-0">
                            <img
                                src={productType.image}
                                alt={productType.name}
                                className="w-full h-full object-cover"
                            />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                            <h2 className="text-lg font-playfair font-semibold text-[#3e2d26] leading-snug">
                                {productType.name}
                            </h2>
                            <p className="text-sm text-[#8a6f56] font-serif mt-1">
                                Products: {/* You can change this logic later */}
                                <span className="font-medium text-[#3e2d26] ml-1">{productType.products}</span>
                            </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                            className="px-3 py-1.5 text-xs border border-gray-300 rounded-md flex items-center gap-1 hover:bg-chocolate-light font-serif"
                            onClick={() => {
                                setSelectedProductType({
                                  id: productType.id,
                                  name: productType.name,
                                  hasSubCategories: productType.hasSubCategories,
                                  image: productType.image,
                                });
                                setShowEditModal(true);
                            }}
                            >
                            <Pencil size={12} />
                            Edit
                            </button>

                            <button
                            className="px-3 py-1.5 text-xs text-red-600 border border-red-300 rounded-md flex items-center gap-1 hover:bg-chocolate-light font-serif"
                            onClick={() => {
                                setShowDeleteModal(true);
                                setSelectedProductType({
                                  id: productType.id,
                                  name: productType.name,
                                  hasSubCategories: productType.hasSubCategories,
                                  image: productType.image,
                                });
                            }}
                            >
                            <Trash2 size={12} />
                            Delete
                            </button>
                        </div>
                        </div>
                    ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-screen bg-[#fdf7f0]">
            <Spinner />
          </div>
        )}

        {showModal && (
          <AddProductTypeModal onClose={() => setShowModal(false)} onSuccess={() => allProductTypes()} />
        )}

        {showEditModal && (
          <EditProductTypeModal productType={selectedProductType} onClose={() => setShowEditModal(false)} onSuccess={() => allProductTypes()} />
        )}

        {showDeleteModal && (
          <DeleteProductTypeModal isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={() => allProductTypes()}
            productTypeId={selectedProductType.id}
            productTypeName={selectedProductType.name}
          />
        )}
      </>
    );
};

export default AdminProductTypesPage;
