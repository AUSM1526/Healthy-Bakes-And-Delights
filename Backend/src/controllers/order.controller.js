import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {User} from "../models/user.model.js";
import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import generateUPIQRCode from "../utils/generateQrCode.js";
import { mailSender } from "../utils/mailSender.js";
import {adminOrderNotification} from "../mailTemplates/adminNotification.js";
import {userPendingApproval} from "../mailTemplates/userApproval.js";
import {userOrderApproved} from "../mailTemplates/userConfirmation.js";
import {userOrderNotApproved} from "../mailTemplates/userNotApproved.js";
import {orderCancelled} from "../mailTemplates/orderCancelled.js";
import {ProductType} from "../models/productType.model.js";
import {SubCategory} from "../models/subCategory.model.js";

// Place an individual Product order
const placeSingleOrder = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id;
    const {productId, quantity, addressId,upiTransactionId} = req.query;

    if(!upiTransactionId){
        throw new ApiError(400, "Please provide UPI TransactionId / Reference No.");
    }

    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400, "Invalid productId");
    }

    const user = await User.findById(userId).populate("addresses");
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const product = await Product.findById(productId).populate(
        {
            path: 'subCategory',
            model: 'SubCategory',
            select: 'basePrice'
        }
    );
    if(!product){
        throw new ApiError(404, "Product not found");
    }

    if(product.stock < quantity){
        throw new ApiError(400, "Product out of stock");
    }

    const basePrice = product.subCategory?.basePrice || 0;
    const additionalPrice = product.additionalPrice;
    const price = basePrice + additionalPrice;
    const total = price * quantity;

    if(user.addresses.length === 0){
        throw new ApiError(400, "Please add an address to place an order");
    }
    
    
    const  productType = await ProductType.findById(product.productType);
    const subCategory = await SubCategory.findById(product.subCategory);

    const createdOrder = await Order.create({
        user: userId,
        products: [
            {
                product: productId,
                quantity,
                price,
                image: product.images[0],
                productName: product.name,
                subCategory: subCategory ? subCategory.name : "",
                productType: productType.name
            }
        ],
        status: "Pending",
        totalPrice: total,
        address: addressId,
        transactionId: upiTransactionId
    });

    await Product.updateOne(
        {
            _id: productId
        },
        {
            $inc:{stock: -quantity}
        }
    );

    // send mail to admin on order creation and user to wait for approval;
    const userEmail = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName ? user.lastName : "";
    const adminbody = adminOrderNotification(user.username,firstName,lastName,userEmail,createdOrder.totalPrice);
    const userbody = userPendingApproval(firstName,lastName,createdOrder.totalPrice,process.env.MAIL_USER);

    await mailSender(process.env.MAIL_USER,"Order waiting for approval",adminbody);
    await mailSender(userEmail,"Order Awaiting Approval",userbody);

    return res.status(201).json(
        new ApiResponse(201, {createdOrder}, "Single Order placed successfully")
    );
});

// Place Cart Order
const placeCartOrder = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id;
    const {addressId,upiTransactionId} = req.query;

    if(!upiTransactionId){
        throw new ApiError(400, "Please provide UPI TransactionId / Reference No.");
    }

    const user = await User.findById(userId).populate([
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
        },
        {
            path: 'addresses',
            model: 'Address'
        },
        
    ]);   
    if(!user){
        throw new ApiError(404, "User not found");
    }

    if(user.cart.length === 0){
        throw new ApiError(400, "Cart is empty");
    }

    for(const item of user.cart){
        if(item.productId.stock < item.quantity){
            throw new ApiError(400, `${item.productId.name} is out of stock`);
        }
    }

    const cartItems = user.cart.map(item =>{
        const product = item.productId;
        const basePrice = product.subCategory?.basePrice || 0;
        const additionalPrice = product.additionalPrice;
        const price = basePrice + additionalPrice;

        return {
            product: product._id,
            quantity: item.quantity,
            price,
            image: product.images[0],
            productName: product.name,
            subCategory: product.subCategory?.name || "" ,
            productType: product.productType.name
        }
    });

    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if(user.addresses.length === 0){
        throw new ApiError(400, "Please add an address to place an order");
    }

    const defaultAddress = user.addresses.find(address => address.isDefault);
    if (!defaultAddress) {
        throw new ApiError(400, "No default address found. Please select or set a default address.");
    }

    const createdOrder = await Order.create({
        user: userId,
        products: cartItems,
        status: "Pending",
        totalPrice: total,
        address: addressId,
        transactionId: upiTransactionId
    });

    const bulkOps = user.cart.map(item => ({
        updateOne:{
            filter: {_id: item.productId._id},
            update: {$inc:{stock: -item.quantity}}
        }
    }));

    if(bulkOps.length > 0){
        await Product.bulkWrite(bulkOps);
    }

    user.cart = [];
    await user.save({validateBeforeSave: false});

    // send mail to admin on order creation and user to wait for approval;
    const userEmail = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName ? user.lastName : "";
    const adminbody = adminOrderNotification(user.username,firstName,lastName,userEmail,createdOrder.totalPrice);
    const userbody = userPendingApproval(firstName,lastName,createdOrder.totalPrice,process.env.MAIL_USER);

    await mailSender(process.env.MAIL_USER,"Order waiting for approval",adminbody);
    await mailSender(userEmail,"Order Awaiting Approval",userbody);

    return res.status(201).json(
        new ApiResponse(201, {createdOrder}, "Cart Order placed successfully")
    );

});

// Get all Orders By Status
const getAllOrdersByStatus = asyncHandler(async (req, res, next) => {
    const {status} = req.query;

    const orders = await Order.aggregate([
        {
            $match: status ? {status} : {}
        },
        {
            $lookup:{
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project:{
                _id: 0,
                "userDetails.firstName": 1,
                "userDetails.lastName": 1,
                "userDetails.email": 1,
                products: 1,
                totalPrice: 1,
                status: 1,
                address: 1,
                createdAt: 1
            }
        }
    ]);

    if(orders.length === 0){
        throw new ApiError(404, "No orders found");
    }

    return res.status(200).json(
        new ApiResponse(200, {orders}, "Orders By Status fetched successfully")
    );
});

// update order status
const updateOrderStatus = asyncHandler(async (req, res, next) =>{
    const { orderId } = req.query;
    const {newStatus} = req.body;
    
    if(!mongoose.Types.ObjectId.isValid(orderId)){
        throw new ApiError(400, "Invalid orderId");
    }

    const order = await Order.findById(orderId);
    if(!order){
        throw new ApiError(404, "Order not found");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set:{
                status: newStatus
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(200,{ updatedOrder }, "Order status updated successfully")
    );

});

// Cancel Order
const cancelOrder = asyncHandler(async (req, res, next) =>{
    const { orderId } = req.query;
    if(!mongoose.Types.ObjectId.isValid(orderId)){
        throw new ApiError(400, "Invalid orderId");
    }

    const order = await Order.findById(orderId);
    if(!order){
        throw new ApiError(404, "Order not found");
    }

    if(order.status == 'Cancelled'){
        throw new ApiError(400, "Order already cancelled");
    }

    if(order.status == 'Delivered' || order.status == 'Shipped'){
        throw new ApiError(400, "Order cannot be cancelled");
    }

    const orderedTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();

    const timeDiff = currentTime - orderedTime;
    const diffInMins = Math.floor(timeDiff/(1000*60));

    if(diffInMins > 60){
        throw new ApiError(400, "Order cannot be cancelled after 1 hour placing");
    }

    const cancelledOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set:{
                status: "Cancelled"
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    const bulkOps = order.products.map(item => ({
        updateOne:{
            filter: {_id: item.product},
            update: {$inc:{stock: item.quantity}}
        }
    }));

    if(bulkOps.length > 0){
        await Product.bulkWrite(bulkOps);
    }

    // send mail to admin on order cancellation
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const userEmail = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName ? user.lastName : "";
    const userName = user.username;
    const body = orderCancelled(userName,firstName,lastName,userEmail,cancelledOrder.totalPrice);

    await mailSender(process.env.MAIL_USER,"Order Cancelled",body);

    return res.status(200).json(
        new ApiResponse(200, {cancelledOrder}, "Order cancelled successfully")
    );
});

// Order Approval 
const approveOrder = asyncHandler(async (req, res, next) => {
    const {orderId} = req.query;
    if(!mongoose.Types.ObjectId.isValid(orderId)){
        throw new ApiError(400, "Invalid orderId");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set:{
                isApproved: true
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if(!updatedOrder){
        throw new ApiError(404, "Order not found");
    }

    const user = await User.findById(updatedOrder.user);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    // send mail to user on order approval
    const userEmail = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName ? user.lastName : "";
    const body = userOrderApproved(firstName,lastName,updatedOrder.totalPrice, process.env.MAIL_USER);
    await mailSender(userEmail,"Order Approved",body);

    return res.status(200).json(
        new ApiResponse(200, {updatedOrder}, "Order approved successfully")
    );
});

// Order not approved
const notApproveOrder = asyncHandler(async (req, res, next) => {
    const {orderId} = req.query;
    if(!mongoose.Types.ObjectId.isValid(orderId)){
        throw new ApiError(400, "Invalid orderId");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set:{
                isApproved: false,
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if(!updatedOrder){
        throw new ApiError(404, "Order not found");
    }

    const user = await User.findById(updatedOrder.user);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    // send mail to user on order not approved
    const userEmail = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName ? user.lastName : "";
    const body = userOrderNotApproved(firstName,lastName,updatedOrder.totalPrice, process.env.MAIL_USER);
    await mailSender(userEmail,"Order Not Approved",body);

    return res.status(200).json(
        new ApiResponse(200, {updatedOrder}, "Order not approved")
    );
});

// Generate QR Code for Order
const orderQrCode = asyncHandler(async (req, res, next) => {
    const {total} = req.query;
    const qrCode = await generateUPIQRCode(total);
    
    return res.status(200).json(
        new ApiResponse(200, {qrCode}, "QR Code generated successfully")
    );
    
});

// getOrder details
const getOrderDetails = asyncHandler(async (req, res, next) => {
    const {orderId} = req.query;
    if(!mongoose.Types.ObjectId.isValid(orderId)){
        throw new ApiError(400, "Invalid orderId");
    }

    const order = await Order.findById(orderId);

    return res.status(200).json(
        new ApiResponse(200, {order}, "Order details fetched successfully")
    )
});

// get All Orders
const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate([
        {
            path: 'user',
            select: 'firstName lastName email phoneNumber'
        },
        {
            path: 'address',
            select: 'houseNumber name area city state pincode'
        }
    ]).select("-products.image -updatedAt -__v").sort({createdAt: -1});

    if(orders.length === 0){
        throw new ApiError(404, "No orders found");
    }

    return res.status(200).json(
        new ApiResponse(200, {orders}, "Orders fetched successfully")
    );
});

export {
    placeSingleOrder,
    placeCartOrder,
    getAllOrdersByStatus,
    updateOrderStatus,
    cancelOrder,
    approveOrder,
    notApproveOrder,
    orderQrCode,
    getOrderDetails,
    getAllOrders
};
