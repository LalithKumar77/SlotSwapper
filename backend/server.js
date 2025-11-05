import dotenv from 'dotenv';
dotenv.config(
    {
        override:true,
        path:'./.env'
    }
);
import express from 'express';
import cors from "cors";
import connectDB from './db/db.js';
import morganLogger from './middlewares/morganLogger.js';
import cookieParser from 'cookie-parser';
const app = express();

const PORT = process.env.PORT || 3000;


// cors options
// Build an explicit whitelist so we can respond with Access-Control-Allow-Origin
const allowedOrigins = [process.env.FRONTEND_URL, 'https://slotswapper-pi.vercel.app', 'http://localhost:5173'].filter(Boolean);
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
// Middleware
console.log("CORS Options:", corsOptions);
app.use(cors(
    corsOptions
));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morganLogger);

// Custom Middleware to log body (for testing purposes)
app.use((req, res, next) => {
    if (req.method !== 'OPTIONS' && req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', req.body);
    }
    next();
});

// Connect to Database
connectDB(); 

// Routes
app.get('/',(req,res)=>{
    res.status(200).json({message: "Slot Swapper API is running"});
})

import authRoute from "./routes/authRoute.js";
app.use('/api/auth',authRoute);

import eventRoute from "./routes/eventRoute.js";
app.use('/api/events',eventRoute);

import swapRoute from "./routes/swapRoute.js";
app.use('/api',swapRoute);

// Start Server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});