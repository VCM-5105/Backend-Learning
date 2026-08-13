import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        
        return {accessToken, refreshToken}
    } catch (error) {
        console.error("🔥 TOKEN GENERATION ERROR:", error);
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asynchandler(async (req,res) => {
    const { fullname, email, username, password } = req.body
    
    
    // if (fullname === "") {
    //     throw new ApiError(400," FullName is Required")
    // } // this is okay for beginner to write multiple if block and check all the required if block message

    // but better approach is
    if (
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"All field are required")
    }

    const existedUser=await User.findOne({
        $or:[{username},{ email}]
    })

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }
   
   
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("local path", avatarLocalPath);
    

    const CoverImageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file path is required");
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

const loginUser = asynchandler(async (req, res) => {
    // req body - data
    //username or email based access
    //find the user
    //password check
    // access and refresh token
    //send cookies- secure cookies


    const { email, username, password } = req.body
    
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required")
    }

    const user= await User.findOne({
        $or:[{username},{email}]
    })

    if (!user) {
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if (!isPasswordValid) {
        throw new ApiError(401,"Password is not correct")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
        new ApiResponse( // we are handling that case where user want to save acess and refresh token by himself
            200, {
                user: loggedInUser,accessToken,refreshToken
        },
            "User logged in Successfully"
        )
     )
})

const logoutUser = asynchandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure:true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User Logged out"))
    
})

const refreshAccessToken = asynchandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised Request")
    }

   try {
    const decodedToken= jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
 
     )
 
     const user = await User.findById(decodedToken?._id)
     if (!user) {
         throw new ApiError(401,"Invalid Refresh Token")
     }
 
     if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(403, "Invalid Refresh Token")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const { accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
 
     return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newrefreshToken, options)
         .json(
             new ApiResponse(
                 200,
                 { accessToken, refreshToken, newrefreshToken },
                 "Access token refreshed"
         )
     )
   } catch (error) {
       throw new ApiError(401,error?.message || "Invalid refresh token")
    
   }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}