import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {placeSingleOrder, placeCartOrder, getAllOrders, updateOrderStatus, cancelOrder, approveOrder, notApproveOrder,orderQrCode} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.route("/placeSingleOrder").post(verifyJWT, placeSingleOrder);
orderRouter.route("/placeCartOrder").post(verifyJWT, placeCartOrder);
orderRouter.route("/getAllOrders").get(verifyJWT, isAdmin, getAllOrders);
orderRouter.route("/updateOrderStatus").patch(verifyJWT, isAdmin, updateOrderStatus);
orderRouter.route("/cancelOrder").patch(verifyJWT, cancelOrder);
orderRouter.route("/approveOrder").patch(verifyJWT, isAdmin, approveOrder);
orderRouter.route("/notApproveOrder").patch(verifyJWT, isAdmin, notApproveOrder);
orderRouter.route("/orderQrCode").post(verifyJWT, orderQrCode);

export default orderRouter;