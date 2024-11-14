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
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';


export const router=Router();
const client = new PrismaClient();

// console.log(client);  // Check if `user` is available on client

router.post("/signup", async(req, res) => {
    console.log("inside signup")
    // check the user
    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect",parsedData)
        res.status(400).json({message: "Validation failed"})
        return
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password,10)

    try {
         const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type == "ADMIN" ? "ADMIN" : "USER",
            }
        })
        console.log(user);
        
        res.json({
            userId: user.id
        })
    } catch(e ) {
        
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/signin", async (req: Request, res: Response) => {
    console.log("inside signin");
    
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("sign in failed",parsedData);
        
        res.status(403).json({ message: "signin failed" });
        return;
    }
    try {
        const user = await client.user.findUnique({
            where: { username: parsedData.data.username }
        });

        if (!user) {
            console.log("user not found");
            
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
        if (!token) {
            console.log("token not generated");
        
            res.status(400).json({ message: "token not generated" });
            return;
        }

        res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            .json({ msg: "signin success", token });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "some internal issue occurred" });
    }
});







router.get("/elements",(req,res)=>{

})

router.get("/avatars",(req,res)=>{
    
})

router.use("/user",userRouter);
router.use("/space",spaceRouter);
router.use("/admin",adminRouter);