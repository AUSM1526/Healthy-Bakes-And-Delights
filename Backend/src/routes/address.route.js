import {Router} from "express";
import { addAddress, deleteAddress, updateAddress } from "../controllers/address.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const addressRouter = Router();
addressRouter.route("/add-address").post(verifyJWT,addAddress);
addressRouter.route("/:addressId").patch(verifyJWT,updateAddress);
addressRouter.route("/:addressId").delete(verifyJWT,deleteAddress);

export default addressRouter;