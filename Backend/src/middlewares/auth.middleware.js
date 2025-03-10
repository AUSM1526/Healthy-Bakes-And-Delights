import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _ , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("verifyJWTToken: ", token);

        if(!token){
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        console.log("decodedToken: ", decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        //console.log("userName: ", user.username);
        if (!user) {
            throw new ApiError(401, "Invalid Access Token, User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});