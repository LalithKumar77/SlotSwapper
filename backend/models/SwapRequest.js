import mongoose from "mongoose";
import { nanoid } from "nanoid";
const swapRequestSchema = new mongoose.Schema({
  requestCode :{
     type : String,
     default : () => nanoid(6),
      unique : true
  },
  requesterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
     required: true
     }, 
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
    }, 

  mySlotId: { 
    type: String,
    required: true 
  },
  theirSlotId: { 
    type: String,
    required: true 
  },

  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING",
  }, 
}, { timestamps: true }
);

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
export default SwapRequest;
