import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getTickets,getTicket, createTicket } from "../Controller/ticket.js";

const ticketRouter = express.Router();


ticketRouter.route("/").get(authMiddleware,getTickets).post(authMiddleware,createTicket)
ticketRouter.route("/:id").get(authMiddleware,getTicket)

export default ticketRouter;