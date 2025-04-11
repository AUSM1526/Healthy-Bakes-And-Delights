import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Address} from "../models/address.model.js";
import mongoose from "mongoose";

// Add Address Function
const addAddress = asyncHandler(async (req, res) => {
    const {houseNumber, name, area, city, state, pincode, isDefault} = req.body;

    if(!houseNumber || !name || !area || !city || !state || !pincode){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(404, "User not found for adding address");
    }
    //console.log("Username: ",user.username);

    if(isDefault)
    {
        await Address.updateMany(
            { userId: req.user?._id },  // Find all addresses for this user
            { $set: { isDefault: false } }  // Set all `isDefault` fields to `false`
        );
    }

    const address = await Address.create({
        userId: req.user?._id,
        houseNumber,
        name,
        area,
        city,
        state,
        pincode,
        isDefault
    });

    if(!address){
        throw new ApiError(500, "Address not added");
    }

    user.addresses.push(address._id);
    await user.save({validateBeforeSave: false});
    
    return res.status(201).json(
        new ApiResponse(200, {user}, "Address added successfully")
    )
    
});

// Update Address Function
const updateAddress = asyncHandler(async (req, res) => {
    const {addressId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
        throw new ApiError(400, "Invalid address ID format");
    }

    const address = await Address.findById(addressId);

    if(!address){
        throw new ApiError(404, "Address not found, while updating address");
    }

    if(address.userId.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to update this address");
    }

    const {houseNumber, name, area, city, state, pincode, isDefault} = req.body;

    if(isDefault)
    {
        await Address.updateMany(
            { userId: req.user?._id },  // Find all addresses for this user
            { $set: { isDefault: false } }  // Set all `isDefault` fields to `false`
        );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        {
            $set:{
                houseNumber,
                name,
                area,
                city,
                state,
                pincode,
                isDefault
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(200, { updatedAddress } , "Address updated successfully")
    )
});

// Delete Address Function
const deleteAddress = asyncHandler(async (req, res) => {
    const {addressId} = req.params;
    //console.log("Address ID: ", addressId);

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
        throw new ApiError(400, "Invalid address ID format");
    }

    const address = await Address.findById(addressId);

    if(!address){
        throw new ApiError(404, "Address not found, while deleting address");
    }

    if(address.userId.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this address");
    }

    const user = await User.findById(req.user?._id).populate("addresses");

    if(!user || !user.addresses.length){
        throw new ApiError(404, "User data is inconsistent");
    }

    if(user.addresses.length == 1){
        throw new ApiError(404, "You cannot delete the only address");
    }
    
    await Address.findByIdAndDelete(addressId);

    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $pull: { addresses: addressId }
        },
        { 
            new: true 
        }
    );

    if(address.isDefault){
        const newDefaultAddress = user.addresses.find(
            (addr) => addr._id.toString() !== addressId
        )

        if(newDefaultAddress){
            await Address.findByIdAndUpdate(
                newDefaultAddress._id,
                {
                    $set:{
                        isDefault: true
                    }
                },
                {
                    new: true
                }
            )
        }
    }

    return res.status(200).json(
        new ApiResponse(200, {} , "Address deleted successfully")
    )

});

export {
    addAddress,
    updateAddress,
    deleteAddress
};