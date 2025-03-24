import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {deleteFromCloudinary} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import {Product} from "../models/product.model.js";
import {OTP} from "../models/otp.model.js";
import { mailSender } from "../utils/mailSender.js";
import {otpTemplate} from "../mailTemplates/emailVerification.js";
import bcrypt from "bcrypt";

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

// sendOtp Function
const sendOtp = asyncHandler(async (req, res) => {
    const {email} = req.body;
    if(!email){
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({email});
    if(user){
        throw new ApiError(400, "User already Registered");
    }
    
    const otp = `${Math.floor(1000 + Math.random()*9000)}`;
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    const newotp = await OTP.create({
        email,
        otp: hashedOtp,
    })
    
    const body = otpTemplate(otp,process.env.MAIL_USER);
    
    await mailSender(email, "OTP Verification",body);
    return res.status(200).json(
        new ApiResponse(200, {newotp}, "OTP sent successfully")
    );
});

// verify otp Function
const verifyOtp = asyncHandler(async (req, res) => {
    const {email, otp} = req.body;
    if(!email || !otp){
        throw new ApiError(400, "Email and OTP are required");
    }
    
    const existingOtp = await OTP.findOne({email});
    if(!existingOtp){
        throw new ApiError(404, "OTP not found or expired");
    }

    const isOtpValid = await bcrypt.compare(otp, existingOtp.otp);
    if(!isOtpValid){
        throw new ApiError(400, "Invalid OTP");
    }

    //await OTP.deleteOne({email});
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Email verified successfully")
    );
});

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
const getOrderHistory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const orders = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: 'orders',
                localField: '_id',
                foreignField: 'user',
                as: 'orderHistory'
            }
        },
        {
            $unwind: "$orderHistory"
        },
        {
            $project:{
                "orderHistory.status": 1,                     
                "orderHistory.products.product": 1,          
                "orderHistory.products.price": 1,            
                "orderHistory.products.quantity": 1,         
                "orderHistory.totalPrice": 1,       
                "orderHistory.createdAt": 1 
            }
        },
        {
            $group:{
                _id: userId,
                orderHistory: {$push: "$orderHistory"}
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {orders}, "Order History fetched successfully")
    );
});

// Get All Orders by status
const getOrdersByStatus = asyncHandler(async (req, res, next) => {
    const { orderStatus } = req.query;
    const userId = req.user?._id;
    const user = await User.findById(userId).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const orders = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: 'orders',
                localField: '_id',
                foreignField: 'user',
                as: 'orderHistory',
                pipeline:[
                    {
                        $match:{
                            status: String(orderStatus)
                        }
                    },
                    {
                        $project:{
                            "products.product": 1,
                            "products.quantity": 1,
                            "products.price": 1,
                            status: 1,
                            totalPrice: 1,
                            createdAt: 1,
                        }
                    }
                ]
            }
        },
        {
            $project:{
                orderHistory: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {orders}, "Order History By Status fetched successfully")
    )
});

// Add to Cart
const addToCart = asyncHandler(async (req, res) => {
    const {productId} = req.query;
    if(!mongoose.isValidObjectId(productId)){
        throw new ApiError(400, "Invalid Product Id");
    }

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "Product not found");
    }

    const user = await User.findOne({
        _id: req.user?._id,
        "cart.productId": productId
    });

    if(user){
        await User.updateOne(
            {
                _id: req.user?._id,
                "cart.productId": productId
            },
            {
                $inc:{
                    "cart.$.quantity": 1
                }
            }
        );
    }else{
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $push:{
                    cart:{
                        productId,
                        quantity: 1
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    }

    const updatedUser = await User.findById(req.user?._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, {cart: updatedUser.cart}, "Product added to cart successfully")
    )
    
});

// Remove from Cart
const removeFromCart = asyncHandler(async (req, res) => {
    const {productId} = req.query;
    if(!mongoose.isValidObjectId(productId)){
        throw new ApiError(400, "Invalid Product Id");
    }

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "Product not found");
    }

    const user = await User.findOne({
        _id: req.user?._id,
        "cart.productId": productId
    })

    if(!user){
        throw new ApiError(404, "Product not found in cart");
    }

    const cartItem = user.cart.find(item => item.productId.toString() === productId);

    if (!cartItem) {
        throw new ApiError(404, "Product not found in the cart");
    }

    if(cartItem.quantity > 1){
        await User.updateOne(
            {
                _id: req.user?._id,
                "cart.productId": productId
            },
            {
                $inc:{
                    "cart.$.quantity": -1
                }
            }
        );
    }else{
        await User.updateOne(
            {
                _id: req.user?._id
            },
            {
                $pull:{
                    cart:{productId}
                }
            }
        );
    }

    const updatedUser = await User.findById(req.user?._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, {cart: updatedUser.cart}, "Product removed from cart successfully")
    )

        
});

// View Cart
const viewCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).populate(
        {
            path: 'cart.productId',
            model: 'Product',
            populate:[
                {
                    path: 'subCategory',
                    model: 'SubCategory',
                    select: 'name basePrice'
                },
                {
                    path: 'productType',
                    model: 'ProductType',
                    select: 'name'
                }
            ]
        }
    );

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const cartItems = user.cart.map(item =>{
        const product = item.productId;
        const basePrice = product.subCategory?.basePrice || 0;
        const additionalPrice = product.additionalPrice || 0;
        const quantity = item.quantity;

        const productPrice = basePrice + additionalPrice;
        const totalPrice = productPrice * quantity;

        return{
            name: product.name,
            productType: product.productType?.name || "No ProductType",
            subCategory: product.subCategory?.name || "No SubCategory",
            images: product.images,
            productPrice,
            totalPrice,
            quantity
        }
    });

    return res.status(200).json(
        new ApiResponse(200, {cartItems}, "Cart viewed successfully")
    )
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateName,
    updateAvatar,
    getUserDetails,
    addToCart,
    removeFromCart,
    viewCart,
    getOrderHistory,
    getOrdersByStatus,
    sendOtp,
    verifyOtp
};