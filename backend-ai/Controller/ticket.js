import { inngest } from "../inngest/client";
import Ticket from "../models/ticket.model";

export const createTicket = async (req,res)=>{
    try {
        const {title,description} = req.body
        if(!title || !description){
            return res.json({message : "titile and description must be provided"});

        }

        const newTicket = Ticket.create({
            title,
            description,
            createdBy : req.user._id.toString() 
        })

        await inngest.send({
            name : "ticket/created",
            data : {
                ticketId : (await newTicket)._id.toString(),
                title,
                description,
                createdBy : req.user._id.toString()
            }
        })
        return res.status()
    } catch (error) {
        
    }
}