import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("Error while uploading file on cloudinary ", error);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

// Delete from cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        if(!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);
        console.log("file is deleted from cloudinary ", response.result);
        return response;
    } catch (error) {
        console.log("Error while deleting file from cloudinary ", error);
        return null;
    }
};

// uploadMultiple on Cloudinary
const uploadMultipleOnCloudinary = async(localFilePaths) => {
    try {
        if(!localFilePaths || localFilePaths.length === 0) return [];

        const uploadedPromises = localFilePaths.map((path) => uploadOnCloudinary(path));

        const uploadedImages = await Promise.allSettled(uploadedPromises);

        const successfulUploads = uploadedImages.
        filter((result) => result.status === "fulfilled")
        . map((result) => result.value);

        return successfulUploads;
    } catch (error) {
        console.log("Error while uploading Multiple files on cloudinary ", error);
        return [];
    }
}

export {uploadOnCloudinary, deleteFromCloudinary, uploadMultipleOnCloudinary};