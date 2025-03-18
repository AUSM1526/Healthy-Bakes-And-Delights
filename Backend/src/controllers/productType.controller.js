import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ProductType } from "../models/productType.model.js";
import mongoose from "mongoose";

// Add ProductType
const addProductType = asyncHandler(async (req, res, next) => {
    const { name, hasSubCategories } = req.body;

    if(!name || hasSubCategories === undefined){
        throw new ApiError(400, "All fields are required");
    }

    const existedProductType = await ProductType.findOne({ name });

    if(existedProductType){
        throw new ApiError(400, "Product Type already exists");
    }

    const productType = await ProductType.create({
        name,
        hasSubCategories
    });

    if(!productType){
        throw new ApiError(500, "Product Type creation failed");
    }

    return res.status(200).json(
        new ApiResponse(200, {productType}, "Product Type created successfully")
    );

});

// Get all ProductTypes
const getAllProductTypes = asyncHandler(async (req, res, next) => {
    const productTypes = await ProductType.find();

    if(productTypes.length === 0){
        throw new ApiError(404, "No Product Type found");
    }

    return res.status(200).json(
        new ApiResponse(200, {productTypes}, "Product Types found")
    );
});

// Update a ProductType
const updateProductType = asyncHandler(async (req, res, next) => {
    const { name, hasSubCategories } = req.body;
    const { productTypeid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productTypeid)) {
            throw new ApiError(400, "Invalid productType ID format");
    }

    const updatedProductType = await ProductType.findByIdAndUpdate(
        productTypeid,
        {
            $set:{
                name,
                hasSubCategories
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(200, { updatedProductType }, "Product Type updated successfully")
    );
});

// Delete a ProductType
// Left to check if linked to any product or not
const deleteProductType = asyncHandler(async (req, res, next) => {
    const { productTypeid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productTypeid)) {
        throw new ApiError(400, "Invalid productType ID format");
    }

    const deleteProductType = await ProductType.findByIdAndDelete(productTypeid);

    if(!deleteProductType){
        throw new ApiError(404, "Product Type not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Product Type deleted successfully")
    );
});

export { 
    addProductType,
    getAllProductTypes,
    updateProductType,
    deleteProductType
};