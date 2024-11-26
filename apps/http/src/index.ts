import express from "express";
import { router } from "./routes/v1/index.js";
import client from "@repo/db/client";
import { errorHandler } from "./middleware/errorHandler.js";

const app=express();
app.use(express.json());

app.use("/api/v1",router);
// app.use(errorHandler);


app.listen(process.env.PORT || 3000,()=>{
    console.log("port is listening");
    
})

