import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./utils/dbConnect.js";
import userRoute from './router/user.route.js'
import postRoute from './router/post.route.js'
import messageRoute from './router/message.route.js'
import dotenv from "dotenv";
import {app, server} from "./utils/Socket.js"
import { startMessageConsumer } from "./utils/kafkaComsumer.js";


dotenv.config({});
dbConnect();

// const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    // httpOnly: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

startMessageConsumer();

app.get('/', (req, res)=>{
    res.status(200).json("Hello, from backend");
})

//API's
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

server.listen(PORT, ()=>{
    console.log(`Server listening to ${PORT}`);
})