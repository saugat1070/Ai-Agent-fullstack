import { NonRetriableError } from "inngest"
import User from "../../models/user.model.js"
import { inngest } from "../client.js"
import { mailSend } from "../../utils/mailer.js"

export const onUserSignUp = inngest.createFunction(
    {id: "on-user-signup",retries:2},
    {event : "user/singup"},
    async ({event,step})=>{
        try {
            const {email} = event.data
            const user = await step.run("get-user-email",async()=>{
                const userObject = await User.findOne({email})
                if(!userObject) throw new NonRetriableError("user no longer exists in our database");
                return userObject
            })

            await step.run("Send-welcome-email",async ()=>{
                const subject = `welcome to the app`;
                const message = `Hi \n\n\n thank you for signin`;
                await mailSend(user.email,subject,message)
            })
            return {success : true}
        } catch (error) {
            console.log(`Error running step: ${error.message}`)
        }
    }
) 