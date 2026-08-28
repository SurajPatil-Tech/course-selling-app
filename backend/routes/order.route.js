import express from "express";
import { getOrderData } from "../controllers/order.controller.js";
import userMiddleware from "../middlewares/user.mid.js";

const router = express.Router();

// Get logged-in user's orders
router.get("/", userMiddleware, getOrderData);

export default router;