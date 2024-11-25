import { NextFunction, Router } from "express";
import { updateMetadataSchema } from "../../types/index.js";
import { userMiddleware } from "../../middleware/user.js";
import { Request, Response } from 'express';
import {PrismaClient} from "@prisma/client";


export const userRouter=Router();
const client = new PrismaClient();


userRouter.post("/metadata",userMiddleware,async(req:Request,res:Response):Promise<void>=>{
    const parsedData=updateMetadataSchema.safeParse(req.body);
    if(!parsedData.success){
        console.error("Validation Error:", parsedData.error);

        res.status(400).json({message:"Validation failed",error:parsedData.error})
        return;
    }
    try {
        const updatedUser =await client.user.update({
            where:{
                id:req.userId as string, // Correct the field name here
            },
            data:{
                avatarId: parsedData.data.avatarId,
                metadata: parsedData.data.metadata, // Now this will work
            }
        });
         res.status(200).json({
            message: "User metadata updated successfully",
            user: updatedUser, // Return the updated user data
        });
    } catch (error) {
        // Handle any errors that occur during the update
         res.status(400).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : error,
    }
        );
    }
})
userRouter.get("/metadata/bulk",async(req:Request,res:Response,next:NextFunction)=>{

   try {
     const userIdString=(req.query.ids?? "[]") as string;
     const userIds = JSON.parse(userIdString); // Assumes `ids` is a JSON array in the query string
 
     // const userIds=(userIdString).slice(1,userIdString?.length-2).split(",")
     // console.log(typeof userIds);
 
     if (!userIds.length) {
        res.status(400).json({ message: "No user IDs provided" });
        return;
      }
      

     const metadata=await client.user.findMany({
         where:{
             id:{
                 in:userIds
             }
         } ,select:{
            id: true, // Include the user ID
            avatar:true,
         }
     })
 
     res.json({
         avatars:metadata.map((m)=>({
             userId:m.id,
             avatarId:m.avatar?.imageUrl || null
         }))
     })
     
 }
   catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({ message: "Error fetching metadata", error });
   }})