import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js";
import {upload} from "../utils/multer.js";

const userRoute = Router();

userRoute.route("/register").post(upload.single("avatar"),registerUser);

export default userRoute;