import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//if token is invalid, it will throw an error
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid token"});
        }
        const user= await User.findById(decoded.id).select("-password");//fetch user without password
        if (!user){
            return res.status(401).json({message:"Unauthorized - User not found"});
        }
        req.user=user;//attach user to request object
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        return res.status(500).json({message:"Internal Server Error"});
        
    }
}
//to be able to grab the cookie from req.cookies, we need to use cookie-parser middleware in app.js