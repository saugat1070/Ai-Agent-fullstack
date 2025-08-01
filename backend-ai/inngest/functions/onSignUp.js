import { NonRetriableError } from "inngest"
import User from "../../models/user.model.js"
import { inngest } from "../client.js"
import { mailSend } from "../../utils/mailer.js"

export const onUserSignUp = inngest.createFunction(
    {id: "on-user-signup",retries:2},
    {event : "user/signup"},
    async ({event, step})=>{
        try {
            console.log("I am at onUserSignup")
            const {email} = event.data
            const user = await step.run("get-user-email",async()=>{
                const userObject = await User.findOne({email:email})
                if(!userObject) throw new NonRetriableError("user no longer exists in our database");
                return userObject
            })
            console.log(user)
            await step.run("Send-welcome-email",async ()=>{
                const subject = `welcome to the app`;
                const message = `Hi \n\n\n thank you for signin`;
                const mailData = {
                    from : "saugatgiri1070@gmail.com",
                    to : user.email,
                    subject : subject,
                    text : message
                }
                await mailSend(mailData)
            })
            return {success : true}
        } catch (error) {
            console.log(`Error running step: ${error.message}`)
        }
    }
) 