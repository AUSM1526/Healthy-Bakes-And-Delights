import {Router} from "express";
import {addProductType,getAllProductTypes,updateProductType,deleteProductType} from "../controllers/productType.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const productTypeRouter = Router();

productTypeRouter.route("/add-product-type").post(verifyJWT,isAdmin,addProductType);
productTypeRouter.route("/get-all-productTypes").get(verifyJWT,isAdmin,getAllProductTypes);
productTypeRouter.route("/:productTypeid").patch(verifyJWT,isAdmin,updateProductType);
productTypeRouter.route("/:productTypeid").delete(verifyJWT,isAdmin,deleteProductType);

export default productTypeRouter;