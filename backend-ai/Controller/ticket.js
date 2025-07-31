import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.json({ message: "titile and description must be provided" });
    }

    const newTicket = Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: (await newTicket)._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });
    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: " internal server error",
      error: error.message,
    });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    }else{
       tickets =  await Ticket.find({createdBy:req.user._id})
        .select("ititle description status createdAt")
        .sort({createdAt : -1})
    }

    return res.status(200).json({tickets});
  } catch (error) {
    return res.status(500).json({
      message: " internal server error",
      error: error.message,
    });
    
  }
};

export const getTicket = async (req,res)=>{
    let ticket;
    try {
        if(!req.user){
            return res.status(401).json({
                error : "authorization first"
            });
        }
        if(req.user.role !== "user"){
           ticket = Ticket.findById(req.params.id).populate("assignedTo",["email","id"])
        }else{
            ticket = Ticket.findOne({createdBy : req.user._id,
                _id : req.params.id
            }).select("title description status createdAt")
        }
        
        if(!ticket){
            return res.status(404).json({
            message : "Ticket not found"
            })
        }
    } catch (error) {
    return res.status(500).json({
      message: " internal server error",
      error: error.message,
    });
    
    }
}