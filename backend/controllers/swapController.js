import Event from "../models/Event.js";
import SwapRequest from "../models/SwapRequest.js";
import User from "../models/user.js";

async function getAllSwappableEventsHandler(req,res) {
    try {
    const slots = await Event.find({
      status: "SWAPPABLE",
      userId: { $ne: req.user.id }, // exclude logged-in user's own events
    })
    .select("eventid title startTime endTime userId status")
    .populate("userId", "username gmail");

    res.status(200).json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching swappable slots" });
  }
}


async function swapRequestHandler(req, res) {
    try {
      const { mySlotId, theirSlotId } = req.body;

      const mySlot = await Event.findOne({ eventid: mySlotId, userId: req.user.id });
      const theirSlot = await Event.findOne({ eventid: theirSlotId });

      if (!mySlot || !theirSlot) {
        return res.status(404).json({ message: "One or both slots not found" });
      }

      if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") {
        return res.status(400).json({ message: "One or both slots are not swappable" });
      }

      const swapRequest = await SwapRequest.create({
        requesterId: req.user.id,
        receiverId: theirSlot.userId,
        mySlotId,
        theirSlotId,
      });

      // mark both slots as SWAP_PENDING
      mySlot.status = "SWAP_PENDING";
      theirSlot.status = "SWAP_PENDING";
      await mySlot.save();
      await theirSlot.save();

      res.status(201).json({ message: "Swap request created", requestCode : swapRequest.requestCode });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating swap request" });
  }
}


  async function respondToSwapRequestHandler(req, res) {    
    try {
      const { accept } = req.body;
      const { requestCode } = req.params;
      console.log(`Responding to requestCode: ${requestCode} with accept: ${accept}`);
      const request = await SwapRequest.findOne({ requestCode:requestCode });
      console.log(request);
      if (!request) return res.status(404).json({ message: "Swap request not found" });

      // Only the receiver can respond
      if (request.receiverId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to respond to this request" });
      }

      const mySlot = await Event.findOne({ eventid: request.mySlotId });
      const theirSlot = await Event.findOne({ eventid: request.theirSlotId });


      if (!mySlot || !theirSlot)
        return res.status(404).json({ message: "Slots not found" });

      if (!accept) {
        // REJECTED flow
        request.status = "REJECTED";
        await request.save();

        mySlot.status = "SWAPPABLE";
        theirSlot.status = "SWAPPABLE";
        await mySlot.save();
        await theirSlot.save();

        return res.status(200).json({ message: "Swap request rejected" });
      }

      // ACCEPTED flow
      request.status = "ACCEPTED";
      await request.save();

      // Swap ownership
      const tempUserId = mySlot.userId;
      mySlot.userId = theirSlot.userId;
      theirSlot.userId = tempUserId;

      mySlot.status = "BUSY";
      theirSlot.status = "BUSY";

      await mySlot.save();
      await theirSlot.save();

      res.status(200).json({ message: "Swap accepted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error responding to swap request" });
    }

  }




async function getUserSwapRequestsHandler(req, res) {
  try {
    const userId = req.user.id;

    const incomingRequests = await SwapRequest.find({ receiverId: userId })
      .populate("requesterId", "username")
      .populate("receiverId", "username")
      .lean();

    const outgoingRequests = await SwapRequest.find({ requesterId: userId })
      .populate("requesterId", "username")
      .populate("receiverId", "username")
      .lean();

    const allEventIds = [
      ...incomingRequests.map(r => r.mySlotId),
      ...incomingRequests.map(r => r.theirSlotId),
      ...outgoingRequests.map(r => r.mySlotId),
      ...outgoingRequests.map(r => r.theirSlotId),
    ];

    const events = await Event.find({ eventid: { $in: allEventIds } }).lean();


    const userIds = [...new Set(events.map(ev => ev.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("username")
      .lean();
    console.log(users);
  
    const eventMap = Object.fromEntries(events.map(ev => [ev.eventid, ev]));
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u.username]));

    const enrichEvent = ev => {
      if (!ev) return null;
      return {
        ...ev,
        username: userMap[ev.userId?.toString()] || "Unknown User",
      };
    };


    const formattedIncoming = incomingRequests.map(r => ({
      _id: r._id,
      requestCode: r.requestCode,
      status: r.status,
      mySlot: enrichEvent(eventMap[r.mySlotId]),
      theirSlot: enrichEvent(eventMap[r.theirSlotId]),
      createdAt: r.createdAt,
    }));

    const formattedOutgoing = outgoingRequests.map(r => ({
      _id: r._id,
      requestCode: r.requestCode,
      status: r.status,
      mySlot: enrichEvent(eventMap[r.mySlotId]),
      theirSlot: enrichEvent(eventMap[r.theirSlotId]),
      createdAt: r.createdAt,
    }));

    // Final response
    res.status(200).json({
      message: "Swap requests fetched successfully",
      incomingCount: formattedIncoming.length,
      outgoingCount: formattedOutgoing.length,
      data: {
        incoming: formattedIncoming,
        outgoing: formattedOutgoing,
      },
    });
  } catch (error) {
    console.error("Error fetching swap requests:", error);
    res.status(500).json({ message: "Server error while fetching swap requests" });
  }
}
export {
  getAllSwappableEventsHandler,
  swapRequestHandler,
  respondToSwapRequestHandler,
  getUserSwapRequestsHandler
};