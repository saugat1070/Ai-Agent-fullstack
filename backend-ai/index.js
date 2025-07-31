import express from "express";
import cors from "cors"
import { connectDb } from "./models/connect.js";
import { envConfig } from "./config.js";
import userRouter from "./Routes/auth.route.js";
import ticketRouter from "./Routes/ticket.route.js";
import {serve} from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignUp } from "./inngest/functions/onSignUp.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";



const app =  express()

app.use(cors())
app.use(express.json())

connectDb(envConfig.urlDb)

app.use("/v1/api/auth/",userRouter);
app.use("/v1/api/ticket/",ticketRouter)

app.use("/v1/api/inngest",serve({
    client : inngest,
    functions : [onUserSignUp,onTicketCreated]
}))

app.listen(envConfig.portNumber || 8000,()=>{
    console.log(`server is running at ${envConfig.portNumber}`)
})
