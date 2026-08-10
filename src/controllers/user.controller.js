import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async (req,res) => {
    const { fullname, email, username, password } = req.body
    console.log("email",email);
    
    // if (fullname === "") {
    //     throw new ApiError(400," FullName is Required")
    // } // this is okay for beginner to write multiple if block and check all the required if block message

    // but better approach is
    if (
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"All field are required")
    }

    const existedUser=User.findOne({
        $or:[{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }
   
    const avatarLocalPath = req.files?.avatar[0]?.path;

    const CoverImageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(CoverImageLocalPath)
    
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

   const user= await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage.url || "",
        email,
        password,
        username: username.toLowerCase()
   })
    
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500,"something went wrong while registering a user ")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export {registerUser}