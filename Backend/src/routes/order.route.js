import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"; 
import {placeSingleOrder, placeCartOrder, getAllOrders, updateOrderStatus, cancelOrder, uploadPaymentScreenshot, updatePaymentScreenshot, approveOrder, notApproveOrder} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.route("/placeSingleOrder").post(verifyJWT, placeSingleOrder);
orderRouter.route("/placeCartOrder").post(verifyJWT, placeCartOrder);
orderRouter.route("/getAllOrders").get(verifyJWT, isAdmin, getAllOrders);
orderRouter.route("/updateOrderStatus").patch(verifyJWT, isAdmin, updateOrderStatus);
orderRouter.route("/cancelOrder").patch(verifyJWT, cancelOrder);
orderRouter.route("/uploadPaymentScreenshot").post(verifyJWT, upload.single("screenshot"), uploadPaymentScreenshot);
orderRouter.route("/updatePaymentScreenshot").patch(verifyJWT, upload.single("screenshot"), updatePaymentScreenshot);
orderRouter.route("/approveOrder").patch(verifyJWT, isAdmin, approveOrder);
orderRouter.route("/notApproveOrder").patch(verifyJWT, isAdmin, notApproveOrder);

export default orderRouter;