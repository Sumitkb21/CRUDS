import express from "express"
import { config } from "dotenv";
import UserRouter from "./routes/user.js";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";


config({
    path: "./data/config.env"
})


//using middlewares  
app.use(express.json())
app.use(cors({
    
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,

}));
app.use(cookieParser());


//importing Routes
app.use("/api/v1/task", UserRouter);
