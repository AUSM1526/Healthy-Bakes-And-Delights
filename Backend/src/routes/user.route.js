import {Router} from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,changePassword,updateName,updateAvatar, getUserDetails, addToCart, removeFromCart, viewCart,getOrderHistory, getOrdersByStatus, sendOtp, verifyOtp} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"),registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.route("/logout").post(verifyJWT,logoutUser);
userRouter.route("/change-password").patch(verifyJWT,changePassword);
userRouter.route("/update-name").patch(verifyJWT,updateName);
userRouter.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar);
userRouter.route("/user-details").get(verifyJWT,getUserDetails);
userRouter.route("/add-to-cart").post(verifyJWT,addToCart);
userRouter.route("/remove-from-cart").delete(verifyJWT,removeFromCart);
userRouter.route("/view-cart").get(verifyJWT,viewCart);
userRouter.route("/order-history").get(verifyJWT, getOrderHistory);
userRouter.route("/orders-by-status").get(verifyJWT, getOrdersByStatus);
userRouter.route("/send-otp").post(sendOtp);
userRouter.route("/verify-otp").post(verifyOtp);

export default userRouter;