import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asynchandler(async(req, res, next)=> {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
    if (!token) {
        throw new ApiError(401,"Unauthorised Request")
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    await User.findById(decodedToken?._id).select("password")
})