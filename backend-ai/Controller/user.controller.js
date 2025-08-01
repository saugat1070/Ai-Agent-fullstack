import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js";
import { envConfig } from "../config.js";


export const signUp = async (req,res)=>{
    const {email,password,skills = []} = req.body;
    const existenceUser = await User.findOne({email:email})
    if(existenceUser){
        res.status(405).json({
            message : "User with this email is already created"
        });
        return
    }
    try {
        const user = await User.create({
            ...req.body,
            password : bcrypt.hashSync(password,10)
        });

        //fire inngest event

        /* try {
            await inngest.send({
            name : "user/signup",
            data : {
                email,
            },
        });
        } catch (error) {
            console.log("Iggnest time out\n",error.message)
        } */

        // if(!mailSend){
        //     res.json({"message":"mail Send doesn't success"})
        // }

        // const token = jwt.sign({
        //     _id : User?._id
        // },envConfig.jwtSecret,{
        //     expiresIn : "7d"
        // })

        res.status(200).json({
            message : "user register success",
            data : user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error : "signup failed",
            details : error.message
        })
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body
    
    try {
        const existenceUser = await User.findOne({email:email});
        console.log(existenceUser)
        if(!existenceUser){
            res.status(404).json({
                message : "user with this email is not found,create account first"
            });
            return;
        }

        const isPassword = bcrypt.compareSync(password,existenceUser?.password);
        if(!isPassword){
            return res.status(401).json({
                error : "invalid credientials"
            })
        }

        const token = jwt.sign({_id : existenceUser._id,
            role : existenceUser.role
        },envConfig.jwtSecret,{
            expiresIn : '7d'
        })

        res.status(200).json({
            sucess : true,
            token : token
        })
    } catch (error) {
        return res.status(500).json({
            error : "signup failed",
            details : error.message
        })
    }
}

export const logout = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    if(!token){
        return res.status(401).json({
            error : "unauthorized"
        })
    }
    jwt.verify(token,envConfig.jwtSecret,(err,decoded)=>{
            if(err){
                return res.status(401).json({
                    error : "unauthorized"
                })
            }
            res.json()
        })
}

export const updateUser = async (req,res)=>{
    const {skils,role,email} = req.body
    try {
        if(req.user?.role !== "admin"){
            return res.status(403).json({
                error : "forbidden, only admin can update"
            })
        }
        const user = await User.findOne({email:email});
        if(!user) return res.status(404).json({error : "user is not found"});

        await User.updateOne({email : email},{
            skils : skils.length ? skils: user.skils,role
        })
        res.status(200).json({
            message : "user update successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error : error.message
        })
    }
}

export const getUser = async (req,res)=>{
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({
                message : "only admin have access on it"
            })
        }
        const user = await User.find().select("-password");
        return res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({
            error : error.message
        })
        
    }
}