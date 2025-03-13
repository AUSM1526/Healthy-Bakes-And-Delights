import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ProductType } from "../models/productType.model.js";
import { SubCategory } from "../models/subCategory.model.js";

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

    if(!subCategoryId){
        throw new ApiError(400, "SubCategoryId is Invalid");
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
            new : true
        }
    );

    return res.status(200).json(
        new ApiResponse(200, { updatedSubCategory }, "Sub Category updated successfully")
    );
});

// Delete a subCategory
const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const {subCategoryId} = req.params;

    if(!subCategoryId){
        throw new ApiError(400, "SubCategoryId is Invalid");
    }

    await SubCategory.findByIdAndDelete(subCategoryId);

    return res.status(200).json(
        new ApiResponse(200,{}, "Sub Category deleted successfully")
    );

});

export {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
};