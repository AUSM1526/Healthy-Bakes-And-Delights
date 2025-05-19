import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2 } from "lucide-react";
import SideBar from "../../components/Sidebar";
import { apiFunc } from "../../utils/apiClient";
import Spinner from "../../components/Spinner";
import AddProductModal from "../../components/Admin/AddProductModal";
import EditProductModal from "../../components/Admin/EditProductModal";
import DeleteProductModal from "../../components/Admin/DeleteProductModal";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    images: [],
    subCategory: "",
    categoryId: "",
    id: "",
  });

  const allProducts = async () => {
    setLoading(true);
    try {
      const res = await apiFunc().get("/product/get-all-products");
      const fetchedProducts = res.data.data.products;

      const displayProducts = fetchedProducts.map((product) => ({
        id: product._id,
        productTypeId: product.productType._id,
        image: product.images[0],
        productName: product.name,
        subCategoryName: product.subCategory ? product.subCategory.name : "",
        productType: product.productType.name,
        basePrice: product.subCategory ? product.subCategory.basePrice : 0,
        additionalPrice: product.additionalPrice,
        stock: product.stock,
        description: product.description,
        images: product.images,
      }));
      setProducts(displayProducts);
    } catch (error) {
      console.log("Error while fetching all Products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allProducts();
  }, []);

  return (
      <>
        {!loading && (
          <div className="min-h-screen bg-[#fdf7f0] text-[#3e2d26] flex flex-col sm:flex-row">
            <SideBar />

            <div className="flex-1 p-6 py-12 sm:p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-playfair font-bold">Products</h1>
                  <p className="text-sm text-[#8a6f56]">Manage your product inventory</p>
                </div>
                <button
                  className="bg-chocolate-buttonColor text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-chocolate-buttonHover font-serif"
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 text-[#a58d7d]" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c2a188] bg-white"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-md hover:bg-[#f3e5d8] self-start sm:self-auto">
                  <Filter size={18} />
                </button>
              </div>

              {/* Product Table - Desktop */}
              <div className="hidden sm:block overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-chocolate-light text-[#3e2d26]">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium font-serif">Image</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Product</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Category</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Price</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Stock</th>
                      <th className="px-4 py-3 text-left font-medium font-serif">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#3e2d26]">
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <div className="w-16 h-16 bg-[#f3e7da] rounded-md overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium font-serif">
                          {product.subCategoryName} {product.productName}
                        </td>
                        <td className="px-4 py-3 font-serif">{product.productType}</td>
                        <td className="px-4 py-3 font-serif">
                          ₹{product.basePrice + product.additionalPrice}
                        </td>
                        <td className="px-4 py-3 font-serif">{product.stock}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              className="px-3 py-2 text-sm flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif"
                              onClick={() => {
                                setShowEditModal(true);
                                setSelectedProduct({
                                  name: product.productName,
                                  price: product.additionalPrice,
                                  category: product.productType,
                                  subCategory: product.subCategoryName,
                                  stock: product.stock,
                                  description: product.description,
                                  images: product.images,
                                  categoryId: product.productTypeId,
                                  id: product.id,
                                });
                              }}
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button className="px-3 py-2 text-sm text-red-600 flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif" onClick = {() => {
                              setShowDeleteModal(true);
                               setSelectedProduct({
                                  name: product.productName,
                                  price: product.additionalPrice,
                                  category: product.productType,
                                  subCategory: product.subCategoryName,
                                  stock: product.stock,
                                  description: product.description,
                                  images: product.images,
                                  categoryId: product.productTypeId,
                                  id: product.id,
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
              <div className="space-y-4 sm:hidden mt-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                  >
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 gap-3">
                      <div className="w-full flex items-center gap-3">
                        <div className="w-16 h-16 bg-[#f3e7da] rounded-md overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="font-semibold font-serif text-base">
                            {product.subCategoryName} {product.productName}
                          </h2>
                          <p className="text-sm text-[#8a6f56]">{product.productType}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 xs:mt-0">
                        <button
                          className="px-2 py-1 text-xs flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif"
                          onClick={() => {
                            setShowEditModal(true);
                            setSelectedProduct({
                              name: product.productName,
                              price: product.basePrice + product.additionalPrice,
                              category: product.productType,
                              subCategory: product.subCategoryName,
                              stock: product.stock,
                              description: product.description,
                              images: product.images,
                              categoryId: product.productTypeId,
                              id: product.id,
                            });
                          }}
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs text-red-600 flex items-center gap-1 border rounded hover:bg-chocolate-light font-serif" onClick = {() => {
                            setShowDeleteModal(true);
                            setSelectedProduct({
                                  name: product.productName,
                                  price: product.additionalPrice,
                                  category: product.productType,
                                  subCategory: product.subCategoryName,
                                  stock: product.stock,
                                  description: product.description,
                                  images: product.images,
                                  categoryId: product.productTypeId,
                                  id: product.id,
                                });
                          }} >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-[#3e2d26] space-y-1">
                      <div>
                        <span className="font-medium font-serif">Price:</span> ₹
                        {product.basePrice + product.additionalPrice}
                      </div>
                      <div>
                        <span className="font-medium font-serif">Stock:</span> {product.stock}
                      </div>
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
          <AddProductModal onClose={() => setShowModal(false)} onSuccess={() => allProducts()} />
        )}

        {showEditModal && (
          <EditProductModal product={selectedProduct} onClose={() => setShowEditModal(false)} onSuccess={() => allProducts()} />
        )}

        {showDeleteModal && (
          <DeleteProductModal isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={() => allProducts()}
            productName={selectedProduct.name} 
            subCategory={selectedProduct.subCategory} 
            productId={selectedProduct.id}
          />
        )}
      </>
    );
};

export default AdminProductsPage;
