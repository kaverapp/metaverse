
import { NextFunction,Request,Response } from "express";
import { JWT_SECRET } from "../config.js";
import  jwt  from "jsonwebtoken";

export const adminMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header=req.headers["authorization"];   //bearer token
    const token=header?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try {
        const decoded=jwt.verify(token,JWT_SECRET) as {role:string,userId:string};  //The as keyword in TypeScript is used for type assertion, which tells the TypeScript compiler to treat a value as a specific type. In the example you provided:
        console.log(decoded);
        
        if(!decoded.role || decoded.role!=="ADMIN"){
            return res.status(403).json({message:"Forbidden u are not admin u are not allowed to access this route"});
        }
        req.userId=decoded.userId;
        next();
        
    } catch (error) {
        res.status(401).json({message:"Unauthorized"});
        return;
    }
}