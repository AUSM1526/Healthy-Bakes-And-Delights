import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Product} from "../models/product.model.js";
import {ProductType} from "../models/productType.model.js";
import {SubCategory} from "../models/subCategory.model.js";
import {uploadMultipleOnCloudinary} from "../utils/cloudinary.js";

// Create Product
// Reviews and Discount left
const createProduct = asyncHandler(async (req, res, next) => {
    const{name, productTypeName, subCategoryName, description, additionalPrice, stock} = req.body;

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

    const imagePaths = req.files?.map(file => file.path) || [];
    const uploadedImages = await uploadMultipleOnCloudinary(imagePaths);
    console.log("Images: ",uploadedImages);

    const imageUrls = uploadedImages.map(img => img.secure_url);

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

export {createProduct};