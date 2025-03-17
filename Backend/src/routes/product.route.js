import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.route("/create-product").post(verifyJWT,isAdmin,upload.array("images",5),createProduct);

export default productRouter;