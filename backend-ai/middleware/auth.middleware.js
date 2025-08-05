import jwt from "jsonwebtoken";
import { envConfig } from "../config.js";

export const authMiddleware = (req,res,next)=>{
    const auth = req.headers.authorization;
    const token = auth && req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message : "unauthorize",
        })
    }
    try {
        jwt.verify(token,envConfig.jwtSecret,(error,result)=>{
            if(error){
                return res.status(401).json({
                    error : error.message
                });
            }

            req.user = {
                _id : result._id
            }
            next()
        })
    
    } catch (error) {
        return res.json({message:"internal server error",
            error : error.message
        })
    }
}