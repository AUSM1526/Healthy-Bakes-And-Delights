import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ProductType } from "../models/productType.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";

// Create a new subCategory
const createSubCategory = asyncHandler(async (req, res, next) => {
    const {name, productTypeName, basePrice} = req.body;

    if(!name || !productTypeName || basePrice === undefined){
        throw new ApiError(400, "All fields are required");
    }

    const productTypeExists = await ProductType.findOne({name: productTypeName});

    if(!productTypeExists){
        throw new ApiError(400, "Product Type does not exist");
    }

    const subCategoryExists = await SubCategory.findOne({name});

    if(subCategoryExists){
        throw new ApiError(400, "Sub Category already exists");
    }

    //await SubCategory.collection.dropIndex("productType_1");

    const subCategoryCreated = await SubCategory.create({
        name,
        productType: productTypeExists._id,
        basePrice
    });

    return res.status(201).json(
        new ApiResponse(201, {subCategoryCreated}, "Sub Category created successfully")
    );
});

// Update a subCategory
const updateSubCategory = asyncHandler(async (req, res, next) => {
    const {name, productTypeName, basePrice} = req.body;

    if(!name || !productTypeName || basePrice === undefined){
        throw new ApiError(400, "All fields are required");
    }

    const {subCategoryId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        throw new ApiError(400, "Invalid subCategory ID format");
    }

    const productTypeExists = await ProductType.findOne({name: productTypeName});

    if(!productTypeExists){
        throw new ApiError(400, "Product Type does not exist");
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
        subCategoryId,
        {
            $set:{
                name,
                productType: productTypeExists._id,
                basePrice
            }
        },
        {
            new : true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(200, { updatedSubCategory }, "Sub Category updated successfully")
    );
});

// Delete a subCategory
const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const {subCategoryId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        throw new ApiError(400, "Invalid subCategory ID format");
    }

    const isAssociated = await Product.exists({subCategory: subCategoryId});
    if (isAssociated) {
        throw new ApiError(400, "Cannot Delete since Sub Category is associated with a product");
    }

    await SubCategory.findByIdAndDelete(subCategoryId);

    return res.status(200).json(
        new ApiResponse(200,{}, "Sub Category deleted successfully")
    );

});

// Get All subCategories
const getAllSubCategories = asyncHandler(async (req, res, next) => {
    const subCategories = await SubCategory.find({}).populate("productType");

    return res.status(200).json(
        new ApiResponse(200, {subCategories}, "Sub Categories fetched successfully")
    );
});

// Get All subCategories by Product Type
const getAllSubCategoriesByProductType = asyncHandler(async (req, res, next) => {
    const {productTypeId} = req.query;
    if (!mongoose.Types.ObjectId.isValid(productTypeId)) {
        throw new ApiError(400, "Invalid productType ID format");
    }

    const subCategories = await SubCategory.find({productType: productTypeId});

    if(!subCategories || subCategories.length === 0){
        throw new ApiError(404, "No Sub Categories found for this Product Type");
    }

    return res.status(200).json(
        new ApiResponse(200, {subCategories}, "Sub Categories fetched successfully")
    );
});

export {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getAllSubCategories,
    getAllSubCategoriesByProductType
};