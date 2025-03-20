import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import { createProduct, getProductsWithSubcategory, updateProductDetails,deleteProductImage, addProductImages, deleteProduct, getProductDetails} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.route("/create-product").post(verifyJWT,isAdmin,upload.array("images",5),createProduct);
productRouter.route("/get-products-with-subcategory").get(getProductsWithSubcategory);
productRouter.route("/update-product/:productId").patch(verifyJWT,isAdmin,updateProductDetails);
productRouter.route("/delete-product-image").delete(verifyJWT,isAdmin,deleteProductImage);
productRouter.route("/add-product-images").patch(verifyJWT,isAdmin,upload.array("images",5),addProductImages);
productRouter.route("/delete-product").delete(verifyJWT,isAdmin,deleteProduct);
productRouter.route("/get-product-details").get(getProductDetails);

export default productRouter;