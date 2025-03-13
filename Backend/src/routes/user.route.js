import {Router} from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,changePassword,updateName,updateAvatar, getUserDetails} from "../controllers/user.controller.js";
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

export default userRouter;