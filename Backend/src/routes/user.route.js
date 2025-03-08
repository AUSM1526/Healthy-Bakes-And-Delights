import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

const userRoute = Router();

userRoute.route("/register").post(upload.single("avatar"),registerUser);

export default userRoute;