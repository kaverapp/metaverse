
import  { Router } from "express";
import { userRouter } from "./user.js";
import { adminRouter } from "./admin.js";
import { spaceRouter } from "./space.js";
import { SigninSchema, SignupSchema } from "../../types/index.js";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";
import { Request, Response } from 'express';


export const router=Router();
const client = new PrismaClient();


//Test Passwd Successfully
router.post("/signup", async (req, res) => {
    console.log("inside signup")
    console.log("Request received at:", new Date());

              // Validate input
    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed", error: parsedData.error})
        return
    }


    try {
                // Check if the user already exists

        const existingUser = await client.user.findUnique({
            where: { username: parsedData.data.username },
        })
        if(existingUser) {
            console.log("user already exists")
            res.status(400).json({message: "User already exists"})
            return
        }

                // Create new user

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

         const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "ADMIN" ? "ADMIN" : "USER",
            }
        })

                // Respond with the newly created user's ID

        res.json({
            userId: user.id
        })
    } catch(e) {
        console.log("erroer thrown")
        console.log(e)
        res.status(400).json({message: "User already exists"})
    }
})

router.post("/signin", async (req: Request, res: Response) => {
    console.log("inside signin");
    
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Signin schema validation failed", parsedData);
        
        res.status(403).json({ message: "signin failed", error: parsedData.error });
        return;
    }
    try {
        const user = await client.user.findUnique({
            where: { username: parsedData.data.username }
        });

        if (!user) {
            console.log("User authentication failed");
            
            res.status(403).json({ message: "user not found" });
            return;
        }

        const isValid = await bcrypt.compare(parsedData.data.password, user.password);
        if (!isValid) {
            console.log("invalid password");
            
            res.status(403).json({ message: "invalid password" });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
       

        res.status(200)
            .cookie("token", token, {
                // httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            })
            .json({ msg: "signin success", token });
            console.log("signin success");
            
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ message: "some internal issue occurred" });
    }
});
//end






router.get("/elements",(req,res)=>{

})

router.get("/avatars",(req,res)=>{
    
})

router.use("/user",userRouter);
router.use("/space",spaceRouter);
router.use("/admin",adminRouter);