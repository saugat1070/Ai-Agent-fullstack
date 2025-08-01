import dotenv from "dotenv";
dotenv.config({
    path : ['.env.local']
});

export const envConfig = {
    urlDb : process.env.MONGO_URL,
    portNumber : process.env.PORT_NUMBER,
    jwtSecret : process.env.JWT_SECRET,
    geminiKey : process.env.GEMINI_API_KEY
}