import { Router } from "express";
import { CreateSpaceSchema } from "../../types/index.js";
import {PrismaClient} from "@prisma/client";

export const spaceRouter=Router();
const client = new PrismaClient();


spaceRouter.post("/",async(req,res)=>{
    const parseData=CreateSpaceSchema.safeParse(req.body);
    if(!parseData.success){
        res.status(400).json({message:"Validation failed",error:parseData.error})
        return;
    }

    if(!parseData.data.mapId){
        await client.space.create({
            data:{
                name:parseData.data.name,
                width:parseInt(parseData.data.dimensions.split("x")[0]),
                height:parseInt(parseData.data.dimensions.split("x")[1]),
                creatorId:req.userId!
            }
        })
    }
})

spaceRouter.delete("/:spaceId",(req,res)=>{})

spaceRouter.get("/all",(req,res)=>{})


spaceRouter.post("/element",(req,res)=>{})

spaceRouter.delete("/element",(req,res)=>{})

spaceRouter.get("/:spaceId",(req,res)=>{})