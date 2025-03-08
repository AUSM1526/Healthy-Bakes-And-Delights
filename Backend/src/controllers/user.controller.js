import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

// Register Function
const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend
   const {username, email, firstName, lastName, phoneNumber,password} = req.body;
   const accountType = "user"; // for now only users can register

    // validate user data - not empty
    if(!username || !email || !lastName || !firstName || !phoneNumber || !password){
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists
    const existedUser = await User.findOne(
        {
            $or: [{ username },{ email },{ phoneNumber }]
        }
    );

    if(existedUser){
        throw new ApiError(400, "User already exists");
    }

    // Get avatarPath
    const avatarLocalPath = req.file?.path;
    console.log("Req.file: ",req.file?.path);

    // uploading avatar to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatar);
    console.log(avatar.url);

    // create user object
    const user = await User.create({
        username,
        email,
        firstName,
        lastName,
        phoneNumber,
        password,
        accountType,
        avatar: avatar==null ? null : avatar.url
    });

    if(!user){
        throw new ApiError(500, "User registration failed");
    }

    // remove password and refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // return response
    return res.status(201).json(
        new ApiResponse(200, {createdUser}, "User registered successfully")
    )
});

export {registerUser};