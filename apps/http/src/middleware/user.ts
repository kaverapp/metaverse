import { NextFunction,Request,RequestHandler,Response } from "express";
import { JWT_SECRET } from "../config.js";
import  jwt  from "jsonwebtoken";

export const userMiddleware:RequestHandler=(req:Request,res:Response,next:NextFunction):void=>{
    const header=req.headers["authorization"];   //bearer token
    if(!header){
        res.status(403).json({message:"Unauthorized"});
        return;
    }
    const token=header?.split(" ")[1];

    if(!token){
         res.status(403).json({message:"Unauthorized"});
         return;
    }
    try {
        const decoded=jwt.verify(token,JWT_SECRET) as {userId:string,role:string};  //The as keyword in TypeScript is used for type assertion, which tells the TypeScript compiler to treat a value as a specific type. In the example you provided:
       
        req.userId=decoded.userId; // No error now because of global declaration

        next();
        
    } catch (error) {
        res.status(401).json({message:"Unauthorized"});
        
    }
}