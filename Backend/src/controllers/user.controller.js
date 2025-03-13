import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {deleteFromCloudinary} from "../utils/cloudinary.js";

//Function to genearate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccesToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save( {validateBeforeSave: false} );
    
        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
}

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

// Login Function
const loginUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const {username, email, phoneNumber, password} = req.body;
    if(!username && !email || !phoneNumber){
        throw new ApiError(400, "username,email or phonenumber required for Login");
    }

    if(!password){
        throw new ApiError(400, "Password is required for Login");
    }

    // find user
    const user = await User.findOne({
        $or: [{ username },{ email },{ phoneNumber }]
    });

    if(!user){
        throw new ApiError(404, "User not registered");
    }

    const isPassword = await user.isPasswordCorrect(password);

    if(!isPassword){
        throw new ApiError(401, "Invalid password");
    }

    // generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // return response
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser,accessToken, refreshToken
            }, 
            "User Logged In successfully"
        )
    )

});

// Logout Function
const logoutUser = asyncHandler(async (req, res) => {
    // remove refreshToken from user document
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1 // this removes the field from the document
            }
        },
        {
            new: true
        }
    )

    // clear cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
});

// Refresh AccessToken Function
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log("Incoming Refresh Token: ",incomingRefreshToken);

    if(!incomingRefreshToken){
        throw new ApiError(401, "IncomingRefreshToken, unauthorized request");
    }

    try {
        // verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

        // find user
        const user = await User.findById(decodedToken?._id);

        if(!user)
        {
            throw new ApiError(401, "Invalid Refresh Token,User not found");
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is either expired or used");
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access Token Refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, "Invalid Refresh Token");
    }
});

// Change Password Function
const changePassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new ApiError(400, "Old Password and New Password are required");
    }

    const user = await User.findById(req.user?._id);
    const isPassword = await user.isPasswordCorrect(oldPassword);

    if(!isPassword){
        throw new ApiError(400, "Please enter correct old password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
});

// Update Name Function
const updateName = asyncHandler(async (req, res) => {
    const {firstName, lastName} = req.body;

    if(!firstName || !lastName){
        throw new ApiError(400, "First Name and Last Name are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                firstName,
                lastName
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, {user}, "Name updated successfully")
    )
});

//Update Avatar Function
const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(500, "Error while uploading Avatar file");
    }

    const user = await User.findById(req.user?._id).select(
        "-password -refreshToken"
    );
    const match = user.avatar ? user.avatar.match(/\/([^\/]+)\.\w+$/) : null;

    const oldAvatarPublicId = match ? match[1] : null;

    user.avatar = avatar.url;
    await user.save({validateBeforeSave: false});

    // delete old avatar from cloudinary
    if(oldAvatarPublicId){
        try {
            console.log("oldAvatarPublicId: ",oldAvatarPublicId);
            await deleteFromCloudinary(oldAvatarPublicId);
        } catch (error) {
            console.error("Failed to delete old avatar from Cloudinary:", error);
        }
    }
    
    return res.status(200).json(
        new ApiResponse(200, {user}, "Avatar updated successfully")
    )

});

// Get User Details
const getUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(404, "User not found, while fetching details");
    }

    return res.status(200).json(
        new ApiResponse(200, {user}, "User details fetched successfully")
    );
});

// Get Order History

// Add to Cart

// Delete from Cart

// Get Cart

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateName,
    updateAvatar,
    getUserDetails
};