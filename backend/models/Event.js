  import mongoose from "mongoose";
  import { nanoid } from "nanoid";
  const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    eventid:{
      type: String,
      unique: true,
      default: () => nanoid(7),
    },
    description: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"],
      default: "BUSY",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
