import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({
    titile : {type:String},
    description : {type:String},
    status : {type:String,default:"TODO"},
    createdBy : {type:mongoose.Types.ObjectId,ref:"User"},
    assingedTo : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        default : null
    },
    priority : String,
    deadLine : Date,
    helpfulNotes : String,
    relatedSkils : [String],
},{
    timestamps : true
})

const Ticket = mongoose.model("Ticket",ticketSchema);
export default Ticket;