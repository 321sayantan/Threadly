import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createChat, getChatList } from "../controllers/conversation.controller.js";

const router = express.Router();

router.route("/getChatList").get(isAuthenticated, getChatList);
router.route("/createChat/:id").get(isAuthenticated, createChat);



export default router;