import express from "express";
import verifyTokens from "../middlewares/authMiddleware.js";
import {
    createUserHandler,
    loginHandler,
    updatePassword,
    signoutHandler
} from "../controllers/authController.js";

const router = express.Router();



router.post('/register', createUserHandler);
router.post('/login', loginHandler);
router.post('/logout', signoutHandler);
router.put('/update-password', verifyTokens,updatePassword);


export default router;