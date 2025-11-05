import express from "express";
import { createEvent, getMyEvents, updateEvent, deleteEvent } from "../controllers/eventController.js";
import  verifyTokens  from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/", verifyTokens, getMyEvents);
router.post("/", verifyTokens, createEvent);
router.put("/:id", verifyTokens, updateEvent);
router.delete("/:id", verifyTokens, deleteEvent);

export default router;
