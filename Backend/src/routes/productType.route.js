import {Router} from "express";
import {addProductType,getAllProductTypes,updateProductType,deleteProductType,updateImage} from "../controllers/productType.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";

const productTypeRouter = Router();

productTypeRouter.route("/add-product-type").post(verifyJWT,isAdmin,upload.single("image"),addProductType);
productTypeRouter.route("/get-all-productTypes").get(getAllProductTypes);
productTypeRouter.route("/update-ProductType").patch(verifyJWT,isAdmin,updateProductType);
productTypeRouter.route("/delete-productType").delete(verifyJWT,isAdmin,deleteProductType);
productTypeRouter.route("/update-productType-image").patch(verifyJWT,isAdmin,upload.single("image"),updateImage);

export default productTypeRouter;