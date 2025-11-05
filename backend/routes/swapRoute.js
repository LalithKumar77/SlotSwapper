import express from "express";
import  verifyTokens from "../middlewares/authMiddleware.js";
const router = express.Router();
import {
    getAllSwappableEventsHandler,
    swapRequestHandler,
    respondToSwapRequestHandler,
    getUserSwapRequestsHandler
} from "../controllers/swapController.js";

router.get('/swappable-slots', verifyTokens, getAllSwappableEventsHandler);
router.post('/swap-request', verifyTokens, swapRequestHandler);
router.post('/swap-response/:requestCode', verifyTokens, respondToSwapRequestHandler);
router.get('/swap-requests', verifyTokens, getUserSwapRequestsHandler);


export default router;