import express from "express";
import { markAttended } from "../controllers/userControllers.js";

const router = express.Router();

// Attendance route
router.post("/attendance", markAttended);

export default router;