import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const mailSend = async (mailData) => {

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  try {
    await transport.sendMail(mailData);
    console.log("mail sended successfully")
  } catch (err) {
    console.log(`Sending message is fail,Error:${err.message}`)
  }
};

/* 

#format of data
{
from : "'Saugat Giri', <saugatgiri1070@gmail.com>",
to : "saugatgir@gmail.com",
subject : "Hello World",
text : "hello world",
html : "<b>helloe world</b>"
}

*/
