import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ProductType } from "../models/productType.model.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

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

    const imageLocalPath = req.file?.path;
    const productTypeImage = await uploadOnCloudinary(imageLocalPath);

    const productType = await ProductType.create({
        name,
        hasSubCategories,
        image: productTypeImage == null ? null : productTypeImage.url
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
    const { productTypeid } = req.query;

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
const deleteProductType = asyncHandler(async (req, res, next) => {
    const { productTypeid } = req.query;
    //console.log("PID: ",productTypeid);
    if (!mongoose.Types.ObjectId.isValid(productTypeid)) {
        throw new ApiError(400, "Invalid productType ID format");
    }

    const isAssociated = await Product.exists({productType: productTypeid});
    if (isAssociated) {
        throw new ApiError(400, "Cannot Delete since Product Type is associated with a product");
    }

    const deleteProductType = await ProductType.findByIdAndDelete(productTypeid);

    if(!deleteProductType){
        throw new ApiError(404, "Product Type not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Product Type deleted successfully")
    );
});

// update productType image
const updateImage = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;
    const { productTypeid } = req.query;

    if(!imageLocalPath){
        throw new ApiError(400, "Avatar File is required");
    }

    const productTypeImage = await uploadOnCloudinary(imageLocalPath);

    if(!productTypeImage.url){
        throw new ApiError(500, "Error while uploading Avatar file");
    }

    const productType = await ProductType.findById(productTypeid);
    if(!productType){
        throw new ApiError(404, "Product Type not found");
    }
    const match = productType.image ? productType.image.match(/\/([^\/]+)\.\w+$/) : null;

    const oldImagePublicId = match ? match[1] : null;

    productType.image = productTypeImage.url;
    await productType.save({validateBeforeSave: false});

    if(oldImagePublicId){
        try {
            console.log("oldAvatarPublicId: ",oldImagePublicId);
            await deleteFromCloudinary(oldImagePublicId);
        } catch (error) {
            console.error("Failed to delete old avatar from Cloudinary:", error);
        }
    }
    
    return res.status(200).json(
        new ApiResponse(200, {productType}, "ProductType Image updated successfully")
    )

});

// get Products per Product Type
const getProductsPerProductType = asyncHandler(async (req, res, next) => {
    const productsPerProductType = await ProductType.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'productType',
                as: 'products'
            }
        },
        {
            $project:{
                _id: 0,
                productType: {
                    _id: "$_id",
                    name: "$name",
                    image: "$image",
                    hasSubCategories: "$hasSubCategories"
                },
                count: {$size: "$products"}
            }
        },
    ]);

    if(!productsPerProductType || productsPerProductType.length === 0) {
        throw new ApiError(404, "No Products found");
    }

    return res.status(200).json(
        new ApiResponse(200, { productsPerProductType }, "All Products per ProductTypes Displayed successfully")
    )
});

export { 
    addProductType,
    getAllProductTypes,
    updateProductType,
    deleteProductType,
    updateImage,
    getProductsPerProductType
};