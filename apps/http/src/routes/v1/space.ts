import { Router } from "express";
import { CreateSpaceSchema } from "../../types/index.js";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "../../middleware/user.js";

export const spaceRouter = Router();
const client = new PrismaClient();


spaceRouter.post("/",userMiddleware, async (req, res) => {
    const parseData = CreateSpaceSchema.safeParse(req.body);
    if (!parseData.success) {
        res.status(400).json({ message: "Validation failed", error: parseData.error })
        return;
    }

    if (!parseData.data.mapId) {
        const space=await client.space.create({
            data: {
                name: parseData.data.name,
                width: parseInt(parseData.data.dimensions.split("x")[0]),
                height: parseInt(parseData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
            }
        })
        res.json({ spaceid: space.id})
    }
    const map = await client.map.findUnique({
        where: {
            id: parseData.data.mapId
        },
        select: {
            mapElements: true,
            width: true,
            height: true
        }

    })
    if (!map) {
        res.status(400).json({ message: "map not found" })
        return
    }

   let space= await client.$transaction(async () => {
        const space = await client.space.create({
            data: {
                name: parseData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,

            },

        });
    
        await client.spaceElements.createMany({
            data:map.mapElements.map(e => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!,

            }))
        })
        return space;

    })

    res.json({ spaceId: space.id })

    
})

// spaceRouter.post("/", userMiddleware, async (req, res) => {
//     console.log("endopibnt")
//     const parsedData = CreateSpaceSchema.safeParse(req.body)
//     if (!parsedData.success) {
//         console.log(JSON.stringify(parsedData))
//         res.status(400).json({message: "Validation failed"})
//         return
//     }

//     if (!parsedData.data.mapId) {
//         const space = await client.space.create({
//             data: {
//                 name: parsedData.data.name,
//                 width: parseInt(parsedData.data.dimensions.split("x")[0]),
//                 height: parseInt(parsedData.data.dimensions.split("x")[1]),
//                 creatorId: req.userId!
//             }
//         });
//         res.json({spaceId: space.id})
//         return;
//     }

//     const map = await client.map.findFirst({
//         where: {
//             id: parsedData.data.mapId
//         }, select: {
//             mapElements: true,
//             width: true,
//             height: true
//         }
//     })
//     console.log("after")
//     if (!map) {
//         res.status(400).json({message: "Map not found"})
//         return
//     }
//     console.log("map.mapElements.length")
//     console.log(map.mapElements.length)
//     let space = await client.$transaction(async () => {
//         const space = await client.space.create({
//             data: {
//                 name: parsedData.data.name,
//                 width: map.width,
//                 height: map.height,
//                 creatorId: req.userId!,
//             }
//         });

//         await client.spaceElements.createMany({
//             data: map.mapElements.map(e => ({
//                 spaceId: space.id,
//                 elementId: e.elementId,
//                 x: e.x!,
//                 y: e.y!
//             }))
//         })

//         return space;

//     })
//     console.log("space crated")
//     res.json({spaceId: space.id})
// })

//4:40:44

spaceRouter.delete("/:spaceId", userMiddleware,async(req, res) => {
    const space=await client.space.findUnique({
        where:{
            id: req.params.spaceId
        
        },
        select:{
            creatorId:true
        }
    })

    if(space?.creatorId !== req.userId){}

 })

spaceRouter.get("/all", (req, res) => { })


spaceRouter.post("/element", (req, res) => { })

spaceRouter.delete("/element", (req, res) => { })

spaceRouter.get("/:spaceId", (req, res) => { })