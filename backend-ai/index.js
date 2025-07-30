import express from "express";
import cors from "cors"
import { connectDb } from "./models/connect.js";
import { envConfig } from "./config.js";
import userRouter from "./Routes/auth.route.js";

const app =  express()

app.use(cors())
app.use(express.json())

connectDb(envConfig.urlDb)

app.use("/v1/api/auth/",userRouter);

app.listen(envConfig.portNumber || 8000,()=>{
    console.log(`server is running at ${envConfig.portNumber}`)
})
