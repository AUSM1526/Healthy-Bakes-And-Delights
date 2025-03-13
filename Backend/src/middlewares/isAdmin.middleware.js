import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

const isAdmin = asyncHandler(async (req, _ , next) => {
    try {
        const user = await User.findById(req.user?._id);

        if(!user){
            throw new ApiError(404, "User not found");
        }
    
        if(user.accountType !== "admin"){
            throw new ApiError(403, "You are not authorized to perform this action");
        }
        next();
    } catch (error) {
        throw new ApiError(500, "User role can't be verified");
    }
});

export { isAdmin };