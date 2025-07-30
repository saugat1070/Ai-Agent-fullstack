import mongoose from "mongoose";



export const connectDb = async (urlDb)=>{
    await mongoose.connect(urlDb).then(()=>{
        console.log("Database connected successfully")
    }).catch((err)=>{
        console.log(`Database Error : ${err.message}`)
    })
}