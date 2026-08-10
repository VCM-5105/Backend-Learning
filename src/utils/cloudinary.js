// isme yeh mann ke chale hai ki server pe toh file aa chuki hai

// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs"; // this is file system- buit in node.js

//  cloudinary.config({
//    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//    api_key: process.env.CLOUDINARY_API_KEY,
//    api_secret: process.env.CLOUDINARY_API_SECRET,
//  });


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//        const response= await cloudinary.uploader.upload(localFilePath,
//           {
//            resource_type:"auto",
//           }
//         )
//         //file has been uploaded successfully
//         console.log("File isuploaded on cloudinary", response.url);
//         return response;
        
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }

// export { uploadOnCloudinary };

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key exists:", !!process.env.CLOUDINARY_API_KEY);
console.log("API secret exists:", !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("Uploading file:", localFilePath);

    if (!localFilePath) {
      console.log("No local file path received");
      return null;
    }

    console.log("File exists:", fs.existsSync(localFilePath));

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("File uploaded on Cloudinary:", response.secure_url);
      fs.unlink(localFilePath);
    return response;
  } catch (error) {
    console.error("🔥 CLOUDINARY ERROR:");
    console.error(error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };