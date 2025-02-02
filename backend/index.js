import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./utils/dbConnect.js";
import userRoute from './router/user.route.js'
import postRoute from './router/post.route.js'
import dotenv from "dotenv";
dotenv.config({});
dbConnect();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
app.use(cors({
    origin:"*",
    credentials: true,
}))

app.get('/', (req, res)=>{
    res.status(200).json("Hello, from backend");
})

//API's
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);

app.listen(PORT, ()=>{
    console.log(`Server listening to ${PORT}`);
})