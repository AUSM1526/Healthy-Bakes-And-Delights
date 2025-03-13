import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {createSubCategory,updateSubCategory,deleteSubCategory} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.route("/create-SubCategory").post(verifyJWT, isAdmin, createSubCategory);
subCategoryRouter.route("/:subCategoryId").patch(verifyJWT, isAdmin, updateSubCategory);
subCategoryRouter.route("/:subCategoryId").delete(verifyJWT, isAdmin, deleteSubCategory);

export default subCategoryRouter;
