import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
    urlDb : process.env.MONGO_URL,
    portNumber : process.env.PORT_NUMBER,
    jwtSecret : process.env.JWT_SECRET,
    geminiKey : process.env.GEMINI_API_KEY
}