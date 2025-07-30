import express from "express";
import { getUser, login, logout, signUp, updateUser } from "../Controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.route("/signup").post(signUp)
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);

userRouter.route("/update-user").post(authMiddleware,updateUser);
userRouter.route("/getuser").post(authMiddleware,getUser);


export default userRouter;