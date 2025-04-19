import {Router} from "express";
import { addAddress, deleteAddress, updateAddress, getAddressDetails } from "../controllers/address.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const addressRouter = Router();
addressRouter.route("/add-address").post(verifyJWT,addAddress);
addressRouter.route("/:addressId").patch(verifyJWT,updateAddress);
addressRouter.route("/:addressId").delete(verifyJWT,deleteAddress);
addressRouter.route("/get-address").get(verifyJWT,getAddressDetails);

export default addressRouter;