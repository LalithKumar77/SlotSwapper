import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    gmail:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    // refreshToken: {
    //   type: String,
    //   default: null,
    // },
    // Support multiple refresh tokens (one per device/session)
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model("User", userSchema);

export default User;