import User from "../models/user.js";
import argon2 from "argon2";
import { generateToken } from "../utils/jwtUtils.js"



 async function createUserHandler(req, res) {
    const { username, password, gmail } = req.body;

    if (!username || !password || !gmail) {
        return res.status(400).json({ error: "Username, password and gmail are required" });
    }
    try {
        const user = await User.findOne({ username });
        if (user) {
            console.log(`User already exists: ${username}`);
            return res.status(400).json({ error: "User already exists" });
        }
        const gmailExists = await User.findOne({ gmail });
        if (gmailExists) {
            console.log(`Gmail already exists: ${gmail}`);
            return res.status(400).json({ error: "Gmail already exists" });
        }

        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id
        });

        const newUser = new User({
            username,
            gmail,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "user created successfully",
            user: newUser // for temporary
        });

    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


async function loginHandler(req, res) {
    const { gmail, password } = req.body;
    console.log("Login attempt with gmail:", gmail);
    if (!gmail || !password) {
        return res.status(400).json({ error: "Gmail and password are required" });
    }
    try {
        const user = await User.findOne({ gmail });
        if (!user) {
            return res.status(401).json({ error: "Invalid gmail" });
        }
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const payload = {
            id: user._id,
            username: user.username,
            gmail: user.gmail
        };
        const accessToken = generateToken(payload, process.env.JWT_SECRET, '15m');
        const refreshToken = generateToken(payload, process.env.JWT_REFRESH_SECRET, '7d');

        // store refresh token in user's refreshTokens array (one entry per device/session)
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push({
            token: refreshToken,
            createdAt: Date.now(),
        });
        await user.save();

        const isProd = process.env.PRODUCTION === 'true';
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProd,
            maxAge: 15 * 60 * 1000,
            sameSite: isProd ? 'none' : 'lax'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: isProd ? 'none' : 'lax'
        });
        const userObj = {
            id : user._id,
            username: user.username,
            gmail: user.gmail
        };
        return res.status(200).json({
            message: "Login successful",
            user: userObj
        });
    } catch (err) {
        console.log("Error during login:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}


async function updatePassword(req,res) {
    console.log('Update password request received');
    try{
        const {password,newPassword} = req.body;
        const userId = req.user.id;
        if(!password)
                return res.status(400).json({ message: 'Password is required' });
        if(!userId)
                return res.status(400).json({ message: 'User ID is required' });
        const user = await User.findById(userId);
        if(!user)
                return res.status(404).json({ message: 'User not found' });
        const check = await argon2.verify(user.password, password);
        if(!check)
                return res.status(401).json({ message: 'Invalid password' });
        const hashNewPassword = await argon2.hash(newPassword,{
            type: argon2.argon2id
        });
        user.password = hashNewPassword;
        await user.save();
        console.log('password updated successfully');
        return res.status(200).json({ message: 'Password updated successfully' });
    }catch(error){
        console.log('Error updating password:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function signoutHandler(req,res){
    try {
        // Check and remove refresh token from DB
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await User.updateOne(
                { 'refreshTokens.token': refreshToken },
                { $pull: { refreshTokens: { token: refreshToken } } }
            );
        }
        // Clear cookies (match options used when setting them)
        const isProd = process.env.PRODUCTION === 'true';
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax'
        });
        return res.status(200).json({ message: "Sign out Successfully done" });
    } catch (error) {
        console.error('Signout error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
 }



export {
    createUserHandler,
    loginHandler,
    updatePassword,
    signoutHandler,
};