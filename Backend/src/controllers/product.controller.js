import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Product} from "../models/product.model.js";
import {ProductType} from "../models/productType.model.js";
import {SubCategory} from "../models/subCategory.model.js";
import {uploadMultipleOnCloudinary} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import {deleteFromCloudinary} from "../utils/cloudinary.js";

// Create Product
// Reviews and Discount left
const createProduct = asyncHandler(async (req, res, next) => {
    const{name, productTypeName, subCategoryName, description, additionalPrice, stock} = req.body;
    //console.log("create product body: ",req.body);
    if(!name || !productTypeName || !description || !additionalPrice || !stock){
        throw new ApiError(400,"All the fields are required");
    }

    const productTypeExists = await ProductType.findOne({name: productTypeName});
    if(!productTypeExists){
        throw new ApiError(400,"Product Type does not exist");
    }

    let subCategoryExists = null;
    if(productTypeExists.name === 'Chocolate'){
        if(!subCategoryName){
            throw new ApiError(400,"Sub Category is required for Chocolate");
        }
        subCategoryExists = await SubCategory.findOne({name: subCategoryName});
        if(!subCategoryExists){
            throw new ApiError(400,"Sub Category does not exist");
        }
    }

    const existedProduct = await Product.findOne(
        {
            $and:[
                {name: name},
                {productType: productTypeExists._id},
                {subCategory: subCategoryExists ? subCategoryExists._id : null}
            ]
        }
    );

    if(existedProduct){
        throw new ApiError(400,"Product already exists");
    }

    const imagePaths = req.files?.map(file => file.path) || [];
    const uploadedImages = await uploadMultipleOnCloudinary(imagePaths);
    //console.log("Images: ",uploadedImages);

    const imageUrls = uploadedImages.map(img => img.secure_url);

    //await Product.collection.dropIndex("name_1");
    //await Product.collection.dropIndex("productType_1");

    const createdProduct = await Product.create({
        name,
        productType: productTypeExists._id,
        subCategory: productTypeExists.name === 'Chocolate' ? subCategoryExists._id : null,
        description,
        images: imageUrls,
        additionalPrice,
        stock
    });

    return res.status(201).json(
        new ApiResponse(201,{ createdProduct },"Product created successfully")
    );

});

// GetProducts with All Subcategory it belongs to and their corresponding price
const getProductsWithSubcategory = asyncHandler(async (req, res, next) => {
    const products = await Product.aggregate([

        // Lookup product type
        {
            $lookup: {
                from: 'producttypes',
                localField: 'productType',
                foreignField: '_id',
                as: 'productType'
            }
        },
        { $unwind: "$productType" },

        // Lookup subcategory
        {
            $lookup: {
                from: 'subcategories',
                localField: 'subCategory',
                foreignField: '_id',
                as: 'subCategory'
            }
        },

        // Unwind subcategory (make it an object, not an array)
        {
            $unwind: {
                path: "$subCategory",
                preserveNullAndEmptyArrays: true  // Keep products without subcategories
            }
        },

        // Add total price with safe numeric conversion
        // Convert basePrice and additionalPrice separately
        {
            $addFields: {
                basePrice: {
                    $cond: {
                        if: { $ifNull: ["$subCategory.basePrice", false] },
                        then: { $toDouble: "$subCategory.basePrice" },
                        else: 0
                    }
                },
                additionalPrice: { 
                    $toDouble: { $ifNull: ["$additionalPrice", 0] } 
                }
            }
        },

        // Calculate totalPrice in a separate stage
        {
            $addFields: {
                totalPrice: { 
                    $add: ["$basePrice", "$additionalPrice"] 
                }
            }
        },

        // Group by product name and aggregate subcategories
        {
            $group: {
                _id: "$name",
                productType: { $first: "$productType.name" },
                subCategories: {
                    $push: {
                        name: { $ifNull: ["$subCategory.name", null] },
                        price: "$totalPrice",
                        stock: "$stock"
                    }
                }
            }
        },

        // Restructure the final output
        {
            $project: {
                name: "$_id",
                productType: 1,
                subCategories: 1,
                _id: 0
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, { products }, "All Products Displayed successfully")
    );
});

// Update Product
const updateProductDetails = asyncHandler(async (req, res, next) => {
    const {productId} = req.params;
    //console.log(req.body);
    const{name, productTypeName, subCategoryName, description, additionalPrice, stock} = req.body;


    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID format");
    }

    const productExists = await Product.findById(productId);
    if(!productExists){
        throw new ApiError(404, "Product not found");
    }

    //console.log(productTypeName);   
    const productTypeExists = await ProductType.findOne({name: productTypeName});
    //console.log("Product Type: ",productTypeExists);
    if(!productTypeExists){
        throw new ApiError(400,"Product Type does not existsss");
    }

    let subCategoryExists = null;
    if(productTypeExists.name === 'Chocolate'){
        subCategoryExists = await SubCategory.findOne({name: subCategoryName});
        if(!subCategoryExists){
            throw new ApiError(400,"Sub Category does not exist");
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set:{
                name,
                productType: productTypeExists._id,
                subCategory: productTypeExists.name === 'Chocolate' ? subCategoryExists._id : null,
                description,
                additionalPrice,
                stock
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(200,{ updatedProduct },"Product updated successfully")
    );
});

// Delete Image from Product
const deleteProductImage = asyncHandler(async (req, res, next) => {
    const {productId, imageUrl} = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID format");
    }

    const productExists = await Product.findById(productId);
    if(!productExists){
        throw new ApiError(404, "Product not found");
    }

    if (!productExists.images.includes(imageUrl)) {
        throw new ApiError(404, "Image not found in product");
    }

    const match = imageUrl ? imageUrl.match(/\/([^\/]+)\.\w+$/) : null;
    const imagePublicId = match ? match[1] : null;

    if(imagePublicId){
        try {
                console.log("imagePublicId: ",imagePublicId);
                await deleteFromCloudinary(imagePublicId);
        } catch (error) {
                console.error("Failed to delete old avatar from Cloudinary:", error);
        }
    }

    productExists.images = productExists.images.filter(img => img !== imageUrl);
    await productExists.save({validateBeforeSave: false});

    return res.status(200).json(
        new ApiResponse(200, {productExists}, "Image deleted successfully")
    );
});


export {
    createProduct,
    getProductsWithSubcategory,
    updateProductDetails,
    deleteProductImage
};